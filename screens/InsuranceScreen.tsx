import React, { useState, useMemo, FC, useContext, useEffect, useRef } from 'react';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { FinancialContext } from '../App';
import { InsurancePolicy } from '../types';
import GlassmorphicPanel from '../components/shared/Card';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';
import { XIcon } from '../components/icons/XIcon';
import { DittoIcon } from '../components/icons/DittoIcon';
import IconWrapper from '../components/shared/IconWrapper';
import { SearchIcon } from '../components/icons/SearchIcon';
import { AIIcon } from '../components/icons/AIIcon';
import { SettingsIcon } from '../components/icons/SettingsIcon';
import { InfoIcon } from '../components/icons/InfoIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { LightBulbIcon } from '../components/icons/LightBulbIcon';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpenIcon } from '../components/icons/BookOpenIcon';
import { ToolsIcon } from '../components/icons/ToolsIcon';
import { CALCULATORS } from '../constants';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';
import { ClipboardCheckIcon } from '../components/icons/ClipboardCheckIcon';


// --- TYPES ---
type View = 'main' | 'tools' | 'learning' | 'benefits' | 'simulator' | 'comparison';

// --- HELPER COMPONENTS ---
const CountUp: FC<{ end: number; duration?: number; prefix?: string; suffix?: string; }> = ({ end, duration = 1500, prefix = "", suffix = "" }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        if (start === end) return;
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(parseFloat((progress * (end - start)).toFixed(0)));
            if (progress < 1) window.requestAnimationFrame(step); else setCount(end);
        };
        window.requestAnimationFrame(step);
    }, [end, duration]);
    return <span>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
};

const Logo: React.FC = () => (
    <svg width="42" height="42" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="barFaceGradient" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stop-color="#5B8DEA"/>
                <stop offset="100%" stop-color="#3A6AC1"/>
            </linearGradient>
            <linearGradient id="barTopGradient" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stop-color="#7CA3EE"/>
                <stop offset="100%" stop-color="#5B8DEA"/>
            </linearGradient>
            <filter id="starGlow">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5"/>
            </filter>
        </defs>
        <circle cx="50" cy="50" r="47" fill="#0B142B"/>
        <g transform="translate(0, 5)">
            <rect x="22" y="40" width="14" height="45" fill="url(#barFaceGradient)"/>
            <path d="M22 40 L25 37 L39 37 L36 40 Z" fill="url(#barTopGradient)" />
            <rect x="40" y="53" width="14" height="32" fill="url(#barFaceGradient)"/>
            <path d="M40 53 L43 50 L57 50 L54 53 Z" fill="url(#barTopGradient)" />
            <rect x="58" y="35" width="14" height="50" fill="url(#barFaceGradient)"/>
            <path d="M58 35 L61 32 L75 32 L72 35 Z" fill="url(#barTopGradient)" />
            <rect x="76" y="25" width="14" height="60" fill="url(#barFaceGradient)"/>
            <path d="M76 25 L79 22 L93 22 L90 25 Z" fill="url(#barTopGradient)" />
        </g>
        <g fill="white" filter="url(#starGlow)">
            <path transform="translate(30 25) scale(0.5)" d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
            <path transform="translate(48 18) scale(0.65)" d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
            <path transform="translate(68 22) scale(0.6)" d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
            <path transform="translate(82 17) scale(0.4)" d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
        </g>
    </svg>
);


// --- REFINED PANELS & MODALS ---

