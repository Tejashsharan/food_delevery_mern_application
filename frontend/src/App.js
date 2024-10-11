import './App.css';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Signup from './components/Signup';
import Customer from './components/Customer';
import Seller from './components/Seller';
import CustMenu from './components/CustMenu';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/seller" element={<Seller />} />
          <Route path="/customer/menu/:id" element={<CustMenu/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
