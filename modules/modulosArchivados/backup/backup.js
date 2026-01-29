const mysqldump = require('mysqldump')
const fs = require('fs')
const request = require('request')
const br = require('binary-reader')
const chunk_size = 1 * 1024 * 1024 // 50mb
let TOKEN = ""


const startUpload = (data, reader, remotepath, localpath, objDropbox) => {
    return new Promise(async (resolve, reject) => {
        console.log('>> INICIO SESION DE SUBIDA')

        try{
            const resultTokenDB = await getAccessToken(objDropbox)

            if(resultTokenDB.status){
                TOKEN = resultTokenDB.data.access_token

                request.post({
                    url: 'https://content.dropboxapi.com/2/files/upload_session/start',
                    body: data,
                    headers: {
                            "Content-Type": "application/octet-stream",
                            "Authorization": `Bearer ${TOKEN}`, // la token generada desde la cuenta de dropbox
                            "Dropbox-API-Arg": '{"close": false}'
                        }
                    },
                    async (error, resp, body) => {
                        if(error){
                            console.log(error)
                            return reject({ status: false, text: 'Error al obtener token Dropbox', error })
                        }
                        
                        let session = JSON.parse(body)
                        if(session.error_summary){
                            console.log(error)
                            return reject({ status: false, text: 'Error al obtener token Dropbox', error })
                        }

                        let result=null
                        if(!reader.isEOF()){ // Si no llegué al final del archivo sigo agregando mas data!
                            result = await appendData(session.session_id, reader, remotepath, localpath, objDropbox)
                            if(result.status)
                                return resolve({ status: true, text: 'Exito' })
                            else
                                return reject({ status: false, text: 'APPEND - Error al iniciar sesion de subida en Dropbox', error })

                        }else{ // terminé, finalizo la sesion!
                            result = await finishUpload(session.session_id, reader, remotepath, localpath, objDropbox)
                            if(result.status)
                                return resolve({ status: true, text: 'Exito' })
                            else
                                return reject({ status: false, text: 'APPEND - Error al iniciar sesion de subida en Dropbox', error })
                        }
                    }
                )
            }else{
                return reject({ status: false, text: 'Error al obtener el acces token de Dropbox', error: resultTokenDB })
            }
        }
        catch(error){
            console.error(error)
            return reject({ status: false, text: 'ERROR - startUpload()', error })
        }
    })
}

const getAccessToken = async o => {
    return new Promise( (resolve,reject) => {
        console.log('>> OBTENIENDO TOKEN DROPBOX')

        try{
            let authString = Buffer.from(o.dbAppKey + ':' + o.dbAppSecret).toString('base64')

            request.post({
                url : "https://api.dropboxapi.com/oauth2/token",
                headers : {
                    "Content-Type" : "application/x-www-form-urlencoded",
                    "Authorization" : `Basic ${authString}`
                },
                form: {
                    refresh_token: o.dbTokenRefresh,
                    grant_type: 'refresh_token'
                }
            },
            function(error, resp, body){
                if(error)
                    return reject({ status: false, text: 'error', error })
                else 
                    return resolve({ status: true, data: JSON.parse(body) })
            })
        }catch(error){
            console.log(error)
            return reject({ status: false, text: 'error', error })
        }
    })
}

const appendData = (session_id, reader, remotepath, localpath, objDropbox) => {
    return new Promise((resolve ,reject) => {
        console.log('>> SUBIENDO ARCHIVO - APPEND')

        let offset = reader.tell()

        reader.read(chunk_size, function(bytesRead, buffer){
            let this_reader = this

            request.post({
                    url: 'https://content.dropboxapi.com/2/files/upload_session/append_v2',
                    body: buffer,
                    headers: {
                        "Content-Type": "application/octet-stream",
                        "Authorization": `Bearer ${TOKEN}`, // la token generada desde la cuenta de dropbox
                        "Dropbox-API-Arg": JSON.stringify({"cursor": {"session_id": session_id ,"offset": offset }, "close": false })
                    }
                },
                async function(error, resp, body){
                    if(error){
                        console.log(error)
                        return reject({ status: false, text: 'Error al obtener token Dropbox', error })
                    }

                    if(!this_reader.isEOF()){ // Si no llegué al final del archivo sigo agregando mas data!
                        result = await appendData(session_id, this_reader, remotepath, localpath, objDropbox)
                        if(result.status)
                            return resolve({ status: true, text: 'Exito' })
                        else
                            return reject({ status: false, text: 'APPEND - Error al iniciar sesion de subida en Dropbox', error })

                    }else{ // terminé, finalizo la sesion!
                        result = await finishUpload(session_id, this_reader, remotepath, localpath, objDropbox)
                        if(result.status)
                            return resolve({ status: true, text: 'Exito' })
                        else
                            return reject({ status: false, text: 'APPEND - Error al iniciar sesion de subida en Dropbox', error })
                    }
                }
            )
        })
    })
}

