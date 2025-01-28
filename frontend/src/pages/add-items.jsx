import Header from "../Header.jsx";
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext.jsx';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddItemPage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(''); // Added category state

    async function handleSubmit(e) {
        console.log(user);
        e.preventDefault();
        try {
            // POST request to add item
            await axios.post('/items/add', {
                sellerEmail: user?.email,
                sellerName: `${user?.firstName} ${user?.lastName}`,
                name: name,
                price: price,
                description: description,
                category: category // Include category in the request
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            alert('Item added successfully!');
            navigate('/my-items');
        } catch (err) {
            console.error(err);
            alert('Failed to add item!');
        }
    }

    return (
        <>
            <Header />
            <div className="p-4 space-y-4 ml-90">
                <h1 className="text-2xl text-blue-950 font-bold mb-4 ml-25">Add Item</h1>
                <form onSubmit={handleSubmit} className="flex flex-col w-80 space-y-3">
                    <input
                        type="text"
                        placeholder="Item Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="border border-gray-300 rounded p-2"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className="border border-gray-300 rounded p-2"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="border border-gray-300 rounded p-2"
                        rows={3}
                        required
                    />
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="border border-gray-300 rounded p-2"
                        required
                    >
                        <option value="" disabled>Select Category</option>
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="toys">Toys</option>
                        <option value="digital services">Digital Services</option>
                        <option value="cosmetics and body care">Cosmetics and Body Care</option>
                        <option value="food and beverage">Food and Beverage</option>
                        <option value="furniture and decor">Furniture and Decor</option>
                        <option value="health and wellness">Health and Wellness</option>
                        <option value="household items">Household Items</option>
                        <option value="media">Media</option>
                        <option value="pet care">Pet Care</option>
                        <option value="office equipment">Office Equipment</option>
                        <option value="other">Other</option>
                    </select>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Item</button>
                </form>
            </div>
        </>
    );
}   