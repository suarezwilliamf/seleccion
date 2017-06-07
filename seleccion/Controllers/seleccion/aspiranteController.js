var oracledb = require('oracledb');
var dbConfig = require('../../dbConfig.js');
var generalCtr = require('../generalController.js');


exports.findAll =  function (req, res) {
    generalCtr.getAll(req, res, "SELECT * FROM ", function(productos){
        res.send(JSON.stringify(productos));
    });
}

exports.getID =  function (req, res) {
    generalCtr.getAll(req, res, "SELECT ID FROM ", function(id){
        res.send(JSON.stringify(id));
    });
}




