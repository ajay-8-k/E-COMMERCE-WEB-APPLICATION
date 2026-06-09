import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const loggedUser = await login(email, password);
      // Redirect based on user role
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/products');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card" style={{ padding: '2.5rem' }}>
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to your ShopEasy account</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            disabled={loading}
          >
            {loading ? (
              'Logging in...'
            ) : (
              <>
                <LogIn size={18} />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>
            Register here
          </Link>
        </p>

        {/* Development Demo Tips panel */}
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '0.75rem 1rem', 
          backgroundColor: '#f8fafc', 
          borderRadius: 'var(--radius-sm)', 
          border: '1px solid var(--border-light)', 
          fontSize: '0.8rem', 
          color: 'var(--text-muted)' 
        }}>
          <p style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.35rem' }}>Quick Access Test Users:</p>
          <p style={{ marginBottom: '0.15rem' }}>• Standard User: <code>user@example.com</code> / <code>user123</code></p>
          <p>• Admin Account: <code>admin@example.com</code> / <code>admin123</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
