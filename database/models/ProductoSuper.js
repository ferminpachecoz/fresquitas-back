module.exports = (sequelize, DataTypes) => {
  const ProductoSuper = sequelize.define('ProductoSuper', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    precioxlitro: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    supermercado_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    descuentos: {
      type: DataTypes.STRING(105),
      allowNull: true
    },
    imagen_url:{
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'productos_super',
    timestamps: false
  });

  ProductoSuper.associate = function(models) {
    ProductoSuper.belongsTo(models.Supermercado, {
      foreignKey: 'supermercado_id',
      as: 'supermercado'
    });
    ProductoSuper.belongsTo(models.Producto, {
      foreignKey: 'producto_id',
      as: 'producto'
    });
  };

  return ProductoSuper;
};
