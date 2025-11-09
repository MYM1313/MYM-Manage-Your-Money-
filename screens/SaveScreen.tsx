import React, { useState, useEffect, useContext, useMemo, FC, useRef } from 'react';
import ProgressBar from '../components/shared/ProgressBar';
import { DetailedSavingsGoal } from '../types';
import { FinancialContext } from '../App';
import { TrendingUpIcon } from '../components/icons/TrendingUpIcon';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, Sector, BarChart, Bar } from 'recharts';
import { XIcon } from '../components/icons/XIcon';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import { BookOpenIcon } from '../components/icons/BookOpenIcon';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';
import { ChatIcon } from '../components/icons/ChatIcon';
import { ScaleIcon } from '../components/icons/ScaleIcon';


// --- ICONS (Defined locally for this screen) ---
const InfoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);
const PlusIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);
const CalendarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const LightBulbIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>);
const EditIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>);
const InflationIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-orange-400 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 12A8.25 8.25 0 1112 3.75a8.25 8.25 0 018.25 8.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75L19.5 19.5M8.25 8.25L4.5 4.5" />
    </svg>
);
const CompoundingIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-green-400 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);
const PurchasingPowerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-sky-400 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);
const SaveIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12l-5-3-5 3V4z" /></svg>;
const CheckBadgeIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm3.125 7.828l-2.25-2.25a.75.75 0 00-1.06 1.06l2.75 2.75a.75.75 0 001.06 0l5.25-5.25a.75.75 0 00-1.06-1.06l-4.72 4.72z" clipRule="evenodd" /></svg>;
const CheckIcon: FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>);
const LockIcon: FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>);


// --- HELPER & ANIMATION COMPONENTS ---
const CountUp: React.FC<{ end: number; duration?: number; prefix?: string; suffix?: string; decimals?: number; }> = ({ end, duration = 1500, prefix = "", suffix = "", decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);
  const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  useEffect(() => {
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = easeOutExpo(frame / totalFrames);
      const currentCount = end * progress;
      setCount(currentCount);

      if (frame === totalFrames) {
        clearInterval(counter);
        setCount(end);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [end, duration]);

  return <span>{prefix}{count.toLocaleString('en-IN', {minimumFractionDigits: decimals, maximumFractionDigits: decimals})}{suffix}</span>;
};


const FloatingCard: FC<{ children: React.ReactNode; className?: string; onClick?: () => void; }> = ({ children, className = '', onClick }) => (
    <div
        onClick={onClick}
        className={`relative bg-slate-800/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-black/40 transition-all duration-300 ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${className}`}
    >
        {children}
    </div>
);

const PressableButton: FC<{ children: React.ReactNode; className?: string; onClick?: () => void; disabled?: boolean; }> = ({ children, className, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} className={`transition-transform active:scale-[0.97] disabled:active:scale-100 ${className}`}>
    {children}
  </button>
);


// --- MODAL & NOTIFICATION COMPONENTS ---
const AddNewGoalModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addSavingsGoal } = useContext(FinancialContext);
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [growthRate, setGrowthRate] = useState('6');

    const handleSave = () => {
        if (!name || !target || !targetDate) return;
        const newGoal: Omit<DetailedSavingsGoal, 'id'> = {
            name,
            target: parseFloat(target),
            saved: 0,
            emoji: '🎯',
            color: 'from-sky-400 to-blue-500', // Default color
            targetDate,
            growthRate: parseFloat(growthRate)
        };
        addSavingsGoal(newGoal);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <FloatingCard className="w-full max-w-md relative !p-0 !bg-[#1e1e1e]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-100 transition-colors"><XIcon /></button>
                <div className="p-6">
                     <h2 className="text-2xl font-bold text-gray-100 mb-1">Create New Goal</h2>
                     <p className="text-gray-400 mb-6">Let's set up your next savings target.</p>
                     <form className="space-y-4">
                         <div>
                            <label className="text-sm font-medium text-gray-400">Goal Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="e.g., Macbook Pro" className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 mt-1 text-gray-200 focus:ring-2 focus:ring-sky-500 transition placeholder:text-gray-500" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-400">Target Amount (₹)</label>
                                <input value={target} onChange={e => setTarget(e.target.value)} type="number" placeholder="150000" className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 mt-1 text-gray-200 focus:ring-2 focus:ring-sky-500 transition placeholder:text-gray-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400">Target Date</label>
                                <input value={targetDate} onChange={e => setTargetDate(e.target.value)} type="month" className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 mt-1 text-gray-200 focus:ring-2 focus:ring-sky-500 transition" />
                            </div>
                         </div>
                         <div>
                            <label className="text-sm font-medium text-gray-400">Expected Returns (p.a.)</label>
                            <select value={growthRate} onChange={e => setGrowthRate(e.target.value)} className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 mt-1 text-gray-200 focus:ring-2 focus:ring-sky-500 transition">
                                <option value="6">FD (5-7%)</option>
                                <option value="6.5">Liquid Bees (6-7%)</option>
                                <option value="9.5">Gold (9-10%)</option>
                                <option value="12">Custom (12%)</option>
                                <option value="0">Custom (0%)</option>
                            </select>
                         </div>
                     </form>
                </div>
                <div className="bg-black/20 px-6 py-4 rounded-b-3xl flex justify-end space-x-3 border-t border-gray-700">
                    <PressableButton onClick={onClose} className="px-5 py-2.5 bg-[#2a2a2a] border border-gray-700 text-gray-300 font-semibold rounded-xl hover:bg-gray-700 transition-colors">Cancel</PressableButton>
                    <PressableButton onClick={handleSave} className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/10 hover:scale-105">Save Goal</PressableButton>
                </div>
            </FloatingCard>
        </div>
    );
};

const AddFundsModal: React.FC<{ goal: DetailedSavingsGoal; onClose: () => void }> = ({ goal, onClose }) => {
    const { addFundsToGoal } = useContext(FinancialContext);
    const [amount, setAmount] = useState('');

    const handleSave = () => {
        const fundAmount = parseFloat(amount);
        if (!fundAmount || fundAmount <= 0) return;
        addFundsToGoal(goal.id, goal.name, fundAmount);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <FloatingCard className="w-full max-w-md relative !p-0 !bg-[#1e1e1e]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-100 transition-colors"><XIcon /></button>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">Add Funds</h2>
                    <p className="text-gray-400 mb-6">to <span className="font-semibold text-sky-300">{goal.name}</span></p>
                    <form className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-400">Amount (₹)</label>
                            <input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="Enter amount to add" className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 mt-1 text-gray-200 focus:ring-2 focus:ring-sky-500 transition placeholder:text-gray-500" />
                        </div>
                    </form>
                </div>
                <div className="bg-black/20 px-6 py-4 rounded-b-3xl flex justify-end space-x-3 border-t border-gray-700">
                    <PressableButton onClick={onClose} className="px-5 py-2.5 bg-[#2a2a2a] border border-gray-700 text-gray-300 font-semibold rounded-xl hover:bg-gray-700 transition-colors">Cancel</PressableButton>
                    <PressableButton onClick={handleSave} className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/10 hover:scale-105">Add Funds</PressableButton>
                </div>
            </FloatingCard>
        </div>
    );
};