const VaultHeaderPanel: FC<{ 
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onNavigate: (view: string) => void;
}> = ({ searchTerm, setSearchTerm, onNavigate }) => {
    const [searchActive, setSearchActive] = useState(false);
    const taglines = ["Protect your wealth, secure your future.", "Insurance: Your financial seatbelt.", "Building a shield for your loved ones."];
    const [taglineIndex, setTaglineIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTaglineIndex(prev => (prev + 1) % taglines.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <GlassmorphicPanel className="!p-4 animate-slide-up-fade-in transition-all duration-300">
            <div className="flex justify-between items-center">
                <div className="flex-1 overflow-hidden">
                    <h1 className="text-xl font-bold text-gray-100">Insurance</h1>
                    <div className="relative h-4 mt-1">
                        <p key={taglineIndex} className="text-xs text-gray-400 absolute inset-0 animate-rotating-text-in">{taglines[taglineIndex]}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-1">
                    <IconWrapper onClick={() => setSearchActive(!searchActive)} className={searchActive ? '!bg-sky-500/30' : ''}>
                        <SearchIcon className="h-5 w-5 text-gray-300" />
                    </IconWrapper>
                    <IconWrapper onClick={() => onNavigate('aiChat')}><AIIcon className="h-5 w-5" /></IconWrapper>
                    <IconWrapper><SettingsIcon className="text-gray-300"/></IconWrapper>
                </div>
            </div>
            {searchActive && (
                <div className="mt-4 animate-fade-in">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search policies & FAQs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 pl-10 text-gray-200 focus:ring-2 focus:ring-sky-500 transition-all"
                            autoFocus
                        />
                         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon />
                        </div>
                    </div>
                </div>
            )}
        </GlassmorphicPanel>
    );
};

const ChecklistPanel: FC<{ onOpenDetails: () => void }> = ({ onOpenDetails }) => {
    const checklistItems = [
        "Assess your financial dependents.",
        "Calculate your Human Life Value (HLV).",
        "Compare policies & claim settlement ratios.",
        "Disclose all medical history honestly.",
        "Read policy documents carefully.",
    ];
    return (
        <GlassmorphicPanel className="!p-5 animate-slide-up-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2"><ClipboardCheckIcon /> Buying Checklist</h2>
                    <p className="text-sm text-gray-400 mt-1">5 essential steps before you buy insurance.</p>
                </div>
                <button onClick={onOpenDetails} className="text-xs font-semibold text-sky-400 hover:text-sky-300 bg-black/20 px-3 py-1.5 rounded-lg">More</button>
            </div>
            <div className="mt-4 space-y-2">
                {checklistItems.map((item, i) => (
                    <div key={i} className="flex items-center space-x-3 text-sm">
                        <div className="w-5 h-5 flex-shrink-0 bg-gray-700/50 rounded-full flex items-center justify-center text-gray-400">{i + 1}</div>
                        <p className="text-gray-300">{item}</p>
                    </div>
                ))}
            </div>
        </GlassmorphicPanel>
    );
};

const ChecklistDetailModal: FC<{ onClose: () => void }> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('Term');
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end" onClick={onClose}>
            <div className="w-full bg-gradient-to-t from-[#0F0F1F] to-[#1e1e1e] border-t-2 border-sky-500/50 rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up" onClick={e=>e.stopPropagation()}>
                <header className="p-4 flex-shrink-0 border-b border-white/10">
                    <div className="flex justify-center mb-2"><div className="w-16 h-1.5 bg-gray-700 rounded-full"></div></div>
                    <h2 className="text-xl font-bold text-center">Insurance Buying Guide</h2>
                </header>
                <div className="p-4 flex-shrink-0">
                     <div className="flex bg-gray-900/50 p-1 rounded-full"><button onClick={() => setActiveTab('Term')} className={`flex-1 py-2 rounded-full font-semibold transition-all ${activeTab === 'Term' ? 'bg-sky-500 text-white' : 'text-gray-400'}`}>Term Insurance</button><button onClick={() => setActiveTab('Health')} className={`flex-1 py-2 rounded-full font-semibold transition-all ${activeTab === 'Health' ? 'bg-sky-500 text-white' : 'text-gray-400'}`}>Health Insurance</button></div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
                    <p className="text-sm text-center text-gray-400">A detailed step-by-step guide on how to complete each checklist item for your chosen insurance type will appear here.</p>
                </div>
            </div>
        </div>
    );
}

