document.addEventListener('DOMContentLoaded', function() {
    var telefonoInput = document.querySelector('input[name="telefono"]');
    
    telefonoInput.addEventListener('input', function() {
      // Quitar espacios en blanco y otros caracteres no deseados
      var telefono = telefonoInput.value.replace(/\D/g, '');

      // Verificar si la longitud del número es 9
      if (telefono.length === 9) {
        telefonoInput.setCustomValidity('');
      } else {
        telefonoInput.setCustomValidity('El teléfono debe tener 9 números');
      }
    });
  });
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



