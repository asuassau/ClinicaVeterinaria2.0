'use strict';

module.exports = (sequelize, DataTypes) => {
  const LineaHistorial = sequelize.define('LineaHistorial', {
    idLineaHistorial: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fechaCreacion: { type: DataTypes.DATE, allowNull: false },
    fechaEdicion: { type: DataTypes.DATE, allowNull: true },
    peso: { type: DataTypes.DECIMAL(6,2), allowNull: true },
    tipo: {
      type: DataTypes.ENUM('diagnóstico', 'tratamiento', 'observación'),
      allowNull: false
    },
    descripcion: { type: DataTypes.TEXT, allowNull: false },
    idHistorial: { type: DataTypes.INTEGER, allowNull: false },
    idUsuario: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'LINEAS_HISTORIAL',
    timestamps: false
  });

  LineaHistorial.associate = (models) => {
    LineaHistorial.belongsTo(models.Historial, { foreignKey: 'idHistorial', as: 'Historial' });
    LineaHistorial.belongsTo(models.Usuario, { foreignKey: 'idUsuario', as: 'Autor' });
  };

  return LineaHistorial;
};
