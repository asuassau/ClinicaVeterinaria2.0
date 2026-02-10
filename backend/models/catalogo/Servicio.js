'use strict';

module.exports = (sequelize, DataTypes) => {
  const Servicio = sequelize.define('Servicio', {
    idElemento: { type: DataTypes.INTEGER, primaryKey: true },
    tipoServicio: {
      type: DataTypes.ENUM('CONSULTA', 'PRUEBA', 'CIRUGIA', 'VACUNACION'),
      allowNull: false
    }
  }, {
    tableName: 'SERVICIOS',
    timestamps: false
  });

  Servicio.associate = (models) => {
    Servicio.belongsTo(models.Elemento, { foreignKey: 'idElemento', as: 'Elemento' });
  };

  return Servicio;
};

