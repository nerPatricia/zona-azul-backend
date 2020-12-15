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
            console.log("ERRO CHECKUSER =========");
            console.log(err.message);
            res.user = null;
            res.locals.user = null;
            return next();
        }
        dToken = decodedToken;
    });

    //acho q da pra escolhar quais campos pegar mas preguica
    let dbUser = await User.findById(dToken.id);
    user = {
        saldo: dbUser.saldo,
        nome: dbUser.nome
    };

    //só pros teste com express
    res.locals.user = user;
    res.user = user;
    next();
};

module.exports = {
    requireAuth,
    checkUser
};