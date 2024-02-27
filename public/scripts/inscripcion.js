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
    });

    parejaButton.addEventListener('click', function () {
        jugador1.style.display = 'flex';
        jugador2.style.display = 'flex';
        console.log("pareja")
        categoria.style.display = "flex"
        publicar.style.display = "flex"
        nickname.setAttribute("required","")
    });

});

const popup = document.getElementById('popup')
const error_message = document.querySelector("#error_message")
const nickname = document.querySelector("#nickname")

document.getElementById('ins').addEventListener('submit', async function (event) {
    event.preventDefault(); 
    
    const check = await check_nickname()
    
    console.log("usuario 2 existe => ",check)
    
    if(check){
        popup.style.display = 'block'
        setTimeout(function() {
            popup.style.display = 'none';
            event.target.submit()
        }, 3000)
    }else{
        error_message.textContent = "Not a valid Username"
        nickname.style.border = "2px solid red"
    }

});