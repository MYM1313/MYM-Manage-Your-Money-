import React from 'react';

export const DittoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="12" fill="black"/>
        <path d="M22 22H42V42H22V22Z" fill="#00D09C"/>
        <path d="M22 22L42 42" stroke="white" strokeWidth="4"/>
    </svg>
);
