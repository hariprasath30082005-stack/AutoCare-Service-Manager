import { useState, useEffect, useMemo, useCallback } from "react";
import "./App4.css";

const questions = [
  {
    category: "React",
    question: "Which React hook is used to manage component state?",
    options: ["useEffect", "useState", "useMemo", "useRef"],
    answer: "useState",
    explanation:
      "useState lets a component store and update state, such as input values and counters.",
  },
  {
    category: "JavaScript",
    question: "Which array method creates a new array containing only items that pass a condition?",
    options: [".map()", ".forEach()", ".filter()", ".push()"],
    answer: ".filter()",
    explanation:
      "filter() returns a new array containing the elements that satisfy the condition.",
  },
  {
    category: "React",
    question: "What is the main purpose of useMemo?",
    options: [
      "To navigate between pages",
      "To cache a calculation result",
      "To create a database",
      "To style a component",
    ],
    answer: "To cache a calculation result",
    explanation:
      "useMemo can reuse a calculated value while its dependencies remain unchanged.",
  },
  {
    category: "JavaScript",
    question: "Which keyword declares a block-scoped variable that can be reassigned?",
    options: ["const", "let", "static", "fixed"],
    answer: "let",
    explanation:
      "let declares a block-scoped variable whose value can be reassigned.",
  },
  {
    category: "React",
    question: "What does useEffect commonly help you do?",
    options: [
      "Perform side effects",
      "Create HTML elements manually",
      "Replace all CSS",
      "Declare database tables",
    ],
    answer: "Perform side effects",
    explanation:
      "useEffect is used for side effects such as subscriptions, timers and synchronizing with external systems.",
  },
  {
    category: "HTML",
    question: "Which HTML element is used to create a hyperlink?",
    options: ["<link>", "<href>", "<a>", "<url>"],
    answer: "<a>",
    explanation:
      "The anchor element <a> creates a hyperlink, usually with an href attribute.",
  },
  {
    category: "CSS",
    question: "Which CSS property controls the space inside an element's border?",
    options: ["margin", "padding", "outline", "gap"],
    answer: "padding",
    explanation:
      "Padding is the space between an element's content and its border.",
  },
  {
    category: "React",
    question: "What is the purpose of useReducer?",
    options: [
      "To manage state through a reducer and dispatched actions",
      "To create CSS animations",
      "To fetch images automatically",
      "To replace HTML forms",
    ],
    answer:
      "To manage state through a reducer and dispatched actions",
    explanation:
      "useReducer manages state using a reducer function and actions dispatched to it.",
  },
  {
    category: "JavaScript",
    question: "What does the map() array method commonly return?",
    options: [
      "A new transformed array",
      "Only the first element",
      "A boolean value",
      "The original array's length",
    ],
    answer: "A new transformed array",
    explanation:
      "map() creates a new array by applying a callback to each element.",
  },
  {
    category: "React",
    question: "When can useCallback be useful?",
    options: [
      "When caching a function reference is useful",
      "When permanently saving data to a database",
      "When automatically creating CSS files",
      "When refreshing the browser",
    ],
    answer: "When caching a function reference is useful",
    explanation:
      "useCallback can preserve a function reference between renders while its dependencies remain unchanged.",
  },
];

