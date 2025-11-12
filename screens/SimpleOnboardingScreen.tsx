import React, { useState, FC } from 'react';
import OnboardingQuestion from '../components/onboarding/OnboardingQuestion';
import OnboardingNavigation from '../components/onboarding/OnboardingNavigation';
import PremiumInput from '../components/onboarding/PremiumInput';
import { User, OnboardingData, InvestmentCategory, DebtType } from '../types';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export interface OnboardingResult {
    user: User;
    data: OnboardingData;
}

interface SimpleOnboardingScreenProps {
    onComplete: (result: OnboardingResult) => void;
}

// --- LOCAL REUSABLE COMPONENTS ---
const PremiumToggle: FC<{ options: (string | null)[]; value: string | null; onSelect: (val: string | null) => void }> = ({ options, value, onSelect }) => (
    <div className="flex gap-4">
        {options.map(opt => (
            <button key={opt} onClick={() => onSelect(opt)} className={`flex-1 p-4 rounded-xl text-lg transition-all ${value === opt ? 'bg-sky-500 text-white shadow-lg' : 'bg-white/10'}`}>
                {opt}
            </button>
        ))}
    </div>
);

const PremiumSelect: FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
    <div>
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <div className="relative">
            <select {...props} className="w-full appearance-none bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-3 mt-1 text-base text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all">{children}</select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></div>
        </div>
    </div>
);

