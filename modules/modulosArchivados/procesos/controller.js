const mProcesos = require("./model");
const utils = require("../../public/js/utils");
const eventos = require("../eventos/controller");

exports.actualizarFamilias = async () => {
  try {
    let inicio_proceso = Date.now();
    const familiasLogistica = await mProcesos.getFAMILIAS_LOGISTICA();
    const familiasVentam = await mProcesos.getFAMILIAS();

    console.log("---> Actualizando familias");

    for (const familiaVentam of familiasVentam) {
      const familiaLogistica = familiasLogistica.find(
        (familia) => familia.id === familiaVentam.codigo
      );

      if (familiasLogistica && familiaLogistica?.activo == 0) continue;

      try {
        if (!familiaLogistica) {
          await mProcesos.insertFAMILIAS_LOGISTICA({
            id: familiaVentam.codigo,
            descripcion: familiaVentam.nombre,
            codigo: familiaVentam.codigo
          });
        } else {
          await mProcesos.updateFAMILIAS_LOGISTICA({
            id: familiaVentam.codigo,
            descripcion: familiaVentam.nombre,
            fecha_actualizacion: utils.generateTodayDateYMD_Hours(),
            codigo: familiaVentam.codigo
          });
        }
      } catch (error) {
        console.error(
          `Error actualizando familia con id ${familiaVentam.codigo}:`,
          error
        );
      }
    }

    let fin_proceso = Date.now();

    let duracion = (fin_proceso - inicio_proceso) / 1000;

    await eventos.insertarEvento({
      tabla: "familias",
      usuario: 0,
      mensaje: `Actualización de familias finalizada. Duración: ${duracion} segundos.`,
    });
  } catch (error) {
    console.error("Error obteniendo datos de familias:", error);
  }
};

exports.actualizarRubros = async () => {
  try {
    let inicio_proceso = Date.now();
    const rubrosLogistica = await mProcesos.getRUBROS_LOGISTICA();
    const rubrosVentam = await mProcesos.getRUBROS();

    console.log("---> Actualizando rubros");

    for (const rubroVentam of rubrosVentam) {
      const rubroLogistica = rubrosLogistica.find(
        (rubro) => rubro.id === rubroVentam.ru_nume
      );

      if (rubrosLogistica && rubroLogistica?.activo == 0) continue;

      try {
        if (!rubroLogistica) {
          await mProcesos.insertRUBROS_LOGISTICA({
            id: rubroVentam.ru_nume,
            descripcion: rubroVentam.ru_deno,
            codigo: rubroVentam.ru_nume
          });
        } else {
          await mProcesos.updateRUBROS_LOGISTICA({
            id: rubroVentam.ru_nume,
            descripcion: rubroVentam.ru_deno,
            fecha_actualizacion: utils.generateTodayDateYMD_Hours(),
            codigo: rubroVentam.ru_nume
          });
        }
      } catch (error) {
        console.error(
          `Error actualizando rubro con id ${rubroVentam.ru_nume}:`,
          error
        );
      }
    }

    let fin_proceso = Date.now();

    let duracion = (fin_proceso - inicio_proceso) / 1000;

    await eventos.insertarEvento({
      tabla: "rubros",
      usuario: 0,
      mensaje: `Actualización de rubros finalizada. Duración: ${duracion} segundos.`,
    });
  } catch (error) {
    console.error("Error obteniendo datos de rubros:", error);
  }
};

exports.actualizarMarcas = async () => {
  try {
    let inicio_proceso = Date.now();
    const marcasLogistica = await mProcesos.getMARCAS_LOGISTICA();
    const marcasVentam = await mProcesos.getMARCAS();

    console.log("---> Actualizando marcas");

    for (const marcaVentam of marcasVentam) {
      const marcaLogistica = marcasLogistica.find(
        (marca) => marca.id === marcaVentam.ma_codigo
      );

      if (marcasLogistica && marcaLogistica?.activo == 0) continue;

      try {
        if (!marcaLogistica) {
          await mProcesos.insertMARCAS_LOGISTICA({
            id: marcaVentam.ma_codigo,
            descripcion: marcaVentam.ma_nombre,
            codigo: marcaVentam.ma_codigo
          });
        } else {
          await mProcesos.updateMARCAS_LOGISTICA({
            id: marcaVentam.ma_codigo,
            descripcion: marcaVentam.ma_nombre,
            fecha_actualizacion: utils.generateTodayDateYMD_Hours(),
            codigo: marcaVentam.ma_codigo
          });
        }
      } catch (error) {
        console.error(
          `Error actualizando marca con id ${marcaVentam.ma_codigo}:`,
          error
        );
      }
    }

    let fin_proceso = Date.now();

    let duracion = (fin_proceso - inicio_proceso) / 1000;

    await eventos.insertarEvento({
      tabla: "marcas",
      usuario: 0,
      mensaje: `Actualización de marcas finalizada. Duración: ${duracion} segundos.`,
    });
  } catch (error) {
    console.error("Error obteniendo datos de marcas:", error);
  }
};

