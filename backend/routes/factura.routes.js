module.exports = (app) => {
  const factura = require("../controllers/factura.controller.js");
  const auth = require("../controllers/auth.js");
  const router = require("express").Router();

  router.post("/", auth.isAuthenticated, factura.create);
  router.get("/", auth.isAuthenticated, factura.findAll);
  router.get("/:id", auth.isAuthenticated, factura.findOne);
  router.put("/:id", auth.isAuthenticated, factura.update);
  router.delete("/:id", auth.isAuthenticated, factura.delete);

  app.use("/api/factura", router);
};
