import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Keypad from './Keypad';
import DotVisualizer from './DotVisualizer';
import { generateGameProblems, MathProblem } from '../utils/problemGenerator';
import { saveGameExecution } from '../utils/localStorage';

interface GameContainerProps {
  mode: string | null;
  setScore: (score: number) => void;
}

const GameContainer: React.FC<GameContainerProps> = ({ mode, setScore }) => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<MathProblem[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  // Redirect to dashboard if no mode is selected
  useEffect(() => {
    if (!mode) {
      navigate('/');
      return;
    }

    // Generate problems for the game session
    setProblems(generateGameProblems(mode));
  }, [mode, navigate]);

  const currentProblem = problems[currentProblemIndex];

  const handleKeyPress = (key: string) => {
    // For mixed100 mode, allow up to 3 digits, otherwise limit to 2 digits
    const maxDigits = mode === 'mixed100' ? 3 : 2;
    if (userAnswer.length < maxDigits) {
      setUserAnswer(prev => prev + key);
    }
  };

  const handleClear = () => {
    setUserAnswer('');
  };

  const handleSubmit = () => {
    if (!userAnswer || showingFeedback) return;

    const isCorrect = parseInt(userAnswer) === currentProblem.answer;
    const currentUserAnswer = parseInt(userAnswer);

    // Show feedback
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setShowingFeedback(true);

    // Update score and track wrong answers
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      setWrongAnswers(prev => [...prev, currentProblem]);
    }

    // Track user answers
    setUserAnswers(prev => [...prev, currentUserAnswer]);

    // Move to next problem or end game after a delay
    // Give more time for incorrect answers
    const feedbackDelay = isCorrect ? 1500 : 3000;

    setTimeout(() => {
      setShowingFeedback(false);
      setUserAnswer('');

      if (currentProblemIndex < problems.length - 1) {
        setCurrentProblemIndex(prev => prev + 1);
        setFeedback(null);
      } else {
        // Game complete
        const finalScore = isCorrect ? correctAnswers + 1 : correctAnswers;

        // Save game execution to localStorage
        if (mode) {
          saveGameExecution(
            mode,
            finalScore,
            problems.length,
            wrongAnswers.concat(isCorrect ? [] : [currentProblem]),
            userAnswers.concat(currentUserAnswer)
          );
        }

        setScore(finalScore);
        navigate('/results');
      }
    }, feedbackDelay);
  };

  if (!currentProblem) {
    return <div>Ładowanie...</div>;
  }

  return (
    <motion.div
      className="game-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginBottom: '20px'
      }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          style={{
            fontSize: '0.8rem',
            padding: '5px 10px',
            backgroundColor: 'var(--secondary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '15px'
          }}
        >
          ←
        </motion.button>

        <div className="progress" style={{
          flex: '1',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          Zadanie {currentProblemIndex + 1} z {problems.length}
        </div>

        <div style={{ width: '31px' }}></div> {/* Spacer for balance */}
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="problem-display">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProblemIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              {/* Problem equation display */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%'
              }}>
                {/* Main container for equation and visualizers */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  gap: '10px',
                  width: '100%'
                }}>
                  {/* First number with visualizer */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', alignSelf: 'flex-end' }}>
                      {currentProblem.firstNumber}
                    </div>

                    {mode !== 'mixed100' && (
                      <div style={{
                        backgroundColor: 'rgba(74, 107, 255, 0.1)',
                        padding: '5px 10px',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <DotVisualizer number={currentProblem.firstNumber} color="#4a6bff" />
                      </div>
                    )}
                  </div>

                  {/* Operator */}
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    margin: '0 8px',
                    lineHeight: '1',
                    alignSelf: 'flex-start',
                    paddingBottom: mode !== 'mixed100' ? '30px' : '0' // Add padding to align with visualizers
                  }}>
                    {currentProblem.operator}
                  </div>

                  {/* Second number with visualizer */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', alignSelf: 'flex-start' }}>
                      {currentProblem.secondNumber}
                    </div>

                    {mode !== 'mixed100' && (
                      <div style={{
                        backgroundColor: 'rgba(255, 74, 107, 0.1)',
                        padding: '5px 10px',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <DotVisualizer number={currentProblem.secondNumber} color="#ff4a6b" />
                      </div>
                    )}
                  </div>

                  {/* Equals sign */}
                  <div style={{
                    fontSize: '1.8rem',
                    margin: '0 2px',
                    alignSelf: 'flex-start',
                    paddingBottom: mode !== 'mixed100' ? '30px' : '0' // Add padding to align with visualizers
                  }}>=</div>

                  {/* Answer box */}
                  <div style={{
                    alignSelf: 'flex-start',
                    paddingBottom: mode !== 'mixed100' ? '30px' : '0' // Add padding to align with visualizers
                  }}>
                    <div
                      className="answer-display"
                      style={{
                        backgroundColor: userAnswer ? 'rgba(74, 107, 255, 0.2)' : 'transparent',
                        padding: '3px 10px',
                        borderRadius: '8px',
                        minWidth: '35px',
                        minHeight: '35px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.8rem',
                        border: userAnswer ? '2px solid var(--primary-color)' : '2px dashed #ccc'
                      }}
                    >
                      {userAnswer || '?'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Feedback container with fixed height to prevent layout shifts */}
        <div className="feedback-container" style={{
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          margin: '10px 0'
        }}>
          {showingFeedback ? (
            <motion.div
              className={`feedback ${feedback}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              style={{ textAlign: 'center', width: '100%' }}
            >
              {feedback === 'correct' ? (
                '✓ Poprawnie!'
              ) : (
                <div>
                  <span>✗ Niepoprawnie. Prawidłowa odpowiedź to </span>
                  <motion.span
                    initial={{ backgroundColor: 'rgba(244, 67, 54, 0.2)' }}
                    animate={{ backgroundColor: 'rgba(244, 67, 54, 0.4)' }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      display: 'inline-block'
                    }}
                  >
                    {currentProblem.answer}
                  </motion.span>
                </div>
              )}
            </motion.div>
          ) : (
            <div style={{ height: '24px' }}></div>
          )}
        </div>

        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Keypad
            onKeyPress={handleKeyPress}
            onClear={handleClear}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default GameContainer;