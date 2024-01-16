const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

const admin_input = document.getElementById("rango")

admin_input.addEventListener("click",() =>{

    // Obtén el elemento select y el input de contraseña
    var selectRango = document.getElementById('rango');
    var inputClaveSeguridad = document.querySelector('input[name="clave_seguridad"]');

    // Agrega un event listener al cambio en el select
    selectRango.addEventListener('change', function() {
        // Verifica si el valor seleccionado es "administrador"
        if (selectRango.value === 'administrador') {
            // Si es "administrador", muestra el campo de contraseña
            inputClaveSeguridad.style.visibility = 'visible';
            inputClaveSeguridad.setAttribute('required', 'required');
        } else {
            // Si no es "administrador", oculta el campo de contraseña
            inputClaveSeguridad.style.visibility = 'hidden';
            inputClaveSeguridad.removeAttribute('required');
        }
    });

})