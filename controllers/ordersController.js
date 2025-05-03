const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');

module.exports = {

   // Buscar direcciones por ID de usuario
    findByStatus: async (req, res, next) => {
      try {
        const status = req.params.status;
        const data = await Order.findByStatus(status);
        console.log(`Status ${JSON.stringify(data)}`);
        return res.status(201).json(data);
      } catch (error) {
        console.log(`Error ${error}`);
        return res.status(501).json({
          message: 'Ocurrió un error al tratar de obtener los pedidos por estado',
          error: error,
          success: false
        });
      }
    },

  // Crear una nueva orden
  async createOrder(req, res, next) {
    try {
      let order = req.body;
      order.status = 'PAGADO';
      const data = await Order.create(order);

      console.log('La orden se creó correctamente');

      //Se recorren todos los productos agregados a la orden
      for (const product of order.products) { //este order.products va en el modelo
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
  },

    async markAsReadyToDeliver(req, res, next) {
      try {
        let order = req.body;
        order.status = 'LISTO_PARA_ENVIO';
        await Order.update(order);

        return res.status(200).json({
          success: true,
          message: 'La orden fue marcada como lista para envío',
        });
    

        // return res.status(400).json({
        //   success: false,
        //   message: 'El ID de la orden es requerido',
        // });

      } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).json({
          success: false,
          message: 'Ocurrió un error al actualizar la orden',
          error: error.message,
        });
      }
    },

    // Buscar direcciones por ID de usuario
    getOrdersByDeliveryAndStatus: async (req, res, next) => {
      try {
        const id_delivery = req.params.id_delivery;
        const status = req.params.status;

        const data = await Order.getOrdersByDeliveryAndStatus(id_delivery, status);
        console.log(`Status del delivery${JSON.stringify(data)}`);
        return res.status(201).json(data);
      } catch (error) {
        console.log(`Error ${error}`);
        return res.status(501).json({
          message: 'Ocurrió un error al tratar de obtener los pedidos asignados al delivery',
          error: error,
          success: false
        });
      }
    }
    
};