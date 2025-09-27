import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';

interface GenderSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (gender: 'male' | 'female') => void;
}

export function GenderSelectionModal({ isOpen, onClose, onSelect }: GenderSelectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-sm mx-auto border-0 p-0 rounded-3xl shadow-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FF6B8A 0%, #FF8FA3 50%, #FFB3C1 100%)'
        }}
      >
        <DialogTitle className="sr-only">Gender Selection</DialogTitle>
        <DialogDescription className="sr-only">
          Choose your gender to begin your love journey.
        </DialogDescription>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center p-8 text-white"
        >
          {/* Heart Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative mx-auto mb-6 w-16 h-16 flex items-center justify-center"
          >
            {/* Glow Effect */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-white/20 rounded-full blur-lg"
            />
            <div className="relative z-10 text-4xl">💖</div>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl mb-3"
            style={{ fontWeight: '600' }}
          >
            Let's Get Started!
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/90 mb-8 text-base"
          >
            Choose your gender to begin your love journey
          </motion.p>

          {/* Gender Buttons */}
          <div className="space-y-4">
            {/* Male Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={() => onSelect('male')}
                className="w-full bg-white text-pink-600 hover:bg-white/95 rounded-full py-4 text-lg shadow-lg transition-all duration-200 hover:scale-[1.02]"
                style={{ fontWeight: '600' }}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-xl">👨</span>
                  <span>Male</span>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    💙
                  </motion.span>
                </div>
              </Button>
            </motion.div>

            {/* Female Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={() => onSelect('female')}
                className="w-full bg-white text-pink-600 hover:bg-white/95 rounded-full py-4 text-lg shadow-lg transition-all duration-200 hover:scale-[1.02]"
                style={{ fontWeight: '600' }}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-xl">👩</span>
                  <span>Female</span>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
                  >
                    💖
                  </motion.span>
                </div>
              </Button>
            </motion.div>
          </div>

          {/* Bottom Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-white/80 text-sm"
          >
            Love is just one click away! ✨
          </motion.p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}