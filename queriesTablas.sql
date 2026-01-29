--CON ABM
create table empresas_log (
    id int auto_increment primary key,--N° de empresa
    razonSoc varchar(50),--Nombre de la empresa 
    direccion varchar(50),
    email varchar(100),
    activo tinyint,--Empresa Activa si, no 1,0
)

--SIN ABM
create table empresas_ext (
    id int primary key,--N° de empresa que consume el servicio
    razonSoc varchar(30),--Nombre de la empresa (Ventamat, Coopermat, …)
    cuit varchar(13),--N° de cuit  ej: 20-21890749-1
    activo tinyint,--Empresa Activa si, no 1,0
)

--SIN AMB
create table provincias (-- Tomar la que tiene Fausto
)

--SIN AMB
create table localidades (-- Tomar la que tiene Fausto
)

--CON ABM
create table barrios (
    -- Contenido: Tomar la que tiene Fausto (adaptarla) debería tener el campo id_localidad
)

--CON ABM


--CON ABM
create table camiones (
    id int auto_increment primary key,,
    dominio varchar(15),--Dominio o patente
    marca varchar(20),--Marca  ej: Ford
    modelo varchar(20),--Ej: F600
    ano decimal(4, 0),--Año (modelo) ej 2024
    ejes varchar(3),--Cantidad de ejes Ej: 6x2  6x4  4x2)
    tara decimal(3, 0),--Tara  (toneladas)
    largo decimal(3, 0),--Largo en mts
    masDatos varchar(300),--Mas datos 
    activo tinyint,--camión Activo si, no 1,0
) 

--CON ABM

--CON ABM
create table clientes_direc (
    -- FALTA DISEÑAR
)

--SIN AMB
create table rto_estados (
    codigo varchar(5) not null, --Al ser una tabla que llenamos a mano el código será único e irrepetible  Ej: 1.0 2.0 7.1 
    estadoLogistica varchar(30), --Es el estado que se ve en el sistema de logística ej “Esperando confirmación“  “Entregado”
    estadoCliente varchar(30), --Es el estado que verá el cliente en la app , email, web… Ej:  “Confirmado”
    activo tinyint,
)

--CON ABM
create table remitos (
    -- FALTA DISEÑAR
)

--CON ABM
create table hoja_ruta1 (
    -- FALTA DISEÑAR
)

--CON ABM
create table hoja_ruta2 (
    -- FALTA DISEÑAR
)

--SIN AMB
create table hoja_ruta_tipos (
    id int primary key,
    nombre varchar(40)  --1.REPARTO A CLIENTES
                        --2.DE FABRICA A DEPOSITO
                        --3.DE FABRICA A CLIENTE (uno)
                        --4.DE DEPOSITO A DEPOSITO
)

--CON ABM
create table pos_en_camion (
    --FALTA DISEÑAR
)

--CON ABM
create table depositos (
    id int auto_increment primary key,,
    id_empresas_log_fk int not null, --Empresas_log.id
    nombre varchar(30), --Nombre del depósito
    superficie decimal(7,0), --Metros 2
    volumen decimal(7,0), --Metros 3
    masDatos varchar(500), --Mas datos (ubicación, que contiene, etc)
    codigo varchar(10), --Si tuviera un código o n° de identificación: ejmplo A14   18   BN19
    activo tinyint,--deposito Activo si, no 1,0
)

--CON ABM
