import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Fireworks from './Fireworks';
import { useEffect, useState, useRef } from 'react';

interface ResultScreenProps {
  score: number;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score }) => {
  const navigate = useNavigate();
  const totalProblems = 5;
  const percentage = (score / totalProblems) * 100;
  const isHighScore = percentage >= 80;
  const [showFireworks, setShowFireworks] = useState(false);
  const [easterEggClicked, setEasterEggClicked] = useState(false);
  const [easterEggCount, setEasterEggCount] = useState(0);
  const [fireworksKey, setFireworksKey] = useState(Date.now());
  const timeoutsRef = useRef<number[]>([]);

  // Cleanup function
  const cleanup = () => {
    timeoutsRef.current.forEach(id => window.clearTimeout(id));
    timeoutsRef.current = [];
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // Show fireworks after component mounts
  useEffect(() => {
    if (isHighScore) {
      const timer = window.setTimeout(() => {
        setShowFireworks(true);
      }, 300);

      timeoutsRef.current.push(timer);
    }
  }, [isHighScore]);

  // Determine fireworks intensity based on score and easter egg clicks
  const getFireworksIntensity = () => {
    if (easterEggCount >= 3) return 'extreme';
    if (easterEggCount > 0) return 'high';
    if (percentage === 100) return 'high';
    return 'normal';
  };

  // Handle easter egg click
  const handleEasterEggClick = () => {
    // Increment counter
    setEasterEggCount(prev => prev + 1);

    // Show animation
    setEasterEggClicked(true);
    const timer = window.setTimeout(() => {
      setEasterEggClicked(false);
    }, 500);
    timeoutsRef.current.push(timer);

    // Reset fireworks
    setShowFireworks(false);
    const resetTimer = window.setTimeout(() => {
      setFireworksKey(Date.now());
      setShowFireworks(true);
    }, 100);
    timeoutsRef.current.push(resetTimer);
  };

  // Handle navigation
  const handleNavigate = (path: string) => {
    cleanup();
    setShowFireworks(false);
    navigate(path);
  };

  return (
    <motion.div
      className="result-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>Gra Zakończona!</h2>

      <div className="card" style={{ padding: '1rem' }}>
        <h3 style={{ fontSize: '1.3rem', margin: '0.3rem 0' }}>Twój Wynik</h3>
        <motion.div
          className="score"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 15,
            delay: 0.3
          }}
          style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}
        >
          {score} / {totalProblems}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ fontSize: '0.9rem', margin: '0.5rem 0' }}
        >
          {isHighScore ? (
            <>
              Świetna robota! Jesteś matematyczną gwiazdą!{' '}
              <motion.span
                onClick={handleEasterEggClick}
                className={`easter-egg-icon ${easterEggClicked ? 'clicked' : ''}`}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                🌟
              </motion.span>
            </>
          ) : (
            <>
              Dobry wysiłek! Kontynuuj ćwiczenia!{' '}
              <motion.span
                onClick={handleEasterEggClick}
                className={`easter-egg-icon ${easterEggClicked ? 'clicked' : ''}`}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                💪
              </motion.span>
            </>
          )}
        </motion.p>

        {easterEggCount >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: '0.8rem',
              color: '#ff6b6b',
              marginTop: '5px',
              fontStyle: 'italic'
            }}
          >
            Odkryłeś sekretny tryb fajerwerków! 🎉
          </motion.div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleNavigate('/play')}
          style={{ fontSize: '0.9rem', padding: '0.6rem 1rem' }}
        >
          Zagraj Ponownie
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleNavigate('/')}
          style={{ fontSize: '0.9rem', padding: '0.6rem 1rem' }}
        >
          Powrót do Menu
        </motion.button>
      </div>

      {showFireworks && (
        <Fireworks
          key={fireworksKey}
          duration={6000}
          intensity={getFireworksIntensity()}
        />
      )}
    </motion.div>
  );
};

export default ResultScreen;