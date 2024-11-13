import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';  // Add this import

const Customer = () => {
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Track search input
  const [searchCategory, setSearchCategory] = useState('cuisine'); // Track selected category
  const { userId } = useUser();
  const [showOrder, setShowOrder] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Initial fetch without search criteria
    fetchData();
  }, []);

  const fetchData = async (searchQuery = '') => {
    try {
      const url = searchQuery 
        ? `http://localhost:5000/api/restaurants?${searchCategory}=${searchQuery}`
        : 'http://localhost:5000/api/restaurants/';
        
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setPageData(data);
        console.log(data);
      } else {
        console.error('Failed to fetch data:', res.statusText);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleSearch = () => {
    fetchData(searchTerm);
  };

  const capitalize = (string) => {
    const strArr = string.split(" ");
    const capitalizedArr = strArr.map((el) => el.charAt(0).toUpperCase() + el.slice(1));
    return capitalizedArr.join(" ");
  };

  const fetchOrder = async () => {
    setShowOrder(!showOrder)
    const res = await fetch(`http://localhost:5000/api/orders/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('Authorization')
      }
    });

    const data = await res.json()
    setOrders(data)
  }

  return (
    <div className='customer'>
      <nav>
        <ul>
          <li className='middle'>
            <svg
              width="40px"
              height="40px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={fetchOrder}
            >
              <path
                d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </li>
          <li>
            <div className="flex justify-center items-center p-4 space-x-4 bg-white rounded-lg">
              <div className="flex bg-gray-100 p-2 w-72 space-x-2 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  className="bg-gray-100 outline-none text-sm text-black"
                  type="text" 
                  placeholder="Search for restaurants..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Dropdown for Category */}
              <div className="flex items-center bg-gray-100 py-2 px-3 rounded-md text-gray-500 font-semibold text-sm space-x-2">
                <select 
                  className="bg-transparent outline-none cursor-pointer"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                >
                  <option value="cuisine">Cuisine</option>
                  <option value="name">Name</option>
                </select>
              </div>

              <div 
                className="bg-blue-600 py-2 px-4 text-white font-semibold rounded-md hover:shadow-md transition duration-300 cursor-pointer text-sm"
                onClick={handleSearch}
              >
                <span>Search</span>
              </div>
            </div>
          </li>
        </ul>
      </nav>

      {!showOrder ? (
        <div>
          <h1>Restaurants That Deliver To Your Location</h1>
          {pageData ? (
            <section className='rest_list'>
              {pageData.map((rest) => (
                <section
                  key={rest._id}
                  className='restaurants'
                  onClick={() => navigate(`/customer/menu/${rest._id}`)}
                >
                  <img className='rest_pic' alt='Restaurant' src={rest.img} />
                  <div className='name'>{capitalize(rest.name)}</div>
                  <div>{capitalize(rest.description)} ● {capitalize(rest.cuisine)}</div>
                  <div>{capitalize(rest.address)}</div>
                </section>
              ))}
            </section>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      ) : (
        <div className='orders'>
          {orders.map((order) => (
            <div key={order._id} className='order'>
              <h4>Restaurant: {order.restaurant.name}</h4>
              <p>Total: ${order.total}</p>
              <p>Status: {order.status}</p>
              <p>Delivery Address: {order.deliveryAddress}</p>
              <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Customer;
