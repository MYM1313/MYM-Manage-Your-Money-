import React, { useState, useEffect, useMemo, useContext, FC, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Sector } from 'recharts';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';
import { TrophyIcon } from '../components/icons/TrophyIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { XIcon } from '../components/icons/XIcon';
import { FinancialContext } from '../App';
import { Debt, DebtPlan, Strategy, RoadmapItem, DebtPaymentDetail } from '../types';
import { InfoIcon } from '../components/icons/InfoIcon';
import GlassmorphicPanel from '../components/shared/Card';
import { AIIcon } from '../components/icons/AIIcon';
import { BookOpenIcon } from '../components/icons/BookOpenIcon';
import { FileTextIcon } from '../components/icons/FileTextIcon';
import { SigmaIcon } from '../components/icons/SigmaIcon';
import { FlashIcon } from '../components/icons/FlashIcon';
import { TrendingUpIcon } from '../components/icons/TrendingUpIcon';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import { ToolsIcon } from '../components/icons/ToolsIcon';
import { CheckIcon } from '../components/icons/CheckIcon';
import { LightBulbIcon } from '../components/icons/LightBulbIcon';
import ProgressBar from '../components/shared/ProgressBar';


// --- TYPE DEFINITIONS (Local to this file now) ---
type Phase = 'input' | 'strategy' | 'calculating' | 'dashboard';


// --- HELPER FUNCTIONS ---
const calculatePlan = (debts: Omit<Debt, 'id'>[], strategy: Strategy, extraMonthlyPayment: number): Omit<DebtPlan, 'automatedPlanTransactionId'|'checkedInMonths'> => {
    let currentDebts: (Omit<Debt, 'id'> & { id: number, amount: number })[] = JSON.parse(JSON.stringify(debts.filter(d => d.amount > 0).map((d, i) => ({...d, id: i}))));
    if (currentDebts.length === 0) {
        return { strategy, totalMonths: 0, totalInterest: 0, totalPaid: 0, monthlyPayment: 0, extraMonthlyPayment, debts: [], roadmap: [] };
    }

    const initialTotalDebt = currentDebts.reduce((sum, d) => sum + d.amount, 0);
    let month = 0;
    let totalInterestPaid = 0;
    const roadmap: RoadmapItem[] = [];

    while (currentDebts.some(d => d.amount > 0)) {
        month++;
        if (month > 600) break; // Safety break for 50 years

        let totalPaymentForMonth = extraMonthlyPayment;
        let totalInterestForMonth = 0;
        const paymentsThisMonth = new Map<number, {payment: number, interest: number}>();

        // 1. Accrue interest & sum up minimum payments
        currentDebts.forEach(debt => {
            const interest = debt.amount * (debt.apr / 100 / 12);
            debt.amount += interest;
            totalInterestForMonth += interest;
            totalInterestPaid += interest;
            totalPaymentForMonth += debt.minPayment;
            paymentsThisMonth.set(debt.id, { payment: 0, interest: interest });
        });

        let paymentPool = totalPaymentForMonth;
        
        // 2. Pay minimums first
        currentDebts.forEach(debt => {
            const payment = Math.min(debt.amount, debt.minPayment);
            debt.amount -= payment;
            paymentPool -= payment;
            paymentsThisMonth.get(debt.id)!.payment += payment;
        });
        
        // 3. Apply snowball/avalanche payment
        if (paymentPool > 0) {
            let activeDebts = currentDebts.filter(d => d.amount > 0.01);
            if (activeDebts.length > 0) {
                if (strategy === 'snowball') {
                    activeDebts.sort((a, b) => a.amount - b.amount);
                } else { // Avalanche and AI default
                    activeDebts.sort((a, b) => b.apr - a.apr);
                }

                for (const debt of activeDebts) {
                    if (paymentPool <= 0) break;
                    const payment = Math.min(debt.amount, paymentPool);
                    debt.amount -= payment;
                    paymentPool -= payment;
                    paymentsThisMonth.get(debt.id)!.payment += payment;
                }
            }
        }
        
        const focusDebtList = currentDebts.filter(d => d.amount > 0).sort((a, b) => strategy === 'snowball' ? a.amount - b.amount : b.apr - a.apr);

        const paymentDetails: DebtPaymentDetail[] = debts.map((originalDebt, index) => {
            const paymentData = paymentsThisMonth.get(index);
            const currentDebtOnLoopEnd = currentDebts.find(d => d.id === index); 

            if (paymentData) {
                const principalPaid = paymentData.payment - paymentData.interest;
                return {
                    debtName: originalDebt.name,
                    payment: paymentData.payment,
                    interestPaid: paymentData.interest,
                    principalPaid: principalPaid > 0 ? principalPaid : 0,
                    remainingBalance: currentDebtOnLoopEnd ? Math.max(0, currentDebtOnLoopEnd.amount) : 0,
                };
            } else {
                return { debtName: originalDebt.name, payment: 0, interestPaid: 0, principalPaid: 0, remainingBalance: 0 };
            }
        });

        const totalPrincipalPaidForMonth = totalPaymentForMonth - totalInterestForMonth;
        const totalRemainingBalanceAfterPayments = currentDebts.reduce((s, d) => s + d.amount, 0);

        roadmap.push({
            month: month,
            totalPayment: totalPaymentForMonth,
            totalInterestPaid: totalInterestForMonth,
            totalPrincipalPaid: totalPrincipalPaidForMonth > 0 ? totalPrincipalPaidForMonth : 0,
            totalRemainingBalance: totalRemainingBalanceAfterPayments > 0 ? totalRemainingBalanceAfterPayments : 0,
            focus: focusDebtList.length > 0 ? focusDebtList[0].name : "All Paid Off!",
            paymentDetails: paymentDetails,
        });
        
        currentDebts = currentDebts.filter(d => d.amount > 0.01);
    }

    const totalPaid = initialTotalDebt + totalInterestPaid;
    const totalMinPayments = debts.reduce((sum, d) => sum + d.minPayment, 0);
    return { 
        strategy, 
        totalMonths: month, 
        totalInterest: totalInterestPaid, 
        totalPaid, 
        monthlyPayment: totalMinPayments + extraMonthlyPayment, 
        extraMonthlyPayment, 
        debts: debts.map((d) => ({...d})), 
        roadmap 
    };
};

// --- ICONS ---
const CalendarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);
const CalculatorIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H9z" />
    </svg>
);
const SnorkelIcon: FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V6.5a3.5 3.5 0 013.5-3.5h0a3.5 3.5 0 013.5 3.5V19m-7 0a2 2 0 002 2h3a2 2 0 002-2m-7 0a2 2 0 012-2h3a2 2 0 012 2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9a3 3 0 013-3h1a3 3 0 013 3v2a3 3 0 01-3 3h-1a3 3 0 01-3-3V9z" />
    </svg>
);
const AIChoiceIcon: FC = () => (
    <div className="relative w-16 h-16">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full blur-lg opacity-70"></div>
        <div className="absolute inset-1 bg-[#10141b] rounded-full"></div>
        <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), transparent 50%)' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <AIIcon className="h-8 w-8 text-purple-300" />
        </div>
    </div>
);
const AvalancheIcon: FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
    </svg>
);

const CountUp: FC<{ end: number; duration?: number; prefix?: string; }> = ({ end, duration = 1000, prefix = "₹" }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        if (start === end) return;
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(parseFloat((progress * (end - start)).toFixed(0)));
            if (progress < 1) window.requestAnimationFrame(step); else setCount(end);
        };
        window.requestAnimationFrame(step);
    }, [end, duration]);
    return <span>{prefix}{count.toLocaleString('en-IN')}</span>;
};

const InfoTooltip: React.FC<{ text: string; }> = ({ text }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="relative flex items-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
            <InfoIcon className="h-4 w-4 text-gray-400 cursor-pointer" />
            {show && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-gray-900 text-white text-xs rounded-lg py-1 px-3 z-10 shadow-lg">
                    {text}
                </div>
            )}
        </div>
    );
};


