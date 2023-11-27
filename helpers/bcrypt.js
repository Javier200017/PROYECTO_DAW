const bcrypt = require("bcryptjs")

const secreto = {}

secreto.encriptador = async (password) => {

    const salt = await bcrypt.genSalt(5)
    const hash = await bcrypt.hash(password,salt)
    return hash

}

secreto.desencriptador = async (password,saved_password) => {

    return await bcrypt.compare(password,saved_password)

}

module.exports = {secreto}