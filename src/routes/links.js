const express = require('express');
const router = express.Router();
//importar conexion
const pool = require('../database')
const {isLoggedIn} = require('../lib/auth'); //importamos el metodo creado para proteguer las vistas

//cuando el navegado le haga una peticion al server
router.get('/add',isLoggedIn,(req, res) =>{
    res.render('links/add');
});

router.post('/add',isLoggedIn,async (req,res) =>{// async es para poder ocupar await ya que toma tiempo el insert
    const {title,url,description}=req.body;
    const newlink = {
        title,
        url,
        description,
        user_id: req.user.id //toma el id de la sesion del usuario
    };
    await pool.query('INSERT INTO links set ?',[newlink]);//INSERSION EN LA BASE DE DATOS
    req.flash('success','Guardado exitosamente'); //Guardamos el mensaje
    res.redirect('/links');
});

router.get('/',isLoggedIn ,async (req,res) =>{
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?',[req.user.id])//guardar en una variable el query
    console.log(links)
    res.render('links/listas',{ links });//{links} es para poder mandarlo
});

router.get('/delete/:id',isLoggedIn ,async(req,res) =>{
    const {id} = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?',[id]);
    req.flash('success','Borrado exitosamente'); //Guardamos el mensaje
    res.redirect('/links');
});

router.get('/edit/:id',isLoggedIn ,async(req,res) =>{
    const {id} = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?',[id]);
    res.render('links/edit',{link:links[0]});
});

router.post('/edit/:id',isLoggedIn ,async (req,res)=>{
    const {id} = req.params; //Recibiendo el valor
    const{title, description, url} = req.body; //asegurando que recibo esos valores
    const newLink ={ //lo guardamos en un nuevo objeto, guardamos los datos
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?',[newLink,id]);
    req.flash('success','Editando exitosamente'); //Guardamos el mensaje
    res.redirect('/links')
});

module.exports = router;