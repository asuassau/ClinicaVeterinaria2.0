module.exports = (app) => {
  const atienden = require("../controllers/atienden.controller.js");
  const auth = require("../controllers/auth.js");
  const router = require("express").Router();

  router.post("/", auth.isAuthenticated, atienden.create);
  router.get("/", auth.isAuthenticated, atienden.findAll);
  router.get("/:idUsuario/:idCliente", auth.isAuthenticated, atienden.findOne);
  router.delete("/:idUsuario/:idCliente", auth.isAuthenticated, atienden.delete);

  app.use("/api/atienden", router);
};
