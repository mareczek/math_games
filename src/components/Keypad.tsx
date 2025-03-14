import { motion } from 'framer-motion';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onSubmit: () => void;
  onClear: () => void;
}

const Keypad: React.FC<KeypadProps> = ({ onKeyPress, onSubmit, onClear }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="keypad-container" style={{
      width: '100%',
      maxWidth: '250px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div className="keypad" style={{ width: '100%' }}>
        {keys.map((key) => (
          <motion.button
            key={key}
            className="keypad-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onKeyPress(key)}
            style={{ padding: '8px 0' }}
          >
            {key}
          </motion.button>
        ))}
        <motion.button
          className="keypad-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClear}
          style={{ backgroundColor: '#ff6b6b', padding: '8px 0' }}
        >
          C
        </motion.button>
      </div>
      <motion.button
        className="submit-button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onSubmit}
        style={{
          width: '100%',
          marginTop: '8px',
          padding: '10px',
          fontSize: '1.1rem'
        }}
      >
        Zatwierdź
      </motion.button>
    </div>
  );
};

export default Keypad;