import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const logSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)
      localStorage.setItem("Authorization",data.token)
      localStorage.setItem("role",data.role)
      if(data.role === "customer")
      navigate("/customer");
      else if(data.role === "restaurant")
      navigate("/seller")


    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='loginForm'>
      <form className='log' onSubmit={logSubmit}>
        <h2>LOGIN</h2>
        <input
          type='email'
          required
          className='email'
          value={email}
          placeholder='Username'
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          required
          className='password'
          value={password}
          placeholder='Password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type='submit' value='LOGIN' className='logSub' />
        <p>Forgot Password?</p>
      </form>
    </div>
  );
};

export default Login;
