module.exports = (app) => {
  const lineaFactura = require("../controllers/lineaFactura.controller.js");
  const auth = require("../controllers/auth.js");
  const router = require("express").Router();

  router.post("/", auth.isAuthenticated, lineaFactura.create);
  router.get("/", auth.isAuthenticated, lineaFactura.findAll);
  router.get("/:idFactura/:idProducto", auth.isAuthenticated, lineaFactura.findOne);
  router.put("/:idFactura/:idProducto", auth.isAuthenticated, lineaFactura.update);
  router.delete("/:idFactura/:idProducto", auth.isAuthenticated, lineaFactura.delete);

  app.use("/api/linea-factura", router);
};
