import React, { FC } from 'react';

interface PremiumSliderProps {
    label: string;
    value: number;
    onUpdate: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    suffix?: string;
}

const PremiumSlider: FC<PremiumSliderProps> = ({ label, value, onUpdate, min = 1, max = 10, step = 1, suffix = "" }) => {
    const progress = ((value - min) / (max - min)) * 100;
    const sliderStyle = {
      background: `linear-gradient(to right, #38bdf8 0%, #38bdf8 ${progress}%, rgba(10, 20, 40, 0.5) ${progress}%, rgba(10, 20, 40, 0.5) 100%)`
    };

    return (
        <div>
            <div className="flex justify-between items-baseline mb-2">
                <label className="text-sm font-medium text-gray-400">{label}</label>
                <span className="text-2xl font-bold text-sky-300 w-20 text-right">{value}{suffix}</span>
            </div>
            <input 
                type="range" 
                min={min} 
                max={max}
                step={step}
                value={value} 
                onChange={e => onUpdate(parseInt(e.target.value))} 
                className="w-full range-blue"
                style={sliderStyle}
            />
        </div>
    );
};

export default PremiumSlider;
