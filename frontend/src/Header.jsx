import logo from './assets/iiit-logo.png';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './UserContext.jsx'

export default function Header(){
    const { user } = useContext(UserContext);

    const dashboardLink = user ? '/dashboard' : '/login';
    const searchLink = user ? '/search' : '/login';
    const deliverLink = user ? '/deliver' : '/login';
    const cartLink = user ? '/cart' : '/login';
    const historyLink = user ? '/history' : '/login';
    const MyItemsLink = user ? '/my-items' : '/login';

    const handleThis = () => {
        if (!user) {
            alert('Please login to continue');
        }
    }

    return (
        <>
            <header className="bg-gray-200 p-2 flex items-center">
                <img src={logo} className='h-14' alt="logo" />
                <h1 className="text-xl font-bold text-blue-950 ml-60">Buy Sell @iiith</h1>
                <nav className="ml-10 border border-gray-400 py-2 px-5 rounded-full shadow-md shadow-gray-400 gap">
                    <Link to={searchLink} className="text-blue-950 ml-3 mr-7" onClick={handleThis}>Search</Link>
                    <Link to={deliverLink} className="text-blue-950 mr-6" onClick={handleThis}>Deliver</Link>
                    <Link to={cartLink} className="text-blue-950 mr-6" onClick={handleThis}>My Cart</Link>
                    <Link to={historyLink} className="text-blue-950 mr-6" onClick={handleThis}>History</Link>
                    <Link to={MyItemsLink} className="text-blue-950 mr-6" onClick={handleThis}>My Items</Link>
                    <Link to={dashboardLink} className="text-blue-950 mr-3" onClick={handleThis}>Dashboard</Link>
                </nav>
                <div className="ml-auto text-white bg-blue-950 px-4 py-2 rounded-full shadow-md shadow-gray-500">
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
    )
}