function App4() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [submitted, setSubmitted] = useState(false);

  const question = questions[currentQuestion];

  const answeredCount = Object.keys(selectedAnswers).length;

  const score = useMemo(() => {
    return questions.reduce((total, item, index) => {
      return total + (selectedAnswers[index] === item.answer ? 1 : 0);
    }, 0);
  }, [selectedAnswers]);

  const percentage = Math.round((score / questions.length) * 100);

  const chooseAnswer = useCallback(
    (option) => {
      setSelectedAnswers((previous) => ({
        ...previous,
        [currentQuestion]: option,
      }));
    },
    [currentQuestion]
  );

  useEffect(() => {
    if (submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      setSubmitted(true);
    }
  }, [timeLeft, submitted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const handleSubmit = () => {
    const confirmed = window.confirm(
      "Are you sure you want to submit your quiz?"
    );

    if (confirmed) {
      setSubmitted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setTimeLeft(15 * 60);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <main className="app-shell">
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark">Q</div>
            <span>Quiz<span className="brand-accent">Master</span></span>
          </div>
          <span className="header-tag">ASSESSMENT PLATFORM</span>
        </header>

        <section className="result-page">
          <div className="result-card">
            <div className="result-icon">
              <span>{percentage >= 60 ? "✓" : "!"}</span>
            </div>

            <p className="eyebrow">ASSESSMENT COMPLETED</p>
            <h1>Your results are ready.</h1>
            <p className="result-description">
              Here is your performance summary for the React & Web
              Fundamentals assessment.
            </p>

            <div className="score-circle">
              <div>
                <strong>{percentage}%</strong>
                <span>Overall score</span>
              </div>
            </div>

            <div className="result-stats">
              <div className="result-stat">
                <strong>{score}/{questions.length}</strong>
                <span>Correct answers</span>
              </div>
              <div className="result-stat">
                <strong>{answeredCount}</strong>
                <span>Attempted</span>
              </div>
              <div className="result-stat">
                <strong>{questions.length - answeredCount}</strong>
                <span>Unanswered</span>
              </div>
            </div>

            <div className="result-message">
              <strong>
                {percentage >= 80
                  ? "Excellent performance!"
                  : percentage >= 60
                  ? "Good work! Keep improving."
                  : "Keep practising. You can improve!"}
              </strong>
              <p>
                Review the answers and explanations below to strengthen
                your understanding.
              </p>
            </div>

            <div className="review-list">
              <h2>Answer review</h2>

              {questions.map((item, index) => {
                const isCorrect =
                  selectedAnswers[index] === item.answer;

                return (
                  <article className="review-item" key={index}>
                    <div className="review-heading">
                      <span className="review-number">
                        Question {index + 1}
                      </span>
                      <span
                        className={`review-status ${
                          isCorrect ? "status-correct" : "status-wrong"
                        }`}
                      >
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>

                    <h3>{item.question}</h3>

                    <p className="review-answer">
                      Your answer:{" "}
                      <strong>
                        {selectedAnswers[index] || "Not answered"}
                      </strong>
                    </p>

                    {!isCorrect && (
                      <p className="correct-answer">
                        Correct answer: <strong>{item.answer}</strong>
                      </p>
                    )}

                    <p className="explanation">{item.explanation}</p>
                  </article>
                );
              })}
            </div>

            <button className="primary-button restart-button" onClick={restartQuiz}>
              Retake assessment <span>↻</span>
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">Q</div>
          <span>
            Quiz<span className="brand-accent">Master</span>
          </span>
        </div>

        <div className="header-center">
          <span className="live-dot"></span>
          Online assessment
        </div>

        <div className="header-profile">
          <div className="profile-avatar">HP</div>
          <div className="profile-details">
            <strong>Quiz Candidate</strong>
            <span>Student account</span>
          </div>
        </div>
      </header>

      <section className="page-heading">
        <div>
          <p className="breadcrumb">Assessments / Active quiz</p>
          <h1>Knowledge assessment</h1>
          <p className="page-subtitle">
            Test your understanding of React and web development.
          </p>
        </div>
        <span className="assessment-badge">IN PROGRESS</span>
      </section>

      <section className="assessment-info">
        <div className="info-item">
          <span className="info-icon">Q</span>
          <div>
            <span>Assessment</span>
            <strong>React & Web Fundamentals</strong>
          </div>
        </div>

        <div className="info-item">
          <span className="info-icon">10</span>
          <div>
            <span>Total questions</span>
            <strong>{questions.length} Questions</strong>
          </div>
        </div>

        <div className="info-item">
          <span className="info-icon">T</span>
          <div>
            <span>Time limit</span>
            <strong>15 Minutes</strong>
          </div>
        </div>

        <div className="info-item">
          <span className="info-icon">M</span>
          <div>
            <span>Total marks</span>
            <strong>{questions.length} Marks</strong>
          </div>
        </div>
      </section>

      <div className="quiz-layout">
        <section className="question-panel">
          <div className="question-toolbar">
            <span className="question-count">
              QUESTION {String(currentQuestion + 1).padStart(2, "0")}
              <span className="count-divider">/</span>
              {String(questions.length).padStart(2, "0")}
            </span>

            <span className="category-badge">{question.category}</span>
          </div>

          <div className="question-progress">
            <div
              className="question-progress-fill"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          <div className="question-content">
            <p className="question-label">Choose the best answer</p>
            <h2>{question.question}</h2>

            <div className="options-list">
              {question.options.map((option, index) => {
                const isSelected =
                  selectedAnswers[currentQuestion] === option;

                return (
                  <button
                    key={option}
                    className={`option-button ${
                      isSelected ? "option-selected" : ""
                    }`}
                    onClick={() => chooseAnswer(option)}
                    aria-pressed={isSelected}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="option-text">{option}</span>
                    <span className="option-radio">
                      {isSelected && <span />}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="question-footer">
              <button
                className="secondary-button"
                onClick={() => goToQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
              >
                <span>←</span> Previous
              </button>

              <span className="save-indicator">
                <span className="save-dot"></span>
                Answer saved automatically
              </span>

              {currentQuestion < questions.length - 1 ? (
                <button
                  className="primary-button"
                  onClick={() => goToQuestion(currentQuestion + 1)}
                >
                  Next question <span>→</span>
                </button>
              ) : (
                <button className="primary-button" onClick={handleSubmit}>
                  Submit quiz <span>✓</span>
                </button>
              )}
            </div>
          </div>
        </section>

        <aside className="sidebar">
          <section className="sidebar-card timer-card">
            <div className="sidebar-card-heading">
              <span className="sidebar-title">Time remaining</span>
              <span className="timer-symbol">◷</span>
            </div>

            <div
              className={`timer-value ${timeLeft <= 60 ? "timer-warning" : ""}`}
            >
              {formatTime(timeLeft)}
            </div>

            <p className="timer-note">
              {timeLeft <= 60
                ? "Less than one minute remaining"
                : "Manage your time carefully"}
            </p>
          </section>

          <section className="sidebar-card">
            <div className="sidebar-card-heading">
              <h3>Question overview</h3>
              <span className="overview-total">
                {answeredCount}/{questions.length}
              </span>
            </div>

            <p className="overview-description">
              Select a number to navigate between questions.
            </p>

            <div className="question-grid">
              {questions.map((item, index) => {
                const isAnswered =
                  selectedAnswers[index] !== undefined;
                const isCurrent = currentQuestion === index;

                return (
                  <button
                    key={index}
                    className={`question-number ${
                      isCurrent ? "number-current" : ""
                    } ${isAnswered ? "number-answered" : ""}`}
                    onClick={() => goToQuestion(index)}
                    aria-label={`Go to question ${index + 1}`}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="legend">
              <span>
                <i className="legend-box legend-current"></i> Current
              </span>
              <span>
                <i className="legend-box legend-answered"></i> Answered
              </span>
              <span>
                <i className="legend-box legend-unanswered"></i> Unanswered
              </span>
            </div>

            <div className="completion-section">
              <div className="completion-label">
                <span>Completion</span>
                <strong>
                  {Math.round((answeredCount / questions.length) * 100)}%
                </strong>
              </div>

              <div className="completion-track">
                <div
                  className="completion-fill"
                  style={{
                    width: `${(answeredCount / questions.length) * 100}%`,
                  }}
                />
              </div>

              <p>
                {answeredCount} of {questions.length} questions answered
              </p>
            </div>
          </section>

          <section className="help-card">
            <div className="help-icon">i</div>
            <div>
              <strong>Assessment guidelines</strong>
              <p>
                Review your answers before submitting. The timer ends
                automatically when time runs out.
              </p>
            </div>
          </section>

          <button className="sidebar-submit" onClick={handleSubmit}>
            Submit assessment <span>→</span>
          </button>
        </aside>
      </div>

      <footer className="app-footer">
        <span>QuizMaster Assessment Platform</span>
        <span>React & Web Fundamentals</span>
      </footer>
    </main>
  );
}

export default App4;
