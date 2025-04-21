const AddressController = require('../controllers/addressController');
const passport = require('passport');

module.exports = (app) => {

    /*
    * GET ROUTES
    */

    //app.get('/api/categories/getAll', passport.authenticate('jwt', {session: false}), CategoriesController.getAll); //es necesario que el usuario envíe el token


    /*
    * POST ROUTES
    */

    app.post('/api/address/create', passport.authenticate('jwt', {session: false}), AddressController.create); //es necesario que el usuario envíe el token
}