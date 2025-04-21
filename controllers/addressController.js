const Address = require('../models/address');

module.exports = {
  async create(req, res, next) {
    try {
      const address = req.body;
      const data = await Address.create(address);

      return res.status(201).json({
        message: 'La dirección se creó correctamente',
        success: true,
        data: data.id
      });

    } catch (error){
      console.log(`Error: ${error}`);
      return res.status(500).json({
        message: 'Ocurrió un error al crear la dirección',
        success: false,
        error: error.message
      });
    }
  }
}