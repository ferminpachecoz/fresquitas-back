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
        filtros.supermercado = { $regex: supermercado, $options: "i" };
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
    const db = getDB();
    const collection = db.collection("productos");

    const query = req.query.query || '';
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    try {
      const filtro = {
        nombre: { $regex: query, $options: "i" }  // insensible a mayúsculas/minúsculas
      };

      const total = await collection.countDocuments(filtro);
      const pages = Math.ceil(total / limit);

      if (total === 0) {
        return res.status(404).json({ mensaje: "No se encontraron productos con ese nombre." });
      }

      const resultados = await collection.find(filtro)
        .sort({ precioLitro: 1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const respuesta = resultados.map(p => ({
        producto: p.nombre,
        supermercado: p.supermercado,
        precio: p.precio,
        precioxlitro: p.precioLitro,
        descuento: p.descuentos,
        imagen_url: p.imagenUrl
      }));

      res.json({
        total,
        pages,
        page,
        limit,
        resultados: respuesta
      });

    } catch (error) {
      console.error("❌ Error en buscarPorNombre:", error);
      res.status(500).json({ mensaje: 'Error en la búsqueda', error: error.message });
    }
  },
  // 3. Obtener cervezas sin alcohol
  listarSinAlcohol: async (req, res) => {
    const db = getDB();
    const collection = db.collection("productos");

    const { page = 1, limit = 12 } = req.query;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;

    try {
      const filtro = {
        nombre: { $regex: "sin alcohol", $options: "i" }
      };

      const total = await collection.countDocuments(filtro);
      const pages = Math.ceil(total / limitInt);

      const resultados = await collection.find(filtro)
        .sort({ precioLitro: 1 })
        .skip(skip)
        .limit(limitInt)
        .toArray();

      const respuesta = resultados.map(p => ({
        producto: p.nombre,
        supermercado: p.supermercado,
        precio: p.precio,
        precioxlitro: p.precioLitro,
        descuento: p.descuentos,
        imagen_url: p.imagenUrl
      }));

      res.json({
        total,
        pages,
        page: pageInt,
        limit: limitInt,
        resultados: respuesta
      });

    } catch (error) {
      console.error("❌ Error en listarSinAlcohol:", error);
      res.status(500).json({ mensaje: "Error al obtener cervezas sin alcohol", error: error.message });
    }
  }


};

module.exports = cervezaController;