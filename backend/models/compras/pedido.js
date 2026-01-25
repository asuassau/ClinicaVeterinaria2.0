'use strict';

module.exports = (sequelize, DataTypes) => {
  const Pedido = sequelize.define('Pedido', {
    idPedido: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fechaPedido: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    proveedor: {
      type: DataTypes.STRING(150)
    },
    estado: {
      type: DataTypes.STRING(50)
    }
  }, {
    tableName: 'Pedidos',
    timestamps: false
  });

  Pedido.associate = (models) => {
    Pedido.hasMany(models.LineaPedido, { foreignKey: 'idPedido' });
  };

  return Pedido;
};
