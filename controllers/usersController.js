const User = require('../models/user');

const UsersController = {};

// Obtener todos los usuarios
UsersController.getAll = async (req, res) => {
    try {
        const users = await User.getAll();
        res.status(200).json({
            success: true,
            message: 'Usuarios obtenidos exitosamente',
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los usuarios',
            data: null,
        });
    }
};

// Obtener un usuario por ID
UsersController.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.getById(id);
        if (user) {
            res.status(200).json({
                success: true,
                message: 'Usuario obtenido exitosamente',
                data: user,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
                data: null,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el usuario',
            data: null,
        });
    }
};

// Crear un nuevo usuario
UsersController.create = async (req, res) => {
    const user = req.body;
    try {
        const newUser = await User.create(user);
        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: { id: newUser.id },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el usuario',
            data: null,
        });
    }
};

// Actualizar un usuario por ID
UsersController.update = async (req, res) => {
    const { id } = req.params;
    const user = req.body;
    try {
        const updatedUser = await User.update(id, user);
        if (updatedUser) {
            res.status(200).json({
                success: true,
                message: 'Usuario actualizado exitosamente',
                data: null,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
                data: null,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el usuario',
            data: null,
        });
    }
};

// Eliminar un usuario por ID
UsersController.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.delete(id);
        if (deletedUser) {
            res.status(200).json({
                success: true,
                message: 'Usuario eliminado exitosamente',
                data: null,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
                data: null,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el usuario',
            data: null,
        });
    }
};

module.exports = UsersController;