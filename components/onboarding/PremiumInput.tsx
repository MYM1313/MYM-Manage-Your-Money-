import React, { FC } from 'react';

const PremiumInput: FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <input 
            {...props} 
            className="w-full bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-3 mt-1 text-base text-gray-200 focus:outline-none transition-all placeholder:text-gray-500" 
        />
    </div>
);

export default PremiumInput;