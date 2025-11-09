import React from 'react';

export const BrainCircuitIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 14.25l1.5-1.5-1.5-1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 14.25l-1.5-1.5 1.5-1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75v-1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75V8.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75h-1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.75h-1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15.75c0-2.071 1.679-3.75 3.75-3.75h1.5c2.071 0 3.75 1.679 3.75 3.75V18a2.25 2.25 0 01-2.25 2.25h-4.5A2.25 2.25 0 017.5 18v-2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25A2.25 2.25 0 009.75 6H8.25A2.25 2.25 0 006 8.25v1.5a2.25 2.25 0 002.25 2.25h1.5A2.25 2.25 0 0012 9.75v-1.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 8.25A2.25 2.25 0 0118 6h-1.5a2.25 2.25 0 01-2.25 2.25v1.5c0 1.243.75 2.333 1.8 2.813" />
    </svg>
);