const CoverageCalculatorPanel: FC = () => (
    <div className="bg-black/20 p-4 rounded-xl mt-4">
        <h3 className="font-bold text-gray-200">Calculate Your Ideal Coverage</h3>
        <p className="text-xs text-gray-400 mb-3">A simplified version for quick estimation.</p>
        <div className="space-y-3">
             <div className="grid grid-cols-2 gap-2"><input type="number" placeholder="Annual Income (₹)" className="w-full bg-gray-900/50 p-2 rounded-lg text-sm" /><input type="number" placeholder="# of Dependents" className="w-full bg-gray-900/50 p-2 rounded-lg text-sm" /></div>
            <button className="w-full py-2 bg-sky-600 text-white font-semibold rounded-lg text-sm">Calculate</button>
        </div>
    </div>
);

const GapsAndRecommendationsPanel: FC<{ policies: InsurancePolicy[] } & {refProp: React.Ref<HTMLDivElement>}> = ({ policies, refProp }) => {
    const [showCalculator, setShowCalculator] = useState(false);
    // Dummy gaps for UI purposes
    const healthGap = 500000;
    const lifeGap = 7500000;

    return (
        <div ref={refProp} className="animate-slide-up-fade-in" style={{ animationDelay: '300ms' }}>
            <h2 className="text-xl font-bold text-gray-100 mb-4 px-2">Gaps & Recommendations</h2>
            <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
                <div className="flex-shrink-0 w-[90vw] max-w-md">
                    <GlassmorphicPanel className="!p-5 space-y-3 h-full flex flex-col">
                        <h3 className="text-lg font-bold text-gray-200">Health Coverage</h3>
                        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 text-center flex-1 flex flex-col justify-center">
                            <p className="text-sm text-red-300">Coverage you need</p>
                            <p className="text-3xl font-bold text-gray-100">₹{healthGap.toLocaleString('en-IN')}</p>
                        </div>
                    </GlassmorphicPanel>
                </div>
                <div className="flex-shrink-0 w-[90vw] max-w-md">
                    <GlassmorphicPanel className="!p-5 space-y-3 h-full flex flex-col">
                        <h3 className="text-lg font-bold text-gray-200">Term Insurance</h3>
                        <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-3 text-center flex-1 flex flex-col justify-center">
                            <p className="text-sm text-orange-300">Coverage you need</p>
                            <p className="text-3xl font-bold text-gray-100">₹{lifeGap.toLocaleString('en-IN')}</p>
                        </div>
                    </GlassmorphicPanel>
                </div>
            </div>
            <div className="text-center mt-2">
                <button onClick={() => setShowCalculator(!showCalculator)} className="text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors flex items-center justify-center w-full">
                    <span>Calculate Coverage Amount</span>
                    <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform duration-300 ${showCalculator ? 'rotate-180' : ''}`} />
                </button>
            </div>
            <div className={`grid transition-all duration-500 ease-in-out ${showCalculator ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <CoverageCalculatorPanel />
                </div>
            </div>
        </div>
    );
}

const WhyDittoModal: FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end" onClick={onClose}>
        <div className="w-full bg-[#10141f] border-t-2 border-teal-500/50 rounded-t-3xl max-h-[60vh] flex flex-col animate-slide-up" onClick={e=>e.stopPropagation()}>
            <header className="p-4 flex-shrink-0 text-center relative">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gray-700 rounded-full"></div>
                <button onClick={onClose} className="absolute top-3 right-4 p-1 text-gray-500 hover:text-white"><XIcon /></button>
                <div className="mt-6 flex justify-center items-center gap-4">
                    <Logo />
                    <div className="text-3xl text-gray-600">&times;</div>
                    <DittoIcon className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-100 mt-4">Why we trust Ditto</h2>
                <p className="text-sm text-gray-400">Unbiased advice, stellar support.</p>
            </header>
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 text-sm">
                <div className="bg-black/30 p-3 rounded-lg flex items-start gap-3"><span className="text-teal-400 mt-1"><CheckCircleIcon className="w-5 h-5"/></span><div><h3 className="font-semibold text-gray-200">Honest & Unbiased Advice</h3><p className="text-gray-400">Ditto advisors have a strict "no-spam" policy and are trained to give genuine advice, not just sell policies.</p></div></div>
                <div className="bg-black/30 p-3 rounded-lg flex items-start gap-3"><span className="text-teal-400 mt-1"><CheckCircleIcon className="w-5 h-5"/></span><div><h3 className="font-semibold text-gray-200">Free Consultation</h3><p className="text-gray-400">You can book a free call to understand your needs without any pressure to buy.</p></div></div>
                <div className="bg-black/30 p-3 rounded-lg flex items-start gap-3"><span className="text-teal-400 mt-1"><CheckCircleIcon className="w-5 h-5"/></span><div><h3 className="font-semibold text-gray-200">End-to-End Claim Support</h3><p className="text-gray-400">In the unfortunate event of a claim, their team promises to help you and your family navigate the process, free of charge.</p></div></div>
            </div>
        </div>
    </div>
);

