import React, { FC } from 'react';

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

const StepIndicator: FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
    const progress = (currentStep / totalSteps) * 100;
    
    return (
        <div className="absolute top-6 left-6 right-6 z-10 animate-fade-in">
            <p className="text-sm font-semibold text-gray-400">Step {currentStep} of {totalSteps}</p>
            <div className="w-full bg-white/10 rounded-full h-1 mt-1.5">
                <div 
                    className="bg-white h-1 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%`, boxShadow: '0 0 8px rgba(255, 255, 255, 0.4)' }}
                ></div>
            </div>
        </div>
    );
};

export default StepIndicator;