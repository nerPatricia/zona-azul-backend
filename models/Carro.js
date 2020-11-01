const mongoose = require('mongoose');

const carroSchema = new mongoose.Schema({
    id_user : {
        type: String,
    },

    tipo : {
        type : String,
        lowercase : true,
    },

    placa : {
        type : String,
        lowercase : true,
        unique : true,
    },

    marca : {
        type : String,
        lowercase : true,
    },

    modelo : {
        type : String,
        lowercase : true,
    },
    
});

//fire a function after doc was saved
carroSchema.post('save', function (doc,next) {
    console.log('new carro saved',doc);
    next();
});

const Carro = mongoose.model('user_carro', carroSchema,);

module.exports = Carro;
