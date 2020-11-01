const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Cars = require('../models/Carro');

const jwtConfig = require('../config/jwtConfig');

const requireAuth = (req,res,next) =>{
    
    const token = req.cookies.jwt;


    //check if jwt exists & is verified
    if(!token){
        res.redirect('/login');
        return;
    }
    
    jwt.verify(token,jwtConfig.key , (err,decodedToken) => {
        if(err){
            console.log(err.message);
            res.redirect('/login');
            return;
        }
        
        
        next();
    });
    
};

const checkUser = (req,res,next) => {
    //funcao pra pegar os dados do usuario atual
    //e repassar pro front
    //ai da pra mostrar as infos dele na tela ou qlqer coisa q queira elas

    const token = req.cookies.jwt;
    if(!token){
        res.user = null;
        return;
    }
    
    jwt.verify(token,jwtConfig.key , async (err,decodedToken) => {
        if(err){
            console.log(err.message);
            res.user = null;
            return next();
        }
        
        //
        //acho q da pra escolhar quais campos pegar mas preguica
        let user = await User.findById( decodedToken.id);
        let cars = await Cars.find({user_id : user._id});
        //n tem praq dexar a senha exposta tmb ne
        user.password = "";


        //NAO TO CONSEGUINDO ALTERAR A ESTRUTURA DO RESULTADO DA QUERY, n queria ter q mandar 2 json, pensei em mandar 1 direto com tudo e foda-se hummmmm
        user = JSON.stringify(user);
        cars = JSON.stringify(cars);
        //user.cars = [cars];
        user.palavra = 'a';
        console.log(user);
        
        //só pros teste com express
        res.locals.user = user;
        

        res.user = user;
        next(); //se tiver situações onde tem q fazer mais coisa ainda, talvez esse next de problema, n tenho ctz
    });

};

const isEmployee = async (req,res,next) => {
    //pras paginas q precisa ser funcionario (vamo implementar isso msm?)
    //console.log(res.user);
    
    /*let user = await User.findById(res.users._id);
    if(user.isEmployee)
        next();
    else
        return res.render('/');
        */
   next();
};


module.exports = { requireAuth, checkUser , isEmployee};