import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { getErrorMessage, getCategoryIcon } from '../../utils/helpers';
import { FiSettings, FiArrowRight, FiInfo, FiSliders, FiClock, FiHelpCircle } from 'react-icons/fi';
import { BiBrain } from 'react-icons/bi';
import toast from 'react-hot-toast';
import './InterviewSetupPage.css';

const categories = [
  { id: 'MERN', name: 'MERN Stack CS' },
  { id: 'React', name: 'React.js' },
  { id: 'Node', name: 'Node.js' },
  { id: 'Express', name: 'Express.js' },
  { id: 'MongoDB', name: 'MongoDB' },
  { id: 'JavaScript', name: 'JavaScript' },
  { id: 'HTML', name: 'HTML5' },
  { id: 'CSS', name: 'CSS3 & UI Design' },
  { id: 'C++', name: 'C++ Programming' },
  { id: 'Java', name: 'Java Core' },
  { id: 'Python', name: 'Python Core' },
  { id: 'DBMS', name: 'DBMS Core' },
  { id: 'Operating Systems', name: 'Operating Systems' },
  { id: 'Computer Networks', name: 'Computer Networks' },
  { id: 'OOP', name: 'OOP Fundamentals' },
  { id: 'SQL', name: 'SQL Querying' },
  { id: 'Data Structures', name: 'Data Structures' },
];

const InterviewSetupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: 'MERN',
    difficulty: 'Medium',
    timeLimit: 15,
    totalQuestions: 5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySelect = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      category: categoryId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const setupToast = toast.loading('Gemini is generating your personalized interview questions...');

    try {
      const { data } = await api.post('/interviews/start', formData);
      toast.success('Interview questions generated successfully!', { id: setupToast });
      navigate(`/interview/${data.interview._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err), { id: setupToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="interview-setup animate-fadeIn">
      <div className="page-header">
        <h1>Configure Mock Interview</h1>
        <p className="text-secondary">Customize your interview parameters. Gemini AI will generate questions based on your settings.</p>
      </div>

      <form onSubmit={handleSubmit} className="interview-setup-form">
        <div className="interview-setup-grid">
          {/* Left panel: Category Selection */}
          <div className="card category-selection">
            <h3 className="mb-4 d-flex align-items-center gap-2">
              <BiBrain className="text-primary-color" />
              1. Choose Topic Category
            </h3>
            <div className="category-grid">
              {categories.map((cat) => {
                const isSelected = formData.category === cat.id;
                return (
                  <div
                    key={cat.id}
                    className={`category-item-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    <span className="category-item-icon">{getCategoryIcon(cat.id)}</span>
                    <span className="category-item-name">{cat.name}</span>
                    {isSelected && <span className="selected-indicator" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel: Parameters Selection */}
          <div className="setup-params-panel flex-col gap-6">
            <div className="card">
              <h3 className="mb-4 d-flex align-items-center gap-2">
                <FiSliders className="text-primary-color" />
                2. Configure Parameters
              </h3>

              {/* Difficulty */}
              <div className="form-group">
                <label className="form-label d-flex align-items-center gap-2">
                  <span>Difficulty Level</span>
                </label>
                <div className="difficulty-toggle-group">
                  {['Easy', 'Medium', 'Hard'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      className={`difficulty-btn btn-ghost ${formData.difficulty === diff ? 'active-' + diff.toLowerCase() : ''}`}
                      onClick={() => setFormData((p) => ({ ...p, difficulty: diff }))}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count */}
              <div className="form-group mt-4">
                <label className="form-label d-flex align-items-center justify-content-between">
                  <span className="d-flex align-items-center gap-2">
                    <FiHelpCircle /> Question Count
                  </span>
                  <span className="badge badge-primary">{formData.totalQuestions} Questions</span>
                </label>
                <input
                  type="range"
                  name="totalQuestions"
                  min="3"
                  max="15"
                  value={formData.totalQuestions}
                  onChange={handleChange}
                  className="w-full mt-2 cursor-pointer accent-primary"
                  style={{ accentColor: 'var(--primary)' }}
                />
                <div className="flex-between text-xs text-muted mt-1">
                  <span>3 Questions</span>
                  <span>9 Questions</span>
                  <span>15 Questions</span>
                </div>
              </div>

              {/* Time Limit */}
              <div className="form-group mt-4">
                <label className="form-label d-flex align-items-center justify-content-between">
                  <span className="d-flex align-items-center gap-2">
                    <FiClock /> Time Limit
                  </span>
                  <span className="badge badge-secondary">{formData.timeLimit} Mins</span>
                </label>
                <input
                  type="range"
                  name="timeLimit"
                  min="5"
                  max="60"
                  step="5"
                  value={formData.timeLimit}
                  onChange={handleChange}
                  className="w-full mt-2 cursor-pointer"
                  style={{ accentColor: 'var(--secondary)' }}
                />
                <div className="flex-between text-xs text-muted mt-1">
                  <span>5 Mins</span>
                  <span>30 Mins</span>
                  <span>60 Mins</span>
                </div>
              </div>
            </div>

            {/* AI Warning Context Card */}
            <div className="card card-glass warning-card d-flex gap-3">
              <span className="warning-icon"><FiInfo /></span>
              <div>
                <h5 className="mb-1">Before starting your interview:</h5>
                <ul className="warning-list text-xs text-secondary">
                  <li>Ensure your internet connection is stable.</li>
                  <li>Questions are generated live by Gemini.</li>
                  <li>You can navigate questions back and forth.</li>
                  <li>Submitting evaluates your responses instantly.</li>
                </ul>
              </div>
            </div>

            {/* Action button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full flex-center gap-2"
              id="start-interview-btn"
            >
              {loading ? (
                <>
                  <div className="spinner" /> Generating Questions...
                </>
              ) : (
                <>
                  Launch Mock Interview <FiArrowRight />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InterviewSetupPage;
