import logo from './assets/iiit-logo.png';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './UserContext.jsx';

export default function Header() {
    const { user } = useContext(UserContext);

    const dashboardLink = user ? '/dashboard' : '/login';
    const searchLink = user ? '/search' : '/login';
    const deliverLink = user ? '/deliver' : '/login';
    const cartLink = user ? '/cart' : '/login';
    const historyLink = user ? '/history' : '/login';
    const MyItemsLink = user ? '/my-items' : '/login';
    const SupportLink = user ? '/support' : '/login';

    const handleThis = () => {
        if (!user) {
            alert('Please login to continue');
        }
    };

    return (
        <>
            <header className="bg-gray-200 p-4 flex items-center shadow-lg">
                <img src={logo} className="h-14" alt="logo" />
                <h1 className="text-2xl font-bold text-blue-900 ml-10">Buy Sell @iiith</h1>
                <nav className="ml-14 flex space-x-6">
                    <Link to={searchLink} className="px-4 py-2 rounded-full shadow-md shadow-gray-500 mx-2 transition-all duration-300 hover:bg-blue-950 hover:text-white" onClick={handleThis}>Search</Link>
                    <Link to={MyItemsLink} className="px-4 py-2 rounded-full shadow-md shadow-gray-500 mx-2 transition-all duration-300 hover:bg-blue-950 hover:text-white" onClick={handleThis}>My Items</Link>
                    <Link to={cartLink} className="px-4 py-2 rounded-full shadow-md shadow-gray-500 mx-2 transition-all duration-300 hover:bg-blue-950 hover:text-white" onClick={handleThis}>My Cart</Link>
                    <Link to={historyLink} className="px-4 py-2 rounded-full shadow-md shadow-gray-500 mx-2 transition-all duration-300 hover:bg-blue-950 hover:text-white " onClick={handleThis}>History</Link>
                    <Link to={deliverLink} className="px-4 py-2 rounded-full shadow-md shadow-gray-500 mx-2 transition-all duration-300 hover:bg-blue-950 hover:text-white" onClick={handleThis}>Deliver</Link>
                    <Link to={dashboardLink} className="px-4 py-2 rounded-full shadow-md shadow-gray-500 mx-2 transition-all duration-300 hover:bg-blue-950 hover:text-white" onClick={handleThis}>Dashboard</Link>
                    <Link to={SupportLink} className="px-4 py-2 rounded-full shadow-md shadow-gray-500 mx-2 transition-all duration-300 hover:bg-blue-950 hover:text-white" onClick={handleThis}>Support</Link>
                </nav>
                <div className="ml-auto text-white bg-blue-900 px-4 py-2 rounded-full shadow-md shadow-gray-500 hover:bg-blue-950 transition">
                    {user ? (
                        <Link to="/dashboard">{user.firstName}</Link>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            </header>
            <main className="p-4">
            </main>
        </>
    );
}