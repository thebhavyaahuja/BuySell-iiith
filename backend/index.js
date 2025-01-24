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
            const token = jwt.sign({id:userDoc._id,email:userDoc.email, firstName:userDoc.firstName, lastName:userDoc.lastName}, JWT_Secret, {}, (err,token)=>{
                if(err) throw err;
                // res.cookie('token',token).json('pass ok');
                return res.cookie('token',token).status(200).json({
                    token, 
                    user:{
                        id: userDoc._id,
                        email: userDoc.email,
                        firstName: userDoc.firstName,
                        lastName: userDoc.lastName,
                        age: userDoc.age,
                        contactNo: userDoc.contactNo
                    }
                })
            });
        } else{
            return res.status(400).json('Invalid credentials');
        }
    } catch (err) {
        return res.status(400).json(err);
    }
});

app.put('/update-user', async (req, res) => {
    try {
        const { id, email, firstName, lastName, age, contactNo } = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, { email, firstName, lastName, age, contactNo }, { new: true });
        res.json({ user: updatedUser });
    } catch (err) {
        res.status(400).json({error:err.message});
    }
});

app.listen(3000);