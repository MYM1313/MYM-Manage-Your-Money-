import React, { useState, useMemo, useEffect, FC } from 'react';
import { CalculatorInfo } from '../constants';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Sector, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import GlassmorphicPanel from '../components/shared/Card';
import { XIcon } from '../components/icons/XIcon';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';

// --- SHARED UTILITY & UI COMPONENTS ---

const CountUp: FC<{ end: number; duration?: number; prefix?: string; suffix?: string; decimals?: number; }> = ({ end, duration = 1000, prefix = "", suffix = "", decimals = 0 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (isNaN(end) || !isFinite(end)) {
            setCount(0);
            return;
        }
        let start = 0;
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = progress * (end - start);
            setCount(parseFloat(current.toFixed(decimals)));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };
        window.requestAnimationFrame(step);
    }, [end, duration, decimals]);
    return <span>{prefix}{count.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
};

const CalculatorInput: FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string, unit?: string }> = ({ label, unit, ...props }) => (
    <div>
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <div className="flex items-center bg-black/30 border border-white/10 rounded-xl p-3 mt-2">
            {unit && <span className="text-lg font-semibold text-gray-300 mr-2">{unit}</span>}
            <input {...props} className="w-full bg-transparent text-lg font-bold text-gray-100 focus:outline-none" />
        </div>
    </div>
);

const CalculatorSlider: FC<{ label: string; value: number; onUpdate: (v: number) => void; min: number; max: number; unit: string; step?: number }> = ({ label, value, onUpdate, min, max, unit, step=1 }) => {
    const progress = ((value - min) / (max - min)) * 100;
    const sliderStyle = { background: `linear-gradient(to right, #38bdf8 0%, #38bdf8 ${progress}%, rgba(10, 20, 40, 0.5) ${progress}%, rgba(10, 20, 40, 0.5) 100%)` };
    return (
        <div>
            <div className="flex justify-between items-baseline mb-2">
                <label className="text-sm font-medium text-gray-400">{label}</label>
                <span className="text-lg font-bold text-gray-100">{value.toLocaleString('en-IN')} {unit}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value} onChange={e => onUpdate(Number(e.target.value))} style={sliderStyle} className="w-full range-blue" />
        </div>
    );
};

const FormattedResult: FC<{ label: string; value: number; subtext?: string; isPrimary?: boolean; colorClass?: string }> = ({ label, value, subtext, isPrimary, colorClass = 'text-gray-200' }) => (
    <div className={isPrimary ? 'text-center' : 'text-left'}>
        <p className={`text-sm ${isPrimary ? 'text-gray-300' : 'text-gray-400'}`}>{label}</p>
        <p className={`${isPrimary ? 'text-5xl tracking-tight' : 'text-2xl'} font-bold ${isPrimary ? 'text-sky-300 text-glow-blue' : colorClass}`}>
            <CountUp end={value} prefix="₹" />
        </p>
        {subtext && <p className="text-xs text-gray-400 mt-1 h-4">{subtext}</p>}
    </div>
);

