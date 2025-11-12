import React, { FC } from 'react';

interface PremiumToggleProps {
    label: string;
    options: string[];
    value: string | null;
    onSelect: (val: string) => void;
}

const PremiumToggle: FC<PremiumToggleProps> = ({ label, options, value, onSelect }) => (
    <div>
        <p className="text-sm font-medium text-gray-400 mb-2">{label}</p>
        <div className="flex gap-2 bg-black/50 backdrop-blur-sm p-1 rounded-xl border border-white/10">
            {options.map(opt => (
                <button 
                    key={opt} 
                    onClick={() => onSelect(opt)} 
                    className={`flex-1 p-2 rounded-lg text-sm font-semibold transition-all duration-300 ${value === opt ? 'bg-slate-600 text-white shadow-[0_0_10px_rgba(100,116,139,0.4)]' : 'bg-transparent text-gray-300 hover:bg-white/10'}`}
                >
                    {opt}
                </button>
            ))}
        </div>
    </div>
);

export default PremiumToggle;