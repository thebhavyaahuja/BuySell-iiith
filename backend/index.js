// console.log('hello world');
const express = require('express')
const connectDB = require('./db')
const app = express()

require('dotenv').config();

connectDB();

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/login', (req, res) => {
    res.send('<h1>Login Page</h1>')
})

app.get('/register', (req, res) => {
    res.send('<h1>Register Page</h1>')
})

app.get('/search', (req, res) => {
    res.send('<h1>Search Page</h1>')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})