const mongoose = require('mongoose');

const orderOTPSchema = new mongoose.Schema({
    orderId: { type: String,required: true },
    buyerEmail: { type: String, required: true },
    sellerEmail: { type: String, required: true },
    hashedOTP: { type: String, required: true },
});

module.exports = mongoose.model('OrderOTP', orderOTPSchema);