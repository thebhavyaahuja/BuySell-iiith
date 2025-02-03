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

    async function handleRemoveMyItems(item) {
        console.log(item);
        try {
            console.log(item._id);
            await axios.put('/my-items/remove', { itemId: item._id });
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
    }, [user, items, navigate]);

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
            <div className="ml-10 mb-10 mr-10 rounded-full flex items-center p-6 bg-gray-100">
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
            <div className="ml-20 bg-gray-100 mr-20 rounded-lg mb-15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <div key={item._id} className="mb-10 border border-gray-300 bg-white p-6 rounded-lg shadow-md shadow-gray-600 hover:bg-blue-100 transition duration-300">
                            <h2 className="text-xl font-bold text-blue-900">{item.name}</h2>
                            <p className="text-lg flex flex-row"><div className="mr-17">Price:</div> <div className=" text-blue-900 font-semibold">Rs. {item.price}</div></p>
                            <p className="text-lg flex flex-row"><div className="mr-9">Category:</div> <div className="text-blue-900 font-semibold">{item.category}</div></p>
                            <p className="text-lg flex flex-row"><div className="mr-4">Description:</div> <div className="text-blue-900 font-semibold">{item.description}</div></p>
                            <div className="flex justify-center items-center mt-4">
                                <button className="bg-blue-900 text-white px-4 py-2 mr-2 rounded-full shadow-lg hover:bg-blue-800 transition duration-300 cursor-pointer" onClick={()=>handleEditMyItems(item)}>
                                    Edit
                                </button>
                                <button className="bg-blue-900 text-white p-2 ml-2 rounded-full shadow-lg hover:bg-blue-800 transition duration-300 cursor-pointer" onClick={()=>handleRemoveMyItems(item)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 col-span-full">
                        No items to display
                    </div>
                )}
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