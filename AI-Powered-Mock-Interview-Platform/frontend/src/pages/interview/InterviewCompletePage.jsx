import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { getScoreClass } from '../../utils/helpers';
import { FiCheckCircle, FiFileText, FiHome, FiTrendingUp } from 'react-icons/fi';
import './InterviewCompletePage.css';

const InterviewCompletePage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await api.get(`/reports/interview/${id}`);
        setReport(data.report);
      } catch (err) {
        console.error('Report not generated yet or error fetching.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="complete-loading flex-center flex-col gap-4">
        <div className="spinner spinner-lg" />
        <p className="text-muted">Finalizing evaluations and saving data to database...</p>
      </div>
    );
  }

  return (
    <div className="interview-complete animate-fadeIn flex-center flex-col">
      <div className="card card-glass complete-card text-center flex-col align-items-center gap-6">
        <div className="complete-success-icon animate-float">
          <FiCheckCircle />
        </div>

        <div className="complete-text">
          <h1 className="text-gradient">Interview Completed!</h1>
          <p className="text-secondary mt-2">
            Fantastic effort! Your mock interview answers have been saved and analyzed. Gemini AI has evaluated every question response.
          </p>
        </div>

        {report && (
          <div className="complete-score-panel flex-col align-items-center gap-2">
            <span className="text-xs text-muted uppercase tracking-wider">Overall Performance Score</span>
            <div className={`score-badge score-badge-large ${getScoreClass(report.overallScore)}`}>
              {report.overallScore}%
            </div>
            <p className="text-sm fw-600 mt-2 text-secondary">
              Category: {report.category} ({report.difficulty})
            </p>
          </div>
        )}

        <div className="complete-actions d-flex gap-4">
          {report ? (
            <Link to={`/reports/${report._id}`} className="btn btn-primary" id="view-report-btn">
              View Detailed Report <FiFileText />
            </Link>
          ) : (
            <Link to={`/reports/interview/${id}`} className="btn btn-primary">
              View Detailed Report <FiFileText />
            </Link>
          )}
          <Link to="/dashboard" className="btn btn-ghost">
            Back to Dashboard <FiHome />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewCompletePage;
