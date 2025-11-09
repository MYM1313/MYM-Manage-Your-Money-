import React from 'react';
import { ChevronLeftIcon } from '../../components/icons/ChevronLeftIcon';

const PlaceholderScreen: React.FC<{ title: string; onBack: () => void; }> = ({ title, onBack }) => (
    <div className="p-6 h-full flex flex-col animate-fade-in bg-gradient-to-b from-[#0a0f1f] to-[#0D1117]">
        <header className="flex items-center mb-6 flex-shrink-0">
            <button onClick={onBack} className="p-2 -ml-2 text-gray-300 rounded-full hover:bg-white/10">
                <ChevronLeftIcon />
            </button>
            <h1 className="text-2xl font-bold text-gray-200 ml-4">{title}</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 bg-black/20 rounded-2xl border border-white/10">
            <div className="p-4 bg-gray-800/50 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <p className="text-lg font-semibold text-gray-300">Coming Soon</p>
            <p className="max-w-xs mt-1">The full "{title}" screen is under construction. We're working hard to bring you this feature!</p>
        </div>
    </div>
);

export default PlaceholderScreen;
