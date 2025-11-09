import React from 'react';

interface IconWrapperProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const IconWrapper: React.FC<IconWrapperProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick} 
      className={`w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/20 hover:scale-105 ${className}`}
    >
      {children}
    </div>
  );
};

export default IconWrapper;