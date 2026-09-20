const API_URL = "/api/items";

async function request(url, options) {
    const res = await fetch(url, options);

    if (!res.ok) {
        let message = `Error ${res.status}`;
        try {
            const body = await res.json();
            if (body.errors) {
                message = Object.values(body.errors).join("\n");
            } else if (body.error) {
                message = body.error;
        }
        } catch {
            message = "Ocurrió un error al comunicarse con el servidor.";
        }
        throw new Error(message);
    }

    return res.json();
}

// Cabecera reutilizada por POST y PUT
const JSON_HEADERS = { "Content-Type": "application/json" };

export function getItems(params = {}) {
    const query = new  URLSearchParams(params);
    if (params.q) {
        query.set("q", params.q);
    }

    if (params.category) {
        query.set("category", params.category);
    }

    if (params.minPrice !== undefined) {
        query.set("minPrice", params.minPrice);
    }

    if (params.maxPrice !== undefined) {
        query.set("maxPrice", params.maxPrice);
    }

    const url = query.toString() //Esta parte se hizo con Chat.gpt
        ? `${API_URL}?${query.toString()}`
        : API_URL;
    return request(url);
}

export function getItem(id) {
    return request(`${API_URL}/${id}`);
}

export function createItem(data) {
    return request(API_URL, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(data)
    });
}

export function updateItem(id, data) {
    return request(`${API_URL}/${id}`, {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify(data)
    });
}

export function deleteItem(id) {
    return request(`${API_URL}/${id}`, { method: "DELETE" });
}
