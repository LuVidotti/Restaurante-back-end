const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Sobremesa = new Schema({
    nome: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    }
})


mongoose.model('sobremesas', Sobremesa);