'use strict';

module.exports = (sequelize, DataTypes) => {
  const LineaFactura = sequelize.define('LineaFactura', {
    idFactura: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'Facturas', key: 'idFactura' }
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
    },
    tipo: {
      type: DataTypes.ENUM('servicio', 'producto'),
      allowNull: false
    }
  }, {
    tableName: 'LineasFactura',
    timestamps: false
  });

  LineaFactura.associate = (models) => {
    LineaFactura.belongsTo(models.Factura, { foreignKey: 'idFactura' });
    LineaFactura.belongsTo(models.Producto, { foreignKey: 'idProducto' });
  };

  return LineaFactura;
};
