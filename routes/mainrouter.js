const {Router} = require("express")
const main_router = Router()
const {pool} = require("../configuration/connection_db")
const {secreto} = require("../helpers/bcrypt")
const passport = require("passport")
const multer = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/') // Directorio donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
        // Generar un nombre de archivo único con la extensión del archivo original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop(); // Obtener la extensión del archivo
        cb(null, uniqueSuffix + '.' + extension); // Nombre del archivo con extensión
    }
});

const upload = multer({ storage: storage });

main_router.get("/login",(req, res) => {
    console.log("query strings : \n",req.query)

    let event_from_id = req.query.from
    console.log(event_from_id)

    let from = req.query.user
    console.log(from)


    res.render("login.ejs",{"error":false,"error_message":null,from,event_from_id})
})

main_router.get("/", async (req, res) => {

    const [eventos] = await pool.query ("SELECT * FROM Eventos order by FECHA_NUMERICA ASC")

    let my_inscriptions
    let my_guest_inscriptions

    if(req.user && req.user.ID){
        ([my_inscriptions] = await pool.query(
        `SELECT i.ID,i.NOMBRE_JUGADOR_UNO,i.APELLIDOS_JUGADOR_UNO,i.TELEFONO_JUGADOR_UNO,i.NICKNAME_USUARIO_DOS,i.NOMBRE_USUARIO_DOS,i.APELLIDOS_USUARIO_DOS,i.CATEGORIA, e.NOMBRE,e.PRECIO,e.FECHA,e.DIRECCION
        FROM Inscripciones i
        JOIN Eventos e ON i.ID_EVENTO = e.ID
        WHERE i.TELEFONO_JUGADOR_UNO = (SELECT TELEFONO FROM Usuarios WHERE ID = ?)
        AND i.NOMBRE_JUGADOR_UNO = (SELECT NOMBRE FROM Usuarios WHERE ID = ?)
        ORDER BY e.FECHA_NUMERICA;
        `,
        [req.user.ID,req.user.ID]))

    } 
    if(req.user && req.user.ID){
        [my_guest_inscriptions] = await pool.query(
        `SELECT i.ID,i.NOMBRE_JUGADOR_UNO,i.APELLIDOS_JUGADOR_UNO,i.TELEFONO_JUGADOR_UNO,i.NICKNAME_USUARIO_DOS,i.NOMBRE_USUARIO_DOS,i.APELLIDOS_USUARIO_DOS,i.CATEGORIA, e.NOMBRE,e.PRECIO,e.FECHA,e.DIRECCION
        FROM Inscripciones i
        JOIN Eventos e ON i.ID_EVENTO = e.ID
        where i.NICKNAME_USUARIO_DOS = ?
        ORDER BY e.FECHA_NUMERICA;
        `,
        [req.user.NOMBRE_DE_USUARIO])
    }
    console.log("my inscriptions => ",my_inscriptions)
    console.log("my guest inscriptions => ",my_guest_inscriptions)
    

    res.render("principal.ejs", {eventos,my_inscriptions,my_guest_inscriptions})
})

main_router.get("/admin",async(req,res)=>{

    const [result] = await pool.query(`
    SELECT 
    e.ID AS Evento_ID,
    e.NOMBRE AS Nombre_Evento,
    i.NOMBRE_JUGADOR_UNO AS Nombre_Jugador_Uno,
    i.CATEGORIA,
    i.APELLIDOS_JUGADOR_UNO AS Apellidos_Jugador_Uno,
    i.TELEFONO_JUGADOR_UNO AS Telefono_Jugador_Uno,
    i.NICKNAME_USUARIO_DOS AS Nickname_Usuario_Dos,
    i.NOMBRE_USUARIO_DOS AS Nombre_Usuario_Dos,
    i.APELLIDOS_USUARIO_DOS AS Apellidos_Usuario_Dos,
    i.TELEFONO_USUARIO_DOS AS Telefono_Usuario_Dos
    FROM 
        Eventos e
    JOIN 
        Inscripciones i ON e.ID = i.ID_EVENTO
    WHERE 
        e.ID = ?;
    `,[req.query.id_evento])

    console.log("admin",result)

    res.render("admin.ejs",{result})
})

main_router.get("/delete_inscription",async(req,res) =>{
    await pool.query("delete from Inscripciones where ID = ?",[req.query.id])

    res.redirect("/")
})

