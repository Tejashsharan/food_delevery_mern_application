import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Customer = () => {
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // const res = await fetch('http://localhost:5000/api/restaurants/', {
        const res = await fetch('http://backend/api/restaurants/', {
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
    }
    fetchData();

  }, []);

  const capitalize = (string) => {
    const strArr = string.split(" ");
    const capitalizedArr = strArr.map((el) => el.charAt(0).toUpperCase() + el.slice(1));
    return capitalizedArr.join(" ");
  };
  

  return (
    <div className='customer'>
      <h1>Restaurants That Deliver To Your Location</h1>
      {pageData ? (
        <section className='rest_list'>
          {pageData.map((rest) => (
            <section
              key={rest._id}
              className='restaurants'
              onClick={() => navigate(`/customer/menu/${rest._id}`)}
            >
              <img className='rest_pic' alt='Restaurant' src={rest.img}/>
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
