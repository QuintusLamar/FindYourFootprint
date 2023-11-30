import React, { useState } from 'react';
import './Login.css'; // Import a CSS file for styling

const Login = ({ setAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("got heree")

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Authentication successful
          setAuthenticated(true);
        } else {
          // Authentication failed
          alert(data.message);
        }
      } else {
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <h2 className="app-title">Find Your Footprint</h2>
      <div className="login-form">
        <h3>Login</h3>
        <label>Username: </label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <br />
        <label>Password: </label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
