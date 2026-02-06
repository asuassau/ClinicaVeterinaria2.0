module.exports = (app) => {
  const incluyen = require("../controllers/incluyen.controller.js");
  const auth = require("../controllers/auth.js");
  const router = require("express").Router();

  router.post("/", auth.isAuthenticated, incluyen.create);
  router.get("/", auth.isAuthenticated, incluyen.findAll);
  router.get("/:idCita/:idProducto", auth.isAuthenticated, incluyen.findOne);
  router.delete("/:idCita/:idProducto", auth.isAuthenticated, incluyen.delete);

  app.use("/api/incluyen", router);
};
