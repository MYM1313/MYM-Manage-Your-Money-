import React from 'react';

interface OnboardingQuestionProps {
    children: React.ReactNode;
    animationKey: number;
    direction: 'forward' | 'backward';
}

const OnboardingQuestion: React.FC<OnboardingQuestionProps> = ({ children, animationKey, direction }) => {
    const animationClass = direction === 'forward' ? 'animate-slide-in-from-right' : 'animate-slide-in-from-left';

    return (
        <div key={animationKey} className={`h-full w-full flex flex-col justify-center ${animationClass}`}>
            {children}
        </div>
    );
};

export default OnboardingQuestion;
