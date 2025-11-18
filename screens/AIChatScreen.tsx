import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChatMessage } from '../types';
import { SendIcon } from '../components/icons/SendIcon';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { AIIcon } from '../components/icons/AIIcon';
import { SettingsIcon } from '../components/icons/SettingsIcon';
import { InfoIcon } from '../components/icons/InfoIcon';
import { MicrophoneIcon } from '../components/icons/MicrophoneIcon';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getChatResponse } from '../services/geminiService';
import { SearchIcon } from '../components/icons/SearchIcon';

// --- HELPER & UTILITY COMPONENTS ---

const CountUp: React.FC<{ end: number; duration?: number; prefix?: string; suffix?: string; decimals?: number; }> = ({ end, duration = 1000, prefix = "", suffix = "", decimals = 0 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const endValue = end;
        if (start === endValue) return;
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = progress * (endValue - start);
            setCount(parseFloat(current.toFixed(decimals)));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setCount(endValue);
            }
        };
        window.requestAnimationFrame(step);
    }, [end, duration, decimals]);
    return <span>{prefix}{count.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
};

const ParticleBackground: React.FC = React.memo(() => {
    const particles = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        size: Math.random() * 2 + 1,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 15 + 10}s`,
        animationDelay: `${Math.random() * -25}s`,
    })), []);

    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden z-0">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute rounded-full bg-white/5"
                    style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        left: p.left,
                        bottom: '-10px',
                        animation: `float-particle ${p.animationDuration} ${p.animationDelay} linear infinite`,
                    }}
                />
            ))}
        </div>
    );
});

// --- INTERACTIVE EMBEDDED COMPONENT ---

const SIPAnalysis: React.FC = () => {
    const [sipAmount, setSipAmount] = useState(10000);
    const returnRate = 12;
    const period = 10;

    const { futureValue, chartData } = useMemo(() => {
        const i = returnRate / 100 / 12;
        const n = period * 12;
        // FIX: Use sipAmount state variable instead of undefined monthlyInvestment
        const fv = i > 0 ? sipAmount * ((((1 + i) ** n) - 1) / i) * (1 + i) : sipAmount * n;

        const data = Array.from({ length: period + 1 }).map((_, year) => {
            const months = year * 12;
            // FIX: Use sipAmount state variable instead of undefined monthlyInvestment
            const value = i > 0 ? sipAmount * ((((1 + i) ** months) - 1) / i) * (1 + i) : sipAmount * months;
            return { year, value: Math.round(value) };
        });
        return { futureValue: fv, chartData: data };
    }, [sipAmount, returnRate, period]);

    const sliderStyle = {
      background: `linear-gradient(to right, #FFD700 0%, #FFD700 ${((sipAmount - 500) / 49500) * 100}%, rgba(0,0,0,0.3) ${((sipAmount - 500) / 49500) * 100}%, rgba(0,0,0,0.3) 100%)`
    };

    return (
        <div className="space-y-4 text-sm">
            <p>Absolutely! A Systematic Investment Plan (SIP) is a fantastic way to build wealth over time. Here's a projection for a ₹{sipAmount.toLocaleString('en-IN')} SIP over {period} years at an expected 12% annual return:</p>
            
            <div className="text-center bg-black/20 p-4 rounded-xl">
                <p className="text-gray-400">Projected Maturity Value</p>
                <p className="text-4xl font-bold text-amber-400 drop-shadow-[0_0_8px_rgba(255,215,0,0.7)]">
                    <CountUp end={futureValue} prefix="₹" />
                </p>
            </div>

            <div className="h-40 -mx-2">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="sipGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FFD700" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip contentStyle={{ background: 'rgba(13, 17, 23, 0.8)', backdropFilter: 'blur(5px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
                        <Area type="monotone" dataKey="value" stroke="#FFD700" strokeWidth={2} fill="url(#sipGradient)" animationDuration={1000}/>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            <div>
                <label className="text-gray-400">Scenario Slider: Adjust SIP Amount</label>
                <input type="range" min="500" max="50000" step="500" value={sipAmount} onChange={e => setSipAmount(Number(e.target.value))} style={sliderStyle} className="mt-2" />
            </div>
        </div>
    );
};

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isModel = message.role === 'model' || message.role === 'typing';
    const messageRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [message]);

    const TypingIndicator: React.FC = () => (
        <div className="flex items-center space-x-1 p-2">
            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
        </div>
    );

    return (
        <div ref={messageRef} className={`flex items-end gap-2 animate-slide-up-fade-in ${isModel ? 'justify-start' : 'justify-end'}`}>
            {isModel && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <AIIcon className="h-5 w-5 text-purple-200" />
                </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isModel ? 'bg-gray-800 text-gray-200 rounded-bl-none' : 'bg-sky-600 text-white rounded-br-none'}`}>
                {message.role === 'typing' ? <TypingIndicator /> : message.content}
            </div>
        </div>
    );
};

const ChatInput: React.FC<{ onSend: (text: string) => void; isSending: boolean; }> = ({ onSend, isSending }) => {
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (input.trim() && !isSending) {
            onSend(input.trim());
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    }, [input]);

    return (
        <div className="flex items-center space-x-2">
            <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your finances..."
                className="flex-1 bg-gray-900/50 border border-gray-700 rounded-2xl p-3 text-gray-200 focus:ring-2 focus:ring-sky-500 transition-all resize-none max-h-32 no-scrollbar"
                rows={1}
                disabled={isSending}
            />
            <button
                onClick={handleSend}
                disabled={isSending || !input.trim()}
                className="w-12 h-12 flex-shrink-0 rounded-full bg-sky-600 text-white flex items-center justify-center transition-all duration-300 disabled:bg-gray-700 disabled:cursor-not-allowed hover:bg-sky-500 active:scale-95 transform"
            >
                {isSending ? (
                    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <SendIcon />
                )}
            </button>
        </div>
    );
};

const SourceLink: React.FC<{ uri: string; title: string; }> = ({ uri, title }) => (
    <a href={uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-sky-400 bg-sky-900/50 p-2 rounded-lg hover:bg-sky-800/50 transition-colors">
        <SearchIcon className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">{title || new URL(uri).hostname}</span>
    </a>
);

const AIChatScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', role: 'model', content: "Hello! I'm your AI financial assistant. How can I help you achieve your goals today?" }
    ]);
    const [isSending, setIsSending] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const handleSend = useCallback(async (text: string) => {
        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setIsSending(true);

        const isSearchQuery = /who|what|when|where|why|current|latest|price of/i.test(text);
        if (isSearchQuery) setIsSearching(true);
        
        const typingMessage: ChatMessage = { id: `${Date.now()}-typing`, role: 'typing', content: '' };
        setMessages(prev => [...prev, typingMessage]);

        try {
            const { text: responseText, sources } = await getChatResponse(text);

            let content: React.ReactNode = responseText;
            if (text.toLowerCase().includes("sip")) {
                content = <SIPAnalysis />;
            } else if (sources && sources.length > 0) {
                content = (
                    <div>
                        <p>{responseText}</p>
                        <div className="mt-4 space-y-2">
                            <h4 className="text-xs font-semibold text-gray-400">Sources:</h4>
                            {sources.map(s => <SourceLink key={s.uri} uri={s.uri} title={s.title} />)}
                        </div>
                    </div>
                );
            }

            const modelMessage: ChatMessage = { id: `${Date.now()}-model`, role: 'model', content };
            setMessages(prev => prev.filter(m => m.role !== 'typing').concat(modelMessage));
        } catch (error) {
            console.error(error);
            const errorMessage: ChatMessage = { id: `${Date.now()}-error`, role: 'model', content: "Sorry, I couldn't connect to my brain right now. Please try again later." };
            setMessages(prev => prev.filter(m => m.role !== 'typing').concat(errorMessage));
        } finally {
            setIsSending(false);
            setIsSearching(false);
        }
    }, []);

    const suggestionChips = ["Explain SIPs", "How can I save tax?", "What's my spending this month?"];
    
    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-[#10141b] to-[#0D1117] text-gray-200">
            <header className="sticky top-0 z-20 p-4 flex items-center bg-[#10141b]/80 backdrop-blur-sm">
                <button onClick={onBack} className="p-2 -ml-2 text-gray-300 rounded-full hover:bg-white/10"><ChevronLeftIcon /></button>
                <div className="text-center flex-1">
                    <h1 className="text-lg font-bold text-gray-100">AI Mentor</h1>
                    <p className={`text-xs transition-opacity duration-300 ${isSearching ? 'text-sky-400 opacity-100' : 'opacity-0'}`}>Searching the web...</p>
                </div>
                <div className="w-8"></div>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
                {messages.map(msg => <Message key={msg.id} message={msg} />)}
            </div>

            <footer className="p-4 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/90 to-transparent">
                {messages.length <= 1 && (
                    <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar">
                        {suggestionChips.map(s => (
                            <button key={s} onClick={() => handleSend(s)} className="px-3 py-1.5 text-sm whitespace-nowrap bg-gray-800/70 rounded-full text-gray-300 hover:bg-gray-700">
                                {s}
                            </button>
                        ))}
                    </div>
                )}
                <ChatInput onSend={handleSend} isSending={isSending} />
            </footer>
        </div>
    );
};

export default AIChatScreen;