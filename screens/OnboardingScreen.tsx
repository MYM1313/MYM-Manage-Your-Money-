import React, { useState, FC, useMemo, useEffect } from 'react';
import { OnboardingData, InvestmentCategory, DebtType, InsuranceType } from '../types';
import WelcomeAnimation from '../components/onboarding/WelcomeAnimation';
import AnalyzingAnimation from '../components/onboarding/AnalyzingAnimation';
import OnboardingQuestion from '../components/onboarding/OnboardingQuestion';
import OnboardingNavigation from '../components/onboarding/OnboardingNavigation';
import StepIndicator from '../components/onboarding/StepIndicator';
import PremiumInput from '../components/onboarding/PremiumInput';
import PremiumSelect from '../components/onboarding/PremiumSelect';
import PremiumToggle from '../components/onboarding/PremiumToggle';
import ProgressRing from '../components/onboarding/ProgressRing';
import PremiumSlider from '../components/onboarding/PremiumSlider';
import { GrowwIcon } from '../components/icons/GrowwIcon';

interface OnboardingScreenProps {
    onComplete: (data: OnboardingData) => void;
}

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
        if (useTenure && debt.outstandingAmount > 0 && debt.interestRate > 0 && debt.tenure > 0) {
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

const OnboardingScreen: FC<OnboardingScreenProps> = ({ onComplete }) => {
    const [step, setStep] = useState(-1); // -1 welcome, 9 analyzing
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
    const [data, setData] = useState<OnboardingData>({
        name: '', age: 0, monthlyIncome: 0, monthlyExpense: 0,
        hasEmergencyFund: null, emergencyFundAmount: 0, emergencyFundGrowthRate: 6,
        invests: null, investmentAssets: [], monthlyInvestment: 0, investmentPlatform: null, riskLevel: null, totalInvestmentAmount: 0,
        savesRegularly: null, monthlySavings: 0, savingGoals: [], expectedReturn: null,
        hasDebts: null, debts: [],
        hasInsurance: null, insurancePolicies: [],
    });

    const TOTAL_STEPS = 9;

    const updateData = (field: keyof OnboardingData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        setDirection('forward');
        let nextStep = step + 1;
        if (step === 3 && data.hasEmergencyFund === 'No') nextStep++; // Skip emergency fund amount
        if (step === 5 && data.invests === 'No') nextStep++; // This was flawed, but let's correct it based on what seems to be intended. Assuming it skips details.
        if (step === 6 && data.hasDebts === 'No') nextStep++; // Skip debt details
        if (step === 7 && data.hasInsurance === 'No') nextStep++; // Skip insurance details
        setStep(nextStep);
    };

    const handleBack = () => {
        setDirection('backward');
        let prevStep = step - 1;
        if (step === 5 && data.hasEmergencyFund === 'No') prevStep--; // Skip back over emergency fund amount
        if (step === 7 && data.invests === 'No') prevStep--;
        if (step === 8 && data.hasDebts === 'No') prevStep--;
        setStep(prevStep);
    };
    
    const handleComplete = () => {
        setStep(TOTAL_STEPS);
        setTimeout(() => onComplete(data), 4000); // 4 second animation
    }
    
    const isNextDisabled = useMemo(() => {
        const isNumInvalid = (num: number) => isNaN(num) || num <= 0;
        
        switch(step) {
            case 0: return !data.name.trim();
            case 1: return isNumInvalid(data.age);
            case 2: return isNumInvalid(data.monthlyIncome) || isNumInvalid(data.monthlyExpense);
            case 3: return data.hasEmergencyFund === null;
            case 4: return data.hasEmergencyFund === 'Yes' && isNumInvalid(data.emergencyFundAmount);
            case 5: return data.invests === null || (data.invests === 'Yes' && (isNumInvalid(data.totalInvestmentAmount) || data.investmentAssets.length === 0 || !data.riskLevel));
            case 6: return data.hasDebts === null || (data.hasDebts === 'Yes' && (data.debts.length === 0 || !data.debts[0].type || isNumInvalid(data.debts[0].outstandingAmount) || isNumInvalid(data.debts[0].interestRate) || (isNumInvalid(data.debts[0].emi) && isNumInvalid(data.debts[0].tenure)) ));
            case 7: return data.hasInsurance === null || (data.hasInsurance === 'Yes' && (data.insurancePolicies.length === 0 || !data.insurancePolicies[0].type || isNumInvalid(data.insurancePolicies[0].coverage) || isNumInvalid(data.insurancePolicies[0].premium) || !data.insurancePolicies[0].renewalDate));
            case 8: return false; // "Almost there" step
            default: return false;
        }
    }, [step, data]);
    
    const emergencyFundProgress = useMemo(() => {
        if (!data.monthlyExpense || data.monthlyExpense === 0) return 0;
        const target = data.monthlyExpense * 6;
        if (target === 0) return 0;
        return (data.emergencyFundAmount / target) * 100;
    }, [data.emergencyFundAmount, data.monthlyExpense]);

    if (step === -1) return <WelcomeAnimation onFinished={() => setStep(0)} />;
    if (step >= TOTAL_STEPS) return <AnalyzingAnimation user={data} />;

    return (
        <div className="h-full flex flex-col bg-[#0A0A0A] text-gray-200 relative overflow-hidden p-6">
            <div className="absolute inset-0 z-0 opacity-10" 
                 style={{
                     backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
                     backgroundSize: '40px 40px'
                 }} 
            />
            <div className="absolute inset-0 z-0" style={{background: 'radial-gradient(ellipse at center, transparent 0%, #0A0A0A 80%)'}}></div>
            
            <StepIndicator currentStep={step + 1} totalSteps={TOTAL_STEPS} />
            
            <div className="flex-1 relative mt-12 z-10">
                {step === 0 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">Welcome! Let's start with your name.</h2>
                    <div className="space-y-4 mt-6">
                        <PremiumInput label="What should we call you?" value={data.name} onChange={e => updateData('name', e.target.value)} placeholder="e.g., Aarav" />
                    </div>
                    <OnboardingNavigation onBack={() => {}} onNext={handleNext} backDisabled nextDisabled={isNextDisabled} />
                </OnboardingQuestion>}
                
                {step === 1 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">How old are you?</h2>
                    <div className="space-y-4 mt-6">
                         <PremiumInput label="Your age" type="number" value={data.age || ''} onChange={e => updateData('age', parseInt(e.target.value) || 0)} placeholder="e.g., 25" />
                    </div>
                    <OnboardingNavigation onBack={handleBack} onNext={handleNext} nextDisabled={isNextDisabled} />
                </OnboardingQuestion>}
                
                {step === 2 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">Let's talk about your finances.</h2>
                    <div className="space-y-4 mt-6">
                        <PremiumInput label="What’s your monthly income?" type="number" value={data.monthlyIncome || ''} onChange={e => updateData('monthlyIncome', parseFloat(e.target.value) || 0)} placeholder="e.g., 80000" />
                        <PremiumInput label="What’s your average monthly expense?" type="number" value={data.monthlyExpense || ''} onChange={e => updateData('monthlyExpense', parseFloat(e.target.value) || 0)} placeholder="e.g., 45000" />
                    </div>
                    <OnboardingNavigation onBack={handleBack} onNext={handleNext} nextDisabled={isNextDisabled} />
                </OnboardingQuestion>}

                {step === 3 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">Do you have an emergency fund?</h2>
                    <p className="text-gray-400 mt-1">This is a crucial first step for financial security.</p>
                    <div className="space-y-4 mt-8">
                        <PremiumToggle options={['Yes', 'No']} value={data.hasEmergencyFund} onSelect={val => updateData('hasEmergencyFund', val as 'Yes' | 'No')} label="" />
                    </div>
                    <OnboardingNavigation onBack={handleBack} onNext={handleNext} nextDisabled={isNextDisabled} />
                </OnboardingQuestion>}
                
                {step === 4 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">Your Emergency Fund Status</h2>
                     <div className="flex flex-col items-center mt-6 space-y-4">
                        <div className="relative w-40 h-40">
                           <ProgressRing progress={emergencyFundProgress} size={160} strokeWidth={12} />
                           <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">{Math.round(emergencyFundProgress)}%</div>
                        </div>
                        <PremiumInput label="Current Amount" type="number" value={data.emergencyFundAmount || ''} onChange={e => updateData('emergencyFundAmount', parseFloat(e.target.value))} placeholder="e.g., 100000" className="mt-4" />
                        <p className="text-sm text-gray-400 -mt-2">Recommended: ₹{(data.monthlyExpense * 6).toLocaleString()} | Remaining: ₹{Math.max(0, data.monthlyExpense * 6 - data.emergencyFundAmount).toLocaleString()}</p>
                        <PremiumSlider label="Target Growth Rate p.a." value={data.emergencyFundGrowthRate} onUpdate={val => updateData('emergencyFundGrowthRate', val)} min={0} max={15} suffix="%" />
                    </div>
                    <OnboardingNavigation onBack={handleBack} onNext={handleNext} nextDisabled={isNextDisabled} />
                </OnboardingQuestion>}

                {step === 5 && <OnboardingQuestion animationKey={step} direction={direction}>
                     <h2 className="text-2xl font-bold">Do you have any savings or investments?</h2>
                     <p className="text-gray-400 mt-1">(Other than your emergency fund)</p>
                     <div className="space-y-4 mt-6">
                         <PremiumToggle options={['Yes', 'No']} value={data.invests} onSelect={val => updateData('invests', val as 'Yes' | 'No')} label="" />
                         {data.invests === 'Yes' ? (
                             <div className="space-y-4 animate-fade-in max-h-[45vh] overflow-y-auto no-scrollbar pr-2">
                                <PremiumInput label="Total invested/saved amount (approx.)" type="number" value={data.totalInvestmentAmount || ''} onChange={e => updateData('totalInvestmentAmount', parseFloat(e.target.value) || 0)} placeholder="e.g., 500000"/>
                                <MultiSelect options={['Stocks', 'Mutual Funds', 'Gold', 'Crypto', 'Bonds', 'Other']} selected={data.investmentAssets} onSelect={val => {
                                    const assets = data.investmentAssets.includes(val) ? data.investmentAssets.filter(a => a !== val) : [...data.investmentAssets, val as InvestmentCategory];
                                    updateData('investmentAssets', assets);
                                }}/>
                                <PremiumInput label="Average annual return (optional)" type="number" value={data.expectedReturn as number || ''} onChange={e => updateData('expectedReturn', parseFloat(e.target.value) || null)} placeholder="e.g., 12%"/>
                                <PremiumSelect label="Your Risk Level" value={data.riskLevel || ''} onChange={e => updateData('riskLevel', e.target.value as any)}><option value="">Select...</option><option>Low</option><option>Medium</option><option>High</option></PremiumSelect>
                                {(data.totalInvestmentAmount > 0) && <SavingsSummaryCard amount={data.totalInvestmentAmount} returnRate={data.expectedReturn} />}
                            </div>
                         ) : data.invests === 'No' && (
                             <div className="mt-6 p-4 rounded-2xl bg-black/30 border border-green-500/30 animate-fade-in flex items-center gap-4">
                                <GrowwIcon className="w-12 h-12 flex-shrink-0" />
                                <div>
                                     <h3 className="font-bold text-green-300">Start with Groww</h3>
                                     <p className="text-sm text-gray-300">Simple, trusted, and fast. Zero commission investing.</p>
                                </div>
                            </div>
                         )}
                     </div>
                     <OnboardingNavigation onBack={handleBack} onNext={handleNext} nextDisabled={isNextDisabled} />
                </OnboardingQuestion>}

                {step === 6 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">Do you have any loans or debts?</h2>
                    <div className="space-y-4 mt-6">
                        <PremiumToggle options={['Yes', 'No']} value={data.hasDebts} onSelect={(val) => {
                           if (val === 'Yes' && data.debts.length === 0) {
                               setData(prev => ({...prev, hasDebts: 'Yes', debts: [{type: '' as any, outstandingAmount: 0, interestRate: 0, emi: 0, tenure: 0}]}));
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
                    <OnboardingNavigation onBack={handleBack} onNext={handleNext} nextDisabled={isNextDisabled} />
                </OnboardingQuestion>}

                {step === 7 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">Do you have insurance?</h2>
                    <div className="space-y-4 mt-6">
                       <PremiumToggle options={['Yes', 'No']} value={data.hasInsurance} onSelect={(val) => {
                           if (val === 'Yes' && data.insurancePolicies.length === 0) {
                               setData(prev => ({...prev, hasInsurance: 'Yes', insurancePolicies: [{type: '' as any, coverage: 0, premium: 0, renewalDate: ''}]}));
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
                    <OnboardingNavigation onBack={handleBack} onNext={handleNext} nextDisabled={isNextDisabled} />
                </OnboardingQuestion>}

                {step === 8 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <div className="text-center flex flex-col items-center justify-center h-full">
                        <span className="text-6xl mb-4">🎉</span>
                        <h2 className="text-3xl font-bold">You're all set, {data.name}!</h2>
                        <p className="text-gray-400 mt-2">Click below to generate your personalized financial dashboard.</p>
                    </div>
                    <OnboardingNavigation onBack={handleBack} onNext={handleComplete} isLastStep nextDisabled={isNextDisabled} />
                </OnboardingQuestion>}
                
            </div>
        </div>
    );
};

export default OnboardingScreen;