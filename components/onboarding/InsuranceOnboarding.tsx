import React, { useState, useContext, FC, useRef } from 'react';
import { FinancialContext } from '../../App';
import { InsuranceOnboardingData, InsurancePolicyOnboarding } from '../../types';
import OnboardingQuestion from './OnboardingQuestion';
import GlassmorphicPanel from '../shared/Card';
import AIPlanAnimationOverlay from './AIPlanAnimationOverlay';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';

const OnboardingNavigation: FC<{ onBack: () => void; onNext: () => void; backDisabled?: boolean; nextDisabled?: boolean; isLastStep?: boolean; onComplete?: () => void; }> = ({ onBack, onNext, backDisabled, nextDisabled, isLastStep, onComplete }) => (
    <div className="flex justify-between mt-auto pt-6">
        <button onClick={onBack} disabled={backDisabled} className="px-8 py-3 bg-white/10 rounded-xl text-base font-semibold disabled:opacity-50 transition-all hover:bg-white/20 active:scale-95">Back</button>
        {isLastStep ? (
            <button onClick={onComplete} disabled={nextDisabled} className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-base font-semibold disabled:opacity-50 transition-all shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95">Finish</button>
        ) : (
            <button onClick={onNext} disabled={nextDisabled} className="px-8 py-3 bg-sky-500 rounded-xl text-base font-semibold disabled:opacity-50 transition-all shadow-lg shadow-sky-500/20 hover:scale-105 active:scale-95">Next</button>
        )}
    </div>
);

const PremiumInput: FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <input {...props} className="w-full bg-black/30 border border-gray-700 rounded-xl p-3 mt-1 text-base text-gray-200 focus:ring-2 focus:ring-sky-500 transition placeholder:text-gray-500" />
    </div>
);

const PremiumSelect: FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
    <div>
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <select {...props} className="w-full bg-black/30 border border-gray-700 rounded-xl p-3 mt-1 text-base text-gray-200 focus:ring-2 focus:ring-sky-500 transition">
            {children}
        </select>
    </div>
);

const PremiumToggle: FC<{ label: string; options: [string, string]; value: any; onSelect: (val: any) => void }> = ({ label, options, value, onSelect }) => (
    <div>
        <p className="text-sm font-medium text-gray-400 mb-2">{label}</p>
        <div className="flex gap-2 bg-black/30 p-1 rounded-xl">
            <button onClick={() => onSelect(options[0])} className={`flex-1 p-2 rounded-lg text-sm font-semibold transition-all ${value === options[0] ? 'bg-sky-500 text-white' : 'bg-transparent text-gray-300'}`}>{options[0]}</button>
            <button onClick={() => onSelect(options[1])} className={`flex-1 p-2 rounded-lg text-sm font-semibold transition-all ${value === options[1] ? 'bg-sky-500 text-white' : 'bg-transparent text-gray-300'}`}>{options[1]}</button>
        </div>
    </div>
);

