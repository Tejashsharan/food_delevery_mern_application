import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CustMenu = () => {
  const { id } = useParams();
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:5000/api/menu/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setMenuData(data); 
          console.log(data);
        } else {
          console.error('Failed to fetch data:', res.statusText);
        }
      } catch (error) {
        console.log('error', error);
      }
    }
    fetchData();
  }, [id]);

  const capitalize = (string) => {
    const strArr = string.split(" ");
    const capitalizedArr = strArr.map((el) => el.charAt(0).toUpperCase() + el.slice(1));
    return capitalizedArr.join(" ");
  };

  return (
    <div className="menu">
      <span>Recommended Menu Items</span>
      <div className="items">
        {menuData.length > 0 ? (
          menuData.map((el, index) => (
            <div className="item" key={index}>
              <div className='properties'>
                <div className="name">{capitalize(el.name)}</div>
                <div className="price">{el.price}</div>
                <div className="desc">{capitalize(el.description)}</div>
              </div>
              <div className='add_food'>
                <img alt='food_image' src={el.img}/>
                <div className='add'>Add +</div>
              </div>
            </div>
          ))
        ) : (
          <p>No menu items available</p>
        )}
      </div>
    </div>
  );
};

export default CustMenu;
