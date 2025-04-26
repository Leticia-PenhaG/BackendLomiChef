const Product = require('../models/product');
const storage = require("../utils/cloud_storage");
const asyncForEach = require('../utils/async_foreach');

// module.exports = {
//     async create(req, res, next) {
//         let product = JSON.parse(req.body.product);
//         console.log(`Producto ${JSON.stringify(product)}`)
//         console.log(`Producto recibido: ${JSON.stringify(product)}`);
//         console.log(`Archivos recibidos: ${req.files.length}`);

//         const files = req.files;

//         let inserts = 0;

//         if(files.length === 0) {
//             return res.status(501).json({
//                 message: 'Ocurrió un error al registrar el producto, no tiene imagen',
//                 success: false
//             });
//         }
//         else {
//             try {
//                 const data = await Product.create(product); //se alamacena la información del producto
//                 product.id = data.id;
                
//                 const start = async() => {
//                     await asyncForEach(files, async(file) =>{ //archivo a almacenar en la bd
//                         const pathImage = `image_${Date.now()}`;
//                         const url = await storage(files, pathImage); 
                        

//                         if(url != undefined && url != null) {
//                             if(inserts == 0) { //imagen 1
//                                 product.image1 = url;
//                             }
//                             else if(inserts == 1 ){
//                                 product.image2 = url;
//                             }
//                             else if(inserts == 2 ){
//                                 product.image3 = url;
//                             }
//                         }

//                         await Product.update(product);
//                         inserts = inserts + 1;

//                         if(inserts == files.length) {
//                             return res.status(201).json({
//                                 success: true,
//                                 message: 'El producto se registró correctamente'
//                             })
//                         }

//                     });
//                 }

//                 start();
                
//             } catch (error) {
//                 console.log(`Error: ${error}`);
//                 return res.status(501).json({
//                     message: `Ocurrió un error al registrar el producto ${error}`,
//                     success: false,
//                     error:error
//                 })    
//             }
//         }

//     }
// }

module.exports = {

  /*CREAR PRODUCTO*/
    async create(req, res) {
      try {
        let product = JSON.parse(req.body.product);
        console.log(`Producto recibido: ${JSON.stringify(product)}`);
        console.log(`Archivos recibidos: ${req.files.length}`);
  
        if (!req.files || req.files.length === 0) {
          return res.status(400).json({ success: false, message: 'No se enviaron imágenes' });
        }
  
        // Subir imágenes a Firebase
        const urls = await Promise.all(req.files.map(async (file, index) => {
          const pathImage = `image_${Date.now()}_${index}`;
          return await storage(file, pathImage); 
        }));
  
        if (urls.length >= 3) {
          product.image1 = urls[0];
          product.image2 = urls[1];
          product.image3 = urls[2];
        }
  
        // Guardar en BD
        const data = await Product.create(product);
  
        res.status(201).json({
          success: true,
          message: 'Producto creado correctamente',
          data
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ 
          success: false, 
          message: 'Error al registrar el producto',
          error: error
         });
      }
    },

    /*BUSCAR PRODUCTO POR CATEGORÍA */
    async findByCategory(req, res) {
      try {
        const id_category = req.params.id_category; //Envía el cliente, postman o flutter (igual el id_category que en la ruta)
        const data = await Product.findByCategory(id_category);
        return res.status(201).json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ 
          success: false, 
          message: 'Error al listar los productos por categoría',
          error: error
        });
      }
    },

      // NUEVO: ACTUALIZAR PRODUCTO
      async update(req, res) {
        try {
          const product = req.body;
          await Product.update(product);
  
          return res.status(201).json({
            success: true,
            message: 'Producto actualizado correctamente'
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ 
            success: false, 
            message: 'Error al actualizar el producto',
            error: error
          });
        }
      },
  
      // NUEVO: ELIMINAR PRODUCTO
      async delete(req, res) {
        try {
          const id = req.params.id;
          await Product.delete(id);
  
          return res.status(201).json({
            success: true,
            message: 'Producto eliminado correctamente'
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ 
            success: false, 
            message: 'Error al eliminar el producto',
            error: error
          });
        }
      }
}
  
