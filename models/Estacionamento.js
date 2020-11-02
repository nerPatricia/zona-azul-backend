const mongoose = require('mongoose');

const estacionamentoSchema = new mongoose.Schema({
    id_vaga : {
        type: String,
        required : true,
    },
    placa_carro : {
        type : String,
        required : true,
    },
    hora_inicio : {
        type : Date,
    },

    hora_fim : {
        type : Date,  
    },

});

//fire a function after doc was saved
estacionamentoSchema.post('save', function (doc,next) {
    console.log('new estacionou saved',doc);
    next();
});

const Estacionamento = mongoose.model('estacionamento', estacionamentoSchema);

module.exports = Estacionamento;
