'use strict';

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    idUsuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    contrasena: { 
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rol: {
      type: DataTypes.ENUM('veterinario', 'administrativo', 'recepcionista'),
      allowNull: false
    }
  }, {
    tableName: 'Usuarios',
    timestamps: false
  });

  Usuario.associate = (models) => {
    Usuario.belongsToMany(models.Cliente, {
      through: models.Consultan,
      foreignKey: 'idUsuario',
      otherKey: 'idCliente'
    });

    Usuario.belongsToMany(models.Cliente, {
      through: models.Atienden,
      foreignKey: 'idUsuario',
      otherKey: 'idCliente',
      as: 'ClientesAtendidos'
    });
  };

  return Usuario;
};
