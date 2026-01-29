
const ObtenerCmbProvincias = selector => { // PARAMETRO SELECTOR SE PASA COMO ARRAY
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/provincias/listaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html='<option value="" disabled selected>Seleccione un módulo...</option>'
        if(res.data.length > 0){
            res.data.map(el => html += `<option value="${el.id}">${el.descripcion}</option>`)
        }
        selector.map(el => $(`#${el}`).html(html))
        $(`.selectpicker`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}


const ObtenerCmbLocalidadesProvincia = (idProvincia, selector, limpioCP) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        selector = selector.length == 0 ? 'cmbLocalidad' : selector

        const res = await $.post('/localidades/listaSelectAjax', {id:idProvincia})
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html='<option value="" disabled selected>Seleccione un módulo...</option>'
        if(res.data.length > 0){
            res.data.map(el => html += `<option value="${el.id}" data-cp="${el.cp}">${el.localidad}</option>`)
        }
        $(`#${selector}`).prop('disabled', false)
        $(`#${selector}`).removeClass('disabled')
        $(`#${selector}`).html(html)

        $(`#${limpioCP}`).val('')
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()    
        return resolve()
    })
}

const CargarCPSeleccionado = (cp, selector) => {
    return new Promise(async (resolve, reject) => {
        $(`#${selector}`).val($(`#${cp.id} option:selected`).data('cp'))
        return resolve()
    })
}

const ObtenerCmbProveedores = selector => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/proveedores/getlistaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html='<option value="" disabled selected>Seleccione un cliente...</option><option value="0">Sin proveedor asignado</option>'
        if(res.data.length > 0){
            res.data.map(el => html += `<option value="${el.id}">(${el.cuit}) - ${el.razon_social}</option>`)
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbClientes = () => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/clientes/listaActivosAjaxSelect')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html='<option value="" disabled selected>Seleccione un cliente...</option>'
        if(res.data.length > 0){
            res.data.map(el => html += `<option value="${el.id}">(${el.cuit}) - ${el.razon_social}</option>`)
        }
        $('#cmbCliente').html(html)
        $('#cmbCliente').selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbCargos = () => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/cargos/getlistaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html='<option value="" disabled selected>Seleccione un cargo...</option>'
        if(res.data.length > 0){
            res.data.map(el => html += `<option value="${el.id}">(${el.desc_corta}) - ${el.descripcion}</option>`)
        }
        $('#cmbCargo').html(html)
        $('#cmbCargo').selectpicker('refresh')
        $("#preloaderAPP").hide()        
        return resolve()
    })
}

