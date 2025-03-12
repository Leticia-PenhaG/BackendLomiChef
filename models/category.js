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

// EXPORTAR EL OBJETO Category
module.exports = Category;


