const db = require('../config/config');

const Order = {};

Order.create = async (order) => {
  const sql = `
    INSERT INTO orders (
      id_client,
      id_address,
      id_delivery, 
      status,
      timestamp,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
  `;

  return await db.one(sql, [
    order.id_client,
    order.id_address,
    order.id_delivery || null, 
    order.status,
    Date.now(),
    new Date(),
    new Date(),
  ]);
};


module.exports = Order;