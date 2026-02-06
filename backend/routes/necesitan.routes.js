module.exports = (app) => {
  const necesitan = require("../controllers/necesitan.controller.js");
  const auth = require("../controllers/auth.js");
  const router = require("express").Router();

  router.post("/", auth.isAuthenticated, necesitan.create);
  router.get("/", auth.isAuthenticated, necesitan.findAll);
  router.get("/:idProducto/:idServicio", auth.isAuthenticated, necesitan.findOne);
  router.delete("/:idProducto/:idServicio", auth.isAuthenticated, necesitan.delete);

  app.use("/api/necesitan", router);
};
