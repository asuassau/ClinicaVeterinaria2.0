'use strict';

module.exports = (sequelize, DataTypes) => {
  const Factura = sequelize.define('Factura', {
    idFactura: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    formaPago: {
      type: DataTypes.STRING(50)
    },
    estado: {
      type: DataTypes.STRING(50)
    },
    idCita: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Citas', key: 'idCita' }
    }
  }, {
    tableName: 'Facturas',
    timestamps: false
  });

  Factura.associate = (models) => {
    Factura.belongsTo(models.Cita, { foreignKey: 'idCita' });
    Factura.hasMany(models.LineaFactura, { foreignKey: 'idFactura' });
  };

  return Factura;
};