const finishUpload = (session_id, reader, remotepath, localpath, objDropbox) => {
    return new Promise((resolve, reject) => {
        console.log('>> SUBIENDO ARCHIVO - FINISH')

        try {
            let offset = reader.size()

            request.post({
                url : 'https://content.dropboxapi.com/2/files/upload_session/finish',
                headers : {
                    "Content-Type": "application/octet-stream",
                    "Authorization": `Bearer ${TOKEN}`, // la token generada desde la cuenta de dropbox
                    "Dropbox-API-Arg": JSON.stringify({ "cursor": { "session_id": session_id, "offset": offset }, "commit": { "path": remotepath, "mode": "overwrite", "autorename": true, "mute": false, "strict_conflict": false }})
                }
            },
                function(error, resp, body){
                    body = JSON.parse(body)
                    reader.close()

                    if(error != null){
                        console.log(error)
                        return reject({ status: false, text: 'Error al finalizar subida Dropbox', error })
                    }else if(body.size == undefined){
                        return reject({ status: false, text: 'Error al finalizar subida Dropbox', error: body.error_summary })
                    }

                    fs.unlink(localpath, async function(error){
                        if(error){
                            console.log(error)
                            return reject({ status: false, text: 'Error al eliminar el archivo temporal', error })
                        }

                        let resultInformar = await informarBackup(objDropbox)
                        if(resultInformar.status)
                            return resolve({ status: true, text: 'Exito' })
                        else
                            return reject({ status: false, text: 'Error al eliminar el archivo temporal', error })
                    })
                }
            )
        } catch (error) {
            console.log(error)
            return reject({ status: false, text: 'ERROR - finishUpload()', error })
        }
    })
}

const informarBackup = o => {
    return new Promise(async (resolve, reject) => {
        try {
            const body = {
                db_app_key: o.dbAppKey,
                db_app_secret: o.dbAppSecret
            }
            
            request.post({
                headers: {'content-type' : 'application/json'},
                url: 'https://typrex.com/backup/respuesta',
                body,
                json: true
            },
                function(error, resp, body){
                    if(error) return resolve({ status: false, msg: 'Hubo un error' })
                    if(!body.status) return resolve({ status: false, msg: 'Hubo un error' })
                    return resolve({ status: true })
                }
            )
        } catch (error) {
            console.log(error)
            return resolve({ status: false, msg: 'Hubo un error' })
        }
    })
}

exports.createDump = objDropbox => {
    return new Promise(async (resolve, reject) => {
        console.log('--------  INICIANDO BACKUP  --------')
    
        const database = process.env.DB_MYSQL_NAME
        let filepath = `./utilidades/temp/`,
            nameFile = `dump_${new Date().getTime()}.sql.gz`
        
        // SI NO EXISTE CREO EL DIR
        if(!fs.existsSync(filepath)) fs.mkdirSync(filepath, { recursive: true })

        filepath += nameFile

        let reader = br.open(filepath)
        .on("error", error => {
            console.log(error)
            return reject({ status: false, text: 'ERROR', error })
        })
        .on ("close", () => {
            // console.log("archivo cerrado!")
        })

        let resultDump = await mysqldump({
            connection: {
                "host": process.env.DB_MYSQL_SERVER, 
                "user": process.env.DB_MYSQL_USER, 
                "password": process.env.DB_MYSQL_PASSWORD,
                "port": process.env.DB_MYSQL_PORT, 
                database
            },
            dumpToFile: filepath
        })

        if(resultDump.dump.schema.length != 0){
            if(!reader.isEOF()){ // Si el archivo no esta vacio..
                reader.read(chunk_size, async function(bytesRead, buffer){ // leo tantos bytes como indique chunk_size
                    let this_reader = this
                    let result = await startUpload(buffer, this_reader, `/BackupsBD/${nameFile}`, filepath, objDropbox)
                    if(result.status){
                        console.log('BACKUP CREADO SATISFACTORIAMENTE!')
                        console.log('--------  BACKUP FINALIZADO  --------')
                        return resolve({ status: true })
                    }else{
                        console.log('HUBO UN ERROR AL CREAR EL BACKUP!!!')
                        console.log('--------  BACKUP FINALIZADO  --------')
                        return reject({ status: false })
                    }
                })
            }
        }else{
            console.log('HUBO UN ERROR AL CREAR EL BACKUP!!!')
            console.log('--------  BACKUP FINALIZADO  --------')
            return reject({ status: false })
        }
    })
}