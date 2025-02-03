import Header from "../Header.jsx";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext.jsx";

export default function SearchPage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [vendors, setVendors] = useState([]); // List of possible vendors
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedVendor, setSelectedVendor] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            fetchItems();
            fetchVendors();
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

    // Fetch list of other vendors (excluding current user)
    async function fetchVendors() {
        try {
            const { data } = await axios.get("/users");
            // Exclude the current user from the vendor dropdown
            const otherUsers = data.filter((usr) => usr.email !== user.email);
            setVendors(otherUsers);
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

    // Filter based on searchTerm, category, min/max price, and vendor
    const filteredItems = items.filter((item) => {
        const nameMatches = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatches =
            selectedCategories.length === 0 || selectedCategories.includes(item.category);
        const priceMatches =
            (minPrice === "" || item.price >= parseFloat(minPrice)) &&
            (maxPrice === "" || item.price <= parseFloat(maxPrice));
        const vendorMatches =
            !selectedVendor || selectedVendor === "" || item.sellerName === selectedVendor;
        return nameMatches && categoryMatches && priceMatches && vendorMatches;
    });

    return (
        <>
            <Header />
            {/* Search input */}
            <div className="flex ml-10 mb-10 mr-10 rounded-full items-center p-6 bg-gray-100">
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

            {/* Filters */}
            <div className="flex p-6 ml-10 mb-10 rounded-full mr-10 bg-blue-100 pb-20">
                {/* Sidebar for categories & additional filters */}
                <div className="w-1/5 p-4 bg-white rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-blue-900 mb-4">Filter by Category</h2>
                    <div className="grid gap-1 mb-6">
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
                                className="flex space-x-2 gap-10 py-1 hover:bg-gray-50 rounded-lg transition duration-200"
                            >
                                <input
                                    id="default-checkbox"
                                    type="checkbox"
                                    value={category}
                                    style={{width:"15px" }}
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <span className="text-gray-800 font-medium text-sm">
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </span>
                            </label>
                        ))}
                    </div>

                    {/* Price Filter */}
                    <h2 className="text-xl font-bold text-blue-900 mb-2">Filter by Price</h2>
                    <div className="flex flex-col space-y-2 mb-6">
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="border border-gray-300 rounded-lg px-2 py-1"
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="border border-gray-300 rounded-lg px-2 py-1"
                        />
                    </div>

                    {/* Vendor Filter */}
                        {/* <h2 className="text-xl font-bold text-blue-900 mb-2">Filter by Vendor</h2>
                        <select
                            value={selectedVendor}
                            onChange={(e) => setSelectedVendor(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-2 py-1"
                        >
                            <option value=''>All Vendors</option>
                            {vendors.map((vendor) => (
                                <option
                                key={vendor._id}
                                value={vendor.firstName + " " + vendor.lastName}
                            >
                                {vendor.firstName} {vendor.lastName}
                            </option>
                            ))}
                        </select> */}
                </div>

                {/* Item Grid */}
                <div className="w-3/4 h-10 ml-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <div
                            key={item._id}
                            className="border border-gray-300 bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-blue-50 transition duration-300 cursor-pointer"
                        >
                            <Link to={`/search/item/${item._id}`}>
                                <h2 className="text-xl font-bold text-blue-900 mb-2">
                                    {item.name}
                                </h2>
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