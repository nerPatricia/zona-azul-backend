const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Carro = require('../models/Carro');

const jwtConfig = require('../config/jwtConfig');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    //check if jwt exists & is verified
    if (!token) {
        res.redirect('/login');
        return;
    }

    jwt.verify(token, jwtConfig.key, (err, decodedToken) => {
        if (err) {
            console.log(err.message);
            res.redirect('/login');
            return;
        }
        next();
    });

};

const checkUser = async (req, res, next) => {
    //funcao pra pegar os dados do usuario atual
    //e repassar pro front
    //ai da pra mostrar as infos dele na tela ou qlqer coisa q queira elas

    const token = req.cookies.jwt;
    let dToken;
    if (!token) {
        res.user = null;
        res.locals.user = null;
        return next();
    }
    jwt.verify(token, jwtConfig.key, (err, decodedToken) => {
        if (err) {
            console.log(err.message);
            res.user = null;
            res.locals.user = null;
            return next();
        }
        dToken = decodedToken;
    });

    // let cars = await Cars.find({
    //     user_id: user._id
    // });
    // //n tem praq dexar a senha exposta tmb ne
    // user.password = "";

    // //NAO TO CONSEGUINDO ALTERAR A ESTRUTURA DO RESULTADO DA QUERY, n queria ter q mandar 2 json, pensei em mandar 1 direto com tudo e foda-se hummmmm
    // user = JSON.stringify(user);
    // cars = JSON.stringify(cars);
    // let retorno = {
    //     ...user,
    //     ...cars
    // };
    // //user.cars = [cars];
    // console.log(retorno);

    //acho q da pra escolhar quais campos pegar mas preguica
    let dbUser = await User.findById(dToken.id);
    user = {
        saldo: dbUser.saldo,
        nome: dbUser.nome
    };

    //só pros teste com express
    res.locals.user = user;
    next();
};

module.exports = {
    requireAuth,
    checkUser
};