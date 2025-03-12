const Category = require('../models/category'); 

module.exports = {
    async getAll(req, res, next) {
        try {
            const data = await Category.getAll(); 
            console.log(`Categorías listadas en: ${JSON.stringify(data)}`)
            return res.status(201).json(data);
        } 
        catch(error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                message:'Ocurrió un error al tratar de obtener las categorías',
                success:false,
                error:error
            });
        }
    },


    async create(req, res, next) {
        try {
            const category = req.body;
            console.log(`Categoría enviada: ${category}`);

            const data = await Category.create(category); //se crea la categoría en la bd

            return res.status(201).json({
                message:'Se creó la categoría correctamente',
                success:true,
                data:data.id
            })
        } 
        catch(error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                message:'Ocurrió un error al crear la categoría',
                success:false,
                error:error
            });
        }
    }
}