const CalculatorChart: FC<{ data: any[]; dataKey: string; color: string; gradientId: string; xAxisKey?: string }> = ({ data, dataKey, color, gradientId, xAxisKey = "year" }) => (
    <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Tooltip contentStyle={{ background: 'rgba(13, 17, 23, 0.8)', backdropFilter: 'blur(5px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                <XAxis dataKey={xAxisKey} unit={xAxisKey === "year" ? "y" : ""} tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fill={`url(#${gradientId})`} dot={{ r: 4, stroke: '#0D1117', strokeWidth: 2, fill: color }} activeDot={{ r: 8, stroke: '#0D1117', strokeWidth: 3 }} animationDuration={1000} />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);


// --- INVESTING CALCULATORS ---

const SIPCalculator: FC = () => {
    const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
    const [returnRate, setReturnRate] = useState(12);
    const [period, setPeriod] = useState(10);

    const { futureValue, totalInvestment, returns, chartData } = useMemo(() => {
        const i = returnRate / 100 / 12;
        const n = period * 12;
        const fv = i > 0 ? monthlyInvestment * ((((1 + i) ** n) - 1) / i) * (1 + i) : monthlyInvestment * n;
        const totalInv = monthlyInvestment * n;
        const data = Array.from({ length: period + 1 }).map((_, year) => {
            const months = year * 12;
            const value = i > 0 ? monthlyInvestment * ((((1 + i) ** months) - 1) / i) * (1 + i) : monthlyInvestment * months;
            return { year, value: Math.round(value) };
        });
        return { futureValue: fv, totalInvestment: totalInv, returns: fv - totalInv, chartData: data };
    }, [monthlyInvestment, returnRate, period]);

    return (
        <div className="space-y-6">
            <GlassmorphicPanel className="space-y-6">
                <CalculatorSlider label="Monthly Investment" value={monthlyInvestment} onUpdate={setMonthlyInvestment} min={500} max={100000} step={500} unit="₹" />
                <CalculatorSlider label="Expected Return Rate" value={returnRate} onUpdate={setReturnRate} min={1} max={30} unit="% p.a." />
                <CalculatorSlider label="Investment Period" value={period} onUpdate={setPeriod} min={1} max={40} unit="Years" />
            </GlassmorphicPanel>
            <GlassmorphicPanel className="!p-0 overflow-hidden">
                <div className="p-6"><FormattedResult label="Maturity Value" value={futureValue} isPrimary /></div>
                <div className="grid grid-cols-2 bg-black/20 px-6 py-4 border-t border-sky-400/20">
                    <FormattedResult label="Total Invested" value={totalInvestment} />
                    <FormattedResult label="Net Gains" value={returns} colorClass="text-green-400" />
                </div>
            </GlassmorphicPanel>
            <GlassmorphicPanel><CalculatorChart data={chartData} dataKey="value" color="#38bdf8" gradientId="sipGradient" /></GlassmorphicPanel>
        </div>
    );
};

const LumpsumCalculator: FC = () => {
    const [investment, setInvestment] = useState(100000);
    const [returnRate, setReturnRate] = useState(12);
    const [period, setPeriod] = useState(10);

    const { futureValue, totalGains, chartData } = useMemo(() => {
        const r = returnRate / 100;
        const fv = investment * Math.pow(1 + r, period);
        const data = Array.from({ length: period + 1 }).map((_, year) => ({ year, value: Math.round(investment * Math.pow(1 + r, year)) }));
        return { futureValue: fv, totalGains: fv - investment, chartData: data };
    }, [investment, returnRate, period]);

    return (
        <div className="space-y-6">
            <GlassmorphicPanel className="space-y-6">
                <CalculatorSlider label="Total Investment" value={investment} onUpdate={setInvestment} min={1000} max={10000000} step={1000} unit="₹" />
                <CalculatorSlider label="Expected Return Rate" value={returnRate} onUpdate={setReturnRate} min={1} max={30} unit="% p.a." />
                <CalculatorSlider label="Investment Period" value={period} onUpdate={setPeriod} min={1} max={40} unit="Years" />
            </GlassmorphicPanel>
            <GlassmorphicPanel className="!p-0 overflow-hidden">
                <div className="p-6"><FormattedResult label="Final Value" value={futureValue} isPrimary /></div>
                <div className="bg-black/20 px-6 py-4 border-t border-sky-400/20 text-center"><FormattedResult label="Total Gains" value={totalGains} colorClass="text-green-400" /></div>
            </GlassmorphicPanel>
            <GlassmorphicPanel><CalculatorChart data={chartData} dataKey="value" color="#38bdf8" gradientId="lumpsumGradient" /></GlassmorphicPanel>
        </div>
    );
};

const GoalPlanner: FC = () => {
    const [target, setTarget] = useState(1000000);
    const [period, setPeriod] = useState(5);
    const [returnRate, setReturnRate] = useState(12);
    const [currentSavings, setCurrentSavings] = useState(0);

    const { monthlySIP, chartData } = useMemo(() => {
        const i = returnRate / 100 / 12;
        const n = period * 12;
        if (n === 0) return { monthlySIP: 0, chartData: [] };
        
        const futureValueOfCurrent = currentSavings * Math.pow(1 + i, n);
        const fvFromSIP = target - futureValueOfCurrent;
        if (fvFromSIP <= 0) return { monthlySIP: 0, chartData: [] };
        
        const sip = i > 0 ? fvFromSIP / ((((1 + i) ** n) - 1) / i) : fvFromSIP / n;

        const data = Array.from({ length: period + 1 }).map((_, year) => {
            const months = year * 12;
            const fvCurrent = currentSavings * Math.pow(1 + i, months);
            const fvSip = i > 0 ? sip * ((((1 + i) ** months) - 1) / i) : sip * months;
            return { year, value: Math.round(fvCurrent + fvSip) };
        });

        return { monthlySIP: sip, chartData: data };
    }, [target, period, returnRate, currentSavings]);

    return (
        <div className="space-y-6">
            <GlassmorphicPanel className="space-y-6">
                <CalculatorSlider label="Target Amount" value={target} onUpdate={setTarget} min={10000} max={100000000} step={10000} unit="₹" />
                <CalculatorSlider label="Current Savings" value={currentSavings} onUpdate={setCurrentSavings} min={0} max={target} step={1000} unit="₹" />
                <CalculatorSlider label="Investment Horizon" value={period} onUpdate={setPeriod} min={1} max={30} unit="Years" />
                <CalculatorSlider label="Expected Return Rate" value={returnRate} onUpdate={setReturnRate} min={1} max={30} unit="% p.a." />
            </GlassmorphicPanel>
            <GlassmorphicPanel><FormattedResult label="Monthly SIP Needed" value={monthlySIP} isPrimary /></GlassmorphicPanel>
            <GlassmorphicPanel><CalculatorChart data={chartData} dataKey="value" color="#6366f1" gradientId="goalGradient" /></GlassmorphicPanel>
        </div>
    );
};

const SWPCalculator: FC = () => {
    const [corpus, setCorpus] = useState(1000000);
    const [withdrawal, setWithdrawal] = useState(8000);
    const [returnRate, setReturnRate] = useState(8);

    const { months, chartData } = useMemo(() => {
        let remaining = corpus;
        let m = 0;
        const monthlyRate = returnRate / 100 / 12;
        const data = [{ year: 0, value: corpus }];

        if (withdrawal <= corpus * monthlyRate) return { months: Infinity, chartData: data };

        while (remaining > 0 && m < 600) { // Safety break at 50 years
            remaining = (remaining * (1 + monthlyRate)) - withdrawal;
            m++;
            if (m % 12 === 0) data.push({ year: m/12, value: Math.max(0, Math.round(remaining)) });
        }
        return { months: m, chartData: data };
    }, [corpus, withdrawal, returnRate]);

    return (
        <div className="space-y-6">
            <GlassmorphicPanel className="space-y-6">
                <CalculatorSlider label="Total Corpus" value={corpus} onUpdate={setCorpus} min={100000} max={50000000} step={100000} unit="₹" />
                <CalculatorSlider label="Monthly Withdrawal" value={withdrawal} onUpdate={setWithdrawal} min={1000} max={200000} step={1000} unit="₹" />
                <CalculatorSlider label="Expected Return Rate" value={returnRate} onUpdate={setReturnRate} min={1} max={15} unit="% p.a." />
            </GlassmorphicPanel>
            <GlassmorphicPanel className="text-center">
                <p className="text-sm text-gray-300">Your corpus will last for</p>
                {months === Infinity ? (
                     <p className="text-4xl font-bold text-green-400 mt-2">Forever</p>
                ) : (
                    <p className="text-5xl font-bold text-sky-300 text-glow-blue">
                        <CountUp end={Math.floor(months / 12)} suffix=" "/>
                        <span className="text-3xl">years &</span>
                        <CountUp end={months % 12} suffix=" "/>
                        <span className="text-3xl">months</span>
                    </p>
                )}
            </GlassmorphicPanel>
            <GlassmorphicPanel>
                <h3 className="text-xl font-bold text-gray-100 mb-4">Corpus Depletion</h3>
                <CalculatorChart data={chartData} dataKey="value" color="#f87171" gradientId="swpGradient" />
            </GlassmorphicPanel>
        </div>
    );
};

const CAGRCalculator: FC = () => {
    const [initial, setInitial] = useState(100000);
    const [final, setFinal] = useState(250000);
    const [period, setPeriod] = useState(5);

    const cagr = useMemo(() => {
        if (initial <= 0 || final <= 0 || period <= 0) return 0;
        return (Math.pow(final / initial, 1 / period) - 1) * 100;
    }, [initial, final, period]);

    return (
        <div className="space-y-6">
            <GlassmorphicPanel className="space-y-6">
                <CalculatorSlider label="Initial Investment" value={initial} onUpdate={setInitial} min={1000} max={10000000} step={1000} unit="₹" />
                <CalculatorSlider label="Final Value" value={final} onUpdate={setFinal} min={1000} max={50000000} step={1000} unit="₹" />
                <CalculatorSlider label="Investment Period" value={period} onUpdate={setPeriod} min={1} max={40} unit="Years" />
            </GlassmorphicPanel>
            <GlassmorphicPanel className="text-center">
                <p className="text-sm text-gray-300">Compounded Annual Growth Rate</p>
                <p className="text-5xl font-bold text-sky-300 text-glow-blue">
                    <CountUp end={cagr} decimals={2} suffix="%" />
                </p>
            </GlassmorphicPanel>
        </div>
    );
};


// --- SAVING CALCULATORS ---

const FixedDepositCalculator: FC = () => {
    const [principal, setPrincipal] = useState(100000);
    const [rate, setRate] = useState(7);
    const [tenure, setTenure] = useState(5); // in years
    const [compounding, setCompounding] = useState(4); // Quarterly

    const { maturity, interest, chartData } = useMemo(() => {
        const n = compounding;
        const t = tenure;
        const r = rate / 100;
        const A = principal * Math.pow((1 + r / n), n * t);
        const I = A - principal;
        const data = [{ name: 'Principal', value: principal }, { name: 'Interest', value: I }];
        return { maturity: A, interest: I, chartData: data };
    }, [principal, rate, tenure, compounding]);

    return (
        <div className="space-y-6">
            <GlassmorphicPanel className="space-y-6">
                <CalculatorSlider label="Principal Amount" value={principal} onUpdate={setPrincipal} min={1000} max={10000000} step={1000} unit="₹" />
                <CalculatorSlider label="Rate of Interest" value={rate} onUpdate={setRate} min={1} max={15} step={0.1} unit="% p.a." />
                <CalculatorSlider label="Tenure" value={tenure} onUpdate={setTenure} min={1} max={20} unit="Years" />
                <div className="text-sm">
                    <label className="font-medium text-gray-400 mb-2 block">Compounding Frequency</label>
                    <div className="flex gap-2 bg-black/30 p-1 rounded-xl">
                        {[ {l:'Quarterly',v:4}, {l:'Half-Yearly',v:2}, {l:'Annually',v:1} ].map(opt => <button key={opt.l} onClick={() => setCompounding(opt.v)} className={`flex-1 p-2 rounded-lg font-semibold transition-all ${compounding === opt.v ? 'bg-sky-500 text-white' : 'text-gray-300'}`}>{opt.l}</button>)}
                    </div>
                </div>
            </GlassmorphicPanel>
            <GlassmorphicPanel className="!p-0 overflow-hidden">
                <div className="p-6"><FormattedResult label="Maturity Amount" value={maturity} isPrimary /></div>
                <div className="bg-black/20 px-6 py-4 border-t border-sky-400/20 text-center"><FormattedResult label="Total Interest Earned" value={interest} colorClass="text-green-400" /></div>
            </GlassmorphicPanel>
            <GlassmorphicPanel>
                 <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={chartData} layout="vertical" barCategoryGap="20%">
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ background: 'rgba(13, 17, 23, 0.8)', borderRadius: '12px' }}/>
                        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                            <Cell fill="#38bdf8" />
                            <Cell fill="#34d399" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </GlassmorphicPanel>
        </div>
    );
};

const RecurringDepositCalculator: FC = () => {
    const [monthlyDeposit, setMonthlyDeposit] = useState(5000);
    const [rate, setRate] = useState(6.5);
    const [tenure, setTenure] = useState(5); // in years

    const { maturity, totalInvested, interest, chartData } = useMemo(() => {
        const P = monthlyDeposit;
        const n = tenure * 12;
        const r = rate / 100;
        const i = r / 4; // Quarterly rate
        
        let M = 0;
        for (let j = 0; j < n; j++) {
            M += P * Math.pow(1 + i, (n-j)/3);
        }
        
        const data = Array.from({ length: tenure + 1 }).map((_, year) => {
            const months = year * 12;
            let mVal = 0;
            for (let j = 0; j < months; j++) {
                mVal += P * Math.pow(1 + i, (months-j)/3);
            }
            return { year, invested: P * months, interest: Math.max(0, Math.round(mVal - P*months)) }
        });
        
        const invested = P * n;
        const totalInterest = M - invested;

        return { maturity: M, totalInvested: invested, interest: totalInterest, chartData: data };
    }, [monthlyDeposit, rate, tenure]);

    return (
        <div className="space-y-6">
            <GlassmorphicPanel className="space-y-6">
                 <CalculatorSlider label="Monthly Deposit" value={monthlyDeposit} onUpdate={setMonthlyDeposit} min={500} max={50000} step={500} unit="₹" />
                 <CalculatorSlider label="Rate of Interest" value={rate} onUpdate={setRate} min={1} max={12} step={0.1} unit="% p.a." />
                 <CalculatorSlider label="Tenure" value={tenure} onUpdate={setTenure} min={1} max={20} unit="Years" />
            </GlassmorphicPanel>
             <GlassmorphicPanel className="!p-0 overflow-hidden">
                <div className="p-6"><FormattedResult label="Maturity Amount" value={maturity} isPrimary /></div>
                <div className="grid grid-cols-2 bg-black/20 px-6 py-4 border-t border-sky-400/20">
                    <FormattedResult label="Total Invested" value={totalInvested} />
                    <FormattedResult label="Total Interest" value={interest} colorClass="text-green-400" />
                </div>
            </GlassmorphicPanel>
            <GlassmorphicPanel>
                 <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                        <defs>
                            <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/><stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/></linearGradient>
                            <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/><stop offset="95%" stopColor="#34d399" stopOpacity={0}/></linearGradient>
                        </defs>
                        <Tooltip contentStyle={{ background: 'rgba(13, 17, 23, 0.8)', backdropFilter: 'blur(5px)' }}/>
                        <XAxis dataKey="year" unit="y" tick={{ fill: '#9ca3af' }}/>
                        <YAxis tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} tick={{ fill: '#6b7280' }}/>
                        <Area type="monotone" dataKey="invested" stackId="1" stroke="#38bdf8" fill="url(#investedGrad)" />
                        <Area type="monotone" dataKey="interest" stackId="1" stroke="#34d399" fill="url(#interestGrad)" />
                    </AreaChart>
                </ResponsiveContainer>
            </GlassmorphicPanel>
        </div>
    );
};

