
import React, { useState, FC, useMemo, useEffect } from 'react';
import OnboardingQuestion from '../components/onboarding/OnboardingQuestion';
import OnboardingNavigation from '../components/onboarding/OnboardingNavigation';
import PremiumInput from '../components/onboarding/PremiumInput';
import PremiumSelect from '../components/onboarding/PremiumSelect';
import PremiumToggle from '../components/onboarding/PremiumToggle';
import PremiumSlider from '../components/onboarding/PremiumSlider';
import ProgressRing from '../components/onboarding/ProgressRing';
import { User, OnboardingData, InvestmentCategory, DebtType, InsuranceType } from '../types';
import { GrowwIcon } from '../components/icons/GrowwIcon';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';

export interface OnboardingResult {
    user: User;
    data: OnboardingData;
}

interface SimpleOnboardingScreenProps {
    onComplete: (result: OnboardingResult) => void;
}

// --- LOCAL REUSABLE COMPONENTS ---

const MultiSelect: FC<{ options: string[], selected: string[], onSelect: (val: string) => void, columns?: number }> = ({ options, selected, onSelect, columns = 2 }) => {
    const columnClass = columns === 3 ? 'grid-cols-3' : 'grid-cols-2';
    return (
        <div className={`grid gap-2 ${columnClass}`}>
            {options.map(opt => (
                <button key={opt} onClick={() => onSelect(opt)} className={`p-3 text-sm rounded-xl font-semibold transition-all duration-300 ${selected.includes(opt) ? 'bg-slate-800/50 border border-slate-500 text-white shadow-[0_0_15px_rgba(100,116,139,0.4)]' : 'bg-black/30 border border-white/10 text-gray-300 hover:bg-white/20'}`}>{opt}</button>
            ))}
        </div>
    );
};

const SavingsSummaryCard: FC<{ amount: number, returnRate: number | 'DontKnow' | null }> = ({ amount, returnRate }) => (
    <div className="bg-black/20 p-4 rounded-xl border border-white/10 mt-4 animate-fade-in">
        <h3 className="text-center font-semibold text-gray-300 mb-2">Your Savings Snapshot</h3>
        <div className="flex justify-around text-center">
            <div>
                <p className="text-xs text-gray-400">Total Amount</p>
                <p className="text-xl font-bold text-sky-300">₹{amount.toLocaleString('en-IN')}</p>
            </div>
            <div>
                <p className="text-xs text-gray-400">Avg. Return</p>
                <p className="text-xl font-bold text-sky-300">{returnRate === 'DontKnow' || returnRate === null ? 'N/A' : `${returnRate}%`}</p>
            </div>
        </div>
    </div>
);

const DebtItemForm: FC<{ debt: OnboardingData['debts'][0], onUpdate: (updates: Partial<OnboardingData['debts'][0]>) => void }> = ({ debt, onUpdate }) => {
    const [useTenure, setUseTenure] = useState(false);

    useEffect(() => {
        if (useTenure && debt.outstandingAmount > 0 && debt.interestRate > 0 && debt.tenure && debt.tenure > 0) {
            const P = debt.outstandingAmount;
            const r = debt.interestRate / 100 / 12; // monthly rate
            const n = debt.tenure; // tenure in months
            if (r > 0) {
                const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
                onUpdate({ emi: parseFloat(emi.toFixed(2)) });
            }
        }
    }, [useTenure, debt.outstandingAmount, debt.interestRate, debt.tenure, onUpdate]);

    return (
        <div className="space-y-4">
            <PremiumSelect label="Type of debt" value={debt.type || ''} onChange={e => onUpdate({ type: e.target.value as DebtType })}>
                <option value="">Select...</option>
                <option>Credit Card</option><option>Personal Loan</option><option>Home Loan</option><option>Car Loan</option><option>Education Loan</option><option>Other</option>
            </PremiumSelect>
            <PremiumInput label="Outstanding Amount (approx.)" type="number" value={debt.outstandingAmount || ''} onChange={e => onUpdate({ outstandingAmount: parseFloat(e.target.value) || 0 })} />
            <PremiumInput label="Interest Rate (p.a. %)" type="number" value={debt.interestRate || ''} onChange={e => onUpdate({ interestRate: parseFloat(e.target.value) || 0 })} />
            <PremiumToggle label="" options={['Enter EMI', 'Calculate from Tenure']} value={useTenure ? 'Calculate from Tenure' : 'Enter EMI'} onSelect={val => setUseTenure(val === 'Calculate from Tenure')} />
            {useTenure ? (
                <PremiumInput label="Loan Duration (in months)" type="number" value={debt.tenure || ''} onChange={e => onUpdate({ tenure: parseInt(e.target.value) || 0 })} />
            ) : (
                <PremiumInput label="EMI Amount (₹)" type="number" value={debt.emi || ''} onChange={e => onUpdate({ emi: parseFloat(e.target.value) || 0 })} />
            )}
        </div>
    )
}

