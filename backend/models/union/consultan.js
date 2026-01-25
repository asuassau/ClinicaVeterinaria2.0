'use strict';

module.exports = (sequelize, DataTypes) => {
  const Consultan = sequelize.define('Consultan', {
    idUsuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'Usuarios', key: 'idUsuario' }
    },
    idCliente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'Clientes', key: 'idCliente' }
    }
  }, {
    tableName: 'Consultan',
    timestamps: false
  });

  return Consultan;
};
