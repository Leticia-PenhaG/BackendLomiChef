const Address = require('../models/address');

module.exports = {
  // Crear una nueva dirección
  create: async (req, res, next) => {
    try {
      const address = req.body;
      const data = await Address.create(address);

      return res.status(201).json({
        message: 'La dirección se creó correctamente',
        success: true,
        data: data.id
      });

    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({
        message: 'Ocurrió un error al crear la dirección',
        success: false,
        error: error.message
      });
    }
  },

  // Buscar direcciones por ID de usuario
  findByUser: async (req, res, next) => {
    try {
      const id_user = req.params.id_user;
      const data = await Address.findByUser(id_user);
      console.log(`Address ${JSON.stringify(data)}`);
      return res.status(201).json(data);
    } catch (error) {
      console.log(`Error ${error}`);
      return res.status(501).json({
        message: 'Ocurrió un error al tratar de obtener las direcciones',
        error: error,
        success: false
      });
    }
  }
};