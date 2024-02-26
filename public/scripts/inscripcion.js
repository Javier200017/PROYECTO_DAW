function check_nickname () {

    let nickname = document.getElementById("nickname")

    console.log("check nickname => ",nickname.value)

    fetch(`/check_nickname?nickname=${nickname.value}`,{
        method:"GET",
    }).then( (response)=> {
        console.log(response)
    } )

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

document.getElementById('ins').addEventListener('submit', function (event) {
    event.preventDefault(); 
    document.getElementById('popup').style.display = 'block';

    check_nickname()

    setTimeout(function() {
        document.getElementById('popup').style.display = 'none';
        event.target.submit()
    }, 3000);
});