const Requerimientos = require('../Controllers/seleccion/requerimientosController.js');
const { Router } = require('express');

let router = new Router();

router.get('/', function (req, res, next) {
	res.render('index', { title: 'Requerimientos' });
});

router.get('/requerimientos', function (req, res, next) {
	if (!req.session.username) {
		res.redirect("/login");
	}
	
	res.render('seleccion/seleccion', {
		layout: 'seleccion/layoutSeleccion',
		title: 'Requerimientos',
		user: req.session.username
	});
});

router.post('/crear', Requerimientos.createRequerimiento);

module.exports = router;