// --- PHASE 1: NEW DEBT ENTRY FORM COMPONENTS ---
const DebtItemForm: React.FC<{ 
    debt: Omit<Debt, 'id'>;
    index: number; 
    onUpdate: (index: number, field: keyof Omit<Debt, 'id'>, value: string | number) => void; 
    onRemove: (index: number) => void;
    isRemovable: boolean;
}> = ({ debt, index, onUpdate, onRemove, isRemovable }) => {
    const [isAutoEmi, setIsAutoEmi] = useState(false);
    const [tenure, setTenure] = useState(5);
    type Frequency = 'Monthly' | 'Quarterly' | 'Half-Yearly';
    const [frequency, setFrequency] = useState<Frequency>('Monthly');

    useEffect(() => {
        if (!isAutoEmi) return;
        if (debt.amount > 0 && debt.apr > 0 && tenure > 0) {
            const periodsPerYear = { 'Monthly': 12, 'Quarterly': 4, 'Half-Yearly': 2 }[frequency];
            const ratePerPeriod = (debt.apr / 100) / periodsPerYear;
            const numberOfPeriods = tenure * periodsPerYear;

            if (ratePerPeriod > 0) {
                const emi = (debt.amount * ratePerPeriod * Math.pow(1 + ratePerPeriod, numberOfPeriods)) / (Math.pow(1 + ratePerPeriod, numberOfPeriods) - 1);
                onUpdate(index, 'minPayment', parseFloat(emi.toFixed(2)));
            }
        }
    }, [debt.amount, debt.apr, tenure, frequency, isAutoEmi, index, onUpdate]);
    
    const handleNumericChange = (field: keyof Omit<Debt, 'id'>, value: string) => {
        const num = parseFloat(value.replace(/,/g, ''));
        onUpdate(index, field, isNaN(num) ? 0 : num);
    };

    return (
        <GlassmorphicPanel className="!p-6 !rounded-3xl space-y-4 relative animate-slide-up-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            {isRemovable && (
                <button onClick={() => onRemove(index)} className="absolute -top-3 -right-3 bg-red-800/80 rounded-full p-1.5 text-white z-10 hover:bg-red-700 transition-colors shadow-lg">
                    <XIcon className="w-4 h-4" />
                </button>
            )}
            <div className="relative group">
                <label className="text-sm font-medium text-gray-400">Debt Name</label>
                <input type="text" value={debt.name} onChange={e => onUpdate(index, 'name', e.target.value)} placeholder="e.g., Car Loan" className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 mt-1 text-base font-semibold text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition placeholder:text-gray-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div className="relative group">
                    <label className="text-sm font-medium text-gray-400">Total Amount (₹)</label>
                    <input type="text" value={debt.amount > 0 ? debt.amount.toLocaleString('en-IN') : ''} onChange={e => handleNumericChange('amount', e.target.value)} placeholder="2,50,000" className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 mt-1 text-base font-semibold text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition placeholder:text-gray-500" />
                </div>
                 <div className="relative group">
                    <label className="text-sm font-medium text-gray-400">APR (%)</label>
                    <input type="text" value={debt.apr > 0 ? debt.apr : ''} onChange={e => handleNumericChange('apr', e.target.value)} placeholder="7.5" className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 mt-1 text-base font-semibold text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition placeholder:text-gray-500" />
                </div>
            </div>

            <div>
                 <div className={`transition-all duration-500 ease-in-out grid ${isAutoEmi ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}`}>
                    <div className="overflow-hidden">
                        <div className="relative group">
                            <label className="text-sm font-medium text-gray-400">EMI (₹)</label>
                            <input type="text" value={debt.minPayment > 0 ? debt.minPayment.toLocaleString('en-IN') : ''} onChange={e => handleNumericChange('minPayment', e.target.value)} placeholder="15,000" className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 mt-1 text-base font-semibold text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition placeholder:text-gray-500" />
                        </div>
                    </div>
                </div>

                <div className={`transition-all duration-500 ease-in-out grid ${isAutoEmi ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                        <div className="bg-black/30 p-4 rounded-xl space-y-3 mt-2">
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-400">Tenure (Years)</label>
                                    <select value={tenure} onChange={e => setTenure(Number(e.target.value))} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 mt-1 text-base font-semibold text-gray-100">{[...Array(30).keys()].map(i => <option key={i+1} value={i+1}>{i+1} Year(s)</option>)}</select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-400">Frequency</label>
                                    <select value={frequency} onChange={e => setFrequency(e.target.value as Frequency)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 mt-1 text-base font-semibold text-gray-100"><option>Monthly</option><option>Quarterly</option><option>Half-Yearly</option></select>
                                </div>
                            </div>
                            <div className="text-center bg-black/40 p-3 rounded-lg">
                                <p className="text-sm text-gray-400">Calculated EMI</p>
                                <p className="text-2xl font-bold text-sky-300"><CountUp end={debt.minPayment} /></p>
                            </div>
                        </div>
                    </div>
                </div>

                <button onClick={() => setIsAutoEmi(!isAutoEmi)} className="text-xs text-sky-400 hover:text-sky-300 font-semibold mt-3 flex items-center space-x-1">
                    <CalculatorIcon className="w-4 h-4" />
                    <span>{isAutoEmi ? 'Enter EMI Manually' : 'I don’t know EMI → Calculate automatically'}</span>
                </button>
            </div>

            <div className="relative group">
                <label className="text-sm font-medium text-gray-400">Payment Date (Day of Month)</label>
                <select value={debt.paymentDate} onChange={e => onUpdate(index, 'paymentDate', Number(e.target.value))} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 mt-1 text-base font-semibold text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition">
                    {[...Array(31).keys()].map(i => <option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
            </div>
        </GlassmorphicPanel>
    );
};

const DebtEntryForm: React.FC<{ debts: Omit<Debt, 'id'>[]; setDebts: React.Dispatch<React.SetStateAction<Omit<Debt, 'id'>[]>>; }> = ({ debts, setDebts }) => {
    
    const handleUpdate = (index: number, field: keyof Omit<Debt, 'id'>, value: string | number) => {
        const newDebts = [...debts];
        // @ts-ignore
        newDebts[index][field] = value;
        setDebts(newDebts);
    };

    const addDebt = () => {
        setDebts([...debts, { name: '', amount: 0, apr: 0, minPayment: 0, paymentDate: 1 }]);
    };

    const removeDebt = (index: number) => {
        setDebts(debts.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            {debts.map((debt, index) => (
                <DebtItemForm 
                    key={index} 
                    debt={debt} 
                    index={index} 
                    onUpdate={handleUpdate}
                    onRemove={removeDebt}
                    isRemovable={debts.length > 1}
                />
            ))}
            <button onClick={addDebt} className="w-full py-4 border-2 border-dashed border-gray-700 text-gray-300 font-semibold rounded-2xl hover:bg-white/5 hover:border-sky-500/50 transition-colors flex items-center justify-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                <span>Add Another Debt</span>
            </button>
        </div>
    );
};


const AIRecommendationModal: React.FC<{ onClose: () => void; onSelectStrategy: (strategy: Strategy) => void; }> = ({ onClose, onSelectStrategy }) => {
    const handleSelect = () => {
        onSelectStrategy('avalanche');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50" onClick={onClose}>
            <div
                className="w-full bg-[#1e1e1e] border-t-2 border-purple-500/50 rounded-t-3xl p-6 space-y-4 animate-slide-up shadow-[0_-10px_40px_rgba(168,85,247,0.2)]"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-center mb-2">
                    <div className="w-16 h-1.5 bg-gray-700 rounded-full"></div>
                </div>

                <div className="text-center space-y-2">
                    <div className="inline-block p-3 bg-gray-900/50 rounded-2xl border border-gray-700">
                        <AIIcon className="h-8 w-8 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-100">AI Recommendation</h2>
                </div>

                <GlassmorphicPanel className="!p-4 text-center">
                    <p className="text-sm text-gray-400">The optimal strategy for you is:</p>
                    <p className="text-3xl font-bold text-purple-400 mt-1">The Avalanche Method</p>
                </GlassmorphicPanel>
                
                <div className="pt-2">
                    <h3 className="font-semibold text-gray-200 mb-2">Why this is best for you:</h3>
                    <p className="text-sm text-gray-400 bg-gray-900/50 p-3 rounded-xl border border-gray-700">
                        By focusing on your highest-interest debt first, the <span className="font-semibold text-gray-200">Avalanche</span> method will significantly reduce the total amount of interest you pay over time, saving you the most money and helping you become debt-free faster.
                    </p>
                </div>
                
                <div className="pt-4">
                    <button
                        onClick={handleSelect}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/10 hover:scale-[1.02] active:scale-100 transition-transform transform text-lg"
                    >
                        Select Avalanche & Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

const StrategySelection: React.FC<{ onSelect: (strategy: Strategy) => void; onOpenAiModal: () => void; }> = ({ onSelect, onOpenAiModal }) => {
    
    const StrategyCard: React.FC<{ title: string; desc: string; icon: React.ReactNode; onClick: () => void; isRecommended?: boolean; glowClass: string; className?: string; }> = ({ title, desc, icon, onClick, isRecommended, glowClass, className = '' }) => (
        <div
            onClick={onClick}
            className={`
                group premium-glass !p-6 !rounded-3xl cursor-pointer 
                flex flex-col items-start space-y-3 relative overflow-hidden
                border-2 border-transparent transition-all duration-300 
                hover:border-sky-400/50 hover:scale-[1.02] hover:shadow-2xl
                transform hover:-translate-y-2
                ${isRecommended ? 'border-purple-500/50' : ''}
                ${className}
            `}
            style={{ transform: 'perspective(1200px) rotateY(-3deg)' }}
        >
            <div className="absolute inset-0 animate-light-sweep opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            {isRecommended && <div className="absolute top-4 right-4 bg-purple-900/70 text-purple-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"><AIIcon className="w-4 h-4" /> AI Pick</div>}
            
            <div className={`p-4 rounded-2xl bg-black/30 ${glowClass}`}>{icon}</div>

            <div>
                <h3 className="text-2xl font-bold text-gray-100">{title}</h3>
                <p className="text-gray-400 mt-1">{desc}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 p-2">
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-bold cinematic-title">Select Your Debt Freedom Strategy</h2>
                <p className="text-gray-400">Choose the path that aligns with your financial style.</p>
            </div>
            <div className="space-y-6">
                <StrategyCard 
                    title="Avalanche" 
                    desc="Focus on highest-interest debt first. Saves the most money over time."
                    onClick={() => onSelect('avalanche')} 
                    isRecommended 
                    icon={<AvalancheIcon />}
                    glowClass="shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                />
                <StrategyCard 
                    title="Snowball" 
                    desc="Focus on smallest debts first to build momentum with quick wins."
                    onClick={() => onSelect('snowball')} 
                    icon={<SnorkelIcon />}
                    glowClass="shadow-[0_0_20px_rgba(251,146,60,0.3)]"
                    className="animate-light-sweep"
                />
            </div>
            <div
                onClick={onOpenAiModal}
                className="
                    group premium-glass !p-6 !rounded-3xl cursor-pointer 
                    flex items-center justify-between relative overflow-hidden
                    border-2 border-purple-500/50
                    transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
                    transform hover:-translate-y-2
                "
                style={{ transform: 'perspective(1200px) rotateY(-3deg)' }}
            >
                <div>
                     <h3 className="text-2xl font-bold text-gray-100">Let AI Choose</h3>
                     <p className="text-gray-400 mt-1">Get the optimal strategy based on your unique debt profile.</p>
                </div>
                 <div className="w-20 h-20 flex items-center justify-center">
                    <div className="relative w-16 h-16" style={{ animation: 'orb-pulse 4s infinite ease-in-out' }}>
                        <AIChoiceIcon />
                    </div>
                </div>
            </div>
        </div>
    );
};

const CinematicCalculatingAnimation: React.FC<{ debts: Omit<Debt, 'id'>[] }> = ({ debts }) => {
    const stages = useMemo(() => [
        "Analyzing Debt Structure...",
        "Simulating Payment Flows...",
        "Calculating Interest Scenarios...",
        "Optimizing Your Roadmap with AI...",
        "Building Your Debt-Free Plan!"
    ], []);

    const [currentStage, setCurrentStage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStage(prev => (prev >= stages.length - 1 ? prev : prev + 1));
        }, 1200);
        return () => clearInterval(interval);
    }, [stages.length]);
    
    const displayedStage = stages[currentStage];
    const numDebts = debts.length;
    const radius = 100;

    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-200 space-y-8 overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-[#0D1117] to-[#0D1117]">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%231E293B%22%20fill-opacity%3D%220.4%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M0%2040L40%200H20L0%2020zM40%2040V20L20%2040z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20 animate-grid-pan"></div>

            <div className="relative w-80 h-80 flex items-center justify-center" style={{ perspective: '1000px' }}>
                
                {/* Data stream particles */}
                {Array.from({length: numDebts * 3}).map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute w-1 h-1 bg-sky-400 rounded-full animate-data-stream" 
                        style={{
                            transformOrigin: '0 0',
                            transform: `rotate(${(i / (numDebts*3)) * 360}deg)`,
                            animationDelay: `${(i / (numDebts*3)) * 2}s`
                        }}
                    ></div>
                ))}
                
                {/* Central Orb */}
                <div className="absolute w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full animate-orb-pulse shadow-[0_0_50px_rgba(168,85,247,0.6)] flex items-center justify-center">
                    <AIIcon className="h-12 w-12 text-purple-200" />
                </div>

                {/* Debt Blocks */}
                {debts.map((debt, index) => (
                    <div
                        key={index}
                        className="absolute w-24 h-24 top-1/2 left-1/2 -mt-12 -ml-12 premium-glass !rounded-2xl !p-2 flex flex-col justify-center items-center text-center animate-fly-in-from-back"
                        style={{
                            transform: `rotateY(${-(index / numDebts) * 360}deg) translateZ(${radius + 60}px)`,
                            animationDelay: `${index * 100}ms`
                        }}
                    >
                        <p className="text-xs font-bold text-white truncate">{debt.name}</p>
                        <p className="text-[10px] text-gray-400">₹{debt.amount.toLocaleString()}</p>
                    </div>
                ))}
                
                {/* Connecting Path */}
                <svg className="absolute w-[320px] h-[320px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" viewBox="-160 -160 320 320">
                    <path
                        d={debts.map((_, i) => {
                            const angle = (i / numDebts) * 2 * Math.PI - (Math.PI / 2);
                            const x = (radius + 60) * Math.cos(angle);
                            const y = (radius + 60) * Math.sin(angle);
                            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ') + ' Z'}
                        fill="none"
                        stroke="url(#glowPath)"
                        strokeWidth="2"
                        className="animate-draw-path-glow"
                    />
                     <defs><linearGradient id="glowPath"><stop stopColor="var(--glow-blue)" /></linearGradient></defs>
                </svg>
            </div>

            <div className="relative h-8 w-full text-center">
                <p className="absolute inset-0 font-semibold text-xl text-gray-300 animate-fade-in">
                    {displayedStage}
                </p>
            </div>
        </div>
    );
};


// --- PHASE 3: DASHBOARD & SUB-COMPONENTS ---

const MOTIVATIONAL_PHRASES = ["Stay Consistent", "Freedom Awaits", "You’re Closer Than You Think", "One Step at a Time", "Every Payment Counts"];

const RotatingLinesBackground: FC = () => {
    const lines = useMemo(() => Array.from({ length: 15 }).map((_, i) => {
        const angle = (360 / 15) * i;
        const radius = 100 + Math.random() * 50;
        const length = 50 + Math.random() * 50;
        const speed = 20 + Math.random() * 20;
        const opacity = 0.2 + Math.random() * 0.3;
        return {
            style: { '--radius': `${radius}px`, transform: `rotate(${angle}deg)`, animation: `rotate-line ${speed}s linear infinite`, animationDelay: `-${(i / 15) * speed}s` },
            lineStyle: { width: `${length}px`, opacity: opacity }
        };
    }), []);
    const [phraseIndex, setPhraseIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPhraseIndex(prev => (prev + 1) % MOTIVATIONAL_PHRASES.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]">
            <div className="absolute inset-0 bg-gradient-to-b from-sky-900/30 via-indigo-900/30 to-transparent"></div>
            <div className="relative">
                {lines.map((line, i) => (
                    <div key={i} style={line.style} className="absolute top-0 left-0">
                        <div style={line.lineStyle} className="h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent"></div>
                    </div>
                ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                {MOTIVATIONAL_PHRASES.map((phrase, index) => (
                    <p key={index} className={`font-semibold text-lg text-sky-200/80 transition-all duration-1000 absolute ${phraseIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                        {phrase}
                    </p>
                ))}
            </div>
        </div>
    );
};

