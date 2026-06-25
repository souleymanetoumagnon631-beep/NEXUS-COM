import Dexie from 'dexie';

export const db = new Dexie('NexusLocalDB');

// Define database schema mirroring the Supabase structure
db.version(1).stores({
  products: 'id, user_id, name, created_at',
  sales: 'id, user_id, product_id, client_id, sale_date, created_at',
  clients: 'id, user_id, name, phone, created_at',
  livraisons: 'id, user_id, client_id, product_id, status, delivery_date, created_at',
  projects: 'id, user_id, product_id, status, created_at',
  tasks: 'id, user_id, project_id, status, created_at',
  ideas: 'id, user_id, status, created_at',
  fixed_expenses: 'id, user_id, name, created_at',
  marketing_data: 'id, user_id, product_id, created_at',
  marketing_angles: 'id, user_id, product_id, created_at',
  marketing_scripts: 'id, user_id, product_id, angle_id, created_at',
  marketing_copies: 'id, user_id, product_id, angle_id, created_at',
  saved_offers: 'id, user_id, product_id, created_at',
  
  // Local queue for offline modifications
  sync_queue: '++id, table, action, recordId, timestamp'
});

// Helper function to clear all local data on logout
export async function clearLocalData() {
  await db.transaction('rw', db.tables, async () => {
    for (const table of db.tables) {
      await table.clear();
    }
  });
}
