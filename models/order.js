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

Order.findByStatus = async (status) => {
  const sql = `
    SELECT O.id,
      O.id_client,
      O.id_address,
      O.id_delivery,
      O.status,
      O.timestamp,
      JSON_BUILD_OBJECT(
        'id', U.id,
        'name', U.name,
        'lastname', U.lastname,
        'image', U.image
      ) AS client,
      JSON_BUILD_OBJECT(
        'id', A.id,
        'address', A.address,
        'neighborhood', A.neighborhood,
        'lat', A.lat,
        'lng', A.lng
      ) AS address
    FROM orders O
    INNER JOIN users U
    ON O.id_client = U.id
    INNER JOIN address A
    ON A.id = O.id_address
    WHERE status = $1;
  `;
  return db.manyOrNone(sql, [status]);  
};

module.exports = Order;