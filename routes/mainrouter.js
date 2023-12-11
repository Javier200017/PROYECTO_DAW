const {Router} = require("express")
const main_router = Router()
const {pool} = require("../configuration/connection_db")
const {secreto} = require("../helpers/bcrypt")

main_router.get("/",(req, res) => {
    res.render("login.ejs",{"error":false,"error_message":null})
})

main_router.get("/principal", async (req, res) => {
    const [eventos] = await pool.query ("SELECT * FROM Eventos")

    console.log(eventos)
    res.render("principal.ejs", {eventos})
})

main_router.post("/register", async (req, res)=> {
    console.log(req.body)

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

    const result = pool.query("INSERT INTO Usuarios SET ?", [user])

    res.render("principal.ejs")
})

main_router.post("/login", async(req, res) => {
    console.log(req.body)
    const [comprobacion_email] = await pool.query("SELECT * FROM Usuarios WHERE EMAIL = ?",[req.body.correo_electronico])
    if(comprobacion_email[0]){
        console.log("¡¡ EL CORREO ELECTRÓNICO COINCIDE !!")
        const comprobacion_password = await secreto.desencriptador(req.body.contrasenya,comprobacion_email[0]["CONTRASEÑA"])
        if(comprobacion_password){
            console.log("¡¡ LA CONTRASEÑA COINCIDE !!")
            res.render("principal.ejs")
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
    res.render("agregar_eventos.ejs")
})

main_router.post("/eventos", async (req, res) => {
    console.log(req.body)

    let participantes_maximos = req.body.participantes_maximos ? req.body.participantes_maximos : null
    let premio = req.body.premio ? req.body.premio : null
    let instagram = req.body.instagram ? req.body.instagram : null
    let link_fotos = req.body.link_fotos ? req.body.link_fotos : null
    let reglamento = req.body.reglamento ? req.body.reglamento : null

    const evento = {
        NOMBRE: req.body.nombre,
        PRECIO: req.body.precio,
        TELEFONO_ORGANIZADOR: req.body.telefono_organizador,
        FECHA: req.body.fecha + " --- " + req.body.hora_inicio + "---" + req.body.hora_fin,
        PARTICIPANTES_MAXIMO: participantes_maximos,
        CATEGORIA_MIN: req.body.categoria_min,
        CATEGORIA_MAX: req.body.categoria_max,
        DIRECCION: req.body.direccion,
        INSTAGRAM: instagram,
        PREMIO: premio,
        PORTADA: req.body.portada,
        LINK_FOTOS: link_fotos,
        REGLAMENTO: reglamento
    }

    console.log(evento)

    const result = await pool.query("INSERT INTO Eventos SET ?", [evento])

    res.redirect("/principal")
})

module.exports = main_router