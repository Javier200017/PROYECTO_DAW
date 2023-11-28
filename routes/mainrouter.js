const {Router} = require("express")
const main_router = Router()
const {pool} = require("../configuration/connection_db")
const {secreto} = require("../helpers/bcrypt")

main_router.get("/",(req, res) => {
    res.render("login.ejs")
})

main_router.post("/register", async (req, res)=> {
    console.log(req.body)

    let encriptador = await secreto.encriptador(req.body.contrasenya)

    const user = {
        NOMBRE: req.body.nombre,
        APELLIDOS: req.body.apellidos,
        EMAIL: req.body.correo_electronico,
        TELEFONO: req.body.telefono,
        NOMBRE_DE_USUARIO: req.body.nombre_de_usuario,
        CONTRASEÑA: encriptador,
        NIVEL_DE_PADEL: req.body.nivel_de_padel,
        POSICION_PISTA: req.body.posicion_en_pista
    }
    console.log(user)

    const result = pool.query("INSERT INTO Usuarios SET ?", [user])

    res.render("login.ejs")
})

main_router.post("/login", async(req, res) => {
    console.log(req.body)
    const [comprobacion_email] = await pool.query("SELECT * FROM Usuarios WHERE EMAIL = ?",[req.body.correo_electronico])
    if(comprobacion_email[0]){
        console.log("¡¡ EL CORREO ELECTRÓNICO COINCIDE !!")
        const comprobacion_password = await secreto.desencriptador(req.body.contrasenya,comprobacion_email[0]["CONTRASEÑA"])
        if(comprobacion_password){
            console.log("¡¡ LA CONTRASEÑA COINCIDE !!")
            res.render("principal.ejs",{contrasenya:"contrasenya"})
        }else{
            console.log("¡¡ LA CONTRASEÑA NO COINCIDE !!")
            res.render("login.ejs")
        }
    }else{
        console.log("¡¡ EL CORREO ELECTRÓNICO NO COINCIDE !!")
        res.render("login.ejs")
    }
})

module.exports = main_router