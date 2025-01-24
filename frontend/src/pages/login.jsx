import Header from "../Header.jsx";
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            await axios.post('/login', {email, password});  
            alert('Login successful!');
        } catch (e) {
            console.error(e);
            alert('Failed to login!');
        }
    } 

    return (
        <>
            <Header/>
            <div className="flex items-center justify-center p-12">
                <div className="bg-gray-50 px-6 py-2 rounded-lg shadow-lg shadow-gray-400 max-w-md w-full">
                    <h1 className="text-3xl mb-4 font-bold text-center text-gray-800">Login</h1>
                    <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
                        <input type="email" placeholder="Email" value={email} onChange={event=>setEmail(event.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={event=>setPassword(event.target.value)}/>
                        <button type="submit">Login</button>
                    </form>
                    <div className="text-center text-sm py-2">
                        Don't have an account yet? <Link to={'/register'} className="underline text-blue-900">Register</Link>
                    </div>
                </div>
            </div>
        </>
    );
}