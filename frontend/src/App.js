import './App.css';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Signup from './components/Signup';
import Customer from './components/Customer';
import Seller from './components/Seller';
import CustMenu from './components/CustMenu';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
    <BrowserRouter>

      <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/seller" element={<Seller />} />
          <Route path="/customer/menu/:id" element={<CustMenu/>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

      </Routes>
      
    </BrowserRouter>
    </UserProvider>
  );
}

export default App;
