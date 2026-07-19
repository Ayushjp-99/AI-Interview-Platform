import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { BiBrain } from 'react-icons/bi';
import toast from 'react-hot-toast';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left animate-fadeInUp">
        <Link to="/" className="auth-logo">
          <BiBrain size={32} color="var(--primary)" />
          <span className="text-gradient">InterviewAI</span>
        </Link>
        
        <div className="auth-form-wrapper">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Log in to your account to continue your interview preparation.</p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-with-icon">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            
            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-full auth-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner spinner-sm"></span>
              ) : (
                'Log In'
              )}
            </button>
          </form>
          
          <div className="auth-redirect">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
      
      <div className="auth-right">
        <div className="auth-right-content">
          <div className="auth-quote">
            "The only difference between a good interview and a great one is preparation."
          </div>
          <div className="auth-features">
            <div className="feature-badge badge-primary">
              <BiBrain /> AI-Powered Feedback
            </div>
            <div className="feature-badge badge-success">
              Real-time Analytics
            </div>
            <div className="feature-badge badge-warning">
              Mock Interviews
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
