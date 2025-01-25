module.exports = {
    secretOrKey:  '2nHtZjRrVbMt7Kf6Rf9JcXN2bGcLwzFfH2qB6zTwNx3BmXyB9Tb6YrH8ZxL5H3Pb;'
}


///////////45645456456546+++++++++++++++
/*const jwt = require('jsonwebtoken');

const SECRET_KEY = '2nHtZjRrVbMt7Kf6Rf9JcXN2bGcLwzFfH2qB6zTwNx3BmXyB9Tb6YrH8ZxL5H3Pb';

// Generar un token
function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }); // 1 hora de validez
}

// Verificar un token
function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    console.error('Token inválido:', err.message);
    return null;
  }
}

// Ejemplo de uso
const token = generateToken({ userId: 123 });
console.log('Token:', token);

const data = verifyToken(token);
console.log('Datos decodificados:', data);*/