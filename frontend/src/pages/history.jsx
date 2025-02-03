import Header from "../Header.jsx";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../UserContext.jsx";
import { useContext } from "react";

export default function HistoryPage() {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [otpMap, setOtpMap] = useState({});
    const [mode, setMode] = useState("pending");

    async function handleGenerateOTP(orderId, sellerEmail) {
        try {
            const res = await axios.post("/orders/generate-otp", {
                buyerEmail: user.email,
                sellerEmail,
                orderId,
            });
            alert("Your OTP: " + res.data.otp);
            setOtpMap((prev) => ({ ...prev, [orderId]: res.data.otp }));
        } catch (err) {
            console.error(err);
            alert("Failed to generate OTP");
        }
    }

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user, mode]);

    async function fetchOrders() {
        try {
            const { data } = await axios.get("/orders/history", {
                params: { email: user.email, mode },
            });
            setOrders(data);
        } catch (err) {
            console.error(err);
        }
    }

    let OrderStatus = "";
    if (mode === "pending") {
        OrderStatus = "Pending Orders";
    } else if (mode === "Bought") {
        OrderStatus = "Items I bought";
    } else {
        OrderStatus = "Items I sold";
    }

    return (
        <>
            <Header />
            <div className="flex justify-center items-center mt-6">
                <button
                    onClick={() => setMode("pending")}
                    className={`px-4 py-2 rounded-md shadow-md mx-2 transition-all duration-300 ${
                        mode === "pending" ? "bg-blue-900 shadow-lg shadow-gray-600 text-white text-lg" : "bg-gray-200 text-md"
                        }`}
                >   Pending
                </button>
                <button
                    onClick={() => setMode("Bought")}
                    className={`px-4 py-2 rounded-md shadow-md mx-2 transition-all duration-300 ${
                        mode === "Bought" ? "bg-blue-900 shadow-lg shadow-gray-600 text-white text-lg" : "bg-gray-200 text-md"
                        }`}
                >   Bought
                </button>
                <button
                    onClick={() => setMode("Sold")}
                    className={`px-4 py-2 rounded-md mx-2 transition-all duration-300 ${
                        mode === "Sold" ? "bg-blue-900 shadow-lg shadow-gray-600 text-white text-lg" : "bg-gray-200 text-md"
                        }`}
                >   Sold
                </button>
            </div>
            <div className="max-w-3xl mb-10 mx-auto p-6 bg-white rounded-lg shadow-lg mt-6 transition-all duration-300">
                <h1 className="text-2xl font-bold text-blue-900 mb-4">{OrderStatus}</h1>
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="p-4 mb-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50 transition-all duration-300"
                    >
                        {mode === "pending" && (
                            <button
                                onClick={() => handleGenerateOTP(order._id, order.sellerEmail)}
                                className="bg-blue-900 mb-2 text-white px-3 py-2 rounded-md shadow-md hover:bg-blue-800 transition-all duration-300"
                            >
                                Generate / Regenerate OTP
                            </button>
                        )}
                        {otpMap[order._id] && (
                            <p className="text-md font-semibold text-blue-700">
                                Last Generated OTP: {otpMap[order._id]}
                            </p>
                        )}
                        <p className="text-lg mb-2 font-semibold">Order ID: {order._id}</p>
                        <p className="text-sm mb-2 text-gray-500">
                            {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p
                            className={`text-md mb-2 font-semibold ${order.status === "Pending" ? "text-red-500" : "text-green-500"
                                }`}
                        >
                            {mode === "pending" ? "Pending" : mode}
                        </p>
                        <p className="text-lg mb-2 font-semibold">Item Details:</p>
                        <table className="w-full mb-4 border-collapse table-auto border border-gray-300 rounded-lg">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-4 py-2 text-left border border-gray-300">Name</th>
                                    <th className="px-4 py-2 text-left border border-gray-300">Price</th>
                                    <th className="px-4 py-2 text-left border border-gray-300">Vendor</th>
                                    <th className="px-4 py-2 text-left border border-gray-300">
                                        Vendor Email
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border px-4 py-2 border-gray-300">
                                        {order.name}
                                    </td>
                                    <td className="border px-4 py-2 border-gray-300">
                                        Rs. {order.price}
                                    </td>
                                    <td className="border px-4 py-2 border-gray-300">
                                        {order.sellerName}
                                    </td>
                                    <td className="border px-4 py-2 border-gray-300">
                                        {order.sellerEmail}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </>
    );
}