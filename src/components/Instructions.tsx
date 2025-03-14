import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import GameHistory from './GameHistory';

interface InstructionsProps {
  mode: string | null;
}

const Instructions: React.FC<InstructionsProps> = ({ mode }) => {
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);

  if (!mode) {
    navigate('/');
    return null;
  }

  const getInstructions = () => {
    switch (mode) {
      case 'mixed':
        return {
          title: 'Gra z Mieszanymi Działaniami',
          instructions: [
            'Zobaczysz 5 zadań mieszających dodawanie i odejmowanie.',
            'Każde zadanie będzie pokazywać kropki, aby pomóc Ci wizualizować liczby.',
            'Użyj klawiatury ekranowej, aby wprowadzić swoją odpowiedź.',
            'Postaraj się uzyskać co najmniej 4 poprawne odpowiedzi!',
          ],
        };
      case 'mixed100':
        return {
          title: 'Gra z Mieszanymi Działaniami do 100',
          instructions: [
            'Zobaczysz 5 zadań mieszających dodawanie i odejmowanie z liczbami do 100.',
            'Przy dodawaniu wynik będzie zawsze mniejszy niż 100.',
            'Przy odejmowaniu obie liczby będą mniejsze niż 100, a wynik zawsze większy od 0.',
            'Użyj klawiatury ekranowej, aby wprowadzić swoją odpowiedź.',
            'Postaraj się uzyskać co najmniej 4 poprawne odpowiedzi!',
          ],
        };
      case 'addition':
        return {
          title: 'Gra Tylko z Dodawaniem',
          instructions: [
            'Zobaczysz 5 zadań z dodawaniem.',
            'Każde zadanie będzie pokazywać kropki, aby pomóc Ci wizualizować liczby.',
            'Użyj klawiatury ekranowej, aby wprowadzić swoją odpowiedź.',
            'Postaraj się uzyskać co najmniej 4 poprawne odpowiedzi!',
          ],
        };
      case 'subtraction':
        return {
          title: 'Gra Tylko z Odejmowaniem',
          instructions: [
            'Zobaczysz 5 zadań z odejmowaniem.',
            'Każde zadanie będzie pokazywać kropki, aby pomóc Ci wizualizować liczby.',
            'Użyj klawiatury ekranowej, aby wprowadzić swoją odpowiedź.',
            'Postaraj się uzyskać co najmniej 4 poprawne odpowiedzi!',
          ],
        };
      default:
        return {
          title: 'Nieznany Tryb Gry',
          instructions: ['Proszę wrócić do panelu głównego i wybrać prawidłowy tryb gry.'],
        };
    }
  };

  const { title, instructions } = getInstructions();

  return (
    <motion.div
      className="instructions-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
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

        <h2 style={{
          fontSize: '1.5rem',
          margin: '0',
          flex: '1',
          textAlign: 'center'
        }}>
          {title}
        </h2>

        <div style={{ width: '31px' }}></div> {/* Spacer for balance */}
      </div>

      <div className="card" style={{ padding: '1rem 0.8rem' }}>
        <ul style={{ textAlign: 'left', paddingInlineStart: '15px', margin: '0.5rem 0' }}>
          {instructions.map((instruction, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}
            >
              {instruction}
            </motion.li>
          ))}
        </ul>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '0.8rem' }}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/play')}
        >
          Rozpocznij Grę
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowHistory(true)}
          style={{
            backgroundColor: 'var(--secondary-color)',
            color: 'white'
          }}
        >
          Historia Gier
        </motion.button>
      </div>

      {showHistory && (
        <GameHistory
          mode={mode}
          onClose={() => setShowHistory(false)}
        />
      )}
    </motion.div>
  );
};

export default Instructions;