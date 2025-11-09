import React from 'react';

export const GrowwIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#00D09C"/>
        <path d="M8 16V8L16 12L8 16Z" fill="white"/>
    </svg>
);