const CoreFeaturesPanel: FC<{ onWhyDittoClick: () => void }> = ({ onWhyDittoClick }) => {
    const features = [
        { title: "Unbiased Advice", description: "Honest, spam-free guidance from certified experts." },
        { title: "30-Min Consultation", description: "Book a free call to understand your real needs." },
        { title: "Claim Support", description: "Full assistance for you & your family during claims." },
    ];
    return (
        <GlassmorphicPanel className="!p-6 animate-slide-up-fade-in animate-active-glow-green" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-bold">Buy Insurance the Right Way</h2>
                 <DittoIcon className="w-12 h-12" />
            </div>
            <p className="text-sm text-gray-400 mb-5">We've partnered with Ditto to provide you with the best, most honest insurance advice. No spam, no mis-selling.</p>
            <div className="space-y-3">
                {features.map(f => <div key={f.title} className="bg-black/30 p-3 rounded-lg flex items-center gap-3"><span className="text-green-400"><CheckCircleIcon className="w-6 h-6"/></span><div><h4 className="font-semibold text-gray-200">{f.title}</h4><p className="text-xs text-gray-400">{f.description}</p></div></div>)}
            </div>
            <div className="flex gap-3 mt-5">
                <button onClick={onWhyDittoClick} className="flex-1 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">Why Ditto?</button>
                <a href="https://joinditto.in/" target="_blank" rel="noopener noreferrer" className="flex-1"><button className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transform hover:scale-105 active:scale-95 transition-transform">Explore Plans</button></a>
            </div>
        </GlassmorphicPanel>
    );
};

const AIChatTeaserPanel: FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => (
    <GlassmorphicPanel onClick={() => onNavigate('aiChat')} className="!p-5 cursor-pointer group animate-slide-up-fade-in border-2 border-transparent hover:border-purple-500/50 bg-gradient-to-br from-indigo-900/40 to-purple-900/40" style={{ animation: 'orb-pulse 6s infinite ease-in-out', animationDelay: '600ms' }}>
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-black/30 rounded-full"><AIIcon className="h-8 w-8 text-purple-300" /></div>
                <div>
                    <h3 className="text-lg font-bold text-gray-100">Ask Your AI Insurance Advisor</h3>
                    <p className="text-sm text-gray-400">Get instant answers on policies, claims, and more.</p>
                </div>
            </div>
            <ChevronRightIcon className="h-6 w-6 text-gray-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-purple-300" />
        </div>
    </GlassmorphicPanel>
);

