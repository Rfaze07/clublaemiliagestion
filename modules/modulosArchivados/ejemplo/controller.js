//EJEMPLO
const model = require('./model');

exports.getEjemplo = async (req,res) => {
    let testMysql = await model.pruebaMysql("hola");
    // let testMssql = await model.pruebaMSSQL("hola","ventam");
    // let testMssql2 = await model.pruebaMSSQL("hola","copermat");
    
    res.render('ejemplo/views/index',{
        testMysql,
        // testMssql,
        // testMssql2
    })
}