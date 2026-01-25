'use strict';

module.exports = (sequelize, DataTypes) => {
  const Realizan = sequelize.define('Realizan', {
    idProducto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'Productos', key: 'idProducto' }
    },
    idPedido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'Pedidos', key: 'idPedido' }
    }
  }, {
    tableName: 'Realizan',
    timestamps: false
  });

  return Realizan;
};
