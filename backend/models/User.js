const mongoose = require('mongoose');
const { Schema } = mongoose;

const emailValidator = (email) => {
    return email.endsWith('iiit.ac.in');
};

const RatingSchema = new Schema({
    userEmail: { type: String, required: true },
    ratingValue: { type: Number, min: 1, max: 5, required: true }
});

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email:     { type: String, required: true, unique: true, validate: [emailValidator, 'You must register with a IIIT Email Account'] },
    password:  { type: String, required: true },
    age:       { type: Number, required: true },
    contactNo: { type: String, required: true },
    // The overall average rating and how many users rated 
    sellerRating: { type: Number, min: 1, max: 5, default: 5 },
    ratingCount: { type: Number, default: 0 },

    // Store individuals who have rated (one rating per userEmail)
    ratings: [RatingSchema]
});

module.exports = mongoose.model('User', UserSchema);