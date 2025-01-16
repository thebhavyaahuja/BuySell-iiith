// console.log('hello world');
const express = require('express')
const connectDB = require('./db')
const app = express()

require('dotenv').config();

connectDB();

const Product = require('./models/Product')

app.get('/products',async(req,res)=>{
    const products = [
        {name:'Product 1', price:100, description:'Description 1', category:'Category 1', sellerId:'1'},
        {name:'Product 2', price:200, description:'Description 2', category:'Category 2', sellerId:'2'},
        {name:'Product 3', price:300, description:'Description 3', category:'Category 3', sellerId:'3'}
    ];
    try {
        await Product.insertMany(products);
        res.send('Products added to database');
    } catch(error){
        res.status(500).send('Error adding products to database');
    }
});

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