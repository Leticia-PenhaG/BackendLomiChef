const OrdersController = require('../controllers/ordersController');
const passport = require('passport');

module.exports = (app) => {

    /*
    * GET ROUTES
    */

    app.get('/api/orders/findByStatus/:status', passport.authenticate('jwt', {session: false}), OrdersController.findByStatus); //es necesario que el usuario envíe el token
    app.get('/api/orders/getOrdersByDeliveryAndStatus/:id_delivery/:status', passport.authenticate('jwt', {session: false}), OrdersController.getOrdersByDeliveryAndStatus);

    /*
    * POST ROUTES
    */

    app.post('/api/orders/create', passport.authenticate('jwt', {session: false}), OrdersController.createOrder); //es necesario que el usuario envíe el token


    /*
    * PUT ROUTES
    */

    app.put('/api/orders/markAsReadyToDeliver', passport.authenticate('jwt', {session: false}), OrdersController.markAsReadyToDeliver); //es necesario que el usuario envíe el token
    app.put('/api/orders/updateOrderToOnTheWay', passport.authenticate('jwt', {session: false}), OrdersController.updateOrderToOnTheWay); //es necesario que el usuario envíe el token

}