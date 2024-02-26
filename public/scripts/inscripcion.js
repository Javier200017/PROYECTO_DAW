document.addEventListener('DOMContentLoaded', function () {
    const soloButton = document.getElementById('solo');
    const parejaButton = document.getElementById('en_pareja');

    const jugador1 = document.querySelector('.info_jugador_1');
    const jugador2 = document.querySelector('.info_jugador_2');
    const categoria = document.querySelector('.info_equipo');
    const publicar = document.querySelector('.publicar');

    soloButton.addEventListener('click', function () {
        jugador1.style.display = 'flex';
        jugador2.style.display = 'none';
        console.log("solo")
        categoria.style.display = "flex"
        publicar.style.display = "flex"
    });

    parejaButton.addEventListener('click', function () {
        jugador1.style.display = 'flex';
        jugador2.style.display = 'flex';
        console.log("pareja")
        categoria.style.display = "flex"
        publicar.style.display = "flex"
    });

});

document.getElementById('ins').addEventListener('submit', function (event) {
    event.preventDefault(); 
    document.getElementById('popup').style.display = 'block';

    setTimeout(function() {
        document.getElementById('popup').style.display = 'none';
        document.getElementById('ins').submit();
    }, 3000);
});


