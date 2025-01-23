import logo from './assets/iiit-logo.png';

export default function Header(){
    return (
        <>
            <header className="bg-gray-200 p-2 flex items-center">
                <img src={logo} className='h-14' alt="logo" />
                <h1 className="text-xl font-bold text-blue-950 ml-80">Buy Sell @iiith</h1>
                <nav className="ml-auto border border-gray-400 py-2 px-5 rounded-full shadow-md shadow-gray-400 gap">
                    <a href="#" className="text-blue-950 ml-3 mr-7">Search</a>
                    <a href="#" className="text-blue-950 mr-6">Deliver</a>
                    <a href="#" className="text-blue-950 mr-6">My Cart</a>
                    <a href="#" className="text-blue-950 mr-6">History</a>
                    <a href="#" className="text-blue-950 mr-3">Dashboard</a>
                </nav>
            </header>
            <main className="p-4">
            </main>
        </>
    )
}