import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface DashboardProps {
  onSelectMode: (mode: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectMode }) => {
  const navigate = useNavigate();

  const handleModeSelect = (mode: string) => {
    onSelectMode(mode);
    navigate('/instructions');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%' }}
    >
      <h2 style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>Wybierz Tryb Gry</h2>
      <div className="game-modes-container">
        <motion.div
          className="game-mode"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleModeSelect('mixed')}
          style={{ padding: '1rem', margin: '0.5rem 0' }}
        >
          <h3 className="game-mode-title" style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>Mieszane Działania</h3>
          <p className="game-mode-description" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Ćwicz dodawanie i odejmowanie z pomocą wizualną</p>
          <div className="mode-preview" style={{ fontSize: '0.9rem' }}>1 + 2 = ? i 5 - 2 = ?</div>
        </motion.div>

        <motion.div
          className="game-mode"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleModeSelect('addition')}
          style={{ padding: '1rem', margin: '0.5rem 0' }}
        >
          <h3 className="game-mode-title" style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>Tylko Dodawanie</h3>
          <p className="game-mode-description" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Ćwicz dodawanie liczb z pomocą wizualną</p>
          <div className="mode-preview" style={{ fontSize: '0.9rem' }}>1 + 2 = ?</div>
        </motion.div>

        <motion.div
          className="game-mode"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleModeSelect('subtraction')}
          style={{ padding: '1rem', margin: '0.5rem 0' }}
        >
          <h3 className="game-mode-title" style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>Tylko Odejmowanie</h3>
          <p className="game-mode-description" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Ćwicz odejmowanie liczb z pomocą wizualną</p>
          <div className="mode-preview" style={{ fontSize: '0.9rem' }}>5 - 2 = ?</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;