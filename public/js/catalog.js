import { getItems } from "./services/api.js";

const catalogContainer = document.getElementById("catalogContainer");
const searchInput = document.getElementById("search");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const categoryButtons = document.querySelectorAll("[data-category]");

// Función principal para cargar los items desde la API
async function loadCatalog() {
    try {
        if (!catalogContainer) {
            console.warn("No existe #catalogContainer en la página");
            return;
        }

        const params = {};
        // Buscar por nombre o descripción
        if (searchInput) {
            const search = searchInput.value.trim();

            if (search) {
                params.q = search;
            }
        }

        // Obtener la categoría seleccionada
        const activeButton = document.querySelector(
            "[data-category].active"
        );

        if (activeButton && activeButton.dataset.category) {
            params.category = activeButton.dataset.category;
        }

        if (minPriceInput && minPriceInput.value !== "") {
            params.minPrice = Number(minPriceInput.value);
        }

        if (maxPriceInput && maxPriceInput.value !== "") {
            params.maxPrice = Number(maxPriceInput.value);
        }

        const items = await getItems(params);
       
        catalogContainer.replaceChildren(...items.map(renderItem));

        if (items.fromCache) {
            showOfflineMessage();
        } else {
            hideOfflineMessage();
        }
    } catch (err) {
        console.error("Error cargando catálogo:", err);
        alert("No se pudo cargar los items");
    }
}

// Buscador
if (searchInput) {
    searchInput.addEventListener("input", loadCatalog);
}
 //La parte de las categorias
// Categorias
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        loadCatalog();
    });
});

if (minPriceInput) {
    minPriceInput.addEventListener("input", loadCatalog);
}
if (maxPriceInput) {
    maxPriceInput.addEventListener("input", loadCatalog);
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

function showOfflineMessage() {
    let message = document.getElementById("offlineMessage");
    if (!message) {
        message = document.createElement("div");
        message.id = "offlineMessage";
        message.textContent = "Mostrando datos en caché (sin conexión)";
        message.style.cssText = `
            margin: 15px 0;
            padding: 10px 15px;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            background-color: rgba(255, 255, 255, 0.14);
            color: #166534;
        `;
        catalogContainer.parentElement.insertBefore(message, catalogContainer);
    }

    message.style.display = "block";
}

function hideOfflineMessage() {
    const message = document.getElementById("offlineMessage");
    if (message) {
        message.style.display = "none";
    }
}

// Inicializar el catálogo cuando cargue la página
loadCatalog();