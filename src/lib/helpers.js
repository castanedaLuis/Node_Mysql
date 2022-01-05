const bcrypt = require('bcryptjs');
const helpers = {};

//Metodo para registrar
helpers.encryptPassword = async (password) =>{
    const salt = await bcrypt.genSalt(10);//entre mas grade el numero mas seguro el cifrado HASH
    const FinalPassword = await bcrypt.hash(password,salt);
    return FinalPassword;
};

//Metodo para el logeo
helpers.compararContraseña = async(password, savePassword) =>{
    try{
        return await bcrypt.compare(password, savePassword);
    }catch(e){
        console.log(e);
    }
};

module.exports = helpers;