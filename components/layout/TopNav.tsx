import React, { useContext, useState, useRef, useEffect } from 'react';
import { BellIcon } from '../icons/BellIcon';
import IconWrapper from '../shared/IconWrapper';
import { Tab } from '../../types';
import { FinancialContext } from '../../App';

const Logo: React.FC = () => (
    <svg width="42" height="42" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="barFaceGradient" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stop-color="#5B8DEA"/>
                <stop offset="100%" stop-color="#3A6AC1"/>
            </linearGradient>
            <linearGradient id="barTopGradient" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stop-color="#7CA3EE"/>
                <stop offset="100%" stop-color="#5B8DEA"/>
            </linearGradient>
            <filter id="starGlow">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5"/>
            </filter>
        </defs>
        <circle cx="50" cy="50" r="47" fill="#0B142B"/>
        <g transform="translate(0, 5)">
            <rect x="22" y="40" width="14" height="45" fill="url(#barFaceGradient)"/>
            <path d="M22 40 L25 37 L39 37 L36 40 Z" fill="url(#barTopGradient)" />
            <rect x="40" y="53" width="14" height="32" fill="url(#barFaceGradient)"/>
            <path d="M40 53 L43 50 L57 50 L54 53 Z" fill="url(#barTopGradient)" />
            <rect x="58" y="35" width="14" height="50" fill="url(#barFaceGradient)"/>
            <path d="M58 35 L61 32 L75 32 L72 35 Z" fill="url(#barTopGradient)" />
            <rect x="76" y="25" width="14" height="60" fill="url(#barFaceGradient)"/>
            <path d="M76 25 L79 22 L93 22 L90 25 Z" fill="url(#barTopGradient)" />
        </g>
        <g fill="white" filter="url(#starGlow)">
            <path transform="translate(30 25) scale(0.5)" d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
            <path transform="translate(48 18) scale(0.65)" d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
            <path transform="translate(68 22) scale(0.6)" d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
            <path transform="translate(82 17) scale(0.4)" d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
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

const UserProfileButton: React.FC = () => {
    const { user, logout } = useContext(FinancialContext);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600 hover:border-sky-400 transition-colors">
                <img src={user.profilePictureUrl || `https://avatar.vercel.sh/${user.name}.png`} alt={user.name} className="w-full h-full object-cover" />
            </button>
            {isOpen && (
                <div className="absolute top-14 right-0 w-56 bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-white/10 animate-fade-in p-2 z-30">
                    <div className="px-3 py-2 border-b border-white/10">
                        <p className="font-semibold text-gray-200 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <button onClick={logout} className="w-full text-left px-3 py-2 mt-1 text-sm text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};


// FIX: Define the missing TopNavProps interface to resolve the TypeScript error.
interface TopNavProps {
  setActiveTab: (tab: Tab | string) => void;
}

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
        <UserProfileButton />
      </div>
    </header>
  );
};

export default TopNav;