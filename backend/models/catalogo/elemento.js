'use strict';

module.exports = (sequelize, DataTypes) => {
  const Elemento = sequelize.define('Elemento', {
    idElemento: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    precio: { type: DataTypes.DECIMAL(10,2), allowNull: false }
  }, {
    tableName: 'ELEMENTOS',
    timestamps: false
  });

  Elemento.associate = (models) => {
    Elemento.hasOne(models.Producto, { foreignKey: 'idElemento', as: 'Producto' });
    Elemento.hasOne(models.Servicio, { foreignKey: 'idElemento', as: 'Servicio' });
    Elemento.hasMany(models.LineaFactura, { foreignKey: 'idElemento', as: 'LineasFactura' });
  };

  return Elemento;
};
