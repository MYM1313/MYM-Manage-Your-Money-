import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color }) => {
  // Extract the color name (e.g., 'sky') from Tailwind gradient classes
  const colorName = color.split('-')[1] || 'sky';

  return (
    <div className="w-full bg-black/30 rounded-full h-2.5 overflow-hidden border border-white/5">
      <div
        className={`bg-gradient-to-r ${color} h-2.5 rounded-full transition-all duration-700 ease-out`}
        style={{ 
          width: `${progress}%`, 
          boxShadow: `0 0 10px rgba(var(--glow-${colorName}), 0.5)`
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;