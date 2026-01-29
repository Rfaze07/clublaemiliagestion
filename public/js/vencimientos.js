
/*------------- FUNCIONES -----------------*/

const ObtenerAlertas = () => {
    return new Promise(async (resolve, reject) => {
        const res = await $.post('/alertas')
        console.log(res)

        if(res.alertasCargo.activo_inicio){
            if(res.alertas.length > 0){
                let html=''
                res.alertas.map(el => {
                    html += `
                    <tr>
                        <td style="width: 180px; text-align: center;">
                            <button type="button" class="btn btn-primary btn-sm" data-toggle="tooltip" data-placement="top" 
                                    title="Renovar" onclick="PostAccion('r', ${el.id})">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                            <button type="button" class="btn btn-secondary btn-sm" data-toggle="tooltip" data-placement="top" 
                                    title="Renovar con fecha" onclick="PostAccion('rf', ${el.id})">
                                <i class="fas fa-calendar-plus"></i>
                            </button>
                            <button type="button" class="btn btn-danger btn-sm" data-toggle="tooltip" data-placement="top" 
                                    title="Eliminar" onclick="EliminarVencimiento(${el.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                        <td>${changeDateDMY(el.fecha_vencimiento)}</td>
                        <td>${changeDateDMY(el.fechaProxVenc)}</td>
                        <td>${el.documentacionTxt}</td>
                        <td class="search">${el.id_tipodocumentacion_fk == 2 ? el.vehiculoTxt : el.id_tipodocumentacion_fk == 3 ? el.empleadoTxt : 'Empresa'}</td>
                    </tr>
                    `
                })
    
                $('#divAlertas').removeClass('d-none')
                $('#tablaAlertas tbody').html(html)
                $('#tablaAlertas').removeClass('d-none')
                $('[data-toggle="tooltip"]').tooltip()
            }else{
                $('#divAlertas').addClass('d-none')
                $('#tablaAlertas tbody').html('')
                $('#tablaAlertas').removeClass('d-none')
            }
        }

        resolve()
    })
}

const PostAccion = async (tipo, id) => {
    if(tipo == 'r' || tipo == 'rf'){
        let title='', html='', confirmButtonText=''
        const res = await $.post('/alertas/getInformacionRenovacion', {id})

        if(tipo == 'r'){
            title = 'Confirmar'
            confirmButtonText = 'Si, renovar'
            html = `Desea renovar el vencimiento<br><strong>${res.renovacion.documentacionTxt} ${res.renovacion.entidadTxt}</strong><br>
                    con fecha <strong>${changeDateDMY(res.renovacion.nuevaVigencia)}</strong>?`
        }else if(tipo == 'rf'){
            title = 'Selecione la fecha'
            confirmButtonText = 'Renovar'
            html = `
            <div class="row text-center justify-content-center">
                <div class="form-group col-sm-12 col-md-8">
                    <label for="txtFechaVencimiento">Nueva fecha de vencimiento</label>
                    <input type="text" class="form-control form-control-sm datepicker maskDate justify-content-center" style="width: 100px; text-align: center; display: inline;" id="txtFechaVencimiento" value="${generateTodayDateDMY()}" onkeypress="return soloNumeros(event)">
                </div>
            </div>
            `
        }
        
        Swal.fire({
            title,
            html,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            confirmButtonText,
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            didOpen: () => {
                $('.maskDate').mask('99/99/9999')
                $('.datepicker').datepicker(optionsDatePickerStart).on('hide', function (e) {
                    if (e.dates.length == 0) $(this).val(generateTodayDateDMY())
                })
            }
        }).then(async result => {
            if(result.isConfirmed){
                const result = await $.post('/alertas/accion', { id, tipo, fechaVenc: $('#txtFechaVencimiento').val() })
                Swal.fire({
                    icon: result.icon,
                    title: result.title, 
                    text: result.text
                }).then(async () => {
                    if(result.status){
                        await ObtenerAlertas()
                        await getLista()
                    }
                })
            }
        })
    }
}