const EmergencyFundCalculator: FC = () => {
    const [expenses, setExpenses] = useState(50000);
    const [coverage, setCoverage] = useState(6);
    const [existing, setExisting] = useState(120000);
    
    const target = useMemo(() => expenses * coverage, [expenses, coverage]);
    const progress = useMemo(() => (target > 0 ? (existing / target) * 100 : 0), [existing, target]);

    const ProgressRing: FC<{ progress: number }> = ({ progress }) => {
        const size = 180, strokeWidth = 16;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const [offset, setOffset] = useState(circumference);
        
        useEffect(() => {
            const timer = setTimeout(() => setOffset(circumference - (progress / 100) * circumference), 100);
            return () => clearTimeout(timer);
        }, [progress, circumference]);

        return (
            <div className="relative" style={{ width: size, height: size }}>
                <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
                    <circle cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} className="stroke-current text-white/10" fill="transparent"/>
                    <circle cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} className="stroke-current text-sky-400" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s ease-out', filter: 'drop-shadow(0 0 8px var(--glow-blue))' }}/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-4xl font-bold"><CountUp end={progress} decimals={0} suffix="%" /></p>
                    <span className="text-sm text-gray-400">Funded</span>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <GlassmorphicPanel className="space-y-6">
                <CalculatorSlider label="Monthly Expenses" value={expenses} onUpdate={setExpenses} min={10000} max={200000} step={1000} unit="₹" />
                <CalculatorSlider label="Desired Coverage" value={coverage} onUpdate={setCoverage} min={3} max={24} unit="Months" />
                <CalculatorSlider label="Existing Savings" value={existing} onUpdate={setExisting} min={0} max={target * 1.5} step={1000} unit="₹" />
            </GlassmorphicPanel>
            <GlassmorphicPanel className="flex flex-col items-center space-y-4">
                <ProgressRing progress={progress} />
                <FormattedResult label="Target Emergency Fund" value={target} isPrimary />
            </GlassmorphicPanel>
        </div>
    );
};

