import { motion } from 'motion/react';

export function DreamyBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating Hearts */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`heart-${i}`}
          className="absolute text-2xl opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            color: i % 2 === 0 ? '#FFD700' : '#DDA0DD',
            filter: 'drop-shadow(0 0 10px currentColor)',
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        >
          💖
        </motion.div>
      ))}

      {/* Floating Stars */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute text-lg opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            color: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#C0C0C0' : '#DDA0DD',
            filter: 'drop-shadow(0 0 8px currentColor)',
          }}
          animate={{
            scale: [0.5, 1.5, 0.5],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.6, 0.1],
          }}
          transition={{
            duration: 6 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        >
          {i % 4 === 0 ? '✨' : i % 4 === 1 ? '⭐' : i % 4 === 2 ? '🌟' : '💫'}
        </motion.div>
      ))}

      {/* Soft Bokeh Effects */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`bokeh-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${20 + Math.random() * 40}px`,
            height: `${20 + Math.random() * 40}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 2 === 0 
              ? 'radial-gradient(circle, rgba(255, 182, 193, 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(221, 160, 221, 0.3) 0%, transparent 70%)',
            filter: 'blur(2px)',
          }}
          animate={{
            scale: [0.8, 1.4, 0.8],
            opacity: [0.2, 0.6, 0.2],
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}