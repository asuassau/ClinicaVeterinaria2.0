module.exports = (app) => {
  const consultan = require("../controllers/consultan.controller.js");
  const auth = require("../controllers/auth.js");
  const router = require("express").Router();

  router.post("/", auth.isAuthenticated, consultan.create);
  router.get("/", auth.isAuthenticated, consultan.findAll);
  router.get("/:idUsuario/:idCliente", auth.isAuthenticated, consultan.findOne);
  router.delete("/:idUsuario/:idCliente", auth.isAuthenticated, consultan.delete);

  app.use("/api/consultan", router);
};
