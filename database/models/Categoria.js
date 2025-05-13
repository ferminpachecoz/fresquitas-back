module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'categorias',
    timestamps: false
  });

  Categoria.associate = function(models) {
    Categoria.hasMany(models.Producto, {
      foreignKey: 'categoria_id',
      as: 'productos'
    });
  };

  return Categoria;
};
