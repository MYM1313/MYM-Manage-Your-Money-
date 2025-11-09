

import React, { useState, useEffect, FC } from 'react';

const Logo: FC = () => (
    <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="goldArrowGradient" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>
            <linearGradient id="barGradient" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0E7490" />
            </linearGradient>
            <filter id="goldGlow" x="-0.5" y="-0.5" width="2" height="2">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur"/>
                <feFlood floodColor="#FBBF24" result="floodColor"/>
                <feComponentTransfer in="blur" result="glowMask">
                    <feFuncA type="linear" slope="0.8"/>
                </feComponentTransfer>
                <feComposite in="floodColor" in2="glowMask" operator="in" result="softGlow_colored"/>
                <feMerge>
                    <feMergeNode in="softGlow_colored"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        
        {/* Slanted Bars */}
        <path d="M 15 95 L 35 95 L 35 55 L 15 65 Z" fill="url(#barGradient)" />
        <path d="M 40 95 L 60 95 L 60 35 L 40 45 Z" fill="url(#barGradient)" />
        <path d="M 65 95 L 85 95 L 85 15 L 65 25 Z" fill="url(#barGradient)" />

        {/* Arrow */}
        <g filter="url(#goldGlow)">
            <path d="M5 88 L65 28 L60 33 L83 10 L88 15 L68 35 L5 88Z" fill="url(#goldArrowGradient)" />
        </g>
    </svg>
);


const WelcomeAnimation: FC<{ onFinished: () => void }> = ({ onFinished }) => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 500),  // Logo fades in
            setTimeout(() => setPhase(2), 1500), // "Welcome to" fades in
            setTimeout(() => setPhase(3), 2000), // "MYM" fades in
            setTimeout(() => setPhase(4), 3000), // Everything fades out
            setTimeout(onFinished, 3500),       // Trigger completion
        ];
        return () => timers.forEach(clearTimeout);
    }, [onFinished]);

    return (
        <div className="fixed inset-0 bg-[#0D1117] flex flex-col items-center justify-center transition-opacity duration-500" style={{ opacity: phase === 4 ? 0 : 1 }}>
            <div className={`transition-all duration-700 ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <Logo />
            </div>
            <div className="mt-6 text-center">
                <p className={`text-xl text-gray-400 transition-all duration-500 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                    Welcome to
                </p>
                <h1 className={`font-montserrat text-5xl font-bold text-gray-100 tracking-wider transition-all duration-500 ${phase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                    MYM
                </h1>
                <p className={`text-sm text-sky-300/80 tracking-widest uppercase transition-all duration-500 ${phase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                    Manage Your Money
                </p>
            </div>
        </div>
    );
};

export default WelcomeAnimation;