const FullScreenPlanModal: React.FC<{ 
    goal: DetailedSavingsGoal;
    monthlyContribution: number;
    monthsRemaining: number;
    targetDate: Date;
    acceleratedMonthsSaved: number;
    projectionData: { month: number; value: number }[];
    onClose: () => void;
}> = ({ goal, monthlyContribution, monthsRemaining, targetDate, acceleratedMonthsSaved, projectionData, onClose }) => {
    const [showGrowthInsight, setShowGrowthInsight] = useState(false);

    const statusInfo = useMemo(() => {
        if (goal.saved === 0) return { text: 'Not Started', color: 'text-gray-400', bg: 'bg-gray-700' };
        if (goal.saved >= goal.target) return { text: 'Achieved', color: 'text-amber-300', bg: 'bg-amber-900/50' };

        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const targetDateObj = new Date(goal.targetDate);
        const totalMs = targetDateObj.getTime() - startOfYear.getTime();
        const elapsedMs = Date.now() - startOfYear.getTime();
        
        if(totalMs <= 0) return { text: 'On Track', color: 'text-sky-300', bg: 'bg-sky-900/50' };

        const timeProgress = (elapsedMs / totalMs) * 100;
        const savingsProgress = (goal.saved / goal.target) * 100;

        if (savingsProgress > timeProgress + 5) return { text: 'Ahead', color: 'text-green-300', bg: 'bg-green-900/50' };
        if (savingsProgress < timeProgress - 10) return { text: 'Behind', color: 'text-orange-300', bg: 'bg-orange-900/50' };
        return { text: 'On Track', color: 'text-sky-300', bg: 'bg-sky-900/50' };
    }, [goal]);

    const MetricCard: React.FC<{ label: string; value: string; subvalue?: string; className?: string; icon?: React.ReactNode }> = ({label, value, subvalue, className, icon}) => (
        <FloatingCard className={`!p-4 !rounded-2xl text-center ${className}`}>
            <div className="flex items-center justify-center space-x-2">
                <p className="text-sm text-gray-400 font-medium">{label}</p>
                {icon}
            </div>
            <p className="text-3xl font-extrabold text-gray-100 font-montserrat">{value}</p>
            {subvalue && <p className="text-xs text-gray-500 mt-1">{subvalue}</p>}
        </FloatingCard>
    );

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-[#10141b] to-[#0D1117] z-50 flex flex-col animate-slide-up">
            <header className="flex-shrink-0 p-4 flex items-center">
                <PressableButton onClick={onClose} className="p-2 text-gray-300 rounded-full hover:bg-white/10"><ChevronLeftIcon /></PressableButton>
                <div className="text-center flex-1">
                    <h1 className="text-lg font-bold text-gray-100 font-montserrat tracking-wide">{goal.name}</h1>
                    <p className="text-xs text-sky-400">Your roadmap to success</p>
                </div>
                <div className="w-10"></div>
            </header>
            <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
                <div className={`text-center font-bold py-2 rounded-full ${statusInfo.bg} ${statusInfo.color}`}>{statusInfo.text}</div>

                <MetricCard 
                    label="Required Monthly Savings" 
                    value={`₹${Math.ceil(monthlyContribution).toLocaleString('en-IN')}`} 
                    subvalue={monthsRemaining > 0 ? `to reach your goal by ${targetDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}` : 'Goal Achieved!'}
                    className="animate-slide-up-fade-in"
                    icon={<PressableButton onClick={() => setShowGrowthInsight(s => !s)}><TrendingUpIcon /></PressableButton>}
                />
                
                {showGrowthInsight && (
                    <FloatingCard className="!p-4 bg-sky-900/20 border-sky-500/30 animate-fade-in">
                        <div className="flex items-center space-x-3 mb-2">
                            <LightBulbIcon />
                            <h2 className="text-base font-bold text-sky-300">AI Suggestion: Accelerate Your Goal</h2>
                        </div>
                        <p className="text-sm text-gray-300">
                            {acceleratedMonthsSaved > 0 ?
                                <>With this amount invested at an estimated <span className="font-bold">{goal.growthRate || 8}% annual return</span>, your savings grow monthly, helping you achieve your goal <span className="font-bold text-sky-300">{acceleratedMonthsSaved} {acceleratedMonthsSaved === 1 ? 'month' : 'months'} earlier</span>!</>
                                :
                                "Investing your savings helps protect it from inflation and ensures steady growth towards your goal. Keep up the great work!"
                            }
                        </p>
                    </FloatingCard>
                )}


                <div className="grid grid-cols-2 gap-4">
                    <MetricCard label="Months Remaining" value={monthsRemaining.toString()} className="animate-slide-up-fade-in" style={{animationDelay: '100ms'}} />
                    <MetricCard label="Projected Completion" value={targetDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} className="animate-slide-up-fade-in" style={{animationDelay: '150ms'}}/>
                </div>
                
                <FloatingCard className="!p-4 animate-slide-up-fade-in" style={{animationDelay: '200ms'}}>
                     <h2 className="text-sm font-bold text-gray-200 mb-2 px-2">Growth Projection</h2>
                     <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={projectionData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                <Tooltip contentStyle={{ background: 'rgba(30, 30, 30, 0.8)', backdropFilter: 'blur(5px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#e5e7eb' }} />
                                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}/>
                                <YAxis hide={true} domain={['dataMin', 'dataMax']} />
                                <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#38bdf8', stroke: '#0D1117', strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </FloatingCard>
            </main>
        </div>
    );
};

const EmergencyWhyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50" onClick={onClose}>
        <div className="w-full bg-[#1e1e1e] border-t-2 border-sky-500/50 rounded-t-3xl p-6 space-y-4 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-center mb-2"><div className="w-16 h-1.5 bg-gray-700 rounded-full"></div></div>
            <div className="text-center space-y-2">
                <div className="inline-block p-3 bg-gray-900/50 rounded-2xl border border-gray-700"><ShieldCheckIcon /></div>
                <h2 className="text-2xl font-bold text-gray-100">Why an Emergency Fund is Crucial</h2>
            </div>
            <div className="text-sm text-gray-400 bg-gray-900/50 p-4 rounded-xl border border-gray-700 space-y-3">
                <p>An emergency fund is your personal financial safety net. It's a sum of money set aside to cover unexpected life events, such as:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-gray-300">
                    <li>Job loss or sudden income reduction</li>
                    <li>Unexpected medical or dental expenses</li>
                    <li>Urgent car repairs or home maintenance</li>
                    <li>Unplanned travel for family emergencies</li>
                </ul>
                <p className="pt-2 font-semibold text-gray-200">Having this fund prevents you from going into debt or derailing your long-term investment goals when life throws a curveball.</p>
            </div>
        </div>
    </div>
);

