//Rutas de productos

module.exports = app => {
  const productos = require("../../controllers/catalogoControllers/producto.controller.js");
  const auth = require("../../controllers/baseControllers/auth.js");

  var router = require("express").Router();

  // Crea un nuevo producto
  router.post("/", auth.isAuthenticated, productos.create);

  // Muestra todos los productos
  router.get("/", auth.isAuthenticated, productos.findAll);

  // Localiza un producto por la id (idElemento)
  router.get("/:id", auth.isAuthenticated, productos.findOne);

  // Actualiza un producto por la id (idElemento)
  router.put("/:id", auth.isAuthenticated, productos.update);

  // Borra un producto por la id (idElemento)
  router.delete("/:id", auth.isAuthenticated, productos.delete);

  app.use('/api/producto', router);
};
