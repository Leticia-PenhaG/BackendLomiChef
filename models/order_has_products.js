const db = require('../config/config');

const OrderHasProducts = {};

OrderHasProducts.create = async (id_order, id_product, quantity) => {
  const sql = `
    INSERT INTO orders_has_products (
      id_order,
      id_product,
      quantity,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5) 
  `;

  return await db.none(sql, [
    id_order,
    id_product,
    quantity,
    new Date(),
    new Date(),
  ]);
};


module.exports = OrderHasProducts;