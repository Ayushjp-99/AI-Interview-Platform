import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { getErrorMessage, getCategoryIcon, getScoreClass, formatDate } from '../../utils/helpers';
import { FiFileText, FiDownload, FiArrowRight, FiSliders, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './ReportsListPage.css';

const ReportsListPage = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const fetchReports = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/reports?page=${page}&limit=8`);
      setReports(data.reports);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="reports-list-page animate-fadeIn">
      <div className="page-header">
        <h1>Evaluation Reports</h1>
        <p className="text-secondary">Review your performance breakdowns, AI feedback and personalized learning tracks.</p>
      </div>

      {loading ? (
        <div className="reports-loading flex-center flex-col gap-4">
          <div className="spinner spinner-lg" />
          <p className="text-muted">Loading your career scorecards...</p>
        </div>
      ) : reports.length > 0 ? (
        <div className="flex-col gap-6">
          <div className="grid-2">
            {reports.map((report) => (
              <div key={report._id} className="card card-hover report-card flex-col gap-4">
                <div className="flex-between">
                  <div className="d-flex align-items-center gap-3">
                    <span className="report-cat-icon">{getCategoryIcon(report.category)}</span>
                    <div>
                      <h4 className="report-title">{report.category} Report</h4>
                      <p className="text-xs text-muted">
                        Difficulty: <span className="fw-600">{report.difficulty}</span> • {formatDate(report.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className={`score-badge ${getScoreClass(report.overallScore)}`}>
                    {report.overallScore}%
                  </span>
                </div>

                <div className="report-body">
                  <p className="text-xs text-muted mb-2 uppercase tracking-wider">Recommended topics for you:</p>
                  <div className="d-flex gap-2 flex-wrap">
                    {report.recommendedTopics && report.recommendedTopics.length > 0 ? (
                      report.recommendedTopics.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="badge badge-secondary">{t}</span>
                      ))
                    ) : (
                      <span className="text-muted text-xs">No topics suggested</span>
                    )}
                  </div>
                </div>

                <div className="divider" style={{ margin: 'var(--space-2) 0' }} />

                <div className="flex-between">
                  <span className="text-xs text-muted">Attempted questions</span>
                  <Link to={`/reports/${report._id}`} className="btn btn-ghost btn-sm flex-center gap-1">
                    View Full Analysis <FiArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination flex-center gap-4 mt-6">
              <button
                disabled={pagination.page === 1}
                className="btn btn-ghost btn-sm"
                onClick={() => fetchReports(pagination.page - 1)}
              >
                Previous
              </button>
              <span className="text-sm text-secondary">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                disabled={pagination.page === pagination.pages}
                className="btn btn-ghost btn-sm"
                onClick={() => fetchReports(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state card card-glass">
          <span className="empty-state-icon">📊</span>
          <h3>No evaluation reports found</h3>
          <p>Complete a mock interview first. Gemini AI will analyze your response and compile a detailed career card.</p>
          <Link to="/interview/setup" className="btn btn-primary mt-2">
            Configure Mock Interview
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReportsListPage;
