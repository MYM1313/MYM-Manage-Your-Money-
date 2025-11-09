import React from 'react';

export const ReceiptPercentIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h5.25m-5.25 0h5.25M9 6.75h5.25m-5.25 3h5.25m-5.25 3h5.25M3.75 21V3.75A2.25 2.25 0 016 1.5h12A2.25 2.25 0 0120.25 3.75v16.5M16.5 21V3.75m-9 17.25V3.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75L8.25 12" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
);