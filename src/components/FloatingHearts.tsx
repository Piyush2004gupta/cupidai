import { motion } from 'motion/react';
import { useEffect, useState, useMemo } from 'react';

interface Heart {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

export function FloatingHearts() {
  const [windowHeight, setWindowHeight] = useState(800); // Default fallback
  const [isClient, setIsClient] = useState(false);

  // Memoize hearts to prevent recreation on every render
  const hearts = useMemo<Heart[]>(() => {
    const heartArray: Heart[] = [];
    for (let i = 0; i < 8; i++) { // Reduced from 15 to 8 for better performance
      heartArray.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5, // Reduced delay range
        duration: 6 + Math.random() * 2, // Reduced duration range
        size: 14 + Math.random() * 6,
      });
    }
    return heartArray;
  }, []);

  useEffect(() => {
    setIsClient(true);
    
    // Set window height safely
    if (typeof window !== 'undefined') {
      setWindowHeight(window.innerHeight);
      
      const handleResize = () => setWindowHeight(window.innerHeight);
      window.addEventListener('resize', handleResize, { passive: true });
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Don't render on server or if window is not available
  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-white/15 select-none"
          style={{
            left: `${heart.x}%`,
            fontSize: `${heart.size}px`,
            willChange: 'transform',
          }}
          initial={{ y: windowHeight + 50, opacity: 0 }}
          animate={{
            y: -100,
            rotate: [0, 180, 360],
            opacity: [0, 0.6, 0.6, 0],
            x: [0, Math.random() * 50 - 25], // Add slight horizontal drift
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: Math.random() * 2,
          }}
        >
          💕
        </motion.div>
      ))}
    </div>
  );
}