const LearningHubAndToolsPanel: FC<{ onNavigate: (view: string, params?: any) => void; }> = ({ onNavigate }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up-fade-in" style={{ animationDelay: '700ms' }}>
        <GlassmorphicPanel onClick={() => onNavigate('learning', { category: 'Insurance' })} className="!p-4 space-y-2 cursor-pointer h-full flex flex-col justify-between">
            <div>
                 <div className="p-2 bg-indigo-900/50 rounded-lg w-fit mb-2"><BookOpenIcon className="h-6 w-6" /></div>
                 <h3 className="text-md font-bold">Learning Hub</h3>
                 <p className="text-xs text-gray-400">Master insurance concepts.</p>
            </div>
             <span className="text-sky-400 font-semibold text-xs flex items-center">Start Learning <ChevronRightIcon className="h-3 w-3 ml-1" /></span>
        </GlassmorphicPanel>
         <GlassmorphicPanel onClick={() => onNavigate('tools', { category: 'Insurance' })} className="!p-4 space-y-2 cursor-pointer h-full flex flex-col justify-between">
             <div>
                <div className="p-2 bg-sky-900/50 rounded-lg w-fit mb-2"><ToolsIcon /></div>
                <h3 className="text-md font-bold">Insurance Tools</h3>
                <p className="text-xs text-gray-400">Calculators for your needs.</p>
            </div>
             <span className="text-sky-400 font-semibold text-xs flex items-center">Explore Tools <ChevronRightIcon className="h-3 w-3 ml-1" /></span>
        </GlassmorphicPanel>
    </div>
);

