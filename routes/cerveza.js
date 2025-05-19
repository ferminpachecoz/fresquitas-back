var express = require('express');
var router = express.Router();
const cervezaController = require("../controllers/cervezaController")

/* GET home page. */
router.get('/baratas', cervezaController.listarBaratas);
router.get('/buscar', cervezaController.buscarPorNombre);
router.get('/sin-alcohol', cervezaController.listarSinAlcohol);

module.exports = router;