const ObtenerCmbGruposRubros = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/rubrosGrupos/getListaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html = '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">(${el.codigo}) - ${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbRubros = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/rubros/getListaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html = '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        if(esFiltro) $(`#${selector}`).selectpicker('val', 't')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbMarcas = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/marcas/getListaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html += '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        if(esFiltro) $(`#${selector}`).selectpicker('val', 't')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbDepositos = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/depositos/getListaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html = '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">(${el.desc_corta}) ${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        if(esFiltro) $(`#${selector}`).selectpicker('val', 't')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbRepuestos = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/repuestos/getListaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html += '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.marcaTxt} - ${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const SeleccionoRepuesto = id => {
        return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/repuestos/getByIdAjax', {id})
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html += '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.marcaTxt} - ${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbTipoOrdenTrabajo = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/ordenesTrabajosTipos/getListaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html += '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.desc_corta} - ${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbEstadoOrdenTrabajo = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/ordenesTrabajosEstados/getListaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html += '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.desc_corta} - ${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbCondicion = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/condicionesNeumaticos/listaActivosAjaxSelect')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html += '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">(${el.desc_corta}) - ${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbVehiculosChofer = selector => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/vehiculos/getListaCamChofSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}" data-subtext="${el.choferTxt}">(${el.patente}) ${el.marcaTxt}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbTipoVehiculo = () => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/tiposvehiculos/getlistaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">(${el.desc_corta}) ${el.descripcion}</option>`
            })
        }
        $('#cmbTipoVehiculo').html(html)
        $('#cmbTipoVehiculo').selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const SeleccionoTipoVehiculo = id => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/tiposvehiculos/getTipoSeleccionadoAjax', {id})
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        $('#divChofer, #divSemi').removeClass()
        // $('#divCmbTipoVehiculo').removeClass('d-none')
        if(!res.data.asigna_chofer && !res.data.asigna_semi){
            // $('#divCmbTipoVehiculo').addClass('form-group col-sm-12 col-md-8 col-lg-8 col-xl-8')
            // $('').addClass('form-group col-sm-12 col-md-8 col-lg-8 col-xl-8')
            $('#divSemi, #divChofer').addClass('d-none')
            $('#txtNroInterno').val('')
        }else if(res.data.asigna_chofer && res.data.asigna_semi){
            // $('#divCmbTipoVehiculo').addClass('form-group col-sm-12 col-md-4 col-lg-6')
            // $('#divNroInterno').addClass('form-group col-sm-12 col-md-2 col-lg-2')
            await ObtenerCmbChoferes()
            await ObtenerCmbSemis()
            $('#divChofer').addClass('form-group col-sm-12 col-md-6 col-lg-6 col-xl-6')
            $('#divSemi').addClass('form-group col-sm-12 col-md-6 col-lg-6 col-xl-6')
        }else if(res.data.asigna_chofer && !res.data.asigna_semi){
            // $('#divCmbTipoVehiculo').addClass('form-group col-sm-12 col-md-4 col-lg-6')
            // $('#divNroInterno').addClass('form-group col-sm-12 col-md-2 col-lg-2')
            await ObtenerCmbChoferes()
            $('#divSemi').addClass('d-none')
            $('#divChofer').addClass('form-group col-sm-12 col-md-12 col-lg-12')
        }else if(!res.data.asigna_chofer && res.data.asigna_semi){
            // $('#divCmbTipoVehiculo').addClass('form-group col-sm-12 col-md-4 col-lg-6')
            // $('#divNroInterno').addClass('form-group col-sm-12 col-md-2 col-lg-2')
            await ObtenerCmbSemis()
            $('#txtNroInterno').val('')
            $('#divSemi').addClass('form-group col-sm-12')
            $('#divChofer').addClass('d-none')
        }
        $('#divTipoVehiculo').removeClass('d-none')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbChoferes = () => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/empleados/listaChoferesSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option><option value="0">-- Sin chofer asignado --</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.apellido}, ${el.nombre}</option>`
            })
        }
        $('#cmbChoferA').html(html)
        $('#cmbChofer').html(html)
        $('.selectpicker').selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbCamiones = () => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/vehiculos/getlistaCamionesSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.patente} - ${el.marcaTxt}</option>`
            })
        }
        $('#cmbCamionA').html(html)
        $('#cmbCamion').html(html)
        $('.selectpicker').selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbSemis = () => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/vehiculos/getlistaSemisSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option><option value="0">-- Sin semi asignado --</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.patente} - ${el.marcaTxt}</option>`
            })
        }
        $('#cmbSemiA').html(html)
        $('#cmbSemi').html(html)
        $('.selectpicker').selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbUnidadesMedidas = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/unmed/getlistaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html += '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.desc_corta} - ${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        if(esFiltro) $(`#${selector}`).selectpicker('val', 't')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbTanques = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/tanques/getListaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html = '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">(${el.desc_corta}) ${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        if(esFiltro) $(`#${selector}`).selectpicker('val', 't')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbArticulos = selector => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/articulos/getlistaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve({ status: false })
        }
        let html='<option value="" disabled selected>Seleccione un módulo...</option>'
        if(res.data.length > 0){
            res.data.map(el => html += `<option value="${el.id}">(${el.desc_corta}) - ${el.descripcion}</option>`)
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve({ status: true })
    })
}

