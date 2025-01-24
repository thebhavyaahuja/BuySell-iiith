const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  

const SecretStuff = bcrypt.genSaltSync(10);
const JWT_Secret = process.env.JWT_SECRET || 'your_jwt_secret';

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

mongoose.connect(process.env.MONGO_URI);

app.get('/test', (req, res) => {
    res.json('test ok!');
});

app.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, age, contactNo, password } = req.body;
        const userDoc = await User.create({
            firstName,
            lastName,
            email,
            age,
            contactNo,
            password: bcrypt.hashSync(password, SecretStuff),
        });
        return res.status(201).json(userDoc);
    } catch (err) {
        return res.status(400).json(err);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userDoc = await User.findOne({ email });
        if(userDoc && bcrypt.compareSync(password, userDoc.password)) {
            const token = jwt.sign({id:userDoc._id,email:userDoc.email}, JWT_Secret, {}, (err,token)=>{
                if(err) throw err;
                res.cookie('token',token).json('pass ok');
            });
        } else{
            return res.status(400).json('Invalid credentials');
        }
    } catch (err) {
        return res.status(400).json(err);
    }
});

app.listen(4000);