import { Router } from "express";
import { getAllItems, findItem, insertItem, modifyItem, removeItem } from "../db/db.js";
import { validateItem } from "../middlewares/validate.js";
const router = Router();

router.param("id", (req, res, next, value) => {
    const id = Number(value);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "El id debe ser un número entero" });
    }
    req.itemId = id;
    next();
});

// GET /api/items
router.get("/", (req, res) => {
    res.json(getAllItems());
});

// GET /api/items/:id
router.get("/:id", (req, res) => {
    const item = findItem(req.itemId);
    if (!item) return res.status(404).json({ error: "Item no encontrado" });
    res.json(item);
});

// POST /api/items
router.post("/", async (req, res) => {
    console.log("========== POST ==========");
    console.log("BODY COMPLETO:", req.body);

    const nuevo = await insertItem(req.body);

    console.log("ITEM QUE DEVUELVE DB:", nuevo);

    res.status(201).json(nuevo);
});

// PUT /api/items/:id
router.put("/:id", async (req, res) => {
    const { name, description, price, category, stock, date, imageUrl } = req.body ?? {};

    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
        return res.status(400).json({ error: "El campo 'name' no puede quedar vacío" });
    }

    const changes = {};

    if (name !== undefined) changes.name = name.trim();

    if (description !== undefined) {
        changes.description = typeof description === "string" ? description.trim() : description ?? "";
    }

    if (price !== undefined) {
        changes.price = price;
    }

    if (category !== undefined) {
        changes.category = category;
    }

    if (stock !== undefined) {
        changes.stock = stock;
    }

    if (date !== undefined) {
        changes.date = date;
    }

    if (imageUrl !== undefined) {
        changes.imageUrl = imageUrl;
    }

    const actualizado = await modifyItem(req.itemId, changes);
    if (!actualizado) return res.status(404).json({ error: "Item no encontrado" });
    res.json(actualizado);
});

// DELETE /api/items/:id
router.delete("/:id", async (req, res) => {
    const eliminado = await removeItem(req.itemId);
    if (!eliminado) return res.status(404).json({ error: "Item no encontrado" });
    res.json({ mensaje: "Item eliminado", id: req.itemId });
});

export default router;