import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Header.jsx";
import { UserContext } from "../UserContext.jsx";

export default function ItemPage() {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [vendor, setVendor] = useState(null);
    const [newRating, setNewRating] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchItem();
    }, [id]);

    useEffect(() => {
        if (item && item.sellerEmail) {
            fetchVendor(item.sellerEmail);
        }
    }, [item]);

    async function fetchItem() {
        try {
            const { data } = await axios.get(`/items/${id}`);
            setItem(data);
        } catch (err) {
            console.error(err);
            navigate("/search");
        }
    }

    async function fetchVendor(vendorEmail) {
        try {
            const { data } = await axios.get(`/users/${vendorEmail}`);
            setVendor(data);
        } catch (err) {
            console.error(err);
        }
    }

    // Convert numeric rating to star symbols
    function renderStars(rating) {
        const fullStars = Math.floor(rating) || 0;
        // e.g. if rating=4.2, it prints "★★★★"
        return '★'.repeat(fullStars);
    }

    async function handleAddToCart() {
        if (!user) return;
        try {
            await axios.post("/cart/add", {
                itemId: item._id,
                name: item.name,
                userEmail: user.email,
                price: item.price,
                sellerName: item.sellerName,
                sellerEmail: item.sellerEmail,
                description: item.description,
                category: item.category
            });
            alert("Item added to cart!");
        } catch (err) {
            console.error(err);
            alert(err.response.data.message);
            alert("Failed to add item to cart!");
        }
    }

    async function handleUpdateRating() {
        if (!user || !vendor) return;
        const ratingValue = Number(newRating);
        try {
            const { data } = await axios.put("/users/update-rating", {
                vendorEmail: vendor.email,
                raterEmail: user.email,
                newRating: ratingValue
            });
            alert(data.message);
            setVendor({
                ...vendor,
                sellerRating: data.sellerRating,
                ratingCount: data.ratingCount
            });
            setNewRating("");
        } catch (err) {
            console.error(err);
            alert("Failed to update rating");
        }
    }

    if (!item) return <div>Loading...</div>;

    return (
        <>
            <Header />
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6 ml-50 mr-50">
                <h1 className="text-3xl font-bold text-blue-900 mb-4 ml-10">{item.name}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-10">
                    <div>
                        <p className="text-lg"><strong>Price: </strong>Rs. {item.price}</p>
                        <p className="text-lg"><strong>Category: </strong>{item.category}</p>
                        <p className="text-lg"><strong>Description: </strong>{item.description}</p>
                        <p className="text-lg"><strong>Vendor: </strong>{item.sellerName}</p>
                        <p className="text-lg"><strong>Vendor Email: </strong>{item.sellerEmail}</p>

                        {vendor && (
                            <p className="text-lg">
                                <strong>Rate {item.sellerName}: </strong>
                                <span className="text-yellow-500">
                                    {renderStars(vendor.sellerRating)}
                                </span>{" "}
                                ({vendor.sellerRating.toFixed(1)}
                                {vendor.ratingCount ? ` / ${vendor.ratingCount} votes` : ""})
                            </p>
                        )}

                        {/* Everyone except the vendor can update rating. 
                            If you want only non-vendors to rate, check user.email !== item.sellerEmail 
                            or remove condition if vendor can update their rating. */}
                        {user && user.email !== item.sellerEmail && (
                            <div className="mt-4 flex items-center">
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    placeholder="New rating (1-5)"
                                    value={newRating}
                                    onChange={(e) => setNewRating(e.target.value)}
                                    className="border p-1 mr-2 w-20"
                                />
                                <button
                                    onClick={handleUpdateRating}
                                    className="bg-blue-900 w-60 py-2 rounded-lg cursor-pointer hover:bg-blue-800 transition duration-300 shadow-lg shadow-gray-300 text-white px-3 py-1 rounded"
                                >
                                    Submit Rating
                                </button>
                            </div>
                        )}
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