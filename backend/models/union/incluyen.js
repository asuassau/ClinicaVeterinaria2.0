'use strict';

module.exports = (sequelize, DataTypes) => {
  const Incluyen = sequelize.define('Incluyen', {
    idCita: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'Citas', key: 'idCita' }
    },
    idProducto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'Productos', key: 'idProducto' }
    }
  }, {
    tableName: 'Incluyen',
    timestamps: false
  });

  return Incluyen;
};
