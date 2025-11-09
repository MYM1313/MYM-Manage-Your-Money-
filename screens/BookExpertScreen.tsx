import React, { useState } from 'react';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { StarIcon } from '../components/icons/StarIcon';
import { TrendingUpIcon } from '../components/icons/TrendingUpIcon';
import { ChartBarSquareIcon } from '../components/icons/ChartBarSquareIcon';
import { TrophyIcon } from '../components/icons/TrophyIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { DollarIcon } from '../components/icons/DollarIcon';
import { LockIcon } from '../components/icons/LockIcon';
import { SearchIcon } from '../components/icons/SearchIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';
import { AIIcon } from '../components/icons/AIIcon';
import GlassmorphicPanel from '../components/shared/Card';

// --- SUB-COMPONENTS for better organization ---

const HeroSection: React.FC = () => (
    <GlassmorphicPanel className="text-center animate-slide-in-bottom bg-gradient-to-b from-gray-900/50 to-[#0D1117]/30">
        <h1 className="text-4xl font-bold text-gray-100 mb-2">Book a Financial Expert</h1>
        <p className="text-gray-400 max-w-lg mx-auto mb-6">Get personalized guidance to grow, protect, and manage your wealth.</p>
        <button className="w-full max-w-xs mx-auto py-4 bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 text-black font-bold rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-[1.03] active:scale-100 transition-transform transform text-lg">
            Go to Platform to Book
        </button>
        <div className="flex justify-center items-center space-x-8 mt-6 text-xs text-gray-400">
            <div className="flex items-center space-x-1.5 animate-glow-outline-gold" style={{animationDelay: '100ms'}}><ShieldCheckIcon /><span>Secure</span></div>
            <div className="flex items-center space-x-1.5 animate-glow-outline-gold" style={{animationDelay: '200ms'}}><CheckCircleIcon className="w-5 h-5" /><span>Verified</span></div>
            <div className="flex items-center space-x-1.5 animate-glow-outline-gold" style={{animationDelay: '300ms'}}><StarIcon className="w-5 h-5 text-amber-400" /><span>Top Rated</span></div>
        </div>
    </GlassmorphicPanel>
);

const GuidanceSection: React.FC = () => {
    const items = [
        { icon: <ShieldCheckIcon />, text: "Avoid costly mistakes" },
        { icon: <AIIcon className="h-6 w-6 text-sky-400" />, text: "Personalized strategies" },
        { icon: <TrendingUpIcon />, text: "Accelerate your goals" },
        { icon: <ChartBarSquareIcon className="h-6 w-6 text-sky-400" />, text: "Navigate complexity" },
        { icon: <TrophyIcon />, text: "Gain confidence" },
        { icon: <ClockIcon className="h-6 w-6 text-sky-400" />, text: "Save time & effort" },
    ];
    return (
        <GlassmorphicPanel className="animate-slide-in-bottom" style={{ animationDelay: '100ms' }}>
            <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">Why Expert Guidance Matters</h2>
            <div className="grid grid-cols-2 gap-4">
                {items.map((item, index) => (
                    <div key={index} className="bg-black/20 p-4 rounded-2xl flex flex-col items-center text-center space-y-3 transition-all duration-300 hover:bg-white/5 hover:-translate-y-1">
                         <div className="flex-shrink-0 p-3 bg-gray-900/50 rounded-xl drop-shadow-[0_0_8px_rgba(77,166,255,0.7)]">
                            {item.icon}
                         </div>
                        <p className="text-sm font-semibold text-gray-300 h-10 flex items-center">{item.text}</p>
                    </div>
                ))}
            </div>
        </GlassmorphicPanel>
    );
};

