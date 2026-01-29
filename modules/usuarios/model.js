// const { queryMYSQL} = require("../../database");
const { queryMSSQL, queryMYSQL } = require("../../database");


exports.execQuery = (q, p) => {
	return queryMYSQL(q, p)
}

exports.getAll = () => {
	return queryMYSQL("SELECT * FROM secr ORDER BY usuario", []);
}

exports.getByName = username => {
	// return queryMYSQL(`SELECT * FROM secr WHERE usuario = ?`, [username])
	return queryMYSQL(`
		SELECT s.unica, s.usuario, s.clave, email, niveles, 
			IFNULL(s.id_empleado_fk, 0) AS id_empleado_fk, 
			IFNULL(e.id_cargo_fk, 0) AS id_cargo_fk 
		FROM secr s 
		LEFT JOIN empleados e ON e.id = s.id_empleado_fk 
		WHERE usuario = ?
	`, [username])
}

exports.getNotis = (usuario) => {
	return queryMSSQL(`SELECT n.texto as texto, n.id as id, n.f_notif, n.ff_notif, n.usuarios, n.f_carga, ISNULL(v.tipo,'N') as visto 
	FROM notifica n left join notvistog v on n.id=v.notific and v.usuario=? and v.tipo='A' 
	WHERE convert(int,GETDATE(),113) between convert(int,n.f_notif,112) and convert(int,n.ff_notif,112)  and 
    (n.usuarios='' or n.usuarios like '%#GESTION%')`, [usuario]);
}

exports.checkeaNotiVisto = (idNoti, id_cliente) => {
	return queryMSSQL(`SELECT * FROM notvistog WHERE notific = ? AND usuario = ? AND tipo = 'A'`, [idNoti, id_cliente]);
}

exports.updateNotiVisto = (notiId, id_cliente) => {
	return queryMSSQL(`INSERT INTO notvistog (usuario,notific,tipo) VALUES (?,?,'A')`, [id_cliente, notiId]);
}

exports.insert = (usuario, mail, clave, niveles) => {
	return queryMYSQL(`
		INSERT INTO secr (usuario, mail, clave, activa, alta, niveles) 
		VALUES (?,?,?,1,NOW(),?)
	`, [usuario, mail, clave, niveles])
}

exports.insertEmpleado = (usuario, mail, clave, niveles, idEmpleado) => {
	return queryMYSQL(`
		INSERT INTO secr (usuario, mail, clave, activa, alta, niveles, id_empleado_fk) 
		VALUES (?,?,?,1,NOW(),?,?)
	`, [usuario, mail, clave, niveles, idEmpleado])
}

exports.borrarSecr2 = unica => {
	params = [unica];
	return queryMYSQL("DELETE FROM secr2 WHERE unica = ?", params);
}

exports.borrar = unica => {
	params = [unica];
	return queryMYSQL("DELETE FROM secr WHERE unica = ?", params);
}

exports.getById = unica => {
	params = [unica];
	return queryMYSQL("select * from secr where unica = ?", params);
}

exports.update = o => {
	return queryMYSQL(`
		UPDATE secr 
		SET usuario= ?, mail= ?, activa = ?, niveles= ?
		WHERE unica= ?
	`, [o.usuario, o.mail, o.activa, o.niveles, o.unica])
}

exports.updateEmpleado = o => {
	return queryMYSQL(`
		UPDATE secr 
		SET usuario=?, mail=?, activa =?, niveles=?, id_empleado_fk=? 
		WHERE unica=?
	`, [o.usuario, o.mail, o.activa, o.niveles, o.empleado, o.unica])
}

exports.updatePass = (unica, pass) => {
	params = [pass, unica];
	return queryMYSQL("UPDATE secr SET clave= ? WHERE unica= ?", params);
}


//FUNCIONES RELACIONADAS A PERMISOS



exports.getAccesosPorUsuario = unica => {
	params = [unica];
	return queryMYSQL("SELECT * FROM secr2 WHERE unica = ? ORDER BY menu", params);
}

exports.VerificarNivelAdministracion = idUsuario => {
	params = [idUsuario];
	return queryMYSQL("select niveles as tiene_permiso from secr where unica = ? and niveles = 'Administrador' ", params);
}

exports.verificarAcceso = (idUsuario, idMenu, permiso) => {
	params = [idUsuario, idMenu];
	return queryMYSQL("select " + permiso + " from secr2 where unica = ? AND menu = ?", params);
}

exports.verificarAccesosAll = (idUsuario, idMenu) => {
	params = [idUsuario, idMenu];
	return queryMYSQL("select * from secr2 where unica = ? AND menu = ?", params);
}

exports.getPantalla = idMenu => {
	params = [idMenu];
	return queryMYSQL("select * from pantallas where id = ?", params);
}

exports.getMenues = () => {
	return queryMYSQL("select * from pantallas", []);
}

exports. getLastMenuId = () => {
	return queryMYSQL("select max(id) as id from pantallas", []);
}

exports.getLastAccesoId = unica => {
	params = [unica];
	return queryMYSQL("select max(menu) as menu from secr2 where unica = ?", params);
}

exports.verificarmenu = (unica, menu) => {
	params = [unica, menu];
	return queryMYSQL("select * from secr2 where unica = ? AND menu = ?", params);
}

exports.insertMenu = (unica, menu) => {
	params = [unica, menu];
	return queryMYSQL("insert into secr2(unica, menu, a, b, c, m,x) values (?, ?, 0, 0, 0, 0, 0);", params);
}

exports.updateAcceso = (unica, menu, acceso_short, value) => {
	params = [value, unica, menu];
	return queryMYSQL(`
		UPDATE secr2 SET ${acceso_short} = ? WHERE unica = ? AND menu = ?
	`, params);
}

exports.selectMenu = name => {
	params = [name];
	return queryMYSQL("SELECT id FROM pantallas WHERE route = ?", params);
}

exports.selectAction = name => {
	params = [name];
	return queryMYSQL("SELECT short FROM accesos WHERE descripcion = ?", params);
}

exports.getModuloByRuta = ruta => {
	return queryMYSQL("SELECT * FROM pantallas where ruta = ?", [ruta]);
}

exports.getUsuarioById = idUsuario => {

	return queryMYSQL('select s.unica, s.usuario from secr s where unica = ?',[idUsuario])

}

exports.getUsuarios = () => {

	return queryMYSQL("select s.unica, s.usuario, s.niveles from secr s where activa = 1")

}