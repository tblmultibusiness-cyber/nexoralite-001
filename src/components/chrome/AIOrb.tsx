import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

interface AIOrbProps {
  onOpen: () => void;
}

export function AIOrb({ onOpen }: AIOrbProps) {
  const [pulse, setPulse] = useState(true);

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label="Open AI companion"
      className="fixed bottom-20 right-4 z-30 w-14 h-14 rounded-full nexora-glow bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg"
      whileTap={{ scale: 0.9 }}
      animate={pulse ? { scale: [1, 1.06, 1] } : {}}
      transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
      onAnimationComplete={() => setPulse(true)}
    >
      <Sparkles className="w-6 h-6 text-white" />
    </motion.button>
  );
}