const SimpleOnboardingScreen: React.FC<SimpleOnboardingScreenProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
    const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
    
    const [user, setUser] = useState<Partial<User> & { password?: string }>({ name: '', email: '', age: undefined, password: '' });
    const [data, setData] = useState<OnboardingData>({
        name: '', age: 0, monthlyIncome: 0, monthlyExpense: 0,
        hasEmergencyFund: null, emergencyFundAmount: 0, emergencyFundGrowthRate: 6,
        invests: null, investmentAssets: [], monthlyInvestment: 0, investmentPlatform: null, riskLevel: null, totalInvestmentAmount: 0,
        savesRegularly: null, monthlySavings: 0, savingGoals: [], expectedReturn: null,
        hasDebts: null, debts: [],
        hasInsurance: null, insurancePolicies: [],
    });

    const TOTAL_STEPS = 9; // 0=Auth, 1=Age, 2=Income, 3=Expenses, 4=Emergency, 5=Invest, 6=Debt, 7=Insurance, 8=Complete

    const updateUserData = (field: keyof typeof user, value: any) => setUser(prev => ({ ...prev, [field]: value }));
    const updateData = (field: keyof OnboardingData, value: any) => setData(prev => ({ ...prev, [field]: value }));

    const handleNext = () => {
        setDirection('forward');
        let nextStep = step + 1;
        
        if (step === 0) {
             // Sync name/age to data if entered
             if(user.name) updateData('name', user.name);
             if(user.age) updateData('age', user.age);
        }
        
        // Logic to skip certain steps
        if (step === 4 && data.hasEmergencyFund === 'No') nextStep++; // Skip emergency details if No
        if (step === 6 && data.hasDebts === 'No') nextStep++; // Skip debt details (handled within step logic mostly, but if we split)
        
        if (nextStep >= TOTAL_STEPS) handleComplete();
        else setStep(nextStep);
    };

    const handleBack = () => {
        setDirection('backward');
        setStep(Math.max(0, step - 1));
    };

    const handleComplete = () => {
        onComplete({
            user: {
                name: user.name || 'Guest',
                email: user.email || '',
                age: user.age || 25,
                profilePictureUrl: `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=0ea5e9&color=fff`,
            },
            data: data,
        });
    };
    
    const isNumInvalid = (num: number | undefined | null) => num === undefined || num === null || isNaN(num) || num < 0;

    const isNextDisabled = (currentStep: number): boolean => {
        switch (currentStep) {
            case 0: // Auth
                if (authMode === 'signin') return !user.email?.trim() || !user.password || user.password.length < 6;
                return !user.name?.trim() || !user.email?.trim() || !/^\S+@\S+\.\S+$/.test(user.email || '') || !user.password || user.password.length < 6;
            case 1: // Age
                return !user.age || user.age <= 0 || user.age > 120;
            case 2: // Income
                return isNumInvalid(data.monthlyIncome) || data.monthlyIncome === 0;
            case 3: // Expense
                return isNumInvalid(data.monthlyExpense);
            case 4: // Emergency Fund
                 if (data.hasEmergencyFund === null) return true;
                 if (data.hasEmergencyFund === 'Yes') return isNumInvalid(data.emergencyFundAmount);
                 return false;
            case 5: // Investments
                 if (data.invests === null) return true;
                 if (data.invests === 'Yes') {
                     return isNumInvalid(data.totalInvestmentAmount) || data.investmentAssets.length === 0 || !data.riskLevel;
                 }
                 return false;
            case 6: // Debt
                 if (data.hasDebts === null) return true;
                 if (data.hasDebts === 'Yes') {
                     const debt = data.debts[0];
                     return !debt || !debt.type || isNumInvalid(debt.outstandingAmount) || isNumInvalid(debt.interestRate);
                 }
                 return false;
            case 7: // Insurance
                 if (data.hasInsurance === null) return true;
                 if (data.hasInsurance === 'Yes') {
                     const policy = data.insurancePolicies[0];
                     return !policy || !policy.type || isNumInvalid(policy.coverage) || isNumInvalid(policy.premium);
                 }
                 return false;
            default: return false;
        }
    };

    const emergencyFundProgress = useMemo(() => {
        if (!data.monthlyExpense || data.monthlyExpense === 0) return 0;
        const target = data.monthlyExpense * 6;
        if (target === 0) return 0;
        return Math.min(100, (data.emergencyFundAmount / target) * 100);
    }, [data.emergencyFundAmount, data.monthlyExpense]);
    
    // Navigation Props
    const navProps = { onBack: handleBack, onNext: handleNext, backDisabled: step === 0, nextDisabled: isNextDisabled(step) };

    return (
        <div className="h-screen flex flex-col bg-[#0A0A0A] text-gray-200 relative overflow-hidden p-6">
            {/* Step Indicator - Hidden on Authentication Step */}
            {step > 0 && (
                <div className="absolute top-6 left-6 right-6 z-10 animate-fade-in">
                    <p className="text-sm font-semibold text-sky-400">Step {step} of {TOTAL_STEPS - 1}</p>
                    <div className="w-full bg-white/10 rounded-full h-1 mt-1.5"><div className="bg-sky-400 h-1 rounded-full transition-all duration-500" style={{ width: `${((step) / (TOTAL_STEPS - 1)) * 100}%` }}></div></div>
                </div>
            )}

            <div className="flex-1 relative mt-4 z-10">
                
                {/* Step 0: Realistic Auth Screen */}
                {step === 0 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <div className="flex flex-col h-full justify-center max-w-md mx-auto w-full">
                        
                        <div className="flex justify-center mb-8 animate-slide-up-fade-in">
                           <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-sky-500/30">
                                <span className="text-3xl font-bold text-white">M</span>
                           </div>
                        </div>

                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold font-montserrat text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2 animate-slide-up-fade-in">
                                {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
                            </h1>
                            <p className="text-gray-400 text-sm animate-slide-up-fade-in" style={{ animationDelay: '100ms' }}>
                                {authMode === 'signup' ? 'Start your journey to financial freedom today.' : 'Sign in to access your financial dashboard.'}
                            </p>
                        </div>

                        <div className="space-y-4 animate-slide-up-fade-in premium-glass !p-6 !rounded-3xl !border-white/5 shadow-2xl" style={{ animationDelay: '200ms' }}>
                            {authMode === 'signup' && (
                                <PremiumInput
                                    label="Full Name"
                                    value={user.name}
                                    onChange={e => updateUserData('name', e.target.value)}
                                    placeholder="e.g. Aarav Sharma"
                                />
                            )}
                            <PremiumInput
                                label="Email Address"
                                type="email"
                                value={user.email}
                                onChange={e => updateUserData('email', e.target.value)}
                                placeholder="name@example.com"
                            />
                            <PremiumInput
                                label="Password"
                                type="password"
                                value={user.password}
                                onChange={e => updateUserData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                            
                            <button
                                onClick={handleNext}
                                disabled={isNextDisabled(0)}
                                className="w-full py-4 mt-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 transform hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                            >
                                {authMode === 'signup' ? 'Sign Up' : 'Sign In'}
                            </button>
                        </div>

                        <div className="mt-8 text-center animate-slide-up-fade-in" style={{ animationDelay: '400ms' }}>
                            <p className="text-gray-400 text-sm">
                                {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                                <button
                                    onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
                                    className="ml-2 text-sky-400 font-semibold hover:text-sky-300 transition-colors"
                                >
                                    {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
                                </button>
                            </p>
                        </div>
                    </div>
                </OnboardingQuestion>}

                {step === 1 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">Nice to meet you, {user.name?.split(' ')[0] || 'Friend'}! How old are you?</h2>
                    <div className="space-y-4 mt-6"><PremiumInput label="Your age" type="number" value={user.age || ''} onChange={e => updateUserData('age', parseInt(e.target.value) || undefined)} placeholder="e.g., 25" /></div>
                    <OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}
                
                {step === 2 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">What's your monthly income?</h2>
                    <p className="text-gray-400 mt-1">This helps us personalize your budget and insights.</p>
                    <div className="space-y-4 mt-6"><PremiumInput label="Take-home pay per month" type="number" value={data.monthlyIncome || ''} onChange={e => updateData('monthlyIncome', parseFloat(e.target.value) || undefined)} placeholder="e.g., 80000" /></div>
                    <OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}
                
                {step === 3 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">And your average monthly expenses?</h2>
                    <p className="text-gray-400 mt-1">Be honest! This is just for you.</p>
                    <div className="space-y-4 mt-6"><PremiumInput label="All monthly spending (rent, food, fun)" type="number" value={data.monthlyExpense || ''} onChange={e => updateData('monthlyExpense', parseFloat(e.target.value) || undefined)} placeholder="e.g., 55000" /></div>
                    <OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}
                
                {step === 4 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">Do you have an emergency fund?</h2>
                    <p className="text-gray-400 mt-1">Typically 6 months of expenses.</p>
                    <div className="space-y-4 mt-6">
                        <PremiumToggle options={['Yes', 'No']} value={data.hasEmergencyFund} onSelect={val => updateData('hasEmergencyFund', val as 'Yes' | 'No')} label="" />
                         {data.hasEmergencyFund === 'Yes' && (
                             <div className="animate-fade-in space-y-4 mt-4">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="relative w-32 h-32">
                                       <ProgressRing progress={emergencyFundProgress} size={128} strokeWidth={10} />
                                       <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">{Math.round(emergencyFundProgress)}%</div>
                                    </div>
                                    <PremiumInput label="Current Amount" type="number" value={data.emergencyFundAmount || ''} onChange={e => updateData('emergencyFundAmount', parseFloat(e.target.value) || 0)} placeholder="e.g., 100000" />
                                    <p className="text-xs text-gray-400">Target: ₹{((data.monthlyExpense || 0) * 6).toLocaleString()}</p>
                                </div>
                             </div>
                         )}
                    </div>
                    <OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}
                
                {step === 5 && <OnboardingQuestion animationKey={step} direction={direction}>
                     <h2 className="text-2xl font-bold">Do you have savings or investments?</h2>
                     <div className="space-y-4 mt-6">
                         <PremiumToggle options={['Yes', 'No']} value={data.invests} onSelect={val => updateData('invests', val as 'Yes' | 'No')} label="" />
                         {data.invests === 'Yes' && (
                             <div className="space-y-4 animate-fade-in max-h-[45vh] overflow-y-auto no-scrollbar pr-2">
                                <PremiumInput label="Total Amount (approx.)" type="number" value={data.totalInvestmentAmount || ''} onChange={e => updateData('totalInvestmentAmount', parseFloat(e.target.value) || 0)} placeholder="e.g., 500000"/>
                                <MultiSelect options={['Stocks', 'Mutual Funds', 'Gold', 'Crypto', 'Bonds', 'Other']} selected={data.investmentAssets} onSelect={val => {
                                    const assets = data.investmentAssets.includes(val as InvestmentCategory) ? data.investmentAssets.filter(a => a !== val) : [...data.investmentAssets, val as InvestmentCategory];
                                    updateData('investmentAssets', assets);
                                }}/>
                                <PremiumSelect label="Your Risk Level" value={data.riskLevel || ''} onChange={e => updateData('riskLevel', e.target.value as any)}><option value="">Select...</option><option>Low</option><option>Medium</option><option>High</option></PremiumSelect>
                                {(data.totalInvestmentAmount > 0) && <SavingsSummaryCard amount={data.totalInvestmentAmount} returnRate={data.expectedReturn} />}
                            </div>
                         )}
                         {data.invests === 'No' && (
                             <div className="mt-6 p-4 rounded-2xl bg-black/30 border border-green-500/30 animate-fade-in flex items-center gap-4">
                                <GrowwIcon className="w-12 h-12 flex-shrink-0" />
                                <div>
                                     <h3 className="font-bold text-green-300">Start with Groww</h3>
                                     <p className="text-sm text-gray-300">Simple, trusted, and fast.</p>
                                </div>
                            </div>
                         )}
                     </div>
                     <OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}
                
                {step === 6 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">Do you have any loans or debts?</h2>
                    <div className="space-y-4 mt-6">
                        <PremiumToggle options={['Yes', 'No']} value={data.hasDebts} onSelect={(val) => {
                           if (val === 'Yes' && data.debts.length === 0) {
                               setData(prev => ({...prev, hasDebts: 'Yes', debts: [{type: 'Personal Loan', outstandingAmount: 0, interestRate: 0, emi: 0, tenure: 0, affordablePayment: 0}]}));
                           } else {
                               updateData('hasDebts', val as 'Yes' | 'No');
                           }
                       }} label="" />
                       {data.hasDebts === 'Yes' && (
                           <div className="space-y-4 animate-fade-in max-h-[45vh] overflow-y-auto no-scrollbar pr-2">
                               <DebtItemForm debt={data.debts[0]} onUpdate={updates => updateData('debts', [{...data.debts[0], ...updates}])} />
                           </div>
                       )}
                    </div>
                    <OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}

                {step === 7 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">Do you have insurance?</h2>
                    <div className="space-y-4 mt-6">
                       <PremiumToggle options={['Yes', 'No']} value={data.hasInsurance} onSelect={(val) => {
                           if (val === 'Yes' && data.insurancePolicies.length === 0) {
                               setData(prev => ({...prev, hasInsurance: 'Yes', insurancePolicies: [{type: 'Health', coverage: 0, premium: 0, renewalDate: new Date().toISOString().split('T')[0]}]}));
                           } else {
                               updateData('hasInsurance', val as 'Yes' | 'No');
                           }
                       }} label="" />
                       {data.hasInsurance === 'Yes' && (
                           <div className="space-y-4 animate-fade-in max-h-[45vh] overflow-y-auto no-scrollbar pr-2">
                               <PremiumSelect label="Type" value={data.insurancePolicies[0]?.type || ''} onChange={e => updateData('insurancePolicies', [{...data.insurancePolicies[0], type: e.target.value as InsuranceType}])}><option value="">Select...</option><option>Term</option><option>Life</option><option>Health</option><option>Critical Illness</option><option>Other</option></PremiumSelect>
                               <PremiumInput label="Coverage Amount (approx.)" type="number" value={data.insurancePolicies[0]?.coverage || ''} onChange={e => updateData('insurancePolicies', [{...data.insurancePolicies[0], coverage: parseFloat(e.target.value) || 0}])} />
                               <PremiumInput label="Annual Premium (approx.)" type="number" value={data.insurancePolicies[0]?.premium || ''} onChange={e => updateData('insurancePolicies', [{...data.insurancePolicies[0], premium: parseFloat(e.target.value) || 0}])} />
                               <PremiumInput label="Renewal Date" type="date" value={data.insurancePolicies[0]?.renewalDate || ''} onChange={e => updateData('insurancePolicies', [{...data.insurancePolicies[0], renewalDate: e.target.value}])} />
                           </div>
                       )}
                    </div>
                    <OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}

                {step === 8 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <div className="text-center flex flex-col items-center justify-center h-full">
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 bg-sky-500/20 rounded-full animate-ping"></div>
                            <div className="relative bg-sky-500/10 p-4 rounded-full text-5xl animate-float">🚀</div>
                        </div>
                        <h2 className="text-3xl font-bold">You're all set, {user.name?.split(' ')[0]}!</h2>
                        <p className="text-gray-400 mt-4 max-w-xs">We've built your personalized financial dashboard. Get ready to master your money.</p>
                    </div>
                    <OnboardingNavigation onBack={handleBack} onNext={handleComplete} isLastStep nextDisabled={false} />
                </OnboardingQuestion>}
                
            </div>
        </div>
    );
};

export default SimpleOnboardingScreen;
