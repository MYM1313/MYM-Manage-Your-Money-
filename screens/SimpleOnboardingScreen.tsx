import React, { useState, FC } from 'react';
import { User, OnboardingData, InvestmentCategory, DebtType, InsuranceType } from '../types';

// These components would typically be in their own files
const OnboardingQuestion: FC<{ children: React.ReactNode; animationKey: number; direction: 'forward' | 'backward' }> = ({ children, animationKey, direction }) => {
    // A simplified animation handler for demonstration
    const animationClass = direction === 'forward' ? 'animate-slide-in-right-fade' : 'animate-slide-in-left-fade';
    return (
        <div key={animationKey} className={`absolute inset-0 p-6 flex flex-col justify-center ${animationClass}`}>
            {children}
        </div>
    );
};
const OnboardingNavigation: FC<{ onBack: () => void; onNext: () => void; backDisabled?: boolean; nextDisabled?: boolean; isLastStep?: boolean; onComplete?: () => void; }> = ({ onBack, onNext, backDisabled, nextDisabled, isLastStep, onComplete }) => (
    <div className="flex justify-between mt-auto pt-6">
        <button onClick={onBack} disabled={backDisabled} className="px-8 py-3 bg-white/10 rounded-xl text-base font-semibold disabled:opacity-50 transition-all hover:bg-white/20 active:scale-95">Back</button>
        {isLastStep ? (
            <button onClick={onComplete} disabled={nextDisabled} className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-base font-semibold disabled:opacity-50 transition-all shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95">Complete Setup</button>
        ) : (
            <button onClick={onNext} disabled={nextDisabled} className="px-8 py-3 bg-slate-600 rounded-xl text-base font-semibold disabled:opacity-50 transition-all shadow-lg shadow-slate-600/20 hover:enabled:bg-slate-500 hover:scale-105 active:scale-95">Next</button>
        )}
    </div>
);

const PremiumInput: FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <input {...props} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mt-1 text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all placeholder:text-gray-500" />
    </div>
);

const PremiumToggle: FC<{ options: string[]; value: string | null; onSelect: (val: string) => void }> = ({ options, value, onSelect }) => (
    <div className="flex gap-4">
        {options.map(opt => (
            <button key={opt} onClick={() => onSelect(opt)} className={`flex-1 p-4 rounded-xl text-lg transition-all ${value === opt ? 'bg-sky-500 text-white shadow-lg' : 'bg-white/10'}`}>{opt}</button>
        ))}
    </div>
);

export interface OnboardingResult {
    user: User;
    data: OnboardingData;
    financials?: any;
}

interface SimpleOnboardingScreenProps {
    onComplete: (result: OnboardingResult) => void;
    initialUser: User;
}

