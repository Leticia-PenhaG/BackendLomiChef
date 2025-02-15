const User = require("../models/user");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const Roles = require("../models/roles");
const storage = require("../utils/cloud_storage");
const { urlencoded } = require("express");

const UsersController = {};

// Obtener todos los usuarios
UsersController.getAll = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json({
      success: true,
      message: "Usuarios obtenidos exitosamente",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los usuarios",
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
        message: "Usuario obtenido exitosamente",
        data: user,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener el usuario",
      data: null,
    });
  }
};

// Crear un nuevo usuario
UsersController.create = async (req, res) => {
  const user = req.body;
  try {
    const newUser = await User.create(user);
    await Roles.create(newUser.id, 1); //cuando se registra un usuario el rol por defecto es CLIENTE
    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      data: { id: newUser.id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear el usuario",
      data: null,
    });
  }
};

// Crear un nuevo usuario
/*UsersController.registerWithImage = async (req, res) => {
  try {
    const user = JSON.parse(req.body.user);
    console.log(`Datos del usuario: ${user}`);

    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se envió ninguna imagen",
      });
    }

    if(files.length > 0) {
      const pathImage = `image_${Date.now}`; //nombre del archivo
      const url = await storage(files[0], pathImage);

      if(url =! undefined && url!= null) {
        user.image = url;
      }
    }

    const newUser = await User.create(user);

    await Roles.create(newUser.id, 1); //cuando se registra un usuario el rol por defecto es CLIENTE
    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      data: { id: newUser.id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear el usuario",
      data: null,
    });
  }
};*/

UsersController.registerWithImage = async (req, res) => {
  try {
    console.log('Archivos recibidos:', req.file); // Esto debería mostrar el archivo de imagen
    const user = JSON.parse(req.body.user);
    console.log('Datos del usuario:', user);
    
    // Procesar la imagen y los datos del usuario
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No se envió ninguna imagen",
      });
    }

    // Procesar la imagen (almacenarla en el servidor o en un servicio de almacenamiento)
    const pathImage = `image_${Date.now()}`;
    const url = await storage(req.file, pathImage); // Asegúrate de que storage sea la función correcta para manejar la imagen
    
    if (url) {
      user.image = url;
    }

    const newUser = await User.create(user);
    await Roles.create(newUser.id, 1);

    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      data: { id: newUser.id },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al crear el usuario",
      data: null,
    });
  }
};


/*UsersController.registerWithImage = async (req, res) => {
  try {
    const user = JSON.parse(req.body.user); // Aquí estás pasando el objeto JSON de usuario
    const file = req.file; // Usamos 'file' ya que es un solo archivo

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No se envió ninguna imagen",
      });
    }

    // Guardar la imagen en Firebase o donde lo necesites
    const pathImage = `image_${Date.now()}`; 
    const url = await storage(file, pathImage);  // Función para almacenar la imagen

    // Si tienes la URL de la imagen, asignarla al objeto usuario
    user.image = url;

    // Crear el usuario con la URL de la imagen
    const newUser = await User.create(user);

    // Asignar un rol por defecto
    await Roles.create(newUser.id, 1); // Asumimos que '1' es el rol CLIENTE

    return res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      data: { id: newUser.id },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error al crear el usuario",
      data: null,
    });
  }
};
*/

/// Maneja el inicio de sesión del usuario validando credenciales y generando un token JWT.
///
/// Pasos principales:
/// 1. Obtiene el email y contraseña del cuerpo de la solicitud.
/// 2. Verifica si el usuario con el email proporcionado existe en la base de datos.
/// 3. Compara la contraseña ingresada con la almacenada (encriptada).
/// 4. Si las credenciales son correctas, genera un token JWT válido por 24 horas.
/// 5. Devuelve los datos del usuario junto con el token de sesión.
///
/// Errores posibles:
/// - 401: Email no encontrado o contraseña incorrecta.
/// - 500: Error en el servidor.
///
/// Ejemplo de respuesta exitosa:
/// {
///   "success": true,
///   "data": {
///     "id": 1,
///     "name": "Juan",
///     "lastname": "Pérez",
///     "email": "usuario@ejemplo.com",
///     "session_token": "JWT token generado"
///   }
/// }
UsersController.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const actual_user = await User.findByEmail(email);

    if (!actual_user) {
      return res.status(401).json({
        success: false,
        message: "El correo no fue encontrado",
      });
    }

    if (User.isPasswordMatched(password, actual_user.password)) {
      const token = jwt.sign(
        { id: actual_user.id, email: actual_user.email },
        keys.secretOrKey,
        { expiresIn: "24h" } // Tiempo de expiración
      );

      const data = {
        id: actual_user.id,
        name: actual_user.name,
        lastname: actual_user.lastname,
        email: actual_user.email,
        phone: actual_user.phone,
        image: actual_user.image,
        session_token: `JWT ${token}`,
        roles: actual_user.roles
      };

      console.log(`USUARIO ENVIADO: ${data}`);

      return res.status(201).json({
        success: true,
        data: data,
        message: "Usuario autenticado con éxito",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "La contraseña es incorrecta",
      });
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error al realizar el inicio de sesión",
      error: error.message,
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
        message: "Usuario actualizado exitosamente",
        data: null,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar el usuario",
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
        message: "Usuario eliminado exitosamente",
        data: null,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar el usuario",
      data: null,
    });
  }
};

module.exports = UsersController;