const EditEmergencyFundModal: React.FC<{ goal: DetailedSavingsGoal; onClose: () => void; onSave: (updates: Partial<DetailedSavingsGoal>) => void; }> = ({ goal, onClose, onSave }) => {
    const [target, setTarget] = useState(goal.target.toString());
    const [targetDate, setTargetDate] = useState(goal.targetDate);
    const [growthRate, setGrowthRate] = useState(goal.growthRate?.toString() || '6');

    const handleSave = () => {
        onSave({ target: parseFloat(target), targetDate, growthRate: parseFloat(growthRate) });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <FloatingCard className="w-full max-w-md relative !p-6 !bg-[#1e1e1e]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-100"><XIcon/></button>
                <h2 className="text-xl font-bold text-gray-100 mb-4">Customize Emergency Fund</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400">Target Amount (₹)</label>
                        <input value={target} onChange={e => setTarget(e.target.value)} type="number" className="w-full bg-gray-900/50 p-3 rounded-lg mt-1 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-sky-500"/>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Target Date</label>
                        <input value={targetDate} onChange={e => setTargetDate(e.target.value)} type="month" className="w-full bg-gray-900/50 p-3 rounded-lg mt-1 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-sky-500"/>
                    </div>
                     <div>
                        <label className="text-sm text-gray-400">Annual Growth Rate (%)</label>
                        <input value={growthRate} onChange={e => setGrowthRate(e.target.value)} type="number" placeholder="e.g., 6" className="w-full bg-gray-900/50 p-3 rounded-lg mt-1 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-sky-500"/>
                    </div>
                </div>
                <PressableButton onClick={handleSave} className="w-full py-3 bg-sky-500 text-white font-bold rounded-xl mt-6">Save Changes</PressableButton>
            </FloatingCard>
        </div>
    );
};

const WhyStableMoneyModal: FC<{ onClose: () => void }> = ({ onClose }) => {
    const benefits = [
        { icon: <ShieldCheckIcon />, title: "Secure & Trusted", description: "SEBI/KYC compliant digital onboarding. Bank FDs are insured up to ₹5 Lakhs by DICGC." },
        { icon: <CheckIcon className="w-8 h-8 text-green-400" />, title: "Spam-Free, Honest Advice", description: "They have a strict no-spam policy. Their advisors are trained to give honest advice, not just sell policies." },
        { icon: <LockIcon className="w-8 h-8 text-gray-400" />, title: "End-to-End Claim Support", description: "In case of a claim, their team promises to help you and your family navigate the process, free of cost." },
    ];
    return (
        <div className="fixed inset-0 bg-gradient-to-b from-[#10141b] to-[#0D1117] z-50 flex flex-col animate-slide-up">
            <header className="flex-shrink-0 p-4 flex items-center">
                <PressableButton onClick={onClose} className="p-2 text-gray-300 rounded-full hover:bg-white/10">
                    <ChevronLeftIcon />
                </PressableButton>
                <div className="text-center flex-1">
                    <h1 className="text-lg font-bold text-gray-100 font-montserrat tracking-wide">Why Choose Stable Money</h1>
                </div>
                <div className="w-10"></div>
            </header>
            <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
                <FloatingCard className="!p-6 text-center space-y-2">
                    <p className="text-gray-300">For secure, inflation-beating returns on your savings, a trusted platform is key. Stable Money simplifies investing in high-return FDs and Digital Gold, making it easy and safe.</p>
                </FloatingCard>

                 {benefits.map((benefit, index) => (
                    <FloatingCard key={index} className="!p-5 flex items-center space-x-4">
                        <div className="flex-shrink-0 bg-gray-900/50 p-3 rounded-2xl">{benefit.icon}</div>
                        <div>
                            <h3 className="font-bold text-gray-100">{benefit.title}</h3>
                            <p className="text-sm text-gray-400">{benefit.description}</p>
                        </div>
                    </FloatingCard>
                ))}
            </main>
        </div>
    )
};

// FIX: Added ComparisonDeepDiveModal and its helper components to resolve the undefined component error.
// These components create a full-screen modal to compare savings options.
const ComparisonDetail: FC<{ title: string; value: string; isPositive?: boolean }> = ({ title, value, isPositive }) => (
    <div className="flex justify-between items-center py-2">
        <p className="text-gray-400">{title}</p>
        <p className={`font-bold ${isPositive ? 'text-green-400' : 'text-gray-200'}`}>{value}</p>
    </div>
);

const ComparisonCardModal: FC<{ title: string; rate: string; isRecommended?: boolean }> = ({ title, rate, isRecommended }) => (
    <FloatingCard className={`!p-4 !rounded-2xl border-2 ${isRecommended ? 'border-amber-500/30 bg-amber-900/20' : 'border-gray-700'}`}>
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-bold text-gray-200">{title}</h3>
            {isRecommended && <div className="text-xs font-bold bg-amber-900/50 text-amber-300 px-2 py-0.5 rounded-full">Recommended</div>}
        </div>
        <div className="text-center bg-gray-900/50 rounded-xl py-2 mb-4">
            <p className="text-sm text-gray-400">Average Annual Return</p>
            <p className="text-3xl font-bold text-gray-200">{rate}</p>
        </div>
        <div className="divide-y divide-gray-700 text-sm">
            <ComparisonDetail title="Risk Level" value={title === 'Bank Savings' ? 'Very Low' : 'Low to Medium'} />
            <ComparisonDetail title="Liquidity" value="High" />
            <ComparisonDetail title="Inflation Hedge" value={title === 'Bank Savings' ? 'Poor' : 'Good'} isPositive={title !== 'Bank Savings'} />
            <ComparisonDetail title="Best For" value={title === 'Bank Savings' ? 'Emergency funds' : 'Wealth growth'} />
        </div>
    </FloatingCard>
);

const ComparisonDeepDiveModal: FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-gradient-to-b from-[#10141b] to-[#0D1117] z-50 flex flex-col animate-slide-up">
             <header className="flex-shrink-0 p-4 flex items-center">
                <PressableButton onClick={onClose} className="p-2 text-gray-300 rounded-full hover:bg-white/10">
                    <ChevronLeftIcon />
                </PressableButton>
                <div className="text-center flex-1">
                    <div className="flex items-center justify-center space-x-2">
                        <ScaleIcon />
                        <h1 className="text-xl font-bold text-gray-100 font-montserrat tracking-wide">Deep Comparison</h1>
                    </div>
                     <p className="text-sm text-gray-400">Understand where your money grows best.</p>
                </div>
                <div className="w-10"></div>
            </header>
            
            <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
                <ComparisonCardModal title="Bank Savings" rate="~3.0%" />
                <ComparisonCardModal title="FD / Gold" rate="~7.5%" isRecommended />
                
                <FloatingCard className="!p-6 !rounded-2xl">
                    <h3 className="text-lg font-bold text-gray-200 mb-2">Key Takeaways</h3>
                    <ul className="space-y-2 text-sm text-gray-400 list-disc list-inside">
                        <li><span className="font-semibold text-gray-200">Inflation is key:</span> Standard savings accounts often lose value over time due to inflation.</li>
                        <li><span className="font-semibold text-gray-200">Compounding is powerful:</span> Even a small difference in return rate makes a huge impact over several years.</li>
                        <li><span className="font-semibold text-gray-200">Diversify:</span> A mix of safe savings (for emergencies) and growth investments (like FDs/Gold) is ideal for a healthy financial future.</li>
                    </ul>
                </FloatingCard>
            </main>
        </div>
    );
};


