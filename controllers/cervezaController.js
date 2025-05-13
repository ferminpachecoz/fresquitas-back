const { Producto, ProductoSuper, Supermercado, sequelize } = require('../database/models');
const { Op } = require('sequelize');

const cervezaController = {
  // 1. Cervezas más baratas global o por supermercado
  listarBaratas: async (req, res) => {
    console.log('📡 Endpoint /cervezas/baratas alcanzado');
    const { page = 1, limit = 12, supermercado } = req.query;
    const offset = (page - 1) * limit;

    try {
      const includeOptions = [
        { model: Producto, as: 'producto' },
        { model: Supermercado, as: 'supermercado' }
      ];

      // Filtrar por supermercado si se especifica
      if (supermercado) {
        includeOptions[1].where = {
          nombre: { [Op.like]: `%${supermercado}%` }
        };
      }

      // Contar el total de resultados
      const total = await ProductoSuper.count({
        include: includeOptions
      });

      const pages = Math.ceil(total / limit);

      console.log('🌀 Incluyendo modelos con opciones:', includeOptions);


      // Obtener los resultados paginados
      const resultados = await ProductoSuper.findAll({
        include: includeOptions,
        order: [['precioxlitro', 'ASC']],
        offset: parseInt(offset),
        limit: parseInt(limit)
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
        page: parseInt(page),
        limit: parseInt(limit),
        resultados: respuesta
      });

    } catch (error) {
      res.status(500).json({ mensaje: 'Error al listar cervezas baratas', error: error.message });
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