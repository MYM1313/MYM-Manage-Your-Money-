import React, { FC } from 'react';

interface OnboardingNavigationProps {
    onBack: () => void;
    onNext: () => void;
    backDisabled?: boolean;
    nextDisabled?: boolean;
    isLastStep?: boolean;
}

const OnboardingNavigation: FC<OnboardingNavigationProps> = ({ onBack, onNext, backDisabled, nextDisabled, isLastStep }) => (
    <div className="flex justify-between mt-auto pt-6">
        <button 
            onClick={onBack} 
            disabled={backDisabled} 
            className="px-8 py-3 bg-black/30 border border-white/10 backdrop-blur-sm rounded-xl text-base font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:enabled:bg-white/10 hover:enabled:border-white/20 active:enabled:scale-95"
        >
            Back
        </button>
        {isLastStep ? (
            <button 
                onClick={onNext} 
                disabled={nextDisabled} 
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-500/20 hover:enabled:scale-105 active:enabled:scale-95"
            >
                Complete Setup
            </button>
        ) : (
            <button 
                onClick={onNext} 
                disabled={nextDisabled} 
                className="px-8 py-3 bg-slate-600 rounded-xl text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-600/20 hover:enabled:bg-slate-500 hover:enabled:scale-105 active:enabled:scale-95"
            >
                Next
            </button>
        )}
    </div>
);

export default OnboardingNavigation;