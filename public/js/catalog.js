// Script base para la vista de catálogo
// Aquí deben consumir la API de items y mostrarlos en la página
import { getItems } from "./services/api.js";

// Constante con la URL base de la API
const API_URL = "/api/items";
const catalogContainer = document.getElementById("catalogContainer");

// Función principal para cargar los items desde la API
async function loadCatalog() {
    try {
        // 1. Hacer fetch a la API (GET /api/items)
        const res = await fetch(API_URL);
        // 2. Parsear la respuesta a JSON
        const items = await res.json();
        // 3. Limpiar el contenedor del catálogo
        catalogContainer.innerHTML = "";
        // 4. Iterar sobre cada item y llamar a renderItem()
        items.forEach(item => {
            renderItem(item);
        });
    } catch (err) {
        console.error("Error cargando catálogo:", err);
        // TODO: Mostrar mensaje de error en la UI
        alert("No se pudo cargar los items");
    }
}                                                   

// Función para renderizar un item en el catálogo
function renderItem(item) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
        ${item.imageUrl ? `<img class="card-image" src="${item.imageUrl}" alt="Imagen de ${item.name}" loading="lazy">` : ""}
        <div class="card-container">
            <h2 class="name">${item.name}</h2>
            <p class="description">${item.description || ""}</p>
            <p class="price">$${Number(item.price).toFixed(2)}</p>
        </div>
    `;
    catalogContainer.appendChild(card);
}

// Inicializar el catálogo cuando cargue la página
loadCatalog();