var oracledb = require('oracledb');
var dbConfig = require('../../dbConfig.js');
var generalCtr = require('../generalController.js');


exports.findAll =  function (req, res) {
    generalCtr.getAll(req, res, "SELECT * FROM CLIENTE", function(personas){
        res.send(JSON.stringify(personas));
    });
}


exports.getByName = function (req, res) {
    oracledb.getConnection(dbConfig, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }

        connection.execute("SELECT * FROM CLIENTE WHERE IDENTIFICACION = :IDENTIFICACION", [req.params.IDENTIFICACION], {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err || result.rows.length < 1) {
                res.set('Content-Type', 'application/json');
                var status = err ? 500 : 404;
                res.status(status).send(JSON.stringify({
                    status: status,
                    message: err ? "Error getting the client profile" : "client doesn't exist",
                    detailed_message: err ? err.message : ""
                }));
            } else {
                res.render('users', { title: 'Clientes', data: result.rows[0] });
            }
            // Release the connection
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /user_profiles/" + req.params.USER_NAME + " : Connection released");
                    }
                });
        });
    });
}


exports.createUser = function (req, res) {
    oracledb.getConnection(connAttrs, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json').status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }
        connection.execute("INSERT INTO CLIENTE VALUES " +
            "(:IDEMPLEADO, :NOMBREEMPLEADO, :APELLIDOEMPLEADO, :TELEFONOEMPLEADO, :DIRECCIONEMPLEADO, :EMAILEMPLEADO, :FECHAINGRESO, :FECHARETIRO, :IDENTIFICACION, :PASS" +
            ":AGE, :COUNTRY, :THEME) ", [req.body.USER_NAME, req.body.DISPLAY_NAME,
            req.body.DESCRIPTION, req.body.GENDER, req.body.AGE, req.body.COUNTRY,
            req.body.THEME], {
                autoCommit: true,
                outFormat: oracledb.OBJECT // Return the result as Object
            },
            function (err, result) {
                if (err) {
                    // Error
                    res.set('Content-Type', 'application/json');
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: err.message.indexOf("ORA-00001") > -1 ? "User already exists" : "Input Error",
                        detailed_message: err.message
                    }));
                } else {
                    if (!req.session.username) {
                        res.redirect("login");
                    }
                    res.render('seleccion/seleccion', { layout: 'selecion/layoutSeleccion',title: 'Clientes', user : req.session.username});
                }
                // Release the connection
                connection.release(
                    function (err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log("POST /user_profiles : Connection released");
                        }
                    });
            });
    });
}


