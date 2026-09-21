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

export function renderItems(items, tableBody) {
    if (items.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="px-4 py-10 text-center text-sm text-slate-400">
                    Todavía no hay items. Agrega el primero con el formulario de arriba.
                </td>
            </tr>`;
        return;
    }

    tableBody.innerHTML = items
        .map(
            (item) => `
            <tr>
                <td class="px-4 py-3 font-mono text-xs text-slate-400">${item.id}</td>
                <td class="px-4 py-3 font-medium">${escapeHtml(item.name)}</td>
                <td class="px-4 py-3 text-slate-500">${escapeHtml(item.description) || "—"}</td>
                <td class="px-4 py-3 text-slate-500">${escapeHtml(item.price) || "—"}</td>
                <td class="px-4 py-3 text-slate-500">${escapeHtml(item.category) || "—"}</td>
                <td class="px-4 py-3 text-slate-500">${escapeHtml(item.stock) || "—"}</td>
                <td class="px-4 py-3 text-slate-500">${escapeHtml(item.date) || "—"}</td>
                <td class="px-4 py-3">
                    ${
                        item.imageUrl
                            ? `<img 
                                src="${escapeHtml(item.imageUrl)}" 
                                alt="${escapeHtml(item.name)}"
                                style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;"
                            >`
                            : "—"
                    }
                </td>
                <td class="px-4 py-3">
                    <div class="flex justify-end gap-2">
                        <button class="btn btn-edit" data-id="${item.id}"> Editar</button>
                        <button class="btn btn-delete" data-id="${item.id}">Eliminar</button>
                    </div>
                </td>
            </tr>`
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