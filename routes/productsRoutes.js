const ProductsController = require('../controllers/productsController');
const passport = require('passport');

const multer = require('multer');

// Almacenar las imágenes en memoria en lugar del disco
const upload = multer({ storage: multer.memoryStorage() });


module.exports = (app) => {
    /*
    * POST ROUTES
    */

    app.post('/api/products/create', passport.authenticate('jwt', { session: false }), upload.array('images', 3), ProductsController.create);


    app.get('/api/products/findByCategory/:id_category', passport.authenticate('jwt', { session: false }), ProductsController.findByCategory);
    
    
    app.put('/api/products/update', passport.authenticate('jwt', { session: false }), ProductsController.create);

    app.delete('/api/products/delete/:id', passport.authenticate('jwt', { session: false }), ProductsController.delete);

}
