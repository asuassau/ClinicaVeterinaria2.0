module.exports = (app) => {
  const servicioClinico = require("../controllers/servicioClinico.controller.js");
  const auth = require("../controllers/auth.js");
  const router = require("express").Router();

  router.post("/", auth.isAuthenticated, servicioClinico.create);
  router.get("/", auth.isAuthenticated, servicioClinico.findAll);
  router.get("/:id", auth.isAuthenticated, servicioClinico.findOne);
  router.put("/:id", auth.isAuthenticated, servicioClinico.update);
  router.delete("/:id", auth.isAuthenticated, servicioClinico.delete);

  app.use("/api/servicio-clinico", router);
};
