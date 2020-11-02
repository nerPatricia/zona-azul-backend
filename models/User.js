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
        validate: [isEmail, 'needs Valid Email'], //[0] = validation function [1] = custom err msg
    },

    celular: {
        type: String,
        required: [true, 'celular obrigatorio'],
        minlength: [11, 'Min length is 6'], //da pra definir isso
    },

    password: {
        type: String,
        required: [true, 'senha obrigatoria'],
        minlength: [6, 'Min length is 6'], //da pra definir isso
    },

    saldo: {
        type: Number,
        required: true,
        default: 0,
    },
});

//fire a function after doc was saved
userSchema.post('save', function (doc, next) {
    console.log('new user saved', doc);
    next();
});

//fire a function before doc was saved
//using to hash the pwd before saving it
userSchema.pre('save', async function (next) {
    //console.log('user about to be created',this );
    const salt = await bCrypt.genSalt();
    this.password = await bCrypt.hash(this.password, salt);
    next();
});

//login method
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({
        email
    });
    if (!user) {
        throw Error('incorrect email');
    }

    const auth = await bCrypt.compare(password, user.password);
    if (auth)
        return user;
    throw Error('incorrect password');
};

const User = mongoose.model('user', userSchema);

module.exports = User;