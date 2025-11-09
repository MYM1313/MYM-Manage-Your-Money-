
import React, { FC } from 'react';

const PremiumSelect: FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
    <div>
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <div className="relative">
            <select 
                {...props} 
                className="w-full appearance-none bg-black/30 border border-gray-700 rounded-xl p-3 mt-1 text-base text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            >
                {children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
        </div>
    </div>
);

export default PremiumSelect;
