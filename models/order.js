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

/*Order.findByStatus = async (status) => {
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
    INNER JOIN users U ON O.id_client = U.id
    INNER JOIN address A ON A.id = O.id_address
    WHERE status = $1;
  `;

  return db.manyOrNone(sql, [status]); // nada de JSON.stringify manual
};*/

// Busca órdenes por estado e incluye cliente, dirección y productos en formato JSON.
// Order.findByStatus = async (status) => {
//   const sql = `
//     SELECT O.id,
//       O.id_client,
//       O.id_address,
//       O.id_delivery,
//       O.status,
//       O.timestamp,
// 	  JSON_AGG(
// 		JSON_BUILD_OBJECT(
// 			'id', P.id,
// 			'name', P.name,
// 			'description', P.description,
// 			'price', P.price,
// 			'image1', P.image1,
// 			'image2', P.image2,
// 			'image3', P.image3,	
// 			'quantity', OHP.quantity
// 		)
// 	  ) AS PRODUCTS,
	  
//       JSON_BUILD_OBJECT(
//         'id', U.id,
//         'name', U.name,
//         'lastname', U.lastname,
//         'image', U.image
//       ) AS client,
//       JSON_BUILD_OBJECT(
//         'id', A.id,
//         'address', A.address,
//         'neighborhood', A.neighborhood,
//         'lat', A.lat,
//         'lng', A.lng
//       ) AS address
//     FROM orders O
//       INNER JOIN users U ON O.id_client = U.id
//       INNER JOIN address A ON A.id = O.id_address
//       INNER JOIN orders_has_products OHP
//       ON OHP.id_order = O.id
//       INNER JOIN products P
//       ON P.id = OHP.id_product
//         WHERE status = $1
//       GROUP BY 
//       O.id, U.id, A.id;
//   `;

//   return db.manyOrNone(sql, [status]); // nada de JSON.stringify manual
// };

// Busca órdenes por estado e incluye cliente, delivery, dirección y productos en formato JSON.

Order.findByStatus = async (status) => {
  const sql = `
    SELECT O.id,
      O.id_client,
      O.id_address,
      O.id_delivery,
      O.status,
      O.timestamp,
	  JSON_AGG(
		JSON_BUILD_OBJECT(
			'id', P.id,
			'name', P.name,
			'description', P.description,
			'price', P.price,
			'image1', P.image1,
			'image2', P.image2,
			'image3', P.image3,	
			'quantity', OHP.quantity
		)
	  ) AS PRODUCTS,
      JSON_BUILD_OBJECT(
        'id', U.id,
        'name', U.name,
        'lastname', U.lastname,
        'image', U.image
      ) AS client,
	  JSON_BUILD_OBJECT(
        'id', DEL.id,
        'name', DEL.name,
        'lastname', DEL.lastname,
        'image', DEL.image
      ) AS delivery,
      JSON_BUILD_OBJECT(
        'id', A.id,
        'address', A.address,
        'neighborhood', A.neighborhood,
        'lat', A.lat,
        'lng', A.lng
      ) AS address
    FROM orders O
      INNER JOIN users U ON O.id_client = U.id
	    LEFT JOIN users DEL ON O.id_delivery = DEL.id
      INNER JOIN address A ON A.id = O.id_address
      INNER JOIN orders_has_products OHP
      ON OHP.id_order = O.id
      INNER JOIN products P
      ON P.id = OHP.id_product
        WHERE status = $1
      GROUP BY 
      O.id, U.id, A.id, DEL.id;
  `;

  return db.manyOrNone(sql, [status]); // nada de JSON.stringify manual
};

