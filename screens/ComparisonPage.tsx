import React from 'react';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { ScaleIcon } from '../components/icons/ScaleIcon';
import Card from '../components/shared/Card';

const ComparisonDetail: React.FC<{ title: string; value: string; isPositive?: boolean }> = ({ title, value, isPositive }) => (
    <div className="flex justify-between items-center py-2">
        <p className="text-gray-400">{title}</p>
        <p className={`font-bold ${isPositive ? 'text-green-400' : 'text-gray-200'}`}>{value}</p>
    </div>
);

const ComparisonCard: React.FC<{ title: string; rate: string; isRecommended?: boolean }> = ({ title, rate, isRecommended }) => (
    <Card className={`!p-4 border-2 ${isRecommended ? 'border-amber-500/30 bg-amber-900/20' : 'border-gray-700'}`}>
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-bold text-gray-200">{title}</h3>
            {isRecommended && <div className="text-xs font-bold bg-amber-900/50 text-amber-300 px-2 py-0.5 rounded-full">Recommended</div>}
        </div>
        <div className="text-center bg-gray-900/50 rounded-xl py-2 mb-4">
            <p className="text-sm text-gray-400">Average Annual Return</p>
            <p className="text-3xl font-bold text-gray-200">{rate}</p>
        </div>
        <div className="divide-y divide-gray-700 text-sm">
            <ComparisonDetail title="Risk Level" value={title === 'Bank Savings' ? 'Very Low' : 'Low to Medium'} />
            <ComparisonDetail title="Liquidity" value="High" />
            <ComparisonDetail title="Inflation Hedge" value={title === 'Bank Savings' ? 'Poor' : 'Good'} isPositive={title !== 'Bank Savings'} />
            <ComparisonDetail title="Best For" value={title === 'Bank Savings' ? 'Emergency funds' : 'Wealth growth'} />
        </div>
    </Card>
);

const ComparisonPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="p-6 h-full flex flex-col animate-fade-in bg-[#121212]">
             <header className="flex items-center mb-6 flex-shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 text-gray-300 rounded-full hover:bg-gray-800">
                    <ChevronLeftIcon />
                </button>
                <div className="text-center flex-1">
                    <div className="flex items-center justify-center space-x-2">
                        <ScaleIcon />
                        <h1 className="text-2xl font-bold text-gray-200">Deep Comparison</h1>
                    </div>
                    <p className="text-sm text-gray-400">Understand where your money grows best.</p>
                </div>
                <div className="w-8"></div>
            </header>
            
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                <ComparisonCard title="Bank Savings" rate="~3.0%" />
                <ComparisonCard title="FD / Gold" rate="~7.5%" isRecommended />
                
                <Card>
                    <h3 className="text-lg font-bold text-gray-200 mb-2">Key Takeaways</h3>
                    <ul className="space-y-2 text-sm text-gray-400 list-disc list-inside">
                        <li><span className="font-semibold text-gray-200">Inflation is key:</span> Standard savings accounts often lose value over time due to inflation.</li>
                        <li><span className="font-semibold text-gray-200">Compounding is powerful:</span> Even a small difference in return rate makes a huge impact over several years.</li>
                        <li><span className="font-semibold text-gray-200">Diversify:</span> A mix of safe savings (for emergencies) and growth investments (like FDs/Gold) is ideal for a healthy financial future.</li>
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default ComparisonPage;