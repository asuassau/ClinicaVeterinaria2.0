'use strict';

module.exports = (sequelize, DataTypes) => {
  const LineaFactura = sequelize.define('LineaFactura', {
    idLineaFactura: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fechaCreacion: { type: DataTypes.DATE, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    descuento: { type: DataTypes.DECIMAL(10,2), allowNull: true, defaultValue: 0 },
    importe: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
    precioUnitario: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    idFactura: { type: DataTypes.INTEGER, allowNull: false },
    idElemento: { type: DataTypes.INTEGER, allowNull: false },
    idUsuario_creador: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'LINEAS_FACTURA',
    timestamps: false
  });

  LineaFactura.associate = (models) => {
    LineaFactura.belongsTo(models.Factura, {
      foreignKey: 'idFactura',
      as: 'Factura',
      onDelete: 'CASCADE'
    });
    LineaFactura.belongsTo(models.Elemento, { foreignKey: 'idElemento', as: 'Elemento' });
    LineaFactura.belongsTo(models.Usuario, { foreignKey: 'idUsuario_creador', as: 'Creador' });
  };

  return LineaFactura;
};