exports.actualizarArticulos = async () => {
  try {
    let inicio_proceso = Date.now();
    const articulosLogistica = await mProcesos.getARTICULOS_LOGISTICA();
    const articulosVentam = await mProcesos.getSTOCK();
    const proveedoresLogistica = await mProcesos.getPROVEEDORES_LOGISTICA();

    console.log("---> Actualizando articulos");

    for (const articuloVentam of articulosVentam) {
      const articuloLogistica = articulosLogistica.find(
        (articulo) => articulo.id === articuloVentam.st_interno
      );

      if (articulosLogistica && articuloLogistica?.activo == 0) continue;

      const proveedor = proveedoresLogistica.find(
        (proveedor) =>
          proveedor.nume === articuloVentam.st_prov ||
          proveedor.numero === articuloVentam.st_prov
      );

      try {
        if (!articuloLogistica) {
          await mProcesos.insertARTICULOS_LOGISTICA({
            id: articuloVentam.st_interno,
            codigo1: articuloVentam.st_codigo1,
            codigo2: articuloVentam.st_codigo2,
            codigo3: articuloVentam.st_codigo3,
            nombre: articuloVentam.st_nombre,
            alic_iva: articuloVentam.st_iva,
            impuesto: articuloVentam.st_impu,
            id_rubro_fk: articuloVentam.st_rubr,
            id_marca_fk: articuloVentam.st_marc,
            nombre_largo: articuloVentam.st_larga,
            id_proveedor_fk: proveedor?.id_proveedor_fk || 0,
            fecha_mod: articuloVentam.st_fecha,
            fecha_uc: articuloVentam.st_fuc,
            moneda: articuloVentam.st_moneda,
            id_familia_fk: articuloVentam.st_fami,
            obs: articuloVentam.st_obs,
            fecha_cp: articuloVentam.st_fucp,
            comentario: articuloVentam.st_comen,
            segundo_reng: articuloVentam.st_segren,
            vence_dias: articuloVentam.st_diasd,
            volumen: articuloVentam.st_m3,
            peso: articuloVentam.st_volum,
            precio_ref: articuloVentam.st_precio4,
            id_centro_distr_fk: articuloVentam.st_depp,
          });
        } else {
          await mProcesos.updateARTICULOS_LOGISTICA({
            id: articuloVentam.st_interno,
            codigo1: articuloVentam.st_codigo1,
            codigo2: articuloVentam.st_codigo2,
            codigo3: articuloVentam.st_codigo3,
            nombre: articuloVentam.st_nombre,
            alic_iva: articuloVentam.st_iva,
            impuesto: articuloVentam.st_impu,
            id_rubro_fk: articuloVentam.st_rubr,
            id_marca_fk: articuloVentam.st_marc,
            nombre_largo: articuloVentam.st_larga,
            id_proveedor_fk: proveedor?.id_proveedor_fk || 0,
            fecha_mod: articuloVentam.st_fecha,
            fecha_uc: articuloVentam.st_fuc,
            moneda: articuloVentam.st_moneda,
            id_familia_fk: articuloVentam.st_fami,
            obs: articuloVentam.st_obs,
            fecha_cp: articuloVentam.st_fucp,
            comentario: articuloVentam.st_comen,
            segundo_reng: articuloVentam.st_segren,
            vence_dias: articuloVentam.st_diasd,
            volumen: articuloVentam.st_m3,
            peso: articuloVentam.st_volum,
            precio_ref: articuloVentam.st_precio4,
            fecha_actualizacion: utils.generateTodayDateYMD_Hours(),
            id_centro_distr_fk: articuloVentam.st_depp,
          });
        }
      } catch (error) {
        console.error(
          `Error actualizando artículo con id ${articuloVentam.st_interno}:`,
          error
        );
      }
    }

    let fin_proceso = Date.now();

    let duracion = (fin_proceso - inicio_proceso) / 1000;

    await eventos.insertarEvento({
      tabla: "articulos",
      usuario: 0,
      mensaje: `Actualización de artículos finalizada. Duración: ${duracion} segundos.`,
    });
  } catch (error) {
    console.error("Error obteniendo datos de artículos:", error);
  }
};

