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

// const ProductsController = require('../controllers/productsController');
// const passport = require('passport');
// const multer = require('multer');

// // Almacenar las imágenes en memoria en lugar del disco
// const upload = multer({ storage: multer.memoryStorage() });

// // Configura Multer para recibir tres archivos con nombres específicos
// const uploadFields = multer({ storage: multer.memoryStorage() }).fields([
//   { name: 'image1', maxCount: 1 },
//   { name: 'image2', maxCount: 1 },
//   { name: 'image3', maxCount: 1 }
// ]);

// module.exports = (app) => {
//   /*
//   * POST ROUTES
//   */

//   // Ruta para crear el producto
//   app.post('/api/products/create', passport.authenticate('jwt', { session: false }), uploadFields, ProductsController.create);
// };
