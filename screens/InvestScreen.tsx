import React, { useState, useMemo, FC, useEffect, useContext, useRef } from 'react';
import { FinancialContext } from '../App';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar } from 'recharts';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';
import { BookOpenIcon } from '../components/icons/BookOpenIcon';
import { ToolsIcon } from '../components/icons/ToolsIcon';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';
import { XIcon } from '../components/icons/XIcon';
import { Investment, InvestmentCategory, InvestmentRiskProfile } from '../types';
import { GrowwIcon } from '../components/icons/GrowwIcon';
import { BrainCircuitIcon } from '../components/icons/BrainCircuitIcon';
import GlassmorphicPanel from '../components/shared/Card';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { TrendingUpIcon } from '../components/icons/TrendingUpIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { AIIcon } from '../components/icons/AIIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { TrophyIcon } from '../components/icons/TrophyIcon';
import { StarIcon } from '../components/icons/StarIcon';


// --- NEW LOCAL ICONS for WhyGrowwModal ---
const PortfolioTrackingIcon: FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>;
const GoalInvestingIcon: FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>;
const MarketInsightsIcon: FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>;
const SipLumpsumIcon: FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>;


// --- Animation Component ---
const GrowthAnimation: FC = () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0D1117]">
        <div className="flex items-end space-x-2">
            <div className="w-8 h-16 bg-green-500 rounded-t-sm animate-[grow_0.5s_ease-out_forwards]" style={{ animationDelay: '0.1s', transformOrigin: 'bottom', transform: 'scaleY(0)' }}></div>
            <div className="w-8 h-32 bg-sky-500 rounded-t-sm animate-[grow_0.7s_ease-out_forwards]" style={{ animationDelay: '0.3s', transformOrigin: 'bottom', transform: 'scaleY(0)' }}></div>
            <div className="w-8 h-24 bg-purple-500 rounded-t-sm animate-[grow_0.6s_ease-out_forwards]" style={{ animationDelay: '0.2s', transformOrigin: 'bottom', transform: 'scaleY(0)' }}></div>
        </div>
        <style>{`@keyframes grow { to { transform: scaleY(1); } }`}</style>
    </div>
);


