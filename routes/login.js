var express = require('express');
var router = express.Router();
var loginCtr = require('../Controllers/loginController.js');

router.get('/', function (req, res) {
  if (req.session.username) {
    res.redirect('login/index');
  }
  res.render('login');
});

router.get('/index', function (req, res) {
  if (!req.session.username) {
    res.redirect("/login");
  }
  res.render('seleccion/seleccion', { layout: 'seleccion/layoutSeleccion', title: "Grupo Seleccion S.A", user: req.session.username });
});

router.post('/signin', loginCtr.signIn);
router.get('/signout', loginCtr.signOut);

module.exports = router;