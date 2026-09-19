const categories = ["Celulares", 
    "Electro", 
    "Televisores", 
    "Computadores", 
    "Videojuegos", 
    "Audio", 
    "Electrohogar", 
    "Audifonos"
];

export function validateItem(req, res, next) {
    const { price, category } = req.body ?? {};
    const errors = {};

    // Validar precio
    if (price !== undefined) {
        if (typeof price !== "number" || price < 0) {
            errors.price = "El precio debe ser mayor a 0";
        }
    }

    // Validar categoría
    if (category !== undefined) {
        if (!categories.includes(category)) {
            errors.category = `La categoría no es valida`;
        }
    }
    
    //Validar stock 
    if (typeof stock !== "number" || stock < 0) {
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