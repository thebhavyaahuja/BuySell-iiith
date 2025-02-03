const mongoose = require('mongoose');
const { Schema } = mongoose;

const ItemSchema = new mongoose.Schema({
    sellerEmail: { type: String, required: true },
    sellerName: { type: String, required:true},
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String, required: true }, 
});

module.exports = mongoose.model('Item', ItemSchema);