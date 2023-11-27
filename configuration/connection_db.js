const mysql = require("mysql2/promise")

require("dotenv").config()

let mi_connection = {
    database_dev:{
        host:process.env.MYSQL_DEV_ADDON_HOST,
        database:process.env.MYSQL_DEV_ADDON_DB,
        user:process.env.MYSQL_DEV_ADDON_USER,
        password:process.env.MYSQL_DEV_ADDON_PASSWORD,
        port:process.env.MYSQL_DEV_ADDON_PORT
    },
    database_prod:{
        host:process.env.MYSQL_PROD_ADDON_HOST,
        database:process.env.MYSQL_PROD_ADDON_DB,
        user:process.env.MYSQL_PROD_ADDON_USER,
        password:process.env.MYSQL_PROD_ADDON_PASSWORD,
        port:process.env.MYSQL_PROD_ADDON_PORT
}}

let current_db
console.log(mi_connection["database_dev"])

console.log("base de datos a utilizar = ",process.env.NODE_ENV)

if (process.env.NODE_ENV=="develop"){
    current_db = mi_connection["database_dev"]
}else{
    current_db = mi_connection["database_prod"]
}

console.log(current_db)

const pool = mysql.createPool(current_db)

module.exports = {pool}