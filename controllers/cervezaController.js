const { getDB } = require("../db/mongo.js");
const cervezaController = {
  // 1. Cervezas más baratas global o por supermercado
  listarBaratas: async (req, res) => {
    const db = getDB();
    const collection = db.collection("productos");

    const {
      page = 1,
      limit = 12,
      supermercado = '',
      query = ''
    } = req.query;

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;

    try {
      const filtros = {};

      if (supermercado) {
        filtros.Supermercado = { $regex: supermercado, $options: "i" };
      }

      if (query) {
        filtros["nombre"] = { $regex: query, $options: "i" };
      }

      const total = await collection.countDocuments(filtros);
      const pages = Math.ceil(total / limitInt);

      const resultados = await collection.find(filtros)
        .sort({ "precioLitro": 1 })
        .skip(skip)
        .limit(limitInt)
        .toArray();

      const respuesta = resultados.map(p => ({
        producto: p["nombre"],
        supermercado: p["supermercado"],
        precio: p["precio"],
        precioxlitro: p["precioLitro"],
        descuento: p["descuentos"],
        imagen_url: p["imagenUrl"]
      }));

      res.json({
        total,
        pages,
        page: pageInt,
        limit: limitInt,
        resultados: respuesta
      });

    } catch (error) {
      console.error("❌ Error en listarBaratas:", error);
      res.status(500).json({ mensaje: "Error al obtener cervezas", error: error.message });
    }
  },

  // 2. Buscar cerveza por nombre o marca
  buscarPorNombre: async (req, res) => {
    const query = req.query.query || '';
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    try {
      // 1. Buscar productos cuyo nombre coincida
      const productos = await Producto.findAll({
        where: {
          nombre: { [Op.like]: `%${query}%` }
        }
      });

      if (productos.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron cervezas con ese nombre.' });
      }

      const productoIds = productos.map(p => p.id);

      // 2. Obtener el total de coincidencias en productos_super
      const total = await ProductoSuper.count({
        where: {
          producto_id: { [Op.in]: productoIds }
        }
      });

      const pages = Math.ceil(total / limit);

      // 3. Buscar resultados paginados
      const resultados = await ProductoSuper.findAll({
        where: {
          producto_id: { [Op.in]: productoIds }
        },
        include: [
          { model: Producto, as: 'producto' },
          { model: Supermercado, as: 'supermercado' }
        ],
        order: [['precioxlitro', 'ASC']],
        limit,
        offset
      });

      const respuesta = resultados.map(p => ({
        producto: p.producto.nombre,
        supermercado: p.supermercado.nombre,
        precio: p.precio !== null ? parseFloat(p.precio).toFixed(2) : null,
        precioxlitro: p.precioxlitro !== null ? parseFloat(p.precioxlitro).toFixed(2) : null,
        descuento: p.descuentos || null,
        imagen_url: p.imagen_url || null
      }));

      res.json({
        total,
        pages,
        page,
        limit,
        resultados: respuesta
      });

    } catch (error) {
      res.status(500).json({ mensaje: 'Error en la búsqueda', error: error.message });
    }
  }


};

module.exports = cervezaController;