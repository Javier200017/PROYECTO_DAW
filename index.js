const express = require("express")

const path = require("path")

const app = express();

const passport = require("passport")

const express_session = require("express-session")

const cookieParser = require('cookie-parser');

const {pool} = require("./configuration/connection_db.js")

const sesion = require("express-mysql-session")(express_session)

require("./configuration/cron_delete_elements.js")

require("./configuration/passport.js")
//cookies
app.use(cookieParser());

app.set("puerto", 4000);
app.use(express_session({
    key:"contrasenya_sesion",
    secret: "contrasenya_secreta",
    store: new sesion({},pool),
    resave: false,
    saveUninitialized:false
}))

app.use(passport.initialize())

app.use(passport.session())

app.use( (req,res,next) =>{
    app.locals.user = req.user
    next()
})



app.use(express.static(__dirname + "/public"));

app.set("views",path.join(__dirname, "views"))


app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.set('view engine', 'ejs');

app.use(require("./routes/mainrouter.js"))


console.log("ESCUCHANDO EN EL PUERTO", app.get("puerto"));
console.log("Entorno de desarrollo => ",process.env.NODE_ENV)

app.listen(app.get("puerto"));