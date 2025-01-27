const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    sellerName: { type: String, required: false },
    sellerEmail: { type: String, required: false },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
    category: { type: String, required: true }, 
});

module.exports = mongoose.model('Order', orderSchema);