exports.actualizarProveedores = async () => {
  try {
    let inicio_proceso = Date.now();
    const proveedoresLogistica = await mProcesos.getPROVEEDORES_LOGISTICA();
    const proveedoresVentam = await mProcesos.getPROVEEDORES();
    const Localidades = await mProcesos.getLocalidades()
    const provincias = await mProcesos.getProvincias()
    let provincia
    let localidad
    
    console.log("---> Actualizando proveedores");

    for (const proveedorVentam of proveedoresVentam) {
      const proveedorLogistica = proveedoresLogistica.find(
        (proveedor) => proveedor.nume === proveedorVentam.pr_nume
      );

      if (proveedoresLogistica && proveedorLogistica?.activo == 0) continue;
      
      const proveedorVentamProv = proveedorVentam.pr_prov.trim().toLowerCase()
      const proveedorVentamLocal = proveedorVentam.pr_local.trim().toLowerCase()

      provincia = provincias.find(item => proveedorVentamProv === item.nombre.trim().toLowerCase() )
      provincia = provincia || { id: 0, nombre: 'Sin Provincia' }
      console.log(provincia)


      localidad = Localidades.find(item => proveedorVentamLocal === item.nombre.trim().toLowerCase() && proveedorVentamLocal !== "")
      localidad = localidad || { id: 0, nombre: 'Sin Localidad' }
      

      try {
        if (!proveedorLogistica) {
          await mProcesos.insertPROVEEDORES_LOGISTICA({
            nume: proveedorVentam.pr_nume,
            numero: proveedorVentam.pr_numero,
            apellido: proveedorVentam.pr_apel,
            fantasia: proveedorVentam.pr_fanta,
            localidad: proveedorVentam.pr_local,
            provincia: proveedorVentam.pr_prov,
            codigo_postal: proveedorVentam.pr_cp,
            cuit: proveedorVentam.pr_cuit,
            idProvincia: provincia.id,
            idLocalidad: localidad.id,

          });
        } else {
          await mProcesos.updatePROVEEDORES_LOGISTICA({
            nume: proveedorVentam.pr_nume,
            numero: proveedorVentam.pr_numero,
            apellido: proveedorVentam.pr_apel,
            fantasia: proveedorVentam.pr_fanta,
            localidad: proveedorVentam.pr_local,
            provincia: proveedorVentam.pr_prov,
            codigo_postal: proveedorVentam.pr_cp,
            cuit: proveedorVentam.pr_cuit,
            fecha_actualizacion: utils.generateTodayDateYMD_Hours(),
            idProvincia: provincia.id,
            idLocalidad: localidad.id,
          });
        }
      } catch (error) {
        console.error(
          `Error actualizando proveedor con nume ${proveedorVentam.pr_nume}:`,
          error
        );
      }
    }

    let fin_proceso = Date.now();

    let duracion = (fin_proceso - inicio_proceso) / 1000;

    await eventos.insertarEvento({
      tabla: "proveedores",
      usuario: 0,
      mensaje: `Actualización de proveedores finalizada. Duración: ${duracion} segundos.`,
    });
  } catch (error) {
    console.error("Error obteniendo datos de proveedores:", error);
  }
};

exports.actualizarTablasLogistica = async () => {
  console.log("-----Actualizando tablas logistica-----");
  try {
    await this.actualizarFamilias();
    await this.actualizarRubros();
    await this.actualizarMarcas();
    await this.actualizarProveedores();
    await this.actualizarArticulos();

    console.log("-----Tablas actualizadas-----");
  } catch (error) {
    console.error("Error actualizando tablas logistica:", error);
  }
};
