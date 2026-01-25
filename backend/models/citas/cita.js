'use strict';

module.exports = (sequelize, DataTypes) => {
  const Cita = sequelize.define('Cita', {
    idCita: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fechaHora: {
      type: DataTypes.DATE,
      allowNull: false
    },
    motivo: {
      type: DataTypes.STRING(255)
    },
    estado: {
      type: DataTypes.STRING(50)
    },
    tipo: {
      type: DataTypes.ENUM('consulta', 'vacuna', 'revision'),
      allowNull: false
    },
    idAnimal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Animales', key: 'idAnimal' }
    },
    idServicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'ServicioClinico', key: 'idServicio' }
    }
  }, {
    tableName: 'Citas',
    timestamps: false
  });

  Cita.associate = (models) => {
    Cita.belongsTo(models.Animal, { foreignKey: 'idAnimal' });
    Cita.belongsTo(models.ServicioClinico, { foreignKey: 'idServicio' });

    Cita.belongsToMany(models.Producto, {
      through: models.Incluyen,
      foreignKey: 'idCita',
      otherKey: 'idProducto'
    });

    Cita.hasOne(models.Factura, { foreignKey: 'idCita' });
  };

  return Cita;
};
