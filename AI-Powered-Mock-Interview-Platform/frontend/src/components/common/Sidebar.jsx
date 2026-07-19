import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  FiHome, FiActivity, FiUser, FiAward, FiLogOut,
  FiSettings, FiSun, FiMoon, FiMenu, FiX,
  FiBarChart2, FiClock, FiShield
} from 'react-icons/fi';
import { BiBrain } from 'react-icons/bi';
import { getInitials } from '../../utils/helpers';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
  { path: '/interview/setup', icon: <BiBrain />, label: 'New Interview' },
  { path: '/history', icon: <FiClock />, label: 'History' },
  { path: '/reports', icon: <FiBarChart2 />, label: 'Reports' },
  { path: '/leaderboard', icon: <FiAward />, label: 'Leaderboard' },
  { path: '/profile', icon: <FiUser />, label: 'Profile' },
];

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div
          className="sidebar-overlay"
          onClick={() => setCollapsed(true)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          {!collapsed && (
            <Link to="/dashboard" className="sidebar-logo">
              <div className="sidebar-logo-icon">
                <BiBrain />
              </div>
              <div>
                <span className="sidebar-logo-text">InterviewAI</span>
                <span className="sidebar-logo-sub">Pro Platform</span>
              </div>
            </Link>
          )}
          <button
            className="sidebar-toggle btn btn-ghost btn-icon"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
            id="sidebar-toggle-btn"
          >
            {collapsed ? <FiMenu /> : <FiX />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
              {isActive(item.path) && <span className="sidebar-nav-indicator" />}
            </Link>
          ))}

          {/* Admin Link */}
          {isAdmin && (
            <Link
              to="/admin"
              className={`sidebar-nav-item ${isActive('/admin') ? 'active' : ''}`}
              title={collapsed ? 'Admin' : ''}
            >
              <span className="sidebar-nav-icon"><FiShield /></span>
              {!collapsed && <span className="sidebar-nav-label">Admin Panel</span>}
            </Link>
          )}
        </nav>

        {/* Bottom Section */}
        <div className="sidebar-bottom">
          {/* Theme Toggle */}
          <button
            className="sidebar-theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            id="theme-toggle-btn"
          >
            <span className="sidebar-nav-icon">
              {isDark ? <FiSun /> : <FiMoon />}
            </span>
            {!collapsed && (
              <span className="sidebar-nav-label">
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>

          {/* User Profile */}
          {user && (
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span>{getInitials(user.name)}</span>
                )}
              </div>
              {!collapsed && (
                <div className="sidebar-user-info">
                  <p className="sidebar-user-name">{user.name}</p>
                  <p className="sidebar-user-role">{user.role}</p>
                </div>
              )}
              <button
                className="sidebar-logout"
                onClick={logout}
                title="Logout"
                id="logout-btn"
              >
                <FiLogOut />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
