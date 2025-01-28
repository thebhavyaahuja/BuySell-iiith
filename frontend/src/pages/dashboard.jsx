import Header from "../Header.jsx";
import { useContext, useState } from 'react';
import { UserContext } from '../UserContext.jsx';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [passwordMode, setPasswordMode] = useState(false);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        age: user?.age || '',
        contactNo: user?.contactNo || '',
    });

    // Local state for the new password when changing
    const [newPassword, setNewPassword] = useState('');

    // Handle text inputs for general profile data
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    // Handle profile updates (excluding password)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put('/update-user', {
                id: user.id,
                ...formData
            });
            setUser({
                ...data,
                id: data._id
            });
            setEditMode(false);
            alert('User information updated successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to update user information!');
        }
    };

    // Handle password changes via separate endpoint
    const changePassword = async () => {
        try {
            await axios.put('/change-password', {
                id: user.id,
                newPassword
            });
            alert('Password changed successfully!');
            setPasswordMode(false);
            setNewPassword('');
        } catch (err) {
            console.error(err);
            alert('Failed to change password!');
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await axios.post('/logout');
            setUser(null);
            alert('Logged out successfully!');
            navigate('/login')
        } catch (err) {
            console.error(err);
            alert('Failed to logout!');
        }
    }

    return (
        <>
            <Header />
            <div className="flex flex-col mt-4 items-center h-screen">
                <h1 className="text-3xl text-blue-900 font-bold mb-6">Welcome to the Dashboard</h1>
                {user && (
                    <div className="mt-2 flex flex-col items-center space-y-3 w-full max-w-sm">
                        {editMode ? (
                            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full">
                                {/* Email (read-only example) */}
                                <div className="flex flex-col space-y-2">
                                    <label className="font-semibold">Email</label>
                                    <p className="bg-gray-200 px-3 py-2 rounded-lg shadow-md">{user.email}</p>
                                </div>

                                {/* First Name */}
                                <div className="flex flex-col space-y-2">
                                    <label className="font-semibold">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="bg-gray-200 px-3 py-2 rounded-lg shadow-md"
                                    />
                                </div>

                                {/* Last Name */}
                                <div className="flex flex-col space-y-2">
                                    <label className="font-semibold">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="bg-gray-200 px-3 py-2 rounded-lg shadow-md"
                                    />
                                </div>

                                {/* Age */}
                                <div className="flex flex-col space-y-2">
                                    <label className="font-semibold">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="bg-gray-200 px-3 py-2 rounded-lg shadow-md"
                                    />
                                </div>

                                {/* Contact No */}
                                <div className="flex flex-col space-y-2">
                                    <label className="font-semibold">Contact No</label>
                                    <input
                                        type="number"
                                        name="contactNo"
                                        value={formData.contactNo}
                                        onChange={handleChange}
                                        className="bg-gray-200 px-3 py-2 rounded-lg shadow-md"
                                    />
                                </div>

                                {/* Save changes to user profile */}
                                <button
                                    type="submit"
                                    className="bg-blue-900 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-800 transition duration-300"
                                >
                                    Save
                                </button>

                                {/* Show password mode button */}
                                {!passwordMode && (
                                    <button
                                        onClick={() => setPasswordMode(true)}
                                        type="button"
                                        className="mb-10 rounded-lg bg-blue-900 text-white px-4 py-2 shadow-md hover:bg-blue-800 transition duration-300"
                                    >
                                        Change Password
                                    </button>
                                )}

                                {/* If password mode is set, show new password input */}
                                {passwordMode && (
                                    <div className="flex flex-col space-y-2">
                                        <label className="font-semibold">New Password</label>
                                        <div className="flex justify-between items-center">
                                            <input
                                                type="password"
                                                value={newPassword}
                                                placeholder="Enter new password"
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="bg-gray-200 px-3 py-2 rounded-lg shadow-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPasswordMode(false);
                                                    setNewPassword('');
                                                }}
                                                className="bg-red-700 text-white px-2 py-2 m-2 rounded-lg shadow-md hover:bg-red-800 transition duration-300"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={changePassword}
                                                className="bg-blue-800 text-sm text-white px-2 py-1 shadow-md rounded-lg hover:bg-blue-800 transition duration-300"
                                            >
                                                Save Password
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        ) : (
                            // Read-only view if not in edit mode
                            <>
                                <div className="flex flex-col space-y-2 w-full">
                                    <label className="font-semibold">Email</label>
                                    <p className="bg-gray-200 px-3 py-2 rounded-lg shadow-md">{user.email}</p>
                                </div>
                                <div className="flex flex-col space-y-2 w-full">
                                    <label className="font-semibold">First Name</label>
                                    <p className="bg-gray-200 px-3 py-2 rounded-lg shadow-md">{user.firstName}</p>
                                </div>
                                <div className="flex flex-col space-y-2 w-full">
                                    <label className="font-semibold">Last Name</label>
                                    <p className="bg-gray-200 px-3 py-2 rounded-lg shadow-md">{user.lastName}</p>
                                </div>
                                <div className="flex flex-col space-y-2 w-full">
                                    <label className="font-semibold">Age</label>
                                    <p className="bg-gray-200 px-3 py-2 rounded-lg shadow-md">{user.age}</p>
                                </div>
                                <div className="flex flex-col space-y-2 w-full">
                                    <label className="font-semibold">Contact No</label>
                                    <p className="bg-gray-200 px-3 py-2 rounded-lg shadow-md">{user.contactNo}</p>
                                </div>
                                <div className="flex flex-row mt-2 justify-center space-x-2 w-full">
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="bg-blue-900 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-800 transition duration-300"
                                    >
                                        Edit Profile
                                    </button>
                                    <button onClick={logout} className="bg-red-600 text-white py-2 px-5 shadow-lg -gray-200 rounded-lg hover:bg-red-500 transition duration-300">Logout</button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}