/*const User = require('../models/user');

module.exports = {
    async getAll(req, res, next) {
        try {
            const data = await User.getAll();
            console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success:false,
                message: `Error al obtener los usuarios`
            });
        }
    }
};*/

const User = require('../models/user');

const UsersController = {};

// Obtener todos los usuarios
UsersController.getAll = async (req, res) => {
    try {
        const users = await User.getAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un usuario por ID
UsersController.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.getById(id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo usuario
UsersController.create = async (req, res) => {
    const user = req.body;
    try {
        const newUser = await User.create(user);
        res.status(201).json({
            message: 'Usuario creado exitosamente',
            id: newUser.id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un usuario por ID
UsersController.update = async (req, res) => {
    const { id } = req.params;
    const user = req.body;
    try {
        const updatedUser = await User.update(id, user);
        if (updatedUser) {
            res.status(200).json({ message: 'Usuario actualizado exitosamente' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un usuario por ID
UsersController.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.delete(id);
        if (deletedUser) {
            res.status(200).json({ message: 'Usuario eliminado exitosamente' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = UsersController;