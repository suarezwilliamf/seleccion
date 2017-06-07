var express = require('express');
var router = express.Router();
var clientesCtr = require('../Controllers/seleccion/clientesController.js');

router.get('/', function(req, res, next) {
  if (!req.session.username) {
    res.redirect("/login");
  }
  res.render('seleccion/seleccion', { layout: 'seleccion/layoutSeleccion', title: 'Clientes', user : req.session.username});
});
router.post('/', clientesCtr.getByName);
router.get('/', clientesCtr.findAll);



module.exports = router;