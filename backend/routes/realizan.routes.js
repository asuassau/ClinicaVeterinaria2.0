module.exports = (app) => {
  const realizan = require("../controllers/realizan.controller.js");
  const auth = require("../controllers/auth.js");
  const router = require("express").Router();

  router.post("/", auth.isAuthenticated, realizan.create);
  router.get("/", auth.isAuthenticated, realizan.findAll);
  router.get("/:idProducto/:idPedido", auth.isAuthenticated, realizan.findOne);
  router.delete("/:idProducto/:idPedido", auth.isAuthenticated, realizan.delete);

  app.use("/api/realizan", router);
};
