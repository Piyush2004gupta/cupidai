import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './components/ui/button';

export default function TestApp() {
  return (
    <div className="min-h-screen romantic-gradient flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-white"
      >
        <h1 className="text-4xl mb-4">✨ Test App ✨</h1>
        <p className="text-xl mb-8">Testing basic functionality</p>
        <Button className="bg-white text-pink-600 rounded-full px-8 py-4">
          Test Button
        </Button>
      </motion.div>
    </div>
  );
}