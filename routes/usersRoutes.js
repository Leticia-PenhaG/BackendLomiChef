const UsersController = require("../controllers/usersController");
const passport = require('passport');

module.exports = (app, upload) => {
  //Obtener datos
  app.get("/api/users/getAll", UsersController.getAll);
  app.get("/api/users/getById/:id", passport.authenticate('jwt', {session:false}), UsersController.getById); //se agrega control del token para que solo usuarios autenticados y con token válido puedan realizar estas llamadas
  app.get("/api/users/loadCouriers", passport.authenticate('jwt', {session:false}), UsersController.loadCouriers); //para listar repartidores
  app.get("/api/users/getAdminsNotificationTokens", passport.authenticate('jwt', {session:false}), UsersController.getAdminsNotificationTokens);

  //Guardar datos
  app.post("/api/users/create", upload.single('image'), UsersController.registerWithImage);
  app.post("/api/users/login", UsersController.login)

  //Actualizar datos
  app.put("/api/users/update", passport.authenticate('jwt', {session:false}), upload.single("image"), UsersController.updateProfile); //se agrega control del token
  app.put("/api/users/updateNotificationToken", passport.authenticate('jwt', {session:false}), UsersController.updateNotificationToken); //se agrega control del token

  app.post("/api/users/logout", UsersController.logout);

  app.delete("/api/users/delete/:id", UsersController.delete);

};
