import React, { useState, useEffect, useMemo, FC, useContext } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { LightBulbIcon } from '../components/icons/LightBulbIcon';
import { TrendingUpIcon } from '../components/icons/TrendingUpIcon';
import { BankIcon } from '../components/icons/BankIcon';
import { InvestIcon } from '../components/icons/InvestIcon';
import { RealEstateIcon } from '../components/icons/RealEstateIcon';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import { OtherAssetsIcon } from '../components/icons/OtherAssetsIcon';
import { CreditCardIcon } from '../components/icons/CreditCardIcon';
import { ReceiptPercentIcon } from '../components/icons/ReceiptPercentIcon';
import { ToolsIcon } from '../components/icons/ToolsIcon';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';
import { XIcon } from '../components/icons/XIcon';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';
import { Asset, Liability, AssetType, LiabilityType } from '../types';
import { FinancialContext } from '../App';

// --- HELPER & UTILITY COMPONENTS ---

const GlassmorphicPanel: FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/30 ${className}`}>
        {children}
    </div>
);

const CountUp: FC<{ end: number; duration?: number; prefix?: string; suffix?: string; decimals?: number; className?: string; }> = ({ end, duration = 1500, prefix = "", suffix = "", decimals = 0, className = "" }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const endValue = end;
        if (start === endValue) return;
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(parseFloat((progress * (endValue - start)).toFixed(decimals)));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setCount(endValue);
            }
        };
        window.requestAnimationFrame(step);
    }, [end, duration, decimals]);

    return <span className={className}>{prefix}{count.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
};

// --- MODAL COMPONENTS ---

const BaseModal: FC<{ title: string; children: React.ReactNode; onClose: () => void; onSave: () => void; }> = ({ title, children, onClose, onSave }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
        <GlassmorphicPanel className="w-full max-w-md relative !p-0 !bg-[#181C23] border-white/20">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white/90">{title}</h2>
                <button onClick={onClose} className="p-2 rounded-full text-white/60 hover:bg-white/10 transition-colors"><XIcon /></button>
            </div>
            <div className="p-6">{children}</div>
            <div className="bg-black/20 px-6 py-4 rounded-b-3xl flex justify-end space-x-3 border-t border-white/10">
                <button onClick={onClose} className="px-5 py-2.5 bg-white/10 border border-white/20 text-white/80 font-semibold rounded-xl hover:bg-white/20 transition-colors">Cancel</button>
                <button onClick={onSave} className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/10 hover:scale-105 transition-transform transform">Save</button>
            </div>
        </GlassmorphicPanel>
    </div>
);

const GoalEntryModal: FC<{ onClose: () => void; onSave: (goal: { target: number; date: string }) => void; }> = ({ onClose, onSave }) => {
    const [target, setTarget] = useState('');
    const [date, setDate] = useState('');

    const handleSave = () => {
        if (parseFloat(target) > 0 && date) {
            onSave({ target: parseFloat(target), date });
        }
    };
    
    return (
        <BaseModal title="Set Wealth Target" onClose={onClose} onSave={handleSave}>
            <form className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-white/70">Target Amount (₹)</label>
                    <input type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder="10000000" className="w-full bg-black/30 border border-white/20 rounded-lg p-3 mt-1 text-white/90 focus:ring-2 focus:ring-sky-500 transition placeholder:text-white/40" />
                </div>
                <div>
                    <label className="text-sm font-medium text-white/70">Target Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-black/30 border border-white/20 rounded-lg p-3 mt-1 text-white/90 focus:ring-2 focus:ring-sky-500 transition" />
                </div>
            </form>
        </BaseModal>
    );
};

const AssetEntryModal: FC<{ onClose: () => void; onSave: (asset: Omit<Asset, 'id'>) => void; }> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [type, setType] = useState<AssetType>('Investments');
    
    const handleSave = () => {
        if (name && parseFloat(value) > 0) {
            onSave({ name, value: parseFloat(value), type });
        }
    };

    return (
        <BaseModal title="Add New Asset" onClose={onClose} onSave={handleSave}>
            <form className="space-y-4">
                 <div>
                    <label className="text-sm font-medium text-white/70">Asset Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Nifty 50 Index Fund" className="w-full bg-black/30 border border-white/20 rounded-lg p-3 mt-1 text-white/90 focus:ring-2 focus:ring-sky-500 transition placeholder:text-white/40" />
                </div>
                <div>
                    <label className="text-sm font-medium text-white/70">Asset Type</label>
                    <select value={type} onChange={e => setType(e.target.value as AssetType)} className="w-full bg-black/30 border border-white/20 rounded-lg p-3 mt-1 text-white/90 focus:ring-2 focus:ring-sky-500 transition">
                        <option>Cash</option><option>Investments</option><option>Real Estate</option><option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-white/70">Current Value (₹)</label>
                    <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="50000" className="w-full bg-black/30 border border-white/20 rounded-lg p-3 mt-1 text-white/90 focus:ring-2 focus:ring-sky-500 transition placeholder:text-white/40" />
                </div>
            </form>
        </BaseModal>
    );
};

const LiabilityEntryModal: FC<{ onClose: () => void; onSave: (liability: Omit<Liability, 'id'>) => void; }> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [type, setType] = useState<LiabilityType>('Loan');

    const handleSave = () => {
        if (name && parseFloat(value) > 0) {
            onSave({ name, value: parseFloat(value), type });
        }
    };

    return (
        <BaseModal title="Add New Liability" onClose={onClose} onSave={handleSave}>
            <form className="space-y-4">
                 <div>
                    <label className="text-sm font-medium text-white/70">Liability Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., HDFC Home Loan" className="w-full bg-black/30 border border-white/20 rounded-lg p-3 mt-1 text-white/90 focus:ring-2 focus:ring-sky-500 transition placeholder:text-white/40" />
                </div>
                <div>
                    <label className="text-sm font-medium text-white/70">Liability Type</label>
                    <select value={type} onChange={e => setType(e.target.value as LiabilityType)} className="w-full bg-black/30 border border-white/20 rounded-lg p-3 mt-1 text-white/90 focus:ring-2 focus:ring-sky-500 transition">
                        <option>Loan</option><option>Credit Card</option><option>EMI</option><option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-white/70">Outstanding Amount (₹)</label>
                    <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="25000" className="w-full bg-black/30 border border-white/20 rounded-lg p-3 mt-1 text-white/90 focus:ring-2 focus:ring-sky-500 transition placeholder:text-white/40" />
                </div>
            </form>
        </BaseModal>
    );
};


// --- SUB-COMPONENTS for Net Worth Screen ---

const NetWorthHero: FC<{ netWorth: number; monthlyChange: number; onSetGoal: () => void; hasData: boolean; }> = ({ netWorth, monthlyChange, onSetGoal, hasData }) => (
    <GlassmorphicPanel className="relative group text-center">
        <div className="absolute top-4 right-4 bg-black/30 text-white/50 text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Net Worth = Assets – Liabilities
        </div>
        <h1 className="text-2xl font-bold text-white/90">Your Net Worth</h1>
        <p className="text-sm text-white/60 mb-4">Track the trajectory of your total wealth.</p>
        
        <div className="flex items-baseline justify-center space-x-4 my-2">
            <h2 className="text-5xl font-bold" style={{ color: '#FFD700' }}>
                <CountUp end={netWorth} prefix="₹" />
            </h2>
            {hasData && (
                <div className={`flex items-center space-x-1 ${monthlyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        {monthlyChange >= 0 ? 
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /> :
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        }
                    </svg>
                    <span className="font-semibold text-lg drop-shadow-[0_0_5px_rgba(60,208,112,0.7)]">
                        <CountUp end={monthlyChange} decimals={1} suffix="%" />
                    </span>
                </div>
            )}
        </div>
        <button onClick={onSetGoal} className="text-sky-400 hover:text-sky-300 text-sm font-semibold transition-colors mt-4">
            Add Wealth Target (e.g., ₹1 Cr in 5 years)
        </button>
    </GlassmorphicPanel>
);

