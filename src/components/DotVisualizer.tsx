import { motion } from 'framer-motion';

interface DotVisualizerProps {
  number: number;
  color?: string;
}

const DotVisualizer: React.FC<DotVisualizerProps> = ({
  number,
  color = '#4a6bff'
}) => {
  // Maximum dots per column
  const maxDotsPerColumn = 3;

  // Calculate how many columns we need
  const columns = Math.ceil(number / maxDotsPerColumn);

  // Create a 2D array to represent the grid
  const grid: number[][] = [];

  // Fill the grid
  for (let col = 0; col < columns; col++) {
    const column: number[] = [];
    for (let row = 0; row < maxDotsPerColumn; row++) {
      const dotIndex = col * maxDotsPerColumn + row;
      if (dotIndex < number) {
        column.push(dotIndex);
      }
    }
    grid.push(column);
  }

  return (
    <div className="dot-container" style={{
      display: 'flex',
      gap: '4px',
      justifyContent: 'center',
      minHeight: '50px',
      alignItems: 'center',
      width: '100%',
      margin: '0 auto'
    }}>
      {grid.map((column, colIndex) => (
        <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center' }}>
          {column.map((dotIndex) => (
            <motion.div
              key={dotIndex}
              className="dot"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: dotIndex * 0.1,
                type: 'spring',
                stiffness: 300,
                damping: 15
              }}
              style={{
                backgroundColor: color,
                boxShadow: `0 0 5px ${color}`
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default DotVisualizer;