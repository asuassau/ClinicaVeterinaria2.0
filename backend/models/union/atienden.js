'use strict';

module.exports = (sequelize, DataTypes) => {
  const Atienden = sequelize.define('Atienden', {
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
    tableName: 'Atienden',
    timestamps: false
  });

  return Atienden;
};
