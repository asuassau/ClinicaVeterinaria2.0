'use strict';

module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define('Producto', {
    idElemento: { type: DataTypes.INTEGER, primaryKey: true },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    stockMinimo: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    tipo: {
      type: DataTypes.ENUM('medicamento', 'material', 'alimentacion', 'complementos'),
      allowNull: false
    },
    foto: { type: DataTypes.STRING(255), allowNull: true }
  }, {
    tableName: 'PRODUCTOS',
    timestamps: false
  });

  Producto.associate = (models) => {
    Producto.belongsTo(models.Elemento, { foreignKey: 'idElemento', as: 'Elemento' });
  };

  return Producto;
};