const ObtenerCmbAlicuotasIVA = selector => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/alicuotasIVA/listaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html=''
        if(res.data.length > 0){
            res.data.map(el => html += `<option value="${el.id}">${el.descripcion}</option>`)
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbTipoVehiculo2 = selector => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/tiposvehiculos/getTipoSeleccionadoParamAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">(${el.desc_corta}) ${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbVehiculoTipoVehiculo = (selector, id) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/vehiculos/getAllVehiculosByTipoSelectAjax', {id})
        if(!res.status){
            $(`#${selector}`).html('')
            $(`#${selector}`).prop('disabled', true)
            $(`#${selector}`).selectpicker('refresh')
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.patente}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $(`#${selector}`).prop('disabled', false)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbEmpleado = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/empleados/listaEmpleadosSelectAjax')
        if(!res.status){
            $(`#${selector}`).html(html)
            $(`#${selector}`).selectpicker('refresh')
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html += '<option value="t">Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">(${String(el.nro_legajo).padStart(4, '0')}) - ${el.apellido}, ${el.nombre}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbUbicaciones = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/ubicaciones/getListaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html += '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbFichas = (selector, esFiltro, id) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/fichasRepuestos/getIdRepuestoAjax', {id})
        if(!res.status){
            $(`#${selector}`).html('')
            $(`#${selector}`).selectpicker('refresh')
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html += '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.nro_serie}</option>`
            })
            $(`#${selector}`).html(html)
            $(`#${selector}`).selectpicker('refresh')
        }else{
            $(`#${selector}`).html('')
            $(`#${selector}`).selectpicker('refresh')
        }
        
        $("#preloaderAPP").hide()
        return resolve()
    })
}


const ObtenerCmbTiposMovimientos = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/tiposMovimientos/getListaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html += '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">(${el.desc_corta}) ${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbImputaciones = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/imputaciones/getListaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html += '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">(${el.desc_corta}) ${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbOTTiposTareas = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/ordenesTrabajosTiposTareas/getlistaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html += '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">(${el.desc_corta}) ${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbOTTareas = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/ordenesTrabajosTareas/getlistaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html += '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">(${el.desc_corta}) ${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbOTNovedades = (selector, esFiltro, idVehiculo) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/ordenesTrabajosNovedades/getListaByVehiculoSinOT', {idVehiculo})
        if(!res.status){
            $(`#${selector}`).html('')
            $(`#${selector}`).prop('disabled', true)
            $(`#${selector}`).selectpicker('refresh')
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html += '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}


const ObtenerCmbPuestos = selector => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/puestos/getListaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html='<option value="" disabled selected>Seleccione un cargo...</option>'
        if(res.data.length > 0){
            res.data.map(el => html += `<option value="${el.id}">(${el.desc_corta}) - ${el.descripcion}</option>`)
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()        
        return resolve()
    })
}

const ObtenerCmbEmpleadosPuestos = (selector, idPuesto) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/empleados/listaEmpleadosPuestoSelectAjax', {idPuesto})
        if(!res.status){
            $(`#${selector}`).html('')
            $(`#${selector}`).prop('disabled', true)
            $(`#${selector}`).selectpicker('refresh')
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html='<option value="" disabled selected>Seleccione un cargo...</option>'
        if(res.data.length > 0){
            res.data.map(el => html += `<option value="${el.id}">(${el.nro_legajo}) - ${el.apellido}, ${el.nombre}</option>`)
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).prop('disabled', false)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()        
        return resolve()
    })
}









// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

const ObtenerCmbModulos = () => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/modulosAlertas/getlistaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html='<option value="" disabled selected>Seleccione un módulo...</option>'
        if(res.data.length > 0){
            res.data.map(el => html += `<option value="${el.id}">${el.modulo}</option>`)
        }
        $('#cmbModAlerta').html(html)
        $('#cmbModAlerta').selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbTiposDocumentacion = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/tiposDocumentosAfip/listaActivosAjaxSelect')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if (esFiltro) html += '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.tipoDoc}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        if (esFiltro) $(`#${selector}`).selectpicker('val', 't')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbTipoInasistencia = () => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/tiposInasistencias/getlistaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.descripcion}</option>`
            })
        }
        $('#cmbTipoInasistencia').html(html)
        $('#cmbTipoInasistencia').selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbEnfermedades = () => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/enfermedades/getlistaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.descripcion}</option>`
            })
        }
        $('#cmbEnfermedad').html(html)
        $('#cmbEnfermedad').selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbObrasSociales = () => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/obrasSociales/getListaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html='<option value="" disabled selected>Seleccione un cargo...</option>'
        if(res.data.length > 0){
            res.data.map(el => html += `<option value="${el.id}">(${el.desc_corta}) - ${el.descripcion}</option>`)
        }
        $('#cmbObraSocial').html(html)
        $('#cmbObraSocial').selectpicker('refresh')
        $("#preloaderAPP").hide()        
        return resolve()
    })
}

