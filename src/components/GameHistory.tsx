import { useState } from 'react';
import { motion } from 'framer-motion';
import { GameExecution, getGameExecutions, clearGameExecutions, formatTimestamp } from '../utils/localStorage';

interface GameHistoryProps {
  mode: string | null;
  onClose: () => void;
}

const GameHistory: React.FC<GameHistoryProps> = ({ mode, onClose }) => {
  const [gameHistory, setGameHistory] = useState<GameExecution[]>(
    mode ? getGameExecutions(mode) : []
  );

  const handleClearHistory = () => {
    if (mode) {
      clearGameExecutions(mode);
      setGameHistory([]);
    }
  };

  if (!mode) {
    return null;
  }

  return (
    <motion.div
      className="game-history-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <motion.div
        className="game-history-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          maxWidth: '90%',
          width: '600px',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#f0f0f0',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#333'
          }}
          onClick={onClose}
        >
          X
        </button>

        <h2 style={{ marginTop: '0', textAlign: 'center' }}>Historia Gier</h2>

        {gameHistory.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>
            Brak historii dla tego trybu gry.
          </p>
        ) : (
          <>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <button
                onClick={handleClearHistory}
                style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Wyczyść Historię
              </button>
            </div>

            <div className="game-history-list">
              {gameHistory.slice().reverse().map((game) => (
                <details
                  key={game.id}
                  style={{
                    marginBottom: '15px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '10px',
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <summary style={{
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '5px'
                  }}>
                    <span>
                      {formatTimestamp(game.timestamp)}
                    </span>
                    <span style={{
                      backgroundColor: game.correctAnswers >= game.totalProblems * 0.8 ? '#4caf50' : '#ff9800',
                      color: 'white',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '0.9rem'
                    }}>
                      {game.correctAnswers} / {game.totalProblems}
                    </span>
                  </summary>

                  <div style={{ marginTop: '10px', padding: '0 10px' }}>
                    {game.wrongAnswers.length > 0 ? (
                      <>
                        <h4 style={{ marginBottom: '10px', color: '#d32f2f' }}>
                          Niepoprawne odpowiedzi:
                        </h4>
                        <ul style={{ paddingLeft: '20px', margin: '0' }}>
                          {game.wrongAnswers.map((problem, index) => (
                            <li key={index} style={{ marginBottom: '8px' }}>
                              <span style={{ fontWeight: 'bold' }}>
                                {problem.firstNumber} {problem.operator} {problem.secondNumber} =
                              </span>
                              <span style={{
                                textDecoration: 'line-through',
                                color: '#d32f2f',
                                marginLeft: '5px',
                                marginRight: '5px'
                              }}>
                                {game.userAnswers[index]}
                              </span>
                              <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
                                (poprawna: {problem.answer})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p style={{ color: '#4caf50', fontWeight: 'bold' }}>
                        Wszystkie odpowiedzi poprawne! 🎉
                      </p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default GameHistory;