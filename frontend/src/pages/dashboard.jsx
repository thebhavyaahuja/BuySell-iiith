import Header from "../Header.jsx";
import { useContext, useState } from 'react';
import { UserContext } from '../UserContext.jsx';
import axios from 'axios';

export default function Dashboard() {
    const { user, setUser } = useContext(UserContext);
    console.log('user', user);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        age: user?.age || '',
        contactNo: user?.contactNo || '',
        password: user?.password || '',
    });

    const handleChange = (e) => {
        console.log('e.target.name', e.target.name);
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('formData', formData);

        // if (!user || !user._id) {
        //     console.error('No user._id found. Cannot update.');
        // }
        // if( user.id){
        //     console.log('user.id',user.id);
        // }

        try {
            const { data } = await axios.put('/update-user', {
                id: user.id,
                ...formData 
            });
            setUser({
                ...data,
                id:data._id
            })
            console.log(data);
            setEditMode(false);
            alert('User information updated successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to update user information!');
        }
    };


    return (
        <>
            <Header />
            <div className="flex flex-col mt-10 items-center h-screen">
                <h1 className="text-2xl text-blue-950 font-bold">Welcome to the Dashboard</h1>
                {user && (
                    <div className="mt-4 flex flex-col items-center space-y-4">
                        {editMode ? (
                            <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                                <div className="flex items-center space-x-2">
                                    <p className='bg-gray-200 px-3 py-1 rounded-lg shadow-md'>Email: {user.email}</p>
                                    {/* <svg onClick={() => setEditMode(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor" className="size-4 mt-1 cursor-pointer hover:text-blue-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.4 4.4 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.4 4.4 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.4 2.125" />
                                    </svg> */}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="bg-gray-200 px-3 py-1 rounded-lg shadow-md"
                                    />
                                    <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-md">Save</button>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="bg-gray-200 px-3 py-1 rounded-lg shadow-md"
                                    />
                                    <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-md">Save</button>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="bg-gray-200 px-3 py-1 rounded-lg shadow-md"
                                    />
                                    <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-md">Save</button>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        name="contactNo"
                                        value={formData.contactNo}
                                        onChange={handleChange}
                                        className="bg-gray-200 px-3 py-1 rounded-lg shadow-md"
                                    />
                                    <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-md">Save</button>
                                </div>
                                <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="bg-gray-200 px-3 py-1 rounded-lg shadow-md"
                                />
                                <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-md">Save</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="flex items-center space-x-2">
                                    <p className='bg-gray-200 px-3 py-1 rounded-lg shadow-md'>Email: {user.email}</p>
                                    {/* <svg onClick={() => setEditMode(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor" className="size-4 mt-1 cursor-pointer hover:text-blue-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.4 4.4 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.4 4.4 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.4 2.125" />
                                    </svg> */}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <p className='bg-gray-200 px-3 py-1 rounded-lg shadow-md'>First Name: {user.firstName}</p>
                                    <svg onClick={() => setEditMode(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor" className="size-4 mt-1 cursor-pointer hover:text-blue-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.4 4.4 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.4 4.4 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.4 2.125" />
                                    </svg>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <p className='bg-gray-200 px-3 py-1 rounded-lg shadow-md'>Last Name: {user.lastName}</p>
                                    <svg onClick={() => setEditMode(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor" className="size-4 mt-1 cursor-pointer hover:text-blue-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.4 4.4 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.4 4.4 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.4 2.125" />
                                    </svg>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <p className='bg-gray-200 px-3 py-1 rounded-lg shadow-md'>Age: {user.age}</p>
                                    <svg onClick={() => setEditMode(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor" className="size-4 mt-1 cursor-pointer hover:text-blue-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.4 4.4 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.4 4.4 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.4 2.125" />
                                    </svg>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <p className='bg-gray-200 px-3 py-1 rounded-lg shadow-md'>Contact No: {user.contactNo}</p>
                                    <svg onClick={() => setEditMode(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor" className="size-4 mt-1 cursor-pointer hover:text-blue-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.4 4.4 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.4 4.4 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.4 2.125" />
                                    </svg>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <p className='bg-gray-200 px-3 py-1 rounded-lg shadow-md'>Password: {user.password}</p>
                                    <svg onClick={() => setEditMode(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor" className="size-4 mt-1 cursor-pointer hover:text-blue-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.4 4.4 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.4 4.4 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.4 2.125" />
                                    </svg>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}