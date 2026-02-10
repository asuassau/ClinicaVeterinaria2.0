'use strict';

module.exports = (sequelize, DataTypes) => {
  const Cita = sequelize.define('Cita', {
    idCita: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    HoraIni: { type: DataTypes.TIME, allowNull: false },
    HoraFin: { type: DataTypes.TIME, allowNull: false },
    motivo: { type: DataTypes.STRING(255), allowNull: true },
    estado: {
      type: DataTypes.ENUM('pendiente', 'confirmada', 'atendida', 'cancelada'),
      allowNull: false
    },
    notas: { type: DataTypes.TEXT, allowNull: true },
    idAnimal: { type: DataTypes.INTEGER, allowNull: false },
    idUsuario_programa: { type: DataTypes.INTEGER, allowNull: false },
    idUsuario_atiende: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'CITAS',
    timestamps: false
  });

  Cita.associate = (models) => {
    Cita.belongsTo(models.Animal, { foreignKey: 'idAnimal', as: 'Animal' });
    Cita.belongsTo(models.Usuario, { foreignKey: 'idUsuario_programa', as: 'Programador' });
    Cita.belongsTo(models.Usuario, { foreignKey: 'idUsuario_atiende', as: 'Veterinario' });
  };

  return Cita;
};
