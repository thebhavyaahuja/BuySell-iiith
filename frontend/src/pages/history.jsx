import Header from "../Header.jsx";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../UserContext.jsx";
import { useContext } from "react";

export default function HistoryPage() {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [otpMap, setOtpMap] = useState({});

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
    }, [user]);

    async function fetchOrders() {
        try {
            const { data } = await axios.get("/orders/history", {
                params: { email: user.email },
            });
            setOrders(data);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <Header />
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
                <h1 className="text-2xl font-bold text-blue-900 mb-4">Order History</h1>
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="p-4 mb-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50"
                    >
                        <button
                            onClick={() => handleGenerateOTP(order._id, order.sellerEmail)}
                            className="bg-blue-900 mb-2 text-white px-3 py-2 rounded-md shadow-md mt-2 hover:bg-blue-800 transition"
                        >
                            Generate / Regenerate OTP
                        </button>
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
                            {order.status}
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