import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEdit, FiSave, FiAward, FiStar, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { getInitials, getSkillLevelClass } from '../../utils/helpers';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
  });
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalInterviews: user?.totalInterviews || 0,
    averageScore: user?.averageScore || 0,
    skillLevel: user?.skillLevel || 'Beginner'
  });

  const [achievements, setAchievements] = useState([
    { id: 1, title: 'First Steps', description: 'Completed first interview', date: '2023-01-15', icon: <FiAward /> },
    { id: 2, title: 'High Achiever', description: 'Scored 90+ in an interview', date: '2023-02-20', icon: <FiStar /> },
    { id: 3, title: 'Consistent Learner', description: 'Practiced 5 days in a row', date: '2023-03-10', icon: <FiTrendingUp /> }
  ]);
  
  const [strongTopics, setStrongTopics] = useState(['React', 'JavaScript', 'Problem Solving']);
  const [weakTopics, setWeakTopics] = useState(['System Design', 'CSS Animations']);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/profile', profileData);
      await refreshUser();
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page animate-fadeInUp">
      <div className="page-header">
        <h1>My Profile</h1>
        <p className="text-secondary">Manage your account and view your progress</p>
      </div>

      <div className="profile-content">
        <div className="profile-left">
          <div className="card card-glass profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {getInitials(user?.name || 'User')}
              </div>
              <div className="profile-info">
                <h2>{user?.name || 'User Name'}</h2>
                <p className="text-muted"><FiMail className="inline-icon" /> {user?.email}</p>
                <span className={`badge ${getSkillLevelClass(stats.skillLevel)}`}>
                  {stats.skillLevel}
                </span>
              </div>
              {!isEditing ? (
                <button className="btn btn-secondary btn-sm ml-auto" onClick={() => setIsEditing(true)}>
                  <FiEdit /> Edit
                </button>
              ) : (
                <button className="btn btn-ghost btn-sm ml-auto" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="edit-profile-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="spinner spinner-sm"></span> : <><FiSave /> Save Changes</>}
                </button>
              </form>
            ) : (
              <div className="profile-bio">
                <h3>About Me</h3>
                <p className="text-secondary">{user?.bio || 'No bio added yet.'}</p>
              </div>
            )}
          </div>

          <div className="card card-glass password-card">
            <div 
              className="password-header cursor-pointer" 
              onClick={() => setIsChangingPassword(!isChangingPassword)}
            >
              <h3><FiLock className="inline-icon" /> Security</h3>
              <button className="btn btn-ghost btn-sm">
                {isChangingPassword ? 'Cancel' : 'Change Password'}
              </button>
            </div>
            
            {isChangingPassword && (
              <form onSubmit={handlePasswordChange} className="password-form animate-fadeInUp">
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="spinner spinner-sm"></span> : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="profile-right">
          <div className="stats-grid">
            <div className="stat-card card-glass">
              <div className="stat-value">{stats.totalInterviews}</div>
              <div className="stat-label">Total Interviews</div>
            </div>
            <div className="stat-card card-glass">
              <div className="stat-value">{stats.averageScore}%</div>
              <div className="stat-label">Average Score</div>
            </div>
            <div className="stat-card card-glass">
              <div className="stat-value text-gradient">{stats.skillLevel}</div>
              <div className="stat-label">Current Level</div>
            </div>
          </div>

          <div className="card card-glass topics-card">
            <h3>Skills Overview</h3>
            <div className="topics-section">
              <h4>Strong Topics</h4>
              <div className="topics-list">
                {strongTopics.map((topic, i) => (
                  <span key={i} className="badge badge-success">{topic}</span>
                ))}
              </div>
            </div>
            <div className="topics-section">
              <h4>Areas for Improvement</h4>
              <div className="topics-list">
                {weakTopics.map((topic, i) => (
                  <span key={i} className="badge badge-warning">{topic}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="card card-glass achievements-card">
            <h3>Achievements</h3>
            <div className="achievements-grid">
              {achievements.map(achievement => (
                <div key={achievement.id} className="achievement-item">
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-details">
                    <h4>{achievement.title}</h4>
                    <p>{achievement.description}</p>
                    <small className="text-muted">{achievement.date}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
