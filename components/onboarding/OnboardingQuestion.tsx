
import React, { FC, ReactNode, useState, useEffect } from 'react';

interface OnboardingQuestionProps {
    children: ReactNode;
    animationKey: number;
    direction: 'forward' | 'backward';
}

const OnboardingQuestion: FC<OnboardingQuestionProps> = ({ children, animationKey, direction }) => {
    const [currentChildren, setCurrentChildren] = useState(children);
    const [currentKey, setCurrentKey] = useState(animationKey);
    const [animationClass, setAnimationClass] = useState('animate-fade-in');

    useEffect(() => {
        // Only trigger animations if the step (animationKey) has changed.
        if (animationKey === currentKey) {
            // If the key is the same, just update the children without animation.
            // This handles re-renders within the same step (e.g. from typing in an input).
            setCurrentChildren(children);
            return;
        }

        const outAnimation = direction === 'forward' 
            ? 'animate-slide-out-left-fade' 
            : 'animate-slide-out-right-fade';
        
        setAnimationClass(outAnimation);

        const timer = setTimeout(() => {
            setCurrentChildren(children);
            setCurrentKey(animationKey);
            const inAnimation = direction === 'forward' 
                ? 'animate-slide-in-right-fade' 
                : 'animate-slide-in-left-fade';
            setAnimationClass(inAnimation);
        }, 300); // Match this with animation duration in index.html

        return () => clearTimeout(timer);
    }, [children, animationKey, direction, currentKey]);

    return (
        <div key={currentKey} className={`absolute inset-0 p-6 flex flex-col justify-center ${animationClass}`}>
            {currentChildren}
        </div>
    );
};

export default OnboardingQuestion;
