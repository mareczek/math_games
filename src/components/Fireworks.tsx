import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface FireworkParticle {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  distance: number;
  delay: number;
  duration: number;
  trail?: boolean;
}

interface FireworksProps {
  duration?: number;
  intensity?: 'normal' | 'high' | 'extreme';
}

// Simple utility to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

const Fireworks: React.FC<FireworksProps> = ({
  duration = 5000,
  intensity = 'extreme'
}) => {
  const [particles, setParticles] = useState<FireworkParticle[]>([]);
  const [isActive, setIsActive] = useState(true);
  const timeoutsRef = useRef<number[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  // Color palette
  const colors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#ff8800', '#ff0088', '#88ff00', '#00ff88'
  ];

  // Intensity settings
  const settings = {
    normal: {
      particleCount: 30,
      fireworkInterval: 1000,
      maxFireworks: 2
    },
    high: {
      particleCount: 40,
      fireworkInterval: 800,
      maxFireworks: 3
    },
    extreme: {
      particleCount: 50,
      fireworkInterval: 600,
      maxFireworks: 4
    }
  }[intensity];

  // Clear all timeouts
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(id => window.clearTimeout(id));
    timeoutsRef.current = [];

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  // Create a single firework
  const createFirework = () => {
    if (!mountedRef.current || !isActive) return;

    // Position fireworks at random locations
    const x = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
    const y = Math.random() * window.innerHeight * 0.5 + window.innerHeight * 0.1;

    // Select a dominant color
    const color = colors[Math.floor(Math.random() * colors.length)];

    const newParticles: FireworkParticle[] = [];

    // Create particles
    for (let i = 0; i < settings.particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 100 + 50;
      const size = Math.random() * 6 + 2;
      const duration = Math.random() * 0.8 + 0.8;
      const delay = Math.random() * 0.2;

      newParticles.push({
        id: generateId(),
        x,
        y,
        color,
        size,
        angle,
        distance,
        delay,
        duration
      });
    }

    setParticles(prev => [...prev, ...newParticles]);

    // Remove particles after animation
    const timeout = window.setTimeout(() => {
      if (mountedRef.current) {
        setParticles(prev => prev.filter(p => !newParticles.includes(p)));
      }
    }, 2000);

    timeoutsRef.current.push(timeout);
  };

  // Animation loop
  useEffect(() => {
    mountedRef.current = true;
    let lastFireworkTime = 0;
    let fireworkCount = 0;

    // Create initial firework
    createFirework();

    // Animation frame loop
    const animate = (time: number) => {
      if (!mountedRef.current || !isActive) return;

      // Create new fireworks at intervals
      if (time - lastFireworkTime > settings.fireworkInterval && fireworkCount < settings.maxFireworks) {
        createFirework();
        lastFireworkTime = time;
        fireworkCount++;

        // Reset firework count periodically
        const resetTimeout = window.setTimeout(() => {
          fireworkCount = Math.max(0, fireworkCount - 1);
        }, 1500);

        timeoutsRef.current.push(resetTimeout);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Stop fireworks after duration
    const durationTimeout = window.setTimeout(() => {
      if (mountedRef.current) {
        setIsActive(false);
      }
    }, duration);

    timeoutsRef.current.push(durationTimeout);

    // Cleanup on unmount
    return () => {
      mountedRef.current = false;
      clearAllTimeouts();
      setParticles([]);
    };
  }, [duration, settings.fireworkInterval, settings.maxFireworks]);

  // Cleanup when animation is no longer active
  useEffect(() => {
    if (!isActive && particles.length === 0) {
      clearAllTimeouts();
    }
  }, [isActive, particles.length]);

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
            scale: 0.1,
            opacity: 1
          }}
          animate={{
            x: particle.x + Math.cos(particle.angle) * particle.distance,
            y: particle.y + Math.sin(particle.angle) * particle.distance,
            scale: 1,
            opacity: 0
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: [0.1, 0.3, 0.7, 1]
          }}
          style={{
            position: 'absolute',
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size}px ${particle.size/2}px ${particle.color}`,
            willChange: 'transform, opacity'
          }}
        />
      ))}
    </div>
  );
};

export default Fireworks;