const GoalSavingCalculator: FC = () => {
    const [goal, setGoal] = useState(500000);
    const [current, setCurrent] = useState(50000);
    const [period, setPeriod] = useState(3);
    const [rate, setRate] = useState(8);

    const { required, chartData } = useMemo(() => {
        const i = rate / 100 / 12;
        const n = period * 12;
        if (n === 0) return { required: 0, chartData: [] };
        
        const fvCurrent = current * Math.pow(1 + i, n);
        const fvFromSip = goal - fvCurrent;
        if (fvFromSip <= 0) return { required: 0, chartData: [] };

        const pmt = i > 0 ? fvFromSip / ((((1 + i) ** n) - 1) / i) : fvFromSip / n;

        const data = Array.from({ length: period + 1 }).map((_, year) => {
            const months = year * 12;
            const valCurrent = current * Math.pow(1+i, months);
            const valSip = i > 0 ? pmt * (((1+i)**months - 1) / i) : pmt * months;
            return { year, value: Math.round(valCurrent + valSip) };
        });

        return { required: pmt, chartData: data };
    }, [goal, current, period, rate]);

    return (
        <div className="space-y-6">
            <GlassmorphicPanel className="space-y-6">
                <CalculatorSlider label="Goal Amount" value={goal} onUpdate={setGoal} min={10000} max={10000000} step={10000} unit="₹" />
                <CalculatorSlider label="Current Savings" value={current} onUpdate={setCurrent} min={0} max={goal} step={1000} unit="₹" />
                <CalculatorSlider label="Time Horizon" value={period} onUpdate={setPeriod} min={1} max={20} unit="Years" />
                <CalculatorSlider label="Expected Return" value={rate} onUpdate={setRate} min={1} max={20} unit="% p.a." />
            </GlassmorphicPanel>
            <GlassmorphicPanel><FormattedResult label="Monthly Savings Required" value={required} isPrimary /></GlassmorphicPanel>
            <GlassmorphicPanel><CalculatorChart data={chartData} dataKey="value" color="#a855f7" gradientId="goalSavingGrad" /></GlassmorphicPanel>
        </div>
    );
};

