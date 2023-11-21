import express from "express";

import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.set("puerto", 4000);
app.listen(app.get("puerto"));
console.log("ESCUCHANDO EN EL PUERTO", app.get("puerto"));

app.use(express.static(__dirname + "/public"));

app.set("views",path.join(__dirname, "views"))

app.set('view engine', 'ejs');

app.get("/", (req, res) => res.render("login.ejs"));
