//Rutas de animales

module.exports = app => {
  const animales = require("../../controllers/animalesControllers/animal.controller.js");
  const auth = require("../../controllers/baseControllers/auth.js");
  var upload = require('../../multer/upload.js');

  var router = require("express").Router();

  // Crea un nuevo animal
  router.post("/", auth.isAuthenticated, upload.single('file'), animales.create);

  // Muestra todos los animales
  router.get("/", auth.isAuthenticated, animales.findAll);

  // Localiza un animal por la id
  router.get("/:id", auth.isAuthenticated, animales.findOne);

  // Actualiza un animal por la id
  router.put("/:id", auth.isAuthenticated, upload.single('file'), animales.update);

  // Borra un animal por la id
  router.delete("/:id", auth.isAuthenticated, animales.delete);

  app.use('/api/animal', router);
};
