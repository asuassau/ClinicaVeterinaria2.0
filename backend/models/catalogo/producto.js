'use strict';

module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define('Producto', {
    idProducto: {
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
    unidadMedia: {
      type: DataTypes.STRING(50)
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stockMinimo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('medicacion', 'material', 'alimentacion', 'complementos'),
      allowNull: false
    }
  }, {
    tableName: 'Productos',
    timestamps: false
  });

  Producto.associate = (models) => {
    Producto.belongsToMany(models.Cita, {
      through: models.Incluyen,
      foreignKey: 'idProducto',
      otherKey: 'idCita'
    });

    Producto.belongsToMany(models.ServicioClinico, {
      through: models.Necesitan,
      foreignKey: 'idProducto',
      otherKey: 'idServicio'
    });

    Producto.belongsToMany(models.Pedido, {
      through: models.Realizan,
      foreignKey: 'idProducto',
      otherKey: 'idPedido'
    });

    Producto.hasMany(models.LineaFactura, { foreignKey: 'idProducto' });
    Producto.hasMany(models.LineaPedido, { foreignKey: 'idProducto' });
  };

  return Producto;
};
