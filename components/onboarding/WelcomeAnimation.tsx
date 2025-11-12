import React, { useState, useEffect, FC } from 'react';

const Logo: FC = () => (
    <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="barFaceGradient" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stop-color="#5B8DEA"/>
                <stop offset="100%" stop-color="#3A6AC1"/>
            </linearGradient>
            <linearGradient id="barTopGradient" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stop-color="#7CA3EE"/>
                <stop offset="100%" stop-color="#5B8DEA"/>
            </linearGradient>
            <filter id="starGlow">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5"/>
            </filter>
        </defs>
        <circle cx="50" cy="50" r="47" fill="#0B142B"/>
        <g transform="translate(0, 5)">
            <rect x="22" y="40" width="14" height="45" fill="url(#barFaceGradient)"/>
            <path d="M22 40 L25 37 L39 37 L36 40 Z" fill="url(#barTopGradient)" />
            <rect x="40" y="53" width="14" height="32" fill="url(#barFaceGradient)"/>
            <path d="M40 53 L43 50 L57 50 L54 53 Z" fill="url(#barTopGradient)" />
            <rect x="58" y="35" width="14" height="50" fill="url(#barFaceGradient)"/>
            <path d="M58 35 L61 32 L75 32 L72 35 Z" fill="url(#barTopGradient)" />
            <rect x="76" y="25" width="14" height="60" fill="url(#barFaceGradient)"/>
            <path d="M76 25 L79 22 L93 22 L90 25 Z" fill="url(#barTopGradient)" />
        </g>
        <g fill="white" filter="url(#starGlow)">
            <path transform="translate(30 25) scale(0.5)" d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
            <path transform="translate(48 18) scale(0.65)" d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
            <path transform="translate(68 22) scale(0.6)" d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
            <path transform="translate(82 17) scale(0.4)" d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
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