const EmergencyFundPanel: React.FC<{ goal: DetailedSavingsGoal; onAddFunds: () => void; onOpenWhy: () => void; onOpenPlan: () => void; onOpenEdit: () => void; }> = ({ goal, onAddFunds, onOpenWhy, onOpenPlan, onOpenEdit }) => {
    const progress = Math.min(Math.round((goal.saved / goal.target) * 100), 100);
    const sparklineData = useMemo(() => [
        { value: goal.saved * 0.8 }, { value: goal.saved * 0.85 }, { value: goal.saved * 0.9 },
        { value: goal.saved * 0.92 }, { value: goal.saved * 0.98 }, { value: goal.saved }
    ], [goal.saved]);

    return (
        <FloatingCard className="!p-5 space-y-4 hover:-translate-y-0 animate-active-glow-blue">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center space-x-2">
                        <h2 className="text-2xl font-extrabold text-gray-100 font-montserrat">Emergency Fund</h2>
                        <span className="text-4xl">🛡️</span>
                    </div>
                    <p className="text-xs text-gray-400">Your financial safety net status and plan.</p>
                </div>
                <PressableButton onClick={onOpenWhy} className="flex items-center space-x-1 text-xs text-gray-400 hover:text-sky-300 transition-colors">
                    <InfoIcon /><span>Why is this needed?</span>
                </PressableButton>
            </div>
            <div>
                <div className="relative">
                    <ProgressBar progress={progress} color="from-sky-400 to-blue-500" />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white/80 drop-shadow-md">{progress}%</span>
                </div>
                <div className="flex justify-between items-baseline mt-1.5">
                    <span className="font-extrabold text-2xl text-gray-100 font-montserrat">₹{goal.saved.toLocaleString('en-IN')}</span>
                    <span className="text-sm text-gray-400 font-medium">Target: ₹{goal.target.toLocaleString('en-IN')}</span>
                </div>
            </div>
            <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
                 <div className="text-left">
                    <p className="text-sm font-semibold text-green-400">{goal.growthRate}% APY</p>
                    <p className="text-xs text-gray-500">Est. Growth</p>
                </div>
                <div className="h-10 w-24">
                    <ResponsiveContainer>
                        <LineChart data={sparklineData}>
                            <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2} dot={false} isAnimationActive={true} animationDuration={1000} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="flex gap-3 pt-3 border-t border-white/10">
                <PressableButton onClick={onAddFunds} className="flex-1 text-center text-sm font-semibold text-white bg-sky-600 py-2.5 rounded-lg hover:bg-sky-500 transition-colors shadow-lg shadow-sky-500/10">Add Funds</PressableButton>
                <PressableButton onClick={onOpenPlan} className="flex-1 text-center text-sm font-semibold text-gray-200 bg-white/10 py-2.5 rounded-lg hover:bg-white/20 transition-colors">Planning</PressableButton>
                <PressableButton onClick={onOpenEdit} className="text-sm p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition-colors flex items-center space-x-1.5"><EditIcon/> <span>Edit</span></PressableButton>
            </div>
        </FloatingCard>
    );
};

