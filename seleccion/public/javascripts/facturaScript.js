var item = 0;
$(document).ready(function () {
    getUsuario()
    getProveedores();
    getProductos();
    var f = new Date();
    var cad = (f.getUTCDay() + 11) + "/" + (f.getUTCMonth() + 1) + "/" + f.getFullYear() + "-" + f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();
    $("#fecha").text(cad);

    $("#enviar").click(function () {
        var auxNombre = "";
        var auxCantidad = "";
        var aux = '{"CANTIDAD":' + '"' + item + '"' + ',';
        for (var i = 1; i <= item; i++) {
            aux = aux + '"PRODUCTO' + i + '":'
            aux = aux + '{"NOMBRE":' + '"' + $("#producto" + i).text() + '"' + ", ";
            if (isNaN($("#cantidad" + i).val()) || $("#cantidad" + i).val() == "") {
                alert("Cantidad invalida en item " + i)
                return
            }
            aux = aux + ' "CANTIDAD": "' + $("#cantidad" + i).val() + '"' + "},";
        }
        aux = aux + '"NUMEROTRANSACCION":' + '"' + $("#ordenCompra").text() + '"' + ",";
        aux = aux + '"IDENTIFICACION": "' + $("#idE").text() + '"' + ",";
        aux = aux + '"NUMCEDULA": "' + $("#cedulaProveedor").text() + '"' + ",";
        aux = aux + '"FECHATRANSACCION": "' + $("#fecha").text() + '"' + "}";
        var obj = JSON.parse(aux);
        $.ajax({
            url: '/compras/orden',
            type: 'POST',
            data: obj,
            dataType: 'json',
            success: function (json) {
                for (var i = 0; i < json.length; i++) {
                    $("#OS").append("<option class='claseProducto'>"
                        + json[i].NOMBRE + "</option>");
                }
            },
            error: function (xhr, status) {
                console.log(status + ': Disculpe, existió un problema. ' + JSON.stringify(xhr));
            },
            complete: function (xhr, status) {
                console.log('Petición realizada');
                $(window).attr('location', '/compras')
            }
        });
        facturaPdf(obj);
    });
});

function facturaPdf(json) {
    var columns1 = ["Item", "Producto", "Precio", "Cantidad"];
    var rows1 = [];
    var j;
    for (var i = 1; i <= json.CANTIDAD; i++) {
        rows1[i - 1] = [i, json["PRODUCTO" + i].NOMBRE, "null", json["PRODUCTO" + i].CANTIDAD];
    }
    var doc1 = new jsPDF('p', 'pt');
    doc1.setFontSize(10);
    doc1.text("Numero orden de compra" + $("#ordenCompra").text() + " " + $("#fecha").text() + "   Identificacion Empleado:" + $("#idE").text() + "\nProveedor: " + $(".nombreProveedor option:selected").text() + "   Direccion: " + $("#direccionProveedor").text() + "   Telefono: " + $("#telefonoProveedor").text() + "  ", 20, 20)
    doc1.autoTable(columns1, rows1);
    doc1.save('factura.pdf')

}
function getUsuario() {
    $("#idE").text($("#username").text().split('_')[1]);
    $("#nombreE").text($("#username").text().split('_')[0]);

}

function getOrdenCompra() {
    $.ajax({
        url: '/compras/orden/' + $("#numOrden").val(),
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            json.forEach(function (atrr) {
                var aux;
                aux = aux + "<tr>";
                aux = aux + "<td>" + atrr.NUMEROTRANSACCION+ "</td>";
                aux = aux + "<td>" + atrr.NOMBRETIPOTRANSACCION+ "</td>";
                aux = aux + "<td>" + atrr.NUMCEDULAFT+ "</td>";
                aux = aux + "<td>" + atrr.NUMEROTRANSACCIONFT+ "</td>";
                aux = aux + "<td>" + atrr.IDEMPLEADOFT+ "</td>";
                aux = aux + "<td>" + atrr.FECHATRANSACCION+ "</td>";
                aux = aux + "<td>" + atrr.HORATRANSACCION+ "</td>";
                aux = aux + "<td>" + atrr.DESCUENTO+ "</td>";
                aux = aux + "<td>" + atrr.TOTALTRANSACCION+ "</td>";
                aux = aux + "<td>" + atrr.FACTURAPROVEEDOR+ "</td>";
                aux = aux + "</tr>";
                $("#detalle").append(aux);
            }, this);;
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema getOrdenCompra' + JSON.stringify(xhr) + "" + status);
        },
        complete: function (xhr, status) {
            console.log('Petición realizada getOrdenCompra');
        }
    });
}

function getProductos() {
    $.ajax({
        url: '/productos/all',
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            for (var i = 0; i < json.length; i++) {
                $(".OS").append("<option class='claseProducto'>"
                    + json[i].NOOMBRE + "</option>");
            }
            $(".claseProducto").click(function () {
                item += 1;
                var aux;
                aux = aux + "<tr id=tabla" + item + ">";
                aux = aux + "<td id=item" + item + ">" + item + "</td>";
                aux = aux + "<td id=producto" + item + ">" + $(".OS option:selected").text() + "</td>";
                aux = aux + "<td id=precio" + item + ">" + "precio</td>";
                aux = aux + "<td>" + "<input type='text' id=cantidad" + item + ">" + "</td>";
                aux = aux + "</tr>";
                $("#detalle").append(aux);
            });
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema');
        },
        complete: function (xhr, status) {
            console.log('Petición realizada');
        }
    });
}

function getProveedores() {
    var json;
    $.ajax({
        url: '/proveedores/all',
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            for (var i = 0; i < json.length; i++) {
                $(".nombreProveedor").append("<option class='claseProveedor'>"
                    + json[i].NOMBREPERSONA + "</option>");
            }
            $(".claseProveedor").click(function () {
                for (var i = 0; i < json.length; i++) {
                    if (json[i].NOMBREPERSONA == $(".nombreProveedor option:selected").text()) {
                        $("#cedulaProveedor").text(json[i].NUMCEDULA);
                        $("#nombreProveedor").text(json[i].NOMBREPERSONA);
                        $("#direccionProveedor").text(json[i].DIRECCIONPERSONA);
                        $("#telefonoProveedor").text(json[i].TELEFONOPERSONA);
                    }
                }
            });

        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema getProveedores');
        },
        complete: function (xhr, status) {
            console.log('Petición realizada getProveedores');
        }
    });
}
