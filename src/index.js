const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash'); //para tener animacion en vistas
const session = require('express-session');
const mysqlStore = require('express-mysql-session'); //para poder guardar los datos en DB con la sesion
const {database} =require('./keys'); //Importamos la base de datos
const passport = require('passport');

//inicializamos 
const app = express()
require('./lib/passport'); //para que la aplicacion se entere de la autenticacion creada

//setting
app.set('port',4000);
app.set('views',path.join(__dirname,'views'))
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'parches'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine','hbs'); //para poder utilizar hbs motor

//Meddleware
app.use(session({  //configurando la sesion
    secret:'Jose Luis Castañeda Osornio',
    resave: false,  //para que no se renueve la sesion
    saveUninitialized: false,   //para que no se vuleva a establecer la sesion
    store: new mysqlStore(database) //para indicar donde se va a guardar los datos, en este caso en la BD
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false})); //para aceptar solo datos sencillos , no imagnes
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());//inicializamos passport


//Global Variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');//para poder ocupar el mensaje en todas las vistas
    app.locals.success = req.flash('message');
    app.locals.user = req.user; //para poder ser accedida desde cualquier vista el user 
    next();
});

//routes
app.use(require('./routes'));
app.use(require('./routes/autenticacion'));
app.use('/links',require('./routes/links'));

//public
app.use(express.static(path.join(__dirname,'public')));


//starting server
app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});

