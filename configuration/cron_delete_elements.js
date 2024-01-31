const cron = require('node-cron');
const {pool} = require("../configuration/connection_db")

// Función para realizar la revisión y eliminación de eventos antiguos
const limpiarEventosAntiguos = async () => {

  try {
    // Obtener la fecha y hora actuales
    const fechaActual = new Date();

    // Convertir la fecha actual a un formato compatible con MySQL (YYYY-MM-DD HH:mm:ss)
    const fechaActualMySQL = fechaActual.toISOString().slice(0, 19).replace('T', ' ');

    console.log(fechaActual," ,, ",fechaActualMySQL)

    const [result] = await pool.query("delete from Eventos where FECHA_NUMERICA < ?",[fechaActualMySQL])

    console.log(result)

    console.log('Se eliminaron los eventos antiguos.');
  } catch (error) {
    console.error('Error al eliminar eventos antiguos:', error);
  }
};

// Programar la tarea para ejecutarse cada 2 horas
cron.schedule('* */24 * * *', () => {
  console.log('Iniciando la revisión y limpieza de eventos antiguos...');
  limpiarEventosAntiguos();
});
