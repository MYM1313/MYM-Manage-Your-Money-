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
        const fv = sipAmount * ((((1 + i) ** n) - 1) / i) * (1 + i);
        
        const data = Array.from({ length: period + 1 }).map((_, year) => {
            const months = year * 12;
            const value = sipAmount * ((((1 + i) ** months) - 1) / i) * (1 + i);
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

            <div className="flex gap-2 pt-2">
                <button className="flex-1 text-center py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors text-xs font-semibold">View Full Analysis</button>
                <button className="flex-1 text-center py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors text-xs font-semibold">Open SIP Calculator</button>
            </div>
        </div>
    );
};

const SourcesComponent: React.FC<{ sources: { uri: string; title: string }[] }> = ({ sources }) => {
    if (!sources || sources.length === 0) return null;
    return (
        <div className="mt-4 pt-3 border-t border-white/10">
            <h4 className="text-xs font-semibold text-gray-400 mb-2">Sources</h4>
            <div className="space-y-1">
                {sources.map((source, index) => (
                    <a href={source.uri} target="_blank" rel="noopener noreferrer" key={index} className="block text-xs text-sky-400 hover:underline truncate p-1 rounded hover:bg-sky-500/10">
                        {index + 1}. {source.title || new URL(source.uri).hostname}
                    </a>
                ))}
            </div>
        </div>
    );
};


// --- MAIN CHAT SCREEN COMPONENT ---

const AIChatScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', role: 'model', content: "Hi Aarav, I’m your AI Wealth Assistant. How can I help today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [userName] = useState("Aarav");

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    const handleSend = useCallback(async (prompt: string) => {
        if (prompt.trim() === '' || isTyping) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: prompt };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        setIsSearching(false); // No real searching will occur

        try {
            // All queries will now go through the mocked service
            const { text: responseText, sources } = await getChatResponse(prompt);
            const modelMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: (
                    <>
                        {responseText}
                        {sources && sources.length > 0 && <SourcesComponent sources={sources} />}
                    </>
                )
            };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error("Failed to get AI response:", error);
            const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', content: "I'm having a bit of trouble connecting right now. Please try again in a moment." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
            setIsSearching(false);
        }
    }, [isTyping]);

    const suggestedPrompts = ["Explain what a SIP is", "What is the current price of gold?", "Who won the last cricket match?"];
    
    return (
        <div className="h-screen w-full bg-[#0D1117] font-sans flex flex-col overflow-hidden relative">
            <ParticleBackground />
            
            <header className={`relative z-10 flex items-center justify-between p-4 flex-shrink-0 transition-all duration-500 bg-[#0D1117]/50 backdrop-blur-sm`}>
                <button onClick={onBack} className="p-2 text-gray-300 rounded-full hover:bg-white/10"><ChevronLeftIcon /></button>
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                        <AIIcon className={`h-6 w-6 transition-colors duration-500 ${isTyping ? 'text-sky-400 animate-pulse' : 'text-gray-400'}`} />
                        <h1 className="text-xl font-bold text-gray-100">AI Financial Assistant</h1>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-300 rounded-full hover:bg-white/10"><InfoIcon /></button>
                    <button className="p-2 text-gray-300 rounded-full hover:bg-white/10"><SettingsIcon /></button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto space-y-6 p-4 no-scrollbar relative z-10">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <div className="w-9 h-9 rounded-full bg-black/20 flex items-center justify-center flex-shrink-0 border border-white/10"><AIIcon className="h-5 w-5 text-sky-400"/></div>}
                        <div className={`max-w-sm md:max-w-md lg:max-w-lg px-5 py-3.5 rounded-3xl ${
                            msg.role === 'user' 
                            ? 'bg-gradient-to-br from-sky-500 to-indigo-600 text-white rounded-br-lg shadow-lg shadow-sky-500/20' 
                            : 'premium-glass !p-4 !rounded-bl-lg'
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex items-end gap-3 animate-fade-in">
                        <div className="w-9 h-9 rounded-full bg-black/20 flex items-center justify-center flex-shrink-0 border border-white/10"><AIIcon className="h-5 w-5 text-sky-400"/></div>
                         <div className="px-5 py-3.5 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 text-gray-200 rounded-bl-lg">
                            {isSearching ? (
                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                    <SearchIcon />
                                    <span>Searching the web...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="relative z-10 p-4 space-y-3 bg-gradient-to-t from-[#0D1117] to-transparent">
                 <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {messages.length <= 1 && suggestedPrompts.map(prompt => (
                        <button key={prompt} onClick={() => handleSend(prompt)} className="whitespace-nowrap text-sm bg-white/5 backdrop-blur-md border border-white/10 text-gray-300 px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
                            {prompt}
                        </button>
                    ))}
                </div>
                <div className="flex items-center bg-black/30 backdrop-blur-md rounded-2xl shadow-lg p-2 border border-white/10">
                     <button className="p-2 text-gray-400 hover:text-white"><MicrophoneIcon /></button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                        placeholder="Ask me anything..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-gray-200 placeholder-gray-500 px-2"
                        aria-label="Chat input"
                    />
                    <button
                        onClick={() => handleSend(input)}
                        disabled={isTyping}
                        className="p-3 rounded-full bg-sky-600 text-white hover:bg-sky-500 disabled:bg-sky-400/50 transition-all duration-200 transform active:scale-90"
                        aria-label="Send message"
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChatScreen;
