import React from 'react';
import { Tab } from '../../types';
import { HomeIcon } from '../icons/HomeIcon';
import { ExpenseIcon } from '../icons/TrackIcon';
import { SaveIcon } from '../icons/SaveIcon';
import { InvestIcon } from '../icons/InvestIcon';
import { ChatIcon } from '../icons/ChatIcon';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab | string) => void;
  isVisible: boolean;
}

const navItems: { label: Exclude<Tab, 'Profile'>; icon: React.ReactNode }[] = [
    { label: 'Home', icon: <HomeIcon /> },
    { label: 'Expense', icon: <ExpenseIcon /> },
    { label: 'Save', icon: <SaveIcon /> },
    { label: 'Invest', icon: <InvestIcon /> },
    { label: 'aiChat', icon: <ChatIcon /> },
];

const NavItem: React.FC<{
  label: Tab;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center justify-center h-full w-1/5 transition-colors duration-300 z-10 ${
      isActive ? 'text-sky-300' : 'text-gray-500 hover:text-sky-400'
    }`}
    aria-label={label}
    role="tab"
    aria-selected={isActive}
  >
    <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-sky-300 rounded-full transition-all duration-300 shadow-[0_0_6px_2px_rgba(56,189,248,0.7)] ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
    <div className={`transition-all duration-300 ease-in-out ${isActive ? 'scale-110 -translate-y-2.5' : 'scale-100'}`}>
        {isActive && <div className="absolute -inset-3 blur-lg opacity-75 text-sky-400">{icon}</div>}
        {icon}
    </div>
    <span className={`text-xs font-semibold mt-1.5 transition-all duration-300 ${isActive ? 'opacity-100 text-glow-blue' : 'opacity-0'}`}>{label === 'aiChat' ? 'AI Chat' : label}</span>
  </button>
);


const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, isVisible }) => {
  const activeIndex = navItems.findIndex(item => item.label === activeTab);

  return (
    <div className={`fixed bottom-4 left-4 right-4 h-20 z-50 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24 pointer-events-none'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)' }}>
      <nav className="relative h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
        <div 
            className="absolute top-0 h-full w-1/5 bg-gradient-to-br from-sky-500/30 to-indigo-500/30 rounded-3xl transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
        >
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-sky-400/20 via-transparent to-transparent animate-spin-slow"></div>
        </div>
       <div className="relative flex justify-around items-center h-full">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            isActive={activeTab === item.label}
            onClick={() => setActiveTab(item.label)}
          />
        ))}
      </div>
    </nav>
    </div>
  );
};

export default BottomNav;