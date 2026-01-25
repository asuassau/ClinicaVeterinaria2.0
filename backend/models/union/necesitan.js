'use strict';

module.exports = (sequelize, DataTypes) => {
  const Necesitan = sequelize.define('Necesitan', {
    idProducto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'Productos', key: 'idProducto' }
    },
    idServicio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'ServicioClinico', key: 'idServicio' }
    }
  }, {
    tableName: 'Necesitan',
    timestamps: false
  });

  return Necesitan;
};