main_router.get('/get_img/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const query = await pool.query('SELECT PORTADA FROM Eventos WHERE ID = ?', [id]);
        if (!query || !query[0] || !query[0][0]) {
            res.status(404).send('Imagen no encontrada');
            console.log("Imagen no encontrada para el ID:", id);
            return;
        }
        const blobData = query[0][0].PORTADA;
        console.log(blobData)
        const buffer = Buffer.from(blobData);
        const base64Data = buffer.toString('base64');
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(base64Data, 'base64');
    } catch (error) {
        console.error('Error al procesar la imagen:', error);
        res.status(500).send('Error interno del servidor');
    }
});

main_router.post("/register", async (req, res,next)=> {
    console.log(req.body)

    let event_from_id = req.query.event_from_id

    console.log("event id => ",event_from_id)

    if (req.body.rango == "administrador" ) {
        if (req.body.clave_seguridad != process.env.ADMIN_PASS){
            console.log("rango admin pero clave incorrecta")
            return res.status(401).send("acceso denegado")
        }else{
            console.log("rango admin y clave correcta")
        }
    }
    let encriptador = await secreto.encriptador(req.body.contrasenya)
    const user = {
        NOMBRE: req.body.nombre,
        APELLIDOS: req.body.apellidos,
        RANGO: req.body.rango,
        EMAIL: req.body.correo_electronico,
        TELEFONO: req.body.telefono,
        NOMBRE_DE_USUARIO: req.body.nombre_de_usuario,
        CONTRASEÑA: encriptador,
        NIVEL_DE_PADEL: req.body.nivel_de_padel,
        POSICION_PISTA: req.body.posicion_en_pista
    }
    console.log(user)
    const result = await pool.query("INSERT INTO Usuarios SET ?", [user])
    await passport.authenticate("local.signin",{
        successRedirect: event_from_id ? "/inscribirse?id=" + event_from_id : "/",
        failureFlash:true}
      )
    (req,res,next)
})

main_router.post("/login", async(req, res, next) => {

    console.log("query strings => \n",req.query)
    let event_from_id = req.query.event_from_id

    console.log(req.body)
    const [comprobacion_email] = await pool.query("SELECT * FROM Usuarios WHERE EMAIL = ?",[req.body.correo_electronico])
    if(comprobacion_email[0]){
        console.log("¡¡ EL CORREO ELECTRÓNICO COINCIDE !!")
        const comprobacion_password = await secreto.desencriptador(req.body.contrasenya,comprobacion_email[0]["CONTRASEÑA"])
        if(comprobacion_password){
            console.log("¡¡ LA CONTRASEÑA COINCIDE !!")

            await passport.authenticate("local.signin",{
              successRedirect: event_from_id ? "/inscribirse?id=" + event_from_id : "/",
              failureFlash:true}
            )
            (req,res,next)
        }else{
            console.log("¡¡ LA CONTRASEÑA NO COINCIDE !!")
            res.render("login.ejs",{"error":"passwd","error_message":null,event_from_id,"from":undefined})
        }
    }else{
        console.log("¡¡ EL CORREO ELECTRÓNICO NO COINCIDE !!")
        res.render("login.ejs",{"error":"mail","error":"both","error_message":"El usuario introducido no existe",event_from_id,"from":undefined})
    }
})

main_router.get("/eventos", async(req, res) => {
    if (req.user && req.user.RANGO == "administrador"){
        console.log("estrategia de auth en ventos => ",req.user)
        res.render("agregar_eventos.ejs")
    }else{
        res.redirect("/")
    }
})

