categories = ["Celulares", "Electro", "Televisores", "Computadores", "Videojuegos", "Audio", "Electrohogar", "Audifonos"];

export function validateItem(req, res, next) {
    const { price, category, stock } = req.body;
    const errors = {};

    // Validar precio
    if (typeof price !== "number" || price <= 0) {
        errors.price = "El precio debe ser mayor a 0";
    }

    // Validar categoría
    if (!categories.includes(category)) {
        errors.category = `La categoría debe ser una de: ${categories.join(", ")}`;
    }

    //Validar stock 
    if (typeof stock !== "number" || stock <= 0) {
        errors.stock = "El numero de stock debe ser mayor a 0";
    }

    // Si hay errores
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            errors
        });
    }

    next();
}