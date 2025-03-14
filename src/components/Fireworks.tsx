import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FireworkParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  distance: number;
}

interface FireworksProps {
  duration?: number;
}

const Fireworks: React.FC<FireworksProps> = ({ duration = 5000 }) => {
  const [particles, setParticles] = useState<FireworkParticle[]>([]);
  const [isActive, setIsActive] = useState(true);

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#ff0088'];

  useEffect(() => {
    // Create initial fireworks immediately
    createFireworks();

    // Create new fireworks every 800ms
    const interval = setInterval(() => {
      if (isActive) {
        createFireworks();
      }
    }, 800);

    // Stop fireworks after duration
    const timeout = setTimeout(() => {
      setIsActive(false);
      clearInterval(interval);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration]);

  const createFireworks = () => {
    const newParticles: FireworkParticle[] = [];
    const particleCount = Math.floor(Math.random() * 30) + 40; // 40-70 particles

    // Position fireworks at random locations across the screen
    const x = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1; // 10-90% of screen width
    const y = Math.random() * window.innerHeight * 0.6 + window.innerHeight * 0.1; // 10-70% of screen height

    for (let i = 0; i < particleCount; i++) {
      // Calculate angle and distance for more realistic explosion pattern
      const angle = Math.random() * Math.PI * 2; // 0 to 2π
      const distance = Math.random() * 100 + 50; // 50-150px

      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 3, // 3-9px
        angle,
        distance
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    // Remove particles after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 1500);
  };

  if (!isActive && particles.length === 0) return null;

  return (
    <div className="fireworks" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: particle.x,
            y: particle.y,
            scale: 0.2,
            opacity: 1,
            boxShadow: `0 0 8px 2px ${particle.color}`
          }}
          animate={{
            x: particle.x + Math.cos(particle.angle) * particle.distance,
            y: particle.y + Math.sin(particle.angle) * particle.distance,
            scale: 1,
            opacity: 0
          }}
          transition={{
            duration: 1.5,
            ease: [0.1, 0.3, 0.7, 1]
          }}
          style={{
            position: 'absolute',
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            backgroundColor: particle.color,
            boxShadow: `0 0 8px 2px ${particle.color}`,
            zIndex: 1000
          }}
        />
      ))}
    </div>
  );
};

export default Fireworks;