//Rutas de usuarios

module.exports = app => {
    const users = require("../controllers/usuario.controller.js");
    //var upload = require('../multer/upload');
    const auth = require("../controllers/auth.js");
  
    var router = require("express").Router();
  
    // Crea un nuevo usuario
    router.post("/",auth.isAuthenticated,/*upload.single('file'),*/users.create);
  
    // Muestra todos los usuarios
    router.get("/", auth.isAuthenticated, users.findAll);
    
    // Localiza un usuario por la id
    router.get("/:id", auth.isAuthenticated, users.findOne);
  
    // Actualiza un usuario por la id
    router.put("/:id", auth.isAuthenticated,/*upload.single('file'),*/ users.update);

    // Autentificación de usuario
    router.post("/signin", auth.signin);
  
    // Borra un usuario por la id
    router.delete("/:id",auth.isAuthenticated, users.delete);
  
  
    app.use('/api/usuario', router);
  };