const OtherGoalCard: React.FC<{ goal: DetailedSavingsGoal; onAddFundsClick: () => void; onPlanningClick: () => void; }> = ({ goal, onAddFundsClick, onPlanningClick }) => {
    const progress = Math.min(Math.round((goal.saved / goal.target) * 100), 100);
    
    return (
        <FloatingCard className="!p-4 hover:-translate-y-1">
            <div className="flex items-center space-x-4">
                <span className="text-4xl bg-black/20 p-3 rounded-2xl">{goal.emoji}</span>
                <div className="flex-1">
                    <p className="text-lg font-bold text-gray-200">{goal.name}</p>
                    <p className="text-xs text-gray-400 flex items-center space-x-1.5 mt-0.5">
                        <CalendarIcon />
                        <span>Target: {new Date(goal.targetDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
                    </p>
                </div>
                 <PressableButton onClick={onPlanningClick} className="px-3 py-3 text-xs font-semibold text-gray-200 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">Plan</PressableButton>
            </div>
            <div className="mt-3">
                <ProgressBar progress={progress} color="from-sky-400 to-blue-500" />
                 <div className="flex justify-between items-baseline mt-1">
                    <div>
                        <span className="font-semibold text-lg text-gray-200">₹{goal.saved.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-gray-400"> of ₹{goal.target.toLocaleString('en-IN')}</span>
                    </div>
                    <PressableButton onClick={onAddFundsClick} className="px-3 py-1 text-xs font-semibold text-sky-300 bg-sky-900/50 rounded-md hover:bg-sky-800/50 transition-colors">Add</PressableButton>
                </div>
            </div>
        </FloatingCard>
    );
};

const SavingInsightsPanel: React.FC = () => {
    const { savingsGoals } = useContext(FinancialContext);

    const { summary, tips, progress } = useMemo(() => {
        let summaryText: string;
        let selectedTips: string[] = [];
        const totalSaved = savingsGoals.reduce((s, g) => s + g.saved, 0);
        const totalTarget = savingsGoals.reduce((s, g) => s + g.target, 0);
        const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

        const emergencyFund = savingsGoals.find(g => g.isEmergency);
        const nearlyCompleteGoal = savingsGoals.find(g => !g.isEmergency && (g.saved / g.target) >= 0.9 && (g.saved / g.target) < 1);

        if (totalSaved === 0) {
            summaryText = "Welcome to your savings journey! Setting clear goals is the first step towards financial success.";
            selectedTips.push("Create your first goal, like an Emergency Fund, to build a strong foundation.");
            selectedTips.push("Try saving a small, consistent amount daily or weekly to build the habit.");
        } else if (emergencyFund && (emergencyFund.saved / emergencyFund.target) < 0.5) {
            summaryText = "Prioritizing your Emergency Fund is crucial. It acts as a safety net that protects your other investments from unexpected life events.";
            selectedTips.push("Automate a monthly transfer to your emergency fund. Consistency is key!");
            selectedTips.push("Consider directing any unexpected income, like a bonus, towards this fund.");
        } else if (nearlyCompleteGoal) {
            const remaining = nearlyCompleteGoal.target - nearlyCompleteGoal.saved;
            summaryText = `You're so close to achieving your '${nearlyCompleteGoal.name}' goal! Just ₹${remaining.toLocaleString('en-IN')} to go.`;
            selectedTips.push("Consider a one-time contribution to cross the finish line this month.");
            selectedTips.push("Start thinking about your next big goal to keep the momentum going!");
        } else {
            const avgReturn = savingsGoals.length > 0 ? savingsGoals.reduce((s, g) => s + (g.growthRate || 0), 0) / savingsGoals.length : 0;
            summaryText = `You're making steady progress with ₹${totalSaved.toLocaleString('en-IN')} saved across your goals. Your discipline is paying off.`;
            if (avgReturn > 5) {
                 selectedTips.push(`Your savings are growing at an average of ${avgReturn.toFixed(1)}% annually. That's the power of smart saving!`);
            }
            selectedTips.push("Periodically review your goals and contributions to ensure they still align with your life plans.");
        }
        
        return { 
            summary: summaryText, 
            tips: selectedTips.slice(0, 2),
            progress: overallProgress
        };
    }, [savingsGoals]);

    return (
        <FloatingCard className="!p-6 border-sky-500/30 hover:-translate-y-0 animate-slide-up-fade-in">
             <div className="flex items-center space-x-3 mb-4">
                <LightBulbIcon />
                <h2 className="text-xl font-bold text-gray-100">AI Saving Insights</h2>
             </div>
             
             <p className="text-gray-300 mb-4 text-sm">{summary}</p>

             <div className="mb-5">
                <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-semibold text-gray-400">Overall Goal Progress</span>
                    <span className="text-sm font-bold text-sky-300">{progress.toFixed(0)}%</span>
                </div>
                <ProgressBar progress={progress} color="from-sky-400 to-blue-500" />
             </div>

             <div className="bg-black/20 p-4 rounded-2xl border border-white/10">
                <h3 className="font-bold text-sky-300 mb-3">Actionable Pro-Tips</h3>
                <div className="space-y-3">
                    {tips.map((tip, index) => (
                        <div key={index} className="flex items-start space-x-3 text-sm">
                            <span className="text-sky-400 mt-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </span>
                            <p className="text-gray-300">{tip}</p>
                        </div>
                    ))}
                </div>
             </div>
        </FloatingCard>
    );
};

const PremiumProgressBar: FC<{ name: string, rate: string, value: number, gradient: string, tooltip: string }> = ({ name, rate, value, gradient, tooltip }) => {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const timer = setTimeout(() => setWidth(value), 100);
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div className="group relative">
            <div className="flex justify-between items-center text-sm mb-1.5">
                <span className="font-semibold text-gray-300 flex items-center">{name}</span>
                <span className="font-bold text-gray-200">{rate}</span>
            </div>
            <div className="relative w-full bg-slate-700/30 rounded-full h-4 overflow-hidden backdrop-blur-sm border border-white/10">
                <div
                    className={`h-4 rounded-full ${gradient} transition-all duration-700 ease-out relative`}
                    style={{ width: `${width}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent"></div>
                    <div className="absolute inset-0" style={{ boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.2)' }}></div>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all duration-700 ease-out"
                    style={{ left: `calc(${width}% - 12px)`, opacity: width > 5 ? 1 : 0, transform: `translateY(-50%) scale(${width > 5 ? 1 : 0.5})` }}
                >
                    {Math.round(value)}%
                </div>
            </div>
            <div className="absolute bottom-full left-0 mb-2 w-max bg-gray-900 text-white text-xs rounded-lg py-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {tooltip}
            </div>
        </div>
    )
}

const InvestSavingsSmartlyPanel: React.FC<{ onOpenDeepDive: () => void; onOpenWhyStableMoney: () => void; }> = ({ onOpenDeepDive, onOpenWhyStableMoney }) => {
    const [trustSignalIndex, setTrustSignalIndex] = useState(0);
    const trustSignals = ["KYC Verified", "Insured", "24k+ Users"];

    useEffect(() => {
        const interval = setInterval(() => {
            setTrustSignalIndex(prev => (prev + 1) % trustSignals.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [trustSignals.length]);

    const comparisonData = [
        { name: '💰 Bank Savings', rate: '3%', value: 30, gradient: 'bg-gradient-to-r from-rose-600 to-rose-400', tooltip: 'Bank: 3% est.' },
        { name: '🏦 FD / Liquid Bees', rate: '~7.5%', value: 75, gradient: 'bg-gradient-to-r from-teal-600 to-cyan-400', tooltip: 'FD: 7.5% est.' },
        { name: '🪙 Gold', rate: '~8.5%', value: 85, gradient: 'bg-gradient-to-r from-amber-600 to-yellow-400', tooltip: 'Gold: 8.5% est.' },
    ];
    
    return (
        <FloatingCard className="!p-6 hover:-translate-y-0 animate-slide-up-fade-in !rounded-3xl !border-slate-700">
            <h2 className="text-2xl font-bold font-montserrat text-gray-100">Invest Your Savings Smartly</h2>
            <p className="text-sm text-gray-400 mt-1">Don’t let your money sleep in banks — make it work for you.</p>

            <div className="mt-8 space-y-6">
                {comparisonData.map(item => <PremiumProgressBar key={item.name} {...item} />)}
            </div>
            
            <p className="text-xs text-center text-gray-400 mt-8 bg-black/20 p-4 rounded-xl border border-white/10">
              While banks offer only 3%, inflation erodes your purchasing power. FDs and Gold preserve and grow your savings value, giving you inflation-beating returns over time.
            </p>

            <PressableButton onClick={onOpenDeepDive} className="w-full mt-6 text-center text-sm font-semibold text-sky-300 bg-sky-900/50 py-3 rounded-xl hover:bg-sky-800/50 transition-colors flex items-center justify-center space-x-2 group">
                <span>Understand Deeply Why to Invest in FD or Gold</span>
                <ChevronRightIcon className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
            </PressableButton>

            <div className="mt-8 pt-6 border-t border-white/10">
                 <h3 className="text-base font-semibold text-gray-300 text-center mb-4">Tested Platform for FDs & Gold</h3>
                 <div className="relative premium-glass !p-4 !rounded-2xl hover:!scale-100 group">
                    <div className="absolute top-2 right-2 h-6 flex items-center overflow-hidden">
                        <div key={trustSignalIndex} className="bg-green-900/50 text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 animate-slide-up-fade-in">
                            <CheckBadgeIcon className="w-3 h-3"/> <span>{trustSignals[trustSignalIndex]}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <img src="https://www.stablemoney.in/static/images/brand/logo.svg" alt="Stable Money Logo" className="w-12 h-12 rounded-full bg-white p-1" />
                        <div>
                            <p className="font-bold text-lg text-gray-100">Stable Money</p>
                            <p className="text-xs text-gray-400">Digital FD & Allocated Gold — 7.5–8.6%</p>
                        </div>
                    </div>
                    <div className="flex items-end justify-between mt-4">
                        <div className="text-center">
                            <p className="text-xs text-gray-400">Avg. Returns</p>
                            <p className="font-bold text-lg text-amber-400">7.8%</p>
                        </div>
                         <div className="text-center">
                            <p className="text-xs text-gray-400">Investors</p>
                            <p className="font-bold text-lg text-gray-200">24k+</p>
                        </div>
                        <a href="https://www.stablemoney.in/" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 text-sm font-bold text-black rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 hover:scale-105 active:scale-95 transition-transform transform shadow-lg shadow-amber-500/10">Open</a>
                    </div>
                    <PressableButton onClick={onOpenWhyStableMoney} className="text-xs font-semibold text-gray-400 hover:text-white transition-colors mt-3 text-center w-full">Why choose Stable Money?</PressableButton>
                 </div>
                 <p className="text-center text-[10px] text-gray-600 mt-2">Trusted, tested, and easy to start — 0 paperwork digital onboarding.</p>
            </div>
        </FloatingCard>
    );
};

const SavingsAllocationChartsPanel: FC = () => {
    const { savingsGoals } = useContext(FinancialContext);
    const [activeChart, setActiveChart] = useState<'allocation' | 'goals'>('allocation');
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

    const swipeRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef(0);
    const touchEndRef = useRef(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
        touchEndRef.current = e.targetTouches[0].clientX;
    };
    
    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndRef.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndRef.current > 75) {
            setActiveChart('goals');
        } else if (touchStartX.current - touchEndRef.current < -75) {
            setActiveChart('allocation');
        }
    };

    const { allocationData, goalsData, totalSavings } = useMemo(() => {
        const goalsWithAssets: DetailedSavingsGoal[] = savingsGoals.map(g => {
            if (g.isEmergency) return { ...g, asset: 'Liquid Fund' };
            if (g.name.includes('Trip')) return { ...g, asset: 'Gold' };
            if (g.name.includes('Macbook')) return { ...g, asset: 'FD' };
            return { ...g, asset: 'Bank' };
        });

        const groupedByAsset = goalsWithAssets.reduce((acc, goal) => {
            const asset = goal.asset || 'Bank';
            acc[asset] = (acc[asset] || 0) + goal.saved;
            return acc;
        }, {} as Record<string, number>);
        
        const allocData = Object.entries(groupedByAsset)
            .map(([name, value]) => ({ name, value }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value);

        const goalsData = savingsGoals.map(g => ({ name: g.name.replace(' Fund', ''), saved: g.saved, target: g.target, progress: (g.saved / g.target) * 100 }));
        const total = savingsGoals.reduce((sum, g) => sum + g.saved, 0);

        return { allocationData: allocData, goalsData, totalSavings: total };
    }, [savingsGoals]);

    const COLORS: Record<string, string> = { 'Liquid Fund': '#14b8a6', 'Gold': '#f59e0b', 'FD': '#34d399', 'Bank': '#6b7280' };

    const renderActiveShape = (props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
        return (
            <g>
                <text x={cx} y={cy - 12} textAnchor="middle" fill="#e5e7eb" className="font-bold text-lg drop-shadow-[0_0_4px_rgba(255,255,255,0.7)]">
                    {`${(percent * 100).toFixed(0)}%`}
                </text>
                <text x={cx} y={cy + 8} textAnchor="middle" fill={fill} className="text-sm font-semibold">
                    {payload.name}
                </text>
                 <text x={cx} y={cy + 25} textAnchor="middle" fill="#a0aec0" className="text-xs">
                    ₹{payload.value.toLocaleString('en-IN')}
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 8}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    style={{ filter: `drop-shadow(0 0 12px ${fill})`, transition: 'all 0.3s ease' }}
                />
            </g>
        );
    };

    const CustomBarTooltip: FC<any> = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <FloatingCard className="!p-3 !rounded-xl !border-gray-600">
                    <p className="font-semibold text-gray-100">{label}</p>
                    <p style={{ color: payload[0].fill }}>
                        Saved: ₹{payload[0].value.toLocaleString('en-IN')}
                    </p>
                </FloatingCard>
            );
        }
        return null;
    };

    const AllocationLegend: FC<{ data: { name: string; value: number }[]; total: number; colors: Record<string, string> }> = ({ data, total, colors }) => (
        <div className="w-full md:w-2/5 space-y-3">
            {data.map((entry, index) => {
                const percentage = total > 0 ? (entry.value / total) * 100 : 0;
                const isHovered = activeIndex === index;
                return (
                    <div 
                        key={entry.name} 
                        className={`flex items-center justify-between p-3 bg-black/20 rounded-lg transition-all duration-300 ${isHovered ? 'bg-white/10 scale-105' : 'hover:bg-white/5'}`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(undefined)}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[entry.name] || '#9ca3af' }}></div>
                            <span className="font-semibold text-gray-200">{entry.name}</span>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-100">{percentage.toFixed(1)}%</p>
                            <p className="text-xs text-gray-400">₹{entry.value.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    );

    return (
        <FloatingCard className="!p-5 animate-slide-up-fade-in !bg-slate-800/20 backdrop-blur-3xl !rounded-3xl !border-slate-700">
            <h2 className="text-2xl font-bold font-montserrat text-gray-100 px-1">Savings Allocation</h2>
            <p className="text-sm text-gray-400 mt-1 px-1">{activeChart === 'allocation' ? 'Your overall savings allocation across different asset classes.' : 'How your savings are distributed across your financial goals.'}</p>
            
            <div 
                className="w-full overflow-hidden mt-6"
                ref={swipeRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]" style={{ transform: `translateX(${activeChart === 'allocation' ? '0%' : '-100%'})` }}>
                    <div className="w-full flex-shrink-0">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative w-full md:w-3/5 h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={allocationData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="70%" outerRadius="90%" paddingAngle={5} 
                                            activeIndex={activeIndex} activeShape={renderActiveShape} onMouseEnter={(_, index) => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(undefined)}
                                            isAnimationActive={true} animationDuration={1200}
                                        >
                                            {allocationData.map((entry) => <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name] || '#9ca3af'} className="focus:outline-none" style={{transition: 'all 0.3s ease'}} />)}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <p className="text-white/60 text-sm">Total Savings</p>
                                    <p className="text-3xl font-bold text-white/90"><CountUp end={totalSavings} prefix="₹" /></p>
                                </div>
                            </div>
                            <AllocationLegend data={allocationData} total={totalSavings} colors={COLORS} />
                        </div>
                    </div>
                     <div className="w-full flex-shrink-0">
                        <div className="h-72 pr-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={goalsData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} width={80} />
                                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                                    <Bar dataKey="saved" radius={[0, 8, 8, 0]} barSize={25} animationDuration={1000}>
                                        {goalsData.map((entry, index) => <Cell key={`cell-${index}`} fill={Object.values(COLORS)[(index + 1) % Object.values(COLORS).length]} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center space-x-2.5 mt-4">
                <button aria-label="Show allocation chart" onClick={() => setActiveChart('allocation')} className={`h-2 rounded-full transition-all duration-300 ${activeChart === 'allocation' ? 'w-6 bg-white' : 'w-2 bg-gray-600 hover:bg-gray-500'}`} />
                <button aria-label="Show goals chart" onClick={() => setActiveChart('goals')} className={`h-2 rounded-full transition-all duration-300 ${activeChart === 'goals' ? 'w-6 bg-white' : 'w-2 bg-gray-600 hover:bg-gray-500'}`} />
            </div>
        </FloatingCard>
    );
};

const FaqSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const faqs = [
        { q: "How much should I keep in an emergency fund?", a: "A good rule of thumb is to have 3 to 6 months' worth of essential living expenses saved. This covers rent, utilities, food, and other necessities." },
        { q: "What's the best way to save for multiple goals at once?", a: "Prioritize your goals (e.g., emergency fund first), then automate contributions. Allocate a specific amount to each goal from every paycheck to ensure steady progress on all fronts." },
        { q: "Should I save or invest my extra money?", a: "First, ensure your emergency fund is fully funded. After that, investing is generally recommended for long-term goals (5+ years) to beat inflation and grow your wealth." },
    ];
    return (
        <div className="animate-slide-up-fade-in mt-6">
            <h2 className="text-lg font-bold text-gray-100 mb-3 px-2">Frequently Asked Questions</h2>
            <FloatingCard className="!p-2">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-white/10 last:border-b-0">
                        <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex justify-between items-center text-left p-4 active:bg-white/5 transition-colors">
                            <span className="font-semibold text-gray-200">{faq.q}</span>
                            <ChevronDownIcon className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
                        </button>
                        {openIndex === index && <div className="px-4 pb-4 text-gray-400 text-sm animate-fade-in">{faq.a}</div>}
                    </div>
                ))}
            </FloatingCard>
        </div>
    );
};

const RotatingHeader: React.FC = () => {
    const messages = ["Building Wealth. Step by Step.", "Your Future Self Will Thank You.", "Grow Your Savings, Smartly."];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % messages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [messages.length]);
    
    return (
        <div className="relative text-center h-24 flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900/50 to-transparent rounded-b-3xl -mx-6 -mt-6">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 animate-ring-flow opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.5) 0%, transparent 40%)', transformOrigin: 'center' }}></div>
                <div className="absolute inset-0 animate-ring-flow" style={{ animationDuration: '30s', animationDirection: 'reverse', backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.3) 0%, transparent 30%)' }}></div>
                <div className="absolute w-96 h-96 border-2 border-sky-500/30 rounded-full animate-ring-flow" style={{ animationDuration: '25s' }}></div>
                <div className="absolute w-72 h-72 border border-sky-500/20 rounded-full animate-ring-flow" style={{ animationDuration: '20s', animationDirection: 'reverse' }}></div>
            </div>
            <div className="relative z-10 h-8">
                <p key={index} className="text-xl font-semibold text-gray-200 text-glow-white animate-slide-up-fade-in">
                    {messages[index]}
                </p>
            </div>
        </div>
    );
};

const SavingsOverviewPanel: FC<{ totalSavings: number; totalTarget: number; progress: number; emergencyFundSaved: number; averageReturn: number; goalsCount: number; }> = ({ totalSavings, totalTarget, progress, emergencyFundSaved, averageReturn, goalsCount }) => {
    
    const MetricItem: FC<{ label: string, value: React.ReactNode, icon: string, colorClass: string }> = ({ label, value, icon, colorClass }) => (
        <div className="bg-black/20 p-4 rounded-2xl flex flex-col items-center text-center space-y-2 transition-transform hover:scale-105 hover:bg-white/10">
            <div className={`text-2xl p-2 bg-gray-900/50 rounded-lg ${colorClass}`}>{icon}</div>
            <div>
                <p className="text-sm text-gray-400">{label}</p>
                <div className="text-lg font-bold text-gray-100">{value}</div>
            </div>
        </div>
    );
    
    return (
        <FloatingCard className="!p-6 !bg-slate-800/60 !border-slate-700 space-y-5 animate-slide-up-fade-in">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold font-montserrat text-gray-100">Saving Overview</h2>
                <span className="text-xs font-semibold bg-sky-900/50 text-sky-300 px-3 py-1 rounded-full">This Month</span>
            </div>

            <div className="text-center space-y-2">
                <p className="text-lg text-gray-400">Total Amount Saved</p>
                <p className="text-5xl font-extrabold text-gray-100 font-montserrat tracking-tighter text-glow-blue">
                   <CountUp end={totalSavings} prefix="₹" />
                </p>
                <p className="text-sm text-gray-500">
                    out of ₹{totalTarget.toLocaleString('en-IN')} target
                </p>
            </div>
            
            <div>
                <div className="flex justify-between text-sm font-semibold mb-1">
                    <span className="text-gray-400">Overall Progress</span>
                    <span className="text-sky-300">{progress.toFixed(0)}%</span>
                </div>
                <ProgressBar progress={progress} color="from-sky-400 to-emerald-400" />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3">
                <MetricItem 
                    label="Emergency Fund" 
                    value={<>₹<CountUp end={emergencyFundSaved} /></>} 
                    icon="🛡️"
                    colorClass="text-amber-400"
                />
                <MetricItem 
                    label="Average Growth" 
                    value={goalsCount > 0 ? <><CountUp end={averageReturn} decimals={1} />%</> : "N/A"}
                    icon="📈"
                    colorClass="text-green-400"
                />
                 <MetricItem 
                    label="Active Goals" 
                    value={<CountUp end={goalsCount} />}
                    icon="🎯"
                    colorClass="text-rose-400"
                />
            </div>
        </FloatingCard>
    );
};

const AIChatTeaserPanel: FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => (
    <FloatingCard 
      onClick={() => onNavigate('aiChat')} 
      className="aspect-square !p-5 group cursor-pointer flex flex-col justify-between items-start hover:-translate-y-1 animate-active-glow-purple"
      style={{ backgroundImage: `radial-gradient(circle at top right, rgba(168, 85, 247, 0.1), transparent 50%)` }}
    >
        <div>
            <div className="p-3 bg-purple-900/50 rounded-2xl w-fit mb-3"><ChatIcon /></div>
            <h3 className="font-bold text-gray-200 text-lg">Talk to AI Mentor</h3>
            <p className="text-sm text-gray-400 mt-1">Get personalized saving strategies, tips, and answers to your questions instantly.</p>
        </div>
        <div className="flex items-center space-x-1 text-sm font-semibold text-purple-400 group-hover:text-purple-300">
            <span>Ask Now</span>
            <ChevronRightIcon className="h-4 w-4" />
        </div>
    </FloatingCard>
);

const LearningHubTeaserPanel: FC<{ onNavigate: (view: string, params?: any) => void }> = ({ onNavigate }) => (
    <FloatingCard 
      onClick={() => onNavigate('learning', { category: 'Saving' })} 
      className="aspect-square !p-5 group cursor-pointer flex flex-col justify-between items-start hover:-translate-y-1 animate-active-glow-blue"
      style={{ backgroundImage: `radial-gradient(circle at top right, rgba(56, 189, 248, 0.1), transparent 50%)` }}
    >
        <div>
            <div className="p-3 bg-sky-900/50 rounded-2xl w-fit mb-3"><BookOpenIcon /></div>
            <h3 className="font-bold text-gray-200 text-lg">Learning Hub</h3>
            <p className="text-sm text-gray-400 mt-1">Explore bite-sized lessons on saving psychology, automation, and advanced strategies.</p>
        </div>
        <div className="flex items-center space-x-1 text-sm font-semibold text-sky-400 group-hover:text-sky-300">
            <span>Start Learning</span>
            <ChevronRightIcon className="h-4 w-4" />
        </div>
    </FloatingCard>
);

// --- MAIN SCREEN COMPONENT ---
const SaveScreen: React.FC<{ onNavigate: (view: string, params?: any) => void; }> = ({ onNavigate }) => {
    const { savingsGoals, addSavingsGoal, updateSavingsGoal } = useContext(FinancialContext);

    const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
    const [goalToFund, setGoalToFund] = useState<DetailedSavingsGoal | null>(null);
    const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
    const [planningGoal, setPlanningGoal] = useState<DetailedSavingsGoal | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isTotalPlanModalOpen, setIsTotalPlanModalOpen] = useState(false);
    const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
    const [isWhyStableMoneyModalOpen, setIsWhyStableMoneyModalOpen] = useState(false);
  
    const { emergencyFund, otherGoals, totalSavings, totalTarget, overallProgress, averageReturn } = useMemo(() => {
        const emergency = savingsGoals.find(g => g.isEmergency);
        const others = savingsGoals.filter(g => !g.isEmergency);
        const saved = savingsGoals.reduce((sum, goal) => sum + goal.saved, 0);
        const target = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);
        const progress = target > 0 ? (saved / target) * 100 : 0;
        const avgReturn = savingsGoals.length > 0 ? savingsGoals.reduce((sum, g) => sum + (g.growthRate || 0), 0) / savingsGoals.length : 0;
        
        return { 
            emergencyFund: emergency, 
            otherGoals: others,
            totalSavings: saved,
            totalTarget: target,
            overallProgress: progress,
            averageReturn: avgReturn
        };
    }, [savingsGoals]);

    const planningData = useMemo(() => {
        const goalForPlan = isTotalPlanModalOpen ? null : planningGoal;
        const goalsToPlan = goalForPlan ? [goalForPlan] : (isTotalPlanModalOpen ? savingsGoals : []);

        if (goalsToPlan.length === 0) return null;
        
        const title = isTotalPlanModalOpen ? "Overall Savings Plan" : `${planningGoal?.name} Plan`;
        const targetAmount = goalsToPlan.reduce((s, g) => s + g.target, 0);
        const savedAmount = goalsToPlan.reduce((s, g) => s + g.saved, 0);
        
        let latestDate = new Date(0);
        goalsToPlan.forEach(g => {
            const gDate = new Date(g.targetDate);
            if (gDate > latestDate) latestDate = gDate;
        });

        const now = new Date();
        const monthsLeft = Math.max(1, (latestDate.getFullYear() - now.getFullYear()) * 12 + latestDate.getMonth() - now.getMonth());
        const monthlyContribution = (targetAmount - savedAmount) > 0 ? (targetAmount - savedAmount) / monthsLeft : 0;

        const projection = [];
        let currentBalance = savedAmount;
        for (let i = 1; i <= monthsLeft; i++) {
            currentBalance += monthlyContribution;
            projection.push({ month: i, value: Math.round(currentBalance) });
        }

        const growthRate = goalForPlan?.growthRate || 6;
        let monthsWithGrowth = 0;
        let balance = savedAmount;
        const monthlyGrowthRate = (growthRate / 100) / 12; 
        
        if (monthlyContribution > 0) {
            while (balance < targetAmount && monthsWithGrowth < 1200) {
                balance += monthlyContribution;
                balance *= (1 + monthlyGrowthRate);
                monthsWithGrowth++;
            }
        }

        const monthsSaved = monthsLeft - monthsWithGrowth;

        return {
            goal: goalForPlan || goalsToPlan[0], title, targetAmount, savedAmount, monthlyContribution, monthsRemaining: monthlyContribution > 0 ? monthsLeft : 0, targetDate: latestDate,
            acceleratedMonthsSaved: monthsSaved > 0 ? Math.floor(monthsSaved) : 0, projectionData: projection
        };
    }, [planningGoal, isTotalPlanModalOpen, savingsGoals]);

    useEffect(() => {
        if (!emergencyFund && savingsGoals.length === 0) {
            const nextYear = new Date();
            nextYear.setFullYear(nextYear.getFullYear() + 1);
            addSavingsGoal({
                name: "Emergency Fund", target: 300000, saved: 0, emoji: '🛡️', color: 'from-amber-400 to-orange-500',
                targetDate: nextYear.toISOString().slice(0, 7), isEmergency: true, growthRate: 6,
            });
        }
    }, [emergencyFund, addSavingsGoal, savingsGoals.length]);
  
    return (
        <div className="bg-[#0A0E17] text-gray-200">
            <div className="p-6 space-y-8 animate-fade-in">
                <svg width="0" height="0" className="absolute">
                    <defs>
                        <linearGradient id="savingsProgressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                           <stop offset="0%" stopColor="#22d3ee" />
                           <stop offset="100%" stopColor="#0ea5e9" />
                        </linearGradient>
                    </defs>
                </svg>

                <RotatingHeader />

                <SavingsOverviewPanel 
                    totalSavings={totalSavings} 
                    totalTarget={totalTarget} 
                    progress={overallProgress}
                    emergencyFundSaved={emergencyFund?.saved || 0}
                    averageReturn={averageReturn}
                    goalsCount={savingsGoals.length}
                />

                {emergencyFund && (
                    <EmergencyFundPanel 
                        goal={emergencyFund} 
                        onAddFunds={() => setGoalToFund(emergencyFund)}
                        onOpenWhy={() => setIsWhyModalOpen(true)}
                        onOpenPlan={() => setPlanningGoal(emergencyFund)}
                        onOpenEdit={() => setIsEditModalOpen(true)}
                    />
                )}
                
                <div>
                  <div className="flex justify-between items-center mb-4 mt-8">
                    <h2 className="text-2xl font-extrabold text-gray-100 font-montserrat">Other Goals</h2>
                    <PressableButton onClick={() => setIsAddGoalModalOpen(true)} className="flex items-center space-x-1.5 text-sm font-semibold text-sky-300 bg-sky-900/50 px-4 py-2 rounded-xl hover:bg-sky-800/50 transition-colors">
                        <PlusIcon className="h-4 w-4"/><span>New Goal</span>
                    </PressableButton>
                  </div>
                  <div className="space-y-3">
                    {otherGoals.length > 0 ? (
                        otherGoals.map((goal) => <OtherGoalCard key={goal.id} goal={goal} onAddFundsClick={() => setGoalToFund(goal)} onPlanningClick={() => setPlanningGoal(goal)} />)
                    ) : (
                        <FloatingCard className="text-center py-10 text-gray-400">
                            <p className="text-lg">Your goals will appear here.</p>
                            <p>Click 'New Goal' to start saving for something amazing!</p>
                        </FloatingCard>
                    )}
                  </div>
                </div>
                
                <SavingInsightsPanel />
                <SavingsAllocationChartsPanel />

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AIChatTeaserPanel onNavigate={onNavigate} />
                    <LearningHubTeaserPanel onNavigate={onNavigate} />
                </div>
                
                <InvestSavingsSmartlyPanel 
                    onOpenDeepDive={() => setIsDeepDiveOpen(true)} 
                    onOpenWhyStableMoney={() => setIsWhyStableMoneyModalOpen(true)}
                />
                
                <FaqSection />
            </div>

            {isAddGoalModalOpen && <AddNewGoalModal onClose={() => setIsAddGoalModalOpen(false)} />}
            {goalToFund && <AddFundsModal goal={goalToFund} onClose={() => setGoalToFund(null)} />}
            {isWhyModalOpen && <EmergencyWhyModal onClose={() => setIsWhyModalOpen(false)} />}
            {(planningGoal || isTotalPlanModalOpen) && planningData && (
                 <FullScreenPlanModal 
                    {...planningData} 
                    onClose={() => { setPlanningGoal(null); setIsTotalPlanModalOpen(false); }}
                 />
            )}
            {isEditModalOpen && emergencyFund && (
                <EditEmergencyFundModal 
                    goal={emergencyFund} 
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={(updates) => updateSavingsGoal(emergencyFund.id, updates)}
                />
            )}
            {isDeepDiveOpen && <ComparisonDeepDiveModal onClose={() => setIsDeepDiveOpen(false)} />}
            {isWhyStableMoneyModalOpen && <WhyStableMoneyModal onClose={() => setIsWhyStableMoneyModalOpen(false)} />}
        </div>
    );
};

export default SaveScreen;