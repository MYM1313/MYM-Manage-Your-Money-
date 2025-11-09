
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
        <div className="flex gap-2 bg-black/30 p-1 rounded-xl">
            {options.map(opt => (
                <button 
                    key={opt} 
                    onClick={() => onSelect(opt)} 
                    className={`flex-1 p-2 rounded-lg text-sm font-semibold transition-all duration-300 ${value === opt ? 'bg-sky-500 text-white shadow' : 'bg-transparent text-gray-300 hover:bg-white/5'}`}
                >
                    {opt}
                </button>
            ))}
        </div>
    </div>
);

export default PremiumToggle;
