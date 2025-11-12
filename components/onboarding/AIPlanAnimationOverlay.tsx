import React, { useState, useEffect, useMemo, FC } from 'react';
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { AIIcon } from '../icons/AIIcon';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';

const NeuralNetwork: FC = () => (
    <svg className="absolute inset-0 w-full h-full text-sky-500/10" fill="none">
        {[...Array(20)].map((_, i) => (
            <circle
                key={`c-${i}`}
                cx={`${Math.random() * 100}%`}
                cy={`${Math.random() * 100}%`}
                r={`${Math.random() * 2 + 1}`}
                fill="currentColor"
                className="opacity-0 animate-fade-in"
                style={{ animationDelay: `${i * 150}ms`, animationDuration: '4s' }}
            />
        ))}
        {[...Array(10)].map((_, i) => (
            <path
                key={`p-${i}`}
                d={`M ${Math.random() * 100}% ${Math.random() * 100}% Q ${Math.random() * 100}% ${Math.random() * 100}% ${Math.random() * 100}% ${Math.random() * 100}%`}
                stroke="currentColor"
                strokeWidth="0.5"
                className="opacity-0 animate-fade-in"
                style={{ animationDelay: `${i * 200}ms`, animationDuration: '5s' }}
            />
        ))}
    </svg>
);

const Particle: FC = () => {
    const style = useMemo(() => ({
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 5 + 4}s`,
        animationDelay: `${Math.random() * -9}s`,
    }), []);
    return <div className="absolute w-0.5 h-0.5 bg-sky-300 rounded-full animate-float-particle" style={style}></div>
};

const TEXT_STAGES = [
    "Analyzing your financial profile...",
    "One health emergency can wipe out everything.",
    "It’s important to buy your coverage.",
    "Generating smart recommendations...",
    "Building your personalized vault...",
    "Your Plan is Ready!",
];

const AIPlanAnimationOverlay: FC<{ onComplete: () => void; }> = ({ onComplete }) => {
    const [stageIndex, setStageIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    const chartData1 = useMemo(() => [{v:20},{v:40},{v:30},{v:50}], []);
    const chartData2 = useMemo(() => [{v:60},{v:30},{v:10}], []);

    useEffect(() => {
        const stageInterval = setInterval(() => {
            setStageIndex(prev => Math.min(prev + 1, TEXT_STAGES.length - 1));
        }, 1000);

        const progressInterval = setInterval(() => {
            setProgress(prev => Math.min(prev + 1, 100));
        }, 55);

        const completionTimer = setTimeout(() => {
            onComplete();
        }, 6000);

        return () => {
            clearInterval(stageInterval);
            clearInterval(progressInterval);
            clearTimeout(completionTimer);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-[#10141b] to-[#0D1117] flex flex-col items-center justify-center p-6 z-50 animate-fade-in">
            <div className="premium-glass w-full max-w-md h-[26rem] flex flex-col items-center justify-center text-center p-6 space-y-4 overflow-hidden relative">
                <NeuralNetwork />
                {[...Array(40)].map((_, i) => <Particle key={i} />)}
                
                <div className="absolute inset-0 w-full h-full" style={{ background: 'radial-gradient(circle at 50% 50%, transparent 50%, #0D1117 90%)' }}></div>
                
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-between">
                    <div className="flex justify-between w-full h-24 opacity-50">
                        <div className="w-1/3 h-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData1}><Bar dataKey="v" fill="#38bdf8" radius={[2,2,0,0]} isAnimationActive={true} animationDuration={800} /></BarChart>
                             </ResponsiveContainer>
                        </div>
                        <div className="w-1/3 h-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart><Pie data={chartData2} dataKey="v" cx="50%" cy="50%" innerRadius={15} outerRadius={30} fill="#8884d8"><Cell fill="#34d399"/><Cell fill="#facc15"/><Cell fill="#f87171"/></Pie></PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/3 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData1} margin={{top:10, bottom:10}}><Line type="monotone" dataKey="v" stroke="#a78bfa" strokeWidth={3} dot={false} /></LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="p-4 bg-purple-900/50 rounded-full animate-float border border-purple-400/30 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                        <AIIcon className="h-12 w-12 text-purple-300" />
                    </div>

                    <div className="relative h-12 w-full flex items-center justify-center overflow-hidden">
                        {TEXT_STAGES.map((text, index) => (
                             <p key={index} className={`absolute inset-0 font-semibold text-gray-200 text-lg transition-all duration-500 ${stageIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
                                {text}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-md mt-8">
                <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden border border-white/10">
                    <div
                        className="bg-gradient-to-r from-sky-500 to-emerald-400 h-2 rounded-full transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-center text-sm text-gray-400 mt-2">{Math.round(progress)}% Complete</p>
            </div>
        </div>
    );
};

export default AIPlanAnimationOverlay;
