const User = require('../models/User');
const Carro = require('../models/Carro');
const Vaga = require('../models/Vaga');
const Estacionamento = require('../models/Estacionamento');

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

module.exports.userSignup_post = async (req, res) => {

    try {
        req.body.saldo = 0;

        const user = await User.create(req.body);

        const token = createToken(user._id);

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge
        });

        res.status(200).json({
            user: user._id,
            token
        });

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({
            errors
        });
    }
}

module.exports.login_post = async (req, res) => {
    const {
        email,
        senha
    } = req.body;

    try {
        const user = await User.login(email, senha)
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        });
        res.status(200).json({
            user: user._id,
            token
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

module.exports.carRegister_post = async (req, res) => {
    const {
        placa,
        tipo,
        marca,
        modelo
    } = req.body;

    let token = req.header("token");
    let novoCarro = {
        placa,
        tipo,
        marca,
        modelo
    };
    let dToken;

    if (!token) {
        console.log("erro token");
        return res.sendStatus(500);
    }

    jwt.verify(token, jwtConfig.key, (err, decodedToken) => {
        if (err) {
            console.log(err.message);
            return;
        }
        dToken = decodedToken;
    });

    novoCarro.id_user = dToken.id;
    Carro.create(novoCarro);
    res.send({
        message: "Carro inserido com sucesso."
    });
};

module.exports.addCredit_post = async (req, res) => {

    let token = req.header("token");
    const creditos = req.body.credito;
    let dToken;

    if (!token) {
        console.log("erro sem token");
        return;
    }

    jwt.verify(token, jwtConfig.key, (err, decodedToken) => {
        if (err) {
            console.log(err.message);
            return;
        }
        dToken = decodedToken;
    });

    let user = await User.findById(dToken.id);
    user.saldo += Number(creditos);

    await User.updateOne({
        _id: user._id
    }, {
        saldo: user.saldo
    }, (err, res2) => {
        if (err) return console.log(err);
        console.log("Saldo atualizado");
        res.send({
            saldo: user.saldo
        });
    });
};

//add nova vaga ao banco
module.exports.vagaRegister_post = async (req, res) => {
    const {
        id_vaga
    } = req.body;
    try {
        novaVaga = await Vaga.create({
            id_vaga
        });
        console.log("nova vaga criada " + novaVaga.id_vaga);
    } catch (err) {
        console.log(err);
    }
};

//registra uma nova utilizacao de vaga
module.exports.estacionar_post = async (req, res) => {
    //duracao é o valor em minutos
    const {
        placa_carro,
        id_vaga,
        duracao
    } = req.body;

    try {
        let vaga = await Vaga.find({
            id_vaga
        });
        if (vaga.length == 0) {
            res.status(404).json({
                error: "Vaga não encontrada"
            });
            return;
        }
        const hora_inicio = new Date();
        let hora_fim = new Date(hora_inicio).setTime(hora_inicio.getTime() + (duracao * 60 * 60 * 1000));
        let token = req.header("token");
        let dToken;

        if (!token) {
            console.log("erro sem token");
            return;
        }

        jwt.verify(token, jwtConfig.key, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                return;
            }
            dToken = decodedToken;
        });

        const reserva = await Estacionamento.create({
            placa_carro,
            id_vaga,
            hora_inicio,
            hora_fim
        });

        let user = await User.findById(dToken.id);
        const saldo = user.saldo - (duracao * 3);
        await User.findByIdAndUpdate(dToken.id, {
            saldo
        });
        res.send({
            id_reserva: reserva._id
        });
    } catch (err) {
        console.log(err);
    }
}

//retorna uma lista com todos os carros do usuario atual
module.exports.get_carros = async (req, res) => {

    let token = req.header("token");

    let dToken;

    jwt.verify(token, jwtConfig.key, (err, decodedToken) => {
        console.log("entrou no if");
        if (err) {
            console.log(err.message);
            return;
        }
        dToken = decodedToken;
        console.log(dToken);
    });

    const carros = await Carro.find({
        id_user: dToken.id
    });
    let response = [];
    for (const carro of carros) {
        let estacionado = await Estacionamento.findOne({
            placa_carro: carro.placa,
            hora_fim: {
                $gte: Date.now()
            }
        })
        response.push({
            carro,
            estacionado
        })
        console.log("GHJK", estacionado)
    }

    console.log("response", response);
    res.send({
        response
    });

};

module.exports.get_saldo = async (req, res) => {
    let dToken;
    let token = req.header("token");
    await jwt.verify(token, jwtConfig.key, (err, decodedToken) => {
        if (err) {
            console.log("ERRO:", err.message);
            return;
        }
        dToken = decodedToken;
    });

    const user = (await User.find({
        _id: dToken.id
    }))[0];
    console.log(user);
    res.send({
        saldo: user.saldo
    });

};