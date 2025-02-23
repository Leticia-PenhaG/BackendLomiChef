const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const Keys = require("./keys");//clave secreta para verificar el token

module.exports = function (passport) {
  let opts = {};

  // Se define de dónde extraer el token JWT en las solicitudes
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");

  // Se establece la clave secreta para descifrar el token
  opts.secretOrKey = Keys.secretOrKey;

  // Se configura la estrategia de autenticación con JWT
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // jwt_payload es el contenido decodificado del token (contiene el id del usuario y otros datos)

      // Se busca al usuario en la base de datos por su ID
      User.getById(jwt_payload.id, (error, user) => {
        if (error) {
          return done(error, false);
        }
        if (user) {
          return done(null, user);// Si el usuario existe, se retorna
        } else {
          return done(null, false);// Si no existe, se retorna `false` (no autenticado)
        }
      });
    })
  );
};
