exports.generateTodayDateYMD_Hours = () => {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();

    if (day < 10) { day = '0' + day }
    if (month < 10) { month = '0' + month }

    today = today.getFullYear()+'-'+month+'-'+day+" "+hours+":"+minutes+":"+seconds;
    return today;
}

exports.generateTodayDateYMD = ()  => {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;

    if (day < 10) { day = '0' + day }
    if (month < 10) { month = '0' + month }

    today = today.getFullYear() + '-' + month + '-' + day;
    return today;
}

exports.generateTodayDate = () => {
    var myDate = new Date();
    year = myDate.getFullYear(); 
    day = myDate.getDate();
    if (day<10)
        day = "0"+day;
    month = myDate.getMonth()+1;
    if (month<10)
        month = "0"+month
    myDate = day + "/" + month + "/" + year;
    return myDate;
}

exports.generateFullTodayDate = () => {
    var myDate = new Date();
    year = myDate.getFullYear(); 
    day = myDate.getDate();
    if (day<10)
        day = "0"+day;
    month = myDate.getMonth()+1;
    if (month<10)
        month = "0"+month;
    var hours = myDate.getHours();
    if(hours<10) hours = "0"+hours;
    var minutes = myDate.getMinutes();
    if(minutes<10) minutes = "0"+minutes;
    var seconds = myDate.getSeconds();
    myDate = day+"/"+month+"/"+year+" "+hours+":"+minutes+":"+seconds;
    return myDate;
}

exports.changeDateYMD = (date) => {
	// input: dd/mm/yyyy
	fechaus = date.substring(6,10) + "-" + date.substring(3,5) + "-" + date.substring(0,2);
	return fechaus;
	// output: yyyy-mm-dd
}

exports.changeDateDMY = (date) => {
    // input: yyyy/mm/dd
    fechaus = date.substring(8,10) + "/" + date.substring(5,7) + "/" + date.substring(0,4);
    return fechaus;
    // output: dd/mm/yyyy
}

//mayus primera letra
exports.MaysPrimera = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// convert datetime to dd/mm/yyyy
exports.convertDate = (inputFormat) => {
    pad = (s) => { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
}

exports.putThousandsSeparators = (value, sep) => {
    if (sep == null) {
        sep = '.';
    }
    // check if it needs formatting
    if (value.toString() === value.toLocaleString()) {
        // split decimals
        var parts = value.toString().split('.')
        // format whole numbers
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep);
        // put them back together
        value = parts[1] ? parts.join(',') : parts[0];
    } else {
        value = value.toLocaleString();
    }
    return value;
};

exports.getDifferenceBetweenTwoDates = (date1, date2) => {
    var date11 = new Date(date1);
    var date22 = new Date(date2);
    var timeDiff = Math.abs(date22.getTime() - date11.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    return diffDays; 
} 

exports.substractDaysToATodayDate = (daysToSubstract) => {
    let today = new Date();
    let newMs = today.getTime() - (daysToSubstract*86400000); // 121 is Offset by 4 months;
    
    newDate = new Date(newMs);
    newDate.setFullYear(newDate.getFullYear());
    day = newDate.getDate();
    if (day<10)
        day = "0"+day;
    month = newDate.getMonth()+1;
    if (month<10)
        month = "0"+month
    return day + "/" + month + "/" + newDate.getFullYear();
}

exports.generateFirstDateActualMonth =  () => {
    var desdeSet = new Date();
    var mes = desdeSet.getMonth() + 1;

    if (mes < 10) { mes = '0' + mes }

    desdeSet = '01/' + mes + '/' + desdeSet.getFullYear();
    
    return desdeSet;
}

exports.convertChbBoolean = (value) => {
    return value === 'on' || value === 'true' || value == '1' ? 1 : 0
}

exports.convertStringToArray = (value) => {
    if(typeof(value) === 'string'){
        let arr = []; arr.push(value);
        return arr
    }else
        return value
}

// PARAMETROS ---------------------------------------------
// n: length of decimal (INT)
// x: length of whole part (INT)
// s: sections delimiter (STR)
// c: decimal delimiter (STR)
// --------------------------------------------------------
// EJEMPLOS DE USO
// 12345678.9.format(2, 3, '.', ',');  // "12.345.678,90"
// 123456.789.format(4, 4, ' ', ':');  // "12 3456:7890"
// 12345678.9.format(0, 3, '-');       // "12-345-679"
// --------------------------------------------------------
exports.formatCurrency2 = (total) => {
    Number.prototype.format = function(n, x, s, c) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
            num = this.toFixed(Math.max(0, ~~n));
        
        return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
    };
    return '$ '+total.format(2, 3, '.', ',');
}

exports.validarMail = mail => {
    let valido = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i.test(mail)
    return valido
}

exports.formatCUIT = cuit => {
    // function applyMask(str, mask) {
    //     let i = 0;
    //     return mask.replaceAll("*", () => str[i++] || "");
    // }
    // console.log(applyMask("12312211111", "**-********-*"))


    let i=0, mask = "**-********-*"
    return mask.replaceAll("*", () => cuit[i++] || "")
}

exports.CalcularEdad = fecha => {
    let hoy = new Date()
    let cumple = new Date(fecha)
    let edad = hoy.getFullYear() - cumple.getFullYear()
    let m = hoy.getMonth() - cumple.getMonth()
    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) edad--
    return edad
}

exports.CalcularNoches = (fechaEntrada, fechaSalida) => {
    return new Promise((resolve, reject) => {
        resolve(parseInt((new Date(fechaSalida) - new Date(fechaEntrada)) / (1000*60*60*24)))
    })
}