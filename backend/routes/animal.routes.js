module.exports = (app) => {
  const animal = require("../controllers/animal.controller.js");
  const auth = require("../controllers/auth.js");
  const router = require("express").Router();

  router.post("/", auth.isAuthenticated, animal.create);
  router.get("/", auth.isAuthenticated, animal.findAll);
  router.get("/:id", auth.isAuthenticated, animal.findOne);
  router.put("/:id", auth.isAuthenticated, animal.update);
  router.delete("/:id", auth.isAuthenticated, animal.delete);

  app.use("/api/animal", router);
};
