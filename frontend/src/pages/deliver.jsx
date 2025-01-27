import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext.jsx';
import { useContext } from 'react';
import Header from '../Header.jsx';

export default function DeliverPage() {
    const { user } = useContext(UserContext);
    const [deliveries, setDeliveries] = useState([]);
    const [otpInputs, setOtpInputs] = useState({});

    useEffect(() => {
        if (user) {
            fetchDeliveries();
        }
    }, [user]);

    async function fetchDeliveries() {
        try {
            const { data } = await axios.get('/orders/deliveries', {
                params: { email: user.email }
            });
            setDeliveries(data);
        } catch (err) {
            console.error(err);
        }
    }

    function handleOtpChange(orderId, value) {
        setOtpInputs(prev => ({ ...prev, [orderId]: value }));
    }

    async function markOrderAsDelivered(orderId) {
        try {
            await axios.put('/orders/mark-delivered', {
                orderId
            });
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDelivery(orderId, buyerEmail) {
        const enteredOtp = otpInputs[orderId] || '';
        if (!enteredOtp.trim()) {
            alert('Please enter an OTP.');
            return;
        }
        try {
            await axios.post('/orders/complete-delivery', {
                sellerEmail: user.email,
                buyerEmail,
                orderId,
                otp: enteredOtp
            });
            alert('Delivery marked as completed!');
            markOrderAsDelivered(orderId);
            setDeliveries(prev => prev.filter(o => o._id !== orderId));
        } catch (err) {
            console.log(err.response.data.message); 
            alert(err.response.data.message); 
            // alert('Failed to complete delivery!');
        }
    }

    return (
        <>
            <Header />
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
                <h1 className="text-2xl font-bold text-blue-900 mb-4">Deliveries</h1>
                {deliveries.map(order => (
                    <div
                        key={order._id}
                        className="p-4 mb-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50"
                    >
                        <p className="text-lg mb-2 font-semibold">Order ID: {order._id}</p>
                        <p className="text-sm mb-2 text-gray-500">
                            {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p
                            className={`text-md mb-2 font-semibold ${
                                order.status === 'Pending' ? 'text-red-500' : 'text-green-500'
                            }`}
                        >
                            {order.status}
                        </p>
                        <p className="text-lg mb-2 font-semibold">Item Details:</p>
                        <table className="w-full mb-4 border-collapse table-auto border border-gray-300 rounded-lg">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-4 py-2 text-left border border-gray-300">Item Name</th>
                                    <th className="px-4 py-2 text-left border border-gray-300">Price</th>
                                    <th className="px-4 py-2 text-left border border-gray-300">Buyer Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border px-4 py-2 border-gray-300">{order.name}</td>
                                    <td className="border px-4 py-2 border-gray-300">
                                        Rs. {order.price}
                                    </td>
                                    <td className="border px-4 py-2 border-gray-300">
                                        {order.userEmail}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <label className="block mb-2 font-semibold">
                            Enter OTP to mark as delivered:
                        </label>
                        <input
                            type="text"
                            value={otpInputs[order._id] || ''}
                            onChange={e => handleOtpChange(order._id, e.target.value)}
                            className="border rounded px-2 py-1 mb-2 w-64"
                        />
                        <button
                            onClick={() => handleDelivery(order._id, order.userEmail)}
                            className="bg-blue-900 text-white px-3 py-2 rounded-md hover:bg-blue-800 transition"
                        >
                            Submit
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}