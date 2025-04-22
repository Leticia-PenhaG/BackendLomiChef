const db = require('../config/config');

const Address = {};

Address.create = async (address) => {
  const sql = `
    INSERT INTO address (
      id_user,
      address,
      neighborhood,
      lat,
      lng,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING id;
  `;

  const values = [
    address.id_user,
    address.address,
    address.neighborhood,
    address.lat,
    address.lng
  ];

  return await db.one(sql, values); // devuelve un objeto { id: ... }
};

Address.findByUser = (id_user) => {
  const sql = `
    SELECT 
      id,
      id_user,
      address,
      neighborhood,
      lat,
      lng
    FROM 
      address
    WHERE 
      id_user = $1
  `;
  return db.manyOrNone(sql, id_user);
};


module.exports = Address;