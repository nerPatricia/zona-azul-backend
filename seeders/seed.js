const Vaga = require('../models/Vaga');
const mongoose = require('mongoose');

const data = [{
    id_vaga: "120"
  },
  {
    id_vaga: "121"
  },
  {
    id_vaga: "122"
  },
  {
    id_vaga: "123"
  },
  {
    id_vaga: "124"
  },
]

const dbURI = 'mongodb://localhost:27017/zona-azul'
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).catch((err) => console.log(err));
data.forEach(vaga => {
  Vaga.create(vaga);
});