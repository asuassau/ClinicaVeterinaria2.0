'use strict';

module.exports = (sequelize, DataTypes) => {
  const Historial = sequelize.define('Historial', {
    idHistorial: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fechaAlta: { type: DataTypes.DATEONLY, allowNull: false },
    estado: { type: DataTypes.ENUM('Activo', 'Inactivo'), allowNull: false },
    idAnimal: { type: DataTypes.INTEGER, allowNull: false, unique: true }
  }, {
    tableName: 'HISTORIALES',
    timestamps: false
  });

  Historial.associate = (models) => {
    Historial.belongsTo(models.Animal, { foreignKey: 'idAnimal', as: 'Animal' });
    Historial.hasMany(models.LineaHistorial, { foreignKey: 'idHistorial', as: 'Lineas' });
  };

  return Historial;
};
