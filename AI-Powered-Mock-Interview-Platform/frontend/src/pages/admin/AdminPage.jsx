import { useState, useEffect } from 'react';
import api from '../../services/api';
import { getErrorMessage, formatDate } from '../../utils/helpers';
import {
  FiUsers, FiActivity, FiDatabase, FiTrash2, FiToggleLeft, FiToggleRight,
  FiSearch, FiTrendingUp, FiCheckCircle, FiShield, FiAlertTriangle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import './AdminPage.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [dbStats, setDbStats] = useState(null);

  // Users management states
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [usersLoading, setUsersLoading] = useState(false);

  // Fetch admin stats
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [resAnal, resDb] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/db-stats'),
      ]);
      setAnalytics(resAnal.data.analytics);
      setDbStats(resDb.data.dbStats);
    } catch (err) {
      toast.error('Failed to fetch admin stats.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users list
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const { data } = await api.get(`/admin/users?page=${page}&limit=10&search=${search}`);
      setUsers(data.users);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, page, search]);

  const handleToggleStatus = async (userId) => {
    try {
      const { data } = await api.patch(`/admin/users/${userId}/toggle-status`);
      toast.success(data.message);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: data.isActive } : u))
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to permanently delete this user and all associated data? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      const { data } = await api.delete(`/admin/users/${userId}`);
      toast.success(data.message);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // Line chart setup for daily usage statistics
  const chartData = {
    labels: analytics?.dailyInterviews && analytics.dailyInterviews.length > 0
      ? analytics.dailyInterviews.map((d) => d._id)
      : ['No data'],
    datasets: [
      {
        label: 'Interviews Administered',
        data: analytics?.dailyInterviews && analytics.dailyInterviews.length > 0
          ? analytics.dailyInterviews.map((d) => d.count)
          : [0],
        borderColor: '#FF6584',
        backgroundColor: 'rgba(255, 101, 132, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#A0A0C0' },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#A0A0C0' },
      },
    },
  };

  if (loading) {
    return (
      <div className="admin-loading flex-center flex-col gap-4">
        <div className="spinner spinner-lg" />
        <p className="text-muted">Analyzing platform diagnostics...</p>
      </div>
    );
  }

  return (
    <div className="admin-page animate-fadeIn">
      <div className="page-header flex-between">
        <div>
          <h1>Admin Control Room</h1>
          <p className="text-secondary font-semibold">Monitor diagnostic analytics and manage platform users.</p>
        </div>
        <span className="badge badge-danger flex-center gap-1">
          <FiShield /> Admin Session
        </span>
      </div>

      {/* Tabs */}
      <div className="admin-tabs flex-row gap-3 mb-6">
        <button
          className={`tab-btn btn btn-ghost btn-sm ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <FiTrendingUp /> Diagnostics
        </button>
        <button
          className={`tab-btn btn btn-ghost btn-sm ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <FiUsers /> User Management
        </button>
        <button
          className={`tab-btn btn btn-ghost btn-sm ${activeTab === 'db' ? 'active' : ''}`}
          onClick={() => setActiveTab('db')}
        >
          <FiDatabase /> Database Statistics
        </button>
      </div>

      {/* Diagnostics Analytics tab */}
      {activeTab === 'analytics' && analytics && (
        <div className="flex-col gap-6">
          {/* Diagnostic Stat Cards */}
          <div className="grid-4">
            <div className="stat-card">
              <span className="stat-icon"><FiUsers /></span>
              <p className="text-secondary text-sm">Active Candidates</p>
              <h3>{analytics.users.active} / {analytics.users.total}</h3>
              <span className="badge badge-success mt-2">Active accounts</span>
            </div>

            <div className="stat-card">
              <span className="stat-icon"><FiActivity /></span>
              <p className="text-secondary text-sm">Total Mock Tests</p>
              <h3>{analytics.interviews.total}</h3>
              <span className="badge badge-primary mt-2">
                {analytics.interviews.completed} Completed
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-icon"><FiCheckCircle /></span>
              <p className="text-secondary text-sm">Overall Score Average</p>
              <h3>{analytics.interviews.averageScore}%</h3>
              <span className="badge badge-warning mt-2">Platform average</span>
            </div>

            <div className="stat-card">
              <span className="stat-icon"><FiDatabase /></span>
              <p className="text-secondary text-sm">Database Size</p>
              <h3>{Math.round((dbStats?.database?.dataSize || 0) / 1024)} KB</h3>
              <span className="badge badge-secondary mt-2">MongoDB Local</span>
            </div>
          </div>

          {/* Daily Usage Chart */}
          <div className="card">
            <h4 className="mb-4">Diagnostic Activity Trend (Last 7 Days)</h4>
            <div style={{ height: '300px', position: 'relative' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Most popular categories grid */}
          <div className="card">
            <h4 className="mb-4">Category Analytics</h4>
            <div className="category-stats-list">
              {analytics.categoryStats && analytics.categoryStats.length > 0 ? (
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Interviews Count</th>
                        <th>Average Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.categoryStats.map((cat, idx) => (
                        <tr key={idx}>
                          <td className="fw-600">{cat._id}</td>
                          <td>{cat.count} attempts</td>
                          <td>{Math.round(cat.avgScore)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-sm">No diagnostic category details.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Users management tab */}
      {activeTab === 'users' && (
        <div className="card flex-col gap-4">
          {/* Search tool */}
          <div className="form-group mb-4">
            <div className="relative">
              <FiSearch
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Search candidates by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                style={{ paddingLeft: '36px' }}
              />
            </div>
          </div>

          {/* Users Table */}
          {usersLoading ? (
            <div className="flex-center p-8">
              <div className="spinner" />
            </div>
          ) : users.length > 0 ? (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Interviews</th>
                    <th>Avg Score</th>
                    <th>Diagnostics</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <p className="fw-600">{user.name}</p>
                        <p className="text-xs text-muted">Created: {formatDate(user.createdAt)}</p>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {user.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td>{user.totalInterviews} attempts</td>
                      <td>{user.averageScore}%</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            title="Toggle status"
                            className="btn btn-ghost btn-sm btn-icon"
                            onClick={() => handleToggleStatus(user._id)}
                            disabled={user.role === 'admin'}
                          >
                            {user.isActive ? <FiToggleRight className="text-success" /> : <FiToggleLeft className="text-muted" />}
                          </button>
                          <button
                            title="Delete candidate"
                            className="btn btn-danger btn-sm btn-icon"
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={user.role === 'admin'}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted text-center p-6">No users found matching query.</p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination flex-center gap-4 mt-4">
              <button
                disabled={page === 1}
                className="btn btn-ghost btn-sm"
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                className="btn btn-ghost btn-sm"
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Database stats tab */}
      {activeTab === 'db' && dbStats && (
        <div className="grid-2">
          {/* Collections list */}
          <div className="card">
            <h4 className="mb-4 d-flex align-items-center gap-2">
              <FiDatabase className="text-primary-color" /> Collections Stats
            </h4>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Collection</th>
                    <th>Document Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-600">Users</td>
                    <td>{dbStats.collections.users} records</td>
                  </tr>
                  <tr>
                    <td className="fw-600">Interviews</td>
                    <td>{dbStats.collections.interviews} records</td>
                  </tr>
                  <tr>
                    <td className="fw-600">Reports</td>
                    <td>{dbStats.collections.reports} records</td>
                  </tr>
                  <tr>
                    <td className="fw-600">Leaderboard</td>
                    <td>{dbStats.collections.leaderboard} records</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Database System Diagnostic Info */}
          <div className="card">
            <h4 className="mb-4 d-flex align-items-center gap-2">
              <FiAlertTriangle className="text-secondary" /> Diagnostics Stats
            </h4>
            <div className="db-diag-details flex-col gap-3">
              <div className="flex-between">
                <span className="text-secondary text-sm">Storage Size:</span>
                <span className="fw-700">{Math.round(dbStats.database.storageSize / 1024)} KB</span>
              </div>
              <div className="flex-between">
                <span className="text-secondary text-sm">Indexed Collections:</span>
                <span className="fw-700">{dbStats.database.indexes} indexes</span>
              </div>
              <div className="flex-between">
                <span className="text-secondary text-sm">Active Collections:</span>
                <span className="fw-700">{dbStats.database.collections} collections</span>
              </div>
              <div className="flex-between">
                <span className="text-secondary text-sm">Host System Port:</span>
                <span className="fw-700">27017 (Local MongoDB)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
