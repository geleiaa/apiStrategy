const Mongoose = require('mongoose');

const beerSchema = new Mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
})

module.exports = Mongoose.model('beers', beerSchema);