import express from "express";

import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.set("puerto", 4000);
app.listen(app.get("puerto"));
console.log("ESCUCHANDO EN EL PUERTO", app.get("puerto"));

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => res.sendFile(__dirname + "/pages/login.html"));
