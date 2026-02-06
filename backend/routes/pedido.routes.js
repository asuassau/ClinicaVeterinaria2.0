module.exports = (app) => {
  const pedido = require("../controllers/pedido.controller.js");
  const auth = require("../controllers/auth.js");
  const router = require("express").Router();

  router.post("/", auth.isAuthenticated, pedido.create);
  router.get("/", auth.isAuthenticated, pedido.findAll);
  router.get("/:id", auth.isAuthenticated, pedido.findOne);
  router.put("/:id", auth.isAuthenticated, pedido.update);
  router.delete("/:id", auth.isAuthenticated, pedido.delete);

  app.use("/api/pedido", router);
};
