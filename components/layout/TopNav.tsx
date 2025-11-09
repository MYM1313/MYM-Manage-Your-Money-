import React, { useContext } from 'react';
import { BellIcon } from '../icons/BellIcon';
import { UserIcon } from '../icons/UserIcon';
import IconWrapper from '../shared/IconWrapper';
import { Tab } from '../../types';
import { FinancialContext } from '../../App';

interface TopNavProps {
  setActiveTab: (tab: Tab | string) => void;
}

const Logo: React.FC = () => (
    <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="goldArrowGradient" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>
            <linearGradient id="barGradient" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0E7490" />
            </linearGradient>
            <filter id="goldGlow" x="-0.5" y="-0.5" width="2" height="2">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur"/>
                <feFlood floodColor="#FBBF24" result="floodColor"/>
                <feComponentTransfer in="blur" result="glowMask">
                    <feFuncA type="linear" slope="0.8"/>
                </feComponentTransfer>
                <feComposite in="floodColor" in2="glowMask" operator="in" result="softGlow_colored"/>
                <feMerge>
                    <feMergeNode in="softGlow_colored"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        
        {/* Slanted Bars */}
        <path d="M 15 95 L 35 95 L 35 55 L 15 65 Z" fill="url(#barGradient)" />
        <path d="M 40 95 L 60 95 L 60 35 L 40 45 Z" fill="url(#barGradient)" />
        <path d="M 65 95 L 85 95 L 85 15 L 65 25 Z" fill="url(#barGradient)" />

        {/* Arrow */}
        <g filter="url(#goldGlow)">
            <path d="M5 88 L65 28 L60 33 L83 10 L88 15 L68 35 L5 88Z" fill="url(#goldArrowGradient)" />
        </g>
    </svg>
);

const NotificationBell: React.FC = () => {
    const { notifications } = useContext(FinancialContext);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative">
            <BellIcon />
            {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-[#0D1117] shadow-lg animate-pulse">
                    {unreadCount}
                </div>
            )}
        </div>
    );
};


const TopNav: React.FC<TopNavProps> = ({ setActiveTab }) => {
  return (
    <header className="px-6 py-3 flex justify-between items-center z-20 flex-shrink-0 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl">
      <div className="flex items-center space-x-3">
        <Logo />
        <div>
          <span className="font-bold font-montserrat text-2xl text-gray-100 tracking-wider">MYM</span>
          <p className="text-[10px] text-sky-300/80 tracking-widest -mt-1 uppercase">Manage Your Money</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <IconWrapper onClick={() => setActiveTab('notifications')}>
          <NotificationBell />
        </IconWrapper>
        <IconWrapper onClick={() => setActiveTab('Profile')}>
          <UserIcon />
        </IconWrapper>
      </div>
    </header>
  );
};

export default TopNav;