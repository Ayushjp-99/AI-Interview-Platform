import React, { useState, useEffect } from 'react';
import { FiAward } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getScoreClass } from '../../utils/helpers';
import './LeaderboardPage.css';

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('alltime');

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/leaderboard?type=${activeTab}&limit=20`);
      setLeaderboard(response.data.data.leaderboard);
      
      if (response.data.data.myRank) {
        setMyRank(response.data.data.myRank);
      } else {
        setMyRank(null);
      }
    } catch (error) {
      toast.error('Failed to load leaderboard data');
      console.error(error);
      
      // Fallback dummy data for demo if API fails
      if (error.response?.status === 404 || true) { // Force mock data for demonstration
        setLeaderboard([
          { _id: '1', name: 'Alex Johnson', initials: 'AJ', skillLevel: 'Expert', score: 95, interviewsCount: 42, highestScore: 98 },
          { _id: '2', name: 'Sarah Smith', initials: 'SS', skillLevel: 'Advanced', score: 92, interviewsCount: 28, highestScore: 95 },
          { _id: '3', name: 'Mike Chen', initials: 'MC', skillLevel: 'Advanced', score: 88, interviewsCount: 35, highestScore: 90 },
          { _id: '4', name: 'Elena Rodriguez', initials: 'ER', skillLevel: 'Intermediate', score: 82, interviewsCount: 15, highestScore: 88 },
          { _id: '5', name: 'James Wilson', initials: 'JW', skillLevel: 'Intermediate', score: 78, interviewsCount: 12, highestScore: 84 },
        ]);
        if (user) {
          setMyRank({ rank: 12, score: 68 });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return '';
  };

  const tabs = [
    { id: 'alltime', label: 'All Time' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'most_interviews', label: 'Most Interviews' }
  ];

  return (
    <div className="leaderboard-page page-container animate-fadeInUp">
      <div className="page-header text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <FiAward className="text-primary mb-4" size={48} />
        <h1 className="text-gradient">Top Performers</h1>
        <p className="text-muted">See how you rank against other candidates</p>
      </div>

      <div className="leaderboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`leaderboard-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="leaderboard-table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th className="text-center">Rank</th>
              <th>User</th>
              <th>Avg Score</th>
              <th>Interviews</th>
              {activeTab === 'alltime' && <th>Highest Score</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="skeleton-row">
                  <td colSpan={activeTab === 'alltime' ? 5 : 4}></td>
                </tr>
              ))
            ) : leaderboard.length === 0 ? (
              <tr>
                <td colSpan={activeTab === 'alltime' ? 5 : 4} className="text-center py-8">
                  <div className="empty-state">
                    <h3>No ranking data yet</h3>
                    <p className="text-muted">Complete more interviews to get ranked!</p>
                  </div>
                </td>
              </tr>
            ) : (
              leaderboard.map((entry, index) => {
                const rank = index + 1;
                const isCurrentUser = user && user._id === entry._id;
                
                return (
                  <tr key={entry._id} className={`leaderboard-row ${isCurrentUser ? 'bg-primary-light bg-opacity-10' : ''}`}>
                    <td className={`rank-cell ${getRankClass(rank)}`}>
                      {getRankIcon(rank)}
                    </td>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {entry.initials || entry.name?.substring(0, 2).toUpperCase() || 'U'}
                        </div>
                        <div className="user-info">
                          <span className="user-name">{entry.name} {isCurrentUser && '(You)'}</span>
                          <span className="badge badge-info mt-1" style={{ width: 'fit-content', fontSize: '0.7rem' }}>
                            {entry.skillLevel || 'Intermediate'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={`score-badge bg-${getScoreClass(entry.score)} bg-opacity-20 text-${getScoreClass(entry.score)}`}>
                        {entry.score || 0}
                      </div>
                    </td>
                    <td>{entry.interviewsCount || 0}</td>
                    {activeTab === 'alltime' && (
                      <td>
                        <span className={`text-${getScoreClass(entry.highestScore)} font-bold`}>
                          {entry.highestScore || 0}
                        </span>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && myRank && (
        <div className="my-rank-card animate-fadeIn">
          <div className="user-cell">
            <div className="user-avatar">
              {user?.name?.substring(0, 2).toUpperCase() || 'ME'}
            </div>
            <div className="user-info">
              <span className="my-rank-label">Your Current Rank</span>
              <span className="user-name">Keep practicing to climb higher!</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`rank-cell ${getRankClass(myRank.rank)}`} style={{ width: 'auto', fontSize: '2rem' }}>
              #{myRank.rank}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
