import { db } from './localDb';
import { supabase } from './supabaseClient';

let syncInterval = null;
let realtimeChannel = null;
let currentUserId = null;
let isSyncing = false;

export const syncEngine = {
  async start(userId) {
    if (!userId) return;
    currentUserId = userId;

    console.log('[SyncEngine] Démarrage pour l\'utilisateur :', userId);

    // 1. Lancer la première synchronisation Inbox (Serveur -> Local)
    try {
      await syncEngine.syncInbox();
    } catch (err) {
      console.warn('[SyncEngine] Première synchro Inbox échouée (mode hors-ligne possible) :', err);
    }

    // 2. Traiter les modifications en attente dans la file d'attente (Local -> Serveur)
    await syncEngine.syncOutbox();

    // 3. Configurer l'écouteur de connectivité réseau
    window.addEventListener('online', syncEngine.handleOnline);
    window.addEventListener('offline', syncEngine.handleOffline);

    // 4. Configurer la boucle de synchronisation périodique (toutes les 60 secondes)
    syncInterval = setInterval(() => {
      syncEngine.syncOutbox();
    }, 60000);

    // 5. S'abonner aux changements Realtime Supabase
    syncEngine.subscribeRealtime(userId);
  },

  stop() {
    console.log('[SyncEngine] Arrêt du moteur.');
    if (syncInterval) {
      clearInterval(syncInterval);
      syncInterval = null;
    }
    window.removeEventListener('online', syncEngine.handleOnline);
    window.removeEventListener('offline', syncEngine.handleOffline);

    if (realtimeChannel) {
      realtimeChannel.unsubscribe();
      realtimeChannel = null;
    }
    currentUserId = null;
  },

  handleOnline() {
    console.log('[SyncEngine] Réseau rétabli. Lancement de la synchronisation.');
    syncEngine.syncOutbox();
    syncEngine.syncInbox();
  },

  handleOffline() {
    console.log('[SyncEngine] Connexion perdue. Passage en mode hors-ligne.');
  },

  // --- LOCAL TO SERVER (Outbox) ---
  async syncOutbox() {
    if (isSyncing) return;
    if (!navigator.onLine) return;

    isSyncing = true;
    try {
      const queue = await db.sync_queue.orderBy('id').toArray();
      if (queue.length === 0) {
        isSyncing = false;
        return;
      }

      console.log(`[SyncEngine] Envoi de ${queue.length} modification(s) locale(s) vers Supabase...`);

      for (const item of queue) {
        const { id, table, action, recordId, payload } = item;
        let error = null;

        try {
          if (action === 'INSERT') {
            const { error: err } = await supabase
              .from(table)
              .insert({ ...payload, id: recordId });
            error = err;
          } else if (action === 'UPDATE') {
            const { error: err } = await supabase
              .from(table)
              .update(payload)
              .eq('id', recordId);
            error = err;
          } else if (action === 'DELETE') {
            const { error: err } = await supabase
              .from(table)
              .delete()
              .eq('id', recordId);
            error = err;
          }

          if (error) {
            console.error(`[SyncEngine] Erreur lors de la synchronisation de ${table} (${action}) :`, error);
            // Si c'est une erreur réseau, on arrête le traitement de la file pour retenter plus tard
            if (error.message?.includes('Fetch') || error.status === 0 || error.code === 'PGRST100') {
              break;
            }
            // Sinon (ex: violation de contrainte, RLS), on retire de la file pour éviter de bloquer indéfiniment
            await db.sync_queue.delete(id);
          } else {
            // Succès : on retire l'élément de la file d'attente
            await db.sync_queue.delete(id);
            console.log(`[SyncEngine] Synchro réussie pour ${table} (${action}) : ${recordId}`);
          }
        } catch (err) {
          console.error('[SyncEngine] Erreur inattendue dans la boucle outbox :', err);
          break;
        }
      }
    } finally {
      isSyncing = false;
    }
  },

  // --- SERVER TO LOCAL (Inbox) ---
  async syncInbox() {
    if (!navigator.onLine || !currentUserId) return;

    console.log('[SyncEngine] Récupération des données fraîches depuis Supabase...');

    const tablesToSync = [
      'products', 'sales', 'clients', 'livraisons', 'projects',
      'tasks', 'ideas', 'fixed_expenses', 'marketing_data',
      'marketing_angles', 'marketing_scripts', 'marketing_copies',
      'saved_offers'
    ];

    for (const table of tablesToSync) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('user_id', currentUserId);

        if (error) {
          console.error(`[SyncEngine] Impossible de récupérer la table ${table} :`, error);
          continue;
        }

        if (data) {
          // Mettre à jour la base de données locale Dexie de manière transactionnelle
          await db.transaction('rw', db[table], async () => {
            // Récupérer les IDs locaux existants pour savoir s'il faut supprimer des éléments effacés côté serveur
            const localRecords = await db[table].toArray();
            const localIds = localRecords.map(r => r.id);
            const serverIds = data.map(r => r.id);

            // Supprimer localement les éléments qui ne sont plus sur le serveur (suppressions à distance)
            const idsToDelete = localIds.filter(id => !serverIds.includes(id));
            if (idsToDelete.length > 0) {
              await db[table].bulkDelete(idsToDelete);
            }

            // Mettre à jour ou insérer les éléments du serveur
            await db[table].bulkPut(data);
          });
        }
      } catch (err) {
        console.error(`[SyncEngine] Erreur de traitement Inbox pour la table ${table} :`, err);
      }
    }

    console.log('[SyncEngine] Synchronisation Inbox terminée.');
  },

  // --- REALTIME ---
  subscribeRealtime(userId) {
    if (realtimeChannel) {
      realtimeChannel.unsubscribe();
    }

    // Un canal par utilisateur pour écouter toutes les tables en temps réel
    realtimeChannel = supabase
      .channel(`sync-user-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', filter: `user_id=eq.${userId}` }, async (payload) => {
        const { table, eventType, new: newRecord, old: oldRecord } = payload;
        
        console.log(`[SyncEngine Realtime] Événement ${eventType} reçu sur la table ${table}`);

        try {
          if (eventType === 'INSERT' || eventType === 'UPDATE') {
            await db[table].put(newRecord);
          } else if (eventType === 'DELETE') {
            await db[table].delete(oldRecord.id);
          }
        } catch (err) {
          console.error(`[SyncEngine Realtime] Erreur lors de l'application du changement realtime pour ${table} :`, err);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[SyncEngine Realtime] ✓ Écoute active des modifications serveur');
        }
      });
  },

  // Méthode utilitaire pour enregistrer une modification locale et planifier sa synchro
  async queueChange(table, action, recordId, payload = null) {
    // 1. Enregistrer dans Dexie localement d'abord pour un affichage instantané
    try {
      if (action === 'INSERT' || action === 'UPDATE') {
        const record = { ...payload, id: recordId, user_id: currentUserId, updated_at: new Date().toISOString() };
        if (action === 'INSERT') {
          record.created_at = new Date().toISOString();
        }
        await db[table].put(record);
      } else if (action === 'DELETE') {
        await db[table].delete(recordId);
      }

      // 2. Ajouter à la file d'attente de synchronisation
      await db.sync_queue.add({
        table,
        action,
        recordId,
        payload: action === 'DELETE' ? null : payload,
        timestamp: Date.now()
      });

      // 3. Déclencher immédiatement la synchro outbox en arrière-plan
      syncEngine.syncOutbox();
    } catch (err) {
      console.error('[SyncEngine] Erreur lors de l\'enregistrement local :', err);
      throw err;
    }
  }
};
