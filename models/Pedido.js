const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Pedido = new Schema({
    mesa: {
        type: Number,
        required: true
    },
    pratoPrincipal: {
        type: Schema.Types.ObjectId,
        ref: 'pratosPrincipais',
        required: true
    },
    sobremesa: {
        type: Schema.Types.ObjectId,
        ref: 'sobremesas',
        required: true
    },
    observacao: {
        type: String,
        required: false
    },
    data: {
        type: Date,
        default: Date.now
    }
})

mongoose.model('pedidos', Pedido);