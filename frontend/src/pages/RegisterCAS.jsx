import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function RegisterCAS () {
    const navigate = useNavigate();
    const location = useLocation();
    const email = new URLSearchParams(location.search).get('email');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        contactNo: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/register-cas', { ...formData, email });
            if (response.status === 201) {
                navigate('/search');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Complete your registration</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
                <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
                <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
                <input type="text" name="contactNo" placeholder="Contact Number" onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

