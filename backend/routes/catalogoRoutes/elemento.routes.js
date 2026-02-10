//Rutas de elementos

module.exports = app => {
  const elementos = require("../../controllers/catalogoControllers/elemento.controller.js");
  const auth = require("../../controllers/baseControllers/auth.js");

  var router = require("express").Router();

  // Crea un nuevo elemento
  router.post("/", auth.isAuthenticated, elementos.create);

  // Muestra todos los elementos
  router.get("/", auth.isAuthenticated, elementos.findAll);

  // Localiza un elemento por la id
  router.get("/:id", auth.isAuthenticated, elementos.findOne);

  // Actualiza un elemento por la id
  router.put("/:id", auth.isAuthenticated, elementos.update);

  // Borra un elemento por la id
  router.delete("/:id", auth.isAuthenticated, elementos.delete);

  app.use('/api/elemento', router);
};
