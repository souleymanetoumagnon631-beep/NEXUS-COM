// ══════════════════════════════════════════
//   NEXUS — State Proxy
//   [CORRIGÉ 3.3] Détection automatique des changements
//   Émet des événements quand les données mutent
// ══════════════════════════════════════════

const StateProxy = (() => {
  'use strict';

  const listeners = new Map(); // event → [callbacks]
  let enabled = false;

  function on(event, callback) {
    if (!listeners.has(event)) listeners.set(event, []);
    listeners.get(event).push(callback);
  }

  function off(event, callback) {
    if (!listeners.has(event)) return;
    const cbs = listeners.get(event).filter(cb => cb !== callback);
    listeners.set(event, cbs);
  }

  function emit(event, data) {
    if (!enabled) return;
    const cbs = listeners.get(event) || [];
    cbs.forEach(cb => {
      try { cb(data); } catch (e) { console.error('[StateProxy]', e); }
    });
  }

  // Créer un Proxy pour un tableau
  function createArrayProxy(arr, entityType) {
    return new Proxy(arr, {
      set(target, prop, value) {
        const oldLen = target.length;
        target[prop] = value;

        // Détecter les mutations courantes
        if (prop === 'length') {
          emit('change', { type: 'array-length', entity: entityType, old: oldLen, new: value });
        } else if (prop === 'push' || prop === 'unshift') {
          emit('change', { type: 'array-add', entity: entityType });
        } else if (prop === 'pop' || prop === 'shift' || prop === 'splice') {
          emit('change', { type: 'array-remove', entity: entityType });
        }

        return true;
      },
    });
  }

  // Wrapper une méthode de mutation de State
  function wrapMutation(fn, entityType, action) {
    return function (...args) {
      const result = fn.apply(this, args);
      emit('change', { type: action, entity: entityType, args });
      return result;
    };
  }

  // Activer le proxy sur State
  function enable() {
    if (enabled) return;
    enabled = true;

    // Wrapper les méthodes de mutation
    const mutations = {
      addProduct:    'add',
      updateProduct: 'update',
      removeProduct: 'remove',
      addSale:       'add',
      removeSale:    'remove',
      addClient:     'add',
      updateClient:  'update',
      removeClient:  'remove',
      addLivraison:  'add',
      updateLivraison: 'update',
      removeLivraison: 'remove',
      addProject:    'add',
      updateProject: 'update',
      removeProject: 'remove',
      addTask:       'add',
      updateTask:    'update',
      removeTask:    'remove',
      addIdea:       'add',
      updateIdea:    'update',
      removeIdea:    'remove',
      addExpense:    'add',
      updateExpense: 'update',
      removeExpense: 'remove',
      addAngle:      'add',
      removeAngle:   'remove',
      addScript:     'add',
      removeScript:  'remove',
      addCopy:       'add',
      removeCopy:    'remove',
      addOffer:      'add',
      removeOffer:   'remove',
    };

    Object.entries(mutations).forEach(([method, action]) => {
      if (State[method]) {
        const entityType = method.replace(/^(add|update|remove)/, '').toLowerCase();
        State[method] = wrapMutation(State[method], entityType, action);
      }
    });

    console.log('[StateProxy] Activé — détection des changements active');
  }

  function disable() {
    enabled = false;
    console.log('[StateProxy] Désactivé');
  }

  function isEnabled() {
    return enabled;
  }

  // Debug : logger tous les changements
  function debug(enable = true) {
    if (enable) {
      on('change', (data) => console.log('[StateProxy]', data.type, data.entity, data.args));
    } else {
      listeners.clear();
    }
  }

  return {
    on, off, emit, enable, disable, isEnabled, debug, createArrayProxy
  };
})();

window.StateProxy = StateProxy;