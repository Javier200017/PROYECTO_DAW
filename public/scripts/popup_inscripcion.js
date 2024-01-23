document.getElementById('ins').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el envío normal del formulario

    // Muestra el popup
    document.getElementById('popup').style.display = 'block';

    // Espera 5 segundos y luego oculta el popup y envía el formulario
    setTimeout(function() {
        document.getElementById('popup').style.display = 'none';
        document.getElementById('ins').submit();
    }, 3000);
});