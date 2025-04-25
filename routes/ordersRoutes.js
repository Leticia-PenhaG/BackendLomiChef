const OrdersController = require('../controllers/ordersController');
const passport = require('passport');

module.exports = (app) => {

    /*
    * GET ROUTES
    */

    //app.get('/api/address/findByUser/:id_user', passport.authenticate('jwt', {session: false}), AddressController.findByUser); //es necesario que el usuario envíe el token


    /*
    * POST ROUTES
    */

    app.post('/api/orders/create', passport.authenticate('jwt', {session: false}), OrdersController.createOrder); //es necesario que el usuario envíe el token
}