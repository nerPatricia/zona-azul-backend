const User = require('../models/User');
const Carro = require('../models/Carro');
const Vaga = require('../models/Vaga');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

const maxAge = 30 * 60 * 1000; //in seconds

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {
        email: '',
        password: ''
    };

    //email duplication error
    if (err.code === 11000) {
        errors.email = 'email already in use';
        return errors;
    }

    //validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({
            properties
        }) => {
            errors[properties.path] = properties.message;
        });
    }

    //incorrect email
    if (err.message === ('incorrect email')) {
        errors.email = 'email not registered';
    }

    if (err.message === ('incorrect password')) {
        errors.password = 'wrong password';
    }

    return errors;
};

const createToken = (id) => {
    return jwt.sign({
        id
    }, jwtConfig.key, {
        expiresIn: maxAge,
    })
};

module.exports.userSignup_get = (req, res) => {
    res.render('signup');
}

module.exports.userSignup_post = async (req, res) => {
    console.log(req.body);
    //const {nome, sobrenome ,cpf, email, celular, password} = req.body;
    try {
        const user = await User.create(req.body);
        const token = createToken(user._id);

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        });

        res.status(201).json({
            user: user._id
        });

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({
            errors
        });
    }
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.login_post = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        const user = await User.login(email, password)
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        });
        res.status(200).json({
            user: user._id
        });

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({
            errors
        });
    }
}

module.exports.logout_get = async (req, res) => {
    res.cookie('jwt', '', {
        maxAge: 1
    });
    res.redirect('/');
}

module.exports.carRegister_post = (req, res) => {
    const {
        placa,
        tipo,
        marca,
        modelo
    } = req.body;

    const token = req.cookies.jwt;
    let novoCarro = {
        placa,
        tipo,
        marca,
        modelo
    };

    if (!token) {
        console.log("erro token");
        return;
    }

    let decodedUser = jwt.verify(token, jwtConfig.key, async (err, decodedToken) => {
        if (err) {
            console.log(err.message);
            return;
        }

        let user = await User.findById(decodedToken.id);
        novoCarro.user_id = user._id;
        Carro.create(novoCarro);
        res.sendStatus(200);
    });


};

module.exports.addCredit_post = (req, res) => {
    const token = req.cookies.jwt;
    const creditos = req.body.creditos;

    if (!token) {
        console.log("1");
        return;
    }

    let decodedUser = jwt.verify(token, jwtConfig.key, async (err, decodedToken) => {
        if (err) {
            console.log(err.message);

            return;
        }

        let user = await User.findById(decodedToken.id);
        user.saldo += Number(creditos);

        User.updateOne({
            _id: user._id
        }, {
            saldo: user.saldo
        }, (err, res2) => {
            if (err) return console.log(err);
            console.log("Saldo atualizado");
            res.sendStatus(200);
        });
    });
};

module.exports.temp = (req, res) => {
    res.render('temp');
}