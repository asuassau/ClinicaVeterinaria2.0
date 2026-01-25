'use strict';

module.exports = (sequelize, DataTypes) => {
  const LineaPedido = sequelize.define('LineaPedido', {
    idPedido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'Pedidos', key: 'idPedido' }
    },
    idProducto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'Productos', key: 'idProducto' }
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precioUnitario: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false
    }
  }, {
    tableName: 'LineasPedido',
    timestamps: false
  });

  LineaPedido.associate = (models) => {
    LineaPedido.belongsTo(models.Pedido, { foreignKey: 'idPedido' });
    LineaPedido.belongsTo(models.Producto, { foreignKey: 'idProducto' });
  };

  return LineaPedido;
};
