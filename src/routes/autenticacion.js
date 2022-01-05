const express = require('express');
const router = express.Router();
const passport = require('passport'); //traemos el modulo
const {isLoggedIn, isNotLogg} = require('../lib/auth'); //importamos el metodo creado para proteguer las vistas



router.get('/signup',isNotLogg,(req,res) =>{//Ruta para 
    res.render('auth/signup');
});

router.post('/signup',passport.authenticate('local.signup',{//Ruta para recibir los datos
        successRedirect:'/profile',
        failureRedirect:'/signup',
        failureFlash:true
}));

router.get('/signin',isNotLogg,(req,res) =>{//Ruta para 
    res.render('auth/signin');
});

router.post('/signin',isNotLogg,(req,res, next) =>{//Proceso de autenticacion
    passport.authenticate('local.signin',{
        successRedirect:'/profile',
        failureRedirect:'/signin',
        failureFlash:true
    })(req, res, next);
});


router.get('/profile', (req,res)=>{ //Proteguemos nuesto profile con solo poner antes de la logica el metodo  isLoggedIn
    res.render('profile');
});

router.get('/logout',(req,res) => {
    req.logOut();//Cerrar sesion con un metodo de reques
    res.redirect('/signin');
})
module.exports = router;