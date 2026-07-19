import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { getErrorMessage, formatTime, getCategoryIcon } from '../../utils/helpers';
import {
  FiClock, FiChevronLeft, FiChevronRight, FiSave, FiAlertCircle,
  FiSend, FiArrowRight, FiCheckCircle
} from 'react-icons/fi';
import { BiBrain } from 'react-icons/bi';
import toast from 'react-hot-toast';
import './InterviewPage.css';

const InterviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState({});
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const timerRef = useRef(null);

  // Fetch interview details
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const { data } = await api.get(`/interviews/${id}`);
        setInterview(data.interview);
        setTimeLeft(data.interview.timeLimit * 60);

        // Prepopulate answers if any already saved
        const initialAnswers = {};
        data.interview.questions.forEach((q, idx) => {
          if (q.isAnswered) {
            initialAnswers[idx] = q.userAnswer || '';
          }
        });
        setAnswers(initialAnswers);
      } catch (err) {
        toast.error('Failed to load interview details.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id, navigate]);

  // Start timer count down
  useEffect(() => {
    if (loading || !interview) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, interview]);

  const handleAnswerChange = (e) => {
    setAnswers((prev) => ({
      ...prev,
      [activeIdx]: e.target.value,
    }));
  };

  // Submit active answer to backend (evaluated by Gemini live)
  const saveAnswer = async (index) => {
    const ansText = answers[index] || '';
    if (!ansText.trim()) {
      toast.error('Please write an answer before saving.');
      return;
    }

    setSaving((prev) => ({ ...prev, [index]: true }));
    const saveToast = toast.loading('Gemini is evaluating your answer...');

    try {
      const { data } = await api.post(`/interviews/${id}/answer`, {
        questionIndex: index,
        answer: ansText,
        timeTaken: 60, // approximate or calculate per question if needed
      });

      setInterview((prev) => {
        const updatedQs = [...prev.questions];
        updatedQs[index] = {
          ...updatedQs[index],
          isAnswered: true,
          userAnswer: ansText,
          aiEvaluation: data.evaluation,
        };
        return { ...prev, questions: updatedQs };
      });

      toast.success('Answer saved and evaluated!', { id: saveToast });
    } catch (err) {
      toast.error(getErrorMessage(err), { id: saveToast });
    } finally {
      setSaving((prev) => ({ ...prev, [index]: false }));
    }
  };

  const nextQuestion = () => {
    if (activeIdx < interview.questions.length - 1) {
      setActiveIdx((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (activeIdx > 0) {
      setActiveIdx((prev) => prev - 1);
    }
  };

  // Complete entire interview flow
  const completeInterview = async () => {
    // Confirm if not all answered
    const unansweredCount = interview.questions.filter((q) => !q.isAnswered).length;
    if (unansweredCount > 0) {
      const confirmEnd = window.confirm(
        `You have ${unansweredCount} unanswered questions. Are you sure you want to finish the interview?`
      );
      if (!confirmEnd) return;
    }

    const submitToast = toast.loading('Calculating final scores and generating detailed career insights...');

    try {
      const totalTimeUsed = interview.timeLimit * 60 - timeLeft;
      await api.post(`/interviews/${id}/complete`, {
        timeTakenTotal: totalTimeUsed,
      });

      toast.success('Interview completed!', { id: submitToast });
      navigate(`/interview/${id}/complete`);
    } catch (err) {
      toast.error(getErrorMessage(err), { id: submitToast });
    }
  };

  const handleAutoSubmit = async () => {
    toast.error('Time is up! Submitting your interview response automatically.');
    try {
      await api.post(`/interviews/${id}/complete`, {
        timeTakenTotal: interview.timeLimit * 60,
      });
      navigate(`/interview/${id}/complete`);
    } catch (err) {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="interview-loading flex-center flex-col gap-4">
        <div className="spinner spinner-lg" />
        <p className="text-muted">Loading live interview board...</p>
      </div>
    );
  }

  const currentQuestion = interview.questions[activeIdx];
  const progressPercent = Math.round(
    (interview.questions.filter((q) => q.isAnswered).length / interview.questions.length) * 100
  );

  return (
    <div className="interview-flow animate-fadeIn">
      {/* Top Header */}
      <header className="interview-flow-header flex-between">
        <div className="d-flex align-items-center gap-3">
          <span className="interview-header-icon">{getCategoryIcon(interview.category)}</span>
          <div>
            <h3>{interview.category} Mock Interview</h3>
            <p className="text-xs text-muted">
              Difficulty: <span className="text-secondary fw-600">{interview.difficulty}</span>
            </p>
          </div>
        </div>

        {/* Timer */}
        <div className={`interview-timer flex-center gap-2 ${timeLeft < 120 ? 'timer-danger pulse' : ''}`}>
          <FiClock />
          <span className="fw-700">{formatTime(timeLeft)}</span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="interview-progress-bar-container mb-6">
        <div className="progress-bar-wrapper">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="flex-between text-xs text-muted mt-1">
          <span>Progress: {progressPercent}%</span>
          <span>
            {interview.questions.filter((q) => q.isAnswered).length} of {interview.questions.length} Answered
          </span>
        </div>
      </div>

      {/* Main Panel layout */}
      <div className="interview-board">
        {/* Left Side: Question Navigation */}
        <div className="card question-nav-panel">
          <h4 className="mb-4">Questions Board</h4>
          <div className="question-list-group">
            {interview.questions.map((q, idx) => {
              const isActive = activeIdx === idx;
              const isAnswered = q.isAnswered;
              return (
                <button
                  key={q._id}
                  type="button"
                  className={`question-nav-btn flex-between ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveIdx(idx)}
                >
                  <span className="text-sm">Question {idx + 1}</span>
                  {isAnswered ? (
                    <FiCheckCircle className="text-success" />
                  ) : (
                    <span className="unanswered-dot" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="divider" />

          <button
            type="button"
            className="btn btn-danger w-full flex-center gap-2"
            onClick={completeInterview}
            id="finish-interview-btn"
          >
            Finish & Submit <FiSend />
          </button>
        </div>

        {/* Right Side: Active Question Text & Answer Input */}
        <div className="flex-col gap-6">
          <div className="card question-content-card">
            <div className="flex-between mb-4">
              <span className="badge badge-primary">Active Question {activeIdx + 1}</span>
              {currentQuestion.isAnswered && (
                <span className="badge badge-success">Saved & Scored</span>
              )}
            </div>
            <p className="question-text">{currentQuestion.questionText}</p>
          </div>

          <div className="card answer-input-card">
            <label className="form-label mb-2 d-flex align-items-center justify-content-between">
              <span>Write your response:</span>
              <span className="text-muted text-xs">Be as detailed as possible</span>
            </label>
            <textarea
              className="form-textarea answer-textarea"
              placeholder="Type your answer here..."
              value={answers[activeIdx] || ''}
              onChange={handleAnswerChange}
            />

            <div className="flex-between mt-4">
              <div className="d-flex gap-2">
                <button
                  type="button"
                  disabled={activeIdx === 0}
                  className="btn btn-ghost btn-sm"
                  onClick={prevQuestion}
                >
                  <FiChevronLeft /> Prev
                </button>
                <button
                  type="button"
                  disabled={activeIdx === interview.questions.length - 1}
                  className="btn btn-ghost btn-sm"
                  onClick={nextQuestion}
                >
                  Next <FiChevronRight />
                </button>
              </div>

              <button
                type="button"
                disabled={saving[activeIdx]}
                className="btn btn-secondary btn-sm flex-center gap-2"
                onClick={() => saveAnswer(activeIdx)}
                id="save-answer-btn"
              >
                {saving[activeIdx] ? (
                  <>
                    <div className="spinner" /> Evaluating...
                  </>
                ) : (
                  <>
                    Save Answer <FiSave />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick instructions context */}
          <div className="card card-glass instruction-card flex-center gap-2">
            <FiAlertCircle className="text-secondary" />
            <p className="text-xs text-muted">
              Note: Saving your answer calls Google Gemini to grade it. You can overwrite and re-save if you want to modify your answer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