const HeroSection: FC<{ plan: DebtPlan | null }> = ({ plan }) => (
    <div className="flex flex-col items-center text-center mb-6 animate-slide-in-bottom">
       <div className="relative z-10 pt-12 pb-4">
            <h1 className="text-3xl font-normal text-gray-300 tracking-wider cinematic-title">Manage your Debt</h1>
       </div>
       <div className="relative w-full h-40 -mt-6">
           <RotatingLinesBackground />
       </div>
    </div>
);

const ConfettiExplosion: React.FC = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
        {Array.from({ length: 30 }).map((_, i) => (
            <div
                key={i}
                className="absolute bg-yellow-400 rounded-full animate-confetti-burst"
                style={{
                    left: '50%',
                    top: '50%',
                    width: `${Math.random() * 8 + 4}px`,
                    height: `${Math.random() * 8 + 4}px`,
                    opacity: 0,
                    '--tx': `${(Math.random() - 0.5) * 200}px`,
                    '--ty': `${(Math.random() - 0.5) * 200}px`,
                    '--s': `${Math.random() * 0.5 + 0.5}`,
                    animationDelay: `${Math.random() * 0.2}s`,
                    backgroundColor: ['#38bdf8', '#34d399', '#fde047', '#f472b6'][i % 4],
                }}
            />
        ))}
    </div>
);


