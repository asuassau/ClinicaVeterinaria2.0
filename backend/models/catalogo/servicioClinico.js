'use strict';

module.exports = (sequelize, DataTypes) => {
  const ServicioClinico = sequelize.define('ServicioClinico', {
    idServicio: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255)
    },
    precio: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false
    },
    tipoServicio: {
      type: DataTypes.ENUM('consulta', 'prueba', 'cirugia', 'vacuna'),
      allowNull: false
    }
  }, {
    tableName: 'ServicioClinico',
    timestamps: false
  });

  ServicioClinico.associate = (models) => {
    ServicioClinico.hasMany(models.Cita, { foreignKey: 'idServicio' });

    ServicioClinico.belongsToMany(models.Producto, {
      through: models.Necesitan,
      foreignKey: 'idServicio',
      otherKey: 'idProducto'
    });
  };

  return ServicioClinico;
};