const GoalTrackingPanel: FC<{ goal: { target: number; date: string } | null; current: number; }> = ({ goal, current }) => {
    if (!goal) return null;
    const progress = Math.min((current / goal.target) * 100, 100);
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const timer = setTimeout(() => setWidth(progress), 100);
        return () => clearTimeout(timer);
    }, [progress]);

    return (
        <GlassmorphicPanel>
            <h2 className="text-xl font-bold text-white/90 mb-3">Goal: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(goal.target)} by {new Date(goal.date).toLocaleDateString('en-IN', {year: 'numeric', month: 'short'})}</h2>
            <div className="relative w-full bg-black/30 rounded-full h-3.5">
                <div className="absolute -top-6 text-2xl transition-all duration-1500 ease-out" style={{ left: `calc(${width}% - 12px)` }}>
                     <span className="animate-float drop-shadow-[0_0_8px_rgba(255,215,0,0.7)]" style={{animationDelay: `-${Math.random() * 4}s`}}>⭐</span>
                </div>
                <div className="h-3.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-1500 ease-out" style={{ width: `${width}%`, boxShadow: '0 0 12px #FFD70080' }}></div>
            </div>
            <div className="flex justify-between text-sm mt-2 font-semibold">
                <span className="text-white/80">₹<CountUp end={current}/></span>
                <span className="text-white/60"><CountUp end={progress} decimals={1}/>% Complete</span>
            </div>
        </GlassmorphicPanel>
    );
};

