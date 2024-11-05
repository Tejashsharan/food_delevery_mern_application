import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { setUserId } = useUser();

  useEffect(() => {
    // Initialize Google Sign-In
    window.google.accounts.id.initialize({
      client_id: "683796734610-eirh97r9fmlkii1f7ch4cvtkcfnh0fmd.apps.googleusercontent.com",
      callback: handleGoogleResponse,
    });

    // Render the Google Sign-In button
    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInButton"),
      { theme: "outline", size: "large" } // Customize button style
    );
  }, []);

  // Handle Google Login Response
  const handleGoogleResponse = async (response) => {
    const tokenId = response.credential;

    try {
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: tokenId }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("Authorization", data.token);
        localStorage.setItem("role","customer")
        navigate("/customer"); // Redirect based on your app’s route
      } else {
        setErrorMessage("Google Login Failed.");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      setErrorMessage("Google Login Failed.");
    }
  };

  const logSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      localStorage.setItem("Authorization", data.token);
      localStorage.setItem("role", data.role);
      
      console.log(data.userId)
      setUserId(data.userId);

      setTimeout(() => {
        navigate(data.role === "customer" ? "/customer" : "/seller");
      }, 100);
      } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className='loginForm'>
      <form className='log' onSubmit={logSubmit}>
        <h2>LOGIN</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <input
          type='email'
          required
          className='email'
          value={email}
          placeholder='Email'
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
        <p onClick={() => navigate('/forgot-password')} style={{ cursor: 'pointer'}}>
          Forgot Password?
        </p>
        <div id="googleSignInButton"></div> {/* Google Sign-In button */}
      </form>
    </div>
  );
};

export default Login;