const DebtOverviewPanel: React.FC<{ remainingDebt: number; timeToFreedom: number; paidPercentage: number; principalPaid: number; interestPaid: number; dtiRatio: number; debtLevel: 'Low' | 'Medium' | 'High'; }> = ({ remainingDebt, timeToFreedom, paidPercentage, principalPaid, interestPaid, dtiRatio, debtLevel }) => {

    const debtLevelStyles = {
        Low: { text: 'text-green-300', bg: 'bg-green-900/50' },
        Medium: { text: 'text-yellow-300', bg: 'bg-yellow-900/50' },
        High: { text: 'text-red-300', bg: 'bg-red-900/50' },
    };

    const StatCard: FC<{label: string; value: React.ReactNode; icon: React.ReactNode; tooltip: string;}> = ({label, value, icon, tooltip}) => (
        <div className="bg-black/20 p-3 rounded-2xl flex flex-col justify-center text-center">
            <div className="flex items-center justify-center gap-1.5">
                <p className="text-xs font-medium text-gray-400">{label}</p>
                <InfoTooltip text={tooltip} />
            </div>
            <div className="flex items-center justify-center gap-2 mt-1">
                {icon}
                <p className="text-lg font-bold text-gray-200">{value}</p>
            </div>
        </div>
    )

    return (
        <GlassmorphicPanel className="space-y-5 border-2 border-sky-500/20 shadow-[0_0_25px_rgba(56,189,248,0.1)]">
            <div className="text-center">
                <p className="text-sm font-medium text-gray-400">Total Debt Remaining</p>
                <p className="text-5xl font-bold text-gray-100 tracking-tight my-1">
                    <CountUp end={remainingDebt} />
                </p>
                <div className="inline-flex items-center space-x-2 mt-1 text-gray-300 bg-black/20 px-3 py-1 rounded-full">
                    <CalendarIcon />
                    <span className="text-sm font-semibold">{timeToFreedom} months to freedom</span>
                </div>
            </div>
            <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-400">Paid Off</span>
                    <span className="text-sky-300">{paidPercentage.toFixed(1)}%</span>
                </div>
                <ProgressBar progress={paidPercentage} color="from-sky-400 to-emerald-400" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
                 <StatCard 
                    label="Principal Paid"
                    value={<CountUp end={principalPaid} />}
                    icon={<FileTextIcon className="w-5 h-5 text-green-400" />}
                    tooltip="The amount of your payments that has gone towards reducing the actual loan balance."
                 />
                 <StatCard 
                    label="Interest Paid"
                    value={<CountUp end={interestPaid} />}
                    icon={<SigmaIcon />}
                    tooltip="The total cost of borrowing you have paid so far."
                 />
                  <StatCard 
                    label="DTI Ratio"
                    value={`${dtiRatio}%`}
                    icon={<TrendingUpIcon />}
                    tooltip="Your Debt-to-Income ratio. A lower DTI is generally better."
                 />
                 <StatCard 
                    label="Debt Level"
                    value={<span className={`inline-flex items-center justify-center font-semibold px-2 py-0.5 rounded-full text-sm ${debtLevelStyles[debtLevel].bg} ${debtLevelStyles[debtLevel].text}`}>{debtLevel}</span>}
                    icon={<FlashIcon />}
                    tooltip="An assessment of your overall debt burden relative to your income."
                 />
            </div>
        </GlassmorphicPanel>
    );
};

const MonthlyRoadmapPanel: React.FC<{ plan: DebtPlan; onViewAll: () => void; onStartPlan: () => void; onCancelPlan: () => void; onCheckIn: (month: number) => void; }> = ({ plan, onViewAll, onStartPlan, onCancelPlan, onCheckIn }) => {
    const [showConfetti, setShowConfetti] = useState(false);
    
    const checkedInMonths = new Set(plan.checkedInMonths || []);
    const nextMonthIndex = checkedInMonths.size;
    const nextMonthData = plan.roadmap[nextMonthIndex];

    if (!nextMonthData) {
        return (
            <GlassmorphicPanel className="text-center">
                 <h3 className="text-lg font-bold text-gray-200">Congratulations!</h3>
                 <p className="text-gray-400">You are on your way to being debt-free.</p>
            </GlassmorphicPanel>
        )
    }

    const focusDebt = plan.debts.find(d => d.name === nextMonthData.focus);
    const paymentDate = focusDebt ? focusDebt.paymentDate : 1;
    const isCheckInEnabled = new Date().getDate() >= paymentDate;

    const handleCheckIn = () => {
        onCheckIn(nextMonthData.month);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1200);
    };

    return (
        <GlassmorphicPanel className="!p-5 !rounded-3xl animate-active-glow-blue">
            <h3 className="text-xl font-bold font-montserrat text-gray-100">Debt Free Roadmap</h3>
            <div className="mt-4 bg-black/20 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <p className="font-bold text-lg text-gray-200">{new Date(new Date().setMonth(new Date().getMonth() + nextMonthData.month - 1)).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                    <p className="text-xs font-semibold bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full">Month {nextMonthData.month}</p>
                </div>
                <div className="mt-4 border-t border-white/10 pt-4 flex justify-between items-end">
                    <div>
                        <p className="text-sm text-gray-400">Payment Amount</p>
                        <p className="text-3xl font-bold text-sky-300">₹{nextMonthData.totalPayment.toLocaleString('en-IN')}</p>
                    </div>
                     <div className="text-right">
                        <p className="text-sm text-gray-400">Remaining Debt</p>
                        <p className="text-lg font-semibold text-gray-300">₹{nextMonthData.totalRemainingBalance.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                <div className="mt-4 text-center text-sm bg-black/30 p-2 rounded-lg text-gray-300">
                    Focus on: <span className="font-bold text-amber-300">{nextMonthData.focus}</span>
                </div>
            </div>

            <div className="mt-4">
                <button onClick={handleCheckIn} disabled={!isCheckInEnabled} className="relative w-full py-3 text-center text-md font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-500 transition-colors disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed overflow-hidden">
                    {isCheckInEnabled ? 'Mark as Paid' : `Upcoming (on ${paymentDate}th)`}
                    {showConfetti && <ConfettiExplosion />}
                </button>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-white/10 mt-4">
                <button onClick={onViewAll} className="w-full py-3 bg-gray-800/50 text-gray-300 font-semibold rounded-2xl hover:bg-gray-700/50 transition">
                    View Full Roadmap
                </button>
                 {!plan.automatedPlanTransactionId ? (
                    <button onClick={onStartPlan} className="w-full py-3 bg-sky-900/50 text-sky-300 font-semibold rounded-2xl hover:bg-sky-800/50 transition">
                        Start Plan
                    </button>
                 ) : (
                    <button onClick={onCancelPlan} className="w-full py-3 bg-red-900/30 text-red-300 font-semibold rounded-2xl hover:bg-red-900/50 transition">
                        Cancel Plan
                    </button>
                 )}
            </div>
            {plan.automatedPlanTransactionId && (
                <div className="text-center text-xs text-green-300 mt-2 bg-green-900/30 p-2 rounded-lg flex items-center justify-center space-x-2 border border-green-500/30">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Plan automated! ₹{plan.monthlyPayment.toLocaleString('en-IN')} will be deducted monthly.</span>
                </div>
            )}
        </GlassmorphicPanel>
    );
};

