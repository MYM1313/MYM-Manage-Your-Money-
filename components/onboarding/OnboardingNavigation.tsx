
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
            className="px-8 py-3 bg-white/10 rounded-xl text-base font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:enabled:bg-white/20 active:enabled:scale-95"
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
                className="px-8 py-3 bg-sky-500 rounded-xl text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-sky-500/20 hover:enabled:scale-105 active:enabled:scale-95"
            >
                Next
            </button>
        )}
    </div>
);

export default OnboardingNavigation;