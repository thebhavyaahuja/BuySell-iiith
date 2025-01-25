const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Item = require('./models/Item');
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
                        contactNo: userDoc.contactNo,
                        password: userDoc.password
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
    console.log('req.body', req.body);
    try {
        const { id, email, firstName, lastName, age, contactNo, password } = req.body;
        const userDoc = await User.findByIdAndUpdate(
            id, 
            { email, firstName, lastName, age, contactNo, password: bcrypt.hashSync(password, SecretStuff) }, 
            { new: true }
        );
        console.log('password', password);
        // console.log('password after hash', bcrypt.hashSync(password, SecretStuff));  
        // userDoc will have _id by default
        res.status(200).json(userDoc);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/items/add',async (req, res) => {
    try {
        const { sellerEmail, sellerName, name, price, quantity, description } = req.body;
        const itemDoc = await Item.create({
            sellerEmail,
            sellerName,
            name,
            price,
            quantity,
            description,
        });
        return res.status(201).json(itemDoc);
    } catch (err) {
        return res.status(400).json(err);
    }
});

app.get('/my-items', async (req, res) => {
    try {
        const { email } = req.query; // Get the email from query parameters
        const items = await Item.find({ sellerEmail: email });
        return res.status(200).json(items);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

app.get('/search', async (req, res) => {
    try {
        const { email } = req.query; // Get the email from query parameters
        // if email matches, then dont show the item
        const items = await Item.find({ sellerEmail: { $ne: email } });
        return res.status(200).json(items);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

app.listen(3000);