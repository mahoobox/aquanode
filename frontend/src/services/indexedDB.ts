import { openDB } from "idb";

const DB_NAME = "offline-events-db";
const STORE_NAME = "pendingUpdates";

export const getDB = () =>
    openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        },
    });

export const saveUpdateOffline = async (update: {
    id: number;
    data: any;
}) => {
    const db = await getDB();
    await db.put(STORE_NAME, {
        ...update,
        timestamp: Date.now(),
    });
};

export const syncPendingUpdates = async (syncFn: (id: number, data: any) => Promise<any>) => {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const updates = await store.getAll();

    for (const update of updates) {
        try {
            await syncFn(update.id, update.data);
            await store.delete(update.id);
        } catch (err) {
            console.warn("Error sincronizando", update.id, err);
        }
    }
};
