import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard.jsx';
import LoginPage from './pages/login.jsx';
import RegisterPage from './pages/register.jsx';
import SearchPage from './pages/search.jsx';
import DeliverPage from './pages/deliver.jsx';
import CartPage from './pages/cart.jsx';
import HistoryPage from './pages/history.jsx';
import AddItemPage from './pages/add-items.jsx';
import MyItemsPage from './pages/my-items.jsx';
import ItemPage from './pages/item.jsx';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

function App() {
  return (
  <Routes>
    <Route path='/' element = {<LoginPage />} />
    <Route path='/dashboard' element = {<Dashboard />} />
    <Route path='/login' element = {<LoginPage />} />
    <Route path='/register' element = {<RegisterPage />} />
    <Route path='/search' element = {<SearchPage />} />
    <Route path='/deliver' element = {<DeliverPage />} />
    <Route path='/cart' element = {<CartPage />} />
    <Route path='/history' element = {<HistoryPage />} />
    <Route path='/my-items/add-item' element = {<AddItemPage />} />
    <Route path='/my-items' element = {<MyItemsPage />} />
    <Route path="/search/item/:id" element={<ItemPage />} />

    {/* <Route path="/items" element={<SearchItems />} /> */}
    {/* <Route path="/items/:id" element={<ItemPage />} /> */}
  </Routes>
  );
}

export default App
