import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { setUser } = useUser();

  // Redirect
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password }),
      });

      const data = await response.json();
    
      // Log response for debugging
      console.log('Response Status:', response.status);
      console.log('Response Data:', data);

      // Store user data for session
      if (response.ok) {
        setUser({ user_id: data.user_id, name: data.name, user_email: data.user_email });
        setMessage('Login successful!');
        // Changed Redirect to dashboard
        navigate('/dashboard'); 
      } else {
        setMessage(data.message || 'Invalid email or password');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-signup-section">
      <div className="login-signup-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <label>
            Email:
            <input
              className="inputBox"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              className="inputBox"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Login</button>
        </form>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Login;

