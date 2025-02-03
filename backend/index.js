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
const router = express.Router();
const session = require('express-session');
const CASAuthentication = require('cas-authentication');
const axios = require('axios'); 

app.use (session({
    secret:'some-secret-string',
    resave:false,
    saveUninitialized:true
}));

var cas = new CASAuthentication({
    cas_url     : 'https://login.iiit.ac.in/cas',
    service_url : 'http://localhost:3000',
    cas_version: '2.0',
    renew: false,
    destroy_session: false,
    session_info: 'user'
});

app.get('/cas-login', cas.bounce, async function(req, res) {
    const email = req.session['cas_user'];
    const user = await User.findOne({ email });

    if (!user) {
        // Redirect to CAS registration page if user does not exist
        return res.redirect(`http://localhost:5173/register-cas?email=${email}`);
    }

    // Generate token and redirect to search page
    const storeName = "Buy Sell @ iiith";
    const userStoreContext = `You are a helpful bot for user ${user.firstName} ${user.lastName}, owner of ${storeName}. Provide helpful info related to their store products upon request. If user asks what to do, tell him, in this store he can Buy order from Search Tab, sell his own items and track history and pending orders.`;
    const token = jwt.sign({ id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, storeContext: userStoreContext }, JWT_Secret);

    res.cookie('token', token).redirect('/search');
});

