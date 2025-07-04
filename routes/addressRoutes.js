const AddressController = require('../controllers/addressController');
const passport = require('passport');

module.exports = (app) => {

    /*
    * GET ROUTES
    */

    app.get('/api/address/findByUser/:id_user', passport.authenticate('jwt', {session: false}), AddressController.findByUser); //es necesario que el usuario envíe el token


    /*
    * POST ROUTES
    */

    app.post('/api/address/create', passport.authenticate('jwt', {session: false}), AddressController.create); //es necesario que el usuario envíe el token
}