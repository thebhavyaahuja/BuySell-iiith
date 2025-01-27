const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Item = require('./models/Item');
const Cart = require('./models/Cart');
const OrderOTP = require('./models/OrderOTP');
const Order = require('./models/Order');
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
        if (userDoc && bcrypt.compareSync(password, userDoc.password)) {
            const token = jwt.sign({ id: userDoc._id, email: userDoc.email, firstName: userDoc.firstName, lastName: userDoc.lastName }, JWT_Secret, {}, (err, token) => {
                if (err) throw err;
                // res.cookie('token',token).json('pass ok');
                return res.cookie('token', token).status(200).json({
                    token,
                    user: {
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
        } else {
            return res.status(400).json('Invalid credentials');
        }
    } catch (err) {
        return res.status(400).json(err);
    }
});

app.put('/update-user', async (req, res) => {
    try {
        const {
            id,
            email,
            firstName,
            lastName,
            age,
            contactNo,
            password // Only present if the user wants to update it
        } = req.body;

        // Build an object with only the fields we want to update
        const updateFields = {
            email,
            firstName,
            lastName,
            age,
            contactNo
        };

        // Only hash and update password if it's provided and non-empty
        if (password && password.trim() !== '') {
            updateFields.password = bcrypt.hashSync(password, SecretStuff);
        }

        const userDoc = await User.findByIdAndUpdate(id, updateFields, { new: true });
        return res.status(200).json(userDoc);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

app.put('/change-password', async (req, res) => {
    try {
        const { id, newPassword } = req.body;
        if (!id || !newPassword) {
            return res.status(400).json({ error: 'ID and newPassword are required.' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, SecretStuff);

        const userDoc = await User.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
        );

        return res.status(200).json(userDoc);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

app.post('/items/add', async (req, res) => {
    try {
        const { sellerEmail, sellerName, name, price, description, category } = req.body;
        const itemDoc = await Item.create({
            sellerEmail,
            sellerName,
            name,
            price,
            description,
            category
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

app.get('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        return res.status(200).json(item);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

app.post('/cart/add', async (req, res) => {
    try {
        const { itemId, name, userEmail, sellerEmail, price, sellerName, description } = req.body;
        // Add item to cart
        console.log('itemId', itemId);
        // check if item already exists in cart
        const itemInCart = await Cart.findOne({ itemId });
        if (itemInCart) {
            return res.status(400).json({ message: 'Item already in cart' });
        }
        const cartDoc = await Cart.create({ itemId, name, userEmail, price, sellerEmail, sellerName, description });
        return res.status(201).json(cartDoc);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

app.get('/my-cart', async (req, res) => {
    try {
        const { email } = req.query;
        const items = await Cart.find({ userEmail: email });
        return res.status(200).json(items);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

app.put('/cart/remove', async (req, res) => {
    try {
        const { itemId } = req.body;
        console.log('itemId', itemId);
        await Cart.deleteOne({ itemId });
        return res.status(200).json({ message: 'Item removed from cart' });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

app.post('/orders/checkout', async (req, res) => {
    try {
        const { userEmail } = req.body;
        // Find all cart items for this user
        const cartItems = await Cart.find({ userEmail });
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const createdOrders = [];

        // Loop through the cart items and create an Order document per item
        for (const item of cartItems) {
            const newOrder = await Order.create({
                userEmail,
                itemId: item.itemId,
                name: item.name,
                price: item.price,
                sellerName: item.sellerName,
                sellerEmail: item.sellerEmail
            });
            createdOrders.push(newOrder);
        }

        // Clear user cart
        await Cart.deleteMany({ userEmail });

        return res.status(201).json({
            message: 'Orders created successfully!',
            orders: createdOrders
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

app.get('/orders/history', async (req, res) => {
    try {
        console.log('req.query', req.query);
        const { email, mode } = req.query;
        if(mode === 'pending') {
            query={ userEmail: email, status: 'Pending' };
        } else if (mode === 'Bought') {
            query={ userEmail: email, status: 'Delivered' };
        } else if (mode === 'Sold') {
            query={ sellerEmail: email, status: 'Delivered' };
        }
        const orders = await Order.find(query).sort({ createdAt: -1 });
        return res.status(200).json(orders);
    } catch (err) {
        console.log(err);   
        return res.status(400).json({ message: err.message });
    }
});

app.post('/orders/generate-otp', async (req, res) => {
    try {
        const { buyerEmail,sellerEmail, orderId } = req.body;
        const plainOTP = generateOTP();
        console.log('plainOTP', plainOTP);

        // Create or update OTP entry (one per order)
        let otpDoc = await OrderOTP.findOne({ orderId, buyerEmail });
        if (!otpDoc) {
            otpDoc = new OrderOTP({
                orderId,
                buyerEmail,
                sellerEmail,
                hashedOTP: bcrypt.hashSync(plainOTP, SecretStuff),
            });
        } else {
            otpDoc.hashedOTP = bcrypt.hashSync(plainOTP, SecretStuff);
        }
        await otpDoc.save();
        console.log('otpDoc', otpDoc);

        // Return plain OTP to user, DB stores only hashed
        return res.status(201).json({ otp: plainOTP });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

app.get('/orders/deliveries', async (req, res) => {
    try {
        console.log('req.query', req.query);
        const { email } = req.query;
        // Find all orders where the sellerEmail is this user (the seller)
        // and the order status is still "Pending"
        const orders = await Order.find({
            sellerEmail: email,
            status: 'Pending'
        }).sort({ createdAt: -1 });

        return res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: err.message });
    }
});

app.post('/orders/complete-delivery', async (req, res) => {
    try {
        console.log('SELLER', req.body);
        const { sellerEmail,buyerEmail, orderId, otp } = req.body;

        // Find the corresponding OrderOTP entry
        const otpDoc = await OrderOTP.findOne({
            orderId,
            sellerEmail,
            buyerEmail
        });
        console.log('otpDoc', otpDoc);

        if (!otpDoc) {
            return res.status(400).json({ message: 'Buyer didn\'t generate an OTP for this order yet' });
        }

        // Compare the provided OTP with the hashed OTP
        const isMatch = await bcrypt.compare(otp, otpDoc.hashedOTP);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        // Optionally delete the OTP doc so it can't be reused
        await OrderOTP.findByIdAndDelete(otpDoc._id);

        return res.status(200).json({
            message: 'Delivery completed successfully',
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: err.message });
    }
});

app.put('/orders/mark-delivered', async (req, res) => {
    try {
        const { orderId } = req.body;
        await Order.findByIdAndUpdate(orderId, { status: 'Delivered' });
        return res.status(200).json({ message: 'Order marked as delivered' });  
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

app.listen(3000);