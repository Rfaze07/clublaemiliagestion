"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numeroALetras = void 0;
var numeroALetras = function (num) {
    var data = {
        numero: num,
        enteros: Math.floor(num),
        decimales: Math.round(num * 100) - Math.floor(num) * 100,
        letrasDecimales: '',
    };
    if (data.decimales > 0)
        // data.letrasDecimales = ' PUNTO ' + Millones(data.decimales);
        data.letrasDecimales = ` CON  ${data.decimales}/100`;
    if (data.enteros == 0)
        return 'CERO' + data.letrasDecimales;
    if (data.enteros == 1)
        return Millones(data.enteros) + data.letrasDecimales;
    else
        return Millones(data.enteros) + data.letrasDecimales;
};
exports.numeroALetras = numeroALetras;
var Unidades = function (num) {
    var aLetras = {
        1: 'UNO',
        2: 'DOS',
        3: 'TRES',
        4: 'CUATRO',
        5: 'CINCO',
        6: 'SEIS',
        7: 'SIETE',
        8: 'OCHO',
        9: 'NUEVE',
    };
    return aLetras[num] || '';
}; // Unidades()
var Decenas = function (num) {
    var decena = Math.floor(num / 10);
    var unidad = num - decena * 10;
    var aLetras = {
        1: (function () {
            var aLetra = {
                0: 'DIEZ',
                1: 'ONCE',
                2: 'DOCE',
                3: 'TRECE',
                4: 'CATORCE',
                5: 'QUINCE',
            };
            return aLetra[unidad] || 'DIECI' + Unidades(unidad);
        })(),
        2: unidad == 0 ? 'VEINTE' : 'VEINTI' + Unidades(unidad),
        3: DecenasY('TREINTA', unidad),
        4: DecenasY('CUARENTA', unidad),
        5: DecenasY('CINCUENTA', unidad),
        6: DecenasY('SESENTA', unidad),
        7: DecenasY('SETENTA', unidad),
        8: DecenasY('OCHENTA', unidad),
        9: DecenasY('NOVENTA', unidad),
        0: Unidades(unidad),
    };
    return aLetras[decena] || '';
}; //Decenas()
var DecenasY = function (strSin, numUnidades) {
    if (numUnidades > 0)
        return strSin + ' Y ' + Unidades(numUnidades);
    return strSin;
}; //DecenasY()
var Centenas = function (num) {
    var centenas = Math.floor(num / 100);
    var decenas = num - centenas * 100;
    var aLetras = {
        1: decenas > 0 ? 'CIENTO ' + Decenas(decenas) : 'CIEN',
        2: 'DOSCIENTOS ' + Decenas(decenas),
        3: 'TRESCIENTOS ' + Decenas(decenas),
        4: 'CUATROCIENTOS ' + Decenas(decenas),
        5: 'QUINIENTOS ' + Decenas(decenas),
        6: 'SEISCIENTOS ' + Decenas(decenas),
        7: 'SETECIENTOS ' + Decenas(decenas),
        8: 'OCHOCIENTOS ' + Decenas(decenas),
        9: 'NOVECIENTOS ' + Decenas(decenas),
    };
    return aLetras[centenas] || Decenas(decenas);
}; //Centenas()
var Seccion = function (num, divisor, strSingular, strPlural) {
    var cientos = Math.floor(num / divisor);
    var resto = num - cientos * divisor;
    var letras = '';
    if (cientos > 0)
        if (cientos > 1)
            letras = Centenas(cientos) + ' ' + strPlural;
        else
            letras = strSingular;
    if (resto > 0)
        letras += '';
    return letras;
}; //Seccion()
var Miles = function (num) {
    var divisor = 1000;
    var cientos = Math.floor(num / divisor);
    var resto = num - cientos * divisor;
    var strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
    var strCentenas = Centenas(resto);
    if (strMiles == '')
        return strCentenas;
    return strMiles + ' ' + strCentenas;
}; //Miles()
var Millones = function (num) {
    var divisor = 1000000;
    var cientos = Math.floor(num / divisor);
    var resto = num - cientos * divisor;
    var strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
    var strMiles = Miles(resto);
    if (strMillones == '')
        return strMiles;
    return strMillones + ' ' + strMiles;
}; //Millones()