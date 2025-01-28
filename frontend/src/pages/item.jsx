import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Header.jsx";
import { useContext } from "react";
import { UserContext } from "../UserContext.jsx";

export default function ItemPage() {
    const { user } = useContext(UserContext);
    const { id } = useParams(); // /search/item/:id
    const [item, setItem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchItem();
    }, [id]);

    async function fetchItem() {
        try {
            const { data } = await axios.get(`/items/${id}`);
            setItem(data);
        } catch (err) {
            console.error(err);
            // If item not found or error, go back
            navigate("/search");
        }
    }

    async function handleAddToCart() {
        console.log(item);
        console.log(user);
        try {
            await axios.post("/cart/add", { itemId: item._id, name: item.name, userEmail: user.email, price: item.price, sellerName: item.sellerName, sellerEmail: item.sellerEmail, description: item.description, category:item.category });
            alert("Item added to cart!");
        } catch (err) {
            console.error(err);
            alert("Failed to add item to cart! (Cannot add same item twice)");
        }
    }

    if (!item) return <div>Loading...</div>;

    return (
        <>
            <Header />
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg shadow-blue-950 mt-6 ml-50 mr-50">
                <h1 className="text-3xl font-bold text-blue-900 mb-4 ml-10">{item.name}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-10">
                    <div>
                    <p className="text-lg flex flex-row"><div className="mr-30">Price:</div> <div className=" text-blue-900 font-semibold">Rs. {item.price}</div></p>
                            <p className="text-lg flex flex-row"><div className="mr-22">Category:</div> <div className="text-blue-900 font-semibold">{item.category}</div></p>
                            <p className="text-lg flex flex-row"><div className="mr-17">Description:</div> <div className="text-blue-900 font-semibold">{item.description}</div></p>
                            <p className="text-lg mb-1 flex flex-row"><div className="mr-26">Vendor:</div> <div className="text-blue-900 font-semibold"> {item.sellerName}</div></p>
                            <p className="text-lg mb-1 flex flex-row"><div className="mr-14">Vendor Email:</div> <div className="text-blue-900 font-semibold"> {item.sellerEmail}</div></p>
                    </div>
                    <div className="flex justify-center items-center">
                        <button
                            onClick={handleAddToCart}
                            className="bg-blue-900 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-800 transition duration-300"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}