const backup = require("./backup")


exports.postEjecutar = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(String(req.query.dbAppKey).trim().length > 0 && String(req.body.dbAppSecret).trim().length > 0 && String(req.body.dbTokenRefresh).trim().length > 0){
                const resBackup = await backup.createDump({
                    dbAppKey: req.query.dbAppKey,
                    dbAppSecret: req.body.dbAppSecret,
                    dbTokenRefresh: req.body.dbTokenRefresh
                })
                if(!resBackup.status) return resolve(res.json({ status: false }))
                return resolve(res.json({ status: true }))
            }else{
                return resolve(res.json({ status: false, msg: 'Datos inválidos' }))
            }
        } catch (error) {
            console.log(error)
            return resolve(res.json({ status: false, msg: `ERROR > ${JSON.stringify(error)}` }))
        }
    })
}