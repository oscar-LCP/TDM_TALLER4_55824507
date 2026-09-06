// Constante con la URL base de la API
const API_URL = "/api/items";
const catalogContainer = document.getElementById("catalogContainer");

// Función principal para cargar los items desde la API
async function loadCatalog() {
    try {
        const res = await fetch(API_URL);
        const items = await res.json();
        catalogContainer.innerHTML = "";
        items.forEach(item => {
            renderItem(item);
        });
    } catch (err) {
        console.error("Error cargando catálogo:", err);
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
            <button class="btn-buy">Comprar ></button>
        </div>
    `;
    catalogContainer.appendChild(card);
}

// Inicializar el catálogo cuando cargue la página
loadCatalog();