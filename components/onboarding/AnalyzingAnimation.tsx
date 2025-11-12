import React, { useState, useEffect, FC } from 'react';

const AnalyzingAnimation: FC = () => {
    const icons = ['💰', '📈', '🛡️', '⚡', '💡'];
    const [iconIndex, setIconIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIconIndex(prev => (prev + 1) % icons.length);
        }, 500); // Faster rotation
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-[#10141b] to-[#0D1117] flex flex-col items-center justify-center p-6 z-50 animate-fade-in">
            <div className="w-full max-w-sm h-64 flex flex-col items-center justify-center text-center space-y-6 overflow-hidden relative">
                <div className="absolute inset-0 w-full h-full" style={{ background: 'radial-gradient(circle at 50% 50%, transparent 40%, #0D1117 80%)' }}></div>
                
                <div className="relative w-24 h-24">
                    {icons.map((icon, index) => (
                        <div key={index} className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${iconIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                            <div className="p-4 bg-sky-900/50 rounded-full animate-float border border-sky-400/30 shadow-[0_0_20px_rgba(56,189,248,0.4)] text-4xl">
                                {icon}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="relative h-6 w-full flex items-center justify-center overflow-hidden">
                    <p className="font-semibold text-gray-200">
                        AI is analyzing your financial universe...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AnalyzingAnimation;
