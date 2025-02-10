const UsersController = require("../controllers/usersController");

module.exports = (app, upload) => {
  app.get("/api/users/getAll", UsersController.getAll);
  app.get("/api/users/getById/:id", UsersController.getById);
  app.post("/api/users/create", upload.array('image',1), UsersController.registerWithImage);
  app.put("/api/users/update/:id", UsersController.update);
  app.delete("/api/users/delete/:id", UsersController.delete);
  app.post("/api/users/login", UsersController.login);
};
