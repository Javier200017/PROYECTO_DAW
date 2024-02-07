const cron = require('node-cron');
const {pool} = require("../configuration/connection_db")

const limpiarEventosAntiguos = async () => {

  try {
    const fechaActual = new Date();

    const fechaActualMySQL = fechaActual.toISOString().slice(0, 19).replace('T', ' ');

    console.log(fechaActual," ,, ",fechaActualMySQL)

    const [result] = await pool.query("delete from Eventos where FECHA_NUMERICA < ?",[fechaActualMySQL])

    console.log(result)

    console.log('Se eliminaron los eventos antiguos.');
  } catch (error) {
    console.error('Error al eliminar eventos antiguos:', error);
  }
};

cron.schedule('* */24 * * *', () => {
  console.log('Iniciando la revisión y limpieza de eventos antiguos...');
  limpiarEventosAntiguos();
});
