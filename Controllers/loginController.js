var oracledb = require('oracledb');
var dbConfig = require('../dbConfig.js');

exports.signIn = function(req, res) {
    oracledb.getConnection(dbConfig, function(err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json').status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }
        connection.execute("SELECT * FROM EMPLEADO WHERE IDENTIFICACION = :IDENTIFICACION AND PASS = :PASS", [req.body.IDENTIFICACION, req.body.PASS], {
            outFormat: oracledb.OBJECT // Return the result as Object
        },
            function(err, result) {
                if (err) {
                    // Error
                    res.set('Content-Type', 'application/json');
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: err.message.indexOf("ORA-00001") > -1 ? "User already exists" : "Input Error",
                        detailed_message: err.message
                    }));
                } else {
                    if (result.rows.length == 0) {
                        res.render('error', { message: 'Error de inicio de sesion' });
                    } else {
                        req.session.username = result.rows[0].NOMBREEMPLEADO + " " + result.rows[0].
                        APELLIDOEMPLEADO+ "_" + result.rows[0].IDEMPLEADO;
                        res.render('POS/POS', { layout: 'POS/layoutPOS', title: "Grupo Seleccón S.A", user : req.session.username});
                    }
                }
                // Release the connection
                connection.release(
                    function(err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log("POST /user_profiles : Connection released");
                        }
                    });
            });
    });
}

exports.signOut = function(req, res) {
    req.session.destroy();
    	res.redirect("/login");
}