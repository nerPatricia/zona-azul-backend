const mongoose = require('mongoose');
const {
    isEmail
} = require('validator');
const bCrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'nome obrigatorio'],
        unique: true,
        lowercase: true
    },

    sobrenome: {
        type: String,
        required: [true, 'sobrenome obrigatorio'],
        unique: true,
        lowercase: true
    },

    cpf: {
        type: String,
        required: [true, 'CPF obrigatorio'],
        unique: true,
    },

    email: {
        type: String,
        required: [true, 'email obrigatorio'], //[0] = bool, [1] = custom err msg
        unique: true,
        lowercase: true,
        validate: [isEmail, 'email invalido'], //[0] = validation function [1] = custom err msg
    },

    celular: {
        type: String,
        required: [true, 'Please enter a cellphone'],
        minlength: [9, 'tem q ter 9 numeros'], //da pra definir isso
    },

    senha: {
        type: String,
        required: [true, 'Coloca senha'],
        minlength: [6, 'Tamanho minimo 6'], //da pra definir isso
    },

    saldo: {
        type: Number,
        required: true,
        default: 0,
    },
});

//fire a function after doc was saved
userSchema.post('save', function (doc, next) {
    console.log('salvou novo usuario', doc);
    next();
});

//fire a function before doc was saved
//using to hash the pwd before saving it
userSchema.pre('save', async function (next) {
    //console.log('user about to be created',this );
    const salt = await bCrypt.genSalt();
    this.senha = await bCrypt.hash(this.senha, salt);
    this.saldo = 0;
    next();
});

//login method

userSchema.statics.login = async function (email, senha) {
    const user = await this.findOne({
        email
    });
    if (!user) {
        throw Error('incorrect email');
    }

    const auth = await bCrypt.compare(senha, user.senha);
    if (auth)
        return user;
    throw Error('incorrect password');
};

const User = mongoose.model('user', userSchema);

module.exports = User;