const TotalPayoffBreakdownPanel: FC<{ plan: DebtPlan }> = ({ plan }) => {
    const totalPrincipal = plan.debts.reduce((sum, d) => sum + d.amount, 0);
    const totalInterest = plan.totalInterest;
    
    const data = [
        { name: 'Principal', value: totalPrincipal },
        { name: 'Interest', value: totalInterest }
    ];
    const COLORS = ['#38bdf8', '#a855f7'];

    return (
        <GlassmorphicPanel className="!p-5 space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-gray-100">Total Payoff Breakdown</h3>
            <div className="flex items-center gap-4">
                <div className="w-1/2 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" paddingAngle={5}>
                                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-3 text-sm">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-sky-500"></div><div><p className="text-gray-400">Principal</p><p className="font-bold text-sky-300">₹{totalPrincipal.toLocaleString('en-IN')}</p></div></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div><div><p className="text-gray-400">Total Interest</p><p className="font-bold text-purple-300">₹{totalInterest.toLocaleString('en-IN')}</p></div></div>
                </div>
            </div>
            <div className="text-center bg-black/20 p-3 rounded-xl">
                <p className="text-xs text-gray-400">Projected Payoff Timeline</p>
                <p className="text-lg font-bold text-white">{plan.totalMonths} months</p>
            </div>
        </GlassmorphicPanel>
    );
};

const DebtAcceleratorPanel: React.FC<{ plan: DebtPlan; onImplement: (newExtraPayment: number) => void; }> = ({ plan, onImplement }) => {
    const [extraPayment, setExtraPayment] = useState(plan.extraMonthlyPayment);

    const simulatedPlan = useMemo(() => {
        return calculatePlan(plan.debts, plan.strategy, extraPayment);
    }, [extraPayment, plan.debts, plan.strategy]);

    const monthsSaved = plan.totalMonths - simulatedPlan.totalMonths;
    const interestSaved = plan.totalInterest - simulatedPlan.totalInterest;
    
    const handleImplement = () => {
        onImplement(extraPayment);
    };

    return (
        <GlassmorphicPanel className="!p-5 space-y-4">
             <h3 className="text-xl font-bold font-montserrat text-gray-100 px-1 flex items-center space-x-3">
                <TrophyIcon />
                <span>Debt Accelerator</span>
            </h3>
            <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="px-1 pt-2">
                    <div className="flex justify-between items-baseline mb-2">
                        <label className="text-sm font-medium text-gray-400">Extra Monthly Payment</label>
                        <span className="font-bold text-sky-300">₹{extraPayment.toLocaleString('en-IN')}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max={plan.monthlyPayment}
                        step="500"
                        value={extraPayment}
                        onChange={e => setExtraPayment(parseInt(e.target.value))}
                        className="w-full range-sky"
                        aria-label="Extra monthly payment slider"
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-black/30 p-3 rounded-xl">
                        <p className="text-xs text-gray-400">Time Saved</p>
                        <p className="text-2xl font-bold text-green-400">{monthsSaved > 0 ? monthsSaved : 0} months</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-xl">
                        <p className="text-xs text-gray-400">Interest Saved</p>
                        <p className="text-2xl font-bold text-green-400">
                            <CountUp end={interestSaved > 0 ? interestSaved : 0} />
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleImplement}
                    className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20"
                >
                    Implement This Scenario
                </button>
            </div>
        </GlassmorphicPanel>
    );
};

const ActionSwiperPanel: FC<{ children: React.ReactNode[] }> = ({ children }) => {
    const [slide, setSlide] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const newIndex = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
            if (newIndex !== slide) setSlide(newIndex);
        }
    };
    
    return (
        <div>
            <div ref={scrollRef} onScroll={handleScroll} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar -mx-6 px-4">
                {children.map((child, index) => (
                    <div key={index} className="w-full flex-shrink-0 snap-center px-2">
                        {child}
                    </div>
                ))}
            </div>
             <div className="flex justify-center items-center space-x-2 mt-4">
                {children.map((_, index) => (
                    <div key={index} className={`h-2 rounded-full transition-all duration-300 ${slide === index ? 'w-5 bg-white' : 'w-2 bg-gray-600'}`}></div>
                ))}
            </div>
        </div>
    );
}

