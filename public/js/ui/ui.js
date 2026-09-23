function escapeHtml(value) {
    return String(value ?? "").replace(
        /[&<>"']/g,
        (char) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[char]
    );
}

export function renderItems(items, container) {
    if (items.length === 0) {
        container.innerHTML = `
            <p class="text-center text-sm text-slate-400" style="grid-column: 1 / -1; padding: 2rem;">
                Todavía no hay items registrados.
            </p>`;
        return;
    }

    container.innerHTML = items
        .map(
            (item) => `
            <article class="card" data-id="${item.id}">
                ${
                    item.imageUrl
                        ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" class="card-image">`
                        : `<div class="card-image" style="display:flex;align-items:center;justify-content:center;background:var(--color-surface-alt);border-radius:6px;font-size:2rem;">📦</div>`
                }
                <div class="card-container">
                    <span class="badge">${escapeHtml(item.category) || "General"}</span>
                    <h2 class="name" style="font-size: 1.15rem; font-weight: 700; margin: 6px 0 2px;">
                        ${escapeHtml(item.name)}
                    </h2>
                    <p class="description" style="font-size: 0.85rem; color: var(--color-text-secondary); flex-grow: 1;">
                        ${escapeHtml(item.description) || "—"}
                    </p>
                    <p class="price">$${Number(item.price || 0).toFixed(2)}</p>
                    <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 10px;">
                        Stock: ${item.stock ?? 0} | Fecha: ${item.date || "—"}
                    </p>
                    <div style="display: flex; gap: 8px; margin-top: auto;">
                        <button type="button" class="btn-edit" data-id="${item.id}">Editar</button>
                        <button type="button" class="btn-delete" data-id="${item.id}">Eliminar</button>
                    </div>
                </div>
            </article>`
        )
        .join("");
}

export function resetForm(form, submitBtn, cancelBtn) {
    form.reset();
    if (submitBtn) submitBtn.textContent = "Agregar";
    if (cancelBtn) cancelBtn.hidden = true;
}

export function fillForm(form, item, submitBtn, cancelBtn) {
    form.querySelector("#name").value = item.name;
    form.querySelector("#description").value = item.description || "";
    form.querySelector("#price").value = item.price;
    form.querySelector("#category").value = item.category;
    form.querySelector("#stock").value = item.stock;
    form.querySelector("#date").value = item.date;
    form.querySelector("#imageUrl").value = item.imageUrl || "";
    form.querySelector("#name").focus();
    if (submitBtn) submitBtn.textContent = "Guardar cambios";
    if (cancelBtn) cancelBtn.hidden = false;
}

/**
 * Aviso flotante que reemplaza los alert(). No bloquea la página y se ve como una app de verdad.
 */
export function showToast(message, type = "error") {
    const colors = {
        error: "bg-red-600",
        success: "bg-emerald-600"
    };

    const toast = document.createElement("div");
    toast.className = `fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-2 text-sm
        font-medium text-white shadow-lg transition-opacity ${colors[type]}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => (toast.style.opacity = "0"), 2200);
    setTimeout(() => toast.remove(), 2600);
}