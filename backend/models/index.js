'use strict';

// Configuración BD
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

// Instancia Sequelize
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: false,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

// Contenedor de modelos
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


// CARGA DE MODELOS

// Base
db.Usuario = require("./base/usuario.js")(sequelize, Sequelize);

// Animales
db.Animal = require("./animales/animal.js")(sequelize, Sequelize);

// Historial
db.Historial = require("./historiales/historial.js")(sequelize, Sequelize);
db.LineaHistorial = require("./historiales/lineaHistorial.js")(sequelize, Sequelize);

// Citas
db.Cita = require("./citas/cita.js")(sequelize, Sequelize);

// Catálogo
db.Elemento = require("./catalogo/elemento.js")(sequelize, Sequelize);
db.Producto = require("./catalogo/producto.js")(sequelize, Sequelize);
db.Servicio = require("./catalogo/Servicio.js")(sequelize, Sequelize);

// Facturación
db.Factura = require("./facturacion/factura.js")(sequelize, Sequelize);
db.LineaFactura = require("./facturacion/lineaFactura.js")(sequelize, Sequelize);


// EJECUCIÓN DE ASOCIACIONES

Object.keys(db).forEach(modelName => {
  if (db[modelName] && typeof db[modelName].associate === "function") {
    db[modelName].associate(db);
  }
});

module.exports = db;
