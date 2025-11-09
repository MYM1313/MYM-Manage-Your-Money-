import React from 'react';
export const DebtSnowballPlannerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="2" />
        <circle cx="12" cy="12" r="5" strokeDasharray="2 2" />
        <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
    </svg>
);