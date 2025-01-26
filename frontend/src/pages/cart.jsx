import { useNavigate } from 'react-router-dom';
import Header from "../Header.jsx";
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext.jsx';
import { useContext } from 'react';

export default function CartPage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // console.log('user', user);

    const handleRemoveFromCart = async (item) => {
        console.log(item);
        try {
            console.log(item.itemId);
            await axios.put('/cart/remove', { itemId: item.itemId });
            alert('Item removed from cart!');
            setItems(prevItems => prevItems.filter(i => i.itemId !== item.itemId));
        } catch (err) {
            console.error(err);
            alert('Failed to remove item from cart!');
        }
    }

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchItems();
        }
    }, [user, navigate]);

    async function fetchItems() {
        try {
            const { data } = await axios.get('/my-cart', {
                params: { email: user.email }
            });
            setItems(data);
        } catch (err) {
            console.error(err);
        }
    }

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Header />
            <div className="flex items-center p-4">
                <h1 className="ml-40 mr-10 w-200 text-2xl text-blue-950 font-bold">
                    My Cart
                </h1>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border ml-10 h-6 border-gray-300 rounded-lg mr-2 p-2 w-64"
                />
                <button className="mr-30 text-sm shadow-lg bg-blue-900 text-white px-2 py-0.5 rounded-lg hover:bg-blue-800 transition duration-300">
                    Search
                </button>
            </div>
            <div className="ml-20 mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {filteredItems.map(item => (
                    <div key={item._id} className="mb-5 border border-gray-300 p-4 rounded-lg shadow-lg shadow-blue-950 w-60 h-45 hover:bg-blue-100 transition duration-300">
                        <h2 className="text-xl font-bold text-blue-950">{item.name}</h2>
                        <p className="text-lg text-blue-950">Price: Rs. {item.price}</p>
                        <p className="text-lg text-blue-950">Description: {item.description}</p>
                        <button className="bg-blue-950 text-white px-3 py-2 mt-4 ml-19 rounded-full shadow-lg hover:bg-blue-900 transition duration-300" onClick={()=>handleRemoveFromCart(item)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
            <div className="px-3 py-2 mb-10 mr-15 fixed bottom-4 right-4 bg-blue-900 text-white rounded-full shadow-md shadow-blue-950">
                Cart Value : Rs. {items.reduce((acc, item) => acc + item.price, 0)}
            </div>
        </>
    );
}