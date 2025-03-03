const ProductsController = require('../controllers/productsController');
const passport = require('passport');

const multer = require('multer');

// Almacenar las imágenes en memoria en lugar del disco
const upload = multer({ storage: multer.memoryStorage() });


module.exports = (app) => {
    /*
    * POST ROUTES
    */

    app.post('/api/products/create', passport.authenticate('jwt', {session: false}), upload.array('image', 3), ProductsController.create); //para crear el producto
}