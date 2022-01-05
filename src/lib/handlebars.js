const {format} = require('timeago.js');//importamos timeago su format 


const helpers ={};//creamos un objeto para utlizarlo en las vistas

helpers.timeago =(timestamp) =>{//recibe una fecha
    return format (timestamp);//Retornamos la fecha convertida  por el metodo creado
};
module.exports=helpers;

