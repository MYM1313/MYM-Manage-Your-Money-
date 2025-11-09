import React, { useState, useMemo } from 'react';
import { CALCULATORS, CALCULATOR_CATEGORIES, CalculatorInfo } from '../constants';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';
import { SearchIcon } from '../components/icons/SearchIcon';
import CalculatorDetailScreen from './CalculatorDetailScreen';
import GlassmorphicPanel from '../components/shared/Card';

interface ToolsAndCalculatorsScreenProps {
    onBack: () => void;
    initialCategory?: string;
}

const ToolsAndCalculatorsScreen: React.FC<ToolsAndCalculatorsScreenProps> = ({ onBack, initialCategory }) => {
    const [selectedCalculator, setSelectedCalculator] = useState<CalculatorInfo | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<(typeof CALCULATOR_CATEGORIES)[number] | 'All'>(
        (initialCategory && [...CALCULATOR_CATEGORIES].includes(initialCategory as any))
            ? initialCategory as (typeof CALCULATOR_CATEGORIES)[number]
            : 'All'
    );

    const filteredCalculators = useMemo(() => {
        return CALCULATORS.filter(calc => {
            const matchesCategory = activeCategory === 'All' || calc.category === activeCategory;
            const matchesSearch = calc.name.toLowerCase().includes(searchTerm.toLowerCase()) || calc.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, activeCategory]);
    
    const groupedCalculators = useMemo(() => {
        if (activeCategory !== 'All') return null;
        
        return filteredCalculators.reduce((acc, calc) => {
            (acc[calc.category] = acc[calc.category] || []).push(calc);
            return acc;
        }, {} as Record<string, CalculatorInfo[]>);
    }, [filteredCalculators, activeCategory]);


    if (selectedCalculator) {
        return <CalculatorDetailScreen calculator={selectedCalculator} onBack={() => setSelectedCalculator(null)} />;
    }

    const categoryTabs: ('All' | (typeof CALCULATOR_CATEGORIES)[number])[] = ['All', ...CALCULATOR_CATEGORIES];

    return (
        <div className="h-full flex flex-col bg-[#0D1117] text-gray-200 animate-fade-in">
            <header className="sticky top-0 z-20 p-6 pb-4 bg-gradient-to-b from-[#0D1117] to-transparent backdrop-blur-sm">
                <div className="flex items-center mb-4">
                    <button onClick={onBack} className="p-2 -ml-2 text-gray-300 rounded-full hover:bg-white/10">
                        <ChevronLeftIcon />
                    </button>
                    <div className="text-center flex-1">
                        <h1 className="text-2xl font-bold text-gray-100">Calculators & Tools</h1>
                        <p className="text-sm text-gray-400">Smart tools to plan, grow, and secure your money.</p>
                    </div>
                    <div className="w-8"></div>
                </div>

                <div className="relative mt-4">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for a calculator..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-full py-3 pl-12 pr-4 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
                    />
                </div>
            </header>

            <div className="px-6 py-2">
                <div className="no-scrollbar flex space-x-2 overflow-x-auto">
                    {categoryTabs.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-all duration-300 ${activeCategory === category ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20' : 'text-gray-400 bg-white/5 hover:bg-white/10'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <main className="flex-1 overflow-y-auto p-6 pt-2">
                 {activeCategory === 'All' && groupedCalculators ? (
                    <div className="space-y-8">
                        {CALCULATOR_CATEGORIES.map(category => {
                            const calcs = groupedCalculators[category];
                            if (!calcs || calcs.length === 0) return null;

                            return (
                                <div key={category} className="animate-fade-in">
                                    <h2 className="text-xl font-bold text-sky-300 mb-4">{category}</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {calcs.map((calc, index) => (
                                            <GlassmorphicPanel
                                                key={calc.slug}
                                                onClick={() => setSelectedCalculator(calc)}
                                                className="animate-fade-in flex flex-col justify-between items-start !p-5"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <div>
                                                    <div className="p-3 bg-black/20 rounded-xl mb-4 w-fit">
                                                        <calc.icon className="h-6 w-6 text-sky-400" />
                                                    </div>
                                                    <h3 className="font-bold text-gray-100">{calc.name}</h3>
                                                    <p className="text-xs text-gray-400 mt-1">{calc.description}</p>
                                                </div>
                                                <div className="mt-4">
                                                    <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                                                </div>
                                            </GlassmorphicPanel>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredCalculators.map((calc, index) => (
                            <GlassmorphicPanel
                                key={calc.slug}
                                onClick={() => setSelectedCalculator(calc)}
                                className="animate-fade-in flex flex-col justify-between items-start !p-5"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div>
                                    <div className="p-3 bg-black/20 rounded-xl mb-4 w-fit">
                                        <calc.icon className="h-6 w-6 text-sky-400" />
                                    </div>
                                    <h3 className="font-bold text-gray-100">{calc.name}</h3>
                                    <p className="text-xs text-gray-400 mt-1">{calc.description}</p>
                                </div>
                                <div className="mt-4">
                                    <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                                </div>
                            </GlassmorphicPanel>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ToolsAndCalculatorsScreen;