
const {Router} = require("express")
const main_router = Router()
const {pool} = require("../configuration/connection_db")
const {secreto} = require("../helpers/bcrypt")

// GET request to render the login page
main_router.get("/",(req, res) => {
    res.render("login.ejs")
})

// POST request to register a new user
main_router.post("/register", async (req, res)=> {
    console.log(req.body)

    // Encrypt the password using bcrypt
    let encriptador = await secreto.encriptador(req.body.contrasenya)

    // Create a new user object with the provided data
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

    // Insert the new user into the database
    const result = pool.query("INSERT INTO Usuarios SET ?", [user])

    // Render the login page after successful registration
    res.render("login.ejs")
})

// POST request to authenticate a user
main_router.post("/login", async(req, res) => {

    console.log(req.body)

    const [comprobacion_email] = await pool.query("select * from Usuarios where EMAIL = ?",[req.body.correo_electronico])

    if(comprobacion_email[0]){
        console.log("email coincide")

        const comprobacion_password = await secreto.desencriptador(req.body.contrasenya,comprobacion_email[0]["CONTRASEÑA"])

        if(comprobacion_password){
            console.log("contraseña coincide")
            res.render("principal.ejs")
        }else{
            console.log("contarseña no coincide")
            res.render("login.ejs")
        }

    }else{
        console.log("email no coincide")
        res.render("login.ejs")
    }

})


module.exports = main_router