import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const CustMenu = () => {
  const { id } = useParams();
  const { userId } = useUser();
  const [menuData, setMenuData] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [contain, setContain] = useState(false);
  const [show, setshow] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Track search input
  const [searchCategory, setSearchCategory] = useState('cuisine'); // Track selected category

  const fetchOrder = async () => {
    setShowOrder(!showOrder)
    const res = await fetch(`http://localhost:5000/api/orders/user/${userId}`, {
      // const res = await fetch(`http://backend/api/orders/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('Authorization')
      }
    });

    const data = await res.json()
    setOrders(data)
    console.log(data)
  }

  const handleSearch = async () => {
    try {
      // Construct the API URL with query parameters based on selected category
      const queryParam = searchCategory === 'name' ? `name=${searchTerm}` : `price=${searchTerm}`;
      const res = await fetch(`http://localhost:5000/api/menu/${id}?${queryParam}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (res.ok) {
        const data = await res.json();
        setMenuData(data); // Update menu data with the search results
        console.log(data);
      } else {
        console.error('Failed to fetch data:', res.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:5000/api/menu/${id}`, {
          // const res = await fetch(`http://backend/api/menu/${id}`, {
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

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [id]);


  const capitalize = (string) => {
    const strArr = string.split(' ');
    const capitalizedArr = strArr.map(
      (el) => el.charAt(0).toUpperCase() + el.slice(1)
    );
    return capitalizedArr.join(' ');
  };

  const addedToWishlist = () => {
    setshow(!show)
  };

  const incrementCount = (index) => {
    const newWishlist = [...wishlist];
    newWishlist[index].count += 1;
    setWishlist(newWishlist);
  };

  const decrementCount = (index) => {
    const newWishlist = [...wishlist];
    if (newWishlist[index].count > 1) {
      newWishlist[index].count -= 1;
      setWishlist(newWishlist);
    } else if (newWishlist[index].count === 1) {
      newWishlist.splice(index, 1);
      setWishlist(newWishlist);
      setContain(false)
      setshow(!show)
    }
  };

  const findTotal = () => {
    let total = 0;
    wishlist.forEach((el) => {
      total += el.price * el.count;
    });
    return total;
  };

  const onclickAdd = (el) => {
    setContain(true);
    const itemIndex = wishlist.findIndex((item) => item.id === el.id);

    if (itemIndex === -1) {
      setWishlist([...wishlist, { ...el, count: 1 }]);
    } else {
      const updatedWishlist = wishlist.map((item, index) =>
        index === itemIndex ? { ...item, count: item.count + 1 } : item
      );
      setWishlist(updatedWishlist);
    }
  }

  const setItem = () => {
    return wishlist.map((el) => el._id);
  }

  const createOrder = async () => {
    try {
      // console.log(id)
      const res = await fetch(`http://localhost:5000/api/orders/`, {
        // const res = await fetch(`http://backend/api/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('Authorization')
        },
        body: JSON.stringify({
          "restaurantId": id,
          "items": setItem(),
          "total": findTotal(),
          "deliveryAddress": "sector v"
        })
      });

      if (res.ok) {
        const data = await res.json();
        // setMenuData(data);
        console.log(data);
      } else {
        console.error('Failed to fetch data:', res.statusText);
      }
    } catch (error) {
      console.log('error', error);
    }

  }

  const handleOnPayment = async () => {
    const totalAmount = findTotal();
    const options = {
      key: "rzp_test_3kpqqSprgwKALf",
      amount: totalAmount * 100,
      currency: 'INR',
      name: 'Soogy',
      description: 'Test Transaction',
      image: 'https://th.bing.com/th/id/OIP.U1ZtX4lXEykkThHB9JU_bgAAAA?rs=1&pid=ImgDetMain',  // Your logo/image
      handler: function (response) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        console.log(response);
      },
      prefill: {
        email: 'ritukumarisid@gmail.com',
        contact: '6205919253'
      },
      notes: {
        address: 'Your address'
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on('payment.failed', function (response) {
      alert(`Payment Failed! Error: ${response.error.description}`);
      console.error(response.error);
    });

    setshow(!show)
    createOrder()
  };


  return (
    <>
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
                  <option value="price">Price</option>
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
          <li className='middle'>
            <svg
              version="1.0"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="40px"
              height="40px"
              viewBox="0 0 64 64"
              enableBackground="new 0 0 64 64"
              xmlSpace="preserve"
              onClick={addedToWishlist}
            >
              <g>
                <path fill={contain ? "blue" : "#231F20"} d="M8,60c0,2.211,1.789,4,4,4h40c2.211,0,4-1.789,4-4v-2H8V60z" />
                <path fill={contain ? "blue" : "#231F20"} d="M36,36c-0.553,0-1.053,0.224-1.414,0.586l-1.879,1.871c-0.391,0.391-1.023,0.391-1.414,0l-1.879-1.871
          C29.053,36.224,28.553,36,28,36c-1.104,0-2,0.896-2,2c0,0.553,0.481,1.076,0.844,1.438L32,44.594l5.156-5.156
          C37.519,39.076,38,38.553,38,38C38,36.896,37.104,36,36,36z"/>
                <path fill={contain ? "blue" : "#231F20"} d="M54,20H44v-8c0-6.627-5.373-12-12-12S20,5.373,20,12v8H10c-1.105,0-2,0.895-2,2v34h48V22
          C56,20.895,55.105,20,54,20z M38.547,40.875l-5.84,5.841c-0.391,0.391-1.023,0.391-1.414,0l-5.855-5.856
          C24.713,40.136,24,39.104,24,38c0-2.209,1.791-4,4-4c1.104,0,2.104,0.448,2.828,1.172L32,36.336l1.172-1.164
          C33.896,34.448,34.896,34,36,34c2.209,0,4,1.791,4,4C40,39.104,39.271,40.151,38.547,40.875z M26,20v-8c0-3.313,2.687-6,6-6
          s6,2.687,6,6v8H26z M42,23c0,0.553-0.447,1-1,1s-1-0.447-1-1V12c0-4.418-3.582-8-8-8s-8,3.582-8,8v11c0,0.553-0.447,1-1,1
          s-1-0.447-1-1V12c0-5.522,4.478-10,10-10s10,4.478,10,10V23z"/>
              </g>
            </svg>
          </li>
        </ul>
      </nav>

      {!showOrder ? <div className="menu">
        <span>Recommended Menu Items</span>
        <div className="items">
          {menuData.length > 0 ? (
            menuData.map((el, index) => (
              <div className="item" key={index}>
                <div className="properties">
                  <div className="name">{capitalize(el.name)}</div>
                  <div className="price">₹{el.price}</div>
                  <div className="desc">{capitalize(el.description)}</div>
                </div>
                <div className="add_food">
                  <img alt="food_image" src={el.img} />
                  <div className="add" onClick={() => onclickAdd(el)}>Add +</div>
                </div>
              </div>
            ))
          ) : (
            <p>No menu items available</p>
          )}
        </div>
        <div className={show ? 'wishlist' : 'hide'}>
          <h1>Wish list</h1>
          {wishlist.map((item, index) => {
            return <div className='wishitem'>
              <div className='wishitem_desc'>
                {capitalize(item.name)}
              </div>
              <div className='wishitem_count'>
                <div className='increment_count' onClick={() => incrementCount(index)}>+</div>
                {item.count}
                <div className='decrement_count' onClick={() => decrementCount(index)}>–</div>
              </div>
              <div className='wishitem_price'>
                ₹{item.price * item.count}
              </div>
            </div>
          })}
          <h4>Total: ₹{findTotal()}</h4>
          <div className='payButton' onClick={handleOnPayment}>Pay ₹{findTotal()}</div>

        </div>
      </div> :
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
      }
    </>
  );
};

export default CustMenu;