const DebtInsightsPanel: React.FC<{
    plan: DebtPlan;
}> = ({ plan }) => {
    const {
        debtFreedomProgress,
        insights,
        mentorTip,
    } = useMemo(() => {
        const checkedInCount = plan.checkedInMonths?.length ?? 0;
        const totalInitialDebt = plan.debts.reduce((s, d) => s + d.amount, 0);
        const remainingBalance = plan.roadmap[checkedInCount - 1]?.totalRemainingBalance ?? totalInitialDebt;
        
        const paidAmount = totalInitialDebt - remainingBalance;
        const progress = totalInitialDebt > 0 ? (paidAmount / totalInitialDebt) * 100 : 0;

        const genInsights: { icon: React.ReactNode; text: string; }[] = [];
        
        const sortedByApr = [...plan.debts].sort((a, b) => b.apr - a.apr);
        const highestAprDebt = sortedByApr[0];
        if (highestAprDebt && highestAprDebt.apr > 15) {
            genInsights.push({
                icon: <FlashIcon />,
                text: `Your '${highestAprDebt.name}' at ${highestAprDebt.apr}% APR is costing you the most. Your current plan correctly prioritizes this.`,
            });
        }
        
        if (plan.extraMonthlyPayment === 0) {
             const { totalMonths } = calculatePlan(plan.debts, plan.strategy, 1000);
             const monthsSaved = plan.totalMonths - totalMonths;
             if (monthsSaved > 0) {
                 genInsights.push({
                    icon: <TrendingUpIcon />,
                    text: `Adding just ₹1,000/month could get you debt-free ${monthsSaved} months sooner. Every extra rupee helps!`,
                });
             }
        } else {
            const { totalInterest } = calculatePlan(plan.debts, plan.strategy, 0);
            const interestSaved = totalInterest - plan.totalInterest;
            genInsights.push({
                icon: <CheckCircleIcon />,
                text: `Your extra ₹${plan.extraMonthlyPayment.toLocaleString('en-IN')}/month is set to save you ~₹${Math.round(interestSaved).toLocaleString('en-IN')} in interest.`,
            });
        }

        if (!plan.automatedPlanTransactionId) {
            genInsights.push({
                icon: <ShieldCheckIcon />,
                text: `Consistency is crucial. Set up your recurring payment of ₹${plan.monthlyPayment.toLocaleString('en-IN')} to stay on track.`,
            });
        }

        let tip = "You're in the 'Recovery' phase. Focus on consistency, not speed.";
        if (progress >= 25 && progress < 75) {
            tip = "You're in the 'Acceleration' phase. Consider small extra payments to speed up.";
        } else if (progress >= 75) {
            tip = "You're in the 'Final Stretch'. Stay focused, freedom is near!";
        }

        return {
            debtFreedomProgress: progress,
            insights: genInsights.slice(0, 3),
            mentorTip: tip,
        };
    }, [plan]);

    const Tip: React.FC<{ icon: React.ReactNode, text: string }> = ({ icon, text }) => (
        <div className="flex items-start space-x-3 text-sm">
           <span className="text-sky-400 mt-1">{icon}</span>
           <p className="text-gray-300">{text}</p>
       </div>
   );

    return (
        <GlassmorphicPanel className="!p-6 border-sky-500/30 hover:-translate-y-0 animate-slide-up-fade-in">
             <div className="flex items-center space-x-3 mb-4">
                <LightBulbIcon />
                <h2 className="text-xl font-bold text-gray-100">Debt Insights & Tips</h2>
             </div>
             
             <p className="text-gray-300 mb-4 text-sm italic">"{mentorTip}"</p>

             <div className="mb-5">
                <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-semibold text-gray-400">Debt Freedom Progress</span>
                    <span className="text-sm font-bold text-sky-300">{debtFreedomProgress.toFixed(0)}%</span>
                </div>
                <ProgressBar progress={debtFreedomProgress} color="from-sky-400 to-emerald-400" />
             </div>

             <div className="bg-black/20 p-4 rounded-2xl border border-white/10">
                <h3 className="font-bold text-sky-300 mb-3">Pro Tips to Accelerate Payoff</h3>
                <div className="space-y-3">
                    {insights.map((insight, index) => (
                        <Tip key={index} icon={insight.icon} text={insight.text} />
                    ))}
                </div>
             </div>
        </GlassmorphicPanel>
    );
};


const ActionHubPanels: React.FC<{ onViewTools: () => void; onViewLearning: () => void; }> = ({ onViewTools, onViewLearning }) => {
    
    const HubCard: React.FC<{ icon: React.ReactNode; title: string; description: React.ReactNode; onClick: () => void; glowClass: string; delay: number; }> = ({ icon, title, description, onClick, glowClass, delay }) => (
        <GlassmorphicPanel 
            onClick={onClick} 
            className={`
                group aspect-square !rounded-3xl !p-4
                flex flex-col items-center justify-center text-center 
                transition-all duration-300 animate-float
                animate-slide-up-fade-in
                !border-white/10 relative overflow-hidden
            `}
            style={{ animationDelay: `${delay}ms`, animationDuration: `${8 + Math.random() * 4}s` }}
        >
            <div className={`absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${glowClass.replace('animate-active-glow', 'animate-pulse-glow')}`} />
             <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{background: 'radial-gradient(circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(255, 255, 255, 0.1) 0%, transparent 50%)'}}></div>
            <div className="relative mb-2 transition-transform duration-300 group-hover:scale-110">
                <div className="p-4 bg-black/40 rounded-full border border-white/10 shadow-lg">
                    {icon}
                </div>
            </div>
            <h3 className="text-lg font-bold font-montserrat text-gray-100 transition-colors group-hover:text-white">{title}</h3>
            <div className="text-xs text-gray-400 mt-2 h-12">{description}</div>
        </GlassmorphicPanel>
    );
    
    return (
        <div className="grid grid-cols-2 gap-4">
            <HubCard 
                icon={<ToolsIcon className="h-8 w-8 text-sky-300" />}
                title="Debt Tools" 
                description="EMI Calculators, Prepayment Simulators, and more."
                onClick={onViewTools}
                glowClass="animate-active-glow-blue"
                delay={0}
            />
            <HubCard 
                icon={<BookOpenIcon className="h-8 w-8 text-amber-300" />} 
                title="Learning Hub" 
                description={<ul className="text-left list-disc list-inside text-xs"><li>Debt Psychology</li><li>Repayment Strategies</li><li>Credit Score Mastery</li></ul>}
                onClick={onViewLearning}
                glowClass="animate-active-glow-gold"
                delay={100}
            />
        </div>
    );
};

