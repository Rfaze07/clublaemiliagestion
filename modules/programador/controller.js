const query = require("../../database").queryMYSQL;
const menu = require('../../menu');

exports.getMenuSettings = async(req,res) => {
    const tree = await menu.getMenues();

    let tree_html = ``;

    const renderSubitems = (current) => {
        let html = ``;
        if(current.subitems){
            for( let i = 0; i < current.subitems.length; i++){
                let s = current.subitems[i]
               
                let icon = (s.subitems) ? '<i class="fa fa-arrow-right"></i>' : ''
                let toggle_class = (s.subitems) ? 'toggle_content' : ''
                let controls = `
                <button class="config_btn btn btn-sm btn-warning" title="Editar" data-id="${s.id}"><i class="fa fa-pencil"></i></button>
                <button class="borrar_btn btn btn-sm btn-danger" title="Borrar" data-id="${s.id}"><i class="fa fa-trash"></i></button>`
                let addSubitem = (!s.ruta) ? `<button class="addSubitem_btn btn btn-sm btn-success" title="Agregar subitem" data-id="${s.id}"><i class="fa fa-plus"></i></button>` : ''

                html += `<div id="group_${s.id}" class="parent_elem">
                    <div>
                        <span>
                            ${controls} ${addSubitem} <span class="${toggle_class}" data-id="${s.id}"> <b> ${(s.orden) ? s.orden + ")" : '' } ${s.titulo}</b> &nbsp; ${icon} </span>
                        </span>
                       
                    </div>
                    
                    <div id="content_${s.id}" class="collapsed">
                        <div style="padding-left:4rem">
                        ${renderSubitems(s)}
                        </div>
                    </div>
                    
                </div>`
            }
            return html;
        }
        else return "";
    }


    for(let i = 0; i < tree.length; i++){
        let cur = tree[i];
        
        let controls = `
        <button class="config_btn btn btn-sm btn-warning" title="Editar" data-id="${cur.id}"><i class="fa fa-pencil"></i></button>
        <button class="borrar_btn btn btn-sm btn-danger" title="Borrar" data-id="${cur.id}"><i class="fa fa-trash"></i></button>`
        let addSubitem = (!cur.ruta) ? `<button class="addSubitem_btn btn btn-sm btn-success" title="Agregar subitem" data-id="${cur.id}"><i class="fa fa-plus"></i></button>` : ''
        let toggle_class = (cur.subitems) ? 'toggle_content' : ''
        let arrow = (cur.subitems) ? `<i class="fa fa-arrow-right"></i>` : ''

        let base_elem = `<div id="group_${cur.id}" class="parent_elem col col-md-6">
            <div>
                <span>
                    ${controls} ${addSubitem} <span class="${toggle_class}" data-id="${cur.id}"> <b > ${(cur.orden) ? cur.orden + ")" : '' } ${cur.titulo}</b> &nbsp; ${arrow} </span>
                </span>
            </div>
            <div id="content_${cur.id}" class="collapsed">
                <div style="padding-left:4rem">${renderSubitems(cur)}</div>
            </div>
        </div>`;

        tree_html+=base_elem 

  
    }

    let pantallas = await query("SELECT * from pantallas where activa = 1");

    res.render("programador/views/menu",{ tree_html, pantallas });
}

exports.getItem = async (req,res) => {
    const {id} = req.params;
    const item = await query("SELECT * from menuitems where id = ?",[id]);
    res.send(item[0] || null)
}

exports.guardarItemMenu = async(req,res) => {
    let {id, titulo, pantalla, tipo, parent,icono, orden} = req.body; 
    
    if(tipo == 'dropdown') pantalla = null
    if(parent == "") parent = null
    if(!orden) orden = null

    try{
        if(!id){ //nuevo
            await query("INSERT INTO menuitems (titulo,parent,id_pantalla,icono, orden) VALUES(?,?,?,?,?);",[titulo,parent,pantalla,icono,orden]);
        }
        else{
            await query("UPDATE menuitems set titulo = ?, id_pantalla = ?, icono = ?, orden = ? where id = ?",[titulo,pantalla,icono,orden,id]);
        }
        await menu.loadMenuHTML(); //Actualizar el menu en memoria.
        res.send('done')
    }
    catch(er){
        res.send(er)
    }
    
    
}

exports.borrarItemMenu = async(req,res) => {
    let {id} = req.params;

    try{
        await query("DELETE FROM menuitems where id = ? or parent = ?",[id,id]);
        await menu.loadMenuHTML(); //Actualizar el menu en memoria.
        res.send('done')
    }
    catch(er){
        res.send(er)
    }

}

exports.getListaModulos = async(req,res) => {
    let modulos = await query("SELECT * from pantallas");
    res.render("programador/views/modulos",{modulos});
}

exports.getModuloById = async(req,res) => {
    let {id} = req.params;
    let modulo = await query("SELECT * from pantallas where id = ?",[id]);

    res.send(modulo[0] || null)
}

exports.guardarModulos = async(req,res) => {

    let { id,titulo,ayuda,ruta,nivel } = req.body;
    
    if(ruta[0] != "/") ruta = "/" + ruta;

    let idStr = (id) ? 'and id <> ?' : ''
    
    let existeTitulo = await query(`SELECT * FROM pantallas where titulo = ? ${idStr}`,[titulo,id])
    if(existeTitulo && existeTitulo.length){
        return res.send('Ya existe un módulo con ese título')
    }

    let existeRuta = await query(`SELECT * FROM pantallas where ruta = ? ${idStr}`,[ruta,id])
    if(existeRuta && existeRuta.length){
        return res.send('Ya existe un módulo con esa ruta')
    }

    try{
        if(!id){
            await query("INSERT INTO pantallas (titulo, ayuda, activa, ruta, nivel) VALUES(?, ?, 1, ?, ?);",[titulo,ayuda,ruta,nivel])
        }
        else{
            await query("UPDATE pantallas SET titulo=?, ayuda=?, ruta=?, nivel=? WHERE id=?;",[titulo,ayuda,ruta,nivel,id])
        }

        await menu.loadMenuHTML(); //Actualizar el menu en memoria.
        res.send('done')
    }
    catch(er){
        res.send(er)
    }    
}

exports.borrarModulo = async(req,res)=>{
    let {id} = req.params;
    
    await query("DELETE FROM pantallas where id = ?",[id])
    
    await menu.loadMenuHTML(); //Actualizar el menu en memoria.
    res.send('done') 
} 