const User = require('../models/User');
const Carro = require('../models/Carro');
const Vaga = require('../models/Vaga');
const Estacionamento = require('../models/Estacionamento');

const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

const maxAge = 30 * 60*1000; //in seconds

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {email : '', password : ''};


    //email duplication error
    if(err.code === 11000){
        errors.email = 'email already in use';
        return errors;
    }

    //validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach( ({properties}) => {
            errors[properties.path] = properties.message;
        });
    }  
    
    //incorrect email
    if(err.message === ('incorrect email') ){
        errors.email = 'email not registered';
    }

    if(err.message === ('incorrect password') ){
        errors.password = 'wrong password';
    }


    return errors;
};

const createToken = (id) => {
    return jwt.sign( {id},jwtConfig.key , {
        expiresIn : maxAge,
    })
};

module.exports.userSignup_get = (req,res) => {
    res.render('signup');
}

module.exports.userSignup_post = async (req,res) => {
    //const {nome,sobrenome ,cpf, email, celular, password} = req.body;
    try{
        req.body.saldo = 0;
        //console.log(req.body);
        
        const user = await User.create(req.body);

        const token = createToken(user._id);
        
        res.cookie('jwt',token, { httpOnly: true, maxAge: maxAge*1000 });

        res.status(201).json( {user : user._id} );

    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json( {errors});
    }
}

module.exports.login_get = (req,res) => {
    res.render('login');
}

module.exports.login_post = async (req,res) => {
    const {email, senha} = req.body;
    
    try{
        const user = await User.login(email,senha)
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly : true, maxAge : maxAge * 1000});
        res.status(200).json({user : user._id});

    }catch (err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.logout_get = async (req,res) => {
    res.cookie('jwt','', {maxAge : 1});
    res.redirect('/');
}

module.exports.carRegister_post = async (req, res) => {
    const {placa , tipo, marca, modelo} = req.body;

    const token = req.cookies.jwt;
    let novoCarro = {placa,tipo,marca,modelo};
    let dToken;
    
    if(!token){
        console.log("erro token");   
        return ;
    }
    
    let decodedUser = jwt.verify(token,jwtConfig.key, (err,decodedToken) => {
        if(err){
            console.log(err.message);
            return;
        }
        dToken = decodedToken;
    });
        novoCarro.id_user = dtoken.id;
        let user = await User.findById( dToken.id);
        novoCarro.user_id = user._id;
        Carro.create(novoCarro);
        res.sendStatus(200);
};

module.exports.addCredit_post = async (req,res) => {

    const token = req.cookies.jwt;
    const creditos = req.body.creditos;
    let dToken;
    
    if(!token){
        console.log("erro sem token");   
        return ;
    }
    
    jwt.verify(token,jwtConfig.key, (err,decodedToken) => {
        if(err){
            console.log(err.message); 
            return;
        }
        dToken = decodedToken;
    });
    
    let user = await User.findById( dToken.id);
    user.saldo += Number(creditos);
    
    await User.updateOne({_id : user._id}, {saldo : user.saldo}, (err,res2) => {
        if(err) return console.log(err);
        console.log("Saldo atualizado");
        res.send({saldo : user.saldo});
    });
};

//add nova vaga ao banco
module.exports.vagaRegister_post = async(req,res) => {
    const {id_vaga} = req.body;
    try{
    novaVaga = await Vaga.create({ id_vaga});
    console.log("nova vaga criada " + novaVaga.id_vaga);
    }
    catch(err){
        console.log(err);
    }
};

//registra uma nova utilizacao de vaga
module.exports.estacionar_post = async(req,res) => {
    //duracao é o valor em minutos
    const {placa_carro , id_vaga, duracao} = req.body;
    try{
        const hora_inicio = new Date();
        let hora_fim = new Date(hora_inicio).setMinutes(hora_inicio.getMinutes() + duracao);
        //console.log(new Date(hora_fim).toUTCString());

        const reserva = await Estacionamento.create({placa_carro, id_vaga , hora_inicio , hora_fim });
        
        res.send({id_reserva : reserva._id});
    }
    catch(err){
        console.log(err);
    }
}

module.exports.get_carros = async (req,res) => {
    
    const token = req.cookies.jwt;

    let dToken;

    jwt.verify(token,jwtConfig.key, (err,decodedToken) => {
        if(err){
            console.log(err.message); 
            return;
        }
        dToken = decodedToken;
    });


    //console.log(dToken.id);
    const carros = await Carro.find({id_user : dToken.id});
    console.log(carros);
    res.send( {carros} );

};

module.exports.temp = (req,res) => {
    res.render('temp');
}