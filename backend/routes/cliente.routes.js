module.exports = (app) => {
  const cliente = require("../controllers/cliente.controller.js");
  const auth = require("../controllers/auth.js");
  const router = require("express").Router();

  router.post("/", auth.isAuthenticated, cliente.create);
  router.get("/", auth.isAuthenticated, cliente.findAll);
  router.get("/:id", auth.isAuthenticated, cliente.findOne);
  router.put("/:id", auth.isAuthenticated, cliente.update);
  router.delete("/:id", auth.isAuthenticated, cliente.delete);

  app.use("/api/cliente", router);
};
