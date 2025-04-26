const CategoriesController = require('../controllers/categoriesController');
const passport = require('passport');

module.exports = (app) => {

    /*
    * GET ROUTES
    */

    app.get('/api/categories/getAll', passport.authenticate('jwt', {session: false}), CategoriesController.getAll); //es necesario que el usuario envíe el token


    /*
    * POST ROUTES
    */

    app.post('/api/categories/create', passport.authenticate('jwt', {session: false}), CategoriesController.create); //es necesario que el usuario envíe el token

    app.put('/api/categories/update',  passport.authenticate('jwt', {session: false}),  CategoriesController.update); 
    app.delete('/api/categories/delete/:id', passport.authenticate('jwt', {session: false}),  CategoriesController.delete); 
}