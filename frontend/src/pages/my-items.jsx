import { useNavigate } from 'react-router-dom';
import Header from "../Header.jsx";
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext.jsx';
import { useContext } from 'react';

export default function MyItemsPage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const AddItemsLink = user ? '/my-items/add-item' : '/login';

    // console.log('user', user);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchItems();
        }
    }, [user, navigate]);

    async function fetchItems() {
        try {
            const { data } = await axios.get('/my-items', {
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
                    Your Items
                </h1>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border ml-10 h-6 border-gray-300 rounded-lg mr-2 p-2 w-64"
                />
                <button className="mr-30 text-sm shadow-lg bg-blue-900 text-white px-2 py-0.5 rounded-lg">
                    Search
                </button>
            </div>
            <div className="ml-20 mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {filteredItems.map(item => (
                    <div key={item._id} className="mb-5 border border-gray-300 p-4 rounded-lg shadow-lg shadow-blue-950 w-60 h-45">
                        <h2 className="text-xl font-bold text-blue-950">{item.name}</h2>
                        <p className="text-lg text-blue-950">Price: {item.price}</p>
                        <p className="text-lg text-blue-950">Quantity: {item.quantity}</p>
                        <p className="text-lg text-blue-950">Description: {item.description}</p>
                    </div>
                ))}
            </div>
            <div className="px-25 py-10 fixed bottom-4 right-4">
                <Link
                    to={AddItemsLink}
                    className="bg-blue-900 text-white px-4 py-2 rounded-full shadow-lg"
                >
                    Add Items
                </Link>
            </div>
        </>
    );
}