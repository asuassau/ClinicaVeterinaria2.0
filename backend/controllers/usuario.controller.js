// importas el modelo y creas un objeto
const db = require("../models");
const User = db.usuario;


//importa bcrypt para gestionar tokens 
const  bcrypt  =  require('bcryptjs');


//crea un nuevo usuario

exports.create = async (req, res) => {
  try {
    if (!req.body.contrasena || !req.body.email) {
      return res.status(400).send({ message: "No puede estar vacío" });
    }

    const user = {
      nombre: req.body.nombre,
      email: req.body.email,
      rol:req.body.rol
     // filename: req.file ? req.file.filename : ""
    };

    // hash seguro (10 salt rounds)
    user.contrasena = await bcrypt.hash(String(req.body.contrasena), 10);

    const data = await User.create(user);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({
      message: err.message || "El usuario no se ha creado correctamente."
    });
  }
};


// Muestra todos los usuarios

exports.findAll = (req, res) => {
  User.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ha ocurrido un error y no es posible mostrar los usuarios"
      });
    });
};

// localiza a un usuario por su ID y lo devuelve

exports.findOne = (req, res) => {
  const idUsuario = req.params.id;

  User.findByPk(idUsuario)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `No se ha podido localizar el usuario con  id=${idUsuario} .`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error al obtner el usuario con id= " + idUsuario
      });
    });

};


// actualiza a un usuario identificado por su id

exports.update = async (req, res) => {
  try {
    const idUsuario = req.params.id;
    /* const removeImage =
      req.body.removeImage === true ||
      req.body.removeImage === 'true' ||
      req.body.removeImage === '1' ||
      req.body.removeImage === 1;*/

    const data = {
      nombre: req.body.nombre,
      email: req.body.email,
      rol:req.body.rol
    };


    // Si viene password se hashea 
    if (req.body.contrasena) {
      data.contrasena = await bcrypt.hash(String(req.body.contrasena), 10);

    }

    /*if (req.file) {
      data.filename = req.file.filename;
    }

    if (removeImage){
      data.filename=null;
    }*/

    const num = await User.update(data, { where: { idUsuario } });

    if (num == 1) {
      return res.send({
        message: "El usuario se ha actualizado correctamente"

        
      });
    }

    return res.send({
      message: `No ha sido posible actualizar el usuario con id=${idUsuario}.`
    });

  } catch (err) {
    return res.status(500).send({
      message: "Error actualizando el usuario con id=" + idUsuario
    });
  }
};
// Borra un usuario concreto identificado por su id . 
exports.delete = (req, res) => {
  const idUsuario = req.params.id;

  User.destroy({
    where: { idUsuario: idUsuario }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "El usuario se ha eliminado correctamente!"
        });
      } else {
        res.send({
          message: `No ha sido posible eliminar el usuario con id=${idUsuario}. Es posible que no se encuentre!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "No ha sido posible eliminar el usuario con id=" + idUsuario
      });
    });
};


