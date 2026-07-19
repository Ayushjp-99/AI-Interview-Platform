import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { getErrorMessage, getCategoryIcon, getScoreClass, formatDate, formatDuration, getDifficultyClass } from '../../utils/helpers';
import {
  FiArrowLeft, FiDownload, FiCheckCircle, FiAlertCircle, FiThumbsUp,
  FiStar, FiTrendingUp, FiBookOpen, FiClock, FiHelpCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './ReportPage.css';

const ReportPage = () => {
  const { id } = useParams();
  const reportRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await api.get(`/reports/${id}`);
        setReport(data.report);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  // Export report to PDF
  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setDownloading(true);
    const pdfToast = toast.loading('Generating your official PDF carrier report...');

    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0F0F1A', // keep dark design print look if preferred
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 size width
      const pageHeight = 295; // A4 size height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Interview_Report_${report.category}_${report.overallScore}.pdf`);
      toast.success('PDF report downloaded successfully!', { id: pdfToast });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF.', { id: pdfToast });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="report-page-loading flex-center flex-col gap-4">
        <div className="spinner spinner-lg" />
        <p className="text-muted">Loading your AI performance matrix...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="empty-state text-center">
        <h3>Report Not Found</h3>
        <p>Could not locate the evaluation report details.</p>
        <Link to="/reports" className="btn btn-primary mt-2">
          Back to Reports
        </Link>
      </div>
    );
  }

  const { interview } = report;

  return (
    <div className="report-detail-page animate-fadeIn">
      {/* Top Header Toolbar */}
      <div className="report-toolbar flex-between mb-6">
        <Link to="/reports" className="btn btn-ghost btn-sm flex-center gap-1">
          <FiArrowLeft /> Back to Reports
        </Link>
        <button
          onClick={downloadPDF}
          disabled={downloading}
          className="btn btn-primary btn-sm flex-center gap-2"
          id="download-pdf-btn"
        >
          {downloading ? 'Generating PDF...' : 'Download PDF Report'} <FiDownload />
        </button>
      </div>

      {/* Main Printable Section */}
      <div ref={reportRef} className="report-pdf-wrapper flex-col gap-8">
        {/* Core Summary Card */}
        <div className="card card-glass report-summary-card">
          <div className="report-summary-header flex-between mb-6">
            <div className="d-flex align-items-center gap-3">
              <span className="report-main-icon">{getCategoryIcon(report.category)}</span>
              <div>
                <h2>{report.category} Interview Scorecard</h2>
                <p className="text-sm text-muted">
                  Completed on {formatDate(report.createdAt)} • Difficulty:{' '}
                  <span className={`badge ${getDifficultyClass(report.difficulty)}`}>{report.difficulty}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`score-badge score-badge-large ${getScoreClass(report.overallScore)}`}>
                {report.overallScore}%
              </span>
            </div>
          </div>

          <p className="summary-assessment text-secondary">{report.geminiSummary}</p>

          <div className="divider" />

          {/* Quick Metrics */}
          <div className="grid-3">
            <div className="metric-box flex-center flex-col text-center">
              <FiClock className="metric-box-icon text-primary-color" />
              <span className="text-xs text-muted mt-2">Time Taken</span>
              <span className="fw-700 text-sm mt-1">{formatDuration(report.timeTaken)}</span>
            </div>
            <div className="metric-box flex-center flex-col text-center">
              <FiHelpCircle className="metric-box-icon text-secondary" />
              <span className="text-xs text-muted mt-2">Questions Asked</span>
              <span className="fw-700 text-sm mt-1">{report.totalQuestions} Questions</span>
            </div>
            <div className="metric-box flex-center flex-col text-center">
              <FiCheckCircle className="metric-box-icon text-success" />
              <span className="text-xs text-muted mt-2">Questions Answered</span>
              <span className="fw-700 text-sm mt-1">{report.answeredQuestions} Answered</span>
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid-2">
          {/* Strengths */}
          <div className="card strengths-card">
            <h3 className="mb-4 d-flex align-items-center gap-2 text-success">
              <FiThumbsUp /> Strengths Identified
            </h3>
            <ul className="insights-list flex-col gap-3">
              {report.strengths && report.strengths.length > 0 ? (
                report.strengths.map((str, idx) => (
                  <li key={idx} className="insight-item d-flex gap-2">
                    <FiCheckCircle className="text-success mt-1 flex-shrink-0" />
                    <span className="text-sm">{str}</span>
                  </li>
                ))
              ) : (
                <p className="text-muted text-sm">Attempt more questions to show key strengths.</p>
              )}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="card weaknesses-card">
            <h3 className="mb-4 d-flex align-items-center gap-2 text-secondary">
              <FiAlertCircle /> Areas of Improvement
            </h3>
            <ul className="insights-list flex-col gap-3">
              {report.weaknesses && report.weaknesses.length > 0 ? (
                report.weaknesses.map((weak, idx) => (
                  <li key={idx} className="insight-item d-flex gap-2">
                    <FiAlertCircle className="text-secondary mt-1 flex-shrink-0" />
                    <span className="text-sm">{weak}</span>
                  </li>
                ))
              ) : (
                <p className="text-muted text-sm">No critical weaknesses identified.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Learning Path Recommendations */}
        <div className="card learning-path-card">
          <h3 className="mb-4 d-flex align-items-center gap-2">
            <FiBookOpen className="text-primary-color" />
            Personalized Learning Path
          </h3>
          <p className="text-secondary text-sm mb-4">
            Gemini AI suggests mastering these core topics based on your performance gap in the interview:
          </p>

          <div className="learning-path-grid grid-2">
            {report.learningPath && report.learningPath.length > 0 ? (
              report.learningPath.map((path, idx) => (
                <div key={idx} className="learning-path-box p-4 flex-col gap-2">
                  <div className="flex-between">
                    <span className="fw-700 text-sm">{path.topic}</span>
                    <span className={`badge ${path.priority === 'High' ? 'badge-danger' : path.priority === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
                      {path.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-muted">Focus on code-level practical assignments and reviews.</p>
                </div>
              ))
            ) : (
              <p className="text-muted text-sm">Review complete. No custom study path required.</p>
            )}
          </div>
        </div>

        {/* Question by Question Detailed Evaluation */}
        <div className="flex-col gap-6">
          <h3 className="section-title-sm mb-2">Question Breakdown & Grading</h3>

          {interview && interview.questions && interview.questions.map((q, idx) => {
            const evalObj = q.aiEvaluation || {};
            const isNoAnswer = !q.userAnswer || q.userAnswer.trim().length < 3;

            return (
              <div key={q._id} className="card question-graded-card flex-col gap-4">
                {/* Question title & score */}
                <div className="flex-between">
                  <span className="badge badge-primary">Question {idx + 1}</span>
                  <span className={`score-badge ${getScoreClass(evalObj.score)}`}>
                    Score: {evalObj.score || 0}/100
                  </span>
                </div>

                {/* Question content */}
                <div className="question-graded-text-box">
                  <p className="fw-600 text-base">{q.questionText}</p>
                </div>

                {/* User answer */}
                <div className="answer-section">
                  <p className="text-xs text-muted mb-1 uppercase tracking-wider">Your Answer:</p>
                  <p className={`text-sm p-3 rounded-md ${isNoAnswer ? 'text-danger italic bg-light-red' : 'bg-input-box'}`}>
                    {q.userAnswer || 'No answer provided.'}
                  </p>
                </div>

                {/* Evaluation details */}
                {!isNoAnswer && (
                  <div className="eval-insights flex-col gap-3 mt-2">
                    {/* Explanation */}
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wider mb-1">AI Explanation:</p>
                      <p className="text-sm text-secondary">{evalObj.explanation}</p>
                    </div>

                    {/* Better model answer */}
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wider mb-1">Model Answer Suggestion:</p>
                      <p className="text-sm model-answer-box p-3 rounded-md bg-glass border-color">
                        {evalObj.betterAnswer}
                      </p>
                    </div>

                    {/* Specific mistakes list */}
                    {evalObj.mistakes && evalObj.mistakes.length > 0 && (
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wider mb-1">Gaps / Mistakes:</p>
                        <div className="d-flex gap-2 flex-wrap">
                          {evalObj.mistakes.map((mistake, mIdx) => (
                            <span key={mIdx} className="badge badge-danger text-xs">
                              {mistake}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Specific suggestions list */}
                    {evalObj.suggestions && evalObj.suggestions.length > 0 && (
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wider mb-1 font-semibold">Suggestions:</p>
                        <ul className="suggestions-list-bullets text-xs text-secondary pl-4">
                          {evalObj.suggestions.map((sug, sIdx) => (
                            <li key={sIdx} className="mb-1">{sug}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Confidence & difficulty analysis */}
                    <div className="d-flex gap-4 mt-2">
                      <span className="text-xs text-muted">
                        Confidence Rating:{' '}
                        <span className="text-primary-color fw-700">{evalObj.confidenceRating}</span>
                      </span>
                      <span className="text-xs text-muted">
                        Evaluation Context: <span className="text-secondary fw-700">{evalObj.difficultyAnalysis}</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
