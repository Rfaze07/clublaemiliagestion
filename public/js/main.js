// ONKEYPRESS NO ANDA, USAR ONKEYDOWN

const soloNumeros = (e) => {
	var key = window.Event ? e.which : e.keyCode
	return (key >= 48 && key <= 57)
}// onkeypress="return soloNumeros(event)"

const changeDateYMD = (date) => {
	// input: dd/mm/yyyy
	fechaus = date.substring(6,10) + "/" + date.substring(3,5) + "/" + date.substring(0,2);
	return fechaus;
	// output: yyyy/mm/dd
}

const changeDateDMY = (date) => {
	// input: yyyy/mm/dd
	fechaus = date.substring(8,10) + "/" + date.substring(5,7) + "/" + date.substring(0,4);
	return fechaus;
	// output: dd/mm/yyyy
}

const changeDate3 = (date) => {
    // input: dd/mm/yyyy
    fechaus = date.substring(6,10) + "-" + date.substring(3,5) + "-" + date.substring(0,2);
    return fechaus;
    // output: yyyy-mm-dd
}

const changeFormatDMY =  date  => { // FORMAT: DD/MM/AAAA
	return new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date(date))
}

const changeFormatYMD =  date  => { // FORMAT: AAAA-MM-DD
	return new Intl.DateTimeFormat('fr-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date(date))
}

const changeDateDMYHM = datetime => {
    if(!datetime) return ''
    return new Intl.DateTimeFormat("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(datetime))
    // output: dd/mm/yyyy, 00:00
}

const ValidarHoraHM = (time, selector) => { // validar formato 00:00
    if(time.length != 0){
        if(new RegExp("^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$").test(time)){
            return true
        }else{
            $(`#${selector}`).val('')
            Swal.fire('Error', 'La hora ingresada no es válida<br>(formato válido HH:MM y 00:00-23:59)', 'error')
            return false
        }
    }else
        return true
}// onblur="ValidarHoraHM(this.value)"

const ValidarHoraHMS = (time, selector) => { // validar formato 00:00:00
    if(new RegExp("^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$").test(time)){
        return true
    }else{
        $(`#${selector}`).val('')
        Swal.fire('Error', 'La hora ingresada no es válida<br>(formato válido HH:MM:SS y 00:00:00-23:59:59)', 'error')
        return false
    }
}// onblur="ValidarHoraHMS(this.value)"

const Numy1Punto = (e, field)  => {
	key = e.keyCode ? e.keyCode : e.which
	// backspace
	if (key == 8) return true
	// 0-9
	if (key > 47 && key < 58) {
    	if (field.value == "") return true
    	regexp = /.[0-9]{2}$/
    	return !(regexp.test(field.value))
    	}
    	// .
    	if (key == 46) {
    	if (field.value == "") return false
    	regexp = /^[0-9]+$/
    	return regexp.test(field.value)
	}
	// other key
	return false
}//onkeypress="return Numy1Punto(event, this)"

const checkDec = (el) => {
	var ex = /^[0-9]+\.?[0-9]*$/;
	if(ex.test(el.value)==false){
	   	el.value = el.value.substring(0,el.value.length - 1);
	}
}//i cant remember what this does

const validate = (evt)  => {
  var theEvent = evt || window.event;
  var key = theEvent.keyCode || theEvent.which;
  key = String.fromCharCode( key );
  var regex = /[0-9]|\./;
  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}// onkeypress='validate(event)'

const ValidarEnterosYDecimales = (e, field, enteros, decimales)  => {
    key = e.keyCode ? e.keyCode : e.which
    if (key == 8) return true // backspace
 
    if (field.value != "") {// 0-9 a partir del .decimal  
        if ((field.value.indexOf(".")) > 0) {
            if (key > 47 && key < 58) {
                if (field.value == "") return true
                return !(new RegExp(`[0-9]{${decimales}}$`).test(field.value))
            }
        }
    }
    if (key > 47 && key < 58) {// 0-9 
        if (field.value == "") return true
        return !(new RegExp(`[0-9]{${enteros}}`).test(field.value))
    }
    if (key == 46) {// .
        if (field.value == "") return false
        return /^[0-9]+$/.test(field.value)
    }
    return false
}// onkeypress="return ValidarEnterosYDecimales(event,this,12,2)"

const lettersOnly = (evt)  => {
    evt = (evt) ? evt : event;
    var charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode :((evt.which) ? evt.which : 0));
    if (charCode > 31 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
        // alert("Enter letters only.");
        return false;
    }
    return true;
}//onkeypress="return lettersOnly(event)"

const generateTodayDate = () => {
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

const Validate6EntY1Dec = (e, field)  => {
    key = e.keyCode ? e.keyCode : e.which
    // backspace
    if (key == 8) return true
 
    // 0-9 a partir del .decimal  
    if (field.value != "") {
        if ((field.value.indexOf(".")) > 0) {
            //si tiene un punto valida dos digitos en la parte decimal
            if (key > 47 && key < 58) {
                if (field.value == "") return true
                //regexp = /[0-9]{1,10}[\.][0-9]{1,3}$/
                // dos decimales
                regexp = /[0-9]{1}$/
                return !(regexp.test(field.value))
            }
        }
    }
    // 0-9 
    if (key > 47 && key < 58) {
        if (field.value == "") return true
        // 10 enteros?
        regexp = /[0-9]{6}/
        return !(regexp.test(field.value))
    }
    // .
    if (key == 46) {
        if (field.value == "") return false
        regexp = /^[0-9]+$/
        return regexp.test(field.value)
    }
    // other key
    return false
}//onkeypress="return Validate6EntY1Dec(event,this)"

const generateTodayDateYMD =  ()  => {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;

    if (day < 10) { day = '0' + day }
    if (month < 10) { month = '0' + month }

    today = today.getFullYear() + '-' + month + '-' + day;
    return today;
}

const generateTodayDateDMY =  ()  => {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;

    if (day < 10) { day = '0' + day }
    if (month < 10) { month = '0' + month }

    today = day + '/' + month + '/' + today.getFullYear();
    return today;
}

const generateTodayDateDMYHMS =  ()  => {
	let newdate = new Intl.DateTimeFormat('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date())
    return newdate
}

const checkDateLessToday =  (date)  => {
    var fecha = new Date(date);
    var fecha_hoy = new Date();

    if (fecha > fecha_hoy) {
        return false;
    } else {
        return true;
    }
}

const generateFirstDateActualMonth =  ()  => {
    var desdeSet = new Date();
    var mes = desdeSet.getMonth() + 1;

    if (mes < 10) { mes = '0' + mes }

    desdeSet = '01/' + mes + '/' + desdeSet.getFullYear();
    
    return desdeSet;
}

const addtime = (start_time, end_time) => {
    var startArr = start_time.split(':');
    var endArr = end_time.split(':');
    
    startArr[0] = (startArr[0]) ? parseInt(startArr[0], 10) : 0;
    startArr[1] = (startArr[1]) ? parseInt(startArr[1], 10) : 0;

    endArr[0] = (endArr[0]) ? parseInt(endArr[0], 10) : 0;
    endArr[1] = (endArr[1]) ? parseInt(endArr[1], 10) : 0;

    var hours = startArr[0] + endArr[0];
    var add_hr = 0;
    var minutes = startArr[1] + endArr[1];

    if (minutes > 59){
        x = minutes/60;
        add_hr = Math.floor(x);
        hours = hours + add_hr;
        final_min = x - add_hr;
        minutes = final_min*60;
        minutes = Math.ceil(minutes);
    }

    if (hours < 10)
        hours = "0"+hours;

    if (minutes < 10)
        minutes = "0"+minutes;

    return hours+':'+minutes;
}

const addtime_clock = (start_time, end_time) => {
    var startArr = start_time.split(':');
    var endArr = end_time.split(':');
    
    var d = new Date();
    startArr[0] = (startArr[0]) ? parseInt(startArr[0], 10) : 0;
    startArr[1] = (startArr[1]) ? parseInt(startArr[1], 10) : 0;
    // startArr[2] = (startArr[2]) ? parseInt(startArr[2], 10) : 0;
    endArr[0] = (endArr[0]) ? parseInt(endArr[0], 10) : 0;
    endArr[1] = (endArr[1]) ? parseInt(endArr[1], 10) : 0;
    // endArr[2] = (endArr[2]) ? parseInt(endArr[2], 10) : 0;

    d.setHours(startArr[0] + endArr[0]);
    d.setMinutes(startArr[1] + endArr[1]);
    // d.setSeconds(startArr[2] + endArr[2]);

    var hours = d.getHours();
    var minutes = d.getMinutes();
    // var seconds = d.getSeconds();
    if (hours < 10)
        hours = "0"+hours;

    if (minutes < 10)
        minutes = "0"+minutes;
    // return hours+':'+minutes+'.'+seconds+'hrs';
    return hours+':'+minutes;
}

//mayus primer letra
const MaysPrimera = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}//onkeypress="return MaysPrimera(event,this)"


const getDateOfWeek = (w, y)  => {
    var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week
    return new Date(y, 0, d);
}

const getDateOfWeekTXT = (w, y)  => {
    var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week
    var nd = new Date(y, 0, d);
    console.log(nd)
    var month = nd.getMonth();
    console.log(month)
    switch(month){
        case 0:
            m = "Enero";
            break;
        case 1:
            m = "Febrero";
            break;
        case 2:
            m = "Marzo";
            break;
        case 3:
            m = "Abril";
            break;
        case 4:
            m = "Mayo";
            break;
        case 5:
            m = "Junio";
            break;
        case 6:
            m = "Julio";
            break;
        case 7:
            m = "Agosto";
            break;
        case 8:
            m = "Septiembre";
            break;
        case 9:
            m = "Octubre";
            break;
        case 10:
            m = "Noviembre";
            break;
        case 11:
            m = "Diciembre";
            break;
        default: 
            m = "error";
            break;
    }

    return m+' '+nd.getFullYear();
}

const numberWithCommas = (x)  => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const soloNumeros2 = (e) => {
    if(e.length >1){
        var key = window.Event ? e.which : e.keyCode
        return (key >= 48 && key <= 57)
    }else{
        return e;
    }
}

const ValidarPatente = patente => { // toma patente con ambos formatos > AAA-000 | AA-000-AA
    if(patente.value.length != 0){
        let res = new RegExp("^(?:[A-Z]{2}-[0-9]{3}-[A-Z]{2})$|^(?:[A-Z]{3}-[0-9]{3})$").test(patente.value.toUpperCase())
        if(!res){
            $(patente).val('')
            Swal.fire('Error', 'La patente ingresada no es válida', 'error')
            $(patente).focus()
        }
    }
}// onblur="ValidarPatente(this)"

// const ValidarPatente2 = el => {
//     let patente = []
//     const inputValue = el.value.replace(/-/g, "")
//     patente = inputValue.split("")

    
//     const mask = ["AAA-YY", "AAA-YYY", "AA-YYY-AA"]
//     const optionsMask = {
//         translation: {
//             A: { pattern: /[A-Za-z]/ }, Y: { pattern: /[0-9]/ }
//         },
//         onKeyPress: (cep, e, field, options) => {
//             console.log(cep)
//             // console.log(e)
//             // console.log(field)
//             // console.log(options)

//             $(el).mask((cep.length == 6) ? mask[0] : (cep.length == 7) ? mask[1] : mask[2], optionsMask)
//         }
//         // ,
//         // onComplete: (val) => {
//         //     // console.log(val)
//         // },
//         // onInvalid: (val, e, f, invalid, options) => {
//         //     // console.log(val)
//         //     // $(el).val('')
//         //     // Swal.fire('Error', 'La patente ingresada no es válida', 'error')
//         //     // $(el).focus()
//         //     // return false
//         // }
//     }
//     $(el).mask("AA-YYY-AA", optionsMask)



//     // if(inputValue.length >= 3){
//     //     console.log(patente)
//     //     if(isNaN(patente[2])){
//     //         $(el).mask("AAA-YYY", {
//     //             translation: {
//     //                 A: { pattern: /[A-Za-z]/ }, Y: { pattern: /[0-9]/ }
//     //             },
//     //             onComplete: (val) => {
//     //                 console.log(val)
//     //             },
//     //             onInvalid: (val, e, f, invalid, options) => {
//     //                 console.log(val)
//     //                 // $(el).val('')
//     //                 // Swal.fire('Error', 'La patente ingresada no es válida', 'error')
//     //                 // $(el).focus()
//     //                 return false
//     //             }
//     //         })
//     //     }
//     //     else if(isNaN(patente[2])){
//     //         $(el).mask("AAA-YY", {
//     //             translation: {
//     //                 A: { pattern: /[A-Za-z]/ }, Y: { pattern: /[0-9]/ }
//     //             },
//     //             onComplete: (val) => {
//     //                 console.log(val)
//     //             },
//     //             onInvalid: (val, e, f, invalid, options) => {
//     //                 console.log(val)
//     //                 // $(el).val('')
//     //                 // Swal.fire('Error', 'La patente ingresada no es válida', 'error')
//     //                 // $(el).focus()
//     //                 return false
//     //             }
//     //         })
//     //     }
//     //     else if(isNaN(patente[1])){
//     //         $(el).mask("AA-YYY-AA", {
//     //             translation: {
//     //                 A: { pattern: /[A-Za-z]/ }, Y: { pattern: /[0-9]/ }
//     //             },
//     //             onComplete: (val) => {
//     //                 console.log(val)
//     //             },
//     //             onInvalid: (val, e, f, invalid, options) => {
//     //                 console.log(val)
//     //                 // $(el).val('')
//     //                 // Swal.fire('Error', 'La patente ingresada no es válida', 'error')
//     //                 // $(el).focus()
//     //                 return false
//     //             }
//     //         })
//     //     }
//     // }
// }// oninput="ValidarPatente2(this)"

const soloLetras = (e) => {
    var key = window.Event ? e.which : e.keyCode
    return ((key >= 65 && key <= 90) || (key >= 97 && key <= 122) || key == 241 || key == 209 || key == 32)
}//onKeyPress="return soloLetras(event)"

const formatCurrency = total => {
    return new Intl.NumberFormat('es-AR', { 
        currency: 'ARS', 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    }).format(total)
}









// ======================================
//          VARIABLES GLOBALES
// ======================================


//-------------------- SELECTS --------------------

let optionsSelectPicker = {
    noneResultsText: 'Sin coincidencias',
    noneSelectedText: 'Sin seleccionar',
    liveSearch: true,
    maxOptions: 10,
    dropdownAlignRight: 'auto'
}
let optionsSelectPickerNoSearch = {
    noneResultsText: 'Sin coincidencias',
    noneSelectedText: 'Sin seleccionar',
    liveSearch: false,
    maxOptions: 10
}



//-------------------- DATE PICKERS --------------------

let optionsDatePicker = {
    language: "es",
    format: "dd/mm/yyyy",
    autoclose: true,
    todayHighlight: true,
    todayBtn: "linked"
}
let optionsDatePickerClear = {
    language: "es",
    format: "dd/mm/yyyy",
    autoclose: true,
    todayHighlight: true,
    todayBtn: "linked",
    clearBtn: true
}
let optionsDatePickerStart = {
    language: "es",
    format: "dd/mm/yyyy",
    startDate: generateTodayDateDMY(),
    autoclose: true,
    todayHighlight: true,
    todayBtn: "linked"
}
let optionsDatePickerEnd = {
    language: "es",
    format: "dd/mm/yyyy",
    endDate: generateTodayDateDMY(),
    autoclose: true,
    todayHighlight: true,
    todayBtn: "linked"
}



//-------------------- VALIDAR PATENTE --------------------

const patentesMasks = ["AAA-YY", "AAA-YYY", "AA-YYY-AA"]
const patentesMasksOptions = {
    translation: {
        A: { pattern: /[A-Za-z]/ }, Y: { pattern: /[0-9]/ }
    },
    onInvalid: function(val, e, f, invalid, options){
        console.log(String(invalid[0].e))
        if(String(invalid[0].e) == '/[0-9]/') return $(".validarPatente").mask(patentesMasks[1], options)
        return $(".validarPatente").mask(patentesMasks[2], options)
    }
}