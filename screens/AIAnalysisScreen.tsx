import React, { useState, useMemo, useEffect, FC } from 'react';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { InfoIcon } from '../components/icons/InfoIcon';
import { SettingsIcon } from '../components/icons/SettingsIcon';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';
import { ChatIcon } from '../components/icons/ChatIcon';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import GlassmorphicPanel from '../components/shared/Card';

// --- NEW ICONS for the Redesign ---
const RefreshIcon: FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120 12M20 20l-1.5-1.5A9 9 0 004 12" /></svg>;
const PercentIcon: FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-6-6m0 0l-1.5 1.5M9 9l1.5-1.5M10 21a9 9 0 110-18 9 9 0 010 18z" /></svg>;
const FileInvoiceDollarIcon: FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const NetWorthIcon: FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 12h6m-6 5.25h6M5.25 6h.008v.008H5.25V6zm0 5.25h.008v.008H5.25v-0.008zm0 5.25h.008v.008H5.25v-0.008zm13.5-5.25h.008v.008h-.008v-0.008zm0 5.25h.008v.008h-.008v-0.008zM18 6h.008v.008H18V6z" /></svg>;
const CreditCardGoodIcon: FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;

// --- MOCK DATA FOR THE REDESIGN ---
const MOCK_ANALYSIS = {
    healthScore: 82,
    netWorth: 585000,
    savingsRate: 22,
    dtiRatio: 28,
    creditHealth: 'Good',
    incomeVsExpense: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], income: [110, 115, 95, 120, 110, 130], expenses: [75, 80, 82, 78, 85, 92] },
    netWorthProjection: { labels: [...Array(12).keys()].map(i => new Date(2024, 5 + i, 1).toLocaleString('default', { month: 'short' })), projection: [585, 595, 610, 625, 635, 650, 665, 680, 690, 705, 720, 735] },
    spendingByCategory: [{ name: 'Food', value: 25, color: '#FF6384' }, { name: 'Housing', value: 35, color: '#36A2EB' }, { name: 'Shopping', value: 15, color: '#FFCE56' }, { name: 'Other', value: 25, color: '#9966FF' }],
    persona: 'Balanced Achiever',
    personaReasoning: ['Consistent savings habits.', 'Spending spikes on weekends.', 'Opportunities to optimize investment returns.'],
    roadmap: [{ text: 'Increase SIP by ₹2,000 to accelerate goals.', done: true }, { text: 'Review and cut one recurring subscription.', done: false }, { text: 'Consolidate high-interest credit card debt.', done: false }]
};

// --- UTILITY & HELPER COMPONENTS ---
const CountUp: FC<{ end: number; prefix?: string; suffix?: string; }> = ({ end, prefix = "", suffix = "" }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0, duration = 1500;
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * (end - start)));
            if (progress < 1) window.requestAnimationFrame(step); else setCount(end);
        };
        window.requestAnimationFrame(step);
    }, [end]);
    return <span>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
};

