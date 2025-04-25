const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');

module.exports = {

  // Crear una nueva orden
  async createOrder(req, res, next) {
    try {
      const order = req.body;
      const data = await Order.create(order);

      //Se recorren todos los productos agregados a la orden
      for (const product of order.products) {
        console.log('Producto recibido:', product); 
      
        if (!product.id) {
          throw new Error('El producto no tiene un id válido');
        }
      
        await OrderHasProducts.create(data.id, product.id, product.quantity);
      }

      return res.status(201).json({
        message: 'La orden se creó correctamente',
        success: true,
        data: data.id
      });

    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({
        message: 'Ocurrió un error al crear la orden',
        success: false,
        error: error.message
      });
    }
  }
};