import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { API_ENDPOINTS } from '../config/api';
import '../styles/pages/LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const { isLoading, error, post, get } = useApi();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      setFormError('');
      const response = await post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      if (response?.data?.token) {
        // Save token 
        login(response.data.token, { email });
        
        // fetch from /protected 
        const userResponse = await get(API_ENDPOINTS.PROTECTED);
        if (userResponse?.data) {
          login(response.data.token, userResponse.data);
        }
        
        navigate('/dashboard', { replace: true });
      } else {
        setFormError('Login failed: No token received');
      }
    } catch (err) {
      setFormError(err.message || 'Login failed. Please try again.');
    }
  };

  // Show loading state
  if (authLoading) {
    return <div className="login-page"><div className="loading">Loading...</div></div>;
  }

  // User login
  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Contract Management</h1>
        <p className="subtitle">Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
                <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isLoading}
                autoComplete="email"
                />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
                <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete="current-password"
                />
          </div>

          {(formError || error) && (
            <div className="error-message">{formError || error}</div>
          )}

          <button type="submit" disabled={isLoading} className="btn-submit">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}