const InflationImpactCalculator: FC = () => {
    const [amount, setAmount] = useState(100000);
    const [rate, setRate] = useState(6);
    const [period, setPeriod] = useState(10);
    
    const { futureValue, chartData } = useMemo(() => {
        const i = rate / 100;
        const fv = amount * Math.pow(1 + i, period);
        const data = Array.from({ length: period + 1 }).map((_, year) => ({
            year,
            currentValue: amount,
            futureValue: Math.round(amount * Math.pow(1 + i, year))
        }));
        return { futureValue: fv, chartData: data };
    }, [amount, rate, period]);

    return (
        <div className="space-y-6">
             <GlassmorphicPanel className="space-y-6">
                <CalculatorSlider label="Current Amount" value={amount} onUpdate={setAmount} min={10000} max={10000000} step={10000} unit="₹" />
                <CalculatorSlider label="Expected Inflation Rate" value={rate} onUpdate={setRate} min={1} max={15} step={0.5} unit="% p.a." />
                <CalculatorSlider label="Time Horizon" value={period} onUpdate={setPeriod} min={1} max={30} unit="Years" />
            </GlassmorphicPanel>
            <GlassmorphicPanel className="!p-0 overflow-hidden">
                <div className="p-6"><FormattedResult label={`Value of ₹${amount.toLocaleString('en-IN')} in ${period} years`} value={futureValue} isPrimary subtext="You will need this much for the same purchasing power." /></div>
                <div className="bg-black/20 px-6 py-4 border-t border-sky-400/20 text-center"><FormattedResult label="Loss in Purchasing Power" value={futureValue - amount} colorClass="text-red-400" /></div>
            </GlassmorphicPanel>
             <GlassmorphicPanel>
                 <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                        <defs>
                            <linearGradient id="fvGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f87171" stopOpacity={0.4}/><stop offset="95%" stopColor="#f87171" stopOpacity={0}/></linearGradient>
                        </defs>
                        <Tooltip contentStyle={{ background: 'rgba(13, 17, 23, 0.8)' }}/>
                        <XAxis dataKey="year" unit="y" tick={{ fill: '#9ca3af' }}/>
                        <YAxis tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} tick={{ fill: '#6b7280' }}/>
                        <Area type="monotone" name="Future Value" dataKey="futureValue" stroke="#f87171" fill="url(#fvGrad)" />
                        <Area type="monotone" name="Current Value" dataKey="currentValue" stroke="#6b7280" strokeDasharray="3 3" fill="transparent" />
                    </AreaChart>
                </ResponsiveContainer>
            </GlassmorphicPanel>
        </div>
    );
};

const GoldSavingsCalculator: FC = () => {
    // This is logically identical to the SIP calculator.
    return <SIPCalculator />;
};


// --- INSURANCE CALCULATORS ---

