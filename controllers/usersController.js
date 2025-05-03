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
/*UsersController.getById = async (req, res) => {
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
};*/

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

    // Almacenar la imagen en firebase
    const pathImage = `image_${Date.now()}`;
    const url = await storage(req.file, pathImage); 
    
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

//Actualizar perfil del cliente
UsersController.updateProfile = async (req, res) => {
  try {
    const user = JSON.parse(req.body.user);
    console.log(`Datos del usuario a actualizar:`, user);

    let updatedUser = { ...user };

    // Si hay una nueva imagen, se sube y se actualiza el campo
    if (req.file) {
      const pathImage = `image_${Date.now()}`;
      const url = await storage(req.file, pathImage);
      if (url) {
        updatedUser.image = url;
      }
    }

    // **Si la contraseña está vacía, la eliminamos para no afectar la consulta**
    if (!updatedUser.password || updatedUser.password.trim() === "") {
      delete updatedUser.password;
    }

    // Se llama a la función para actualizar el usuario
    const result = await User.update(updatedUser);

    // Validación si el usuario se encontró y se actualizó
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente",
      data: result,
    });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el perfil",
      error: error.message,
    });
  }
};


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

    const actual_user = await User.findByEmail(email); //se obtiene usuario por email

    if (!actual_user) {
      return res.status(401).json({
        success: false,
        message: "El correo no fue encontrado",
      });
    }

    // Se verifica si la contraseña ingresada coincide con la almacenada
    if (User.isPasswordMatched(password, actual_user.password)) {

      //Si la contraseña es correcta, se genera un token JWT con los datos del usuario
      const token = jwt.sign(
        { id: actual_user.id, email: actual_user.email }, // Payload del token (datos del usuario)
        keys.secretOrKey, // Clave secreta para firmar el token
        { expiresIn: (60 * 15) } // Tiempo de expiración del token
      );

      const sessionToken = `JWT ${token}`;

      // Actualizar el token en la base de datos
      await User.updateSessionToken(actual_user.id, sessionToken);

      //Se construye un objeto con los datos del usuario que se enviarán en la respuesta
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

      // Se envía la respuesta con el usuario autenticado y el token
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
      message: "Error al iniciar la sesión",
      error: error.message,
    });
  }
};

// Obtener un usuario por ID
UsersController.getById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findUserById(id);
    
    if (user) {
      res.status(200).json({
        success: true,
        message: "Usuario obtenido",
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
      message: "Error al obtener el usuario por ID",
      data: null,
    });
  }
};

//Se vuelve a colocar null el token cuando caduca o se cierra la sesión 
UsersController.logout = async (req, res, next) => {
  try {
    const id = req.body.id; // req.user.id si el ID está en el token JWT
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario no proporcionado",
      });
    }

    await User.updateSessionToken(id, null);

    return res.status(200).json({
      success: true,
      message: "La sesión del usuario se cerró correctamente",
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error al cerrar sesión",
    });
  }
};

/*UsersController.logout = async (req, res, next) => {
  try {
    const id = req.body.id;     //req.user.id si el ID está en el token JWT
    await User.updateSessionToken(id, null);
    return res.status(501).json({
      success:true,
      message:'La sesión del usuario se cerró correctamente'
    });
  }
  catch (error) {
    console.log(`Error: ${error}`);
    return res.status(501).json({
      success:false,
      message:'Error al cerrar sesión'
    });
  }
};*/

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

UsersController.loadCouriers = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.loadCouriers(id);
    
    if (user) {
      res.status(200).json({
        success: true,
        message: "Usuario obtenido",
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
      message: "Error al obtener los repartidores",
      data: null,
    });
  }
};

module.exports = UsersController;
