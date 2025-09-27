import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

interface MatchRevealProps {
  selectedGender: 'male' | 'female';
  onStartOver: () => void;
}

interface ConfettiHeart {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
}

export function MatchReveal({ selectedGender, onStartOver }: MatchRevealProps) {
  const [confetti, setConfetti] = useState<ConfettiHeart[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 390, height: 800 }); // Mobile-first defaults

  useEffect(() => {
    // Set window size safely
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    const confettiArray: ConfettiHeart[] = [];
    const colors = ['💖', '💕', '💝', '❤️', '💗', '💓'];
    
    for (let i = 0; i < 50; i++) {
      confettiArray.push({
        id: i,
        x: Math.random() * windowSize.width,
        y: -50,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setConfetti(confettiArray);
  }, [windowSize]);

  const mockMatch = {
    name: selectedGender === 'male' ? 'Alex Johnson' : 'Emily Chen',
    age: selectedGender === 'male' ? 28 : 26,
    interests: selectedGender === 'male' 
      ? 'Photography, Hiking, Coffee, Travel' 
      : 'Art, Yoga, Cooking, Books',
    bio: selectedGender === 'male'
      ? 'Adventure seeker with a passion for capturing moments. Love discovering new coffee shops and exploring nature trails.'
      : 'Creative soul who finds joy in simple pleasures. Always up for trying new recipes or getting lost in a good book.',
    compatibility: 94,
  };

  return (
    <div className="min-h-screen romantic-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti Hearts */}
      {confetti.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-2xl pointer-events-none"
          style={{
            left: heart.x,
            scale: heart.scale,
          }}
          initial={{ y: heart.y, rotation: 0 }}
          animate={{ 
            y: windowSize.height + 100, 
            rotation: heart.rotation + 360 
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {heart.color}
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0, opacity: 0, rotateY: 180 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 15,
          delay: 0.5 
        }}
      >
        <Card className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-red-500 p-6 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 200 }}
              className="text-6xl mb-2"
            >
              ✨
            </motion.div>
            <h2 className="text-2xl mb-1">It's a Match!</h2>
            <p className="text-pink-100">AI Cupid found your perfect match</p>
          </div>
          
          <CardContent className="p-6">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center mb-6"
            >
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-pink-200 to-red-200 rounded-full flex items-center justify-center text-4xl">
                {selectedGender === 'male' ? '👨' : '👩'}
              </div>
              <h3 className="text-xl mb-1">{mockMatch.name}, {mockMatch.age}</h3>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-green-500">●</span>
                <span className="text-sm text-gray-600">{mockMatch.compatibility}% compatible</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="space-y-4 mb-6"
            >
              <div>
                <h4 className="text-sm text-gray-500 mb-1">Interests</h4>
                <p className="text-sm">{mockMatch.interests}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500 mb-1">About</h4>
                <p className="text-sm text-gray-700">{mockMatch.bio}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="space-y-3"
            >
              <Button className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-3">
                Start Chatting 💬
              </Button>
              <Button 
                variant="outline" 
                onClick={onStartOver}
                className="w-full rounded-xl"
              >
                Find Another Match ✨
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}