import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Fireworks from './Fireworks';
import { useEffect, useState } from 'react';

interface ResultScreenProps {
  score: number;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score }) => {
  const navigate = useNavigate();
  const totalProblems = 5;
  const percentage = (score / totalProblems) * 100;
  const isHighScore = percentage >= 80;
  const [showFireworks, setShowFireworks] = useState(false);

  // Delay showing fireworks to ensure they appear after the component is fully mounted
  useEffect(() => {
    if (isHighScore) {
      const timer = setTimeout(() => {
        setShowFireworks(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isHighScore]);

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
          {isHighScore
            ? "Świetna robota! Jesteś matematyczną gwiazdą! 🌟"
            : "Dobry wysiłek! Kontynuuj ćwiczenia! 💪"}
        </motion.p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/play')}
          style={{ fontSize: '0.9rem', padding: '0.6rem 1rem' }}
        >
          Zagraj Ponownie
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/')}
          style={{ fontSize: '0.9rem', padding: '0.6rem 1rem' }}
        >
          Powrót do Menu
        </motion.button>
      </div>

      {showFireworks && <Fireworks duration={8000} />}
    </motion.div>
  );
};

export default ResultScreen;