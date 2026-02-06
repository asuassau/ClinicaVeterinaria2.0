module.exports = (app) => {
  const producto = require("../controllers/producto.controller.js");
  const auth = require("../controllers/auth.js");
  const router = require("express").Router();

  router.post("/", auth.isAuthenticated, producto.create);
  router.get("/", auth.isAuthenticated, producto.findAll);
  router.get("/:id", auth.isAuthenticated, producto.findOne);
  router.put("/:id", auth.isAuthenticated, producto.update);
  router.delete("/:id", auth.isAuthenticated, producto.delete);

  app.use("/api/producto", router);
};
