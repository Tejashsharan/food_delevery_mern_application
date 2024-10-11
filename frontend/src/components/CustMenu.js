import React, { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const CustMenu = () => {
    const {id} = useParams();
    const [menuData, setMenuData] = useState(null);
  
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

    return (
    <div>
        
    </div>
  )
}

export default CustMenu
