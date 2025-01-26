const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartSchema = new Schema({
    userEmail: { type: String, required: true },
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    sellerEmail: { type: String, required: true },
    price: { type: Number, required: true },
    sellerName: { type: String, required: true },
    description: { type: String },
});

module.exports = mongoose.model('Cart', CartSchema);