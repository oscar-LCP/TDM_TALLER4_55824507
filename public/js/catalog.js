import { getItems } from "./services/api.js";

const catalogContainer = document.getElementById("catalogContainer");

// Función principal para cargar los items desde la API
async function loadCatalog() {
    try {
        if (!catalogContainer) {
            console.warn("No existe #catalogContainer en la página");
            return;
        }

        const response = await getItems();
        const items = Array.isArray(response)
            ? response
            : Array.isArray(response?.items)
                ? response.items
                : [];

        catalogContainer.replaceChildren(...items.map(renderItem));
    } catch (err) {
        console.error("Error cargando catálogo:", err);
        alert("No se pudo cargar los items");
    }
}

// Función para renderizar un item en el catálogo
function renderItem(item) {
    const card = document.createElement("article");
    card.className = "card";

    if (item.imageUrl) {
        const image = document.createElement("img");
        image.className = "card-image";
        image.src = item.imageUrl;
        image.alt = `Imagen de ${item.name}`;
        image.loading = "lazy";
        card.appendChild(image);
    }

    const container = document.createElement("div");
    container.className = "card-container";

    const name = document.createElement("h2");
    name.className = "name";
    name.textContent = item.name;

    const description = document.createElement("p");
    description.className = "description";
    description.textContent = item.description || "";

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = `$${Number(item.price).toFixed(2)}`;

    const button = document.createElement("button");
    button.className = "btn-buy";
    button.textContent = "Comprar >";

    container.append(name, description, price, button);
    card.appendChild(container);
    return card;
}

// Inicializar el catálogo cuando cargue la página
loadCatalog();