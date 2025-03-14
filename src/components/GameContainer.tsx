import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DotVisualizer from './DotVisualizer';
import Keypad from './Keypad';
import { generateGameProblems, MathProblem } from '../utils/problemGenerator';

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
    // Limit answer to 2 digits for simplicity
    if (userAnswer.length < 2) {
      setUserAnswer(prev => prev + key);
    }
  };

  const handleClear = () => {
    setUserAnswer('');
  };

  const handleSubmit = () => {
    if (!userAnswer || showingFeedback) return;

    const isCorrect = parseInt(userAnswer) === currentProblem.answer;

    // Show feedback
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setShowingFeedback(true);

    // Update score
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

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
        setScore(isCorrect ? correctAnswers + 1 : correctAnswers);
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
      <div className="progress">
        Zadanie {currentProblemIndex + 1} z {problems.length}
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
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px'
              }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                  {currentProblem.firstNumber}
                </div>
                <div style={{ fontSize: '1.8rem', margin: '0 2px' }}>
                  {currentProblem.operator}
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                  {currentProblem.secondNumber}
                </div>
                <div style={{ fontSize: '1.8rem', margin: '0 2px' }}>=</div>
                <div>
                  <div
                    className="answer-display"
                    style={{
                      backgroundColor: userAnswer ? 'rgba(74, 107, 255, 0.2)' : 'transparent',
                      padding: '3px 10px',
                      borderRadius: '8px',
                      minWidth: '35px',
                      minHeight: '35px',
                      display: 'flex',
                      alignItems: 'center',
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

              {/* Visual representation with dots */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                padding: '8px',
                backgroundColor: 'rgba(74, 107, 255, 0.05)',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '300px'
              }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      {currentProblem.firstNumber}
                    </div>
                    <DotVisualizer number={currentProblem.firstNumber} />
                  </div>
                  <div style={{ fontSize: '1.3rem' }}>
                    {currentProblem.operator}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      {currentProblem.secondNumber}
                    </div>
                    <DotVisualizer
                      number={currentProblem.secondNumber}
                      color={currentProblem.operator === '-' ? '#ff6b6b' : undefined}
                    />
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