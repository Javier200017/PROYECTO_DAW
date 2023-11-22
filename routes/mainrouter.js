const {Router} = require("express")
const main_router = Router()

main_router.get("/",(req, res) => {
    res.render("login.ejs")
})

module.exports = main_router