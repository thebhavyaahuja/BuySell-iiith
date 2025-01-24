const mongoose = require('mongoose');
const { Schema } = mongoose;

const emailValidator = (email) => {
    return email.endsWith('.iiit.ac.in');
};

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate:[emailValidator,'You must register with a IIIT Email Account'] },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    contactNo: { type: Number, required: true }
});

module.exports = mongoose.model('User', UserSchema);