import Header from "../Header.jsx";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext.jsx";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            fetchItems();
        }
    }, [user, navigate]);

    async function fetchItems() {
        try {
            const { data } = await axios.get("/search", {
                params: { email: user.email },
            });
            setItems(data);
        } catch (err) {
            console.error(err);
        }
    }

    const handleCategoryChange = (category) => {
        setSelectedCategories((prevCategories) =>
            prevCategories.includes(category)
                ? prevCategories.filter((c) => c !== category)
                : [...prevCategories, category]
        );
    };

    const filteredItems = items.filter((item) => {
        const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategories.length === 0 || selectedCategories.includes(item.category);
        return matchesSearchTerm && matchesCategory;
    });

    return (
        <>
            <Header />
            <div className="flex items-center p-6 bg-gray-100">
                <h1 className="ml-20 mr-10 text-3xl text-blue-900 font-bold">
                    Search Products You Want to Buy
                </h1>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border h-10 border-gray-300 rounded-lg px-4 mr-2 w-64"
                />
                <button className="text-sm shadow-lg bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition duration-300">
                    Search
                </button>
            </div>
            <div className="flex p-6 bg-gray-100">
                {/* Sidebar for categories */}
                <div className="w-1/4 p-4 bg-white rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-blue-900 mb-4">Filter by Category</h2>
                    <div className="grid gap-1">
                        {[
                            "electronics",
                            "fashion",
                            "toys",
                            "digital services",
                            "cosmetics and body care",
                            "food and beverage",
                            "furniture and decor",
                            "health and wellness",
                            "household items",
                            "media",
                            "pet care",
                            "office equipment",
                            "other",
                        ].map((category) => (
                            <label 
                                key={category} 
                                className="flex items-center space-x-3 py-1 hover:bg-gray-50 rounded-lg transition duration-200"
                            >
                                <input
                                    type="checkbox"
                                    value={category}
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                    className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="text-gray-800 font-medium text-sm">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                            </label>
                        ))}
                    </div>

                </div>
                {/* Item grid */}
                <div className="w-3/4 h-10 ml-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                            <div className="border border-gray-300 bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-blue-50 transition duration-300 cursor-pointer">
                            <Link to={`/search/item/${item._id}`} key={item._id}>

                                <h2 className="text-xl font-bold text-blue-900 mb-2">{item.name}</h2>
                                <div className="text-gray-700">
                                    <p className="text-lg">
                                        <strong>Price:</strong> Rs. {item.price}
                                    </p>
                                    <p className="text-lg">
                                        <strong>Category:</strong> {item.category}
                                    </p>
                                    <p className="text-lg">
                                        <strong>Description:</strong> {item.description}
                                    </p>
                                    <p className="text-lg">
                                        <strong>Vendor:</strong> {item.sellerName}
                                    </p>
                                </div>
                            </Link>
                            </div>
                    ))}
                </div>
            </div>
        </>
    );
}
