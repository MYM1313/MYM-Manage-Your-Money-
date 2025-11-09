import React, { FC, useContext } from 'react';
import { FinancialContext } from '../App';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';

// --- LOCAL ICONS ---
const ChevronRightIcon: FC<{ className?: string }> = ({ className = "h-6 w-6 text-gray-500" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

const DebtManagerIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const InsuranceVaultIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 22a12.02 12.02 0 009-1.056c.343-.344.65-.72.923-1.138A11.955 11.955 0 0112 2.944z" /></svg>;
const AlertsIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>;
const LearningIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const ExpertSessionsIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const FeedbackIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>;
const CommunityIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a4.5 4.5 0 014.5 0m-4.5 0a4.5 4.5 0 00-4.5 0m3.75 4.5V14.25m0 0H9m1.5 0H12m0 0V9m0 0H9m1.5 0H12m0 0V6.75m0 0H9m1.5 0H12" /></svg>;
const AIChatIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CalculatorsIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AnalyticsIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6.375 20.25h11.25A2.625 2.625 0 0020.25 18V5.625A2.625 2.625 0 0017.625 3H6.375A2.625 2.625 0 003.75 5.625v12.375c0 1.448 1.177 2.625 2.625 2.625z" /></svg>;
const SettingsIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.112.077l1.07-.357a1.125 1.125 0 011.218.818l1.358 5.214a1.125 1.125 0 01-.818 1.218l-1.07.357a1.125 1.125 0 01-1.112.077 4.872 4.872 0 00-.22-.127c-.332-.183-.582-.495-.645-.87l-.213-1.281c-.09-.543-.56-1.036-1.11-1.036h-2.593c-.55 0-1.02.493-1.11 1.036l-.213 1.281c-.063.374-.313.686-.645.87-.074.04-.147.083-.22.127a1.125 1.125 0 01-1.112-.077l-1.07-.357a1.125 1.125 0 01-.818-1.218l1.358-5.214a1.125 1.125 0 011.218-.818l1.07.357a1.125 1.125 0 011.112-.077c.073-.044.146-.087.22-.127.332-.183.582-.495-.645-.87l.213-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const SupportIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;
const LegalIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
const LogoutIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>;

// --- REUSABLE COMPONENTS ---
const Section: FC<{ title: string; children: React.ReactNode; animationDelay?: number }> = ({ title, children, animationDelay = 0 }) => (
    <div className="animate-slide-up-fade-in" style={{ animationDelay: `${animationDelay}ms` }}>
        <h2 className="text-sm font-bold text-gray-400 mb-2 px-2 uppercase tracking-wider">{title}</h2>
        <div className="premium-glass !p-2 divide-y divide-white/10">
            {children}
        </div>
    </div>
);

const ProfileRow: FC<{ title: string; description: string; icon: React.ReactNode; onClick?: () => void; isComingSoon?: boolean; isLogout?: boolean; }> = ({ title, description, icon, onClick, isComingSoon, isLogout }) => (
    <div onClick={onClick} className={`group relative p-3 flex items-center space-x-4 transition-all duration-300 ${isLogout ? 'hover:bg-red-900/20' : 'hover:bg-sky-900/20'} cursor-pointer rounded-xl`}>
        {isComingSoon && <div className="absolute top-2 right-12 text-xs font-bold bg-amber-900/50 text-amber-300 px-2 py-0.5 rounded-full z-10">Soon</div>}
        <div className="p-3 bg-black/30 rounded-xl">{icon}</div>
        <div className="flex-1">
            <h3 className={`font-semibold transition-colors text-base ${isLogout ? 'text-red-300' : 'text-gray-100 group-hover:text-sky-300'}`}>{title}</h3>
            <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
        {!isLogout && <ChevronRightIcon className="h-6 w-6 text-gray-500 group-hover:text-sky-300 transition-colors" />}
    </div>
);


// --- MAIN PROFILE SCREEN COMPONENT ---
const ProfileScreen: FC<{ onNavigate: (view: string, params?: any) => void }> = ({ onNavigate }) => {
    const { user, logout } = useContext(FinancialContext);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to sign out?')) {
            logout();
        }
    };

    return (
        <div className="bg-gradient-to-b from-[#10141b] to-[#0D1117] text-white min-h-screen font-sans">
            <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl">
                <button onClick={() => onNavigate('Home')} className="p-2 -ml-2 text-gray-300 rounded-full hover:bg-white/10">
                    <ChevronLeftIcon />
                </button>
                <h1 className="text-xl font-bold">Profile</h1>
                <button onClick={() => onNavigate('settings')} className="p-2 -mr-2 text-gray-300 rounded-full hover:bg-white/10">
                    <SettingsIcon />
                </button>
            </header>
            
            <main className="p-6 pt-0 space-y-8">
                <div className="flex flex-col items-center text-center space-y-4 animate-slide-up-fade-in">
                    <img src={user.profilePictureUrl} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-gray-700 shadow-lg" />
                    <div>
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                    <p className="text-sky-300 font-semibold" style={{ animationDelay: '100ms' }}>
                        “Manage, plan & grow your money in one place.”
                    </p>
                </div>

                <Section title="Financial Overview" animationDelay={200}>
                    <ProfileRow title="Debt Manager" description="Track, manage & get strategies to clear loans faster" icon={<DebtManagerIcon />} onClick={() => onNavigate('debt')} />
                    <ProfileRow title="Insurance" description="Organize, track & analyze all policies" icon={<InsuranceVaultIcon />} onClick={() => onNavigate('insurance')} />
                    <ProfileRow title="Upcoming Alerts" description="Expiries for policies, payments, or deadlines" icon={<AlertsIcon />} onClick={() => onNavigate('notifications')} />
                </Section>
                
                <Section title="Learning Hub" animationDelay={300}>
                    <ProfileRow title="Learning" description="Bite-sized lessons on investing & wealth building" icon={<LearningIcon />} onClick={() => onNavigate('learning')} isComingSoon />
                    <ProfileRow title="Expert Sessions" description="Book sessions with top finance experts" icon={<ExpertSessionsIcon />} onClick={() => onNavigate('bookExpert')} isComingSoon />
                </Section>
                
                <Section title="Community & Feedback" animationDelay={400}>
                    <ProfileRow title="Share Feedback & Suggestions" description="Help us improve your MYM experience" icon={<FeedbackIcon />} onClick={() => onNavigate('feedback')} />
                    <ProfileRow title="Connect with Community" description="Discuss, and share insights" icon={<CommunityIcon />} onClick={() => onNavigate('community')} />
                </Section>
                
                <Section title="Tools & Insights" animationDelay={500}>
                    <ProfileRow title="AI Finance Chat" description="Ask, learn & plan instantly" icon={<AIChatIcon />} onClick={() => onNavigate('aiChat')} />
                    <ProfileRow title="Investment & Finance Calculators" description="SIPs, EMIs, compounding returns" icon={<CalculatorsIcon />} onClick={() => onNavigate('tools')} />
                    <ProfileRow title="Analytics & Insights" description="Advanced tools for financial decisions" icon={<AnalyticsIcon />} onClick={() => onNavigate('aiAnalysis')} />
                </Section>

                <Section title="Application" animationDelay={600}>
                     <ProfileRow title="App Settings" description="Profile preferences, privacy, notifications, theme, language" icon={<SettingsIcon />} onClick={() => onNavigate('settings')} />
                     <ProfileRow title="Support & Help" description="Contact support, FAQs, help center" icon={<SupportIcon />} onClick={() => onNavigate('support')} />
                     <ProfileRow title="Legal & Privacy" description="Terms & Privacy policies, app version info" icon={<LegalIcon />} onClick={() => onNavigate('terms')} />
                </Section>

                 <Section title="Account" animationDelay={700}>
                     <ProfileRow title="Logout" description="Sign out of the application" icon={<LogoutIcon />} onClick={handleLogout} isLogout />
                </Section>
            </main>
        </div>
    );
};

export default ProfileScreen;