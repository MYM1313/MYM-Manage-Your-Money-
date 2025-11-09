import React, { useState, useContext, FC, useRef } from 'react';
import { FinancialContext } from '../../App';
import OnboardingQuestion from './OnboardingQuestion';
import { Investment, InvestmentCategory, InvestmentOnboardingData, InvestmentRiskProfile } from '../../types';

const OnboardingNavigation: FC<{ onBack: () => void; onNext: () => void; backDisabled?: boolean; nextDisabled?: boolean; isLastStep?: boolean; onComplete?: () => void; }> = ({ onBack, onNext, backDisabled, nextDisabled, isLastStep, onComplete }) => (
    <div className="flex justify-between mt-auto pt-6">
        <button onClick={onBack} disabled={backDisabled} className="px-8 py-3 bg-white/10 rounded-xl text-base font-semibold disabled:opacity-50 transition-all hover:bg-white/20 active:scale-95">Back</button>
        {isLastStep ? (
            <button onClick={onComplete} disabled={nextDisabled} className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-base font-semibold disabled:opacity-50 transition-all shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95">Complete Setup</button>
        ) : (
            <button onClick={onNext} disabled={nextDisabled} className="px-8 py-3 bg-sky-500 rounded-xl text-base font-semibold disabled:opacity-50 transition-all shadow-lg shadow-sky-500/20 hover:scale-105 active:scale-95">Next</button>
        )}
    </div>
);

const PremiumInput: FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, ...props }) => (
    <div>
        {label && <label className="text-sm font-medium text-gray-400">{label}</label>}
        <input {...props} className={`w-full bg-black/30 border border-gray-700 rounded-xl p-3 ${label ? 'mt-1' : ''} text-base text-gray-200 focus:ring-2 focus:ring-sky-500 transition placeholder:text-gray-500`} />
    </div>
);