main_router.post("/eventos",upload.single("portada_evento"), async (req, res) => {
    console.log(req.body)
    console.log("valor cat 1 parseado =>",parseFloat( req.body.categoria_1 ))
    console.log("fecha => ",req.body.fecha)
    var fecha = new Date(req.body.fecha);
    var dia = fecha.getDate();
    var mes = fecha.getMonth();
    var año = fecha.getFullYear();
    var meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    var nombreMes = meses[mes];
    var nuevaFecha = dia + " de " + nombreMes + " de " + año;

    console.log("files",req.files,req.file)

    const rutaArchivo = req.file.path;
    console.log("ruta archivo => ",rutaArchivo)

    const evento = {
        NOMBRE: req.body.nombre,
        PRECIO: req.body.precio,
        FECHA: nuevaFecha + " --- " + req.body.hora_inicio + " --- " + req.body.hora_fin,
        FECHA_NUMERICA: req.body.fecha,
        CATEGORIA_MASCULINA_1_1: parseFloat (req.body.categoria_masculina_1_1),
        CATEGORIA_MASCULINA_1_2: parseFloat (req.body.categoria_masculina_1_2),
        CATEGORIA_MASCULINA_2_1: parseFloat (req.body.categoria_masculina_2_1),
        CATEGORIA_MASCULINA_2_2: parseFloat (req.body.categoria_masculina_2_2),
        CATEGORIA_MASCULINA_3_1: parseFloat (req.body.categoria_masculina_3_1),
        CATEGORIA_MASCULINA_3_2: parseFloat (req.body.categoria_masculina_3_2),
        CATEGORIA_MASCULINA_4_1: parseFloat (req.body.categoria_masculina_4_1),
        CATEGORIA_MASCULINA_4_2: parseFloat (req.body.categoria_masculina_4_2),
        CATEGORIA_MASCULINA_5_1: parseFloat (req.body.categoria_masculina_5_1),
        CATEGORIA_MASCULINA_5_2: parseFloat (req.body.categoria_masculina_5_2),
        CATEGORIA_MASCULINA_6_1: parseFloat (req.body.categoria_masculina_6_1),
        CATEGORIA_MASCULINA_6_2: parseFloat (req.body.categoria_masculina_6_2),
        CATEGORIA_MIXTA_1_1: parseFloat (req.body.categoria_mixta_1_1),
        CATEGORIA_MIXTA_1_2: parseFloat (req.body.categoria_mixta_1_2),
        CATEGORIA_MIXTA_2_1: parseFloat (req.body.categoria_mixta_2_1),
        CATEGORIA_MIXTA_2_2: parseFloat (req.body.categoria_mixta_2_2),
        CATEGORIA_MIXTA_3_1: parseFloat (req.body.categoria_mixta_3_1),
        CATEGORIA_MIXTA_3_2: parseFloat (req.body.categoria_mixta_3_2),
        CATEGORIA_MIXTA_4_1: parseFloat (req.body.categoria_mixta_4_1),
        CATEGORIA_MIXTA_4_2: parseFloat (req.body.categoria_mixta_4_2),
        CATEGORIA_MIXTA_5_1: parseFloat (req.body.categoria_mixta_5_1),
        CATEGORIA_MIXTA_5_2: parseFloat (req.body.categoria_mixta_5_2),
        CATEGORIA_MIXTA_6_1: parseFloat (req.body.categoria_mixta_6_1),
        CATEGORIA_MIXTA_6_2: parseFloat (req.body.categoria_mixta_6_2),
        CATEGORIA_FEMENINA_1_1: parseFloat (req.body.categoria_femenina_1_1),
        CATEGORIA_FEMENINA_1_2: parseFloat (req.body.categoria_femenina_1_2),
        CATEGORIA_FEMENINA_2_1: parseFloat (req.body.categoria_femenina_2_1),
        CATEGORIA_FEMENINA_2_2: parseFloat (req.body.categoria_femenina_2_2),
        CATEGORIA_FEMENINA_3_1: parseFloat (req.body.categoria_femenina_3_1),
        CATEGORIA_FEMENINA_3_2: parseFloat (req.body.categoria_femenina_3_2),
        CATEGORIA_FEMENINA_4_1: parseFloat (req.body.categoria_femenina_4_1),
        CATEGORIA_FEMENINA_4_2: parseFloat (req.body.categoria_femenina_4_2),
        CATEGORIA_FEMENINA_5_1: parseFloat (req.body.categoria_femenina_5_1),
        CATEGORIA_FEMENINA_5_2: parseFloat (req.body.categoria_femenina_5_2),
        CATEGORIA_FEMENINA_6_1: parseFloat (req.body.categoria_femenina_6_1),
        CATEGORIA_FEMENINA_6_2: parseFloat (req.body.categoria_femenina_6_2),
        DIRECCION: req.body.direccion,
        PORTADA: rutaArchivo,
    }
    console.log(evento)
    const result = await pool.query("INSERT INTO Eventos SET ?", [evento])
    res.redirect("/")
})

main_router.get("/logout", async(req, res) => {
    req.logOut( function(err){
        if(err){
          return next(err)
        }
      })
    res.redirect("/")
})

