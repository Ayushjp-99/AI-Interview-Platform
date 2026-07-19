import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { getErrorMessage, getCategoryIcon, getScoreClass, getSkillLevelClass, formatDate } from '../../utils/helpers';
import {
  FiZap, FiAward, FiClock, FiActivity, FiTrendingUp, FiArrowRight,
  FiAlertCircle, FiThumbsUp, FiBookOpen
} from 'react-icons/fi';
import { BiBrain } from 'react-icons/bi';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import './DashboardPage.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/interviews/dashboard-stats');
        setData(res.data);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading flex-center flex-col gap-4">
        <div className="spinner spinner-lg" />
        <p className="text-muted">Analyzing your career progression...</p>
      </div>
    );
  }

  const { stats, recentInterviews, categoryStats, performanceTrend } = data || {};

  // Setup performance trend line chart
  const lineChartData = {
    labels: performanceTrend && performanceTrend.length > 0
      ? performanceTrend.map((t, idx) => `${t.category} #${idx + 1}`)
      : ['No data'],
    datasets: [
      {
        label: 'Interview Score',
        data: performanceTrend && performanceTrend.length > 0
          ? performanceTrend.map((t) => t.averageScore)
          : [0],
        borderColor: '#6C63FF',
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#FF6584',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#FF6584',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        padding: 12,
        backgroundColor: '#1E1E38',
        titleFont: { family: 'Space Grotesk', size: 14, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 13 },
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#A0A0C0',
          font: { family: 'Inter', size: 11 },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#A0A0C0',
          font: { family: 'Inter', size: 11 },
        },
      },
    },
  };

  // Setup category average scores bar chart
  const barChartData = {
    labels: categoryStats && categoryStats.length > 0
      ? categoryStats.map((c) => c._id)
      : ['No data'],
    datasets: [
      {
        label: 'Average Score',
        data: categoryStats && categoryStats.length > 0
          ? categoryStats.map((c) => Math.round(c.avgScore))
          : [0],
        backgroundColor: categoryStats && categoryStats.length > 0
          ? categoryStats.map((_, i) => i % 2 === 0 ? '#6C63FF' : '#FF6584')
          : '#6C63FF',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        padding: 12,
        backgroundColor: '#1E1E38',
        titleFont: { family: 'Space Grotesk', size: 14, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 13 },
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#A0A0C0',
          font: { family: 'Inter', size: 11 },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#A0A0C0',
          font: { family: 'Inter', size: 11 },
        },
      },
    },
  };

  // Generate recommended topics list
  const recommendedTopicsList = [
    'React Hooks & State Management',
    'Node.js Event Loop',
    'MongoDB Indexing Strategies',
    'Data Structures & Algorithms',
    'System Design Basics',
    'JavaScript Promises & Async/Await',
    'SQL Joins & Optimizations',
  ];

  return (
    <div className="dashboard animate-fadeIn">
      {/* Welcome Hero */}
      <div className="dashboard-hero card-glass mb-8">
        <div className="dashboard-hero-content">
          <div className="hero-badge mb-2">
            <FiZap /> AI Career Partner
          </div>
          <h1>Welcome back, {user?.name}!</h1>
          <p className="text-secondary">
            Ready to test your knowledge today? Start a mock interview and let Gemini AI analyze your performance with real-time feedback.
          </p>
          <Link to="/interview/setup" className="btn btn-primary mt-4" id="dashboard-cta-btn">
            Start Mock Interview <FiArrowRight />
          </Link>
        </div>
        <div className="dashboard-hero-visual animate-float">
          <BiBrain />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-4 mb-8">
        <div className="stat-card">
          <span className="stat-icon"><FiActivity /></span>
          <p className="text-secondary text-sm">Interviews Practiced</p>
          <h3>{stats?.totalInterviews || 0}</h3>
          <span className="badge badge-primary mt-2">All categories</span>
        </div>

        <div className="stat-card">
          <span className="stat-icon"><FiAward /></span>
          <p className="text-secondary text-sm">Average Score</p>
          <h3 className={stats?.averageScore >= 70 ? 'text-success' : stats?.averageScore >= 50 ? 'text-warning' : 'text-danger'}>
            {stats?.averageScore || 0}%
          </h3>
          <span className={`badge ${getSkillLevelClass(stats?.skillLevel)} mt-2`}>
            {stats?.skillLevel || 'Beginner'}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-icon"><FiTrendingUp /></span>
          <p className="text-secondary text-sm">Strong Topics</p>
          <h3>{stats?.strongTopics?.length || 0}</h3>
          <div className="d-flex gap-1 mt-2 flex-wrap">
            {stats?.strongTopics?.slice(0, 2).map((t) => (
              <span key={t} className="badge badge-success">{t}</span>
            )) || <span className="text-muted text-xs">No records</span>}
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon"><FiClock /></span>
          <p className="text-secondary text-sm">Target Weak Areas</p>
          <h3>{stats?.weakTopics?.length || 0}</h3>
          <div className="d-flex gap-1 mt-2 flex-wrap">
            {stats?.weakTopics?.slice(0, 2).map((t) => (
              <span key={t} className="badge badge-danger">{t}</span>
            )) || <span className="text-muted text-xs">No records</span>}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid-2 mb-8">
        <div className="card">
          <h4 className="mb-4 flex-between">
            <span>Performance Trend</span>
            <span className="text-muted text-xs">Last 7 Sessions</span>
          </h4>
          <div className="chart-container">
            {performanceTrend && performanceTrend.length > 0 ? (
              <Line data={lineChartData} options={lineChartOptions} />
            ) : (
              <div className="flex-center flex-col h-full text-muted">
                <FiActivity size={32} className="mb-2" />
                <p>Complete interviews to visualize your progress trend.</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h4 className="mb-4 flex-between">
            <span>Score By Category</span>
            <span className="text-muted text-xs">Average Performance</span>
          </h4>
          <div className="chart-container">
            {categoryStats && categoryStats.length > 0 ? (
              <Bar data={barChartData} options={barChartOptions} />
            ) : (
              <div className="flex-center flex-col h-full text-muted">
                <FiAward size={32} className="mb-2" />
                <p>Your performance breakdown per category will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Interviews & Recommendations */}
      <div className="dashboard-grid">
        {/* Recent Interviews */}
        <div className="card dashboard-recent">
          <div className="flex-between mb-4">
            <h4>Recent Interviews</h4>
            <Link to="/history" className="text-sm btn-link flex-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>

          {recentInterviews && recentInterviews.length > 0 ? (
            <div className="recent-list">
              {recentInterviews.map((interview) => (
                <div key={interview._id} className="recent-item flex-between">
                  <div className="d-flex align-items-center gap-3">
                    <span className="recent-icon">{getCategoryIcon(interview.category)}</span>
                    <div>
                      <p className="fw-600 text-sm">{interview.category}</p>
                      <p className="text-xs text-muted">
                        {formatDate(interview.completedAt)} • {interview.difficulty}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-4">
                    <div className="text-right">
                      <span className={`score-badge btn-sm ${getScoreClass(interview.averageScore)}`}>
                        {interview.averageScore}%
                      </span>
                    </div>
                    <Link
                      to={`/reports/interview/${interview._id}`}
                      className="btn btn-ghost btn-sm"
                    >
                      Report
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-state-icon">📝</span>
              <h3>No Interviews Done</h3>
              <p>Practice makes perfect. Attempt your first mock interview to get detailed analysis.</p>
              <Link to="/interview/setup" className="btn btn-primary btn-sm">
                Start Now
              </Link>
            </div>
          )}
        </div>

        {/* Action Items / Recommendations */}
        <div className="card dashboard-recommendations">
          <h4 className="mb-4">Recommended Topics</h4>
          <p className="text-secondary text-sm mb-4">
            Based on your mock test analysis, we recommend focusing on these concepts to improve:
          </p>

          <div className="recommendation-list">
            {recommendedTopicsList.map((topic, i) => (
              <div key={i} className="recommendation-item">
                <FiBookOpen className="recommendation-icon" />
                <span className="text-sm fw-500">{topic}</span>
              </div>
            ))}
          </div>

          <div className="achievement-quick-card mt-6">
            <h5 className="mb-2">🏆 Achievements unlocked</h5>
            <p className="text-xs text-muted mb-3">
              You have unlocked {user?.achievements?.length || 0} badges. Keep practicing to earn more!
            </p>
            <div className="d-flex gap-2">
              {user?.achievements?.slice(0, 3).map((ach, i) => (
                <span key={i} className="badge badge-secondary" title={ach.description}>
                  {ach.icon} {ach.title}
                </span>
              )) || <span className="text-muted text-xs">Unlock your first badge today.</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
