import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiSearch, FiCalendar, FiClock, FiList, FiTrash2, FiEye, FiPlay } from 'react-icons/fi';
import api from '../../services/api';
import { getScoreClass, getDifficultyClass, getCategoryIcon, formatDate, formatDuration } from '../../utils/helpers';
import './HistoryPage.css';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
    status: '',
    sort: 'newest'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    fetchHistory();
  }, [filters, pagination.page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      
      // Filter out empty params
      for (const [key, value] of Object.entries(filters)) {
        if (!value) queryParams.delete(key);
      }

      const response = await api.get(`/interviews/history?${queryParams.toString()}`);
      setInterviews(response.data.data.interviews);
      setPagination({
        ...pagination,
        totalPages: response.data.data.pagination.totalPages,
        total: response.data.data.pagination.total
      });
    } catch (error) {
      toast.error('Failed to load interview history');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this interview record?')) {
      try {
        await api.delete(`/interviews/${id}`);
        toast.success('Interview deleted successfully');
        fetchHistory();
      } catch (error) {
        toast.error('Failed to delete interview');
      }
    }
  };

  const handleAction = (interview) => {
    if (interview.status === 'completed') {
      navigate(`/reports/interview/${interview._id}`);
    } else {
      navigate(`/interview/${interview._id}/complete`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return 'badge-success';
      case 'in-progress': return 'badge-warning';
      case 'abandoned': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  return (
    <div className="history-page page-container animate-fadeInUp">
      <div className="page-header">
        <div>
          <h1 className="text-gradient">Interview History</h1>
          <p className="text-muted">Review your past interviews and track your progress</p>
        </div>
      </div>

      <div className="history-filter-bar stagger-children">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            name="search"
            placeholder="Search by category..."
            className="form-input search-input"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        
        <select name="category" className="form-select" value={filters.category} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="fullstack">Fullstack</option>
          <option value="system_design">System Design</option>
          <option value="behavioral">Behavioral</option>
        </select>

        <select name="difficulty" className="form-select" value={filters.difficulty} onChange={handleFilterChange}>
          <option value="">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select name="status" className="form-select" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
          <option value="abandoned">Abandoned</option>
        </select>

        <select name="sort" className="form-select" value={filters.sort} onChange={handleFilterChange}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest_score">Highest Score</option>
          <option value="lowest_score">Lowest Score</option>
        </select>
      </div>

      {loading ? (
        <div className="history-list">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card"></div>)}
        </div>
      ) : interviews.length === 0 ? (
        <div className="empty-state card card-glass">
          <div className="empty-state-icon">📝</div>
          <h3>No interviews found</h3>
          <p className="text-muted">You haven't completed any interviews matching these filters yet.</p>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/setup')}>
            Start New Interview
          </button>
        </div>
      ) : (
        <div className="history-list stagger-children">
          {interviews.map(interview => (
            <div key={interview._id} className="card card-hover history-card">
              <div className="history-card-header">
                <div className="history-category">
                  <span className="history-category-icon">{getCategoryIcon(interview.category)}</span>
                  <span>{interview.categoryName || interview.category}</span>
                </div>
                <div className="history-status">
                  <span className={`badge ${getStatusBadge(interview.status)}`}>
                    {interview.status}
                  </span>
                  <span className={`badge ${getDifficultyClass(interview.difficulty)}`}>
                    {interview.difficulty}
                  </span>
                </div>
              </div>
              
              <div className="history-card-body">
                <div className="history-score-display">
                  <span className="history-score-label">Score</span>
                  <span className={`history-score-value text-${getScoreClass(interview.overallScore)}`}>
                    {interview.status === 'completed' ? interview.overallScore : '--'}
                  </span>
                </div>
                
                <div className="history-meta">
                  <div className="history-meta-item">
                    <FiCalendar /> <span>{formatDate(interview.createdAt)}</span>
                  </div>
                  <div className="history-meta-item">
                    <FiClock /> <span>{formatDuration(interview.duration || 0)}</span>
                  </div>
                  <div className="history-meta-item">
                    <FiList /> <span>{interview.questionsAnswered || 0} / {interview.totalQuestions || 0} Qs</span>
                  </div>
                </div>
              </div>
              
              <div className="history-card-actions">
                <button 
                  className="btn btn-sm btn-ghost btn-danger" 
                  onClick={() => handleDelete(interview._id)}
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
                <button 
                  className={`btn btn-sm ${interview.status === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleAction(interview)}
                >
                  {interview.status === 'completed' ? (
                    <><FiEye /> View Report</>
                  ) : (
                    <><FiPlay /> Resume</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && interviews.length > 0 && pagination.totalPages > 1 && (
        <div className="history-pagination">
          <button 
            className="btn btn-secondary btn-sm" 
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </button>
          <span className="history-pagination-info">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button 
            className="btn btn-secondary btn-sm" 
            disabled={pagination.page === pagination.totalPages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
