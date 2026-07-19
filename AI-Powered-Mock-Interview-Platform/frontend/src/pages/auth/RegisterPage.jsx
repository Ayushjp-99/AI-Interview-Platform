import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { BiBrain } from 'react-icons/bi';
import toast from 'react-hot-toast';
import './RegisterPage.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength < 50) return 'var(--danger)';
    if (strength < 75) return 'var(--warning)';
    return 'var(--success)';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
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
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join us to practice and master your interviews.</p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

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
                  placeholder="Create a password"
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
              {password && (
                <div className="password-strength-container">
                  <div className="password-strength-bar">
                    <div 
                      className="password-strength-fill" 
                      style={{ 
                        width: `${getPasswordStrength()}%`,
                        backgroundColor: getStrengthColor()
                      }}
                    ></div>
                  </div>
                  <span className="password-strength-text" style={{ color: getStrengthColor() }}>
                    {getPasswordStrength() < 50 ? 'Weak' : getPasswordStrength() < 75 ? 'Fair' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-full auth-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner spinner-sm"></span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
          
          <div className="auth-redirect">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
      
      <div className="auth-right">
        <div className="auth-right-content">
          <div className="auth-quote">
            "Your next big career move starts with the perfect interview."
          </div>
          <div className="auth-features">
            <div className="feature-badge badge-primary">
              <BiBrain /> Smart AI Guidance
            </div>
            <div className="feature-badge badge-success">
              Skill Tracking
            </div>
            <div className="feature-badge badge-warning">
              Expert Feedback
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
