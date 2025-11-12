import React, { FC, useEffect, useState } from 'react';

const ProgressRing: FC<{ progress: number; size: number; strokeWidth: number }> = ({ progress, size, strokeWidth }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const [offset, setOffset] = useState(circumference);

    useEffect(() => {
        const progressOffset = circumference - (progress / 100) * circumference;
        setOffset(progressOffset);
    }, [progress, circumference]);

    return (
        <svg width={size} height={size} className="transform -rotate-90">
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                className="stroke-current text-white/10"
                fill="transparent"
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                className="stroke-current text-sky-400"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.25, 1, 0.5, 1)', filter: 'drop-shadow(0 0 8px var(--glow-blue))' }}
            />
        </svg>
    );
};

export default ProgressRing;