const AssetsLiabilitiesPanel: FC<{ title: string; data: (Asset | Liability | any)[]; total: number; type: 'asset' | 'liability', onAdd: () => void; onDelete: (id: string) => void }> = ({ title, data, total, type, onAdd, onDelete }) => {
    
    const assetIcons: Record<AssetType, React.ReactNode> = {
        'Cash': <BankIcon className="text-sky-400" />,
        'Investments': <InvestIcon />,
        'Real Estate': <RealEstateIcon className="text-green-400" />,
        'Other': <OtherAssetsIcon className="text-gray-400" />,
    };

    const liabilityIcons: Record<LiabilityType, React.ReactNode> = {
        'Loan': <RealEstateIcon className="text-red-400" />,
        'Credit Card': <CreditCardIcon className="text-orange-400" />,
        'EMI': <ReceiptPercentIcon className="text-rose-400" />,
        'Other': <OtherAssetsIcon className="text-gray-400" />,
    };

    const accentColor = type === 'asset' ? '#3CD070' : '#FF5C5C';

    return (
        <GlassmorphicPanel>
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-white/90">{title}</h2>
                 <button onClick={onAdd} className="flex items-center space-x-1.5 text-sm font-semibold text-sky-300 bg-black/20 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                    <PlusCircleIcon />
                </button>
            </div>
            {data.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No {type}s added yet.</p>
                    <p className="text-sm">Click the '+' button to add one.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data.map((item) => (
                        <div key={item.id} className="group">
                            <div className="flex justify-between items-center text-sm mb-1.5">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-black/20 p-2 rounded-lg">{type === 'asset' ? assetIcons[item.type as AssetType] : liabilityIcons[item.type as LiabilityType]}</div>
                                    <span className="font-semibold text-white/80">{item.name}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="text-right">
                                        <p className="font-bold text-white/90">₹{item.value.toLocaleString('en-IN')}</p>
                                        <p className="text-xs text-white/50">{total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%</p>
                                    </div>
                                    {!item.isReadOnly && <button onClick={() => onDelete(item.id)} className="p-1 rounded-full text-red-500/50 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <XIcon className="w-4 h-4" />
                                    </button>}
                                </div>
                            </div>
                            <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                                <div className="h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: total > 0 ? `${(item.value / total) * 100}%` : '0%', backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}60` }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </GlassmorphicPanel>
    );
};


const NetWorthTrendChart: FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
    return (
        <GlassmorphicPanel>
            <h2 className="text-2xl font-bold text-white/90 mb-4">Net Worth Trend</h2>
            <div className="h-60">
                {data.length > 1 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FFD700" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip contentStyle={{ background: 'rgba(13, 17, 23, 0.8)', backdropFilter: 'blur(5px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#e5e7eb' }} />
                            <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false}/>
                            <Area type="monotone" dataKey="value" stroke="#FFD700" strokeWidth={3} fill="url(#goldGradient)" dot={{ r: 4, stroke: '#0D1117', strokeWidth: 2, fill: '#FFD700' }} activeDot={{ r: 8, stroke: '#0D1117', strokeWidth: 3 }} isAnimationActive={true} animationDuration={1500}/>
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Add more data points to see your trend over time.</p>
                    </div>
                )}
            </div>
        </GlassmorphicPanel>
    );
};

const NetWorthCompositionChart: FC<{ totalAssets: number; totalLiabilities: number }> = ({ totalAssets, totalLiabilities }) => {
    const data = [ { name: 'Assets', value: totalAssets }, { name: 'Liabilities', value: totalLiabilities } ].filter(d => d.value > 0);
    const COLORS = ['#3CD070', '#FF5C5C'];

    return (
        <GlassmorphicPanel>
            <h2 className="text-2xl font-bold text-white/90 mb-4">Composition</h2>
            <div className="h-60 relative">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={'65%'} outerRadius={'85%'} paddingAngle={5} isAnimationActive={true} animationDuration={1200}>
                                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Your asset vs. liability chart will appear here.</p>
                    </div>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-white/60 text-sm">Net Worth</p>
                    <p className="text-3xl font-bold text-white/90"><CountUp end={totalAssets - totalLiabilities} prefix="₹" /></p>
                </div>
            </div>
        </GlassmorphicPanel>
    );
};

const AIInsightsPanel: FC<{ assets: (Asset | any)[], totalAssets: number, totalLiabilities: number, goal: any }> = ({ assets, totalAssets, totalLiabilities, goal }) => {
    const insights = useMemo(() => {
        const generated: { icon: React.ReactNode; text: string }[] = [];
        if (totalAssets === 0 && totalLiabilities === 0) {
            generated.push({ icon: <LightBulbIcon />, text: "Let's get started! Add your first asset or liability to calculate your net worth and unlock personalized insights." });
            return generated;
        }

        const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
        const cashAsset = assets.find(a => a.type === 'Cash');
        const cashPercentage = totalAssets > 0 && cashAsset ? (cashAsset.value / totalAssets) * 100 : 0;

        if (debtToAssetRatio > 50) {
            generated.push({ icon: <TrendingUpIcon />, text: `Your debt-to-asset ratio is ${debtToAssetRatio.toFixed(0)}%. Consider creating a plan to tackle high-interest liabilities to accelerate wealth growth.` });
        } else if (debtToAssetRatio > 0) {
             generated.push({ icon: <TrendingUpIcon />, text: `Your debt-to-asset ratio is a healthy ${debtToAssetRatio.toFixed(0)}%. You're managing your liabilities well.` });
        }

        if (cashPercentage > 25) {
            generated.push({ icon: <BankIcon className="text-sky-400" />, text: `Over ${cashPercentage.toFixed(0)}% of your assets are in cash. While great for emergencies, consider investing some to beat inflation.` });
        }

        if (!goal) {
            generated.push({ icon: <LightBulbIcon />, text: "Setting a net worth goal can be a powerful motivator. Tap the 'Add Wealth Target' button to set yours!" });
        }
        
        if(generated.length === 0){
             generated.push({ icon: <LightBulbIcon />, text: "Your financial health is looking solid. Keep tracking consistently to stay on top of your goals." });
        }

        return generated.slice(0, 3);
    }, [assets, totalAssets, totalLiabilities, goal]);
    
    return (
        <GlassmorphicPanel>
            <h2 className="text-2xl font-bold text-white/90 mb-4">Actionable Financial Intelligence</h2>
            <div className="space-y-4">
                {insights.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-black/20 p-4 rounded-2xl animate-slide-in-bottom" style={{animationDelay: `${index * 100}ms`}}>
                        <div className="flex-shrink-0">{item.icon}</div>
                        <p className="text-sm text-white/80">{item.text}</p>
                    </div>
                ))}
            </div>
        </GlassmorphicPanel>
    );
};

const NetWorthScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { assets, addAsset, deleteAsset, liabilities, addLiability, deleteLiability, investments, debts } = useContext(FinancialContext);
    
    const [goal, setGoal] = useState<{ target: number; date: string } | null>(null);
    const [history, setHistory] = useState<{ name: string; value: number }[]>([]);
    const [monthlyChange, setMonthlyChange] = useState(0);

    const [isGoalModalOpen, setGoalModalOpen] = useState(false);
    const [isAssetModalOpen, setAssetModalOpen] = useState(false);
    const [isLiabilityModalOpen, setLiabilityModalOpen] = useState(false);

    const { totalAssets, totalLiabilities, netWorth, allAssets, allLiabilities } = useMemo(() => {
        const ta = assets.reduce((sum, item) => sum + item.value, 0) + investments.reduce((sum, item) => sum + item.value, 0);
        const tl = liabilities.reduce((sum, item) => sum + item.value, 0) + debts.reduce((sum, item) => sum + item.amount, 0);
        const nw = ta - tl;

        const combinedAssets = [
            ...assets,
            ...investments.map(inv => ({ ...inv, type: 'Investments' as AssetType, value: inv.value, isReadOnly: true }))
        ];
        const combinedLiabilities = [
            ...liabilities,
            ...debts.map(d => ({ ...d, type: 'Loan' as LiabilityType, value: d.amount, isReadOnly: true }))
        ];

        return { totalAssets: ta, totalLiabilities: tl, netWorth: nw, allAssets: combinedAssets, allLiabilities: combinedLiabilities };
    }, [assets, liabilities, investments, debts]);

    useEffect(() => {
        const hasData = allAssets.length > 0 || allLiabilities.length > 0;
        if (hasData) {
            setHistory(prev => {
                const now = new Date().toLocaleString('default', { month: 'short' });
                if (prev.length === 0) {
                    setMonthlyChange(Math.random() * 5 + 1); 
                    return [
                        { name: 'Jan', value: netWorth * (Math.random() * 0.2 + 0.7) },
                        { name: 'Feb', value: netWorth * (Math.random() * 0.1 + 0.8) },
                        { name: 'Mar', value: netWorth * (Math.random() * 0.1 + 0.9) },
                        { name: now, value: netWorth }
                    ];
                }
                const lastEntry = prev[prev.length - 1];
                if (lastEntry.value !== 0) {
                     setMonthlyChange(((netWorth - lastEntry.value) / lastEntry.value) * 100);
                }
                if (lastEntry.name === now) {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1] = { ...newHistory[newHistory.length - 1], value: netWorth };
                    return newHistory;
                }
                return [...prev, { name: now, value: netWorth }];
            });
        } else {
            setHistory([]);
            setMonthlyChange(0);
        }
    }, [netWorth, allAssets.length, allLiabilities.length]);

    const handleAddAsset = (asset: Omit<Asset, 'id'>) => {
        addAsset(asset);
        setAssetModalOpen(false);
    };
   
    const handleAddLiability = (liability: Omit<Liability, 'id'>) => {
        addLiability(liability);
        setLiabilityModalOpen(false);
    };
    
    const handleSetGoal = (newGoal: { target: number; date: string }) => {
        setGoal(newGoal);
        setGoalModalOpen(false);
    };
    
    return (
        <>
            {isGoalModalOpen && <GoalEntryModal onClose={() => setGoalModalOpen(false)} onSave={handleSetGoal} />}
            {isAssetModalOpen && <AssetEntryModal onClose={() => setAssetModalOpen(false)} onSave={handleAddAsset} />}
            {isLiabilityModalOpen && <LiabilityEntryModal onClose={() => setLiabilityModalOpen(false)} onSave={handleAddLiability} />}
            
            <div className="bg-[#0D1117] text-white">
                <header className="sticky top-0 z-20 flex items-center p-4 bg-[#0D1117]/80 backdrop-blur-sm">
                    <button onClick={onBack} className="p-2 -ml-2 text-gray-300 rounded-full hover:bg-white/10">
                        <ChevronLeftIcon />
                    </button>
                    <div className="w-8"></div>
                </header>

                <div className="p-6 pt-0 space-y-6">
                    <NetWorthHero netWorth={netWorth} monthlyChange={monthlyChange} onSetGoal={() => setGoalModalOpen(true)} hasData={allAssets.length > 0 || allLiabilities.length > 0} />
                    <GoalTrackingPanel goal={goal} current={netWorth} />
                    <AssetsLiabilitiesPanel title="Wealth Holdings Summary" data={allAssets} total={totalAssets} type="asset" onAdd={() => setAssetModalOpen(true)} onDelete={deleteAsset} />
                    <AssetsLiabilitiesPanel title="Obligations & Debt Profile" data={allLiabilities} total={totalLiabilities} type="liability" onAdd={() => setLiabilityModalOpen(true)} onDelete={deleteLiability} />
                    <NetWorthTrendChart data={history} />
                    <NetWorthCompositionChart totalAssets={totalAssets} totalLiabilities={totalLiabilities} />
                    <AIInsightsPanel assets={allAssets} totalAssets={totalAssets} totalLiabilities={totalLiabilities} goal={goal} />
                </div>
            </div>
        </>
    );
};

export default NetWorthScreen;