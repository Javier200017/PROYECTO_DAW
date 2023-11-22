const express = require("express")

const path = require("path")

const app = express();

app.set("puerto", 4000);


app.use(express.static(__dirname + "/public"));

app.set("views",path.join(__dirname, "views"))

//middlewares que facilitaran el tratado de datos
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.set('view engine', 'ejs');
app.use(require("./routes/mainrouter.js"))

app.listen(app.get("puerto"));

console.log("ESCUCHANDO EN EL PUERTO", app.get("puerto"));
