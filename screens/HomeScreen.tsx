
import React, { useState, useEffect, useMemo, FC, useRef, useCallback, useContext } from 'react';
import { FinancialContext } from '../App';
import ProgressBar from '../components/shared/ProgressBar';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AddTransactionModal from '../components/modals/AddTransactionModal';
import { AIIcon } from '../components/icons/AIIcon';

const Notification: React.FC<{ message: string; show: boolean }> = ({ message, show }) => (
    <div className={`fixed top-24 right-6 z-50 transition-all duration-500 ease-in-out transform ${show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
        <div className="bg-gray-800/80 backdrop-blur-md text-gray-100 font-semibold py-3 px-5 rounded-xl shadow-2xl shadow-black/50 flex items-center space-x-3 border border-gray-200/10">
            <span>🚀</span>
            <span>{message}</span>
        </div>
    </div>
);

// --- HELPER & UTILITY COMPONENTS ---

const CountUp: FC<{ end: number; duration?: number; prefix?: string; }> = ({ end, duration = 2000, prefix = "₹" }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        if (start === end) return;
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(parseFloat((progress * (end - start)).toFixed(0)));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };
        window.requestAnimationFrame(step);
    }, [end, duration]);
    return <span>{prefix}{count.toLocaleString('en-IN')}</span>;
};

const GlassmorphicPanel: FC<{ children: React.ReactNode; className?: string; onClick?: () => void; style?: React.CSSProperties }> = ({ children, className = '', onClick, style }) => (
    <div style={style} onClick={onClick} className={`premium-glass p-6 ${className} ${onClick ? 'cursor-pointer' : ''}`}>
        {children}
    </div>
);


// --- SUB-COMPONENTS FOR HOME SCREEN ---

// --- ROADMAP ICONS & QUICK ACCESS ICONS (Defined locally for convenience) ---
const TrackMoneyIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const SavePurposeIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ProtectEarnIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 22a12.02 12.02 0 009-1.056c.343-.344.65-.72.923-1.138A11.955 11.955 0 0112 2.944z" /></svg>;
const GetOutOfDebtIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 8l-1.5 1.5M8 16l-1.5 1.5" /></svg>;
const GrowWealthIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const FreedomIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 001.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>;
const LockIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const CheckIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
const PlusIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const ReceiptIcon: FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h5.25m-5.25 0h5.25M9 6.75h5.25m-5.25 3h5.25m-5.25 3h5.25M4.5 21V3a2.25 2.25 0 012.25-2.25h10.5A2.25 2.25 0 0119.5 3v18m-15 0a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25m-15 0V3" /></svg>;


// --- NEW INSIGHT ICONS ---
const SpendingIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" /></svg>;
const GoalBoostIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a16.953 16.953 0 01-2.32 3.02m-1.636-7.136L12 6.5m0 0L9.636 9.636m2.364-3.136a16.953 16.953 0 012.32 3.02m-5.84-2.56a6 6 0 015.84-7.38v4.82" /></svg>;
const ShieldIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 22a12.02 12.02 0 009-1.056c.343-.344.65-.72.923-1.138A11.955 11.955 0 0112 2.944z" /></svg>;


const HeroSection: FC = () => {
    const { transactions, savingsGoals, user } = useContext(FinancialContext);
    const [date, setDate] = useState('');
    
    const TrophyIcon: FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l-3.375 3.375M11.25 4.5V19.5m0-15s-3.375 0-3.375 3.375m3.375-3.375s3.375 0 3.375 3.375m-7.5 3.375h15l-3.375-3.375" /></svg>;
    const BankIcon: FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 12h6m-6 5.25h6M5.25 6h.008v.008H5.25V6zm0 5.25h.008v.008H5.25v-0.008zm0 5.25h.008v.008H5.25v-0.008zm13.5-5.25h.008v.008h-.008v-0.008zm0 5.25h.008v.008h-.008v-0.008zM18 6h.008v.008H18V6z" /></svg>;
    const SparklesIcon: FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.528l-.259-1.035a3.375 3.375 0 00-2.456-2.456L13.25 16l1.035-.259a3.375 3.375 0 002.456-2.456l.259-1.035.259 1.035a3.375 3.375 0 002.456 2.456l1.035.259-1.035.259a3.375 3.375 0 00-2.456 2.456l-.259 1.035z" /></svg>;

    const insights = useMemo(() => {
        const lines: { text: string, icon: React.ReactNode, glowClass: string }[] = [];
        const totalSaved = savingsGoals.reduce((sum, g) => sum + g.saved, 0);

        if (savingsGoals.length > 0) {
            const topGoal = savingsGoals[0];
            const progress = Math.round((topGoal.saved / topGoal.target) * 100);
            lines.push({ text: `You're ${progress}% of the way to your '${topGoal.name}' goal. Keep pushing!`, icon: <TrophyIcon className="text-amber-300" />, glowClass: 'animate-pulse-glow-gold' });
        }
        
        const lastWeekExpenses = transactions
            .filter(t => t.type === 'expense' && new Date(t.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
            .reduce((sum, t) => sum + t.amount, 0);
            
        if (lastWeekExpenses > 5000) {
            lines.push({ text: `You've spent ₹${lastWeekExpenses.toLocaleString()} this week. Let's focus on mindful spending.`, icon: <ReceiptIcon className="text-orange-300" />, glowClass: 'animate-pulse-glow-orange' });
        }
        
        if (totalSaved > 50000) {
            lines.push({ text: `With over ₹${(Math.floor(totalSaved / 1000) * 1000).toLocaleString()} saved, you're building a strong foundation.`, icon: <BankIcon className="text-green-300" />, glowClass: 'animate-pulse-glow-green' });
        }
        
        lines.push({ text: "Your future self is already proud of you. Stay consistent.", icon: <SparklesIcon className="text-sky-300" />, glowClass: 'animate-pulse-glow-blue' });
        
        return lines;
    }, [transactions, savingsGoals]);
    
    const [insightIndex, setInsightIndex] = useState(0);

    useEffect(() => {
        setDate(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
        const interval = setInterval(() => {
            setInsightIndex(prev => (prev + 1) % insights.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [insights]);

    const currentInsight = insights[insightIndex];
    const firstName = user.name.split(' ')[0];

    return (
        <div className="space-y-4">
             <div className="animate-slide-up-fade-in text-left">
                <p className="font-montserrat text-xs text-gray-400">{date}</p>
                <h1 className="text-xl font-bold font-montserrat text-gray-100 mt-1">Good morning, {firstName} 👋</h1>
            </div>
            <div key={insightIndex} className={`premium-glass !p-4 animate-slide-up-fade-in ${currentInsight.glowClass}`} style={{ animationDelay: '50ms' }}>
                <div className="relative z-10 flex items-center space-x-4">
                    <div className="p-3 bg-black/30 rounded-xl">
                        {currentInsight.icon}
                    </div>
                    <div className="flex-1 h-10 flex items-center">
                        <p className="text-gray-200 text-sm">{currentInsight.text}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActionCarousel: FC<{ onNavigate: (view: string, params?: any) => void }> = ({ onNavigate }) => {
    // Icons defined locally for this component
    const InvestIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
    const InsuranceIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 22a12.02 12.02 0 009-1.056c.343-.344.65-.72.923-1.138A11.955 11.955 0 0112 2.944z" /></svg>;
    const DebtIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
    const LearnIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
    const GoalIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-1.5m18 0v1.5M21 3v1.5M12 21a9 9 0 110-18 9 9 0 010 18z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 110-6 3 3 0 010 6z" /></svg>;
    const CalculatorIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12a9.75 9.75 0 1119.5 0 9.75 9.75 0 01-19.5 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75L19.5 19.5M8.25 8.25L4.5 4.5" /></svg>;
    const ChatBubbleIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;

    const banners = [
        {
            title: 'Invest Smarter, Not Harder',
            subtitle: 'Let our AI build your personalized portfolio.',
            cta: 'Analyze My Portfolio',
            navTarget: 'Invest',
            icon: <InvestIcon />,
            gradient: ['#4F3F7A', '#1D162C']
        },
        {
            title: 'Protect Your Future',
            subtitle: "Secure your well-being with the right insurance.",
            cta: 'Review My Coverage',
            navTarget: 'insurance',
            icon: <InsuranceIcon />,
            gradient: ['#1E5267', '#122A33']
        },
        {
            title: 'Master Your Debt',
            subtitle: 'Create a plan to become debt-free faster.',
            cta: 'Build My Plan',
            navTarget: 'debt',
            icon: <DebtIcon />,
            gradient: ['#6B21A8', '#2E1049']
        },
        {
            title: 'Master Your Money',
            subtitle: 'Interactive lessons to boost your financial IQ.',
            cta: 'Start Learning',
            navTarget: 'learning',
            navParams: { category: 'Investing' },
            icon: <LearnIcon />,
            gradient: ['#065F46', '#022C22']
        },
        {
            title: 'Build Your Future',
            subtitle: 'Set and track long-term investment goals.',
            cta: 'Create a Goal',
            navTarget: 'Invest',
            icon: <GoalIcon />,
            gradient: ['#1E40AF', '#10225E']
        },
        {
            title: 'Simulate Your Wealth',
            subtitle: 'Use powerful calculators to project your growth.',
            cta: 'Explore Tools',
            navTarget: 'tools',
            navParams: { category: 'Investing' },
            icon: <CalculatorIcon />,
            gradient: ['#4338CA', '#221D68']
        },
        {
            title: 'Ask Our AI Assistant',
            subtitle: 'Get instant answers to your financial questions.',
            cta: 'Chat Now',
            navTarget: 'aiChat',
            icon: <ChatBubbleIcon />,
            gradient: ['#0E7490', '#083344']
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            const nextIndex = (currentIndex + 1) % banners.length;
            const scrollContainer = scrollRef.current;
            if (scrollContainer) {
                const scrollLeft = nextIndex * scrollContainer.offsetWidth;
                scrollContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
        }, 5000);

        return () => {
            resetTimeout();
        };
    }, [currentIndex, banners.length, resetTimeout]);

    const handleScroll = () => {
        if (scrollRef.current) {
            const scrollLeft = scrollRef.current.scrollLeft;
            const itemWidth = scrollRef.current.offsetWidth;
            const newIndex = Math.round(scrollLeft / itemWidth);
            if (newIndex !== currentIndex) {
                setCurrentIndex(newIndex);
            }
        }
    };
    
    const handleDotClick = (index: number) => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            const scrollLeft = index * scrollContainer.offsetWidth;
            scrollContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            setCurrentIndex(index);
        }
    };

    return (
        <div className="w-full animate-slide-up-fade-in -mx-6" style={{ animationDelay: '50ms' }}>
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
            >
                {banners.map((banner, index) => (
                    <div key={index} className="w-full flex-shrink-0 snap-center px-6">
                        <div className="relative w-full h-60 rounded-3xl p-6 flex flex-col justify-between text-white overflow-hidden aurora-bg" style={{ backgroundImage: `linear-gradient(135deg, ${banner.gradient[0]}, ${banner.gradient[1]})` }}>
                           <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full filter blur-xl"></div>
                           <div className="absolute -left-10 -bottom-16 w-40 h-40 bg-white/5 rounded-full filter blur-2xl"></div>

                           <div className="flex justify-between items-start">
                                <div className="z-10 max-w-[70%]">
                                    <h2 className="font-montserrat font-bold text-3xl leading-tight">{banner.title}</h2>
                                </div>
                                <div className="z-10 text-white/30 opacity-70">
                                    {banner.icon}
                                </div>
                            </div>
                            
                            <div className="z-10 mt-2">
                                <p className="text-md text-gray-300 max-w-[80%]">{banner.subtitle}</p>
                                <button onClick={() => onNavigate(banner.navTarget, banner.navParams)} className="mt-4 px-6 py-3 text-md font-bold text-black rounded-xl transition-all duration-300 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-black/30 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-gray-900">
                                    {banner.cta}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center items-center space-x-2 mt-4">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`h-2.5 rounded-full transition-all duration-300 ease-in-out ${
                            currentIndex === index ? 'w-6 bg-white' : 'w-2.5 bg-gray-600'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};


const NetWorthPanel: FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
    const { investments, debts, assets, liabilities } = useContext(FinancialContext);

    const netWorth = useMemo(() => {
        const totalAssets = investments.reduce((sum, asset) => sum + asset.value, 0) + assets.reduce((sum, asset) => sum + asset.value, 0);
        const totalLiabilities = debts.reduce((sum, debt) => sum + debt.amount, 0) + liabilities.reduce((sum, liability) => sum + liability.value, 0);
        return totalAssets - totalLiabilities;
    }, [investments, debts, assets, liabilities]);
    
    const hasData = investments.length > 0 || debts.length > 0 || assets.length > 0 || liabilities.length > 0;

    return (
        <GlassmorphicPanel onClick={() => onNavigate('netWorth')} className="relative overflow-hidden text-center animate-slide-up-fade-in animate-active-glow-blue cursor-pointer" style={{ animationDelay: '100ms' }}>
            <p className="font-montserrat font-semibold text-gray-300">Net Worth Snapshot</p>
            {!hasData ? (
                 <div className="my-2 text-center text-gray-400">
                    <p>Add assets and debts to calculate your net worth.</p>
                </div>
            ) : (
                <>
                    <div className="text-5xl font-bold font-montserrat text-gray-100 my-2 text-glow-blue relative flex items-center justify-center gap-2">
                        <CountUp end={netWorth} />
                    </div>
                    <p className="text-sm text-gray-400">Click to view detailed breakdown.</p>
                </>
            )}
        </GlassmorphicPanel>
    );
};

const TotalsCarousel: FC = () => {
    const { savingsGoals, debts, insurancePolicies } = useContext(FinancialContext);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const scrollLeft = scrollRef.current.scrollLeft;
            const itemWidth = scrollRef.current.offsetWidth;
            if (itemWidth === 0) return;
            const newIndex = Math.round(scrollLeft / itemWidth);
            if (newIndex !== currentIndex) {
                setCurrentIndex(newIndex);
            }
        }
    };
    
    const handleDotClick = (index: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ left: index * scrollRef.current.offsetWidth, behavior: 'smooth' });
        }
    };
    
    const colorClasses = {
        sky: { border: 'border-sky-500/20', text: 'text-sky-300', bg: 'bg-sky-500', dot: 'bg-sky-400' },
        purple: { border: 'border-purple-500/20', text: 'text-purple-300', bg: 'bg-purple-500', dot: 'bg-purple-400' },
        teal: { border: 'border-teal-500/20', text: 'text-teal-300', bg: 'bg-teal-500', dot: 'bg-teal-400' },
    };

    const carouselItems = [
        {
            title: 'Total Savings',
            total: useMemo(() => savingsGoals.reduce((sum, g) => sum + g.saved, 0), [savingsGoals]),
            icon: <SavePurposeIcon />,
            color: 'sky' as keyof typeof colorClasses,
            breakdown: savingsGoals.slice(0, 3).map(g => ({ name: g.name, value: g.saved, target: g.target }))
        },
        {
            title: 'Total Debt',
            total: useMemo(() => debts.reduce((sum, d) => sum + d.amount, 0), [debts]),
            icon: <GetOutOfDebtIcon />,
            color: 'purple' as keyof typeof colorClasses,
            breakdown: debts.slice(0, 3).map(d => ({ name: d.name, value: d.amount, target: 0 }))
        },
        {
            title: 'Total Insurance',
            total: useMemo(() => insurancePolicies.reduce((sum, p) => sum + p.coverage, 0), [insurancePolicies]),
            icon: <ProtectEarnIcon />,
            color: 'teal' as keyof typeof colorClasses,
            breakdown: insurancePolicies.slice(0, 3).map(p => ({ name: p.provider, value: p.coverage, target: 0 }))
        }
    ];

    return (
        <div className="pt-2">
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar -mx-2"
            >
                {carouselItems.map(item => {
                    const colors = colorClasses[item.color];
                    return (
                    <div key={item.title} className="w-full flex-shrink-0 snap-center px-2">
                        <div className={`bg-black/20 p-4 rounded-2xl border ${colors.border} text-center space-y-2`}>
                            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center bg-black/20 border-2 ${colors.border}`}>
                                {item.icon}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-400">{item.title}</p>
                                <p className={`font-montserrat font-bold text-3xl ${colors.text}`}>
                                    <CountUp end={item.total} prefix="₹" />
                                </p>
                            </div>
                            {item.breakdown.length > 0 && <div className="space-y-2 pt-2 border-t border-white/5">
                                {item.breakdown.map(b => (
                                    <div key={b.name} className="bg-black/30 p-2 rounded-lg text-left text-xs">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-300 font-medium truncate pr-2">{b.name}</span>
                                            <span className={`font-semibold ${colors.text}`}>₹{b.value.toLocaleString()}</span>
                                        </div>
                                        {b.target > 0 && (
                                            <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                                                <div className={`${colors.bg} h-1 rounded-full`} style={{ width: `${Math.min(100, (b.value / b.target) * 100)}%` }}></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>}
                        </div>
                    </div>
                )})}
            </div>
            <div className="flex justify-center items-center space-x-2 mt-4">
                {carouselItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        aria-label={`Go to ${item.title}`}
                        className={`h-2 rounded-full transition-all duration-300 ${currentIndex === index ? `w-5 ${colorClasses[item.color].dot}` : 'w-2 bg-gray-600'}`}
                    />
                ))}
            </div>
        </div>
    );
};


const MonthlyFinancialFlowPanel: FC = () => {
    const { transactions } = useContext(FinancialContext);

    const monthlyFlow = useMemo(() => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const flowInitial = { income: 0, expenses: 0, savings: 0, investment: 0, debt: 0, insurance: 0 };
        const calculatedFlow = monthlyTransactions.reduce((acc, t) => {
            if (t.type === 'income') acc.income += t.amount;
            else if (t.type === 'expense') {
                if (['EMI', 'Loan Payment'].includes(t.category)) acc.debt += t.amount;
                else if (['Insurance', 'Insurance Premium'].includes(t.category)) acc.insurance += t.amount;
                else acc.expenses += t.amount;
            } else if (t.type === 'savings') acc.savings += t.amount;
            else if (t.type === 'investment') acc.investment += t.amount;
            return acc;
        }, flowInitial);
        
        return { ...calculatedFlow, dataExists: monthlyTransactions.length > 0 };
    }, [transactions]);
    
    const FlowCategoryItem: FC<{ label: string; value: number; icon: React.ReactNode; colorClass: string; }> = ({ label, value, icon, colorClass }) => (
        <div className="text-center flex-1 min-w-[70px]">
            <div className={`mx-auto w-12 h-12 rounded-full bg-black/20 flex items-center justify-center mb-1.5 border-2 ${colorClass.replace('text', 'border')}`}>
                {icon}
            </div>
            <p className="text-xs text-gray-400 font-medium">{label}</p>
            <p className={`font-montserrat font-bold text-md ${colorClass}`}>
                <CountUp end={value} prefix="₹" />
            </p>
        </div>
    );

    return (
        <GlassmorphicPanel className="animate-slide-up-fade-in space-y-3" style={{ animationDelay: '150ms' }}>
            <h2 className="text-xl font-bold font-montserrat text-gray-100 text-center">Monthly Financial Flow</h2>
             {!monthlyFlow.dataExists ? (
                <div className="text-center py-8 text-gray-400">
                    <p>Add transactions for this month to see your cash flow.</p>
                </div>
             ) : (
                <div className="space-y-3">
                    <div className="text-center">
                        <p className="text-sm font-semibold text-gray-400">Income</p>
                        <p className="font-montserrat font-extrabold text-4xl text-green-400 text-glow-emerald">
                            <CountUp end={monthlyFlow.income} prefix="₹" />
                        </p>
                    </div>
                    
                    <div className="relative h-5 w-full flex justify-center">
                        <div className="absolute top-0 h-2.5 w-px bg-green-400/50"></div>
                        <div className="absolute top-2.5 h-px w-full max-w-sm bg-green-400/50"></div>
                        <div className="absolute top-2.5 left-[12.5%] h-2.5 w-px bg-green-400/50"></div>
                        <div className="absolute top-2.5 left-[37.5%] h-2.5 w-px bg-green-400/50"></div>
                        <div className="absolute top-2.5 left-[62.5%] h-2.5 w-px bg-green-400/50"></div>
                        <div className="absolute top-2.5 right-[12.5%] h-2.5 w-px bg-green-400/50"></div>
                    </div>
                    
                    <div className="flex justify-around items-start">
                        <FlowCategoryItem label="Expenses" value={monthlyFlow.expenses} icon={<ReceiptIcon className="h-6 w-6 text-orange-400"/>} colorClass="text-orange-400" />
                        <FlowCategoryItem label="Savings" value={monthlyFlow.savings + monthlyFlow.investment} icon={<SavePurposeIcon />} colorClass="text-sky-400" />
                        <FlowCategoryItem label="Debt" value={monthlyFlow.debt} icon={<GetOutOfDebtIcon />} colorClass="text-purple-400" />
                        <FlowCategoryItem label="Insurance" value={monthlyFlow.insurance} icon={<ProtectEarnIcon />} colorClass="text-teal-400" />
                    </div>

                    <div className="pt-2"><div className="h-px bg-white/10 w-2/3 mx-auto"></div></div>

                    <TotalsCarousel />
                </div>
             )}
        </GlassmorphicPanel>
    );
};

const AIActionCenter: FC<{ onNavigate: (view: string, params?: any) => void; onOpenAddFunds: (goalId: string) => void; }> = ({ onNavigate, onOpenAddFunds }) => {
    const { transactions, savingsGoals, debts, investments, insurancePolicies } = useContext(FinancialContext);
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(() => {
        if (scrollRef.current) {
            const scrollLeft = scrollRef.current.scrollLeft;
            const itemWidth = scrollRef.current.offsetWidth;
            const newIndex = Math.round(scrollLeft / itemWidth);
            if (newIndex !== currentIndex) {
                setCurrentIndex(newIndex);
            }
        }
    }, [currentIndex]);
    
    const handleDotClick = (index: number) => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            const scrollLeft = index * scrollContainer.offsetWidth;
            scrollContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            setCurrentIndex(index);
        }
    };

    const MiniProgressBar: FC<{ value: number; target: number; colorClass: string; }> = ({ value, target, colorClass }) => (
        <div className="w-full bg-gray-700/50 rounded-full h-1.5 my-1">
            <div className={`${colorClass} h-1.5 rounded-full`} style={{ width: `${Math.min(100, (value / target) * 100)}%` }}></div>
        </div>
    );

    const insights = useMemo(() => {
        const generatedInsights: any[] = [];

        // 1. Check for Emergency Fund
        const emergencyFund = savingsGoals.find(g => g.isEmergency);
        if (!emergencyFund || emergencyFund.saved === 0) {
            generatedInsights.push({
                id: 'emergency',
                icon: <ShieldIcon />,
                title: 'Build Your Safety Net',
                statusText: 'Your financial foundation.',
                statusVisual: <MiniProgressBar value={emergencyFund?.saved || 0} target={emergencyFund?.target || 300000} colorClass="bg-teal-500" />,
                insightText: 'An emergency fund is your first line of defense against unexpected events. It protects your goals and investments. Let\'s get started.',
                actionText: 'Start Your Fund',
                action: () => onNavigate('Save'),
                gradient: 'from-teal-500/30 to-green-500/30'
            });
            return generatedInsights; // Return immediately to focus user
        }

        // 2. Check for Insurance
        if (insurancePolicies.length === 0) {
            generatedInsights.push({
                id: 'insurance',
                icon: <ProtectEarnIcon />,
                title: 'Protect Your Future',
                statusText: 'Secure what you\'ve built.',
                statusVisual: <MiniProgressBar value={0} target={1} colorClass="bg-cyan-500" />,
                insightText: 'With your safety net started, the next step is protecting your income and well-being with insurance. Let\'s explore your options.',
                actionText: 'Review My Coverage',
                action: () => onNavigate('insurance'),
                gradient: 'from-cyan-500/30 to-blue-500/30'
            });
            return generatedInsights; // Focus user
        }

        // 3. Check for Investments
        if (investments.length === 0) {
            generatedInsights.push({
                id: 'invest',
                icon: <GrowWealthIcon />,
                title: 'Grow Your Wealth',
                statusText: 'Make your money work for you.',
                statusVisual: <MiniProgressBar value={0} target={1} colorClass="bg-purple-500" />,
                insightText: "You've built your foundation. Now it's time to grow your wealth through investing. Consistent investing builds significant wealth over time.",
                actionText: 'Start Investing',
                action: () => onNavigate('Invest'),
                gradient: 'from-purple-500/30 to-indigo-500/30'
            });
            return generatedInsights; // Focus user
        }
        
        // --- If foundational steps are complete, show dynamic insights ---

        // Insight: High spending category
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const recentExpenses = transactions.filter(t => t.type === 'expense' && new Date(t.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
        if (recentExpenses.length > 5) {
            const spendingByCategory = recentExpenses.reduce<Record<string, number>>((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});
            const sortedCategories = Object.keys(spendingByCategory).sort((a, b) => spendingByCategory[b] - spendingByCategory[a]);
            if (sortedCategories.length > 0) {
                const topCategoryName = sortedCategories[0];
                const topCategoryAmount = spendingByCategory[topCategoryName];

                if (topCategoryAmount > 3000) {
                    generatedInsights.push({
                        id: 'spending',
                        icon: <SpendingIcon />,
                        title: 'Spending Analysis',
                        statusText: `High spending in '${topCategoryName}'.`,
                        statusVisual: <MiniProgressBar value={topCategoryAmount} target={totalExpenses} colorClass="bg-rose-500" />,
                        insightText: `This makes up over ${Math.round((topCategoryAmount / totalExpenses) * 100)}% of your expenses. Reviewing this can free up cash.`,
                        actionText: 'Review Expenses',
                        action: () => onNavigate('Expense'),
                        gradient: 'from-orange-500/30 to-rose-500/30'
                    });
                }
            }
        }
        
        // Insight: Underfunded Goal
        const underfundedGoal = savingsGoals.find(g => (g.saved / g.target) < 0.75 && !g.isEmergency);
        if (underfundedGoal) {
             generatedInsights.push({
                id: 'goal',
                icon: <GoalBoostIcon />,
                title: 'Goal Momentum',
                statusText: `'${underfundedGoal.name}' goal is ${Math.round((underfundedGoal.saved/underfundedGoal.target)*100)}% funded.`,
                statusVisual: <MiniProgressBar value={underfundedGoal.saved} target={underfundedGoal.target} colorClass="bg-sky-500" />,
                insightText: "You're making progress! A small extra contribution now can significantly accelerate your timeline.",
                actionText: 'Add Funds',
                action: () => onOpenAddFunds(underfundedGoal.id),
                gradient: 'from-sky-500/30 to-blue-500/30'
            });
        }

        // Insight: High interest debt
        if(debts.some(d => d.apr > 15)) {
            generatedInsights.push({
                id: 'debt',
                icon: <GetOutOfDebtIcon />,
                title: 'Tackle High-Interest Debt',
                statusText: `High APR debt detected.`,
                statusVisual: <MiniProgressBar value={1} target={1} colorClass="bg-purple-500" />,
                insightText: "High-interest debt works against your wealth-building. Creating a payoff plan can save you thousands.",
                actionText: 'Create a Plan',
                action: () => onNavigate('debt'),
                gradient: 'from-purple-500/30 to-indigo-500/30'
            });
        }
        
        // Fallback
        if (generatedInsights.length === 0) {
             generatedInsights.push({
                id: 'optimize',
                icon: <AIIcon />,
                title: 'Optimize Your Portfolio',
                statusText: 'Your finances look solid!',
                statusVisual: <MiniProgressBar value={1} target={1} colorClass="bg-lime-500" />,
                insightText: "You've covered all the bases. Now is a great time to review your portfolio allocation or discuss advanced strategies with our AI Mentor.",
                actionText: 'Talk to AI Mentor',
                action: () => onNavigate('aiChat'),
                gradient: 'from-lime-500/30 to-emerald-500/30'
            });
        }

        return generatedInsights.slice(0, 4);
    }, [transactions, savingsGoals, debts, investments, insurancePolicies, onNavigate, onOpenAddFunds]);

    return (
        <div className="animate-slide-up-fade-in -mx-6" style={{ animationDelay: '300ms' }}>
            <h2 className="text-xl font-bold font-montserrat text-gray-100 mb-4 px-6">Your AI Action Center</h2>
            <div
                ref={scrollRef}
                onScroll={insights.length > 1 ? handleScroll : undefined}
                className="flex overflow-x-auto no-scrollbar py-2 snap-x snap-mandatory scroll-smooth"
            >
                {insights.map(insight => (
                    <div key={insight.id} className="w-full flex-shrink-0 snap-center px-6">
                        <div className={`h-full premium-glass !p-5 flex flex-col justify-between overflow-hidden relative border border-transparent bg-gradient-to-br ${insight.gradient} hover:border-sky-400/50`}>
                            <div>
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="text-white/60">{insight.icon}</div>
                                    <h3 className="text-lg font-bold text-gray-100">{insight.title}</h3>
                                </div>
                                <div className="bg-black/20 p-3 rounded-xl border border-white/10">
                                    <p className="text-sm font-semibold text-gray-200">{insight.statusText}</p>
                                    {insight.statusVisual}
                                </div>
                                <p className="text-sm text-gray-300 mt-3">{insight.insightText}</p>
                            </div>
                            <button onClick={insight.action} className="z-10 w-full mt-4 py-2.5 bg-gray-100/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors">
                                {insight.actionText}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {insights.length > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                    {insights.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            aria-label={`Go to insight ${index + 1}`}
                            className={`h-2.5 rounded-full transition-all duration-300 ease-in-out ${
                                currentIndex === index ? 'w-6 bg-white' : 'w-2.5 bg-gray-600'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


const FinancialRoadmapPanel: FC<{ onNavigate: (view: string) => void; setShowFreedomNotification: (show: boolean) => void }> = ({ onNavigate, setShowFreedomNotification }) => {
    const { transactions } = useContext(FinancialContext);
    const roadmapSteps = [
        { id: 1, title: 'Track Your Money', description: 'Start by recording every income and expense. Awareness is the first step to control.', cta: 'Start Tracking', icon: <TrackMoneyIcon /> },
        { id: 3, title: 'Save With Purpose', description: 'Set aside money consciously — not random savings, but intentional reserves for your goals.', cta: 'Create Savings Plan', icon: <SavePurposeIcon /> },
        { id: 4, title: 'Protect What You Earn', description: 'Insurance is a shield. Secure your income and protect your family before you grow wealth.', cta: 'Secure with Insurance', icon: <ProtectEarnIcon /> },
        { id: 5, title: 'Get Out of Debt', description: 'Debt kills momentum. Clear liabilities to release your cash flow and mental freedom.', cta: 'Start Debt Plan', icon: <GetOutOfDebtIcon /> },
        { id: 6, title: 'Grow Your Wealth', description: 'Now your money works for you. Invest consistently in assets that compound.', cta: 'Start Investing', icon: <GrowWealthIcon /> },
        { id: 7, title: 'Achieve Financial Freedom', description: 'This is where your money generates more money. You’re no longer trading time for income.', cta: 'Celebrate Milestone', icon: <FreedomIcon /> },
    ];
    const completedSteps = transactions.length > 0 ? 1 : 0; 

    const MilestoneCard: FC<{ step: typeof roadmapSteps[0]; status: 'completed' | 'active' | 'locked' }> = ({ step, status }) => {
        const isLocked = status === 'locked';
        const isActive = status === 'active';
        const isCompleted = status === 'completed';

        let cardClasses = 'relative flex-shrink-0 w-72 h-80 premium-glass !p-6 flex flex-col justify-between overflow-hidden';
        let buttonClasses = 'w-full py-2.5 rounded-xl font-semibold transition-all duration-300';
        let iconContainerClasses = 'w-14 h-14 rounded-2xl flex items-center justify-center mb-4';
        
        const handleAction = () => {
            switch (step.id) {
                case 1: onNavigate('Expense'); break;
                case 3: onNavigate('Save'); break;
                case 4: onNavigate('insurance'); break;
                case 5: onNavigate('debt'); break;
                case 6: onNavigate('Invest'); break;
                case 7: setShowFreedomNotification(true); break;
                default: break;
            }
        };

        if (isActive) {
            cardClasses += ' animate-active-glow-green';
            buttonClasses += ' bg-green-400 text-black shadow-lg shadow-green-500/30 hover:bg-green-300';
            iconContainerClasses += ' bg-green-900/50 text-green-300';
        } else if (isCompleted) {
            cardClasses += ' border-amber-400/50';
            buttonClasses += ' bg-transparent border border-amber-400 text-amber-400';
            iconContainerClasses += ' bg-amber-900/50 text-amber-300';
        } else { // Locked
            buttonClasses += ' bg-gray-700 text-gray-500 cursor-not-allowed';
            iconContainerClasses += ' bg-gray-800/50 text-gray-600';
        }

        return (
            <div className={cardClasses}>
                {isLocked && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-4 text-center">
                        <LockIcon />
                        <p className="text-xs text-gray-400 mt-2">Complete previous step to unlock</p>
                    </div>
                )}
                <div>
                    <div className={iconContainerClasses}>
                        {step.icon}
                    </div>
                    <h3 className="text-xl font-bold font-montserrat text-gray-100">{step.title}</h3>
                    <p className="text-sm text-gray-400 mt-2">{step.description}</p>
                </div>
                <button onClick={handleAction} className={buttonClasses} disabled={isLocked}>
                    {isCompleted ? (
                        <div className="flex items-center justify-center space-x-2">
                            <CheckIcon />
                            <span>Completed</span>
                        </div>
                    ) : (
                        step.cta
                    )}
                </button>
            </div>
        );
    };

    return (
        <div className="animate-slide-up-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex space-x-4 overflow-x-auto no-scrollbar py-4 -mx-6 px-6">
                {roadmapSteps.map((step, index) => {
                    const status = index < completedSteps ? 'completed' : index === completedSteps ? 'active' : 'locked';
                    return <MilestoneCard key={step.id} step={step} status={status} />;
                })}
            </div>
        </div>
    );
};

const FinancialOverviewCarousel: FC<{ onNavigate: (view: string, params?: any) => void }> = ({ onNavigate }) => {
    const { savingsGoals, investmentGoals, debtPlan, insurancePolicies } = useContext(FinancialContext);
    
    const DonutChart: FC<{ percentage: number; color: string; }> = ({ percentage, color }) => {
        const data = [
            { name: 'Progress', value: percentage },
            { name: 'Remaining', value: 100 - percentage }
        ];
        return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius="80%"
                        outerRadius="100%"
                        fill="#8884d8"
                        paddingAngle={0}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                    >
                        <Cell fill={color} stroke={color} style={{filter: `drop-shadow(0 0 8px ${color})`}}/>
                        <Cell fill="rgba(255, 255, 255, 0.1)" stroke="none"/>
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        );
    };

    const savingsData = useMemo(() => {
        const totalSaved = savingsGoals.reduce((sum, g) => sum + g.saved, 0);
        const totalTarget = savingsGoals.reduce((sum, g) => sum + g.target, 0);
        const progress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
        return { totalSaved, totalTarget, progress, goalCount: savingsGoals.length };
    }, [savingsGoals]);
    
    const investmentData = useMemo(() => {
        const currentAmount = investmentGoals.reduce((sum, g) => sum + g.currentAmount, 0);
        const targetAmount = investmentGoals.reduce((sum, g) => sum + g.targetAmount, 0);
        const progress = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
        return { currentAmount, targetAmount, progress, goalCount: investmentGoals.length };
    }, [investmentGoals]);

    const debtData = useMemo(() => {
        if (!debtPlan) return null;
        const checkedInCount = debtPlan.checkedInMonths?.length ?? 0;
        const totalInitialDebt = debtPlan.debts.reduce((s, d) => s + d.amount, 0);
        const remainingBalance = debtPlan.roadmap[checkedInCount - 1]?.totalRemainingBalance ?? totalInitialDebt;
        const paidAmount = totalInitialDebt - remainingBalance;
        const progress = totalInitialDebt > 0 ? (paidAmount / totalInitialDebt) * 100 : 0;
        const monthsLeft = debtPlan.totalMonths - checkedInCount;
        return { progress, remainingBalance, monthsLeft };
    }, [debtPlan]);

    const insuranceData = useMemo(() => {
        const activePolicies = insurancePolicies.length;
        if (activePolicies === 0) return { activePolicies: 0, nextDueDate: null, totalCoverage: 0 };
        
        let nextDueDate: Date | null = null;
        let totalCoverage = 0;
        
        insurancePolicies.forEach(p => {
            totalCoverage += p.coverage;
            const dueDate = new Date(p.premiumDueDate);
            if (!nextDueDate || dueDate < nextDueDate) {
                nextDueDate = dueDate;
            }
        });

        return { activePolicies, nextDueDate, totalCoverage };
    }, [insurancePolicies]);
    
    const OverviewCard: FC<{ children: React.ReactNode; className?: string, onClick?: () => void }> = ({ children, className, onClick }) => (
        <div onClick={onClick} className={`flex-shrink-0 w-80 h-80 premium-glass !p-6 flex flex-col justify-between overflow-hidden relative transition-all duration-300 ${className}`}>
             {children}
        </div>
    );

    return (
        <div className="animate-slide-up-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold font-montserrat text-gray-100">Financial Overview</h2>
            </div>
            <div className="flex space-x-4 overflow-x-auto no-scrollbar py-4 -mx-6 px-6">
                
                {/* Savings Card */}
                <OverviewCard onClick={() => onNavigate('Save')} className="border-sky-500/30 hover:shadow-[0_0_25px_rgba(56,189,248,0.2)]">
                    <div className="flex items-start justify-between">
                        <h3 className="text-2xl font-bold text-gray-100">Savings</h3>
                        <SavePurposeIcon />
                    </div>
                    <div className="relative w-32 h-32 mx-auto my-1">
                        <DonutChart percentage={savingsData.progress} color="#38bdf8" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-bold text-3xl text-gray-100">{Math.round(savingsData.progress)}%</span>
                            <span className="text-xs text-gray-400">Funded</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-lg text-gray-200">₹{savingsData.totalSaved.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">of ₹{savingsData.totalTarget.toLocaleString()}</p>
                    </div>
                </OverviewCard>

                {/* Investment Card */}
                <OverviewCard onClick={() => onNavigate('Invest')} className="border-purple-500/30 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]">
                    <div className="flex items-start justify-between">
                        <h3 className="text-2xl font-bold text-gray-100">Investing</h3>
                        <GrowWealthIcon />
                    </div>
                    <div className="relative w-32 h-32 mx-auto my-1">
                        <DonutChart percentage={investmentData.progress} color="#a855f7" />
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-bold text-3xl text-gray-100">{Math.round(investmentData.progress)}%</span>
                             <span className="text-xs text-gray-400">Funded</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-lg text-gray-200">₹{investmentData.currentAmount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">of ₹{investmentData.targetAmount.toLocaleString()}</p>
                    </div>
                </OverviewCard>

                {/* Debt Card */}
                <OverviewCard onClick={() => onNavigate('debt')} className="border-orange-500/30 hover:shadow-[0_0_25px_rgba(251,146,60,0.2)]">
                     <div className="flex items-start justify-between">
                        <h3 className="text-2xl font-bold text-gray-100">Debt Payoff</h3>
                        <GetOutOfDebtIcon />
                    </div>
                    {debtData ? (
                        <div className="flex flex-col justify-center flex-1 space-y-4">
                            <div>
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-sm text-gray-400">Paid Off</span>
                                    <span className="font-bold text-2xl text-orange-400">{Math.round(debtData.progress)}%</span>
                                </div>
                                <div className="w-full bg-black/30 rounded-full h-2.5"><div className="bg-orange-400 h-2.5 rounded-full" style={{width: `${debtData.progress}%`}}></div></div>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-400">Time to Freedom</p>
                                <p className="text-2xl font-bold text-gray-200">{debtData.monthsLeft} <span className="text-lg">months</span></p>
                            </div>
                             <div className="text-center">
                                <p className="text-sm text-gray-400">Remaining Debt</p>
                                <p className="font-semibold text-lg text-gray-200">₹{debtData.remainingBalance.toLocaleString()}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <p className="text-gray-400">No debt plan is active.</p>
                             <button className="mt-4 px-4 py-2 text-sm font-bold text-black rounded-xl bg-orange-400">Create Plan</button>
                        </div>
                    )}
                </OverviewCard>

                 {/* Insurance Card */}
                <OverviewCard onClick={() => onNavigate('insurance')} className="border-teal-500/30 hover:shadow-[0_0_25px_rgba(45,212,191,0.2)]">
                     <div className="flex items-start justify-between">
                        <h3 className="text-2xl font-bold text-gray-100">Insurance</h3>
                        <ProtectEarnIcon />
                    </div>
                    {insuranceData.activePolicies > 0 ? (
                        <div className="flex-1 flex flex-col justify-center space-y-6 text-center">
                             <div>
                                <p className="text-sm text-gray-400">Total Coverage</p>
                                <p className="text-3xl font-bold text-teal-300">₹{(insuranceData.totalCoverage/100000).toLocaleString('en-IN')}L</p>
                            </div>
                             <div>
                                <p className="text-sm text-gray-400">Active Policies</p>
                                <p className="text-2xl font-bold text-gray-200">{insuranceData.activePolicies}</p>
                            </div>
                        </div>
                    ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <p className="text-gray-400">No active policies found.</p>
                             <button className="mt-4 px-4 py-2 text-sm font-bold text-black rounded-xl bg-teal-400">Get Covered</button>
                        </div>
                    )}
                     <div className="text-center">
                        {insuranceData.nextDueDate && (
                            <>
                                <p className="text-sm text-gray-400">Next Premium Due</p>
                                <p className="font-semibold text-lg text-gray-200">{insuranceData.nextDueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </>
                        )}
                    </div>
                </OverviewCard>
            </div>
        </div>
    );
};


const KeyFinancialMetricsPanel: FC = () => {
    const { transactions, debts, insurancePolicies } = useContext(FinancialContext);

    const metrics = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const investment = transactions.filter(t => t.type === 'investment').reduce((sum, t) => sum + t.amount, 0);
        const savings = transactions.filter(t => t.type === 'savings').reduce((sum, t) => sum + t.amount, 0);
        const debtTotal = debts.reduce((sum, d) => sum + d.amount, 0);
        const insuranceCoverage = insurancePolicies.reduce((sum, p) => sum + p.coverage, 0);

        return { income, expenses, investment, savings, debtTotal, insuranceCoverage };
    }, [transactions, debts, insurancePolicies]);

    const data = [
        { name: 'Income', value: metrics.income, color: 'grad-green' },
        { name: 'Expenses', value: metrics.expenses, color: 'grad-red' },
        { name: 'Invest', value: metrics.investment, color: 'grad-purple' },
        { name: 'Save', value: metrics.savings, color: 'grad-sky' },
        { name: 'Debt', value: metrics.debtTotal, color: 'grad-orange' },
        { name: 'Insurance', value: metrics.insuranceCoverage, color: 'grad-teal' },
    ];

    const NoDataPlaceholder = () => (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
            <h3 className="text-lg font-semibold text-gray-400">No Data to Analyze</h3>
            <p className="text-sm">Start adding transactions to see your financial analytics.</p>
        </div>
    );

    const CustomBarTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="premium-glass !p-3 !rounded-xl !border-gray-600">
                    <p className="font-semibold text-gray-100">
                        {payload[0].payload.name}: ₹{payload[0].value.toLocaleString('en-IN')}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <GlassmorphicPanel className="animate-slide-up-fade-in" style={{ animationDelay: '500ms' }}>
            <h2 className="text-xl font-bold font-montserrat text-gray-100 mb-6">Financial Snapshot</h2>
            <div className="w-full h-80">
                <svg className="absolute w-0 h-0">
                    <defs>
                        <linearGradient id="grad-green" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4ade80" /><stop offset="100%" stopColor="#22c55e" /></linearGradient>
                        <linearGradient id="grad-red" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#f87171" /><stop offset="100%" stopColor="#ef4444" /></linearGradient>
                        <linearGradient id="grad-purple" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#9333ea" /></linearGradient>
                        <linearGradient id="grad-sky" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#0ea5e9" /></linearGradient>
                        <linearGradient id="grad-orange" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#ea580c" /></linearGradient>
                        <linearGradient id="grad-teal" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#2dd4bf" /><stop offset="100%" stopColor="#14b8a6" /></linearGradient>
                    </defs>
                </svg>
                {transactions.length === 0 ? <NoDataPlaceholder /> : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 14 }} tickLine={false} axisLine={false} width={80} />
                            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                            <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={25}>
                                {data.map((entry) => (
                                    <Cell key={`cell-${entry.name}`} fill={`url(#${entry.color})`} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </GlassmorphicPanel>
    );
};


const VisionFooter: FC = () => {
    const LockIconFooter: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
    
    return (
        <div className="relative text-center px-6 py-20 mt-8 overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
                <svg width="80" height="80" viewBox="0 0 100 100" className="mx-auto mb-6 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                    <defs>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.8)" />
                            <stop offset="100%" stopColor="rgba(251, 191, 36, 0.8)" />
                        </linearGradient>
                    </defs>
                    <path d="M50,10 C70,20 85,40 85,60 C85,80 65,95 50,90 C35,95 15,80 15,60 C15,40 30,20 50,10 Z" fill="none" stroke="url(#pathGradient)" strokeWidth="2" className="animate-draw-path" />
                    <path d="M50 25L55.878 37.756L69.511 39.756L59.815 49.022L61.756 62.657L50 56L38.244 62.657L40.185 49.022L30.489 39.756L44.122 37.756L50 25Z" fill="var(--glow-gold)" className="animate-pulse-star" style={{ animationDelay: '3s' }}/>
                </svg>

                <h2 className="text-3xl font-bold font-montserrat text-glow-gold mb-3 animate-slide-up-fade-in" style={{ animationDelay: '200ms' }}>
                    Your Journey to Financial Freedom
                </h2>
                <p className="text-gray-400 max-w-xl mx-auto mb-8 animate-slide-up-fade-in" style={{ animationDelay: '400ms' }}>
                    We're here to guide you, every step of the way. Your goals are our mission. Together, we build a future where your money works for you.
                </p>
                
                <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-black/20 px-4 py-2 rounded-full border border-gray-800 animate-slide-up-fade-in" style={{ animationDelay: '600ms' }}>
                    <LockIconFooter />
                    <span>End-to-end encryption. Your privacy is our foundation.</span>
                </div>
            </div>
        </div>
    );
};


// --- MAIN HOME SCREEN COMPONENT ---

const HomeScreen: React.FC<{ onNavigate: (view: string, params?: any) => void }> = ({ onNavigate }) => {
    const { savingsGoals } = useContext(FinancialContext);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [goalToFundId, setGoalToFundId] = useState<string | null>(null);
    const [showNotification, setShowNotification] = useState(false);
    const [showFreedomNotification, setShowFreedomNotification] = useState(false);
    
    useEffect(() => {
        if (showFreedomNotification) {
            const timer = setTimeout(() => setShowFreedomNotification(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [showFreedomNotification]);
    
    const handleConnectBankClick = () => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOpenAddFunds = (goalId: string) => {
        // This is a placeholder since AddFundsModal is not on this screen
        // We can navigate or open a different modal if needed.
        // For now, let's find the goal and open the main Add Transaction modal
        const goal = savingsGoals.find(g => g.id === goalId);
        if(goal) {
            // A more direct way could be implemented, but this reuses existing flow
            setIsAddModalOpen(true);
        }
    }

    return (
        <>
            <Notification message="Bank connection coming soon!" show={showNotification} />
            <Notification message="Objective Complete: You're on the path to freedom!" show={showFreedomNotification} />
            <div className="bg-[#0D1117] text-gray-200 min-h-screen">
                <div className="p-6 md:p-8 space-y-8 pb-32">
                    <HeroSection />
                    <ActionCarousel onNavigate={onNavigate} />
                    <NetWorthPanel onNavigate={onNavigate} />
                    <MonthlyFinancialFlowPanel />
                    <div className="text-center animate-slide-up-fade-in" style={{ animationDelay: '250ms' }}>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-full shadow-lg shadow-sky-500/30 hover:scale-105 active:scale-95 transition-transform transform text-base"
                        >
                            <PlusIcon />
                            <span>Add Transaction</span>
                        </button>
                    </div>
                    <div className="text-center animate-slide-up-fade-in" style={{ animationDelay: '280ms' }}>
                        <button onClick={handleConnectBankClick} className="group inline-flex items-center space-x-3 px-6 py-3 bg-black/20 border border-white/10 rounded-full transition-all duration-300 hover:border-sky-400/50 hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-400 transition-colors group-hover:text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <span className="font-semibold text-sm text-gray-300 group-hover:text-sky-300 transition-colors">
                                Automate with Secure Bank Sync
                            </span>
                        </button>
                    </div>
                    <AIActionCenter onNavigate={onNavigate} onOpenAddFunds={handleOpenAddFunds} />
                    <FinancialRoadmapPanel onNavigate={onNavigate} setShowFreedomNotification={setShowFreedomNotification} />
                    <FinancialOverviewCarousel onNavigate={onNavigate} />
                    <KeyFinancialMetricsPanel />
                </div>
                <VisionFooter />
            </div>
            <AddTransactionModal isVisible={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onNavigate={onNavigate} />
        </>
    );
};

export default HomeScreen;