// --- Panel #9: Rotating Header ---
const RotatingHeader: FC = () => {
    const phrases = ["Track your growth", "Invest smart, live free", "Plan today, secure tomorrow"];
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setIndex(prev => (prev + 1) % phrases.length), 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="text-center animate-slide-up-fade-in">
            <h1 className="text-4xl font-bold text-gray-100 font-montserrat cinematic-title">Investment</h1>
            <div className="relative h-5 mt-2 overflow-hidden">
                {phrases.map((phrase, i) => (
                    <p key={i} className={`absolute inset-0 text-md text-gray-400 transition-all duration-700 ease-in-out ${i === index ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>{phrase}</p>
                ))}
            </div>
        </header>
    );
};

// --- Panel #1: Achievements & Nudges Panel ---
const AchievementsPanel: FC = () => {
    const { investments } = useContext(FinancialContext);
    const achievements = useMemo(() => {
        const achieved = [];
        const totalValue = investments.reduce((sum, inv) => sum + inv.value, 0);
        const categories = new Set(investments.map(inv => inv.category));

        if (totalValue >= 50000) {
            achieved.push({ icon: '🏆', title: 'First ₹50k Invested!', description: 'A major milestone on your wealth journey.' });
        }
        if (categories.size >= 3) {
            achieved.push({ icon: '🌿', title: 'Diversified Portfolio', description: 'You have invested in 3+ asset classes.' });
        }
        if (investments.some(i => i.confidence === 'High')) {
             achieved.push({ icon: '🧠', title: 'Confident Investor', description: 'You have high confidence in your picks.' });
        }
        if (achieved.length === 0) {
            achieved.push({ icon: '🌱', title: 'Getting Started', description: 'Every great portfolio starts with a single investment. Add one to begin!' });
        }
        return achieved[0]; // Show one at a time
    }, [investments]);

    return (
        <GlassmorphicPanel className="!p-4 animate-slide-in-bottom bg-gradient-to-br from-purple-900/30 to-sky-900/30">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-black/30 rounded-full text-2xl">{achievements.icon}</div>
                <div>
                    <h3 className="font-bold text-gray-100">{achievements.title}</h3>
                    <p className="text-sm text-gray-400">{achievements.description}</p>
                </div>
            </div>
        </GlassmorphicPanel>
    );
};

// --- Panel #2: Portfolio (Investment Wallet) ---
const InvestmentWallet: FC<{ onAdd: () => void; onEdit: (inv: Investment) => void; }> = ({ onAdd, onEdit }) => {
    const { investments, deleteInvestment } = useContext(FinancialContext);
    const [filter, setFilter] = useState<InvestmentCategory | 'All'>('All');

    const filteredInvestments = useMemo(() => 
        filter === 'All' ? investments : investments.filter(inv => inv.category === filter), 
    [investments, filter]);

    const categories: (InvestmentCategory | 'All')[] = ['All', 'Stocks', 'ETFs', 'Bonds', 'Gold', 'Crypto', 'Global'];
    const totalValue = useMemo(() => investments.reduce((sum, inv) => sum + inv.value, 0), [investments]);

    return (
        <GlassmorphicPanel className="animate-slide-in-bottom !p-0 overflow-hidden" style={{ animationDelay: '100ms' }}>
             <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-400">My Portfolio</h2>
                        <p className="text-4xl font-bold text-sky-300 text-glow-blue tracking-tight">₹{totalValue.toLocaleString('en-IN')}</p>
                    </div>
                    <button onClick={onAdd} className="flex items-center space-x-2 text-sm font-semibold text-sky-300 bg-sky-900/50 px-4 py-2 rounded-xl hover:bg-sky-800/50 transition-colors shadow-lg shadow-sky-500/10"><PlusCircleIcon /><span>Add Asset</span></button>
                </div>
                <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-3 -mx-2 px-2">
                    {categories.map(cat => <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-1.5 text-sm font-semibold rounded-full whitespace-nowrap transition-colors duration-300 ${filter === cat ? 'bg-sky-500 text-white' : 'bg-black/30 text-gray-400 hover:bg-white/5'}`}>{cat}</button>)}
            </div>
             </div>
            <div className="space-y-px bg-white/5 max-h-80 overflow-y-auto no-scrollbar">
                {filteredInvestments.length > 0 ? filteredInvestments.map(inv => (
                    <div key={inv.id} className="bg-slate-900/50 p-4 flex items-center justify-between group animate-fade-in hover:bg-slate-800/50 transition-colors">
                        <div>
                            <p className="font-semibold text-gray-100 text-lg">{inv.name}</p>
                            <div className="flex items-center space-x-2 text-xs mt-1">
                                <span className="text-gray-300 bg-gray-700/50 px-2 py-0.5 rounded-full">{inv.category}</span>
                                {inv.riskProfile && <span className="text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded-full">{inv.riskProfile} Risk</span>}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <p className="font-bold text-gray-100 text-xl">₹{inv.value.toLocaleString()}</p>
                            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                                <button onClick={() => onEdit(inv)} className="text-xs font-semibold text-sky-400 hover:text-sky-200 bg-sky-900/50 p-2 rounded-lg">Edit</button>
                                <button onClick={() => deleteInvestment(inv.id)} className="text-xs font-semibold text-red-500/80 hover:text-red-500 bg-red-900/50 p-2 rounded-lg">Del</button>
                            </div>
                        </div>
                    </div>
                )) : <p className="text-center text-gray-400 py-12 bg-slate-900/50">No investments found for this filter.</p>}
            </div>
        </GlassmorphicPanel>
    );
};

