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
            <div className="flex items-center p-6 bg-gray-100">
                <h1 className="ml-40 mr-10 w-200 text-3xl text-blue-900 font-bold">
                    Your Items
                </h1>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border ml-10 h-10 border-gray-300 rounded-lg mr-2 p-2 w-64"
                />
                <button className="text-sm shadow-lg bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition duration-300">
                    Search
                </button>
            </div>
            <div className="ml-20 mb-15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {filteredItems.map(item => (
                    <div key={item._id} className="mb-10 border border-gray-300 p-6 rounded-lg shadow-md shadow-gray-600 hover:bg-blue-100 transition duration-300 cursor-pointer">
                        <h2 className="text-xl font-bold text-blue-900">{item.name}</h2>
                        <p className="text-lg flex flex-row"><div className="mr-17">Price:</div> <div className=" text-blue-900 font-semibold">Rs. {item.price}</div></p>
                        <p className="text-lg flex flex-row"><div className="mr-9">Category:</div> <div className="text-blue-900 font-semibold">{item.category}</div></p>
                        <p className="text-lg flex flex-row"><div className="mr-4">Description:</div> <div className="text-blue-900 font-semibold">{item.description}</div></p>
                    </div>
                ))}
            </div>
            <div className="fixed bottom-14 right-10">
                <Link
                    to={AddItemsLink}
                    className="bg-blue-900 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-800 transition duration-300"
                >
                    Add Items
                </Link>
            </div>
        </>
    );
}