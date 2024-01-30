const {Router} = require("express")
const main_router = Router()
const {pool} = require("../configuration/connection_db")
const {secreto} = require("../helpers/bcrypt")
const passport = require("passport")

main_router.get("/login",(req, res) => {
    console.log(req.query.from)
    if (req.query.from == "inscription"){
        null
    }else[
        null
    ]
    res.render("login.ejs",{"error":false,"error_message":null})
})

main_router.get("/", async (req, res) => {
    const [eventos] = await pool.query ("SELECT * FROM Eventos order by FECHA_NUMERICA ASC")
    res.render("principal.ejs", {eventos})
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
        successRedirect:"/",
        failureFlash:true}
      )
    (req,res,next)
})

main_router.post("/login", async(req, res, next) => {
    console.log(req.body)
    const [comprobacion_email] = await pool.query("SELECT * FROM Usuarios WHERE EMAIL = ?",[req.body.correo_electronico])
    if(comprobacion_email[0]){
        console.log("¡¡ EL CORREO ELECTRÓNICO COINCIDE !!")
        const comprobacion_password = await secreto.desencriptador(req.body.contrasenya,comprobacion_email[0]["CONTRASEÑA"])
        if(comprobacion_password){
            console.log("¡¡ LA CONTRASEÑA COINCIDE !!")
            await passport.authenticate("local.signin",{
              successRedirect:"/",
              failureFlash:true}
            )
            (req,res,next)
        }else{
            console.log("¡¡ LA CONTRASEÑA NO COINCIDE !!")
            res.render("login.ejs",{"error":"passwd","error_message":null})
        }
    }else{
        console.log("¡¡ EL CORREO ELECTRÓNICO NO COINCIDE !!")
        res.render("login.ejs",{"error":"mail","error":"both","error_message":"El usuario introducido no existe"})
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

main_router.post("/eventos", async (req, res) => {
    console.log(req.body)
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
    const base64Image = req.body.portada;
    const binaryImage = Buffer.from(base64Image, 'base64');
    const evento = {
        NOMBRE: req.body.nombre,
        PRECIO: req.body.precio,
        TELEFONO_ORGANIZADOR: req.body.telefono_organizador,
        FECHA: nuevaFecha + " --- " + req.body.hora_inicio + "---" + req.body.hora_fin,
        FECHA_NUMERICA: req.body.fecha,
        CATEGORIA_1: parseFloat( req.body.categoria_1),
        CATEGORIA_2: parseFloat( req.body.categoria_2),
        CATEGORIA_3: parseFloat( req.body.categoria_3),
        CATEGORIA_4: parseFloat( req.body.categoria_4),
        CATEGORIA_5: parseFloat( req.body.categoria_5),
        CATEGORIA_6: parseFloat( req.body.categoria_6),
        CATEGORIA_7: parseFloat( req.body.categoria_7),
        CATEGORIA_FEMENINA: parseFloat( req.body.categoria_femenina),
        DIRECCION: req.body.direccion,
        PORTADA: binaryImage,
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

main_router.get("/inscribirse", (req, res) => {
    if (req.isAuthenticated()) {
        console.log(req.query)
        let id_evento = req.query.id
        console.log("id del evento =",id_evento)
        res.render("inscribirse.ejs",{id_evento})
    }else[
        res.redirect("/login")
    ]
})

main_router.post("/inscripcion", async (req, res) => {
    console.log(req.body)
    const inscripccion = {
        NOMBRE_JUGADOR_UNO: req.body.nombre_jugador_uno,
        APELLIDOS_JUGADOR_UNO: req.body.apellidos_jugador_uno,
        TELEFONO_JUGADOR_UNO: req.body.telefono_jugador_uno,
        NOMBRE_JUGADOR_DOS: req.body.nombre_jugador_dos ? req.body.nombre_jugador_dos : "solitario",
        APELLIDOS_JUGADOR_DOS: req.body.apellidos_jugador_dos ? req.body.apellidos_jugador_dos : "solitario",
        TELEFONO_JUGADOR_DOS: req.body.telefono_jugador_dos ? req.body.telefono_jugador_dos : 0,
        CATEGORIA: req.body.categoria,
        ID_EVENTO: req.body.id_evento
    }
    await pool.query ("INSERT INTO Inscripciones SET ?", [inscripccion])
    res.redirect("/")
})
module.exports = main_router