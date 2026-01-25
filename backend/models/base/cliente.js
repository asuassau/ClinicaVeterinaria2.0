'use strict';

module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define('Cliente', {
    idCliente: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nif: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellidos: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING(200)
    },
    telefono: {
      type: DataTypes.STRING(20)
    },
    email: {
      type: DataTypes.STRING(150)
    }
  }, {
    tableName: 'Clientes',
    timestamps: false
  });

  Cliente.associate = (models) => {
    Cliente.hasMany(models.Animal, { foreignKey: 'idCliente' });

    Cliente.belongsToMany(models.Usuario, {
      through: models.Consultan,
      foreignKey: 'idCliente',
      otherKey: 'idUsuario'
    });

    Cliente.belongsToMany(models.Usuario, {
      through: models.Atienden,
      foreignKey: 'idCliente',
      otherKey: 'idUsuario',
      as: 'UsuariosQueAtienden'
    });
  };

  return Cliente;
};