const TermInsuranceCalculator: FC = () => {
    const [age, setAge] = useState(30);
    const [income, setIncome] = useState(1000000);
    const [dependents, setDependents] = useState(2);
    const [existing, setExisting] = useState(2500000);
    
    const { recommendedCover, premiumRange } = useMemo(() => {
        const cover = (income * 15) + (dependents * 500000);
        const premium = (cover / 100000) * (age * 3.5);
        return { recommendedCover: Math.max(0, cover), premiumRange: [premium * 0.8, premium * 1.2] };
    }, [age, income, dependents]);

    const data = [{ name: 'Existing', value: existing }, { name: 'Gap', value: Math.max(0, recommendedCover - existing) }];

    return (
        <div className="space-y-6">
            <GlassmorphicPanel className="space-y-6">
                <CalculatorSlider label="Your Age" value={age} onUpdate={setAge} min={18} max={60} unit="Years" />
                <CalculatorSlider label="Annual Income" value={income} onUpdate={setIncome} min={300000} max={20000000} step={100000} unit="₹" />
                <CalculatorSlider label="No. of Financial Dependents" value={dependents} onUpdate={setDependents} min={0} max={10} unit="" />
                <CalculatorSlider label="Existing Life Cover" value={existing} onUpdate={setExisting} min={0} max={20000000} step={100000} unit="₹" />
            </GlassmorphicPanel>
             <GlassmorphicPanel className="!p-0 overflow-hidden">
                <div className="p-6"><FormattedResult label="Recommended Life Cover" value={recommendedCover} isPrimary /></div>
                <div className="bg-black/20 px-6 py-4 border-t border-sky-400/20 text-center">
                    <p className="text-sm text-gray-300">Suggested Premium Range (p.a.)</p>
                    <p className="text-2xl font-bold text-gray-200">
                        <CountUp end={premiumRange[0]} prefix="₹" /> - <CountUp end={premiumRange[1]} prefix="₹" />
                    </p>
                </div>
            </GlassmorphicPanel>
            <GlassmorphicPanel className="flex flex-col items-center">
                <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                        <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80} startAngle={90} endAngle={-270} paddingAngle={5}>
                            <Cell fill="#38bdf8" />
                            <Cell fill="#f87171" />
                        </Pie>
                        <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`}/>
                        <Legend iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </GlassmorphicPanel>
        </div>
    )
}

const LifeInsuranceNeedsCalculator: FC = () => {
    const [age, setAge] = useState(30);
    const [expenses, setExpenses] = useState(50000);
    const [liabilities, setLiabilities] = useState(2000000);
    const [goals, setGoals] = useState(5000000);
    const [savings, setSavings] = useState(1000000);
    const [existing, setExisting] = useState(5000000);
    
    const { totalNeed, gap } = useMemo(() => {
        const years = Math.max(1, 60 - age);
        const incomeReplacement = expenses * 12 * years * 0.7; // 70% of expenses
        const total = incomeReplacement + liabilities + goals - savings;
        return { totalNeed: total, gap: Math.max(0, total - existing) };
    }, [age, expenses, liabilities, goals, savings, existing]);
    
    const chartData = [{ name: 'Coverage', 'Existing Cover': existing, 'Coverage Gap': gap }];

    return (
        <div className="space-y-6">
            <GlassmorphicPanel className="space-y-6">
                <CalculatorSlider label="Your Age" value={age} onUpdate={setAge} min={18} max={60} unit="Years"/>
                <CalculatorSlider label="Monthly Family Expenses" value={expenses} onUpdate={setExpenses} min={10000} max={200000} step={5000} unit="₹"/>
                <CalculatorSlider label="Outstanding Liabilities (Loans)" value={liabilities} onUpdate={setLiabilities} min={0} max={50000000} step={100000} unit="₹"/>
                <CalculatorSlider label="Future Goals (Education, etc.)" value={goals} onUpdate={setGoals} min={0} max={100000000} step={500000} unit="₹"/>
                <CalculatorSlider label="Existing Savings & Investments" value={savings} onUpdate={setSavings} min={0} max={50000000} step={100000} unit="₹"/>
                <CalculatorSlider label="Existing Life Insurance" value={existing} onUpdate={setExisting} min={0} max={50000000} step={100000} unit="₹"/>
            </GlassmorphicPanel>
             <GlassmorphicPanel className="!p-0 overflow-hidden">
                <div className="p-6"><FormattedResult label="Total Life Insurance Requirement" value={totalNeed} isPrimary /></div>
                <div className="bg-black/20 px-6 py-4 border-t border-sky-400/20 text-center"><FormattedResult label="Your Coverage Gap" value={gap} colorClass="text-red-400" /></div>
            </GlassmorphicPanel>
            <GlassmorphicPanel>
                <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={chartData} layout="vertical" stackOffset="expand">
                         <XAxis type="number" hide domain={[0, 1]} />
                         <YAxis type="category" dataKey="name" hide />
                         <Tooltip formatter={(v, n, p) => `${(p.payload[n] / totalNeed * 100).toFixed(0)}%`}/>
                         <Bar dataKey="Existing Cover" stackId="a" fill="#38bdf8" radius={[8,0,0,8]} />
                         <Bar dataKey="Coverage Gap" stackId="a" fill="#f87171" radius={[0,8,8,0]} />
                    </BarChart>
                </ResponsiveContainer>
            </GlassmorphicPanel>
        </div>
    )
}

const HealthPremiumEstimator: FC = () => {
    const [age, setAge] = useState(30);
    const [coverage, setCoverage] = useState(1000000);
    const [members, setMembers] = useState(1);
    const [hasConditions, setHasConditions] = useState(false);
    
    const premium = useMemo(() => {
        const base = 5000;
        const ageFactor = Math.pow(age/18, 1.5) * 400;
        const coverageFactor = coverage / 500000;
        const memberFactor = Math.pow(members, 1.2) * 1500;
        const conditionFactor = hasConditions ? 1.5 : 1;
        return (base + ageFactor + memberFactor) * coverageFactor * conditionFactor;
    }, [age, coverage, members, hasConditions]);

    const chartData = useMemo(() => {
        const coverages = [500000, 1000000, 2500000, 5000000, 10000000];
        return coverages.map(cov => {
             const base = 5000, ageFactor = Math.pow(age/18, 1.5) * 400, coverageFactor = cov / 500000, memberFactor = Math.pow(members, 1.2) * 1500, conditionFactor = hasConditions ? 1.5 : 1;
             return { name: `${cov/100000}L`, premium: Math.round((base + ageFactor + memberFactor) * coverageFactor * conditionFactor) };
        });
    }, [age, members, hasConditions]);

    return (
        <div className="space-y-6">
            <GlassmorphicPanel className="space-y-6">
                <CalculatorSlider label="Your Age" value={age} onUpdate={setAge} min={18} max={65} unit="Years"/>
                <CalculatorSlider label="Desired Coverage Amount" value={coverage} onUpdate={setCoverage} min={300000} max={10000000} step={100000} unit="₹"/>
                <CalculatorSlider label="Family Members to Cover" value={members} onUpdate={setMembers} min={1} max={6} unit=""/>
                <div>
                     <label className="text-sm font-medium text-gray-400">Pre-existing Conditions?</label>
                     <div className="flex gap-2 bg-black/30 p-1 rounded-xl mt-2"><button onClick={()=>setHasConditions(false)} className={`flex-1 p-2 rounded-lg font-semibold ${!hasConditions ? 'bg-sky-500 text-white' : 'text-gray-300'}`}>No</button><button onClick={()=>setHasConditions(true)} className={`flex-1 p-2 rounded-lg font-semibold ${hasConditions ? 'bg-sky-500 text-white' : 'text-gray-300'}`}>Yes</button></div>
                </div>
            </GlassmorphicPanel>
            <GlassmorphicPanel><FormattedResult label="Estimated Annual Premium" value={premium} isPrimary /></GlassmorphicPanel>
            <GlassmorphicPanel>
                 <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" tick={{fill: '#9ca3af'}}/>
                        <YAxis tickFormatter={(v) => `₹${v/1000}k`} tick={{fill: '#6b7280'}}/>
                        <Tooltip contentStyle={{ background: 'rgba(13, 17, 23, 0.8)' }}/>
                        <Bar dataKey="premium" radius={[8,8,0,0]} fill="#38bdf8"/>
                    </BarChart>
                </ResponsiveContainer>
            </GlassmorphicPanel>
        </div>
    )
}

const CriticalIllnessCalculator: FC = () => {
    const [income, setIncome] = useState(1200000);
    
    const recommendedCover = useMemo(() => income * 3, [income]);
    
    const breakdownData = [
        {name: 'Treatment', value: 50},
        {name: 'Income Loss', value: 35},
        {name: 'Lifestyle', value: 15}
    ];
    const COLORS = ['#ef4444', '#f97316', '#eab308'];

    return (
        <div className="space-y-6">
            <GlassmorphicPanel className="space-y-6">
                 <CalculatorSlider label="Your Annual Income" value={income} onUpdate={setIncome} min={300000} max={10000000} step={100000} unit="₹"/>
            </GlassmorphicPanel>
             <GlassmorphicPanel className="!p-0 overflow-hidden">
                <div className="p-6"><FormattedResult label="Recommended Critical Illness Cover" value={recommendedCover} isPrimary subtext="Typically 3-5x your annual income" /></div>
                <div className="bg-black/20 px-6 py-4 border-t border-sky-400/20 text-center"><FormattedResult label="Estimated Annual Premium" value={recommendedCover * 0.003} colorClass="text-gray-200" /></div>
            </GlassmorphicPanel>
             <GlassmorphicPanel>
                <h3 className="text-xl font-bold text-gray-100 mb-4">Coverage Allocation (Illustrative)</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                         <Pie data={breakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                             {breakdownData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                         </Pie>
                         <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </GlassmorphicPanel>
        </div>
    )
}

const HumanLifeValueCalculator: FC = () => {
    const [age, setAge] = useState(30);
    const [retirement, setRetirement] = useState(60);
    const [income, setIncome] = useState(1200000);
    const [expenses, setExpenses] = useState(40000);
    
    const { hlv, chartData } = useMemo(() => {
        const workingYears = retirement - age;
        const discountRate = 0.08;
        let futureEarnings = 0;
        const data = [];

        for (let i = 1; i <= workingYears; i++) {
            const yearlyNet = income - (expenses * 12);
            futureEarnings += yearlyNet / Math.pow(1 + discountRate, i);
            data.push({ year: age + i, value: Math.round(futureEarnings) });
        }
        return { hlv: futureEarnings, chartData: data };
    }, [age, retirement, income, expenses]);

    return (
        <div className="space-y-6">
            <GlassmorphicPanel className="space-y-6">
                 <CalculatorSlider label="Current Age" value={age} onUpdate={setAge} min={18} max={59} unit="Years"/>
                 <CalculatorSlider label="Retirement Age" value={retirement} onUpdate={setRetirement} min={age + 1} max={65} unit="Years"/>
                 <CalculatorSlider label="Annual Income" value={income} onUpdate={setIncome} min={300000} max={10000000} step={100000} unit="₹"/>
                 <CalculatorSlider label="Personal Monthly Expenses" value={expenses} onUpdate={setExpenses} min={5000} max={100000} step={1000} unit="₹"/>
            </GlassmorphicPanel>
            <GlassmorphicPanel><FormattedResult label="Your Human Life Value (HLV)" value={hlv} isPrimary subtext="This is the suggested life cover to secure your family's future." /></GlassmorphicPanel>
            <GlassmorphicPanel>
                <h3 className="text-xl font-bold text-gray-100 mb-4">Projected Economic Value</h3>
                <CalculatorChart data={chartData} dataKey="value" color="#10b981" gradientId="hlvGradient" />
            </GlassmorphicPanel>
        </div>
    )
}


// --- DEBT & LOANS CALCULATORS ---

const LoanEMICalculator: FC = () => {
    const [amount, setAmount] = useState(1000000);
    const [rate, setRate] = useState(8.5);
    const [tenure, setTenure] = useState(10); // in years
    
    const { emi, totalPayable, totalInterest, chartData } = useMemo(() => {
        const P = amount;
        const r = rate / 12 / 100;
        const n = tenure * 12;
        if (r === 0) return { emi: P/n, totalPayable: P, totalInterest: 0, chartData: [] };
        
        const calculatedEmi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPaid = calculatedEmi * n;
        const totalInt = totalPaid - P;

        let balance = P;
        const data = Array.from({ length: tenure + 1 }).map((_, year) => {
            let principalPaidForYear = 0;
            for (let i = 0; i < 12; i++) {
                const interestForMonth = balance * r;
                const principalForMonth = calculatedEmi - interestForMonth;
                principalPaidForYear += principalForMonth;
                balance -= principalForMonth;
            }
            return { year, principal: Math.round(principalPaidForYear), interest: Math.round(calculatedEmi*12 - principalPaidForYear) };
        });

        return { emi: calculatedEmi, totalPayable: totalPaid, totalInterest: totalInt, chartData: data };
    }, [amount, rate, tenure]);

    return (
        <div className="space-y-6">
            <GlassmorphicPanel className="space-y-6">
                <CalculatorSlider label="Loan Amount" value={amount} onUpdate={setAmount} min={50000} max={20000000} step={50000} unit="₹" />
                <CalculatorSlider label="Interest Rate" value={rate} onUpdate={setRate} min={5} max={20} step={0.1} unit="% p.a." />
                <CalculatorSlider label="Loan Tenure" value={tenure} onUpdate={setTenure} min={1} max={30} unit="Years" />
            </GlassmorphicPanel>
            <GlassmorphicPanel className="!p-0 overflow-hidden">
                <div className="p-6"><FormattedResult label="Monthly EMI" value={emi} isPrimary /></div>
                <div className="grid grid-cols-2 bg-black/20 px-6 py-4 border-t border-sky-400/20">
                    <FormattedResult label="Total Payable" value={totalPayable} />
                    <FormattedResult label="Total Interest" value={totalInterest} colorClass="text-red-400" />
                </div>
            </GlassmorphicPanel>
            <GlassmorphicPanel>
                <h3 className="text-xl font-bold text-gray-100 mb-4">Principal vs Interest (Yearly)</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData} stackOffset="sign">
                        <XAxis dataKey="year" unit="y" tick={{fill: '#9ca3af'}} />
                        <YAxis tickFormatter={(v) => `₹${v/1000}k`} tick={{fill: '#6b7280'}}/>
                        <Tooltip contentStyle={{ background: 'rgba(13, 17, 23, 0.8)' }}/>
                        <Legend iconType="circle" />
                        <Bar dataKey="principal" name="Principal" stackId="a" fill="#38bdf8" radius={[8,8,0,0]} />
                        <Bar dataKey="interest" name="Interest" stackId="a" fill="#a855f7" radius={[8,8,0,0]} />
                    </BarChart>
                </ResponsiveContainer>
            </GlassmorphicPanel>
        </div>
    );
}

// --- MAIN CALCULATOR ROUTER ---

const CalculatorDetailScreen: FC<{ calculator: CalculatorInfo; onBack: () => void; }> = ({ calculator, onBack }) => {
    
    const renderCalculator = () => {
        switch (calculator.slug) {
            // Investing
            case 'sip': return <SIPCalculator />;
            case 'lumpsum': return <LumpsumCalculator />;
            case 'goal-planner': return <GoalPlanner />;
            case 'swp': return <SWPCalculator />;
            case 'xirr-cagr': return <CAGRCalculator />;
            
            // Saving
            case 'fd': return <FixedDepositCalculator />;
            case 'rd': return <RecurringDepositCalculator />;
            case 'emergency-fund': return <EmergencyFundCalculator />;
            case 'goal-saving': return <GoalSavingCalculator />;
            case 'inflation': return <InflationImpactCalculator />;
            case 'gold-saving': return <GoldSavingsCalculator />;

            // Insurance
            case 'term-insurance': return <TermInsuranceCalculator />;
            case 'life-insurance': return <LifeInsuranceNeedsCalculator />;
            case 'health-premium': return <HealthPremiumEstimator />;
            case 'critical-illness': return <CriticalIllnessCalculator />;
            case 'hlv': return <HumanLifeValueCalculator />;
            
            // Debt & Loans
            case 'emi': return <LoanEMICalculator />;
            case 'prepayment': return <GlassmorphicPanel className="text-center"><p>Prepayment Impact Calculator coming soon.</p></GlassmorphicPanel>;
            case 'debt-snowball': return <GlassmorphicPanel className="text-center"><p>Debt Snowball Planner coming soon.</p></GlassmorphicPanel>;
            case 'debt-avalanche': return <GlassmorphicPanel className="text-center"><p>Debt Avalanche Planner coming soon.</p></GlassmorphicPanel>;
            case 'cc-payoff': return <GlassmorphicPanel className="text-center"><p>Credit Card Payoff Calculator coming soon.</p></GlassmorphicPanel>;
            case 'loan-eligibility': return <GlassmorphicPanel className="text-center"><p>Loan Eligibility Calculator coming soon.</p></GlassmorphicPanel>;

            // Others
            case 'net-worth': return <GlassmorphicPanel className="text-center"><p>Net Worth Calculator coming soon.</p></GlassmorphicPanel>;
            case 'fire': return <GlassmorphicPanel className="text-center"><p>FIRE Calculator coming soon.</p></GlassmorphicPanel>;
            case 'retirement': return <GlassmorphicPanel className="text-center"><p>Retirement Corpus Calculator coming soon.</p></GlassmorphicPanel>;
            case 'risk-tolerance': return <GlassmorphicPanel className="text-center"><p>Risk Tolerance Assessment coming soon.</p></GlassmorphicPanel>;
            case 'tax-optimizer': return <GlassmorphicPanel className="text-center"><p>Tax-Saving Optimizer coming soon.</p></GlassmorphicPanel>;
            case 'future-value': return <GlassmorphicPanel className="text-center"><p>Future Value of Money Tool coming soon.</p></GlassmorphicPanel>;
            
            default: return (
                <GlassmorphicPanel className="text-center">
                    <h3 className="text-xl font-bold">Coming Soon</h3>
                    <p className="text-gray-400 mt-2">This calculator is under construction.</p>
                </GlassmorphicPanel>
            );
        }
    };
    
    return (
        <div className="h-full flex flex-col bg-[#0D1117] text-gray-200 animate-fade-in">
             <header className="sticky top-0 z-20 p-6 pb-4 bg-[#0D1117]/80 backdrop-blur-sm">
                <button onClick={onBack} className="absolute top-6 left-4 p-2 text-gray-300 rounded-full hover:bg-white/10">
                    <ChevronLeftIcon />
                </button>
                <div className="text-center">
                    <div className="inline-block p-3 bg-black/20 rounded-2xl mb-2">
                        <calculator.icon className="h-8 w-8 text-sky-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-100">{calculator.name}</h1>
                    <p className="text-sm text-gray-400">{calculator.description}</p>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6">
                {renderCalculator()}
            </main>
        </div>
    );
};

export default CalculatorDetailScreen;