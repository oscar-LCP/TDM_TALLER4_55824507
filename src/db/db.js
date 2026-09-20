import path from "node:path";
import { JSONFilePreset } from "lowdb/node";

const DATA_PATH = path.join(import.meta.dirname, "..", "data", "items.json");

// Si el archivo no existe, lowdb lo crea con este contenido por defecto.
const defaultData = { items: [] };

export const db = await JSONFilePreset(DATA_PATH, defaultData);

/** Devuelve todos los items. */
export function getAllItems() {
    return db.data.items;
}

/** Busca un item por id. Devuelve undefined si no existe. */
export function findItem(id) {
    return db.data.items.find((item) => item.id === id);
}

/** Crea un item y lo persiste. */
export async function insertItem({ name, description, price, category, stock, date, imageUrl }) {
    const item = { id: Date.now(), name, description: description ?? "", price, category, stock, date, imageUrl };
    // db.update() modifica los datos y escribe el archivo en una sola operación.
    await db.update((data) => data.items.push(item));
    return item;
}

/** Actualiza un item existente. Devuelve null si no existe. */
export async function modifyItem(id, changes) {
    const index = db.data.items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updated = { ...db.data.items[index], ...changes, id };
    await db.update((data) => {
        data.items[index] = updated;
    });
    return updated;
}

/** Elimina un item. Devuelve true si se eliminó algo. */
export async function removeItem(id) {
    const index = db.data.items.findIndex((item) => item.id === id);
    if (index === -1) return false;

    await db.update((data) => data.items.splice(index, 1));
    return true;
}