const InsuranceOnboarding: FC = () => {
    const { insuranceOnboardingData, setInsuranceOnboardingData, completeInsuranceOnboarding } = useContext(FinancialContext);
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

    const TOTAL_STEPS = 7;

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const touchStartY = useRef(0);
    const touchEndY = useRef(0);

    const handleNext = () => {
        if (step === 0 && insuranceOnboardingData.hasExistingInsurance === false) {
             setDirection('forward');
             setStep(s => s + 2); // Skip step 1 (policy details)
        } else {
            setDirection('forward');
            setStep(s => Math.min(s + 1, TOTAL_STEPS - 1));
        }
    };
    const handleBack = () => {
        if (step === 2 && insuranceOnboardingData.hasExistingInsurance === false) {
             setDirection('backward');
             setStep(s => s - 2); // Skip back over step 1
        } else {
            setDirection('backward');
            setStep(s => Math.max(s - 1, 0));
        }
    };
    
    const handleSwipe = () => {
        const xDiff = touchStartX.current - touchEndX.current;
        const yDiff = touchStartY.current - touchEndY.current;
        if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 50) { // Horizontal swipe
            if (xDiff > 0 && !isNextDisabled(step)) handleNext();
            else if (xDiff < 0 && step > 0) handleBack();
        } else if (Math.abs(yDiff) > Math.abs(xDiff) && yDiff < -50) { // Downward swipe
             if (step === 0 && insuranceOnboardingData.hasExistingInsurance) setExpanded(e => ({ ...e, step0: true }));
             if (step === 4 && insuranceOnboardingData.hasMajorHealthConditions) setExpanded(e => ({ ...e, step4: true }));
             if (step === 6 && insuranceOnboardingData.claimedInsurance) setExpanded(e => ({...e, step6: true}));
        }
    };

    const updateData = (field: keyof InsuranceOnboardingData, value: any) => {
        setInsuranceOnboardingData(prev => ({ ...prev, [field]: value }));
    };

    const updatePolicy = (index: number, field: keyof InsurancePolicyOnboarding, value: any) => {
        const newPolicies = [...insuranceOnboardingData.existingPolicies];
        newPolicies[index] = { ...newPolicies[index], [field]: value };
        updateData('existingPolicies', newPolicies);
    };

    const addPolicy = () => {
        const newPolicy: InsurancePolicyOnboarding = { type: 'Health', provider: '', premium: 0, coverage: 0, renewalDate: '', dependentsCovered: 0 };
        updateData('existingPolicies', [...insuranceOnboardingData.existingPolicies, newPolicy]);
    };
    
    const isNextDisabled = (currentStep: number): boolean => {
        const d = insuranceOnboardingData;
        switch (currentStep) {
            case 0: return d.hasExistingInsurance === null;
            case 1: return d.existingPolicies.some(p => !p.provider || !p.coverage || p.coverage <= 0);
            case 2: return !d.fullName || !d.age || !d.maritalStatus || !d.employmentType || !d.lifestyleSmoker;
            case 3: return !d.income || !d.monthlyExpenses || !d.insuranceBudget;
            case 4: return d.riskAppetite === null || d.hasMajorHealthConditions === null || d.preferredCoverageType === null || d.willingnessForCheckup === null;
            case 5: return d.mainGoal === null || !d.desiredCoverage || !d.priorityOfProtection;
            case 6: return d.claimedInsurance === null || d.preferredPolicyDuration === null || d.tipsFrequency === null || d.guidanceStyle === null || d.preferredRecommendationSource === null || d.willingnessToAdjust === null;
            default: return true;
        }
    };

    if (isGeneratingPlan) {
        return <AIPlanAnimationOverlay onComplete={completeInsuranceOnboarding} />;
    }

    return (
        <div 
            className="h-full flex flex-col bg-gradient-to-b from-[#10141b] to-[#0D1117] text-gray-200 relative overflow-hidden p-6"
            onTouchStart={e => { touchStartX.current = e.targetTouches[0].clientX; touchStartY.current = e.targetTouches[0].clientY; }}
            onTouchMove={e => { touchEndX.current = e.targetTouches[0].clientX; touchEndY.current = e.targetTouches[0].clientY; }}
            onTouchEnd={handleSwipe}
        >
            <div className="absolute top-6 left-6 right-6 z-10">
                <p className="text-sm font-semibold text-sky-400">Step {step + 1} of {TOTAL_STEPS}</p>
                <div className="w-full bg-white/10 rounded-full h-1 mt-1.5">
                    <div className="bg-sky-400 h-1 rounded-full transition-all duration-500" style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}></div>
                </div>
            </div>

            <div className="flex-1 relative mt-16">
                {step === 0 && (
                    <OnboardingQuestion animationKey={step} direction={direction}>
                        <h2 className="text-2xl font-bold">Do you currently have Health, Life, or Term insurance?</h2>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => updateData('hasExistingInsurance', true)} className={`flex-1 p-4 rounded-xl text-lg transition-all ${insuranceOnboardingData.hasExistingInsurance === true ? 'bg-sky-500 text-white shadow-lg' : 'bg-white/10'}`}>Yes</button>
                            <button onClick={() => updateData('hasExistingInsurance', false)} className={`flex-1 p-4 rounded-xl text-lg transition-all ${insuranceOnboardingData.hasExistingInsurance === false ? 'bg-sky-500 text-white shadow-lg' : 'bg-white/10'}`}>No</button>
                        </div>
                        {insuranceOnboardingData.hasExistingInsurance && <div className="text-center text-sky-300 mt-6 animate-pulse flex items-center justify-center space-x-2"><ChevronDownIcon /><span>Swipe down to add details</span><ChevronDownIcon /></div>}
                        {expanded.step0 && <p className="text-center text-green-400 mt-4 animate-fade-in">Details expanded below. Swipe right when done.</p>}
                        <OnboardingNavigation onBack={handleBack} onNext={handleNext} backDisabled={step === 0} nextDisabled={isNextDisabled(step)} />
                    </OnboardingQuestion>
                )}
                
                {step === 1 && (
                    <OnboardingQuestion animationKey={step} direction={direction}>
                        <h2 className="text-xl font-bold">Enter Your Existing Policy Details</h2>
                         <div className="space-y-3 mt-4 overflow-y-auto max-h-[50vh] no-scrollbar -mx-2 px-2">
                            {insuranceOnboardingData.existingPolicies.map((policy, index) => (
                                <GlassmorphicPanel key={index} className="!p-4 space-y-3">
                                    <PremiumSelect label="Policy Type" value={policy.type} onChange={e => updatePolicy(index, 'type', e.target.value)}><option>Health</option><option>Life</option><option>Term</option><option>Other</option></PremiumSelect>
                                    <PremiumInput label="Provider Name" value={policy.provider} onChange={e => updatePolicy(index, 'provider', e.target.value)} placeholder="e.g., HDFC Ergo" />
                                    <PremiumInput label="Coverage Amount (₹)" value={policy.coverage || ''} onChange={e => updatePolicy(index, 'coverage', parseFloat(e.target.value))} type="number" placeholder="e.g., 1000000" />
                                </GlassmorphicPanel>
                            ))}
                            <button onClick={addPolicy} className="w-full py-3 border-2 border-dashed border-gray-600 rounded-xl text-gray-300 hover:border-sky-500 transition-colors">Add Another Policy</button>
                        </div>
                        <OnboardingNavigation onBack={handleBack} onNext={handleNext} nextDisabled={isNextDisabled(step)} />
                    </OnboardingQuestion>
                )}
                
                {step === 2 && (
                    <OnboardingQuestion animationKey={step} direction={direction}>
                        <h2 className="text-xl font-bold">Tell us about yourself.</h2>
                        <div className="space-y-3 mt-4">
                             <PremiumInput label="Full Name" value={insuranceOnboardingData.fullName} onChange={e => updateData('fullName', e.target.value)} placeholder="e.g., Aarav Sharma" />
                             <PremiumInput label="Age" value={insuranceOnboardingData.age || ''} onChange={e => updateData('age', parseInt(e.target.value))} type="number" placeholder="e.g., 28" />
                             <PremiumSelect label="Marital Status" value={insuranceOnboardingData.maritalStatus || ''} onChange={e => updateData('maritalStatus', e.target.value)}><option value="">Select...</option><option>Single</option><option>Married</option></PremiumSelect>
                             <PremiumSelect label="Employment Type" value={insuranceOnboardingData.employmentType || ''} onChange={e => updateData('employmentType', e.target.value)}><option value="">Select...</option><option>Salaried</option><option>Self-Employed</option><option>Other</option></PremiumSelect>
                             <PremiumToggle label="Lifestyle" options={['Non-Smoker', 'Smoker']} value={insuranceOnboardingData.lifestyleSmoker} onSelect={val => updateData('lifestyleSmoker', val)} />
                        </div>
                        <OnboardingNavigation onBack={handleBack} onNext={handleNext} nextDisabled={isNextDisabled(step)} />
                    </OnboardingQuestion>
                )}

                {step === 3 && (
                    <OnboardingQuestion animationKey={step} direction={direction}>
                        <h2 className="text-xl font-bold">What are your financials?</h2>
                        <div className="space-y-3 mt-4">
                            <PremiumInput label="Annual Income (₹)" value={insuranceOnboardingData.income || ''} onChange={e => updateData('income', parseFloat(e.target.value))} type="number" placeholder="e.g., 1200000" />
                            <PremiumInput label="Monthly Expenses (₹)" value={insuranceOnboardingData.monthlyExpenses || ''} onChange={e => updateData('monthlyExpenses', parseFloat(e.target.value))} type="number" placeholder="e.g., 40000" />
                            <PremiumSelect label="Insurance Budget Preference" value={insuranceOnboardingData.insuranceBudget || ''} onChange={e => updateData('insuranceBudget', e.target.value)}><option value="">Select...</option><option>Low</option><option>Medium</option><option>High</option></PremiumSelect>
                        </div>
                        <OnboardingNavigation onBack={handleBack} onNext={handleNext} nextDisabled={isNextDisabled(step)} />
                    </OnboardingQuestion>
                )}

                {step === 4 && (
                    <OnboardingQuestion animationKey={step} direction={direction}>
                        <h2 className="text-xl font-bold">Your Health & Risk Profile</h2>
                        <div className="space-y-3 mt-4">
                            <PremiumSelect label="Risk Appetite" value={insuranceOnboardingData.riskAppetite || ''} onChange={e => updateData('riskAppetite', e.target.value)}><option value="">Select...</option><option>Low</option><option>Medium</option><option>High</option></PremiumSelect>
                            <PremiumSelect label="Preferred Coverage Type" value={insuranceOnboardingData.preferredCoverageType || ''} onChange={e => updateData('preferredCoverageType', e.target.value)}><option value="">Select...</option><option>Basic</option><option>Comprehensive</option></PremiumSelect>
                            <PremiumToggle label="Willing to Undergo Medical Checkup?" options={['Yes', 'No']} value={insuranceOnboardingData.willingnessForCheckup === null ? '' : insuranceOnboardingData.willingnessForCheckup ? 'Yes' : 'No'} onSelect={val => updateData('willingnessForCheckup', val === 'Yes')} />
                            <div>
                                <p className="text-sm font-medium text-gray-400 mb-2">Any Major Health Conditions?</p>
                                <div className="flex gap-2 bg-black/30 p-1 rounded-xl">
                                    <button onClick={() => updateData('hasMajorHealthConditions', true)} className={`flex-1 p-2 rounded-lg text-sm font-semibold transition-all ${insuranceOnboardingData.hasMajorHealthConditions === true ? 'bg-sky-500 text-white' : 'text-gray-300'}`}>Yes</button>
                                    <button onClick={() => updateData('hasMajorHealthConditions', false)} className={`flex-1 p-2 rounded-lg text-sm font-semibold transition-all ${insuranceOnboardingData.hasMajorHealthConditions === false ? 'bg-sky-500 text-white' : 'text-gray-300'}`}>No</button>
                                </div>
                                {insuranceOnboardingData.hasMajorHealthConditions && <div className="text-center text-sky-300 mt-2 text-xs animate-pulse flex items-center justify-center space-x-1"><ChevronDownIcon /><span>Swipe down to specify</span><ChevronDownIcon /></div>}
                                {expanded.step4 && <PremiumInput label="Please specify" value={insuranceOnboardingData.majorHealthConditions} onChange={e => updateData('majorHealthConditions', e.target.value)} placeholder="e.g., Diabetes, Hypertension" className="mt-2 animate-fade-in" />}
                            </div>
                        </div>
                        <OnboardingNavigation onBack={handleBack} onNext={handleNext} nextDisabled={isNextDisabled(step)} />
                    </OnboardingQuestion>
                )}
                
                {step === 5 && (
                    <OnboardingQuestion animationKey={step} direction={direction}>
                        <h2 className="text-xl font-bold">Coverage Goals & Priorities</h2>
                        <div className="space-y-3 mt-4">
                            <PremiumSelect label="Main Goal" value={insuranceOnboardingData.mainGoal || ''} onChange={e => updateData('mainGoal', e.target.value)}><option value="">Select...</option><option>Protection</option><option>Investment-linked</option><option>Both</option></PremiumSelect>
                            <PremiumInput label="Desired Coverage Amount (₹)" value={insuranceOnboardingData.desiredCoverage || ''} onChange={e => updateData('desiredCoverage', parseFloat(e.target.value))} type="number" placeholder="e.g., 10000000" />
                            <PremiumSelect label="Priority of Protection" value={insuranceOnboardingData.priorityOfProtection || ''} onChange={e => updateData('priorityOfProtection', e.target.value)}><option value="">Select...</option><option>Life</option><option>Health</option><option>Term</option></PremiumSelect>
                        </div>
                        <OnboardingNavigation onBack={handleBack} onNext={handleNext} nextDisabled={isNextDisabled(step)} />
                    </OnboardingQuestion>
                )}

                {step === 6 && (
                    <OnboardingQuestion animationKey={step} direction={direction}>
                        <h2 className="text-xl font-bold">Experience & Preferences</h2>
                        <div className="space-y-3 mt-4 max-h-[50vh] overflow-y-auto no-scrollbar pr-2">
                             <PremiumSelect label="AI Tip Frequency" value={insuranceOnboardingData.tipsFrequency || ''} onChange={e => updateData('tipsFrequency', e.target.value as any)}><option value="">Select...</option><option>Daily</option><option>Weekly</option><option>Monthly</option></PremiumSelect>
                             <PremiumSelect label="Guidance Style" value={insuranceOnboardingData.guidanceStyle || ''} onChange={e => updateData('guidanceStyle', e.target.value as any)}><option value="">Select...</option><option>Text</option><option>Charts</option><option>Both</option></PremiumSelect>
                             <PremiumSelect label="Recommendation Source" value={insuranceOnboardingData.preferredRecommendationSource || ''} onChange={e => updateData('preferredRecommendationSource', e.target.value as any)}><option value="">Select...</option><option>Ditto</option><option>AI only</option><option>Both</option></PremiumSelect>
                             <PremiumSelect label="Preferred Policy Duration" value={insuranceOnboardingData.preferredPolicyDuration || ''} onChange={e => updateData('preferredPolicyDuration', e.target.value as any)}><option value="">Select...</option><option>1-5 yrs</option><option>5-10 yrs</option><option>10+ yrs</option></PremiumSelect>
                             <PremiumToggle label="Ever Claimed Insurance?" options={['Yes', 'No']} value={insuranceOnboardingData.claimedInsurance === null ? '' : insuranceOnboardingData.claimedInsurance ? 'Yes' : 'No'} onSelect={val => updateData('claimedInsurance', val === 'Yes')} />
                             {insuranceOnboardingData.claimedInsurance && <div className="text-center text-sky-300 mt-2 text-xs animate-pulse flex items-center justify-center space-x-1"><ChevronDownIcon /><span>Swipe down to elaborate</span><ChevronDownIcon /></div>}
                             {expanded.step6 && <PremiumInput label="Tell us about it (optional)" value={insuranceOnboardingData.claimedInsuranceDetails} onChange={e => updateData('claimedInsuranceDetails', e.target.value)} placeholder="e.g., Claim was for hospitalization..." className="mt-2 animate-fade-in" />}
                             <PremiumToggle label="Adjust Policies Based on AI?" options={['Yes', 'No']} value={insuranceOnboardingData.willingnessToAdjust === null ? '' : insuranceOnboardingData.willingnessToAdjust ? 'Yes' : 'No'} onSelect={val => updateData('willingnessToAdjust', val === 'Yes')} />
                        </div>
                        <OnboardingNavigation onBack={handleBack} onNext={() => {}} isLastStep={true} onComplete={() => setIsGeneratingPlan(true)} nextDisabled={isNextDisabled(step)} />
                    </OnboardingQuestion>
                )}
            </div>
        </div>
    );
};
export default InsuranceOnboarding;
