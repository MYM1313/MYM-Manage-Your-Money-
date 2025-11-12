import React from 'react';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { ToolsIcon } from '../components/icons/ToolsIcon';
import Card from '../components/shared/Card';

const RiskSimulatorPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="p-6 h-full flex flex-col animate-fade-in bg-[#121212]">
             <header className="flex items-center mb-6 flex-shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 text-gray-300 rounded-full hover:bg-gray-800">
                    <ChevronLeftIcon />
                </button>
                <div className="text-center flex-1">
                    <div className="flex items-center justify-center space-x-2">
                        <ToolsIcon />
                        <h1 className="text-2xl font-bold text-gray-200">'What If' Risk Simulator</h1>
                    </div>
                     <p className="text-sm text-gray-400">Understand your financial exposure.</p>
                </div>
                <div className="w-8"></div>
            </header>
            
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                 <Card>
                    <div className="flex items-center justify-center h-64">
                         <p className="text-gray-400">Simulator coming soon!</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default RiskSimulatorPage;
