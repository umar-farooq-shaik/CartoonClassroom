import { useEffect, useState } from 'react';

const icons = [
  { icon: '⭐', top: '10%', left: '10%', animation: 'animate-float', delay: '0s' },
  { icon: '💖', top: '20%', right: '15%', animation: 'animate-pulse-slow', delay: '1s' },
  { icon: '📚', top: '60%', left: '5%', animation: 'animate-bounce-slow', delay: '2s' },
  { icon: '🚀', bottom: '30%', right: '10%', animation: 'animate-float', delay: '0.5s' },
  { icon: '🌈', top: '40%', left: '85%', animation: 'animate-pulse-slow', delay: '1.5s' },
  { icon: '☁️', bottom: '60%', left: '20%', animation: 'animate-float', delay: '2.5s' },
];

export const FloatingIcons = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {icons.map((iconData, index) => (
        <div
          key={index}
          className={`absolute text-4xl opacity-30 ${iconData.animation}`}
          style={{
            top: iconData.top,
            left: iconData.left,
            right: iconData.right,
            bottom: iconData.bottom,
            animationDelay: iconData.delay,
          }}
        >
          {iconData.icon}
        </div>
      ))}
    </div>
  );
};
