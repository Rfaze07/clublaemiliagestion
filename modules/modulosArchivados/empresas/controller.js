const multer = require('multer')
const model = require('./model')
const mCondicionesIva = require('../condicionesiva/model')
const mLocalidades = require('../localidades/model')
const utils = require('../../public/js/utils')
const fs = require('fs')
const path = require('path')
const _pathImgEmpresas = ('./public/img/empresas')


exports.getEmpresas = async (req, res) => {
    const condicionesIva = await mCondicionesIva.getAllActivos()
    const localidades = await mLocalidades.getLocalidades()
    res.render('empresas/views/index', {
        pagename: "Empresas",
        condicionesIva,
        localidades,
        permisos: req.session.user.permisos
    })
}

exports.getListaEmpresas = async (req, res) => {
    let empresas = await model.getEmpresas()
    res.json(empresas)
}

exports.getListaActivosAjax = async (req, res) => {
    try {
        let data = await model.getAllActivas()
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen empresas activas" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getEmpresasById = async (req, res) => {
    try {
        if(!req.body.id) return res.json({ status: false, type: 'error', title: 'Error', text: 'Debe seleccionar la empresa' })
        const empresa = await model.getEmpresasbyId(req.body.id)
        if(empresa.length != 1) return res.json({ status: false, type: 'error', title: 'Error', text: 'Hubo un error al obtener la empresa' })
        let localidad = await mLocalidades.getProvinciasByLocalidad(empresa[0].id_localidad_fk)
    
        empresa[0].fecha_inicio = empresa[0].fecha_inicio == null ? '' : utils.changeDateDMY(empresa[0].fecha_inicio)
        empresa[0].id_provincia_fk = localidad[0].idProvincia
        empresa[0].pathImagen = !empresa[0].imagen ? `/img/noimage.png` : `/img/empresas/${empresa[0].imagen}`

        res.json({ status: true, empresa: empresa[0] })
    } catch (error) {
        console.log((error))
        return res.json({ status: false, type: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postModificar = async (req, res) => {
    try {
        let _filename=null
        const storage = await multer.diskStorage({
            destination: function (req, file, cb) {
                fs.mkdirSync(_pathImgEmpresas, { recursive: true })
                cb(null, _pathImgEmpresas)
            },
            filename: function (req, file, cb) {
                _filename = `${req.query.id}.${file.originalname.split('.').pop()}`
                cb(null, _filename)
            }
        })
        const upload = await multer({ storage : storage }).single('file')
        await upload(req, res, async function (err){
            if(err){
                console.log(err)
                return err
            }

            req.body.data = JSON.parse(req.body.data)
            const validacion = await Validar(req.body.data)
            if(!validacion.status) return res.json(validacion)
            
            req.body.data.imagen = _filename
            req.body.data.fechaIniAct = utils.changeDateYMD(req.body.data.fechaIniAct)

            let result = await model.update(req.body.data)
            if(result.affectedRows > 0) return res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
            return res.json({ status: false, icon: 'success', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        })
    } catch (error) {
        console.log(error)
        res.json({ status: false, type: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postEliminarImagen = async (req, res) => {
    try {
        let empresa = await model.getEmpresasbyId(req.body.id)
        if(empresa.length != 1) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud (1)' })
        if(empresa[0].imagen == null) return res.json({ status: false, icon: 'error', title: 'Error', text: 'La empresa no tiene imagen seleccionada' })

        console.log(fs.existsSync(path.join(_pathImgEmpresas, empresa[0].imagen)))

        if(fs.existsSync(path.join(_pathImgEmpresas, empresa[0].imagen))){
            fs.rmSync(path.join(_pathImgEmpresas, empresa[0].imagen), { recursive: true, force: true })
        }

        let result = await model.deleteImagen(req.body.id)
        if(result.affectedRows > 0) return res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud (2)' })
    }
}

const Validar = o => {
    return new Promise((resolve, reject) => {
        if(o.razonSocial.trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la razón social' })
        if(o.cuit.trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el CUIT' })
        if(o.fechaIniAct.length != 10) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la fecha de inicio de actividad' })
        if(!o.condicionIva) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la condición de IVA' })
        if(o.direccion.trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la dirección' })
        if(!o.provincia) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la provincia' })
        if(!o.localidad) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la localidad' })
        if(!o.modo) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el modo de facturación electrónica' })
        // if(o.token.trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la token para facturar segun el modo' })
        resolve({ status: true })
    })
}