const ObtenerCmbMedicos = () => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/medicos/getListaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html='<option value="" disabled selected>Seleccione un médico...</option>'
        if(res.data.length > 0){
            res.data.map(el => html += `<option value="${el.id}">(${el.matricula}) - ${el.apellido}, ${el.nombre}</option>`)
        }
        $('#cmbMedico').html(html)
        $('#cmbMedico').selectpicker('refresh')
        $('#cmbMedicoCert').html(html)
        $('#cmbMedicoCert').selectpicker('refresh')
        $("#preloaderAPP").hide()        
        return resolve()
    })
}

const ObtenerCmbTiposVehiculosS = selector => { // PARAMETRO SELECTOR SE PASA COMO ARRAY
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
         const res = await $.post('/tiposvehiculos/getlistaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html=''
        if(res.data.length > 0){
            res.data.map(el => html += `<option value="${el.id}">(${el.desc_corta}) ${el.descripcion}</option>`)
        }
        selector.map(el => $(`#${el}`).html(html))
        $(`.selectpicker`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}


const ObtenerCmbCategorias = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/categorias/getListaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html = '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        if(esFiltro) $(`#${selector}`).selectpicker('val', 't')
        $("#preloaderAPP").hide()
        return resolve()
    })
}


const ObtenerCmbMediosPago = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/mediospagos/getListaActivosAjaxSelect')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value= "" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html += '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.desc_corta} - ${el.descripcion}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbProductos = (selector) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/productos/getlistaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        let precio
        if(res.data.length > 0){
            
            res.data.map(el => {
                // Precio sin IVA
                let precioSinIva = parseFloat(el.Costo) * (1 + parseFloat(el.Porcentaje) / 100);

                // Precio con IVA
                let precioConIva = precioSinIva * (1 + parseFloat(el.porcIva) / 100);
                html += `<option value="${el.Cod_Producto}" data-porcentaje="${el.Porcentaje}" data-alicuota="${el.id_alicuota_iva_fk}" data-costo="${el.Costo}" data-id="${el.id}" data-precio="${precioConIva}" data-subtext="${el.Cod_Producto}">${el.Desc_Producto}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}

const ObtenerCmbProveedores2 = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/proveedores/getlistaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html += '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.razon_social}</option>`
            })
        }
        $(`#${selector}`).html(html)
        $(`#${selector}`).selectpicker('refresh')
        $("#preloaderAPP").hide()
        return resolve()
    })
}


const ObtenerCmbEquipos = (selector, esFiltro) => {
    return new Promise(async (resolve, reject) => {
        $("#preloaderAPP").show()
        const res = await $.post('/equipos/getListaSelectAjax')
        if(!res.status){
            $("#preloaderAPP").hide()
            Swal.fire(res.title, res.text, res.icon)
            return resolve()
        }
        let html = '<option value="" disabled selected>Seleccione una opción...</option>'
        if(esFiltro) html = '<option value="t" selected>Todos</option>'
        if(res.data.length > 0){
            res.data.map(el => {
                html += `<option value="${el.id}">${el.nombre}</option>`
            })
        }
        $(`#${selector}`).html(html)
         $(`#${selector}`).selectpicker('refresh')
        if(esFiltro) $(`#${selector}`).selectpicker('val', 't')
        $("#preloaderAPP").hide()
        return resolve()
    }
    )
}