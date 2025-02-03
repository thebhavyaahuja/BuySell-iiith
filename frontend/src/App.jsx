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
import SupportPage from './pages/support.jsx';
import axios from 'axios';
import ProtectedRoute from './ProtectedRoute.jsx';
import { UserContextProvider } from './UserContext.jsx';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path='/search' element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } />

        <Route path='/deliver' element={
          <ProtectedRoute>
            <DeliverPage />
          </ProtectedRoute>
        } />

        <Route path='/cart' element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        } />

        <Route path='/history' element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        } />

        <Route path='/my-items/add-item' element={
          <ProtectedRoute>
            <AddItemPage />
          </ProtectedRoute>
        } />

        <Route path='/my-items' element={
          <ProtectedRoute>
            <MyItemsPage />
          </ProtectedRoute>
        } />

        <Route path="/search/item/:id" element={
          <ProtectedRoute>
            <ItemPage />
          </ProtectedRoute>
        } />

        <Route path="/support" element={
          <ProtectedRoute>
            <SupportPage />
          </ProtectedRoute>
        } />
      </Routes>
    </UserContextProvider>
  );
}

export default App
