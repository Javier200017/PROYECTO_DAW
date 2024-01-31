const nodemailer = require('nodemailer');

require("dotenv").config()

console.log(process.env.PASSWD_NODEMAILER)

const html_bienvenido = `

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>¡BIENVENID O A LA MEJOR WEB DE TORNEOS DEL MUNDO!</h1>
</body>
</html>

<style>
    body {
        background-color: antiquewhite;
    }
</style>

`

const html_inscripcion = `

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>¡SE HA INSCRITO AL TORNEO OPEN PÁDEL EVENTS!</h1>
</body>
</html>

<style>
    body {
        background-color: antiquewhite;
    }
</style>

`

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'globalsmashpadel@gmail.com',
    pass: process.env.PASSWD_NODEMAILER,
  },
});

const mailOptions = (asunto,html_content) => {

  return {
    from: 'globalsmashpadel@gmail.com', 
    to: 'javier17052000@icloud.com',
    subject: asunto,
    html:html_content
  }

};


const sendmail = (asunto,html) => {

  transporter.sendMail(mailOptions(asunto, html), (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error);
    } else {
      console.log('Correo enviado:', info.response);
    }
  });

}

sendmail(`¡ALTA EN GLOBAL.SMASH.PADEL!`,html_bienvenido)
sendmail(`¡INSCRIPCIÓN CON ÉXITO!`,html_inscripcion)