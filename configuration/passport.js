const passport = require("passport")
const localstrategy = require("passport-local").Strategy
const {pool} = require("../configuration/connection_db.js")
const {secreto} = require("../helpers/bcrypt.js")

passport.use("local.signin", new localstrategy({
    usernameField:"correo_electronico",
    passwordField:"contrasenya",
    passReqToCallback:true
}, async (req,username,password,done) =>{

    console.log(username,password)

    const [result] = await pool.query("select * from Usuarios where EMAIL = ?",[username])

    console.log(result)
    
    return done(null,result[0])

}))

passport.serializeUser((user,done)=>{
    console.log("serial")
    console.log(user)
    done(null,user.ID)
})

passport.deserializeUser(async(id,done) =>{

    console.log("deserializing")

    const [user] = await pool.query("select * from Usuarios where ID = ?",[id])
    console.log(user[0])
    console.log(user)
    done(null,user[0])

} )