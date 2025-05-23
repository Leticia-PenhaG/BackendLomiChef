const db = require("../config/config");
const crypto = require("crypto");

const User = {};

// Obtener todos los usuarios
User.getAll = () => {
  const sql = `
    SELECT * FROM users
    `;

  return db.manyOrNone(sql);
};

/// Obtiene un usuario por su ID desde la base de datos.
///
/// Pasos principales:
/// 1. Realiza una consulta SQL utilizando el ID proporcionado.
/// 2. Si el usuario existe, ejecuta el callback con los datos del usuario.
/// 3. Si no se encuentra el usuario, ejecuta el callback con `null`.
///
/// Parámetros:
/// - `id`: ID del usuario a buscar.
/// - `callback`: Función que recibe:
///   - `error`: Error ocurrido durante la consulta (null si no hay error).
///   - `user`: Objeto del usuario encontrado (null si no se encuentra).
///
/// Ejemplo de uso:
/// User.getById(1, (error, user) => {
///   if (user) {
///     console.log("Usuario encontrado:", user);
///   } else {
///     console.log("Usuario no encontrado.");
///   }
/// });
User.getById = (id, callback) => {
  const sql = `
    SELECT 
        id,
        email,
        password,
        phone,
        name,
        image,
        is_available,
        lastname,
        session_token
    FROM 
        users
    WHERE 
        id = $1
    `;

  return db.oneOrNone(sql, id).then((user) => {
    callback(null, user);
  });
};

User.findByEmail = (email) => {
  const sql = `
    SELECT 
        u.id,
        u.email,
        u.password,
        phone,
        u.name,
        u.image,
        u.is_available,
        u.lastname,
        u.session_token,
		json_agg(
			json_build_object(
				'id', r.id,
				'name', r.name,
				'image', r.image,
				'route', r.route
				
			) 
		) as roles
    FROM 
        users as u
	INNER JOIN 
		user_has_roles as uhr
	ON
		u.id = uhr.id_user
	INNER JOIN
		roles r
		ON
		r.id = uhr.id_role
    WHERE
        u.email = $1
	GROUP BY u.id
    `;

  return db.oneOrNone(sql, email);
};

User.loadCouriers = () => {
  const sql = `
   SELECT 
        u.id,
        u.email,
        u.name,
        u.lastname,
        u.image,
        u.phone,
        u.password,
        u.session_token
		FROM 
      users U 
    INNER JOIN 
      user_has_roles UHR
    ON 
      U.id = UHR.id_user
    INNER JOIN 
      roles R
    ON
      R.id = UHR.id_role
    WHERE
        R.id = 3
    `;

  return db.manyOrNone(sql);
};

// Crear un nuevo usuario
User.create = (user) => {
  const passwordEncrypted = crypto
    .createHash("md5")
    .update(user.password)
    .digest("hex");
  user.password = passwordEncrypted;

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
    user.session_token,
  ];

  return db.one(sql, values);
};

// Actualizar datos del cliente
User.update = (user) => {
  let passwordEncrypted = user.password ? crypto.createHash("md5").update(user.password).digest("hex") : null;

  // Construcción dinámica de la consulta SQL
  let sql = `
    UPDATE users
    SET email = $2,
        phone = $3,
        name = $4,
        image = $5,
        lastname = $6,
        updated_at = CURRENT_TIMESTAMP
  `;

  let params = [user.id, user.email, user.phone, user.name, user.image, user.lastname];

  // Solo agrega la contraseña si está presente
  if (passwordEncrypted) {
    sql = `
      UPDATE users
      SET email = $2,
          password = $3,
          phone = $4,
          name = $5,
          image = $6,
          lastname = $7,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *`;
    
    params = [user.id, user.email, passwordEncrypted, user.phone, user.name, user.image, user.lastname];
  } else {
    sql += ` WHERE id = $1 RETURNING *`;
  }

  return db.oneOrNone(sql, params);
};

//Obtener usuario por ID
User.findUserById = (id) => {
  const sql = `
    SELECT 
        u.id,
        u.email,
        u.password,
        phone,
        u.name,
        u.image,
        u.is_available,
        u.lastname,
        u.session_token,
		json_agg(
			json_build_object(
				'id', r.id,
				'name', r.name,
				'image', r.image,
				'route', r.route
				
			) 
		) as roles
    FROM 
        users as u
	INNER JOIN 
		user_has_roles as uhr
	ON
		u.id = uhr.id_user
	INNER JOIN
		roles r
		ON
		r.id = uhr.id_role
    WHERE
        u.id = $1
	GROUP BY u.id
    `;

  return db.oneOrNone(sql, id);
};


// Eliminar un usuario por ID
User.delete = (id) => {
  const sql = `
    DELETE FROM users WHERE id = $1 RETURNING id
    `;

  return db.oneOrNone(sql, [id]);
};

// Comparar la contraseña proporcionada con la contraseña encriptada
User.isPasswordMatched = (userPassword, hash) => {
  const myPasswordHashed = crypto
    .createHash("md5")
    .update(userPassword)
    .digest("hex");
  if (myPasswordHashed === hash) {
    return true;
  }
  return false;
};

//Función para actualizar el token en la base de datos
User.updateSessionToken = (userId, sessionToken) => {
  const sql = `
    UPDATE users 
    SET session_token = $1 
    WHERE id = $2
  `;

  return db.none(sql, [sessionToken, userId]);
};

//Función para actualizar el token del usuario en el campo notification_token
User.updateNotificationToken = (userId, sessionToken) => {
  const sql = `
    UPDATE 
      users 
    SET 
      notification_token = $2 
    WHERE 
      id = $1
  `;

  return db.none(sql,
     [
      userId,
      sessionToken
     ]);
};

module.exports = User;
