'use strict';

module.exports = (sequelize, DataTypes) => {
  const Animal = sequelize.define('Animal', {
    idAnimal: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    especie: { type: DataTypes.STRING(50), allowNull: false },
    raza: { type: DataTypes.STRING(80), allowNull: true },
    Fechanac: { type: DataTypes.DATEONLY, allowNull: true },
    sexo: { type: DataTypes.ENUM('M', 'H'), allowNull: true },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
    foto: { type: DataTypes.STRING(255), allowNull: true },
    idUsuario: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'ANIMALES',
    timestamps: false
  });

  Animal.associate = (models) => {
    Animal.belongsTo(models.Usuario, { foreignKey: 'idUsuario', as: 'Dueno' });
    Animal.hasOne(models.Historial, { foreignKey: 'idAnimal', as: 'Historial' });
    Animal.hasMany(models.Cita, { foreignKey: 'idAnimal', as: 'Citas' });
  };

  return Animal;
};
