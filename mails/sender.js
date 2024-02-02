const nodemailer = require('nodemailer');

require("dotenv").config()

console.log(process.env.PASSWD_NODEMAILER)

const html_bienvenido = `

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css?family=Dosis:400,500|Poppins:400,600,700&display=swap" rel="stylesheet">
    <title>CORREO DE BIENVENIDA</title>
</head>
<body class="body">
    <div class="es-wrapper-color" >
        <table>
            <tr>
                <td>
                    <table class="es-header">
                        <tr>
                            <td>
                                <table>
                                    <tr>
                                        <td align="left" style="padding-top: 10px; padding-right: 20px; padding-bottom: 10px; padding-left: 20px">
                                            <table>
                                                <tr>
                                                    <td class="es-m-p0r">
                                                        <table>
                                                            <tr>
                                                                <td style="padding-bottom:20px;">
                                                                    <img src="https://eferfdm.stripocdn.email/content/guids/CABINET_31f38e7a9bca69ef715d85ee4cfb51912b231844b6feb462cae37827b656a121/images/captura_de_pantalla_20240201_a_las_102920removebgpreview.png" class="adapt-img">
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table class="es-content" >
                        <tr>
                            <td>
                                <table class="es-content-body" >
                                    <tr>
                                        <td style="padding-right: 20px; padding-left: 20px; padding-bottom: 30px">
                                            <table>
                                                <tr>
                                                    <td>
                                                        <table>
                                                            <tr>
                                                                <td align="center">
                                                                    <img src="https://eferfdm.stripocdn.email/content/guids/CABINET_9ca3362f6e3ce2c3ea60da8fe4f8a850/images/78491618321704551.png" width="150">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" class="es-m-p0r es-m-p0l" style="padding-top: 10px; padding-bottom: 10px; ">
                                                                    <p style="margin: 0; font-family: Dosis, 'sans-serif;"><br>¡BIENVENIDO! ¡GRACIAS POR UNIRSE A LA MEJOR WEB DE INSCRIPCIONES DEL MUNDO! ¿ESTÁ PREPARADO PARA EMPEZAR A JUGAR Y PASARLO BIEN?</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" style="padding-top: 15px;">
                                                                    <span class="es-button-border">
                                                                        <a href="" class="es-button" target="_blank" style="text-decoration: none !important; padding: 10px 30px 10px 30px;display: inline-block; color: black; background: #9be604; border-radius: 5px; font-family: Dosis,'sans-serif;">EMPEZAR A JUGAR TORNEOS ...</a>
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table class="es-footer">
                        <tr>
                            <td>
                                <table class="es-footer-body" >
                                    <tr>
                                        <td>
                                            <table>
                                                <tr>
                                                    <td>
                                                        <table>
                                                            <tr>
                                                                <td align="center" style="padding-top:15px; padding-bottom:15px;">
                                                                    <table class="es-table-not-adapt es-social">
                                                                        <tr>
                                                                            <td align="center" style="padding-right: 40px;">
                                                                                <img title="Facebook" src="https://eferfdm.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png" width="50">
                                                                            </td>
                                                                            <td align="center" style="padding-right:40px;">
                                                                                <img title="X.com" src="https://eferfdm.stripocdn.email/content/assets/img/social-icons/logo-black/x-logo-black.png" width="50">
                                                                            </td>
                                                                            <td align="center" style="padding-right:40px;">
                                                                                <img title="Instagram" src="https://eferfdm.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png" width="50">
                                                                            </td>
                                                                            <td align="center">
                                                                                <img title="Youtube" src="https://eferfdm.stripocdn.email/content/assets/img/social-icons/logo-black/youtube-logo-black.png" width="50">
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center">
                                                                    <p style="margin: 0; font-family: Dosis,'sans-serif;">© 2024 GLOBAL SMASH PÁDEL - TODOS LOS DERECHOS RESERVADOS</p>
                                                                    <p style="margin: 0; font-family: Dosis, 'sans-serif;">AVENIDA ARAGÓN 25, VALENCIA, 46010, ESPAÑA</p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>

<style>
    .body {
        width: 100%;
        height: 100%;
        padding: 0; 
        margin: 0;
    }
    
    @media only screen and (max-width:768px) {
        p, a { 
            line-height: 150%!important;
        } 

        .es-content-body p, .es-content-body a { 
            font-size: 20px!important; 
        } 
        
        .es-footer-body p, .es-footer-body a { 
            font-size: 13px!important; 
        } 
        
        .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { 
            width: 100%!important; 
            max-width: 600px!important; 
        } 
        
        .adapt-img { 
            width: 100%!important; 
            height: auto!important; 
        } 

        table.es-table-not-adapt, .esd-block-html table { 
            width: auto!important; 
        } 
    }
  </style>
`

