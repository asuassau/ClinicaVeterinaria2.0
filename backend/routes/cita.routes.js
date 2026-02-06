module.exports = (app) => {
  const cita = require("../controllers/cita.controller.js");
  const auth = require("../controllers/auth.js");
  const router = require("express").Router();

  router.post("/", auth.isAuthenticated, cita.create);
  router.get("/", auth.isAuthenticated, cita.findAll);
  router.get("/:id", auth.isAuthenticated, cita.findOne);
  router.put("/:id", auth.isAuthenticated, cita.update);
  router.delete("/:id", auth.isAuthenticated, cita.delete);

  app.use("/api/cita", router);
};
