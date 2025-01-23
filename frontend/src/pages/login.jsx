import Header from "../Header.jsx";
import { Link } from 'react-router-dom';

export default function LoginPage() {
    return (
        <>
            <Header/>
            <div className="flex items-center justify-center p-12">
                <div className="bg-gray-50 px-6 py-2 rounded-lg shadow-lg shadow-gray-400 max-w-md w-full">
                    <h1 className="text-3xl mb-4 font-bold text-center text-gray-800">Login</h1>
                    <form className="flex flex-col space-y-3">
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Password" />
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