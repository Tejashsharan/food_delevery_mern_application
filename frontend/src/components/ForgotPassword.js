// ForgotPassword.js
import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to send password reset link.');
    }
  };

  return (
    <div className="forgot-password">
      <form className='log' onSubmit={handlePasswordReset}>
      <h2>Forgot Password</h2>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <input className='logSub' type="submit" value='SEND MAIL'/>
      </form>
      {message && alert(message)}
    </div>
  );
};

export default ForgotPassword;
