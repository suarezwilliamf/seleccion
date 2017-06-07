var express = require('express');
var router = express.Router();
var aspiranteCtr = require('../Controllers/seleccion/aspiranteController.js');

router.get('/', function(req, res, next) {
  if (!req.session.username) {
    res.redirect("/login");
  }
  res.render('seleccion/seleccion', { layout: 'seleccion/layoutSeleccion', title: 'Aspirantes', user : req.session.username});
});
router.get('/all', aspiranteCtr.findAll);
router.post('/crear', aspiranteCtr.findAll);



module.exports = router;