const SimpleOnboardingScreen: React.FC<SimpleOnboardingScreenProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
    const [user, setUser] = useState<Partial<User>>({ name: '', email: '', age: undefined });
    const [data, setData] = useState<Partial<OnboardingData>>({
        monthlyIncome: undefined, monthlyExpense: undefined,
        savesRegularly: null, monthlySavings: 0,
        invests: null,
        hasInsurance: null, insurancePolicies: [{ type: 'Life', coverage: 0 }],
        hasDebts: null, debts: [{ type: 'Credit Card', outstandingAmount: 0, interestRate: 0, affordablePayment: 0 }]
    });

    // Sub-step states for conditional questions
    const [wantsCoverageCheck, setWantsCoverageCheck] = useState<'Yes' | 'No' | null>(null);
    const [idealCoverage, setIdealCoverage] = useState<number | null>(null);

    const TOTAL_STEPS = 9;

    const updateUserData = (field: keyof User, value: any) => setUser(prev => ({ ...prev, [field]: value }));
    const updateData = (field: keyof OnboardingData, value: any) => setData(prev => ({ ...prev, [field]: value }));

    const handleNext = () => {
        setDirection('forward');
        const nextStep = step + 1;
        if (nextStep >= TOTAL_STEPS) handleComplete();
        else setStep(nextStep);
    };

    const handleBack = () => {
        setDirection('backward');
        setStep(step - 1);
    };

    const handleComplete = () => {
        onComplete({
            user: {
                name: user.name || '',
                email: user.email || '',
                age: user.age,
                profilePictureUrl: `https://avatar.vercel.sh/${user.name || 'user'}.png`,
            },
            data: data as OnboardingData,
        });
    };

    const isNextDisabled = (currentStep: number): boolean => {
        switch (currentStep) {
            case 0: return !user.name?.trim();
            case 1: return !user.email?.trim() || !/^\S+@\S+\.\S+$/.test(user.email);
            case 2: return !user.age || user.age <= 0 || user.age > 120;
            case 3: return !data.monthlyIncome || data.monthlyIncome <= 0;
            case 4: return data.monthlyExpense === undefined || data.monthlyExpense < 0;
            case 5: return data.savesRegularly === null || (data.savesRegularly === 'Yes' && (!data.monthlySavings || data.monthlySavings <= 0));
            case 6: return data.invests === null;
            case 7: return data.hasInsurance === null || (data.hasInsurance === 'Yes' && (!data.insurancePolicies?.[0].type || !data.insurancePolicies?.[0].coverage));
            case 8: return data.hasDebts === null || (data.hasDebts === 'Yes' && (!data.debts?.[0].type || !data.debts?.[0].outstandingAmount));
            default: return false;
        }
    };

    const navProps = { onBack: handleBack, onNext: handleNext, backDisabled: step === 0, nextDisabled: isNextDisabled(step), isLastStep: step === TOTAL_STEPS - 1, onComplete: handleComplete };
    
    const CoverageGapChart: FC<{ current: number, ideal: number }> = ({ current, ideal }) => {
        const max = Math.max(current, ideal, 1);
        const currentPercent = (current / max) * 100;
        const idealPercent = (ideal / max) * 100;
        return (
            <div className="space-y-2 text-sm mt-4 animate-fade-in">
                <div className="flex items-center gap-2"><span className="w-20 text-gray-400">Current</span><div className="flex-1 bg-black/20 rounded h-6"><div className="bg-sky-500 h-6 rounded" style={{ width: `${currentPercent}%` }}></div></div><span className="w-24 text-right font-bold">₹{Math.round(current / 100000)}L</span></div>
                <div className="flex items-center gap-2"><span className="w-20 text-gray-400">Ideal</span><div className="flex-1 bg-black/20 rounded h-6"><div className="bg-green-500 h-6 rounded" style={{ width: `${idealPercent}%` }}></div></div><span className="w-24 text-right font-bold">₹{Math.round(ideal / 100000)}L</span></div>
            </div>
        );
    };
    
    return (
        <div className="h-screen flex flex-col bg-[#0A0A0A] text-gray-200 relative overflow-hidden p-6">
            <div className="absolute top-6 left-6 right-6 z-10">
                <p className="text-sm font-semibold text-sky-400">Step {step + 1} of {TOTAL_STEPS}</p>
                <div className="w-full bg-white/10 rounded-full h-1 mt-1.5"><div className="bg-sky-400 h-1 rounded-full transition-all duration-500" style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}></div></div>
            </div>
            <div className="flex-1 relative mt-12 z-10">
                {step === 0 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">Welcome! Let's start with your name.</h2>
                    <div className="space-y-4 mt-6"><PremiumInput label="What should we call you?" value={user.name} onChange={e => updateUserData('name', e.target.value)} placeholder="e.g., Aarav" /></div>
                    <OnboardingNavigation {...navProps} backDisabled={true} />
                </OnboardingQuestion>}
                {step === 1 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">Great to meet you, {user.name}! What's your email?</h2>
                    <div className="space-y-4 mt-6"><PremiumInput label="Your email address" type="email" value={user.email || ''} onChange={e => updateUserData('email', e.target.value)} placeholder="e.g., aarav@example.com" /></div>
                    <OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}
                {step === 2 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">One last personal detail, what's your age?</h2>
                    <div className="space-y-4 mt-6"><PremiumInput label="Your age" type="number" value={user.age || ''} onChange={e => updateUserData('age', parseInt(e.target.value) || undefined)} placeholder="e.g., 25" /></div>
                    <OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}
                {step === 3 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">What's your monthly income?</h2>
                    <p className="text-gray-400 mt-1">This helps us personalize your budget and insights.</p>
                    <div className="space-y-4 mt-6"><PremiumInput label="Take-home pay per month" type="number" value={data.monthlyIncome || ''} onChange={e => updateData('monthlyIncome', parseFloat(e.target.value) || undefined)} placeholder="e.g., 80000" /></div>
                    <OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}
                {step === 4 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">And your average monthly expenses?</h2>
                    <p className="text-gray-400 mt-1">Be honest! This is just for you.</p>
                    <div className="space-y-4 mt-6"><PremiumInput label="All monthly spending (rent, food, fun)" type="number" value={data.monthlyExpense || ''} onChange={e => updateData('monthlyExpense', parseFloat(e.target.value) || undefined)} placeholder="e.g., 55000" /></div>
                    <OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}
                
                {step === 5 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">💰 Do you currently save money every month?</h2>
                    <div className="space-y-4 mt-6"><PremiumToggle options={['Yes', 'No']} value={data.savesRegularly} onSelect={val => updateData('savesRegularly', val as 'Yes' | 'No')} />
                        {data.savesRegularly === 'Yes' && <div className="space-y-4 animate-fade-in"><PremiumInput label="How much do you usually save monthly?" type="number" value={data.monthlySavings || ''} onChange={e => updateData('monthlySavings', parseFloat(e.target.value) || 0)} placeholder="e.g., 15000" /></div>}
                        {data.savesRegularly === 'No' && <div className="space-y-4 animate-fade-in"><p className="text-center mt-4">Would you like to start saving from next month?</p><PremiumToggle options={['Yes', 'Not now']} value={data.wantsToStartSaving} onSelect={val => updateData('wantsToStartSaving', val as any)} /></div>}
                    </div><OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}
                
                {step === 6 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">📈 Have you started investing yet?</h2>
                     <div className="space-y-4 mt-6">
                        <PremiumToggle options={['Yes', 'No']} value={data.invests} onSelect={val => updateData('invests', val as 'Yes' | 'No')} />
                        {data.invests === 'Yes' && <div className="space-y-4 animate-fade-in"><PremiumSelect label="Where do you invest most right now?" value={data.investmentLocation || ''} onChange={e => updateData('investmentLocation', e.target.value as any)}><option>Stocks</option><option>ETFs</option><option>Mutual Funds</option><option>Real Estate</option><option>Crypto</option></PremiumSelect><PremiumSelect label="What's your goal with these investments?" value={data.investmentGoal || ''} onChange={e => updateData('investmentGoal', e.target.value as any)}><option>Wealth Growth</option><option>Income</option><option>Retirement</option><option>Short-term Gain</option></PremiumSelect></div>}
                        {data.invests === 'No' && <div className="space-y-4 animate-fade-in"><p className="text-center mt-4">Would you like to start investing to beat inflation?</p><PremiumToggle options={['Yes', 'Not ready yet']} value={data.wantsToStartInvesting} onSelect={val => updateData('wantsToStartInvesting', val as any)} /></div>}
                    </div><OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}

                {step === 7 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">🛡️ Do you have any insurance policy?</h2>
                    <div className="space-y-4 mt-6 max-h-[60vh] overflow-y-auto no-scrollbar pr-2">
                        <PremiumToggle options={['Yes', 'No']} value={data.hasInsurance} onSelect={val => { updateData('hasInsurance', val as 'Yes' | 'No'); setWantsCoverageCheck(null); setIdealCoverage(null); }} />
                        {data.hasInsurance === 'Yes' && <div className="space-y-4 animate-fade-in">
                            <PremiumSelect label="Which type of policy do you have?" value={data.insurancePolicies?.[0].type} onChange={e => updateData('insurancePolicies', [{...data.insurancePolicies![0], type: e.target.value as any}])}><option>Life</option><option>Health</option><option>Term</option><option>Vehicle</option><option>Other</option></PremiumSelect>
                            <PremiumInput label="What’s your current coverage amount?" type="number" value={data.insurancePolicies?.[0].coverage || ''} onChange={e => updateData('insurancePolicies', [{...data.insurancePolicies![0], coverage: parseFloat(e.target.value) || 0}])} />
                            <PremiumToggle options={['Yes', 'No']} value={wantsCoverageCheck} onSelect={val => { setWantsCoverageCheck(val as any); if(val==='No') setIdealCoverage(null); }} label="Would you like to know if your coverage is enough?" />
                            {wantsCoverageCheck === 'Yes' && <div className="space-y-4 bg-black/20 p-4 rounded-xl animate-fade-in">
                                <PremiumInput label="Number of dependents" type="number" value={data.dependents || ''} onChange={e => updateData('dependents', parseInt(e.target.value) || 0)} />
                                <button onClick={() => setIdealCoverage((data.monthlyIncome || 0) * 12 * 15)} className="w-full p-2 bg-sky-600 rounded-lg">Calculate Ideal Coverage</button>
                                {idealCoverage !== null && <div className="animate-fade-in"><p className="text-center text-sm mt-2">Your ideal coverage should be around <span className="font-bold text-green-400">₹{Math.round(idealCoverage/100000)} lakh</span>.</p><CoverageGapChart current={data.insurancePolicies?.[0].coverage || 0} ideal={idealCoverage} /></div>}
                            </div>}
                        </div>}
                        {data.hasInsurance === 'No' && <div className="space-y-4 animate-fade-in">
                            <PremiumToggle options={['Yes', 'No']} value={wantsCoverageCheck} onSelect={val => { setWantsCoverageCheck(val as any); if(val==='No') setIdealCoverage(null); }} label="Would you like to calculate how much coverage you should have?" />
                            {wantsCoverageCheck === 'Yes' && <div className="space-y-4 bg-black/20 p-4 rounded-xl animate-fade-in">
                                <PremiumInput label="Number of dependents" type="number" value={data.dependents || ''} onChange={e => updateData('dependents', parseInt(e.target.value) || 0)} />
                                <button onClick={() => setIdealCoverage((data.monthlyIncome || 0) * 12 * 15)} className="w-full p-2 bg-sky-600 rounded-lg">Calculate Ideal Coverage</button>
                                {idealCoverage !== null && <div className="animate-fade-in"><p className="text-center text-sm mt-2">Your ideal coverage should be <span className="font-bold text-green-400">₹{Math.round(idealCoverage/100000)} lakh</span>.</p></div>}
                            </div>}
                        </div>}
                    </div><OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}
                
                {step === 8 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">💳 Do you have any loan or debt right now?</h2>
                     <div className="space-y-4 mt-6">
                        <PremiumToggle options={['Yes', 'No']} value={data.hasDebts} onSelect={val => updateData('hasDebts', val as 'Yes' | 'No')} />
                        {data.hasDebts === 'Yes' && <div className="space-y-4 animate-fade-in">
                             <PremiumSelect label="Select your debt type" value={data.debts?.[0].type} onChange={e => updateData('debts', [{...data.debts![0], type: e.target.value as DebtType}])}><option>Credit Card</option><option>Personal Loan</option><option>Home Loan</option><option>Education Loan</option><option>Other</option></PremiumSelect>
                            <PremiumInput label="What’s your total outstanding amount?" type="number" value={data.debts?.[0].outstandingAmount || ''} onChange={e => updateData('debts', [{...data.debts![0], outstandingAmount: parseFloat(e.target.value) || 0}])} />
                            <PremiumInput label="At what interest rate are you paying?" type="number" value={data.debts?.[0].interestRate || ''} onChange={e => updateData('debts', [{...data.debts![0], interestRate: parseFloat(e.target.value) || 0}])} />
                            <PremiumInput label="How much can you afford to pay monthly?" type="number" value={data.debts?.[0].affordablePayment || ''} onChange={e => updateData('debts', [{...data.debts![0], affordablePayment: parseFloat(e.target.value) || 0}])} />
                        </div>}
                    </div><OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}
            </div>
        </div>
    );
};

export default SimpleOnboardingScreen;