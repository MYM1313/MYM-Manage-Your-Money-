import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color }) => {
  return (
    <div className="w-full bg-black/30 rounded-full h-2.5 overflow-hidden">
      <div
        className={`bg-gradient-to-r ${color} h-2.5 rounded-full transition-all duration-500 ease-in-out`}
        style={{ width: `${progress}%`, boxShadow: `0 0 8px 1px ${color.split(' ')[0].replace('from-','').replace('-400','-500/50')}` }}
      ></div>
    </div>
  );
};

export default ProgressBar;