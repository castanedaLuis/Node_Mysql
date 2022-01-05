const mysql = require('mysql');
const {promisify} = require('util'); //metodo de NODE para soportar promesas
const {database} = require('./keys');

//metodo de mysql
const pool = mysql.createPool(database);//genera una conexion

pool.getConnection((err,connection) =>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('Base de datos fue cerrada');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('Base de datos tiene muchas conexiones');
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('Base de datos fue rechazada');
        }
    }

    if(connection)connection.release();
    console.log('-------Base conectada-----')
});

pool.query = promisify(pool.query); //Para poder usar promesas en cada consulta
//lo exportamos
module.exports = pool;