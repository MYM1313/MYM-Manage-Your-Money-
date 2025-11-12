import React, { useState, useContext, useMemo, useEffect, FC, useRef } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';
import { FinancialContext } from '../App';
import { SuperCategory, Transaction } from '../types';
import { InsightBadgeIcon } from '../components/icons/InsightBadgeIcon';
import AddTransactionModal from '../components/modals/AddTransactionModal';
import ProgressBar from '../components/shared/ProgressBar';
import { BrainCircuitIcon } from '../components/icons/BrainCircuitIcon';
import { ChatIcon as SparklesIcon } from '../components/icons/ChatIcon';
import AITransactionModal from '../components/modals/AITransactionModal';


// --- ICONS (Defined locally for this screen) ---
const MoneyBagIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 3a9 9 0 00-18 0" /></svg> );
const ReceiptIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h5.25m-5.25 0h5.25M9 6.75h5.25m-5.25 3h5.25m-5.25 3h5.25M4.5 21V3a2.25 2.25 0 012.25-2.25h10.5A2.25 2.25 0 0119.5 3v18m-15 0a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25m-15 0V3" /></svg> );
const BankIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 12h6m-6 5.25h6M5.25 6h.008v.008H5.25V6zm0 5.25h.008v.008H5.25v-0.008zm0 5.25h.008v.008H5.25v-0.008zm13.5-5.25h.008v.008h-.008v-0.008zm0 5.25h.008v.008h-.008v-0.008zM18 6h.008v.008H18V6z" /></svg> );
const ShieldIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 22a12.02 12.02 0 009-1.056c.343-.344.65-.72.923-1.138A11.955 11.955 0 0112 2.944z" /></svg> );
const ChartBarIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> );
const TicketIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg> );
const GearIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> );
const SparklesIconSmall: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-cyan-400 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.528l-.259-1.035a3.375 3.375 0 00-2.456-2.456L13.25 16l1.035-.259a3.375 3.375 0 002.456-2.456l.259-1.035.259 1.035a3.375 3.375 0 002.456 2.456l1.035.259-1.035.259a3.375 3.375 0 00-2.456 2.456l-.259 1.035z" /></svg> );
const FlashIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const UserGrowthIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const InfoIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg> );
const LightBulbIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>);
const ChevronRightIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5 text-gray-500" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>);


// --- HELPER & ANIMATION COMPONENTS ---
const CountUp: React.FC<{ end: number; duration?: number }> = ({ end, duration = 1500 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      if (start === end) return;
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setCount(parseFloat((progress * (end - start)).toFixed(0)));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };
      window.requestAnimationFrame(step);
    }, [end, duration]);
    return <span>{count.toLocaleString('en-IN')}</span>;
};

// --- DASHBOARD SECTION COMPONENTS ---
const MOTIVATIONAL_PHRASES = [
    "Discipline is the bridge between goals and accomplishment.",
    "A budget is telling your money where to go.",
    "Track your progress. Celebrate your wins.",
    "Small savings build great fortunes.",
];

