var oracledb = require('oracledb');
var dbConfig = require('../../dbConfig.js');
var generalCtr = require('../generalController.js');


exports.getIdRequerimiento = function (req, res) {
    generalCtr.getAll(req, res, "SELECT MAX(TR.NUMEROTRANSACCION) ID FROM TRANSACCION TR, TIPOTRANSACCION TP WHERE TR.IDTIPOTRANSACCIONFT = TP.IDTIPOTRANSACCION AND TP.IDTIPOTRANSACCION = 1", function (NUMEROTRANSACCION) {
        if (!req.session.username) {
            res.redirect("/login");
        }
        var idRequerimiento = {};
        if (NUMEROTRANSACCION[0].ID == null) {
            idRequerimiento = { "ID": "1" };
        } else {
            idRequerimiento = { "ID": NUMEROTRANSACCION[0].ID + 1 };
        }
        res.send(JSON.stringify(idRequerimiento));
    });
}
exports.getRequerimientoById = function (req, res) {
    generalCtr.getByElement(req, res, "SELECT * FROM REQUERIMIENTO TR, TIPOTRANSACCION TP WHERE TR.IDTIPOTRANSACCIONFT = TP.IDTIPOTRANSACCION AND TP.IDTIPOTRANSACCION = 1 AND NUMEROTRANSACCION = :NUMEROTRANSACCION",[req.params.NUMEROTRANSACCION], function (orden) {
        
        res.send(JSON.stringify(requerimiento));
    });
}

exports.createRequerimiento = function (req, res) {
    var fecha = req.body.FECHATRANSACCION.split('-')[0];
    var hora = req.body.FECHATRANSACCION.split('-')[1];

    generalCtr.postElement(req, res, "INSERT INTO REQUERIMIENTO VALUES " +
        "(:NUMEROTRANSACCION, :IDTIPOTRANSACCIONFT, :NUMCEDULAFT, :NUMEROTRANSACCIONFT, :IDEMPLEADOFT, :FECHATRANSACCION, :HORATRANSACCION, :DESCUENTO, :TOTALTRANSACCION, :FACTURAPROVEEDOR) ", [req.body.NUMEROTRANSACCION, 1,
        req.body.NUMCEDULA, null, req.body.IDENTIFICACION, new Date(fecha), hora, null, 0, null], function (result) {
            console.log(result);
        });
}
