import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Customer = () => {
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Track search input
  const [searchCategory, setSearchCategory] = useState('cuisine'); // Track selected category

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

  return (
    <div className='customer'>
      <div className="flex justify-center items-center p-4 space-x-4 bg-white rounded-lg">
        <div className="flex bg-gray-100 p-2 w-72 space-x-2 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            className="bg-gray-100 outline-none text-sm" 
            type="text" 
            placeholder="Article name or keyword..." 
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
  );
};

export default Customer;
