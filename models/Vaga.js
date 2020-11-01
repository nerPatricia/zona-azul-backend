const mongoose = require('mongoose');

const vagaSchema = new mongoose.Schema({
    id_vaga : {
        type: Number,
        required : true,
        unique : [true, 'essa vaga ja existe']
    },    
});

//fire a function after doc was saved
vagaSchema.post('save', function (doc,next) {
    console.log('new vaga saved',doc);
    next();
});

const Vaga = mongoose.model('vaga', vagaSchema);

module.exports =Vaga;