const SimpleOnboardingScreen: FC<SimpleOnboardingScreenProps> = ({ onComplete, initialUser }) => {
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
    const [data, setData] = useState<Partial<OnboardingData>>({
        name: initialUser.name,
        age: 0,
        monthlyIncome: 0,
        monthlyExpense: 0,
        invests: null,
        hasDebts: null,
        hasInsurance: null,
        debts: [],
        insurancePolicies: [],
    });

    const TOTAL_STEPS = 7;

    const updateData = (field: keyof OnboardingData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        setDirection('forward');
        let nextStep = step + 1;
        
        if (step === 3 && data.invests === 'No') nextStep++; 
        if (step === 4 && data.hasDebts === 'No') nextStep++; 
        if (step === 5 && data.hasInsurance === 'No') nextStep++;

        if (nextStep >= TOTAL_STEPS) handleComplete();
        else setStep(nextStep);
    };

    const handleBack = () => {
        setDirection('backward');
        let prevStep = step - 1;

        if (step === 5 && data.invests === 'No') prevStep--;
        if (step === 6 && data.hasDebts === 'No') prevStep--;

        setStep(prevStep);
    };
    
    const handleComplete = () => {
        onComplete({
            user: { ...initialUser, name: data.name || initialUser.name, age: data.age },
            data: data as OnboardingData,
        });
    };

    const isNextDisabled = (currentStep: number): boolean => {
        switch (currentStep) {
            case 0: return !data.name?.trim();
            case 1: return !data.age || data.age <= 0;
            case 2: return !data.monthlyIncome || data.monthlyIncome <= 0 || !data.monthlyExpense;
            case 3: return data.invests === null;
            case 4: return data.hasDebts === null;
            case 5: return data.hasInsurance === null;
            default: return false;
        }
    };
    
    const navProps = { onBack: handleBack, onNext: handleNext, backDisabled: step === 0, nextDisabled: isNextDisabled(step), isLastStep: step === TOTAL_STEPS - 1, onComplete: handleComplete };

    return (
        <div className="h-screen flex flex-col bg-[#0A0A0A] text-gray-200 relative overflow-hidden p-6">
            <div className="absolute top-6 left-6 right-6 z-10">
                <p className="text-sm font-semibold text-sky-400">Step {step + 1} of {TOTAL_STEPS}</p>
                <div className="w-full bg-white/10 rounded-full h-1 mt-1.5"><div className="bg-sky-400 h-1 rounded-full transition-all duration-500" style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}></div></div>
            </div>
            <div className="flex-1 relative mt-12 z-10">
                {step === 0 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">Welcome, {initialUser.name}! Let's get you set up.</h2>
                    <p className="text-gray-400 mt-1">First, please confirm your name.</p>
                    <div className="space-y-4 mt-6"><PremiumInput label="Your Name" value={data.name} onChange={e => updateData('name', e.target.value)} /></div>
                    <OnboardingNavigation {...navProps} backDisabled={true} />
                </OnboardingQuestion>}

                {step === 1 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">What's your age?</h2>
                    <div className="space-y-4 mt-6"><PremiumInput label="Age" type="number" value={data.age || ''} onChange={e => updateData('age', parseInt(e.target.value))} /></div>
                    <OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}

                {step === 2 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">What are your monthly finances?</h2>
                    <div className="space-y-4 mt-6">
                        <PremiumInput label="Income (Take-home)" type="number" value={data.monthlyIncome || ''} onChange={e => updateData('monthlyIncome', parseFloat(e.target.value))} />
                        <PremiumInput label="Expenses (Estimate)" type="number" value={data.monthlyExpense || ''} onChange={e => updateData('monthlyExpense', parseFloat(e.target.value))} />
                    </div>
                    <OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}

                {step === 3 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">Do you invest your money?</h2>
                    <div className="space-y-4 mt-6">
                        <PremiumToggle options={['Yes', 'No']} value={data.invests} onSelect={val => updateData('invests', val as 'Yes' | 'No')} />
                        {data.invests === 'Yes' && <div className="space-y-4 animate-fade-in">
                            <PremiumInput label="Total Investment Amount (approx.)" type="number" value={data.totalInvestmentAmount || ''} onChange={e => updateData('totalInvestmentAmount', parseFloat(e.target.value) || 0)} />
                            <PremiumInput label="Primary Investment Location" value={data.investmentLocation || ''} onChange={e => updateData('investmentLocation', e.target.value as InvestmentCategory)} />
                        </div>}
                    </div>
                    <OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}
                
                 {step === 4 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">Do you have any debts? (e.g., Loans, Credit Card)</h2>
                    <div className="space-y-4 mt-6">
                        <PremiumToggle options={['Yes', 'No']} value={data.hasDebts} onSelect={val => updateData('hasDebts', val as 'Yes' | 'No')} />
                    </div>
                    <OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}

                {step === 5 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <h2 className="text-2xl font-bold">Do you have any insurance?</h2>
                    <div className="space-y-4 mt-6">
                        <PremiumToggle options={['Yes', 'No']} value={data.hasInsurance} onSelect={val => updateData('hasInsurance', val as 'Yes' | 'No')} />
                    </div>
                    <OnboardingNavigation {...navProps} />
                </OnboardingQuestion>}

                {step === 6 && <OnboardingQuestion animationKey={step} direction={direction}>
                    <div className="text-center flex flex-col items-center justify-center h-full">
                        <span className="text-6xl mb-4">🎉</span>
                        <h2 className="text-3xl font-bold">That's it, {data.name}!</h2>
                        <p className="text-gray-400 mt-2">Click below to generate your personalized financial dashboard.</p>
                    </div>
                    <OnboardingNavigation {...navProps} isLastStep={true} />
                </OnboardingQuestion>}
            </div>
        </div>
    );
};

export default SimpleOnboardingScreen;
