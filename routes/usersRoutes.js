const UsersController = require('../controllers/usersController');

module.exports = (app) => {
    app.get('/api/users/getAll', UsersController.getAll);
    app.get('/api/users/getById/:id', UsersController.getById);
    app.post('/api/users/create', UsersController.create);
    app.put('/api/users/update/:id', UsersController.update);
    app.delete('/api/users/delete/:id', UsersController.delete);
};