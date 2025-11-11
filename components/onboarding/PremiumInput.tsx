import React from 'react';

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const PremiumInput: React.FC<PremiumInputProps> = ({ label, ...props }) => {
    return (
        <div>
            <label className="text-sm font-medium text-gray-400">{label}</label>
            <div className="relative mt-2">
                <input
                    {...props}
                    className="w-full bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all placeholder:text-gray-600"
                />
            </div>
        </div>
    );
};

export default PremiumInput;
