import React from 'react';

interface GlassmorphicPanelProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const GlassmorphicPanel: React.FC<GlassmorphicPanelProps> = ({ children, className = '', onClick, style }) => {
  return (
    <div
      style={style}
      onClick={onClick}
      className={`premium-glass p-6 ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {children}
    </div>
  );
};

export default GlassmorphicPanel;