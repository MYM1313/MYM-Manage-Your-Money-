import React from 'react';

export const ChartBarSquareIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h15.75c.621 0 1.125.504 1.125 1.125v6.75C21 20.496 20.496 21 19.875 21H4.125A1.125 1.125 0 013 19.875v-6.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.625c0-.621.504-1.125 1.125-1.125h15.75c.621 0 1.125.504 1.125 1.125v3.375C21 12.496 20.496 13 19.875 13H4.125A1.125 1.125 0 013 11.875V8.625zM12 3v3.75m-4.5 0h9" />
    </svg>
);
