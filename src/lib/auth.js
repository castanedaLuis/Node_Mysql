module.exports = {
    isLoggedIn(req, res, next){
        if (req.isAuthenticated()) { //verificamos si el usuario existe
            return next();//si el usuario esta logeado que continue con ejecutando el codigo
        }
        return res.redirect('/signin');
    },

    isNotLogg(req,res, next){ //Verificamos si ya esta autenticado y lo direcionamos a profile
        if(!req.isAuthenticated()){
            return next();
        }
        return res.redirect('/profile');
    }
};