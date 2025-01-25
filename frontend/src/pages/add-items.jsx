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
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    // const [image, setImage] = useState(null);

    async function handleSubmit(e) {
        console.log(user);
        e.preventDefault();
        try {
            // Construct form data (or just use JSON for non-file uploads)
            const formData = new FormData();
            formData.append('sellerEmail', user?.email || '');
            formData.append('sellerName', `${user?.firstName ?? ''} ${user?.lastName ?? ''}`);
            formData.append('name', name);
            formData.append('price', price);
            formData.append('quantity', quantity);
            formData.append('description', description);
            // if (image) {
            //     formData.append('image', image);
              // }
            // console.log(formData);
            console.log(user?.email, `${user?.firstName} ${user?.lastName}`, name, price, quantity, description);
            // POST request to add item
            await axios.post('/items/add', {
                sellerEmail: user?.email,
                sellerName: `${user?.firstName} ${user?.lastName}`,
                name: name,
                price: price,
                quantity: quantity,
                description: description
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            );

            alert('Item added successfully!');
            navigate('/search');
        } catch (err) {
            console.error(err);
            alert('Failed to add item!');
        }
    }

    return(
        <>
            <Header/>
            <div className="p-4 space-y-4 ml-90">
                <h1 className="text-2xl text-blue-950 font-bold mb-4 ml-25  ">Add Item</h1>
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
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
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
                    {/* For images (optional) */}
                    {/* <input
                        type="file"
                        onChange={e => setImage(e.target.files[0])}
                        className="border border-gray-300 rounded p-2"
                    /> */}
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Item</button>
                </form>
            </div>
        </>
    )
}