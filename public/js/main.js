import { getItems, getItem, createItem, updateItem, deleteItem } from "./services/api.js";
import { renderItems, resetForm, fillForm, showToast } from "./ui/ui.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("itemForm");
    const tableBody = document.getElementById("itemsTable");
    const submitBtn = document.getElementById("submitBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    if (!form || !tableBody || !submitBtn) {
        console.error("Faltan elementos del DOM: itemForm, itemsTable o submitBtn.");
        return;
    }

    let editingId = null;

    /** Vuelve al modo "crear". */
function stopEditing() {
    editingId = null;
    // Quita el modo edición del grid y las tarjetas
    tableBody.classList.remove("is-editing");
    tableBody.querySelectorAll(".card").forEach(c => c.classList.remove("selected-for-edit"));
    form.classList.remove("is-editing");
    if (cancelBtn) {
        resetForm(form, submitBtn, cancelBtn);
    } else {
        form.reset();
        submitBtn.textContent = "Agregar item";
    }
}

    // Eventos de tabla (delegación: un solo listener para todas las filas)
    tableBody.addEventListener("click", async (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const id = Number(btn.dataset.id);
        if (!Number.isFinite(id)) return;

        if (btn.classList.contains("btn-delete")) {
            try {
                await deleteItem(id);
                if (editingId === id) stopEditing();
                showToast("Item eliminado", "success");
                loadItems();
            } catch (err) {
                console.error("Error eliminando:", err);
                showToast(err.message);
            }
        }  else if (btn.classList.contains("btn-edit")) {
    try {
        if (editingId === id) {
            stopEditing();
            return;
        }
        const item = await getItem(id);
        fillForm(form, item, submitBtn, cancelBtn);
        editingId = id;
        // Activa el modo edición y marca la tarjeta seleccionada
        tableBody.classList.add("is-editing");
        tableBody.querySelectorAll(".card").forEach(card => {
            card.classList.toggle("selected-for-edit", Number(card.dataset.id) === id);
        });
        form.classList.add("is-editing");
    } catch (err) {
        console.error("Error cargando item:", err);
        showToast(err.message);
    }
}
    });

    if (cancelBtn) {
        cancelBtn.addEventListener("click", stopEditing);
    }

    // Envío del form
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = form.querySelector("#name").value.trim();
        const description = form.querySelector("#description").value.trim();
        const price = parseFloat(form.querySelector("#price").value);
        const category = form.querySelector("#category").value;
        const stock = parseInt(form.querySelector("#stock").value, 10);
        const date = form.querySelector("#date").value;
        const imageUrl = form.querySelector("#imageUrl").value.trim();

        if (!name) {
            showToast("El campo nombre es obligatorio");
            return;
        }

        try {
            if (editingId) {
                await updateItem(editingId, { name, description, price, category, stock, date, imageUrl });
                showToast("Cambios guardados", "success");
            } else {
                await createItem({ name, description, price, category, stock, date, imageUrl });
                showToast("Item agregado", "success");
            }

            stopEditing();
            loadItems();
        } catch (err) {
            console.error("Error guardando item:", err);
            showToast(err.message);
        }
    });

    // Cargar al inicio
    async function loadItems() {
        try {
            const items = await getItems();
            renderItems(items, tableBody);
        } catch (err) {
            console.error("Error cargando lista:", err);
            showToast(err.message);
        }
    }

    loadItems();
});