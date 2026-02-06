// generate token using secret from process.env.JWT_SECRET
var jwt = require('jsonwebtoken');
 
// generate token para usuario y lo devulve 
function generateToken(user) {

  
  if (!user) {
    return null;
  } 
  var u = {
    idUsuario: user.idUsuario,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
   // contrasena: user.contrasena
  };


  // valida el codigo secreto presente en .env y si el valido genera un token 
  return jwt.sign(u, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 // expira 24 horas
  });
}
 
// devuelve los datos del usuario sin token
function getCleanUser(user) {
  if (!user) return null;
 
  return {
    idUsuario: user.idUsuario,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
   // contrasena: user.contrasena
  };
}
 
module.exports = {
  generateToken,
  getCleanUser
}