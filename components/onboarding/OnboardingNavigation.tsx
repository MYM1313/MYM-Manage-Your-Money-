import React from 'react';

interface OnboardingNavigationProps {
    onBack: () => void;
    onNext: () => void;
    backDisabled: boolean;
    nextDisabled: boolean;
    isLastStep: boolean;
    onComplete: () => void;
}

const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
    onBack,
    onNext,
    backDisabled,
    nextDisabled,
    isLastStep,
    onComplete
}) => {
    return (
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
            <button
                onClick={onBack}
                disabled={backDisabled}
                className="px-6 py-3 text-gray-400 font-semibold rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Back
            </button>
            <button
                onClick={isLastStep ? onComplete : onNext}
                disabled={nextDisabled}
                className="px-8 py-3 bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 hover:scale-105 transition-transform disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed disabled:scale-100"
            >
                {isLastStep ? 'Complete Setup' : 'Next'}
            </button>
        </div>
    );
};

export default OnboardingNavigation;
