import React from 'react';
export const SilverMedalIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
        <defs>
            <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#E0E0E0', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#BDBDBD', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <path strokeLinecap="round" strokeLinejoin="round" stroke="url(#silverGradient)" d="M16.5 18.75h-9a7.5 7.5 0 119 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" stroke="url(#silverGradient)" d="M16.5 18.75h-9a7.5 7.5 0 119 0zM12 11.25v6" />
        <path strokeLinecap="round" strokeLinejoin="round" stroke="url(#silverGradient)" d="M12 11.25a2.25 2.25 0 01-2.25-2.25V6.75a2.25 2.25 0 014.5 0v2.25A2.25 2.25 0 0112 11.25z" />
    </svg>
);
