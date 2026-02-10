'use strict';

module.exports = (sequelize, DataTypes) => {
  const Factura = sequelize.define('Factura', {
    idFactura: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fechaCreacion: { type: DataTypes.DATE, allowNull: false },
    FechaPago: { type: DataTypes.DATE, allowNull: true },
    total: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
    descPct: { type: DataTypes.DECIMAL(5,2), allowNull: true, defaultValue: 0 },
    impuestoPct: { type: DataTypes.DECIMAL(5,2), allowNull: true, defaultValue: 0 },
    estado: {
      type: DataTypes.ENUM('Creada', 'Emitida', 'Pagada', 'cancelada'),
      allowNull: false
    },
    formaPago: {
      type: DataTypes.ENUM('efectivo', 'tarjeta', 'bizum', 'transferencia'),
      allowNull: true
    },
    n_factura: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    idUsuario_pagador: { type: DataTypes.INTEGER, allowNull: false },
    idUsuario_emisor: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'FACTURAS',
    timestamps: false
  });

  Factura.associate = (models) => {
    Factura.belongsTo(models.Usuario, { foreignKey: 'idUsuario_pagador', as: 'Pagador' });
    Factura.belongsTo(models.Usuario, { foreignKey: 'idUsuario_emisor', as: 'Emisor' });
    Factura.hasMany(models.LineaFactura, { foreignKey: 'idFactura', as: 'Lineas' });
  };

  return Factura;
};