Order.getOrdersByDeliveryAndStatus = async (id_delivery, status) => {
  const sql = `
    SELECT O.id,
      O.id_client,
      O.id_address,
      O.id_delivery,
      O.status,
      O.timestamp,
	  JSON_AGG(
		JSON_BUILD_OBJECT(
			'id', P.id,
			'name', P.name,
			'description', P.description,
			'price', P.price,
			'image1', P.image1,
			'image2', P.image2,
			'image3', P.image3,	
			'quantity', OHP.quantity
		)
	  ) AS PRODUCTS,
      JSON_BUILD_OBJECT(
        'id', U.id,
        'name', U.name,
        'lastname', U.lastname,
        'image', U.image
      ) AS client,
	  JSON_BUILD_OBJECT(
        'id', DEL.id,
        'name', DEL.name,
        'lastname', DEL.lastname,
        'image', DEL.image
      ) AS delivery,
      JSON_BUILD_OBJECT(
        'id', A.id,
        'address', A.address,
        'neighborhood', A.neighborhood,
        'lat', A.lat,
        'lng', A.lng
      ) AS address
    FROM orders O
      INNER JOIN users U ON O.id_client = U.id
	    LEFT JOIN users DEL ON O.id_delivery = DEL.id
      INNER JOIN address A ON A.id = O.id_address
      INNER JOIN orders_has_products OHP
      ON OHP.id_order = O.id
      INNER JOIN products P
      ON P.id = OHP.id_product
        WHERE O.id_delivery = $1 AND status = $2
      GROUP BY 
      O.id, U.id, A.id, DEL.id;
  `;

  return db.manyOrNone(sql, [id_delivery, status]); // nada de JSON.stringify manual
};

Order.getOrdersByClientAndStatus = async (id_client, status) => {
  const sql = `
    SELECT O.id,
      O.id_client,
      O.id_address,
      O.id_delivery,
      O.status,
      O.timestamp,
	  JSON_AGG(
		JSON_BUILD_OBJECT(
			'id', P.id,
			'name', P.name,
			'description', P.description,
			'price', P.price,
			'image1', P.image1,
			'image2', P.image2,
			'image3', P.image3,	
			'quantity', OHP.quantity
		)
	  ) AS PRODUCTS,
      JSON_BUILD_OBJECT(
        'id', U.id,
        'name', U.name,
        'lastname', U.lastname,
        'image', U.image
      ) AS client,
	  JSON_BUILD_OBJECT(
        'id', DEL.id,
        'name', DEL.name,
        'lastname', DEL.lastname,
        'image', DEL.image
      ) AS delivery,
      JSON_BUILD_OBJECT(
        'id', A.id,
        'address', A.address,
        'neighborhood', A.neighborhood,
        'lat', A.lat,
        'lng', A.lng
      ) AS address
    FROM orders O
      INNER JOIN users U ON O.id_client = U.id
	    LEFT JOIN users DEL ON O.id_delivery = DEL.id
      INNER JOIN address A ON A.id = O.id_address
      INNER JOIN orders_has_products OHP
      ON OHP.id_order = O.id
      INNER JOIN products P
      ON P.id = OHP.id_product
        WHERE O.id_client = $1 AND status = $2
      GROUP BY 
      O.id, U.id, A.id, DEL.id;
  `;

  return db.manyOrNone(sql, [id_client, status]); // nada de JSON.stringify manual
};

Order.update = async (order) => {
  const sql = `
    UPDATE orders SET
      id_client = $1,
      id_address = $2,
      id_delivery = $3,
      status = $4,
      updated_at = $5
    WHERE id = $6;
  `;

  return await db.none(sql, [
    order.id_client,
    order.id_address,
    order.id_delivery || null,
    order.status,
    new Date(),
    order.id, // ID de la orden que se va a actualizar
  ]);
};

Order.updateLatLng = async (order) => {
  const sql = `
    UPDATE orders SET
      lat = $1,
      lng = $2,
      
    WHERE id = $3;
  `;

  return await db.none(sql, [
    order.lat,
    order.lng,
    order.id // ID de la orden que se va a actualizar
  ]);
};
module.exports = Order;