const MotivationalHeader: React.FC = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % MOTIVATIONAL_PHRASES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative text-center h-10 flex items-center justify-center overflow-hidden animate-slide-up-fade-in">
            <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent"></div>
            <div className="relative h-6 w-full">
                {MOTIVATIONAL_PHRASES.map((phrase, i) => (
                        <p key={i} className={`absolute inset-0 text-sm font-medium text-gray-400 transition-all duration-700 ease-in-out ${i === index ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
                        {phrase}
                    </p>
                ))}
            </div>
        </div>
    );
};

const AISpendingCoachPanel: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
    const { transactions } = useContext(FinancialContext);

    const aiTip = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth());
        if (expenses.length < 5) {
            return {
                title: "Start Tracking for Insights",
                text: "The more you track, the more personalized our guidance becomes. Let's build a clear financial picture together."
            };
        }
        
        const weekendSpending = expenses.filter(t => [0,6].includes(new Date(t.date).getDay())).reduce((s,t) => s + t.amount, 0);
        const totalExpenses = expenses.reduce((s,t) => s+t.amount, 0);
        const weekdaySpending = totalExpenses - weekendSpending;

        if (weekendSpending > weekdaySpending * 1.5 && weekdaySpending > 0) {
             return {
                title: "Weekend Spending Habits",
                text: `Your spending on weekends is significantly higher. Planning low-cost activities like a home movie night instead of going out could save you over ₹2,000 this month.`
            };
        }
        
        const recurring = expenses.filter(t => t.isRecurring);
        if (recurring.length > 3) {
            return {
                title: "Subscription Check-In",
                text: "You have several recurring payments. It's a great time to review them in your settings and cut any services you're not using to their full potential."
            }
        }

        return {
            title: "Master Your Financial Flow",
            text: "You're doing great! To optimize further, review your recurring bills. A small saving there can make a big difference over the year."
        };
    }, [transactions]);

    return (
        <div className="premium-glass p-5 flex flex-col justify-between animate-slide-up-fade-in border-2 border-cyan-400/20 shadow-[0_0_25px_rgba(45,212,191,0.1)]">
            <div>
                <div className="flex items-start space-x-3 mb-3">
                    <div className="flex-shrink-0 bg-gray-900/50 p-3 rounded-xl animate-float">
                        <LightBulbIcon />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold font-montserrat text-gray-100">AI Spending Coach</h2>
                        <p className="text-xs text-gray-400">Behavioral nudges for smarter spending.</p>
                    </div>
                </div>
                
                <div className="bg-black/30 p-3 rounded-xl border border-white/10 h-28 overflow-y-auto no-scrollbar">
                    <h3 className="font-semibold text-cyan-300 text-sm mb-1">{aiTip.title}</h3>
                    <p className="text-xs text-gray-200">{aiTip.text}</p>
                </div>
            </div>

            <button onClick={() => onNavigate('aiAnalysis')} className="w-full mt-4 text-center text-sm font-semibold text-sky-300 bg-sky-900/50 py-2 rounded-lg hover:bg-sky-800/50 transition-colors flex items-center justify-center space-x-2">
                <span>Explore Full Analysis</span>
                <ChevronRightIcon className="h-4 w-4" />
            </button>
        </div>
    );
};

const LeftoverInfoModal: React.FC<{ isVisible: boolean; onClose: () => void; }> = ({ isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50" onClick={onClose}>
            <div 
                className="w-full bg-gradient-to-t from-[#181C23] to-[#1F242E] border-t-2 border-sky-500/50 rounded-t-3xl p-6 space-y-6 animate-slide-up" 
                onClick={e => e.stopPropagation()}
            >
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gray-700 rounded-full"></div>
                
                <div className="text-center pt-4">
                    <div className="inline-block p-3 bg-gray-900/50 rounded-2xl border border-gray-700 mb-2">
                        <BankIcon />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-100">Your Surplus Cash</h2>
                    <p className="text-sm text-gray-400">This is your unallocated money for the month.</p>
                </div>
                
                <div className="space-y-4">
                    <div className="bg-black/30 p-4 rounded-2xl border border-white/10">
                        <h3 className="font-semibold text-sky-300 mb-2">What it is:</h3>
                        <p className="text-sm text-gray-300">It's the money left over after all your transactions (expenses, savings, and investments) are subtracted from your income.</p>
                        <p className="text-center font-mono text-xs bg-gray-900/50 p-2 rounded-lg mt-3 text-gray-400">
                            Income - Total Outflow = Surplus Cash
                        </p>
                    </div>
                    
                    <div className="bg-black/30 p-4 rounded-2xl border border-white/10">
                        <h3 className="font-semibold text-green-300 mb-2">What happens next:</h3>
                        <p className="text-sm text-gray-300">
                            At the end of the month, we'll remind you to put this surplus to work! You'll get to choose whether to:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mt-2 pl-2">
                            <li>Boost one of your <span className="font-semibold text-amber-400">Savings Goals</span></li>
                            <li>Make an extra <span className="font-semibold text-purple-400">Investment</span></li>
                            <li>Pay down <span className="font-semibold text-orange-400">Debt</span> faster</li>
                        </ul>
                    </div>
                </div>

                <button 
                    onClick={onClose} 
                    className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-500 transition-colors"
                >
                    Sounds Good
                </button>
            </div>
        </div>
    );
};

const MonthlyGlanceCard: React.FC = () => {
    const { transactions } = useContext(FinancialContext);
    const [isInfoVisible, setInfoVisible] = useState(false);
    
    const stats = useMemo(() => {
        const income = transactions.filter(t => t.superCategory === 'Income').reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const essential = transactions.filter(t => t.superCategory === 'Essential').reduce((sum, t) => sum + t.amount, 0);
        const investment = transactions.filter(t => t.superCategory === 'Investment' || t.superCategory === 'Savings').reduce((sum, t) => sum + t.amount, 0);
        const entertainment = transactions.filter(t => t.superCategory === 'Entertainment').reduce((sum, t) => sum + t.amount, 0);
        return { income, expense, leftover: income - expense, essential, investment, entertainment };
    }, [transactions]);

    const GlanceItem: React.FC<{ icon: React.ReactNode; label: string; value: number; onClick?: () => void; withInfoIcon?: boolean }> = ({ icon, label, value, onClick, withInfoIcon }) => (
        <div className={`flex flex-col items-center space-y-1 ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
            {React.cloneElement(icon as React.ReactElement, { className: 'h-6 w-6' })}
            <div className="flex items-center space-x-1">
                 <p className="text-xs text-gray-400 font-medium">{label}</p>
                 {withInfoIcon && <InfoIcon className="w-3 h-3 text-gray-500 hover:text-sky-300 transition-colors" />}
            </div>
            <p className="font-bold text-gray-100 text-lg">₹<CountUp end={value} /></p>
        </div>
    );
    
    const SubCategoryItem: React.FC<{label: string, value: number}> = ({ label, value }) => (
        <div className="text-center px-2">
            <p className="text-xs font-medium text-gray-400">{label}</p>
            <p className="text-sm font-semibold text-gray-100 mt-0.5">₹{value.toLocaleString('en-IN')}</p>
        </div>
    );

    return (
        <>
            <div className="premium-glass !p-5 space-y-4 animate-slide-up-fade-in" style={{animationDelay: '200ms'}}>
                <h2 className="text-sm font-semibold text-gray-400 text-center tracking-wider">MONTHLY GLANCE</h2>
                <div className="grid grid-cols-3 gap-4 pt-2">
                    <GlanceItem icon={<MoneyBagIcon />} label="INCOME" value={stats.income} />
                    <GlanceItem icon={<ReceiptIcon />} label="EXPENSE" value={stats.expense} />
                    <GlanceItem icon={<BankIcon />} label="LEFTOVER" value={stats.leftover} onClick={() => setInfoVisible(true)} withInfoIcon={true} />
                </div>
                <div className="border-t border-white/10 pt-4 mt-3 flex justify-around items-center">
                    <SubCategoryItem label="Essential" value={stats.essential} />
                    <div className="h-6 w-px bg-white/10"></div>
                    <SubCategoryItem label="Investment" value={stats.investment} />
                    <div className="h-6 w-px bg-white/10"></div>
                    <SubCategoryItem label="Entertainment" value={stats.entertainment} />
                </div>
            </div>
            <LeftoverInfoModal
                isVisible={isInfoVisible}
                onClose={() => setInfoVisible(false)}
            />
        </>
    );
};

const ExpenseBreakdownList: React.FC<{ onOpenSettings: () => void }> = ({ onOpenSettings }) => {
    const { transactions, categorySplit } = useContext(FinancialContext);
    const [expandedCategory, setExpandedCategory] = useState<SuperCategory | null>(null);

    const { essential, investment, entertainment, totalIncome } = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const incomeThisMonth = transactions.filter(t => t.superCategory === 'Income' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear).reduce((sum, t) => sum + t.amount, 0);

        const transactionsThisMonth = transactions.filter(t => new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear);

        const essentialTrans = transactionsThisMonth.filter(t => t.superCategory === 'Essential');
        const investmentTrans = transactionsThisMonth.filter(t => t.superCategory === 'Investment' || t.superCategory === 'Savings');
        const wantsTrans = transactionsThisMonth.filter(t => t.superCategory === 'Entertainment');
        return {
            totalIncome: incomeThisMonth,
            essential: { transactions: essentialTrans, spent: essentialTrans.reduce((s, t) => s + t.amount, 0) },
            investment: { transactions: investmentTrans, spent: investmentTrans.reduce((s, t) => s + t.amount, 0) },
            entertainment: { transactions: wantsTrans, spent: wantsTrans.reduce((s, t) => s + t.amount, 0) },
        };
    }, [transactions]);
    
    const essentialBudget = totalIncome * (categorySplit.essential / 100);
    const investmentBudget = totalIncome * (categorySplit.investment / 100);
    const entertainmentBudget = totalIncome * (categorySplit.wants / 100);

    const BreakdownItem: React.FC<{ 
        icon: React.ReactNode; 
        title: string;
        transactions: Transaction[]; 
        spent: number; 
        budget: number;
        budgetPercent: number;
        isExpanded: boolean; 
        onClick: () => void; 
        color: string;
    }> = ({ icon, title, spent, budget, budgetPercent, transactions, isExpanded, onClick, color }) => {
        const progress = budget > 0 ? (spent / budget) * 100 : 0;
        const isOverBudget = progress > 100;
        
        return (
            <div className="bg-black/20 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out">
                <div onClick={onClick} className="w-full flex items-center space-x-4 p-4 cursor-pointer hover:bg-white/5 transition-colors">
                    <div className="p-3 bg-gray-900/50 rounded-xl">{icon}</div>
                    <div className='flex-1 text-left'>
                        <p className="font-bold text-gray-100">{title}</p>
                        <p className="text-xs text-gray-400">{budgetPercent}% of Budget</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="text-right w-28">
                             <p className={`font-semibold text-gray-100 text-lg ${isOverBudget ? 'text-red-400' : ''}`}>₹{spent.toLocaleString('en-IN')}</p>
                             <p className="text-xs text-gray-400">Budget: ₹{budget.toLocaleString('en-IN')}</p>
                        </div>
                        <ChevronDownIcon className={`transition-transform duration-300 ${isExpanded ? '-rotate-180' : ''}`} />
                    </div>
                </div>
                { budget > 0 && <div className="px-4 pb-2 -mt-1"><ProgressBar progress={progress} color={isOverBudget ? 'from-red-500 to-orange-500' : color} /></div> }

                <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                        <div className="px-4 pb-4 pt-2 border-t border-white/10 space-y-2">
                            {transactions.length > 0 ? (
                                transactions.slice(0, 5).map(t => (
                                    <div key={t.id} className="flex justify-between items-center text-sm bg-black/30 p-3 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-gray-200">{t.merchant}</p>
                                            <p className="text-xs text-gray-500">
                                                {t.category} &bull; {new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                        <p className="font-mono text-gray-200 text-base">-₹{t.amount.toLocaleString()}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 text-sm py-4">No transactions in this category yet.</p>
                            )}
                            {transactions.length > 5 && (
                                <button className="w-full text-center text-xs font-semibold text-sky-400 py-2 hover:text-sky-300">
                                    View all {transactions.length} transactions
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleToggle = (category: SuperCategory) => {
        setExpandedCategory(prev => prev === category ? null : category);
    };

    return (
        <div className="animate-slide-up-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex justify-between items-center mb-2 px-2">
                <h2 className="text-xl font-bold text-gray-100 tracking-wide">EXPENSE & BUDGET</h2>
                <button onClick={onOpenSettings} aria-label="Expense settings"><GearIcon /></button>
            </div>
            <div className="premium-glass !p-4">
                {totalIncome > 0 ? (
                    <div className="space-y-3">
                        <BreakdownItem icon={<ShieldIcon />} title="Essential Expenses" transactions={essential.transactions} spent={essential.spent} budget={essentialBudget} budgetPercent={categorySplit.essential} isExpanded={expandedCategory === 'Essential'} onClick={() => handleToggle('Essential')} color="from-rose-500 to-red-500" />
                        <BreakdownItem icon={<ChartBarIcon />} title="Investments & Savings" transactions={investment.transactions} spent={investment.spent} budget={investmentBudget} budgetPercent={categorySplit.investment} isExpanded={expandedCategory === 'Investment'} onClick={() => handleToggle('Investment')} color="from-purple-500 to-indigo-500" />
                        <BreakdownItem icon={<TicketIcon />} title="Wants & Entertainment" transactions={entertainment.transactions} spent={entertainment.spent} budget={entertainmentBudget} budgetPercent={categorySplit.wants} isExpanded={expandedCategory === 'Entertainment'} onClick={() => handleToggle('Entertainment')} color="from-amber-500 to-orange-500" />
                    </div>
                ) : (
                    <p className="text-center text-gray-400 p-8">Add this month's income to activate your budget.</p>
                )}
            </div>
        </div>
    );
};


// --- INSIGHTS SECTION COMPONENTS ---
const SpendingIndexInfoModal: React.FC<{ isVisible: boolean; onClose: () => void; scoreDetails: { score: number; reasons: { text: string; points: string; }[] } }> = ({ isVisible, onClose, scoreDetails }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50" onClick={onClose}>
            <div className={`w-full bg-gradient-to-t from-[#1e1e1e] to-[#2a2a2a] border-t-2 border-sky-500/50 rounded-t-3xl p-6 space-y-4 ${isVisible ? 'animate-slide-up' : 'animate-slide-down'}`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-center mb-2"><div className="w-16 h-1.5 bg-gray-700 rounded-full"></div></div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-100">Your Spending Index</h2>
                    <p className="text-sm text-gray-400">A snapshot of your financial habits.</p>
                </div>
                
                <div className="bg-black/30 p-4 rounded-xl text-center space-y-2">
                    <p className="text-sm text-gray-400">Your Score</p>
                    <p className="text-5xl font-bold text-sky-400">{scoreDetails.score} <span className="text-2xl text-gray-500">/ 100</span></p>
                </div>
                
                <div className="space-y-3 pt-2">
                    <h3 className="font-semibold text-gray-200">How your score was calculated:</h3>
                    <div className="bg-gray-900/50 p-4 rounded-xl space-y-3 border border-gray-700">
                        {scoreDetails.reasons.map((reason, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <p className="text-sm text-gray-300 flex-1">{reason.text}</p>
                                <p className="font-bold text-lg text-sky-400 ml-4">{reason.points}</p>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="pt-2">
                    <p className="text-xs text-gray-500 text-center">This score is a guide. Consistently tracking and managing your budget will naturally improve it over time.</p>
                </div>
            </div>
        </div>
    );
};

const ExpenseInsightsCards: React.FC = () => {
    const { transactions, categorySplit } = useContext(FinancialContext);
    const [isInfoModalOpen, setInfoModalOpen] = useState(false);

    const { burnRate, spendingIndexDetails } = useMemo(() => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const expensesThisMonth = transactions.filter(t => new Date(t.date) >= startOfMonth && (t.type === 'expense' || t.type === 'savings' || t.type === 'investment'));
        const totalSpent = expensesThisMonth.reduce((sum, t) => sum + t.amount, 0);
        
        const rate = totalSpent > 0 ? totalSpent / today.getDate() : 0;
        
        const income = transactions.filter(t => new Date(t.date) >= startOfMonth && t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        
        let score = 0;
        const reasons: { text: string; points: string; }[] = [];

        // 1. Savings Rate (50 points)
        let savingsRatePoints = 0;
        if (income > 0) {
            const savingsRate = (income - totalSpent) / income;
            if (savingsRate >= 0.2) {
                savingsRatePoints = 50;
                reasons.push({ text: `Excellent savings rate of ${(savingsRate * 100).toFixed(0)}%`, points: `+${savingsRatePoints}`});
            } else if (savingsRate >= 0.1) {
                savingsRatePoints = 30;
                reasons.push({ text: `Good savings rate of ${(savingsRate * 100).toFixed(0)}%`, points: `+${savingsRatePoints}`});
            } else if (savingsRate > 0) {
                savingsRatePoints = 10;
                reasons.push({ text: `Positive savings rate of ${(savingsRate * 100).toFixed(0)}%`, points: `+${savingsRatePoints}`});
            } else {
                reasons.push({ text: 'Spending exceeded income this month', points: '+0'});
            }
        } else {
            reasons.push({ text: 'No income recorded to calculate savings rate', points: 'N/A'});
        }
        score += savingsRatePoints;

        // 2. Budget Adherence (50 points)
        let budgetAdherencePoints = 0;
        if (income > 0 && totalSpent > 0) {
            const essentialSpent = expensesThisMonth.filter(t => t.superCategory === 'Essential').reduce((s, t) => s + t.amount, 0);
            const investmentSpent = expensesThisMonth.filter(t => t.superCategory === 'Investment' || t.superCategory === 'Savings').reduce((s, t) => s + t.amount, 0);
            const wantsSpent = expensesThisMonth.filter(t => t.superCategory === 'Entertainment').reduce((s, t) => s + t.amount, 0);

            const essentialBudget = income * (categorySplit.essential / 100);
            const investmentBudget = income * (categorySplit.investment / 100);
            const wantsBudget = income * (categorySplit.wants / 100);
            
            const essentialDeviation = essentialBudget > 0 ? Math.max(0, (essentialSpent - essentialBudget) / essentialBudget) : 0;
            const wantsDeviation = wantsBudget > 0 ? Math.max(0, (wantsSpent - wantsBudget) / wantsBudget) : 0;
            
            const deviationPenalty = (essentialDeviation + wantsDeviation) * 50;
            budgetAdherencePoints = Math.max(0, 50 - deviationPenalty);
            
            score += budgetAdherencePoints;
            reasons.push({ text: `Adherence to your ${categorySplit.essential}/${categorySplit.investment}/${categorySplit.wants} budget`, points: `+${budgetAdherencePoints.toFixed(0)}`});
        } else {
            reasons.push({ text: 'No income to analyze against budget', points: 'N/A'});
        }

        score = Math.round(Math.min(100, Math.max(0, score)));

        return { burnRate: rate, spendingIndexDetails: { score, reasons } };
    }, [transactions, categorySplit]);

    const getScoreColor = (s: number) => {
        if (s > 75) return "text-green-400";
        if (s > 50) return "text-sky-400";
        if (s > 25) return "text-yellow-400";
        return "text-red-400";
    };
    
    return (
        <div className="animate-slide-up-fade-in" style={{animationDelay: '500ms'}}>
            <h2 className="text-xl font-bold text-gray-100 mb-3 px-2 tracking-wide">EXPENSE INSIGHTS</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="premium-glass !p-4 flex flex-col justify-center items-center text-center space-y-1">
                    <FlashIcon />
                    <p className="text-xs text-gray-400">Daily Burn Rate</p>
                    <p className="font-bold text-gray-100 text-xl">₹<CountUp end={burnRate} /></p>
                </div>
                <div className="premium-glass !p-4 flex flex-col justify-center items-center text-center space-y-1">
                     <div className="flex items-center space-x-2">
                        <UserGrowthIcon />
                        <button onClick={() => setInfoModalOpen(true)} className="text-gray-500 hover:text-white transition-colors">
                            <InfoIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-400">Spending Index</p>
                    <p className={`font-bold text-xl ${getScoreColor(spendingIndexDetails.score)}`}>
                        <CountUp end={spendingIndexDetails.score} /> / 100
                    </p>
                </div>
            </div>
             <SpendingIndexInfoModal isVisible={isInfoModalOpen} onClose={() => setInfoModalOpen(false)} scoreDetails={spendingIndexDetails} />
        </div>
    );
};

const VisualAnalyticsCard: React.FC = () => {
    const { transactions } = useContext(FinancialContext);
    const [chartMode, setChartMode] = useState<'Breakdown' | 'Overview'>('Breakdown');
    const [activeIndexBreakdown, setActiveIndexBreakdown] = useState<number | undefined>(undefined);
    const [activeIndexOverview, setActiveIndexOverview] = useState<number | undefined>(undefined);
    const swipeRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef(0);

    const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.targetTouches[0].clientX; };
    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEndX = e.changedTouches[0].clientX;
        if (touchStartX.current - touchEndX > 50) { setChartMode('Overview'); } 
        else if (touchStartX.current - touchEndX < -50) { setChartMode('Breakdown'); }
    };

    const breakdownData = useMemo(() => {
        const expenseByCategory = transactions.filter(t => t.type === 'expense' || t.type === 'investment' || t.type === 'savings').reduce((acc, t) => {
                const category = t.category;
                acc[category] = (acc[category] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>);
        return Object.keys(expenseByCategory).map(name => ({ name, value: expenseByCategory[name] })).sort((a, b) => b.value - a.value);
    }, [transactions]);
    
    const overviewData = useMemo(() => {
        const data: Record<string, number> = { 'Essential': 0, 'Entertainment': 0, 'Investment & Savings': 0 };
        transactions.forEach(t => {
            if (t.superCategory === 'Essential') data['Essential'] += t.amount;
            else if (t.superCategory === 'Entertainment') data['Entertainment'] += t.amount;
            else if (t.superCategory === 'Investment' || t.superCategory === 'Savings') data['Investment & Savings'] += t.amount;
        });
        return Object.keys(data).map(name => ({ name, value: data[name as keyof typeof data] })).filter(item => item.value > 0).sort((a,b) => b.value - a.value);
    }, [transactions]);

    const COLORS_BREAKDOWN = ['#0ea5e9', '#8b5cf6', '#10b981', '#f97316', '#ec4899', '#f59e0b', '#6366f1'];
    const COLORS_OVERVIEW: Record<string, string> = { 'Essential': '#f87171', 'Entertainment': '#f97316', 'Investment & Savings': '#a855f7' };

    const renderActiveShape = (props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
        return (
            <g>
                <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} className="font-bold text-lg drop-shadow-[0_0_4px_rgba(255,255,255,0.7)]">{`₹${payload.value.toLocaleString('en-IN')}`}</text>
                 <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#e5e7eb" className="text-sm">{payload.name}</text>
                <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} style={{ filter: `drop-shadow(0 0 12px ${fill})` }} />
            </g>
        );
    };

    return (
        <div className="animate-slide-up-fade-in" style={{animationDelay: '600ms'}}>
             <h2 className="text-xl font-bold text-gray-100 mb-3 px-2 tracking-wide">VISUAL ANALYTICS</h2>
             <div className="premium-glass !p-5 space-y-4">
                <div className="flex justify-center">
                    <div className="bg-gray-900/50 p-1 rounded-full flex items-center text-sm">
                        {(['Breakdown', 'Overview'] as const).map(opt => (
                            <button key={opt} onClick={() => setChartMode(opt)} className={`px-4 py-1.5 rounded-full font-semibold transition-all duration-300 ${chartMode === opt ? 'bg-cyan-500 text-white' : 'text-gray-400'}`}>{opt}</button>
                        ))}
                    </div>
                </div>
                 <div className="overflow-hidden" ref={swipeRef} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                    <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(${chartMode === 'Breakdown' ? '0%' : '-100%'})` }}>
                        <div className="w-full flex-shrink-0 h-72">
                            {breakdownData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={breakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="65%" outerRadius="85%" paddingAngle={5} activeIndex={activeIndexBreakdown} activeShape={renderActiveShape} onMouseEnter={(_, index) => setActiveIndexBreakdown(index)} onMouseLeave={() => setActiveIndexBreakdown(undefined)}>
                                            {breakdownData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS_BREAKDOWN[index % COLORS_BREAKDOWN.length]} className="focus:outline-none" />)}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (<div className="flex items-center justify-center h-full text-gray-400">No expense data for this period.</div>)}
                        </div>
                        <div className="w-full flex-shrink-0 h-72">
                             {overviewData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={overviewData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="65%" outerRadius="85%" paddingAngle={5} activeIndex={activeIndexOverview} activeShape={renderActiveShape} onMouseEnter={(_, index) => setActiveIndexOverview(index)} onMouseLeave={() => setActiveIndexOverview(undefined)}>
                                            {overviewData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS_OVERVIEW[entry.name as keyof typeof COLORS_OVERVIEW] || '#9ca3af'} className="focus:outline-none" />)}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (<div className="flex items-center justify-center h-full text-gray-400">No expense data for this period.</div>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AIChatSuggestionPanel: FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => (
    <div 
        onClick={() => onNavigate('aiChat')}
        className="premium-glass !p-6 cursor-pointer group animate-slide-up-fade-in border-2 border-transparent hover:border-purple-500/50 bg-gradient-to-br from-indigo-900/40 to-purple-900/40"
        style={{ animation: 'orb-pulse 6s infinite ease-in-out', animationDelay: '700ms' }}
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-black/30 rounded-full">
                    <SparklesIconSmall className="h-8 w-8 text-purple-300 transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div>
                    <h3 className="text-xl font-bold font-montserrat text-gray-100">Go Deeper with AI</h3>
                    <p className="text-sm text-gray-400">Ask about your spending, get custom advice.</p>
                </div>
            </div>
            <ChevronRightIcon className="h-8 w-8 text-gray-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-purple-300" />
        </div>
    </div>
);

// --- LEARN SECTION COMPONENTS ---
const LearnCard: React.FC = () => (
    <div className="premium-glass !p-5 flex items-center space-x-4 group cursor-pointer hover:border-cyan-400/30 animate-slide-up-fade-in" style={{animationDelay: '800ms'}}>
        <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-cyan-900/50 to-gray-900/50 rounded-2xl flex items-center justify-center shadow-lg">
            <InsightBadgeIcon className="h-8 w-8 text-cyan-300"/>
        </div>
        <div className="flex-1">
            <h3 className="font-bold text-gray-100 text-lg">Learn & Improve Your Budgeting and Expenses</h3>
            <p className="text-sm text-gray-400">Discover tips, strategies, and insights to optimize your spending, save more effectively, and make smarter financial decisions. Start improving your budgeting today.</p>
        </div>
        <ChevronRightIcon className="h-6 w-6 text-gray-500 group-hover:text-cyan-300 transition-colors" />
    </div>
);

const FaqSection: React.FC = () => {
    const faqs = [
        "How can I track my daily expenses effectively?",
        "How do I set a budget for my monthly spending?",
    ];
    return (
        <div className="animate-slide-up-fade-in" style={{animationDelay: '900ms'}}>
            <h2 className="text-sm font-semibold text-gray-400 mb-3 px-2 tracking-wider">FREQUENTLY ASKED QUESTIONS</h2>
            <div className="premium-glass !p-2 divide-y divide-gray-200/10">
                {faqs.map(faq => (
                    <button key={faq} className="w-full p-4 flex justify-between items-center text-left hover:bg-white/5 rounded-xl transition-colors">
                        <span className="font-semibold text-gray-200">{faq}</span>
                        <ChevronRightIcon />
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- MAIN SCREEN ---
const ExpenseScreen: React.FC<{ onNavigate: (view: string, params?: any) => void }> = ({ onNavigate }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    return (
        <>
            <div className="p-6 space-y-6 pb-24">
                <MotivationalHeader />
                <MonthlyGlanceCard />
                <div className="flex gap-4 justify-center animate-slide-up-fade-in" style={{ animationDelay: '300ms' }}>
                    <button 
                        onClick={() => setIsAIModalOpen(true)}
                        className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-100 transition-transform transform text-lg flex items-center justify-center space-x-2"
                    >
                        <SparklesIcon className="h-6 w-6" />
                        <span>Add with AI</span>
                    </button>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex-1 py-4 bg-black/20 border border-white/10 text-gray-300 font-bold rounded-2xl hover:bg-white/5 active:scale-95 transition-transform transform text-lg"
                    >
                        Add Manually
                    </button>
                </div>
                <ExpenseBreakdownList onOpenSettings={() => setIsSettingsModalOpen(true)} />
                <div className="animate-slide-up-fade-in" style={{animationDelay: '100ms'}}>
                    <AISpendingCoachPanel onNavigate={onNavigate} />
                </div>
                <ExpenseInsightsCards />
                <VisualAnalyticsCard />
                <AIChatSuggestionPanel onNavigate={onNavigate} />
                <LearnCard />
                <FaqSection />
            </div>
            <AddTransactionModal isVisible={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onNavigate={onNavigate} />
            <AITransactionModal isVisible={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
            <SettingsModal isVisible={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
        </>
    );
};


// --- MODALS (Reused & Styled) ---
const SettingsModal: React.FC<{ isVisible: boolean; onClose: () => void; }> = ({ isVisible, onClose }) => {
    const { categorySplit, setCategorySplit } = useContext(FinancialContext);
    const [localSplit, setLocalSplit] = useState(categorySplit);

    useEffect(() => {
        setLocalSplit(categorySplit);
    }, [categorySplit, isVisible]);

    const handleSliderChange = (key: 'essential' | 'investment', value: number) => {
        const newSplit = { ...localSplit };
        
        if (key === 'essential') {
            if (value + localSplit.investment > 100) {
                newSplit.investment = 100 - value;
            }
            newSplit.essential = value;
        } else { // key is 'investment'
            if (value + localSplit.essential > 100) {
                newSplit.essential = 100 - value;
            }
            newSplit.investment = value;
        }
        newSplit.wants = 100 - newSplit.essential - newSplit.investment;
        setLocalSplit(newSplit);
    };
    
    const handleSave = () => {
        setCategorySplit(localSplit);
        onClose();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50" onClick={onClose}>
            <div className={`w-full bg-gradient-to-t from-[#10141b] to-[#1e293b] border-t-2 border-sky-500/50 rounded-t-3xl p-6 space-y-4 ${isVisible ? 'animate-slide-up' : 'animate-slide-down'}`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-center mb-2"><div className="w-16 h-1.5 bg-gray-700 rounded-full"></div></div>
                <h2 className="text-2xl font-bold text-gray-100 text-center">Customize Budget Split</h2>
                <p className="text-sm text-center text-gray-400">Based on the 50/30/20 rule. Adjust to fit your lifestyle.</p>
                <div className="space-y-6 pt-4">
                    <div>
                        <label className="flex justify-between font-semibold text-gray-200"><span>Essential Needs</span> <span className="text-sky-300">{localSplit.essential}%</span></label>
                        <input type="range" min="0" max="100" value={localSplit.essential} onChange={e => handleSliderChange('essential', parseInt(e.target.value))} className="w-full range-blue mt-2" />
                    </div>
                     <div>
                        <label className="flex justify-between font-semibold text-gray-200"><span>Investments & Savings</span> <span className="text-sky-300">{localSplit.investment}%</span></label>
                        <input type="range" min="0" max="100" value={localSplit.investment} onChange={e => handleSliderChange('investment', parseInt(e.target.value))} className="w-full range-blue mt-2" />
                    </div>
                     <div>
                        <label className="flex justify-between font-semibold text-gray-200"><span>Wants & Entertainment</span> <span className="text-sky-300">{localSplit.wants}%</span></label>
                        <input type="range" disabled value={localSplit.wants} className="w-full range-blue mt-2" />
                    </div>
                </div>
                <button onClick={handleSave} className="w-full py-3 bg-sky-500 text-white font-bold rounded-xl mt-4 hover:bg-sky-400 transition-colors">Save Settings</button>
            </div>
        </div>
    );
};

export default ExpenseScreen;