const CustomTooltip: FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/50 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs">
                <p className="font-bold text-gray-200">{label}</p>
                {payload.map((pld: any) => (
                    <p key={pld.name} style={{ color: pld.color }}>
                        {pld.name}: ₹{pld.value.toLocaleString('en-IN')}{pld.dataKey.includes('income') || pld.dataKey.includes('expenses') ? 'k' : ''}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// --- DASHBOARD SUB-COMPONENTS ---
const AIHealthSummary: FC = () => {
    const radius = 80, circumference = 2 * Math.PI * radius;
    const [offset, setOffset] = useState(circumference);

    useEffect(() => {
        const timer = setTimeout(() => {
             setOffset(circumference - (MOCK_ANALYSIS.healthScore / 100) * circumference);
        }, 300);
        return () => clearTimeout(timer);
    }, [circumference]);
   
    return (
        <GlassmorphicPanel className="flex flex-col items-center text-center space-y-4 animate-slide-in-bottom">
            <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180"><circle cx="90" cy="90" r={radius} strokeWidth="12" className="stroke-current text-white/5" fill="transparent" /><circle cx="90" cy="90" r={radius} strokeWidth="12" className="stroke-current text-sky-400" fill="transparent" strokeDasharray={circumference} strokeLinecap="round" style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 2s ease-out', filter: 'drop-shadow(0 0 8px var(--glow-blue))' }} /><circle cx="90" cy="90" r={radius} strokeWidth="2" className="stroke-current text-white/10" fill="transparent" strokeDasharray="5 10" style={{ animation: 'ring-flow 20s linear infinite' }} /></svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-5xl font-bold text-gray-100"><CountUp end={MOCK_ANALYSIS.healthScore} /></span><span className="text-sm font-semibold text-gray-400">Health Score</span></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-4">
                <div className="text-center"><NetWorthIcon className="mx-auto h-5 w-5 text-gray-400 mb-1" /><p className="font-bold text-gray-200 text-lg">₹<CountUp end={MOCK_ANALYSIS.netWorth} /></p></div>
                <div className="text-center"><PercentIcon className="mx-auto h-5 w-5 text-gray-400 mb-1" /><p className="font-bold text-gray-200 text-lg"><CountUp end={MOCK_ANALYSIS.savingsRate} />%</p></div>
                <div className="text-center"><FileInvoiceDollarIcon className="mx-auto h-5 w-5 text-gray-400 mb-1" /><p className="font-bold text-gray-200 text-lg"><CountUp end={MOCK_ANALYSIS.dtiRatio} />%</p></div>
                <div className="text-center"><CreditCardGoodIcon className="mx-auto h-5 w-5 text-gray-400 mb-1" /><p className="font-bold text-gray-200 text-lg">{MOCK_ANALYSIS.creditHealth}</p></div>
            </div>
            <div className="flex items-center space-x-4 pt-4">
                <button className="flex items-center space-x-2 text-sm font-semibold text-sky-300 bg-black/30 px-4 py-2 rounded-xl hover:bg-white/10 transition-colors"><RefreshIcon className="h-4 w-4" /><span>Refresh Insights</span></button>
                <button className="flex items-center space-x-2 text-sm font-semibold text-gray-200 bg-sky-600/50 px-4 py-2 rounded-xl hover:bg-sky-600 transition-colors"><ChatIcon /><span>Discuss with AI</span></button>
            </div>
        </GlassmorphicPanel>
    );
};

const FinancialPillars: FC = () => {
    const pillarData = [
        { title: 'Income & Cash Flow', metric: 'Monthly Surplus', value: "+₹38,000", visual: <ResponsiveContainer width="100%" height={40}><LineChart data={[{v:25},{v:35},{v:38}]} margin={{ top: 10, bottom: 0, left: 0, right: 0 }}><Line type="monotone" dataKey="v" stroke="#34d399" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer>, accent: 'green' },
        { title: 'Expense Behavior', metric: 'Savings Opportunity', value: "₹4,500", visual: <div className="text-lg font-bold">7/10</div>, accent: 'orange' },
        { title: 'Savings & Goals', metric: 'Goal Adequacy', value: "85%", visual: <div className="w-full bg-black/20 rounded-full h-2"><div className="bg-sky-500 h-2 rounded-full" style={{width: '85%'}}></div></div>, accent: 'blue' },
        { title: 'Investment Portfolio', metric: 'Rebalancing Need', value: "5%", visual: <ResponsiveContainer width="100%" height={40}><PieChart><Pie data={[{v:60},{v:30},{v:10}]} dataKey="v" cx="50%" cy="50%" innerRadius={10} outerRadius={20} fill="#8884d8" /></PieChart></ResponsiveContainer>, accent: 'purple' },
    ];
    const accentColors: any = { green: 'text-green-400', orange: 'text-orange-400', blue: 'text-sky-400', purple: 'text-purple-400' };

    return (
        <div className="animate-slide-in-bottom" style={{animationDelay: '100ms'}}>
            <h2 className="text-xl font-bold text-gray-100 mb-4 px-2">Financial Pillars</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pillarData.map(p => (
                    <GlassmorphicPanel key={p.title} className="!p-4 text-center space-y-2">
                        <p className="text-xs font-semibold text-gray-400 h-8">{p.title}</p>
                        <div className={`text-2xl font-bold ${accentColors[p.accent]}`}>{p.value}</div>
                        <div className="h-10 flex items-center justify-center">{p.visual}</div>
                        <p className="text-xs text-sky-400 hover:underline cursor-pointer pt-1">View Report →</p>
                    </GlassmorphicPanel>
                ))}
            </div>
        </div>
    );
};

const BehaviorPanel: FC = () => (
    <GlassmorphicPanel className="animate-slide-in-bottom" style={{ animationDelay: '200ms' }}>
        <h2 className="text-xl font-bold text-gray-100 mb-4">Behavior & Psychology</h2>
        <div className="bg-black/20 p-4 rounded-2xl text-center">
            <p className="text-sm text-gray-400">Your Financial Persona</p>
            <p className="text-2xl font-bold text-amber-400 animate-neon-flicker-cyan">{MOCK_ANALYSIS.persona}</p>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-gray-300 list-disc list-inside">
            {MOCK_ANALYSIS.personaReasoning.map((reason, i) => <li key={i}>{reason}</li>)}
        </ul>
    </GlassmorphicPanel>
);

const RoadmapPanel: FC = () => (
    <GlassmorphicPanel className="animate-slide-in-bottom" style={{ animationDelay: '300ms' }}>
        <h2 className="text-xl font-bold text-gray-100 mb-4">Personalized Roadmap</h2>
        <div className="space-y-3">
            {MOCK_ANALYSIS.roadmap.map((item, i) => (
                <div key={i} className="flex items-center bg-black/20 p-3 rounded-xl">
                    <input type="checkbox" id={`task-${i}`} checked={item.done} readOnly className="peer h-5 w-5 shrink-0 rounded-sm border border-gray-600 bg-gray-700 checked:bg-green-900/50 checked:border-green-500/50 focus:outline-none transition-all" />
                    <div className="absolute h-5 w-5 hidden peer-checked:block pointer-events-none rounded-sm animate-neon-pulse-green"></div>
                    <label htmlFor={`task-${i}`} className={`ml-3 text-sm font-medium ${item.done ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{item.text}</label>
                </div>
            ))}
        </div>
    </GlassmorphicPanel>
);

const ChartsPanel: FC = () => {
    const incomeExpenseData = MOCK_ANALYSIS.incomeVsExpense.labels.map((l, i) => ({ name: l, income: MOCK_ANALYSIS.incomeVsExpense.income[i], expenses: MOCK_ANALYSIS.incomeVsExpense.expenses[i] }));
    const projectionData = MOCK_ANALYSIS.netWorthProjection.labels.map((l, i) => ({ name: l, projection: MOCK_ANALYSIS.netWorthProjection.projection[i] }));
    return(
        <GlassmorphicPanel className="animate-slide-in-bottom" style={{animationDelay: '400ms'}}>
            <h2 className="text-xl font-bold text-gray-100 mb-4">Charts & Visuals</h2>
            <div className="space-y-8">
                <div>
                    <h3 className="text-md font-semibold text-gray-300 mb-2">Income vs. Expense</h3>
                    <div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={incomeExpenseData}><defs><linearGradient id="cI" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00BFFF" stopOpacity={0.4}/><stop offset="95%" stopColor="#00BFFF" stopOpacity={0}/></linearGradient><linearGradient id="cE" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/><stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false}/><Tooltip content={<CustomTooltip />} /><Area type="monotone" dataKey="income" stroke="#00BFFF" fill="url(#cI)" strokeWidth={2} /><Area type="monotone" dataKey="expenses" stroke="#7C3AED" fill="url(#cE)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
                </div>
                <div>
                    <h3 className="text-md font-semibold text-gray-300 mb-2">AI-Projected Net Worth (12 Months)</h3>
                    <div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={projectionData}><defs><linearGradient id="cP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/><stop offset="95%" stopColor="#34d399" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false}/><Tooltip content={<CustomTooltip />} /><Area type="monotone" dataKey="projection" stroke="#34d399" fill="url(#cP)" strokeWidth={3} className="animate-pulse-line" /></AreaChart></ResponsiveContainer></div>
                </div>
            </div>
        </GlassmorphicPanel>
    );
};

const AIScenariosPanel: FC = () => (
    <GlassmorphicPanel className="animate-slide-in-bottom" style={{animationDelay: '500ms'}}>
        <h2 className="text-xl font-bold text-gray-100 mb-4">AI Scenarios & Tools</h2>
        <div className="space-y-3">
            {["What if I increase my SIP by ₹5,000?", "How much interest am I wasting on debt?", "Forecast my retirement date."].map(q => (
                <button key={q} className="w-full flex justify-between items-center bg-black/20 p-4 rounded-2xl text-left hover:bg-white/10 active:scale-95 transition-all">
                    <p className="text-sm font-semibold text-sky-300">{q}</p>
                    <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                </button>
            ))}
        </div>
    </GlassmorphicPanel>
);

// --- MAIN AI ANALYSIS SCREEN ---
const AIAnalysisScreen: FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="h-full flex flex-col bg-[#0D1117] text-gray-200">
            <header className="sticky top-0 z-20 flex items-center p-4 bg-[#0D1117]/80 backdrop-blur-sm">
                <button onClick={onBack} className="p-2 -ml-2 text-gray-300 rounded-full hover:bg-white/10"><ChevronLeftIcon /></button>
                <div className="text-center flex-1"><h1 className="text-xl font-bold text-gray-100">AI Wealth Analyst</h1></div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-white rounded-full"><InfoIcon /></button>
                    <button className="p-2 text-gray-400 hover:text-white rounded-full"><SettingsIcon /></button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
                <AIHealthSummary />
                <FinancialPillars />
                <BehaviorPanel />
                <RoadmapPanel />
                <ChartsPanel />
                <AIScenariosPanel />
            </main>
        </div>
    );
};

export default AIAnalysisScreen;