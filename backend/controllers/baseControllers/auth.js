// se importa librería para la gestión de token
const jwt = require('jsonwebtoken');
//importa utils (en donde esta presente la función para la asignación de token )
const utils = require('../../utils.js');
//importa bcrypt (presente en node modules.)
const bcrypt = require('bcryptjs');

// importación del modelo usuarios y creación de un objeto 
const db = require("../../models/index.js");
const User = db.Usuario;


exports.signin = (req, res) => {
  const user = req.body.email;
  const pwd = req.body.contrasena;

  // devuelve error sin no hay usuario o contraseña 
  if (!user || !pwd) {
    return res.status(400).json({
      error: true,
      message: "Username or Password required."
    });
  }

  //devuelve error si el usuario o contraseña no concuerdan
  User.findOne({ where: { email: user } })
    .then(data => {

       //devuelve error si el usuario o contraseña no concuerdan
      if (!data) return res.status(401).send("Invalid credentials!");

      const result = bcrypt.compareSync(pwd, data.contrasena);

      if(!result) return  res.status(401).send('Invalid credentials!');

      // genera token 
      const token = utils.generateToken(data);
      // devuelve datos del usuario
      const userObj = utils.getCleanUser(data);
      // devuelve token y usuario
      return res.json({usuario: userObj, access_token: token });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error while signing in."
      });
    });
};


exports.isAuthenticated = (req, res, next) => {
 

  var token = req.token;
  //Verifica si existe un token en la request.
  if (!token) {
    return res.status(401).json({
      error: true,
      message: "Token is required."
    });
  }
  //verifica el token , devuelve en el callback si hay algun error y los datos del usuario.
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) return res.status(401).json({
      error: true,
      message: "Invalid token."
    });

    User.findByPk(user.idUsuario)
      .then(data => {

        if (!data) {
          return res.status(401).json({
            error: true,
            message: "Invalid user."
          });
        }
        req.user = data; 
        next();
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with id=" + user.idUsuario
        });
      });
  });
};