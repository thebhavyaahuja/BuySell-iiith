import Header from "../Header.jsx";
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const registerUser = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/register', {
                firstName: firstName,
                lastName: lastName,
                email: email,
                age: age,
                contactNo: contactNo,
                password: password
            });
            alert('You\'ve registered successfully! Please login to continue.');
            navigate('/login');
        } catch (e) {
            if (e.response && e.response.data && e.response.data.errors) {
                console.log(e.response.data.errors.email.message);
                setError(e.response.data.errors.email.message);
                alert(e.response.data.errors.email.message);
            }  else if (e.response && e.response.data && e.response.data.code === 11000) {
                const errorMsg = 'Email already exists. Please use a different email.';
                setError(errorMsg);
                alert(errorMsg);
            }else {
                setError('Failed to register user!');
                alert('Failed to register user!');
            }
            console.error(e);
        }
    };
    return (
        <>
            <div className="flex justify-center mt-10 mb-10 text-blue-950 text-4xl font-bold">Buy Sell @ iiith</div>
            <div className="flex items-center justify-center p-3">
                <div className="bg-gray-50 px-6 py-2 rounded-lg shadow-lg shadow-gray-400 max-w-md w-full">
                    <h1 className="text-3xl mb-4 font-bold text-center text-gray-800">Register</h1>
                    <form className="flex flex-col space-y-3" onSubmit={registerUser}>
                    <div className="flex space-x-3">
                        <input type="text" placeholder="First Name" 
                            value={firstName} 
                            onChange={event => setFirstName(event.target.value)} />
                        <input type="text" placeholder="Last Name"
                            value={lastName} 
                            onChange={event => setLastName(event.target.value)} />
                    </div>
                    <input type="email" placeholder="Email"
                        value={email}
                        onChange={event => setEmail(event.target.value)} />
                    <div className="flex space-x-3">
                        <input type="number" placeholder="Age"
                            value={age}
                            onChange={event => setAge(event.target.value)} />
                        <input type="number" placeholder="Contact No."
                            value={contactNo}
                            onChange={event => setContactNo(event.target.value)} />
                    </div>
                    <input type="password" placeholder="Password"
                        value={password}
                        onChange={event => setPassword(event.target.value)} />
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Register</button>
                    </form>
                    <div className="text-center text-sm py-2">
                        Already a user? <Link to={'/login'} className="underline text-blue-900">Login</Link>
                    </div>
                </div>
            </div>
        </>
    );
}