main_router.get("/inscribirse", async (req, res) => {
    if (req.isAuthenticated()) {

        console.log(req.query)

        let id_evento = req.query.id

        console.log("id del evento =",id_evento)

        let [categorias] = await pool.query(`
        SELECT
            CATEGORIA_MASCULINA_1_1,
            CATEGORIA_MASCULINA_1_2,
            CATEGORIA_MASCULINA_2_1,
            CATEGORIA_MASCULINA_2_2,
            CATEGORIA_MASCULINA_3_1,
            CATEGORIA_MASCULINA_3_2,
            CATEGORIA_MASCULINA_4_1,
            CATEGORIA_MASCULINA_4_2,
            CATEGORIA_MASCULINA_5_1,
            CATEGORIA_MASCULINA_5_2,
            CATEGORIA_MASCULINA_6_1,
            CATEGORIA_MASCULINA_6_2,
            CATEGORIA_MIXTA_1_1,
            CATEGORIA_MIXTA_1_2,
            CATEGORIA_MIXTA_2_1,
            CATEGORIA_MIXTA_2_2,
            CATEGORIA_MIXTA_3_1,
            CATEGORIA_MIXTA_3_2,
            CATEGORIA_MIXTA_4_1,
            CATEGORIA_MIXTA_4_2,
            CATEGORIA_MIXTA_5_1,
            CATEGORIA_MIXTA_5_2,
            CATEGORIA_MIXTA_6_1,
            CATEGORIA_MIXTA_6_2,
            CATEGORIA_FEMENINA_1_1,
            CATEGORIA_FEMENINA_1_2,
            CATEGORIA_FEMENINA_2_1,
            CATEGORIA_FEMENINA_2_2,
            CATEGORIA_FEMENINA_3_1,
            CATEGORIA_FEMENINA_3_2,
            CATEGORIA_FEMENINA_4_1,
            CATEGORIA_FEMENINA_4_2,
            CATEGORIA_FEMENINA_5_1,
            CATEGORIA_FEMENINA_5_2,
            CATEGORIA_FEMENINA_6_1,
            CATEGORIA_FEMENINA_6_2
        FROM Eventos
        WHERE ID = ${id_evento};
    `);

        let array_categorias_empty = []


        for (const clave in categorias[0]){
            console.log("clave = ",categorias[0][clave])
            if ( categorias[0][clave] != 0 && typeof categorias[0][clave] === "number"){

                console.log("categoria descubierta = > ",categorias[0][clave])

                if (clave.endsWith("_1")){

                    const nextKey = clave.replace(/_(\d+)$/, `_${2}`)
                    
                    let next_value = categorias[0][nextKey]

                    console.log("valor actual => ",clave+ ".." +categorias[0][clave])

                    console.log("valor next => ",nextKey + ".." +next_value)

                    let nombre_new_cat = clave.replace(/_/g, ' ')
                    nombre_new_cat = nombre_new_cat.replace(/\s\d+$/, '');

                    let new_cat = {
                        nombre:nombre_new_cat,
                        valor: `( ${categorias[0][clave]} -- ${next_value} )`
                    }
    
                    array_categorias_empty.push(new_cat)
                }


            }
        }

        console.log("categorias 0 ",categorias)

        console.log("length",categorias[0].length)

        console.log(array_categorias_empty)

        let [datos_jugador_1] = await pool.query("select NOMBRE,APELLIDOS,TELEFONO from Usuarios where id = ?",[req.user.ID])

        datos_jugador_1 = datos_jugador_1[0]

        res.render("inscribirse.ejs",{id_evento,array_categorias_empty,datos_jugador_1})
    }else[
        res.redirect("/login?from="+req.query.id)
    ]
})

main_router.post("/inscripcion", async (req, res) => {
    console.log(req.body)

    const inscripccion = {
        NOMBRE_JUGADOR_UNO: req.body.nombre_jugador_uno,
        APELLIDOS_JUGADOR_UNO: req.body.apellidos_jugador_uno,
        TELEFONO_JUGADOR_UNO: req.body.telefono_jugador_uno,
        NICKNAME_USUARIO_DOS: req.body.username_jugador_dos ? req.body.username_jugador_dos : "solitario",
        NOMBRE_USUARIO_DOS: req.body.nombre_user2 ? req.body.nombre_user2 : "",
        APELLIDOS_USUARIO_DOS : req.body.apellidos_user2 ? req.body.apellidos_user2 : "",
        TELEFONO_USUARIO_DOS : req.body.telefono_user2 ? req.body.telefono_user2 : "",
        CATEGORIA: req.body.categoria,
        ID_EVENTO: req.body.id_evento
    }
    await pool.query ("INSERT INTO Inscripciones SET ?", [inscripccion])
    res.redirect("/")
})


main_router.get("/check_nickname", async(req,res)=>{

    console.log(req.query)

    let nickname = req.query.nickname

    const [match] = await pool.query("SELECT NOMBRE_DE_USUARIO FROM Usuarios where NOMBRE_DE_USUARIO = ?",[nickname])

    console.log("check => ",match)

    res.json({
        "match": match.length > 0
    })

})


main_router.get("/check_username",async(req,res) =>{
    let username = req.query.username

    let [result] = await pool.query("select ID from Usuarios where NOMBRE_DE_USUARIO = ?")

})




module.exports = main_router