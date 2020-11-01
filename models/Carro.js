const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    user_id : {
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
carSchema.post('save', function (doc,next) {
    console.log('new carro saved',doc);
    next();
});

const Car = mongoose.model('user_carro', carSchema);

module.exports = Car;
