const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool= require('../database');
const helpers = require('../lib/helpers');


passport.use('local.signin',new LocalStrategy({
    usernameField:'username',//username es el nombre del input
    passwordField:'password',
    passReqToCallback: true
},async (req,username, password, done) =>{
    const filas = await pool.query('SELECT * FROM users WHERE username = ?',[username]);
    if (filas.length > 0) {
        const user = filas[0];//Guardamos al usuario
        const validar = await helpers.compararContraseña(password,user.password);//Validamos la contraseña
        if (validar) {//Si la contraseña fue correcta
            done(null, user, req.flash('success','Bienvenido '+ user.username));
        }else{
            done(null,false,req.flash('message','Contraseña incorrecta'));
        }
    }else{
        return done(null, false, req.flash('message','Nombre de usuario no existe'));
    }
}));

//OBJETO DE CONFIGURACION  autenticacion creada
passport.use('local.signup',new LocalStrategy({
    usernameField:'username',//username es el nombre del input
    passwordField:'password',
    passReqToCallback: true
}, async (req, username, password,done) =>{
    const {fullname} = req.body;
    const newUser ={//definimos el objeto con los datos
        username,
        password,
        fullname
    };
    newUser.password = await helpers.encryptPassword(password);//Ciframos la contraseña
    const resultado = await pool.query('INSERT INTO users SET ?',[newUser]);
    newUser.id = resultado.insertId; //obtenmos el ID
    //console.log(resultado);
    return done(null,newUser);//ocupamos el done para seguir y no se quede ahi y giardaos el newUser
}));

//serialisar al usuario
passport.serializeUser((user,done) =>{//Metodo para guaradar al usuario en la sesion
    done(null, user.id);
})


//deserializar al usuario
passport.deserializeUser( async (id, done) =>{
    const filas = await pool.query('SELECT * From users WHERE id = ?',[id]);
    done(null, filas[0]);
});