const MyPoliciesWalletPanel: FC<{ policies: InsurancePolicy[] }> = ({ policies }) => {
    const { addInsurancePolicy, updateInsurancePolicy, deleteInsurancePolicy } = useContext(FinancialContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<InsurancePolicy | null>(null);

    const handleAddClick = () => { setEditingPolicy(null); setIsModalOpen(true); };
    const handleEditClick = (policy: InsurancePolicy) => { setEditingPolicy(policy); setIsModalOpen(true); };
    const handleSavePolicy = (policyData: Omit<InsurancePolicy, 'id'>, id?: string) => {
        if (id) updateInsurancePolicy(id, policyData); else addInsurancePolicy(policyData);
        setIsModalOpen(false);
    };

    const summary = useMemo(() => ({
        count: policies.length,
        coverage: policies.reduce((s, p) => s + p.coverage, 0),
        premium: policies.reduce((s, p) => s + (p.premiumFrequency === 'Monthly' ? p.premium * 12 : p.premium), 0)
    }), [policies]);

    return (
        <>
            <GlassmorphicPanel className="!p-5 animate-slide-up-fade-in" style={{ animationDelay: '400ms' }}>
                <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">My Policies Wallet</h2><button onClick={handleAddClick} className="flex items-center space-x-1 text-sm font-semibold text-sky-300 bg-sky-900/50 px-3 py-1.5 rounded-lg hover:bg-sky-800/50 transition-colors"><PlusCircleIcon /><span>Add New</span></button></div>
                <div className="bg-black/20 rounded-xl p-3 flex justify-around text-center mb-4"><div><p className="text-xs text-gray-400">Policies</p><p className="font-bold text-lg text-gray-100">{summary.count}</p></div><div className="w-px bg-gray-700"></div><div><p className="text-xs text-gray-400">Coverage</p><p className="font-bold text-lg text-gray-100">₹<CountUp end={summary.coverage} /></p></div><div className="w-px bg-gray-700"></div><div><p className="text-xs text-gray-400">Annual Premium</p><p className="font-bold text-lg text-gray-100">₹<CountUp end={summary.premium} /></p></div></div>
                {policies.length > 0 ? <div className="space-y-3 max-h-72 overflow-y-auto no-scrollbar pr-2">{policies.map(p => <div key={p.id} className="bg-black/30 p-4 rounded-xl animate-fade-in hover:bg-black/50 transition-colors"><div className="flex justify-between items-start"><div><p className="font-bold text-gray-100">{p.provider}</p><p className="text-xs text-gray-400">Coverage: ₹{p.coverage.toLocaleString('en-IN')}</p></div><span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{p.type}</span></div><div className="flex justify-between items-end mt-3 pt-3 border-t border-white/10"><div><p className="text-xs text-gray-500">Premium</p><p className="text-sm font-semibold text-gray-200">₹{p.premium.toLocaleString('en-IN')} / {p.premiumFrequency === 'Monthly' ? 'mo' : 'yr'}</p></div><div className="flex items-center gap-3 text-xs font-semibold"><button className="text-gray-400 hover:text-white">Details</button><button onClick={() => handleEditClick(p)} className="text-sky-400 hover:text-sky-300">Edit</button><button onClick={() => deleteInsurancePolicy(p.id)} className="text-red-500/70 hover:text-red-500">Delete</button></div></div></div>)}</div> : <p className="text-center text-gray-400 p-8">No policies added yet. Your added policies will appear here.</p>}
            </GlassmorphicPanel>
            {isModalOpen && <AddEditPolicyModal onClose={() => setIsModalOpen(false)} onSave={handleSavePolicy} policyToEdit={editingPolicy} />}
        </>
    );
};

const AddEditPolicyModal: FC<{onClose:() => void, onSave: (policy: Omit<InsurancePolicy, 'id'>, id?: string) => void, policyToEdit: InsurancePolicy | null}> = ({onClose, onSave, policyToEdit}) => {
    const [provider, setProvider] = useState(policyToEdit?.provider || '');
    const [type, setType] = useState<'Term Life' | 'Health' | 'Car' | 'Other'>(policyToEdit?.type || 'Health');
    const [coverage, setCoverage] = useState(policyToEdit?.coverage?.toString() || '');
    const [premium, setPremium] = useState(policyToEdit?.premium?.toString() || '');
    const [premiumFrequency, setPremiumFrequency] = useState<'Monthly' | 'Annually'>(policyToEdit?.premiumFrequency || 'Annually');
    const [renewalDate, setRenewalDate] = useState(policyToEdit?.premiumDueDate.split('T')[0] || new Date().toISOString().split('T')[0]);

    const handleSave = () => {
        if(provider && coverage && premium && parseFloat(coverage) > 0 && parseFloat(premium) > 0) {
            onSave({provider, type, coverage: parseFloat(coverage), premium: parseFloat(premium), premiumFrequency, premiumDueDate: renewalDate, expiryDate: renewalDate}, policyToEdit?.id);
        } else { alert("Please fill all fields with valid values."); }
    }
    return <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"><GlassmorphicPanel className="w-full max-w-md"><h2 className="text-xl font-bold mb-4">{policyToEdit ? 'Edit' : 'Add'} Policy</h2><div className="space-y-4"><input value={provider} onChange={e=>setProvider(e.target.value)} placeholder="Provider / Policy Name" className="w-full bg-black/30 p-3 rounded-lg border border-gray-700" /><select value={type} onChange={e=>setType(e.target.value as any)} className="w-full bg-black/30 p-3 rounded-lg border border-gray-700"><option>Health</option><option>Term Life</option><option>Car</option><option>Other</option></select><input value={coverage} onChange={e=>setCoverage(e.target.value)} type="number" placeholder="Coverage Amount (₹)" className="w-full bg-black/30 p-3 rounded-lg border border-gray-700" /><div className="flex gap-2"><input value={premium} onChange={e=>setPremium(e.target.value)} type="number" placeholder="Premium (₹)" className="w-2/3 bg-black/30 p-3 rounded-lg border border-gray-700" /><select value={premiumFrequency} onChange={e=>setPremiumFrequency(e.target.value as any)} className="w-1/3 bg-black/30 p-3 rounded-lg border border-gray-700"><option>Annually</option><option>Monthly</option></select></div><div><label className="text-xs text-gray-400">Next Premium Due</label><input value={renewalDate} onChange={e=>setRenewalDate(e.target.value)} type="date" className="w-full bg-black/30 p-3 rounded-lg border border-gray-700 mt-1" /></div></div><button onClick={handleSave} className="w-full mt-6 py-3 bg-sky-500 rounded-lg font-semibold text-white">Save Policy</button><button onClick={onClose} className="w-full mt-2 py-2 bg-gray-800/50 rounded-lg text-gray-300">Cancel</button></GlassmorphicPanel></div>;
};

const VisualInsightsPanel: FC<{ policies: InsurancePolicy[] }> = ({ policies }) => {
    const [activeChart, setActiveChart] = useState<'coverage' | 'premium'>('coverage');
    const { pieData, barData } = useMemo(() => {
        const COLORS = { 'Term Life': '#0ea5e9', 'Health': '#10b981', 'Car': '#f97316', 'Other': '#6366f1' };
        const coverage = policies.reduce((a,p) => ({...a, [p.type]: (a[p.type]||0)+p.coverage}), {} as Record<string,number>);
        const premium = policies.reduce((a,p) => ({...a, [p.type]: (a[p.type]||0)+(p.premiumFrequency==='Monthly'?p.premium*12:p.premium)}), {} as Record<string,number>);
        return {
            pieData: Object.entries(coverage).map(([name, value]) => ({ name, value, fill: COLORS[name as keyof typeof COLORS] || '#9ca3af' })),
            barData: Object.entries(premium).map(([name, value]) => ({ name, value, fill: COLORS[name as keyof typeof COLORS] || '#9ca3af' }))
        };
    }, [policies]);

    if (policies.length === 0) {
        return (
            <GlassmorphicPanel className="!p-5 animate-slide-up-fade-in" style={{ animationDelay: '600ms' }}>
                 <h2 className="text-xl font-bold mb-4">Visual Insights</h2>
                 <div className="text-center py-16 text-gray-400">Add a policy to see visual insights.</div>
            </GlassmorphicPanel>
        );
    }

    return(
        <GlassmorphicPanel className="!p-5 animate-slide-up-fade-in" style={{ animationDelay: '600ms' }}>
            <h2 className="text-xl font-bold mb-4">Visual Insights</h2>
            <div className="flex justify-center bg-black/20 p-1 rounded-full mb-4"><button onClick={()=>setActiveChart('coverage')} className={`px-4 py-1.5 w-1/2 rounded-full text-sm font-semibold transition-all ${activeChart==='coverage'?'bg-sky-500 text-white':'text-gray-400'}`}>Coverage</button><button onClick={()=>setActiveChart('premium')} className={`px-4 py-1.5 w-1/2 rounded-full text-sm font-semibold transition-all ${activeChart==='premium'?'bg-sky-500 text-white':'text-gray-400'}`}>Premium</button></div>
            <div className="relative h-64 overflow-hidden"><div className={`absolute inset-0 transition-all duration-500 ease-in-out ${activeChart === 'premium' ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0'}`}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(e) => `${(e.percent * 100).toFixed(0)}%`} /><Tooltip formatter={(v:number) => `₹${v.toLocaleString('en-IN')}`} /></PieChart></ResponsiveContainer></div><div className={`absolute inset-0 transition-all duration-500 ease-in-out ${activeChart === 'premium' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}><ResponsiveContainer width="100%" height="100%"><BarChart data={barData} layout="vertical" margin={{right: 50}}><XAxis type="number" hide /><YAxis type="category" dataKey="name" hide /><Tooltip formatter={(v:number) => `₹${v.toLocaleString('en-IN')}/yr`} /><Bar dataKey="value" radius={[0,8,8,0]} barSize={20} label={{ position: 'right', fill: '#e5e7eb', formatter: (v:number) => `₹${v.toLocaleString()}` }}>{barData.map(e => <Cell key={e.name} />)}</Bar></BarChart></ResponsiveContainer></div></div>
        </GlassmorphicPanel>
    );
};

const FaqPanel: FC<{ onNavigate: (v: string) => void; searchTerm: string; refProp: React.Ref<HTMLDivElement>}> = ({ onNavigate, searchTerm, refProp }) => {
    const allFaqs = [{ q: "What’s the right age to buy term insurance?", a: "The best age is as early as possible, ideally in your 20s. Premiums are significantly lower when you are young and healthy." },{ q: "Can I hold multiple health policies?", a: "Yes, you can hold multiple health insurance policies. You can claim from any of them, but the total claim amount cannot exceed the actual medical expense." },{ q: "Why choose Ditto?", a: "Ditto offers unbiased, spam-free advice from certified advisors and provides excellent claim support, making the process hassle-free." },{ q: "What happens if I miss a renewal date?", a: "Most insurers provide a grace period (usually 15-30 days) to pay the premium. If you miss the grace period, your policy will lapse, and you will lose coverage." }];
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const filteredFaqs = useMemo(() => allFaqs.filter(faq => faq.q.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm]);

    return (
        <GlassmorphicPanel ref={refProp} className="!p-5 animate-slide-up-fade-in" style={{ animationDelay: '900ms' }}>
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-2">{filteredFaqs.map((faq, index) => <div key={index} className="bg-black/30 rounded-lg overflow-hidden"><button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex justify-between items-center text-left p-4"><span className="font-semibold text-gray-200">{faq.q}</span><ChevronDownIcon className={`transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`} /></button><div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${openFaq === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="px-4 pb-4 text-sm text-gray-400">
                        {faq.a}
                    </div>
                </div>
            </div></div>)}</div>
        </GlassmorphicPanel>
    );
};

const InsuranceScreen: FC<{ onBack: () => void; onNavigate: (view: string, params?: any) => void; }> = ({ onBack, onNavigate }) => {
    const { insurancePolicies } = useContext(FinancialContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [showWhyDitto, setShowWhyDitto] = useState(false);
    const [showChecklistDetails, setShowChecklistDetails] = useState(false);
    const gapsRef = useRef<HTMLDivElement>(null);
    const faqRef = useRef<HTMLDivElement>(null);

    const filteredPolicies = useMemo(() => {
        if (!searchTerm) return insurancePolicies;
        return insurancePolicies.filter(p => p.provider.toLowerCase().includes(searchTerm.toLowerCase()) || p.type.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [insurancePolicies, searchTerm]);

    return (
        <>
            <div className="h-full flex flex-col bg-[#0D1117] text-gray-200 animate-fade-in">
                <header className="sticky top-0 z-20 p-4 bg-[#0D1117]/80 backdrop-blur-xl">
                    <div className="flex items-center">
                        <button onClick={onBack} className="p-2 -ml-2 text-gray-300 rounded-full hover:bg-white/10"><ChevronLeftIcon /></button>
                        <div className="flex-1"></div>
                        <div className="w-8"></div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto no-scrollbar p-6 pt-0 space-y-6">
                    <VaultHeaderPanel searchTerm={searchTerm} setSearchTerm={setSearchTerm} onNavigate={onNavigate} />
                    <ChecklistPanel onOpenDetails={() => setShowChecklistDetails(true)} />
                    <GapsAndRecommendationsPanel policies={filteredPolicies} refProp={gapsRef} />
                    <MyPoliciesWalletPanel policies={filteredPolicies} />
                    <CoreFeaturesPanel onWhyDittoClick={() => setShowWhyDitto(true)} />
                    <VisualInsightsPanel policies={filteredPolicies} />
                    <AIChatTeaserPanel onNavigate={onNavigate} />
                    <LearningHubAndToolsPanel onNavigate={onNavigate} />
                    <FaqPanel onNavigate={onNavigate} searchTerm={searchTerm} refProp={faqRef} />
                </main>
            </div>
            {showWhyDitto && <WhyDittoModal onClose={() => setShowWhyDitto(false)} />}
            {showChecklistDetails && <ChecklistDetailModal onClose={() => setShowChecklistDetails(false)} />}
        </>
    );
};

// FIX: Change to a default export to resolve the import error in `App.tsx`.
export default InsuranceScreen;