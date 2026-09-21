const API_URL = "/api/items";

async function request(url, options) {
    let res;

    try {
        res = await fetch(url, options);
    } catch (error) {
        const method = options.method || "GET";

        if (method !== "GET") {
            throw new Error("No disponible sin conexión.");
        }

        throw error;
    }

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

async function requestWithCacheInfo(url, options = {}) {
    let res;

    try {
        res = await fetch(url, options);
    } catch (error) {
        throw error;
    }

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

    const data = await res.json();
    
    return {
        data, fromCache: res.headers.get("X-Offline-Cache") === "true"
    };
}

// Cabecera reutilizada por POST y PUT
const JSON_HEADERS = { "Content-Type": "application/json" };

export async function getItems(params = {}) {
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
    
    const result = await requestWithCacheInfo(url);

    const items = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.data?.items)
            ? result.data.items
            : [];

    items.fromCache = result.fromCache;

    return items;
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
