let current_state = true

function check_nickname () {

    let nickname = document.getElementById("nickname")

    console.log("check nickname => ",nickname.value)

    return fetch(`/check_nickname?nickname=${nickname.value}`,{
        method:"GET",
    }).then( (response) => response.json()).then((responseJSON) => {

        console.log("JSON response => ",responseJSON)

        return responseJSON.match

    })
}


document.addEventListener('DOMContentLoaded', function () {
    const soloButton = document.getElementById('solo');
    const parejaButton = document.getElementById('en_pareja');

    const jugador1 = document.querySelector('.info_jugador_1');
    const jugador2 = document.querySelector('.info_jugador_2');
    const categoria = document.querySelector('.info_equipo');
    const publicar = document.querySelector('.publicar');

    const nickname = document.getElementById("nickname")

    soloButton.addEventListener('click', function () {
        jugador1.style.display = 'flex';
        jugador2.style.display = 'none';
        console.log("solo")
        categoria.style.display = "flex"
        publicar.style.display = "flex"
        nickname.removeAttribute("required")

        current_state = true

    });

    parejaButton.addEventListener('click', function () {
        jugador1.style.display = 'flex';
        jugador2.style.display = 'flex';
        console.log("pareja")
        categoria.style.display = "flex"
        publicar.style.display = "flex"
        nickname.setAttribute("required","")

        current_state = false
    });

});

const popup = document.getElementById('popup')
const error_message = document.querySelector("#error_message")
const nickname = document.querySelector("#nickname")

document.getElementById('ins').addEventListener('submit', async function (event) {
    event.preventDefault(); 

    const check = await check_nickname()
    
    console.log("usuario 2 existe => ",check)
    
    popup.style.display = 'block'
    if(check && !current_state){
        setTimeout(function() {
            popup.style.display = 'none';
            event.target.submit()
        }, 3000)
    }else if (!check && !current_state){
        error_message.textContent = "¡NOMBRE DE USUARIO DE SU PAREJA NO EXISTE! SU PAREJA DEBE TENER UNA CUENTA"
        nickname.style.border = "2px solid red"
        error_message.style.fontSize = "10px"
        popup.style.display = "none"
    }else if (current_state) {
        setTimeout(function() {
            popup.style.display = 'none';
            event.target.submit()
        }, 3000)
    }
    

});