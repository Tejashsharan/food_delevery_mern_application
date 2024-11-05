// ResetPassword.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (password !== confPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to reset password. The link may have expired.');
    }
  };

  return (
    <div className="reset-password">
      <form className='log' onSubmit={handleChangePassword}>
      <h2>Set New Password</h2>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
        />
        <input
          type="password"
          required
          value={confPassword}
          onChange={(e) => setConfPassword(e.target.value)}
          placeholder="Confirm New Password"
        />
        <input className='logSub' type="submit" value='RESET PASSWORD'/>
      </form>
      {message && alert(message)}
    </div>
  );
};

export default ResetPassword;