const FAQSection: React.FC<{ onViewAll: () => void }> = ({ onViewAll }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const faqs = [
        { q: "What's the difference between Avalanche and Snowball?", a: "Avalanche focuses on paying off the highest interest debt first, saving you the most money. Snowball focuses on the smallest debt first, which can provide psychological motivation." },
        { q: "How is my 'Time to Freedom' calculated?", a: "It's an estimate based on your total debt, interest rates, and your planned monthly payment, including any extra amounts you've committed to." },
    ];
    return (
        <GlassmorphicPanel className="!p-4 space-y-2">
            <h3 className="text-lg font-bold text-gray-200 px-2 mb-2">Have Questions?</h3>
            {faqs.map((faq, index) => (
                <div key={index} className="bg-black/20 rounded-xl px-4">
                    <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex justify-between items-center text-left py-3">
                        <span className="font-semibold text-gray-300">{faq.q}</span>
                        <ChevronDownIcon className={`text-gray-400 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
                    </button>
                    {openIndex === index && (
                        <div className="pb-4 text-gray-400 text-sm animate-fade-in">
                           {faq.a}
                        </div>
                    )}
                </div>
            ))}
             <button onClick={() => {}} className="w-full text-center text-sm font-semibold text-sky-400 pt-2 hover:text-sky-300">View All FAQs</button>
        </GlassmorphicPanel>
    );
};

const StartPlanModal: React.FC<{
    plan: DebtPlan;
    onClose: () => void;
    onSave: (date: string) => void;
}> = ({ plan, onClose, onSave }) => {
    const [startDate, setStartDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    });

    const handleSave = () => {
        onSave(startDate);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50" onClick={onClose}>
            <div className="w-full bg-gradient-to-t from-[#10141b] to-[#1F242E] border-t-2 border-sky-500/50 rounded-t-[28px] p-6 space-y-6 animate-slide-up pb-28" onClick={e => e.stopPropagation()}>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gray-700 rounded-full"></div>
                <div className="text-center pt-4">
                    <h2 className="text-2xl font-bold text-gray-100">Automate Your Plan</h2>
                    <p className="text-gray-400">Set up a recurring payment to stay on track.</p>
                </div>
                
                <GlassmorphicPanel className="!p-4">
                    <label className="text-sm font-medium text-gray-400">You are automating a monthly payment of:</label>
                    <p className="text-3xl font-bold text-sky-400 mt-1">₹{plan.monthlyPayment.toLocaleString('en-IN')}</p>
                </GlassmorphicPanel>

                <GlassmorphicPanel className="!p-4">
                    <label className="text-sm font-medium text-gray-400">First Payment Date</label>
                    <input 
                        type="date" 
                        value={startDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 mt-1 text-gray-200 focus:ring-2 focus:ring-sky-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">This payment will recur monthly on the same day.</p>
                </GlassmorphicPanel>

                <button
                    onClick={handleSave}
                    className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/20 transform hover:scale-[1.02] active:scale-95 transition-transform"
                >
                    Save & Automate
                </button>
            </div>
        </div>
    );
};

// --- NEW FULL ROADMAP PAGE COMPONENTS ---

const TimelineNode: React.FC<{ monthName: string; isCheckedIn: boolean; isFinal: boolean }> = ({ monthName, isCheckedIn, isFinal }) => (
    <div className="absolute top-1/2 -translate-y-1/2 -left-[56px] flex items-center justify-end w-[44px]">
        <p className={`font-bold text-sm text-right pr-3 transition-colors ${isCheckedIn ? 'text-green-300' : isFinal ? 'text-amber-300' : 'text-gray-400'}`}>{monthName}</p>
        <div className={`transition-all duration-500 w-5 h-5 rounded-full border-2 flex items-center justify-center
            ${isFinal ? 'bg-amber-900 border-amber-400' : isCheckedIn ? 'bg-green-900 border-green-400' : 'bg-[#10141b] border-gray-600'}`
        }>
            {isFinal ? <TrophyIcon /> : isCheckedIn ? <CheckIcon className="w-2.5 h-2.5 text-green-300" /> : <div className="w-1 h-1 bg-gray-500 rounded-full"></div>}
        </div>
    </div>
);

const TimelineCard: React.FC<{ 
    monthData: RoadmapItem; 
    isCheckedIn: boolean; 
    onCheckIn: () => void; 
    isCheckInEnabled: boolean; 
    showConfetti: boolean;
    isFinal: boolean;
}> = ({ monthData, isCheckedIn, onCheckIn, isCheckInEnabled, showConfetti, isFinal }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const monthDate = new Date();
    monthDate.setMonth(new Date().getMonth() + monthData.month - 1);
    const monthName = monthDate.toLocaleString('default', { month: 'short' });
    
    return (
        <div className="relative border-b border-gray-800 pb-4">
            <TimelineNode monthName={monthName} isCheckedIn={isCheckedIn} isFinal={isFinal} />
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-400">Total Paid</p>
                    <p className="text-2xl font-bold text-gray-100">₹{monthData.totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Remaining Loan</p>
                    <p className="text-xl font-semibold text-gray-300">₹{monthData.totalRemainingBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                </div>
            </div>

            <button onClick={() => setIsExpanded(!isExpanded)} className="w-full text-xs text-sky-400 mt-2 flex items-center justify-between p-1 rounded-lg hover:bg-sky-500/10">
                <span>Payment Breakdown</span>
                <ChevronDownIcon className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isExpanded && (
                <div className="mt-2 space-y-1 text-xs border-t border-white/10 pt-2 animate-fade-in">
                    {monthData.paymentDetails.filter(d => d.payment > 0).map(detail => (
                        <div key={detail.debtName} className="flex justify-between items-center p-1.5 rounded bg-black/20">
                            <span className="text-gray-400">{detail.debtName}</span>
                            <span className="font-mono text-gray-200">₹{detail.payment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                        </div>
                    ))}
                </div>
            )}
            
            {!isCheckedIn && !isFinal && (
                <button 
                    onClick={onCheckIn} 
                    disabled={!isCheckInEnabled} 
                    className="relative w-full mt-3 py-2 text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed 
                    enabled:bg-sky-600 enabled:text-white enabled:hover:bg-sky-500 enabled:shadow-lg enabled:shadow-sky-500/20
                    disabled:bg-gray-800 disabled:text-gray-500 overflow-hidden"
                >
                    {isCheckInEnabled ? 'Mark as Paid' : 'Upcoming'}
                    {showConfetti && <ConfettiExplosion />}
                </button>
            )}
        </div>
    );
};

const FullRoadmapPage: React.FC<{ plan: DebtPlan; onBack: () => void; onCheckIn: (month: number) => void; }> = ({ plan, onBack, onCheckIn }) => {
    const checkedInMonths = new Set(plan.checkedInMonths || []);
    const [confettiMonth, setConfettiMonth] = useState<number | null>(null);

    const handleCheckInAndConfetti = (month: number) => {
        onCheckIn(month);
        setConfettiMonth(month);
        setTimeout(() => setConfettiMonth(null), 2000);
    };

    return (
        <div className="animate-fade-in relative min-h-screen">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/50 via-transparent to-transparent opacity-50 -z-10"></div>
            
            <header className="sticky top-0 z-20 flex items-center p-4 bg-[#0D1117]/80 backdrop-blur-sm">
                <button onClick={onBack} className="p-2 text-gray-300 rounded-full hover:bg-white/10"><ChevronLeftIcon /></button>
                <div className="text-center flex-1">
                    <h1 className="text-2xl font-bold text-gray-100 font-montserrat tracking-wide text-glow-white">Full Debt Free Roadmap</h1>
                    <p className="text-sm text-sky-400">Your step-by-step journey to financial freedom.</p>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="relative py-8">
                <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-gray-800 rounded-full">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-400 to-sky-400 animate-pulse-line" style={{ clipPath: `inset(0 0 ${100 - (checkedInMonths.size / plan.roadmap.length) * 100}% 0)` }}></div>
                </div>

                <div className="space-y-2">
                    {plan.roadmap.map((month, index) => {
                        const isCheckedIn = checkedInMonths.has(month.month);
                        const isNextUnchecked = month.month === checkedInMonths.size + 1;
                        const focusDebt = plan.debts.find(d => d.name === month.focus);
                        const paymentDate = focusDebt ? focusDebt.paymentDate : 1;
                        const isCheckInEnabled = isNextUnchecked && new Date().getDate() >= paymentDate;

                        return (
                            <div key={month.month} className="relative pl-16 pr-2 animate-slide-up-fade-in" style={{ animationDelay: `${index * 80}ms`}}>
                                <TimelineCard 
                                    monthData={month}
                                    isCheckedIn={isCheckedIn}
                                    onCheckIn={() => handleCheckInAndConfetti(month.month)}
                                    isCheckInEnabled={isCheckInEnabled}
                                    showConfetti={confettiMonth === month.month}
                                    isFinal={month.month === plan.roadmap.length}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const AIChatPanel: FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
    const TypingIndicator: FC = () => (
        <div className="flex items-center space-x-1.5 ml-2">
            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
        </div>
    );

    return (
        <GlassmorphicPanel
            onClick={() => onNavigate('aiChat')}
            className="!p-6 group cursor-pointer transition-all duration-500 ease-out shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] animate-active-glow-purple !border-purple-500/30 bg-gradient-to-br from-indigo-900/40 to-purple-900/40"
        >
            <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                    <div className="p-4 bg-purple-900/50 rounded-2xl animate-float border border-purple-400/30">
                        <AIIcon className="h-10 w-10 text-purple-300 transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-gray-100 flex items-center">
                            Ask Your AI Debt Coach
                            <TypingIndicator />
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">Get personalized strategies to clear your debt faster.</p>
                    </div>
                </div>
                <ChevronRightIcon className="h-8 w-8 text-gray-600 transition-all duration-300 group-hover:text-purple-300 group-hover:translate-x-1 flex-shrink-0" />
            </div>
        </GlassmorphicPanel>
    );
};


// --- MAIN SCREEN COMPONENT ---
const ManageDebtScreen: React.FC<{ onBack: () => void; onNavigate: (view: string, params?: any) => void; }> = ({ onBack, onNavigate }) => {
    const { addTransaction, removeTransaction, debtPlan, setDebtPlan } = useContext(FinancialContext);
    const [phase, setPhase] = useState<Phase>('input');
    const [debts, setDebts] = useState<Omit<Debt, 'id'>[]>([
        { name: 'Car Loan', amount: 250000, apr: 7.5, minPayment: 15000, paymentDate: 10 }
    ]);
    const [extraPayment, setExtraPayment] = useState(0);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isStartPlanModalOpen, setIsStartPlanModalOpen] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '' });

    const showNotification = (message: string) => {
        setNotification({ show: true, message });
    };

    const Notification: FC<{ message: string; show: boolean; onClose: () => void }> = ({ message, show, onClose }) => {
        useEffect(() => {
            if (show) {
                const timer = setTimeout(onClose, 4000);
                return () => clearTimeout(timer);
            }
        }, [show, onClose]);
    
        return (
            <div className={`fixed top-24 right-6 z-[100] transition-all duration-500 ease-in-out transform ${show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
                <div className="bg-gray-800/80 backdrop-blur-md text-gray-100 font-semibold py-3 px-5 rounded-xl shadow-2xl shadow-black/50 flex items-center space-x-3 border border-green-500/30">
                    <CheckCircleIcon className="w-6 h-6 text-green-400"/>
                    <span>{message}</span>
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (debtPlan) {
            setPhase('dashboard');
        } else {
            setPhase('input');
        }
    }, [debtPlan]);

    const handleFormSubmit = () => {
        const validDebts = debts.filter(d => d.amount > 0 && d.apr >= 0 && d.minPayment > 0 && d.name.trim() !== '');
        if (validDebts.length === 0) {
            return;
        }
        setDebts(validDebts);
        setPhase('strategy');
    };

    const handleStrategySelect = (strategy: Strategy) => {
        setPhase('calculating');
        setTimeout(() => {
            const plan = calculatePlan(debts, strategy, extraPayment);
            setDebtPlan({ ...plan, checkedInMonths: [] });
        }, 5000);
    };

    const handleUpdatePlan = (newExtraPayment: number) => {
        if (!debtPlan) return;
        const newPlan = calculatePlan(debtPlan.debts, debtPlan.strategy, newExtraPayment);
        setDebtPlan({ ...debtPlan, ...newPlan });
        showNotification("Debt Simulator plan applied!");
    };

    const handleReset = () => {
        setDebtPlan(null);
        setDebts([{ name: 'Car Loan', amount: 250000, apr: 7.5, minPayment: 15000, paymentDate: 10 }]);
    };
    
    const handleSaveAutomation = (date: string) => {
        if (!debtPlan) return;
        const newTransactionId = addTransaction({
            merchant: 'Debt Repayment Plan',
            amount: debtPlan.monthlyPayment,
            category: 'EMI',
            date: date,
            isRecurring: true,
            transactionType: 'expense',
        });
        setDebtPlan({ ...debtPlan, automatedPlanTransactionId: newTransactionId });
        setIsStartPlanModalOpen(false);
        showNotification(`Recurring payment of ₹${debtPlan.monthlyPayment.toLocaleString('en-IN')} is set!`);
    };

    const handleCancelAutomation = () => {
        if (!debtPlan || !debtPlan.automatedPlanTransactionId) return;
        removeTransaction(debtPlan.automatedPlanTransactionId);
        setDebtPlan({ ...debtPlan, automatedPlanTransactionId: undefined });
        showNotification('Automated payment plan has been cancelled.');
    };

    const handleCheckIn = (monthNumber: number) => {
        if (!debtPlan) return;
        const newCheckedInMonths = [...(debtPlan.checkedInMonths || []), monthNumber];
        const uniqueMonths = [...new Set(newCheckedInMonths)].sort((a,b) => a-b);
        setDebtPlan({
            ...debtPlan,
            checkedInMonths: uniqueMonths,
        });
    };
    
    const DebtDashboard: React.FC<{ 
        plan: DebtPlan, 
        onUpdatePlan: (newExtraPayment: number) => void; 
        onReset: () => void,
        onStartPlan: () => void,
        onCancelPlan: () => void,
        onCheckIn: (month: number) => void,
        onNavigate: (view: string, params?: any) => void;
    }> = ({ plan, onUpdatePlan, onReset, onStartPlan, onCancelPlan, onCheckIn, onNavigate }) => {
        const [view, setView] = useState<'dashboard' | 'fullRoadmap'>('dashboard');
    
        const checkedInCount = plan.checkedInMonths?.length ?? 0;
        const totalInitialDebt = plan.debts.reduce((s, d) => s + d.amount, 0);
        const remainingBalance = plan.roadmap[checkedInCount - 1]?.totalRemainingBalance ?? totalInitialDebt;
        const paidAmount = totalInitialDebt - remainingBalance;
        const paidPercentage = totalInitialDebt > 0 ? Math.round((paidAmount / totalInitialDebt) * 100) : 0;
        const interestPaidSoFar = plan.roadmap.slice(0, checkedInCount).reduce((sum, r) => sum + r.totalInterestPaid, 0);
        const principalPaidSoFar = paidAmount - interestPaidSoFar;
        
        if (view === 'fullRoadmap') return <FullRoadmapPage plan={plan} onBack={() => setView('dashboard')} onCheckIn={onCheckIn} />;
    
        return (
            <div className="space-y-6">
                <HeroSection plan={plan} />
                 <DebtOverviewPanel
                    remainingDebt={remainingBalance}
                    timeToFreedom={plan.totalMonths - checkedInCount}
                    paidPercentage={paidPercentage}
                    principalPaid={principalPaidSoFar}
                    interestPaid={interestPaidSoFar}
                    dtiRatio={38} 
                    debtLevel="Medium"
                 />
                 <MonthlyRoadmapPanel 
                    plan={plan}
                    onViewAll={() => setView('fullRoadmap')}
                    onStartPlan={onStartPlan}
                    onCancelPlan={onCancelPlan}
                    onCheckIn={onCheckIn}
                />
                <ActionSwiperPanel>
                    <TotalPayoffBreakdownPanel plan={plan} />
                    <DebtAcceleratorPanel plan={plan} onImplement={onUpdatePlan} />
                </ActionSwiperPanel>
                <AIChatPanel onNavigate={onNavigate} />
                <DebtInsightsPanel plan={plan} />
                <ActionHubPanels 
                    onViewTools={() => onNavigate('tools', { category: 'Debt & Loans' })} 
                    onViewLearning={() => onNavigate('learning', { category: 'Debt' })}
                />
                <FAQSection onViewAll={() => {}} />
                <div className="pt-4 pb-2">
                     <button 
                        onClick={onReset} 
                        className="w-full text-center py-3 text-sm font-semibold text-red-300 bg-red-900/30 rounded-2xl hover:bg-red-900/50 transition-colors shadow-lg shadow-black/20"
                     >
                        Re-evaluate Full Plan
                    </button>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (phase) {
            case 'input': return (
                <div className="space-y-6 p-2">
                    <HeroSection plan={null}/>
                    <DebtEntryForm debts={debts} setDebts={setDebts} />
                    <button onClick={handleFormSubmit} className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/10 hover:scale-[1.02] active:scale-100 transition-transform transform text-lg">
                        Make My Plan
                    </button>
                </div>
            );
            case 'strategy': return <StrategySelection onSelect={handleStrategySelect} onOpenAiModal={() => setIsAiModalOpen(true)} />;
            case 'calculating': return <CinematicCalculatingAnimation debts={debts} />;
            case 'dashboard': return debtPlan && <DebtDashboard plan={debtPlan} onUpdatePlan={handleUpdatePlan} onReset={handleReset} onStartPlan={() => setIsStartPlanModalOpen(true)} onCancelPlan={handleCancelAutomation} onCheckIn={handleCheckIn} onNavigate={onNavigate} />;
            default: return <p>Something went wrong.</p>;
        }
    };
    
    return (
        <>
            <Notification message={notification.message} show={notification.show} onClose={() => setNotification({ show: false, message: '' })} />
            <div className="p-6 h-full flex flex-col animate-fade-in bg-[#0D1117]">
                {phase !== 'dashboard' && (
                    <header className="flex items-center mb-4">
                        <button onClick={phase === 'input' ? onBack : () => setPhase('input')} className="p-2 -ml-2 text-gray-300 rounded-full hover:bg-gray-800">
                            <ChevronLeftIcon />
                        </button>
                        <div className="text-center flex-1">
                             <h1 className="text-2xl font-bold text-gray-200">Manage Your Debt</h1>
                        </div>
                         <div className="w-8"></div>
                    </header>
                )}
                <div className="flex-1 overflow-y-auto no-scrollbar -mx-6 px-6">
                    {renderContent()}
                </div>
                {isAiModalOpen && <AIRecommendationModal onClose={() => setIsAiModalOpen(false)} onSelectStrategy={handleStrategySelect} />}
                {isStartPlanModalOpen && debtPlan && <StartPlanModal plan={debtPlan} onClose={() => setIsStartPlanModalOpen(false)} onSave={handleSaveAutomation} />}
            </div>
        </>
    );
};

export default ManageDebtScreen;