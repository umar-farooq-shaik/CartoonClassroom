import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
}

interface AchievementPopupProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementPopup = ({ achievement, onClose }: AchievementPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
    }
  }, [achievement]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && achievement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-yellow-400 to-orange-400 text-center p-8 rounded-3xl shadow-2xl max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-6xl mb-4"
            >
              {achievement.icon}
            </motion.div>
            <h3 className="font-fredoka text-2xl text-white mb-2">
              Congratulations!
            </h3>
            <p className="text-white font-bold text-lg mb-2">
              {achievement.name}
            </p>
            <p className="text-white/90 mb-6">
              {achievement.description}
            </p>
            <Button
              onClick={handleClose}
              className="bg-white text-yellow-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition duration-200"
            >
              Awesome! 🎉
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
