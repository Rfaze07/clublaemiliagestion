const fs = require('fs');
const database = require('./database');

//ESTA VARIABLE MANTIENE EL MENÚ HTML EN MEMORIA, PARA EVITAR SER CONSULTADO EN LA DB
//CON CADA REQUEST QUE HAGA EL USER. 
//SE LLENA CON LA FUNCION loadMenuHTML CON LA PRIMER LLAMADA A getMenuHTML
//o cuando se edita algún elemento del menú desde la seccion de programador.
let menu_html = null;


exports.getMenuHTML = async () => {
    if (!menu_html) await exports.loadMenuHTML();
    return menu_html;
}

const insertSubItems = async (item, parentID) => {
    if(item.subitems){
        for( let i = 0; i < item.subitems.length; i++){
            let subitem = item.subitems[i];
            params = [
                { name : 'titulo', value : subitem.titulo },
                { name :'parent', value : parentID },
                { name : 'ruta', value : subitem.ruta || null }
            ]

            const inserted = await database.queryMYSQL("INSERT INTO menuitems (titulo, parent, ruta) VALUES (@titulo, @parent, @ruta); SELECT @@IDENTITY AS ID",params)
            if(inserted && inserted.length){
                //Subitems
                await insertSubItems(subitem, inserted[0].ID);
            }
        }
    }
}

exports.getMenues = async () => {

   const menues_todos = await database.queryMYSQL(`SELECT menuitems.*, pantallas.ruta FROM menuitems 
   LEFT JOIN pantallas on menuitems.id_pantalla = pantallas.id order by menuitems.orden asc`,[]);

    //obtengo el nivel base del arbol.
    let base = menues_todos.filter((el) => {
        return el.parent == null;
    })

    let tree = base;

    //funcion recursiva para obtener subitems.
    const getSubitems = (current) => {
        let subitems = menues_todos.filter( el => {
            return el.parent == current.id;
        })

        if(subitems.length){
            for( let i = 0; i < subitems.length; i++){
                subitems[i].subitems = getSubitems(subitems[i]);
            }
            return subitems;
        }
        else return null;
    }

    //por cada item base obtener sus subitems
    for( let i = 0; i < base.length; i++){
        tree[i].subitems = getSubitems(base[i]);
    }


    return tree;

}


exports.loadMenuHTML = async () => {
    const tree = await exports.getMenues();

    let tree_html = ``;

    const renderSubitems = (current) => {
        let html = ``;
        if(current.subitems){
            for( let i = 0; i < current.subitems.length; i++){
                let s = current.subitems[i]
                let href = (s.ruta) ? s.ruta : `#_content${s.id}`
                let attribs = (s.ruta) ? 'aria-expanded="false"' : `data-toggle="collapse" aria-expanded="true" class="dropdown-toggle"`
                let icono =  (s.icono) ? `<i class="${ s.icono }"></i>` : ''
                html += `
                <ul class="collapse list-unstyled" id="_content${s.parent}">
                    <li>
                        <a  
                            href="${href}" 
                            ${attribs}
                        >
                        ${icono} ${s.titulo}
                        </a>
                        ${renderSubitems(s)}
                    </li>
                </ul>`
            }
            return html;
        }
        else return "";
    }


    for(let i = 0; i < tree.length; i++){
        let cur = tree[i];
     
        let href = (cur.ruta) ? cur.ruta : `#_content${cur.id}`
        let attribs = (cur.ruta) ? 'aria-expanded="false"' : `data-toggle="collapse" aria-expanded="true" class="dropdown-toggle"` 
        let icono = (cur.icono) ? `<i class="${ cur.icono }"></i>` : ''
        base_elem= `<li>
            <a  
                href="${href}" 
                ${attribs}
            >
                ${icono} ${cur.titulo}
            </a>
            ${renderSubitems(cur)}
        </li>`

        tree_html+=base_elem 

  
    }

    menu_html = tree_html;
}