const InvestmentInsightsPanel: FC = () => {
    const { investments } = useContext(FinancialContext);

    const insights = useMemo(() => {
        const generated: {icon: string, title: string, text: string}[] = [];
        if (investments.length === 0) {
            generated.push({ icon: '🌱', title: 'Start Your Journey', text: 'Begin by adding your first asset. Even a small SIP can grow into a significant amount over time.' });
            return generated;
        }

        const uniqueCategories = new Set(investments.map(i => i.category));
        if (uniqueCategories.size < 3) {
            generated.push({ icon: '🎨', title: 'Diversify Your Portfolio', text: 'Your investments are concentrated in few areas. Consider adding other asset classes like Gold or Bonds to reduce risk.' });
        }

        const highRiskValue = investments.filter(i => i.riskProfile === 'High').reduce((sum, i) => sum + i.value, 0);
        const totalValue = investments.reduce((sum, i) => sum + i.value, 0);
        if (totalValue > 0 && (highRiskValue / totalValue) > 0.6) {
            generated.push({ icon: '⚖️', title: 'High-Risk Concentration', text: 'A significant portion of your portfolio is in high-risk assets. Ensure this aligns with your long-term goals and risk tolerance.' });
        }
        
        if (generated.length === 0) {
             generated.push({ icon: '👍', title: 'Well Balanced', text: 'Your portfolio shows good diversification and risk management. Keep up the consistent investing!' });
        }
        
        return generated;
    }, [investments]);

    return (
        <GlassmorphicPanel className="animate-slide-in-bottom" style={{ animationDelay: '200ms' }}>
            <h2 className="text-xl font-bold text-gray-100 mb-4">Your Investment Insights</h2>
            <div className="space-y-3">
                {insights.map((insight, index) => (
                    <div key={index} className="bg-black/20 p-4 rounded-xl flex items-start space-x-4">
                        <div className="text-2xl pt-1">{insight.icon}</div>
                        <div>
                            <h3 className="font-bold text-sky-300">{insight.title}</h3>
                            <p className="text-sm text-gray-300">{insight.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </GlassmorphicPanel>
    );
};

// --- Panel #4: Asset Allocation Charts ---
const AllocationCharts: FC = () => {
    const { investments } = useContext(FinancialContext);
    
    const { pieData, totalValue } = useMemo(() => {
        const dataByCategory = investments.reduce<Record<InvestmentCategory, number>>((acc, inv) => {
            acc[inv.category] = (acc[inv.category] || 0) + inv.value;
            return acc;
        }, {} as Record<InvestmentCategory, number>);

        // FIX: Replaced Object.entries with Object.keys to avoid 'unknown' type inference on values, which caused a type error on the following reduce function.
        const pData = Object.keys(dataByCategory).map((key) => ({
            name: key,
            value: dataByCategory[key as InvestmentCategory],
        }));
        
        const tValue = pData.reduce((sum, item) => sum + item.value, 0);
        return { pieData: pData, totalValue: tValue };
    }, [investments]);
    
    const COLORS = ['#38bdf8', '#818cf8', '#a78bfa', '#f472b6', '#fbbf24', '#34d399'];

    if (investments.length === 0) {
        return (
             <GlassmorphicPanel className="animate-slide-in-bottom" style={{animationDelay:'300ms'}}>
                <h2 className="text-xl font-bold text-gray-100 mb-4">Asset Allocation</h2>
                <div className="text-center py-16 text-gray-500">
                    <p>Add an asset to see your portfolio breakdown.</p>
                </div>
            </GlassmorphicPanel>
        );
    }

    return (
        <GlassmorphicPanel className="animate-slide-in-bottom" style={{animationDelay:'300ms'}}>
            <h2 className="text-xl font-bold text-gray-100 mb-4">Asset Allocation</h2>
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-full md:w-1/2 h-56">
                    <ResponsiveContainer><PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="70%" outerRadius="90%" paddingAngle={5}><Tooltip/><Cell/></Pie>{pieData.map((e,i)=><Cell key={`c-${i}`} fill={COLORS[i%COLORS.length]}/>)}</PieChart></ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 space-y-2">
                    {pieData.map((entry, i) => (
                        <div key={entry.name} className="flex justify-between items-center bg-black/20 p-2 rounded-lg text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                                <span className="font-semibold text-gray-300">{entry.name}</span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-200">₹{entry.value.toLocaleString('en-IN')}</p>
                                <p className="text-xs text-gray-500 text-right">{((entry.value / totalValue) * 100).toFixed(1)}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </GlassmorphicPanel>
    );
};

const Logo: React.FC<{className?: string}> = ({className}) => (
    <svg viewBox="0 0 100 100" className={className}>
        <defs>
            <linearGradient id="goldArrowGradient" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#FBBF24" /><stop offset="100%" stopColor="#FDE047" /></linearGradient>
            <linearGradient id="barGradient" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stopColor="#38BDF8" /><stop offset="100%" stopColor="#0E7490" /></linearGradient>
        </defs>
        <path d="M 15 95 L 35 95 L 35 55 L 15 65 Z" fill="url(#barGradient)" />
        <path d="M 40 95 L 60 95 L 60 35 L 40 45 Z" fill="url(#barGradient)" />
        <path d="M 65 95 L 85 95 L 85 15 L 65 25 Z" fill="url(#barGradient)" />
        <path d="M5 88 L65 28 L60 33 L83 10 L88 15 L68 35 L5 88Z" fill="url(#goldArrowGradient)" />
    </svg>
);

const WhyGrowwModal: FC<{ onClose: () => void; isVisible: boolean }> = ({ onClose, isVisible }) => {
    if (!isVisible) return null;

    const features = [
        { icon: <PortfolioTrackingIcon className="w-8 h-8 text-sky-300" />, title: "Smart Portfolio Tracking", description: "Monitor all your investments in one place with intelligent insights." },
        { icon: <GoalInvestingIcon className="w-8 h-8 text-green-300" />, title: "Goal-Based Investing", description: "Create and track financial goals, from retirement to your next vacation." },
        { icon: <MarketInsightsIcon className="w-8 h-8 text-purple-300" />, title: "Real-Time Market Insights", description: "Stay ahead with live market data, news, and expert analysis." },
        { icon: <SipLumpsumIcon className="w-8 h-8 text-amber-300" />, title: "Simplified SIP & Lumpsum", description: "Start investing with as little as ₹100 through easy, flexible plans." },
    ];

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end animate-fade-in" onClick={onClose}>
            <div className="w-full bg-gradient-to-t from-[#0a0f1f] to-[#1e293b] border-t-2 border-green-500/50 rounded-t-3xl max-h-[75vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
                <header className="p-4 flex-shrink-0 text-center relative">
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gray-700 rounded-full"></div>
                    <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-500 hover:text-white"><XIcon/></button>
                    <div className="mt-8 flex justify-center items-center gap-4">
                         <GrowwIcon className="w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-100 mt-4">Why Invest with Groww?</h2>
                    <p className="text-sm text-gray-400">Simplicity, Trust, and Power in one app.</p>
                </header>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 no-scrollbar">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-black/30 p-4 rounded-xl flex items-center gap-4 animate-slide-in-bottom" style={{ animationDelay: `${100 + index * 100}ms` }}>
                            <div className="p-3 bg-gray-900/50 rounded-xl">{feature.icon}</div>
                            <div>
                                <h3 className="font-semibold text-gray-200">{feature.title}</h3>
                                <p className="text-sm text-gray-400">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                    <div className="bg-black/30 p-4 rounded-xl animate-slide-in-bottom" style={{ animationDelay: '500ms' }}>
                        <p className="text-center text-sm italic text-gray-300">"Using Groww was a turning point. My portfolio has grown 18% in just one year!"</p>
                        <p className="text-right text-xs font-semibold text-gray-400 mt-2">- Anjali R., Bangalore</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ThreeDBar: FC<any> = ({ fill, x, y, width, height }) => {
    const topPath = `M${x},${y} L${x + 6},${y - 6} L${x + width + 6},${y - 6} L${x + width},${y} Z`;
    const sidePath = `M${x + width},${y} L${x + width + 6},${y - 6} L${x + width + 6},${y + height - 6} L${x + width},${y + height} Z`;
    
    return (
        <g className="transition-transform duration-300 ease-out hover:scale-105">
            <rect x={x} y={y} width={width} height={height} fill={fill} />
            <path d={topPath} fill="#34D399" />
            <path d={sidePath} fill="#059669" />
        </g>
    );
};


const GrowwPanel: FC<{ onWhyClick: () => void }> = ({ onWhyClick }) => {
    const chartData = useMemo(() => [
        { name: '2021', value: 30 }, { name: '2022', value: 45 }, { name: '2023', value: 70 }, { name: '2024', value: 85 }
    ], []);

    return (
        <div className="group animate-slide-in-bottom" style={{ animationDelay: '400ms', perspective: '1500px' }}>
            <GlassmorphicPanel 
                className="!p-6 relative overflow-hidden transition-transform duration-500 ease-out group-hover:scale-[1.03] group-hover:[transform:rotateX(5deg)_rotateY(-5deg)]"
                style={{ transformStyle: 'preserve-3d' }}
            >
                <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(0, 208, 156, 0.4), transparent 50%), radial-gradient(circle at 0% 100%, rgba(0, 208, 156, 0.2), transparent 50%)' }}></div>
                <div className="absolute inset-0 rounded-[24px] border border-transparent group-hover:border-green-400/50 transition-all duration-300 animate-neon-pulse-green" style={{ animation: 'neon-pulse-green 4s infinite' }}></div>
                
                <div className="relative z-10 flex flex-col h-full">
                    <h2 className="text-2xl font-bold text-gray-100 font-montserrat leading-tight" style={{textShadow: '0 0 10px rgba(0, 208, 156, 0.5)'}}>Grow Your Wealth with Groww 🚀</h2>
                    <p className="text-sm text-green-300/80 font-medium mt-1">Invest smart, grow faster, and take control of your financial future. Every step counts – let Groww guide your journey.</p>
                    
                    <div className="flex-1 flex items-end my-6 gap-4">
                        <div className="w-3/5 h-32">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 5 }}>
                                    <Bar dataKey="value" fill="#00D09C" shape={<ThreeDBar />} isAnimationActive={true} animationDuration={1500} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-2/5 flex flex-col items-center justify-center">
                            <GrowwIcon className="w-20 h-20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 animate-pulse-glow-green" />
                            <p className="text-xs text-gray-400 mt-2">Trusted by 5 Cr+ users</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <button onClick={onWhyClick} className="flex-1 py-3 bg-white/10 text-white font-bold rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors active:scale-95">Why Choose Groww?</button>
                        <a href="https://groww.in/" target="_blank" rel="noopener noreferrer" className="flex-1 group/button relative">
                             <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl blur opacity-75 group-hover/button:opacity-100 transition duration-1000 group-hover/button:duration-200 animate-tilt"></div>
                            <button className="relative w-full py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transform hover:scale-105 active:scale-95 transition-transform">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-300">Open Groww App</span>
                            </button>
                        </a>
                    </div>
                </div>
            </GlassmorphicPanel>
        </div>
    );
};


const WhyInvestPanel: FC = () => {
    const slides = [
        { title: 'Beat Inflation', text: 'Investing makes your money work for you, helping it grow faster than inflation and building long-term wealth.', icon: <TrendingUpIcon /> },
        { title: 'Power of Compounding', text: 'The best time was yesterday. The next best time is now. Starting early harnesses the power of compounding.', icon: <ClockIcon className="h-8 w-8 text-amber-400" /> },
        { title: 'Achieve Goals', text: 'Whether it\'s for retirement, a house, or education, investing helps you reach your financial goals faster.', icon: <AIIcon className="h-8 w-8 text-amber-400" /> },
        { title: 'Build Wealth', text: 'Investing is a marathon, not a sprint. A long-term horizon (5+ years) allows your investments to weather market fluctuations and grow significantly.', icon: <CalendarIcon className="h-8 w-8 text-amber-400" /> },
        { title: 'Financial Freedom', text: 'Start early, invest regularly, stay diversified, and remain patient. Your future self will thank you.', icon: <TrophyIcon /> },
    ];
    const [currentSlide, setCurrentSlide] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if(scrollRef.current) {
            const newIndex = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
            setCurrentSlide(newIndex);
        }
    };

    return (
        <div className="animate-slide-in-bottom" style={{animationDelay:'200ms'}}>
            <div ref={scrollRef} onScroll={handleScroll} className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-6 px-4 pb-4">
                {slides.map((slide, index) => (
                    <div key={index} className="w-full flex-shrink-0 snap-center px-2">
                        <GlassmorphicPanel className="h-full flex flex-col items-center text-center space-y-4">
                            <div className="p-3 bg-black/30 rounded-full">{slide.icon}</div>
                            <h3 className="text-xl font-bold text-amber-300">{slide.title}</h3>
                            <p className="text-sm text-gray-300 flex-1">{slide.text}</p>
                        </GlassmorphicPanel>
                    </div>
                ))}
            </div>
             <div className="flex justify-center items-center space-x-2 mt-2">
                {slides.map((_, index) => (
                    <div key={index} className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-5 bg-white' : 'w-2 bg-gray-600'}`}></div>
                ))}
            </div>
        </div>
    );
};


// --- Panels #6 & #7: Investment Tools & Learning Hub ---
const ToolsAndLearningPanel: FC<{ onNavigate: (view: string, params?: any) => void; }> = ({ onNavigate }) => (
    <div className="grid md:grid-cols-2 gap-6 animate-slide-in-bottom" style={{animationDelay:'500ms'}}>
        <GlassmorphicPanel onClick={() => onNavigate('tools', { category: 'Investing' })} className="h-full !p-6 space-y-3 !rounded-2xl cursor-pointer flex flex-col justify-between">
            <div>
                <div className="p-3 bg-sky-900/50 rounded-xl w-fit"><ToolsIcon /></div>
                <h3 className="text-xl font-bold mt-3">Investment Tools</h3>
                <p className="text-sm text-gray-400">SIP, Compounding, and other powerful calculators to plan your growth.</p>
            </div>
            <div className="text-sky-400 font-semibold text-sm flex items-center">Explore Tools <ChevronRightIcon className="h-4 w-4 ml-1" /></div>
        </GlassmorphicPanel>
        <GlassmorphicPanel onClick={() => onNavigate('learning', { category: 'Investing' })} className="h-full !p-6 space-y-3 !rounded-2xl cursor-pointer flex flex-col justify-between">
            <div>
                <div className="p-3 bg-indigo-900/50 rounded-xl w-fit"><BookOpenIcon /></div>
                <h3 className="text-xl font-bold mt-3">Learning Hub</h3>
                <p className="text-sm text-gray-400">Interactive guides and videos to boost your investment knowledge.</p>
            </div>
            <div className="text-indigo-400 font-semibold text-sm flex items-center">Start Learning <ChevronRightIcon className="h-4 w-4 ml-1" /></div>
        </GlassmorphicPanel>
    </div>
);

// --- Panel #8: Portfolio Journal ---
const PortfolioJournalPage: FC<{ onBack: () => void, onEdit: (inv: Investment) => void }> = ({ onBack, onEdit }) => {
    const { investments } = useContext(FinancialContext);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-[#10141b] to-[#0D1117] text-gray-200 animate-fade-in">
             <header className="sticky top-0 z-20 p-4 bg-[#10141b]/80 backdrop-blur-sm">
                <div className="flex items-center">
                    <button onClick={onBack} className="p-2 -ml-2 text-gray-300 rounded-full hover:bg-white/10"><ChevronLeftIcon /></button>
                    <div className="text-center flex-1">
                        <h1 className="text-2xl font-bold text-gray-100">Portfolio Journal</h1>
                    </div>
                    <div className="w-8"></div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6 space-y-4">
                 {investments.length > 0 ? investments.map(inv => (
                    <GlassmorphicPanel key={inv.id} className="!p-0">
                        <button onClick={() => setExpandedId(ex => ex === inv.id ? null : inv.id)} className="w-full flex justify-between items-center text-left p-4">
                            <p className="font-semibold text-gray-200">{inv.name}</p>
                            <ChevronDownIcon className={`transform transition-transform ${expandedId === inv.id ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`grid transition-all duration-500 ease-in-out ${expandedId === inv.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="overflow-hidden px-4 pb-4 border-t border-white/10 space-y-3">
                                <div className="pt-3">
                                    <p className="text-xs font-semibold text-gray-400">Reason for Investing</p>
                                    <p className="text-sm">{inv.reason || 'Not set.'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400">Confidence</p>
                                    <p className="text-sm font-bold">{inv.confidence || 'Not set.'}</p>
                                </div>
                                <button onClick={() => onEdit(inv)} className="text-xs font-semibold text-sky-400 hover:text-sky-300 mt-2">Edit Journal Entry</button>
                            </div>
                        </div>
                    </GlassmorphicPanel>
                )) : <p className="text-center text-gray-400 py-12">Your investment journal entries will appear here.</p>}
            </main>
        </div>
    );
};


// --- Add/Edit Modal ---
const AddEditInvestmentModal: FC<{ onClose: () => void; investmentToEdit: Investment | null; }> = ({ onClose, investmentToEdit }) => {
    const { addInvestment, updateInvestment } = useContext(FinancialContext);
    const [data, setData] = useState({ name: '', value: '', category: 'Stocks' as InvestmentCategory, riskProfile: 'Medium' as InvestmentRiskProfile, reason: '', confidence: 'Medium' as 'Low'|'Medium'|'High' });
    
    useEffect(() => { if (investmentToEdit) setData({ name: investmentToEdit.name, value: investmentToEdit.value.toString(), category: investmentToEdit.category, riskProfile: investmentToEdit.riskProfile || 'Medium', reason: investmentToEdit.reason || '', confidence: investmentToEdit.confidence || 'Medium' })}, [investmentToEdit]);
    
    const handleChange = (field: keyof typeof data, value: any) => setData(d => ({...d, [field]: value}));

    const handleSave = () => {
        const investmentData = { name: data.name, value: parseFloat(data.value), category: data.category, riskProfile: data.riskProfile, reason: data.reason, confidence: data.confidence };
        if (investmentToEdit) {
            updateInvestment(investmentToEdit.id, investmentData);
        } else {
            addInvestment({ ...investmentData, change: 0, changeType: 'increase' });
        }
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
             <GlassmorphicPanel className="w-full max-w-lg max-h-[90vh] flex flex-col"><h2 className="text-2xl font-bold mb-4 flex-shrink-0">{investmentToEdit ? 'Edit' : 'Add'} Investment</h2><div className="space-y-4 overflow-y-auto no-scrollbar pr-2 -mr-2 flex-1"><input value={data.name} onChange={e=>handleChange('name',e.target.value)} placeholder="Investment Name" className="w-full bg-black/30 p-3 rounded-lg border border-gray-700" /><div className="grid grid-cols-2 gap-4"><input value={data.value} onChange={e=>handleChange('value',e.target.value)} type="number" placeholder="Amount (₹)" className="w-full bg-black/30 p-3 rounded-lg border border-gray-700" /><select value={data.category} onChange={e=>handleChange('category',e.target.value as InvestmentCategory)} className="w-full bg-black/30 p-3 rounded-lg border border-gray-700"><option>Stocks</option><option>ETFs</option><option>Bonds</option><option>Gold</option><option>Crypto</option><option>Global</option></select></div><select value={data.riskProfile} onChange={e=>handleChange('riskProfile',e.target.value as InvestmentRiskProfile)} className="w-full bg-black/30 p-3 rounded-lg border border-gray-700"><option>Low</option><option>Medium</option><option>High</option></select><textarea value={data.reason} onChange={e=>handleChange('reason',e.target.value)} placeholder="Reason for investing... (for your journal)" className="w-full bg-black/30 p-3 rounded-lg border border-gray-700 h-24" /><select value={data.confidence} onChange={e=>handleChange('confidence', e.target.value as any)} className="w-full bg-black/30 p-3 rounded-lg border border-gray-700"><option>Low</option><option>Medium</option><option>High</option></select></div><div className="flex gap-4 mt-4 flex-shrink-0"><button onClick={onClose} className="flex-1 py-3 bg-gray-700/50 rounded-lg">Cancel</button><button onClick={handleSave} className="flex-1 py-3 bg-sky-500 rounded-lg font-semibold">Save</button></div></GlassmorphicPanel>
        </div>
    );
};

const FaqPanel: FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const faqs = [
        { q: "How much should I invest?", a: "A common guideline is the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings & investments. Start with what you're comfortable with and increase as your income grows. Consistency is key!" },
        { q: "What is diversification?", a: "It's the practice of spreading your investments across various assets (like stocks, bonds, gold) to reduce risk. The idea is simple: don't put all your eggs in one basket. If one investment performs poorly, others may perform well, balancing out your portfolio." },
    ];
    return (
        <div className="animate-slide-in-bottom" style={{ animationDelay: '600ms' }}>
            <GlassmorphicPanel className="!p-4">
                <h3 className="text-xl font-bold text-gray-100 mb-2 px-2">Frequently Asked Questions</h3>
                {faqs.map((faq, index) => (
                    <div key={index} className="border-t border-white/10 first:border-t-0">
                        <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex justify-between items-center text-left p-4 hover:bg-white/5 transition-colors">
                            <span className="font-semibold text-gray-200">{faq.q}</span>
                            <ChevronDownIcon className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                            <div className="overflow-hidden">
                                <p className="px-4 pb-4 text-gray-400 text-sm">{faq.a}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </GlassmorphicPanel>
        </div>
    );
};

// --- MAIN SCREEN ---
const InvestScreen: FC<{ onNavigate: (view: string, params?: any) => void; }> = ({ onNavigate }) => {
    const { investments } = useContext(FinancialContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
    const [showJournalPage, setShowJournalPage] = useState(false);
    const [showWhyGrowwModal, setShowWhyGrowwModal] = useState(false);
    const [showJournalButton, setShowJournalButton] = useState(false);

    useEffect(() => {
        if(investments.length > 0 && !showJournalButton) {
            setTimeout(() => setShowJournalButton(true), 500);
        } else if (investments.length === 0) {
            setShowJournalButton(false);
        }
    }, [investments, showJournalButton]);

    const handleAdd = () => { setEditingInvestment(null); setIsModalOpen(true); };
    const handleEdit = (inv: Investment) => { setEditingInvestment(inv); setIsModalOpen(true); };
    
    if (showJournalPage) {
        return <PortfolioJournalPage onBack={() => setShowJournalPage(false)} onEdit={handleEdit} />;
    }

    return (
        <div className="bg-gradient-to-b from-[#10141b] to-[#0D1117] text-gray-200 min-h-screen">
            <div className="p-6 space-y-8 no-scrollbar pb-28 animate-fade-in">
                <RotatingHeader />
                <AchievementsPanel />
                <InvestmentWallet onAdd={handleAdd} onEdit={handleEdit} />
                
                <div className={`transition-all duration-500 grid ${showJournalButton ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                     <div className="overflow-hidden">
                        <button onClick={() => setShowJournalPage(true)} className="w-full text-center py-3 text-sm font-semibold text-gray-300 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                            View Portfolio Journal
                        </button>
                    </div>
                </div>

                <InvestmentInsightsPanel />
                <WhyInvestPanel />
                <AllocationCharts />
                <GrowwPanel onWhyClick={() => setShowWhyGrowwModal(true)} />
                <ToolsAndLearningPanel onNavigate={onNavigate} />
                <FaqPanel />
            </div>
            {isModalOpen && <AddEditInvestmentModal onClose={() => setIsModalOpen(false)} investmentToEdit={editingInvestment} />}
            <WhyGrowwModal isVisible={showWhyGrowwModal} onClose={() => setShowWhyGrowwModal(false)} />
        </div>
    );
};

export default InvestScreen;