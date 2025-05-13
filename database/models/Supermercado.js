module.exports = (sequelize, DataTypes) => {
  const Supermercado = sequelize.define('Supermercado', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(60),
      allowNull: false
    }
  }, {
    tableName: 'supermercados',
    timestamps: false
  });

  Supermercado.associate = function(models) {
    Supermercado.hasMany(models.ProductoSuper, {
      foreignKey: 'supermercado_id',
      as: 'productos_super'
    });
  };

  return Supermercado;
};