const BenefitsSection: React.FC = () => {
    const benefits = [
        { icon: <CheckCircleIcon className="h-6 w-6 text-gray-300" />, title: "Vetted & Certified Experts", desc: "Every professional is thoroughly screened for qualifications and experience." },
        { icon: <DollarIcon />, title: "Transparent Pricing", desc: "No hidden fees. You see the cost upfront before you book any session." },
        { icon: <ShieldCheckIcon />, title: "Secure Booking", desc: "Your payments and personal information are protected with bank-level security." },
        { icon: <CalendarIcon className="h-6 w-6 text-gray-300" />, title: "Flexible Scheduling", desc: "Find and book a time that works for you, with options for rescheduling." },
        { icon: <LockIcon className="h-6 w-6 text-gray-300" />, title: "Confidential Sessions", desc: "Your conversations are private and protected, ensuring a safe space for discussion." },
    ];
    return (
        <GlassmorphicPanel className="animate-slide-in-bottom" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">Why Choose Our Recommended Platform</h2>
            <div className="space-y-4">
                {benefits.map((benefit) => (
                    <div key={benefit.title} className="bg-black/20 p-4 rounded-2xl flex items-center space-x-4 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:-translate-y-2 hover:shadow-sky-500/10">
                        <div className="p-3 bg-gray-800/50 rounded-xl text-sky-400">{benefit.icon}</div>
                        <div>
                            <h3 className="font-bold text-gray-200">{benefit.title}</h3>
                            <p className="text-sm text-gray-400">{benefit.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </GlassmorphicPanel>
    );
};

const ProcessSection: React.FC = () => {
    const steps = [
        { icon: <SearchIcon />, title: "Discover Experts", desc: "Browse profiles, specialties, and reviews to find the perfect match." },
        { icon: <CalendarIcon className="h-5 w-5 text-gray-300" />, title: "Select Date & Time", desc: "Choose a convenient slot from the expert’s real-time availability." },
        { icon: <ShieldCheckIcon />, title: "Secure Your Session", desc: "Confirm your booking with a secure payment and get ready for your session." },
    ];
    return (
        <GlassmorphicPanel className="animate-slide-in-bottom" style={{ animationDelay: '300ms' }}>
            <h2 className="text-2xl font-bold text-gray-100 mb-8 text-center">Your Path to Guidance</h2>
            <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-4">
                {steps.map((step, index) => (
                    <div key={index} className="flex md:flex-col items-center text-center md:flex-1 relative">
                        <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg text-white mb-4 mr-4 md:mr-0">
                            {step.icon}
                        </div>
                        <div className="text-left md:text-center">
                            <h3 className="font-bold text-lg text-gray-200">{step.title}</h3>
                            <p className="text-sm text-gray-400">{step.desc}</p>
                        </div>
                        {index < steps.length - 1 && (
                             <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-sky-500/50 animate-pulse-glow-blue" style={{ transform: 'translateX(50%)' }}></div>
                        )}
                    </div>
                ))}
            </div>
        </GlassmorphicPanel>
    );
};

const TestimonialsSection: React.FC = () => {
    const testimonials = [
        { name: "Priya K.", text: "The advice was a game-changer for my investment strategy. I finally feel confident about my financial future!", avatar: '👩‍🦰' },
        { name: "Rohan S.", text: "My expert helped me create a clear plan to get out of debt. The session was worth every rupee.", avatar: '👨‍💻' },
    ];
    return (
        <GlassmorphicPanel className="animate-slide-in-bottom" style={{ animationDelay: '400ms' }}>
            <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">Client Success Stories</h2>
            <div className="space-y-4">
                {testimonials.map((t, i) => (
                    <div key={i} className="bg-black/20 p-5 rounded-2xl shadow-lg">
                        <div className="flex items-center mb-2">
                            <span className="text-2xl mr-3">{t.avatar}</span>
                            <div>
                                <p className="font-semibold text-gray-200">{t.name}</p>
                                <div className="flex">
                                    {[...Array(5)].map((_, s) => <StarIcon key={s} className="w-4 h-4 text-amber-400" />)}
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-400 italic">"{t.text}"</p>
                    </div>
                ))}
            </div>
        </GlassmorphicPanel>
    );
};

const FaqSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const faqs = [
        { q: "How does the booking process work?", a: "You'll be redirected to our trusted partner platform where you can browse experts, select a time, and pay securely. You'll receive a confirmation email with all the details." },
        { q: "Can I reschedule a session if something comes up?", a: "Yes, the platform offers a flexible rescheduling policy, typically allowing changes up to 24 hours before your scheduled session. Please check their specific terms." },
        { q: "Are the financial experts certified?", a: "Absolutely. All experts on the platform are verified SEBI-registered advisors or CAs, ensuring you receive professional and compliant guidance." },
        { q: "What are the fees for a session?", a: "Fees vary depending on the expert's experience and the session duration. All pricing is transparent and clearly displayed on their profile before you book." },
    ];

    return (
        <GlassmorphicPanel className="animate-slide-in-bottom" style={{ animationDelay: '500ms' }}>
            <h2 className="text-2xl font-bold text-gray-100 mb-4 text-center">Common Questions</h2>
            <div className="divide-y divide-white/10">
                {faqs.map((faq, index) => (
                    <div key={index} className="overflow-hidden">
                        <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex justify-between items-center text-left py-4">
                            <span className="font-semibold text-gray-300">{faq.q}</span>
                            <ChevronDownIcon className={`text-gray-400 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-40' : 'max-h-0'}`}>
                           <div className="pb-4 pr-6 text-gray-400 text-sm">
                               {faq.a}
                           </div>
                        </div>
                    </div>
                ))}
            </div>
        </GlassmorphicPanel>
    );
};

const StickyCta: React.FC = () => (
    <div className="sticky bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/90 to-transparent">
        <button className="w-full py-4 bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 text-black font-bold rounded-2xl shadow-lg shadow-amber-500/20 text-lg animate-pulse-glow-gold">
            Go to Platform to Book
        </button>
    </div>
);

const BookExpertScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="h-full flex flex-col bg-[#0D1117]">
            <header className="sticky top-0 z-20 flex items-center p-4 bg-[#0D1117]/80 backdrop-blur-sm">
                <button onClick={onBack} className="p-2 -ml-2 text-gray-300 rounded-full hover:bg-white/10">
                    <ChevronLeftIcon />
                </button>
                <div className="text-center flex-1">
                    <h1 className="text-xl font-bold text-gray-200">Book an Expert</h1>
                </div>
                <div className="w-8"></div>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar">
                <div className="p-6 space-y-8">
                    <HeroSection />
                    <GuidanceSection />
                    <BenefitsSection />
                    <ProcessSection />
                    <TestimonialsSection />
                    <FaqSection />
                </div>
            </main>
            
            <StickyCta />
        </div>
    );
};

export default BookExpertScreen;