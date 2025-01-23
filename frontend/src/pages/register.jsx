import Header from "../Header.jsx";
import { Link } from 'react-router-dom';

export default function RegisterPage() {
    return (
        <>
            <Header/>
            <div className="flex items-center justify-center p-3">
                <div className="bg-gray-50 px-6 py-2 rounded-lg shadow-lg shadow-gray-400 max-w-md w-full">
                    <h1 className="text-3xl mb-4 font-bold text-center text-gray-800">Register</h1>
                    <form className="flex flex-col space-y-3">
                        <div className="flex space-x-3">
                            <input type="text" placeholder="First Name" />
                            <input type="text" placeholder="Last Name" />
                        </div>
                        <input type="email" placeholder="Email" />
                        <div className="flex space-x-3">
                            <input type="text" placeholder="Age" />
                            <input type="text" placeholder="Contact No." />
                        </div>
                        <input type="password" placeholder="Password" />
                        <button type="submit">Register</button>
                    </form>
                    <div className="text-center text-sm py-2">
                        Already a user? <Link to={'/login'} className="underline text-blue-900">Login</Link>
                    </div>
                </div>
            </div>
        </>
    );
}