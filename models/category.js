const db = require('../config/config');

const Category = {};  // Definición del objeto Category

Category.getAll = () => {
    const sql = `
        SELECT 
            id,
            name,
            description
        FROM 
            categories
        ORDER BY
            name
    `;

    return db.manyOrNone(sql);
}

// Se agrega el método create dentro del objeto
Category.create = (category) => {
    const sql = `
    INSERT INTO categories(
        name,
        description,
        created_at,
        updated_at
    ) VALUES ($1, $2, $3, $4) RETURNING id
    `;
    return db.oneOrNone(sql, [
        category.name,
        category.description,
        new Date(),
        new Date()
    ]);
};

// EDITAR CATEGORÍA
Category.update = (category) => {
    const sql = `
    UPDATE 
        categories
    SET
        name = $2,
        description = $3,
        updated_at = $4
    WHERE
        id = $1
    `;
    return db.none(sql, [
        category.id,
        category.name,
        category.description,
        new Date()
    ]);
};

// ELIMINAR CATEGORÍA
Category.delete = (id) => {
    const sql = `
    DELETE FROM 
        categories
    WHERE 
        id = $1
    `;
    return db.none(sql, id);
};

// EXPORTAR EL OBJETO Category
module.exports = Category;