const SecretStuff = bcrypt.genSaltSync(10);
const JWT_Secret = process.env.JWT_SECRET || 'your_jwt_secret';
const cookieParser = require('cookie-parser');
app.use(cookieParser());

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
        const { email, password, recaptchaToken } = req.body;
        
        // If recaptchaToken is provided, verify it with Google using your secret key
        if (!recaptchaToken) {
            return res.status(400).json({ error: 'Missing recaptcha token' });
        }
        const SECRET_RECAPTCHA = process.env.RECAPTCHA_SECRET_KEY; // set in .env
        const captchaRes = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_RECAPTCHA}&response=${recaptchaToken}`
        );
        if (!captchaRes.data.success) {
            return res.status(400).json({ error: 'Captcha verification failed' });
        }

        // Proceed to manual login
        const userDoc = await User.findOne({ email });
        if (userDoc && bcrypt.compareSync(password, userDoc.password)) {
            const storeName = "Buy Sell @ iiith";
            const userStoreContext = `You are a helpful bot for user ${userDoc.firstName} ${userDoc.lastName}, owner of ${storeName}. Provide helpful info related to their store products upon request. If user asks what to do, tell him, in this store he can Buy order from Search Tab, sell his own items by creating in My Items tab, then waiting for someone to request it   and then finishing the requested order at Deliver tab by coordinating an OTP from both ends and track history on History tab`;
            const token = jwt.sign({ id: userDoc._id, email: userDoc.email, firstName: userDoc.firstName, lastName: userDoc.lastName, storeContext: userStoreContext }, JWT_Secret, {}, (err, token) => {
                if (err) throw err;
                return res.cookie('token', token).status(200).json({
                    token,
                    user: {
                        id: userDoc._id,
                        email: userDoc.email,
                        firstName: userDoc.firstName,
                        lastName: userDoc.lastName,
                        age: userDoc.age,
                        contactNo: userDoc.contactNo,
                        password: userDoc.password,
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

app.get('/profile', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json('No token');
        const { id } = jwt.verify(token, JWT_Secret);
        const userDoc = await User.findById(id);
        if (!userDoc) return res.status(404).json('User not found');
        res.json({  
            _id: userDoc._id,
            email: userDoc.email,
            firstName: userDoc.firstName,
            lastName: userDoc.lastName,
            age: userDoc.age,
            contactNo: userDoc.contactNo,
        });
    } catch (e) {
        res.status(401).json('Invalid token');
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
        const { itemId, name, userEmail, sellerEmail, price, sellerName, description, category } = req.body;
        // Add item to cart
        console.log('itemId', itemId);
        // check if item already exists in cart with the same userEmail
        const itemInCart = await Cart.findOne({ itemId, userEmail });
        if (itemInCart) {
            return res.status(400).json({ message: 'Item already in cart' });
        }
        const cartDoc = await Cart.create({ itemId, name, userEmail, price, sellerEmail, sellerName, description, category });

        // // added to store context
        // await StoreContext.findOneAndUpdate(
        //     { userId: userDoc._id },
        //     { $push: { events: `Added item to cart: ${name} ($${price})` } },
        //     { upsert: true, new: true }
        // );
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
        // store context
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
                sellerEmail: item.sellerEmail,
                category: item.category,
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
        if (mode === 'pending') {
            query = { userEmail: email, status: 'Pending' };
        } else if (mode === 'Bought') {
            query = { userEmail: email, status: 'Delivered' };
        } else if (mode === 'Sold') {
            query = { sellerEmail: email, status: 'Delivered' };
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
        const { buyerEmail, sellerEmail, orderId } = req.body;
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
        const { sellerEmail, buyerEmail, orderId, otp } = req.body;

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

const { GoogleGenerativeAI } = require("@google/generative-ai");

app.post('/chatbot', async (req, res) => {
    try {
        let storeContext = '';
        const token = req.cookies.token;
        if (token) {
            const userData = jwt.verify(token, JWT_Secret);
            storeContext = userData.storeContext;
        }
        const { messages } = req.body;
        const storeContextString = storeContext ? `Store Context: ${storeContext}` : '';
        const userMessages = messages.map(msg => `${msg.role}: ${msg.content}`).join("\n");
        const finalPrompt = `${storeContext}\n${storeContextString}\n${userMessages}`;

        // Gemini call
        const genAI = new GoogleGenerativeAI("AIzaSyDAiq7Kj6LHr3vrYS7AAt3_MxI5e1JxHTY");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(finalPrompt);

        return res.status(200).json({ reply: result.response.text() });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err.message });
    }
});

app.put('/my-items/remove', async (req, res) => {
    try {
        const { itemId } = req.body;
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Remove the item
        await Item.deleteOne({ _id: itemId });

        // Update StoreContext for the user
        const userDoc = await User.findOne({ email: item.sellerEmail });
        // if (userDoc) {
        //     await StoreContext.findOneAndUpdate(
        //         { userId: userDoc._id },
        //         { $push: { events: `Removed item: ${item.name}` } },
        //         { upsert: true, new: true }
        //     );
        // }

        return res.status(200).json({ message: 'Item removed' });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

app.get('/users/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const userDoc = await User.findOne({ email });
        if (!userDoc) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            email: userDoc.email,
            firstName: userDoc.firstName,
            lastName: userDoc.lastName,
            sellerRating: userDoc.sellerRating,
            ratingCount: userDoc.ratingCount
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

// Updates or creates a new rating from a specific user for the vendor
app.put('/users/update-rating', async (req, res) => {
    try {
        const { vendorEmail, raterEmail, newRating } = req.body;
        if (!vendorEmail || !raterEmail) {
            return res.status(400).json({ message: 'Missing emails' });
        }
        if (!newRating || newRating < 1 || newRating > 5) {
            return res.status(400).json({ message: 'Invalid rating. Must be 1–5.' });
        }

        // Find the vendor document
        const vendorDoc = await User.findOne({ email: vendorEmail });
        if (!vendorDoc) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Check if the rater has rated before
        const existingRating = vendorDoc.ratings.find(
            (r) => r.userEmail === raterEmail
        );

        if (existingRating) {
            // Update previous rating
            existingRating.ratingValue = newRating;
        } else {
            // Push a new rating
            vendorDoc.ratings.push({ userEmail: raterEmail, ratingValue: newRating });
        }

        // Recount ratingCount
        vendorDoc.ratingCount = vendorDoc.ratings.length;

        // Recalculate average
        const sum = vendorDoc.ratings.reduce((acc, curr) => acc + curr.ratingValue, 0);
        vendorDoc.sellerRating = sum / vendorDoc.ratingCount;

        // Save changes
        const updated = await vendorDoc.save();

        return res.status(200).json({
            message: 'Rating updated successfully',
            sellerRating: updated.sellerRating,
            ratingCount: updated.ratingCount
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('token').json('Logged out');
});

app.post('/register-cas', async (req, res) => {
    try {
        const { email, firstName, lastName, age, contactNo } = req.body;
        const user = await User.findOrCreateCASUser(email, firstName, lastName, age, contactNo);
        return res.status(201).json(user);
    } catch (err) {
        return res.status(400).json(err);
    }
});

app.listen(3000);