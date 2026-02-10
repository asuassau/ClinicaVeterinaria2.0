'use strict';

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    idUsuario: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nif: { type: DataTypes.STRING(20), allowNull: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    apellidos: { type: DataTypes.STRING(150), allowNull: true },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    telefono: { type: DataTypes.STRING(30), allowNull: true },
    direccion: { type: DataTypes.STRING(255), allowNull: true },
    contrasena: { type: DataTypes.STRING(255), allowNull: false },
    foto: { type: DataTypes.STRING(255), allowNull: true },
    rol: {
      type: DataTypes.ENUM('administrador', 'veterinario', 'recepcionista', 'cliente'),
      allowNull: false
    }
  }, {
    tableName: 'USUARIOS',
    timestamps: false
  });

  Usuario.associate = (models) => {
    Usuario.hasMany(models.Animal, { foreignKey: 'idUsuario', as: 'Animales' });

    Usuario.hasMany(models.LineaHistorial, { foreignKey: 'idUsuario', as: 'LineasHistorialCreadas' });

    Usuario.hasMany(models.Cita, { foreignKey: 'idUsuario_programa', as: 'CitasProgramadas' });
    Usuario.hasMany(models.Cita, { foreignKey: 'idUsuario_atiende', as: 'CitasAtendidas' });

    Usuario.hasMany(models.Factura, { foreignKey: 'idUsuario_pagador', as: 'FacturasPagadas' });
    Usuario.hasMany(models.Factura, { foreignKey: 'idUsuario_emisor', as: 'FacturasEmitidas' });

    Usuario.hasMany(models.LineaFactura, { foreignKey: 'idUsuario_creador', as: 'LineasFacturaCreadas' });
  };

  return Usuario;
};
