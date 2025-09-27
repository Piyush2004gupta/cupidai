import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';

interface LandingPageProps {
  onFindMatch: () => void;
}

export function LandingPage({ onFindMatch }: LandingPageProps) {
  const handleFindMatch = () => {
    onFindMatch();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" 
         style={{
           background: 'linear-gradient(135deg, #FF6B8A 0%, #FF8FA3 50%, #FFB3C1 100%)'
         }}>
      
      {/* Subtle Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5
            }}
            style={{
              left: `${15 + (i * 15)}%`,
              top: `${20 + (i % 2) * 40}%`
            }}
            className="absolute text-white/20 text-2xl"
          >
            💕
          </motion.div>
        ))}
      </div>

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center text-white max-w-md mx-auto relative z-10"
      >
        
        {/* Heart Icon Circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 0.2, 
            type: "spring", 
            stiffness: 200,
            damping: 15
          }}
          className="relative mx-auto mb-8 w-20 h-20 flex items-center justify-center"
        >
          {/* Subtle Glow Background */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-white/20 rounded-full blur-lg"
          />
          
          {/* Heart Icon */}
          <motion.div 
            className="relative z-10 text-5xl"
            animate={{ 
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            💖
          </motion.div>
          
          {/* Single Sparkle */}
          <motion.div
            animate={{ 
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
              scale: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-2 -right-2 text-lg"
          >
            ✨
          </motion.div>
        </motion.div>
        
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-6 leading-tight"
          style={{ 
            fontSize: 'clamp(2.5rem, 10vw, 3.5rem)',
            fontWeight: '600'
          }}
        >
          <span className="inline-block mr-2">✨</span>
          Let AI Play<br />
          Cupid
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg text-white/90 mb-4 leading-relaxed px-2"
        >
          Discover your perfect match with our intelligent compatibility system
        </motion.p>
        
        {/* Bottom Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-base text-white/80 mb-12 leading-relaxed"
        >
          Join thousands finding love through AI 💖
        </motion.p>
        
        {/* Find My Match Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, type: "spring", stiffness: 150 }}
          className="relative"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleFindMatch}
              className="relative bg-white text-pink-600 hover:bg-white/95 rounded-full px-8 py-4 text-xl shadow-2xl transition-all duration-200 group"
              style={{ 
                fontSize: '1.25rem',
                fontWeight: '600',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
              }}
              size="lg"
            >
              {/* Heart Icon */}
              <motion.span
                animate={{ 
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block mr-3"
              >
                💖
              </motion.span>
              
              Find My Match
              
              {/* Second Heart Icon */}
              <motion.span
                animate={{ 
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.7
                }}
                className="inline-block ml-3"
              >
                💞
              </motion.span>
              
              {/* Subtle Sparkle */}
              <motion.span
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-1 -right-1 text-sm"
              >
                ✨
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}