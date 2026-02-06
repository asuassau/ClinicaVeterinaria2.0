module.exports = (app) => {
  const lineaPedido = require("../controllers/lineaPedido.controller.js");
  const auth = require("../controllers/auth.js");
  const router = require("express").Router();

  router.post("/", auth.isAuthenticated, lineaPedido.create);
  router.get("/", auth.isAuthenticated, lineaPedido.findAll);
  router.get("/:idPedido/:idProducto", auth.isAuthenticated, lineaPedido.findOne);
  router.put("/:idPedido/:idProducto", auth.isAuthenticated, lineaPedido.update);
  router.delete("/:idPedido/:idProducto", auth.isAuthenticated, lineaPedido.delete);

  app.use("/api/linea-pedido", router);
};
