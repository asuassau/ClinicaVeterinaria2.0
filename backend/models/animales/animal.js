'use strict';

module.exports = (sequelize, DataTypes) => {
  const Animal = sequelize.define('Animal', {
    idAnimal: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    edad: {
      type: DataTypes.INTEGER
    },

    sexo: {
      type: DataTypes.ENUM('M', 'H')
    },

    raza: {
      type: DataTypes.STRING(100)
    },

    especie: {
      type: DataTypes.STRING(100)
    },

    pesoActual: {
      type: DataTypes.DECIMAL(6, 2)
    },

    fechaAtencion: {
      type: DataTypes.DATEONLY
    },

    motivoAtencion: {
      type: DataTypes.STRING(255)
    },

    fotoUrl: {
      type: DataTypes.STRING(255)
    },

    idCliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Clientes',
        key: 'idCliente'
      }
    }

  }, {
    tableName: 'Animales',
    timestamps: false
  });


  
  Animal.associate = (models) => {
    // Un cliente puede tener muchos animales
    Animal.belongsTo(models.Cliente, { foreignKey: 'idCliente' });

    // Un animal puede tener muchas citas
    Animal.hasMany(models.Cita, { foreignKey: 'idAnimal' });
  };

  return Animal;
};