const InvestingOnboarding: FC = () => {
    const { investmentOnboardingData, setInvestmentOnboardingData, completeInvestingOnboarding } = useContext(FinancialContext);
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

    const TOTAL_STEPS = 6;

    const handleNext = () => {
        if (step === 0 && !investmentOnboardingData.hasInvestedBefore) {
            setDirection('forward');
            setStep(s => s + 2); // Skip asset questions
        } else {
            setDirection('forward');
            setStep(s => Math.min(s + 1, TOTAL_STEPS));
        }
    };
    
    const handleBack = () => {
        if (step === 2 && !investmentOnboardingData.hasInvestedBefore) {
            setDirection('backward');
            setStep(s => s - 2);
        } else {
            setDirection('backward');
            setStep(s => Math.max(s - 1, 0));
        }
    };
    
    const updateData = (field: keyof InvestmentOnboardingData, value: any) => {
        setInvestmentOnboardingData(prev => ({ ...prev, [field]: value }));
    };

    const handleComplete = () => {
        const investmentsFromOnboarding: Investment[] = investmentOnboardingData.assets.map(asset => ({
            id: `onboarding-${asset.type}-${Math.random()}`,
            name: `${asset.type} Holding`,
            value: asset.amount,
            change: 0,
            changeType: 'increase',
            category: asset.type as InvestmentCategory,
            reason: asset.reason,
            confidence: asset.confidence >= 7 ? 'High' : asset.confidence >= 4 ? 'Medium' : 'Low',
            riskProfile: investmentOnboardingData.riskAppetite || undefined,
        }));
        completeInvestingOnboarding(investmentsFromOnboarding);
    };

    const isNextDisabled = (currentStep: number): boolean => {
        const d = investmentOnboardingData;
        switch(currentStep) {
            case 0: return d.hasInvestedBefore === null;
            case 1: return d.assets.length === 0 || d.assets.some(a => a.amount <= 0);
            case 2: return d.riskAppetite === null;
            case 3: return d.investmentConfidence === null;
            case 4: return d.investmentFrequency === null;
            default: return false;
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#0D1117] text-gray-200 relative overflow-hidden p-6">
            <div className="absolute top-6 left-6 right-6 z-10">
                <p className="text-sm font-semibold text-sky-400">Question {step + 1} of {TOTAL_STEPS}</p>
                <div className="w-full bg-white/10 rounded-full h-1 mt-1">
                    <div className="bg-sky-400 h-1 rounded-full transition-all duration-500" style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}></div>
                </div>
            </div>

            <div className="flex-1 relative mt-12">
                {step === 0 && (
                    <OnboardingQuestion animationKey={step} direction={direction}>
                        <h2 className="text-3xl font-bold">Have you ever invested before?</h2>
                        <div className="space-y-4 mt-8">
                            <button onClick={() => updateData('hasInvestedBefore', true)} className={`w-full p-4 rounded-xl text-lg transition-all ${investmentOnboardingData.hasInvestedBefore === true ? 'bg-sky-500 text-white shadow-lg' : 'bg-white/10'}`}>Yes, I have</button>
                            <button onClick={() => updateData('hasInvestedBefore', false)} className={`w-full p-4 rounded-xl text-lg transition-all ${investmentOnboardingData.hasInvestedBefore === false ? 'bg-sky-500 text-white shadow-lg' : 'bg-white/10'}`}>No, I'm new</button>
                        </div>
                        <OnboardingNavigation onBack={handleBack} onNext={handleNext} backDisabled nextDisabled={isNextDisabled(step)} />
                    </OnboardingQuestion>
                )}
                {step === 1 && (
                    <OnboardingQuestion animationKey={step} direction={direction}>
                        <h2 className="text-2xl font-bold">What assets do you hold and how much?</h2>
                        <div className="space-y-3 mt-4 overflow-y-auto max-h-[50vh] no-scrollbar -mx-2 px-2">
                             {(['Stocks', 'ETFs', 'Bonds', 'Gold', 'Crypto', 'Global'] as InvestmentCategory[]).map(cat => {
                                const asset = investmentOnboardingData.assets.find(a => a.type === cat);
                                return (
                                    <div key={cat} className="bg-black/30 p-3 rounded-lg">
                                        <label className="flex items-center space-x-3">
                                            <input type="checkbox" checked={!!asset} onChange={e => {
                                                if (e.target.checked) updateData('assets', [...investmentOnboardingData.assets, {type: cat, amount: 0, reason: '', confidence: 5}]);
                                                else updateData('assets', investmentOnboardingData.assets.filter(a => a.type !== cat));
                                            }} className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-sky-500 focus:ring-sky-500"/>
                                            <span className="font-semibold">{cat}</span>
                                        </label>
                                        {asset && (
                                            <div className="pl-8 mt-3 space-y-3 animate-fade-in">
                                                <PremiumInput type="number" value={asset.amount || ''} onChange={e => updateData('assets', investmentOnboardingData.assets.map(a => a.type === cat ? {...a, amount: parseFloat(e.target.value) || 0} : a))} placeholder="Amount in ₹" />
                                                <PremiumInput type="text" value={asset.reason || ''} onChange={e => updateData('assets', investmentOnboardingData.assets.map(a => a.type === cat ? {...a, reason: e.target.value} : a))} placeholder="Reason for investing (e.g., long-term growth)" />
                                                <div>
                                                    <label className="text-sm font-medium text-gray-400">Confidence (1-10): <span className="font-bold text-sky-300">{asset.confidence}</span></label>
                                                    <input type="range" min="1" max="10" value={asset.confidence || 5} onChange={e => updateData('assets', investmentOnboardingData.assets.map(a => a.type === cat ? {...a, confidence: parseInt(e.target.value)} : a))} className="w-full mt-1" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                             })}
                        </div>
                        <OnboardingNavigation onBack={handleBack} onNext={handleNext} nextDisabled={isNextDisabled(step)} />
                    </OnboardingQuestion>
                )}
                {step === 2 && (
                     <OnboardingQuestion animationKey={step} direction={direction}>
                        <h2 className="text-3xl font-bold">What is your risk appetite?</h2>
                        <div className="space-y-4 mt-6">
                            <button onClick={() => updateData('riskAppetite', 'Low')} className={`w-full p-4 bg-white/10 rounded-lg text-left transition-all ${investmentOnboardingData.riskAppetite === 'Low' ? 'ring-2 ring-sky-400' : ''}`}>Low - I prefer safety and stable returns.</button>
                            <button onClick={() => updateData('riskAppetite', 'Medium')} className={`w-full p-4 bg-white/10 rounded-lg text-left transition-all ${investmentOnboardingData.riskAppetite === 'Medium' ? 'ring-2 ring-sky-400' : ''}`}>Medium - I'm willing to take some risks for better returns.</button>
                            <button onClick={() => updateData('riskAppetite', 'High')} className={`w-full p-4 bg-white/10 rounded-lg text-left transition-all ${investmentOnboardingData.riskAppetite === 'High' ? 'ring-2 ring-sky-400' : ''}`}>High - I'm comfortable with volatility for high growth potential.</button>
                        </div>
                        <OnboardingNavigation onBack={handleBack} onNext={handleNext} nextDisabled={isNextDisabled(step)}/>
                    </OnboardingQuestion>
                )}
                 {step === 3 && (
                     <OnboardingQuestion animationKey={step} direction={direction}>
                        <h2 className="text-3xl font-bold">How confident are you in your investment decisions? (1-10)</h2>
                        <div className="mt-8">
                             <input type="range" min="1" max="10" value={investmentOnboardingData.investmentConfidence || 5} onChange={e => updateData('investmentConfidence', parseInt(e.target.value))} className="w-full" />
                             <p className="text-center text-4xl font-bold mt-4">{investmentOnboardingData.investmentConfidence || 5}</p>
                        </div>
                        <OnboardingNavigation onBack={handleBack} onNext={handleNext} nextDisabled={isNextDisabled(step)} />
                    </OnboardingQuestion>
                )}
                 {step === 4 && (
                     <OnboardingQuestion animationKey={step} direction={direction}>
                        <h2 className="text-3xl font-bold">How often do you invest?</h2>
                        <div className="space-y-4 mt-6">
                             <button onClick={() => updateData('investmentFrequency', 'One-time')} className={`w-full p-4 bg-white/10 rounded-lg text-left transition-all ${investmentOnboardingData.investmentFrequency === 'One-time' ? 'ring-2 ring-sky-400' : ''}`}>One-time lumpsums</button>
                             <button onClick={() => updateData('investmentFrequency', 'Monthly')} className={`w-full p-4 bg-white/10 rounded-lg text-left transition-all ${investmentOnboardingData.investmentFrequency === 'Monthly' ? 'ring-2 ring-sky-400' : ''}`}>Monthly (SIPs)</button>
                             <button onClick={() => updateData('investmentFrequency', 'Periodic')} className={`w-full p-4 bg-white/10 rounded-lg text-left transition-all ${investmentOnboardingData.investmentFrequency === 'Periodic' ? 'ring-2 ring-sky-400' : ''}`}>Periodically, when I have funds</button>
                        </div>
                        <OnboardingNavigation onBack={handleBack} onNext={handleNext} nextDisabled={isNextDisabled(step)} />
                    </OnboardingQuestion>
                )}
                {step === 5 && (
                     <OnboardingQuestion animationKey={step} direction={direction}>
                        <h2 className="text-3xl font-bold">You're all set!</h2>
                        <p className="text-lg text-gray-400 mt-2">We'll use this information to personalize your investment dashboard.</p>
                        <OnboardingNavigation onBack={handleBack} onNext={()=>{}} isLastStep={true} onComplete={handleComplete} nextDisabled={isNextDisabled(step)} />
                    </OnboardingQuestion>
                )}
            </div>
        </div>
    );
};
export default InvestingOnboarding;