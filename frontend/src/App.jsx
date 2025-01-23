import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard.jsx';
import LoginPage from './pages/login.jsx';
import RegisterPage from './pages/register.jsx';

function App() {
  return (
  <Routes>
    <Route path='/' element = {<Dashboard />} />
    <Route path='/login' element = {<LoginPage />} />
    <Route path='/register' element = {<RegisterPage />} />
  </Routes>
  );
}

export default App
