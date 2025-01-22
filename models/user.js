const db = require('../config/config');

const User = {};

// Obtener todos los usuarios
User.getAll = () => {
    const sql = `
    SELECT * FROM users
    `;

    return db.manyOrNone(sql);
};

// Obtener un usuario por ID
User.getById = (id) => {
    const sql = `
    SELECT * FROM users
    WHERE id = $1
    `;

    return db.oneOrNone(sql, [id]);
};

// Crear un nuevo usuario
User.create = (user) => {
    const sql = `
    INSERT INTO users (email, password, phone, name, image, is_available, lastname, session_token)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
    `;

    const values = [
        user.email,
        user.password,
        user.phone,
        user.name,
        user.image,
        user.is_available,
        user.lastname,
        user.session_token
    ];

    return db.one(sql, values);
};

// Actualizar un usuario por ID
User.update = (id, user) => {
    const sql = `
    UPDATE users
    SET email = $1,
        password = $2,
        phone = $3,
        name = $4,
        image = $5,
        is_available = $6,
        lastname = $7,
        session_token = $8,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $9 RETURNING id
    `;

    const values = [
        user.email,
        user.password,
        user.phone,
        user.name,
        user.image,
        user.is_available,
        user.lastname,
        user.session_token,
        id
    ];

    return db.oneOrNone(sql, values);
};

// Eliminar un usuario por ID
User.delete = (id) => {
    const sql = `
    DELETE FROM users WHERE id = $1 RETURNING id
    `;

    return db.oneOrNone(sql, [id]);
};

module.exports = User;