const html_inscripcion = `

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css?family=Dosis:400,500|Poppins:400,600,700&display=swap" rel="stylesheet">
    <title>CORREO DE BIENVENIDA</title>
</head>
<body class="body">
    <div class="es-wrapper-color" >
        <table>
            <tr>
                <td>
                    <table class="es-header">
                        <tr>
                            <td>
                                <table>
                                    <tr>
                                        <td align="left" style="padding-top: 10px; padding-right: 20px; padding-bottom: 10px; padding-left: 20px">
                                            <table>
                                                <tr>
                                                    <td class="es-m-p0r">
                                                        <table>
                                                            <tr>
                                                                <td style="padding-bottom:20px;">
                                                                    <img src="https://eferfdm.stripocdn.email/content/guids/CABINET_31f38e7a9bca69ef715d85ee4cfb51912b231844b6feb462cae37827b656a121/images/captura_de_pantalla_20240201_a_las_102920removebgpreview.png" class="adapt-img">
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table class="es-content" >
                        <tr>
                            <td>
                                <table class="es-content-body" >
                                    <tr>
                                        <td style="padding-right: 20px; padding-left: 20px; padding-bottom: 30px">
                                            <table>
                                                <tr>
                                                    <td>
                                                        <table>
                                                            <tr>
                                                                <td align="center">
                                                                    <img src="https://eferfdm.stripocdn.email/content/guids/CABINET_9ca3362f6e3ce2c3ea60da8fe4f8a850/images/78491618321704551.png" width="150">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" class="es-m-p0r es-m-p0l" style="padding-top: 10px; padding-bottom: 10px; ">
                                                                    <p style="margin: 0; font-family: Dosis, 'sans-serif;"><br>¡ENHORABUENA, SE ACABA DE INSCRIBIR AL TORNEO ... !</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" style="padding-top: 15px;">
                                                                    <span class="es-button-border">
                                                                        <a href="" class="es-button" target="_blank" style="text-decoration: none !important; padding: 10px 30px 10px 30px; display: inline-block; color: black; background: #9be604; border-radius: 5px; font-family: Dosis,'sans-serif; ">VER INSCRIPCIÓN</a>
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table class="es-footer">
                        <tr>
                            <td>
                                <table class="es-footer-body" >
                                    <tr>
                                        <td>
                                            <table>
                                                <tr>
                                                    <td>
                                                        <table>
                                                            <tr>
                                                                <td align="center" style="padding-top:15px; padding-bottom:15px;">
                                                                    <table class="es-table-not-adapt es-social">
                                                                        <tr>
                                                                            <td align="center" style="padding-right: 40px;">
                                                                                <img title="Facebook" src="https://eferfdm.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png" width="50">
                                                                            </td>
                                                                            <td align="center" style="padding-right:40px;">
                                                                                <img title="X.com" src="https://eferfdm.stripocdn.email/content/assets/img/social-icons/logo-black/x-logo-black.png" width="50">
                                                                            </td>
                                                                            <td align="center" style="padding-right:40px;">
                                                                                <img title="Instagram" src="https://eferfdm.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png" width="50">
                                                                            </td>
                                                                            <td align="center">
                                                                                <img title="Youtube" src="https://eferfdm.stripocdn.email/content/assets/img/social-icons/logo-black/youtube-logo-black.png" width="50">
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center">
                                                                    <p style="margin: 0; font-family: Dosis,'sans-serif;">© 2024 GLOBAL SMASH PÁDEL - TODOS LOS DERECHOS RESERVADOS</p>
                                                                    <p style="margin: 0; font-family: Dosis, 'sans-serif;">AVENIDA ARAGÓN 25, VALENCIA, 46010, ESPAÑA</p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>

<style>
    .body {
        width: 100%;
        height: 100%;
        padding: 0; 
        margin: 0;
    }
    
    @media only screen and (max-width:768px) {
        p, a { 
            line-height: 150%!important;
        } 

        .es-content-body p, .es-content-body a { 
            font-size: 20px!important; 
        } 
        
        .es-footer-body p, .es-footer-body a { 
            font-size: 13px!important; 
        } 
        
        .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { 
            width: 100%!important; 
            max-width: 600px!important; 
        } 
        
        .adapt-img { 
            width: 100%!important; 
            height: auto!important; 
        } 

        table.es-table-not-adapt, .esd-block-html table { 
            width: auto!important; 
        } 
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
    to: 'henryvaldivia.ro@gmail.com',
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