const mongoose = require('mongoose');
const { Schema } = mongoose;

const ItemSchema = new mongoose.Schema({
    sellerEmail: { type: String, required: true },
    sellerName: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
});

module.exports = mongoose.model('Item', ItemSchema);