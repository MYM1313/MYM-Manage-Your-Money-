import React, { FC, useContext, useState } from 'react';
import { FinancialContext } from '../../App';
import { ChevronLeftIcon } from '../../components/icons/ChevronLeftIcon';

// Local icon components
const LockClosedIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const DevicePhoneMobileIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75A2.25 2.25 0 0015.75 1.5h-2.25m-3.75 0V3h-3v-1.5m-3 0h3m0 0h3.75" /></svg>;
const EnvelopeIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.625a2.25 2.25 0 01-2.36 0l-7.5-4.625A2.25 2.25 0 012.25 6.993V6.75" /></svg>;

// Reusable Components from SettingsScreen
const SettingsCard: FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="premium-glass !rounded-2xl !p-0">
        <div className="p-4"><h2 className="text-lg font-bold text-gray-200">{title}</h2></div>
        <div className="p-4 pt-0 space-y-2">{children}</div>
    </div>
);
const SettingsRow: FC<{ label: string; description?: string; children: React.ReactNode; onClick?: () => void; }> = ({ label, description, children, onClick }) => (
    <div onClick={onClick} className={`flex justify-between items-center min-h-[40px] bg-black/20 p-3 rounded-lg ${onClick ? 'cursor-pointer group hover:bg-white/5' : ''}`}>
        <div className="flex items-center space-x-3">
            {children[0]}
            <div>
                <p className="font-semibold text-gray-200 group-hover:text-sky-300 transition-colors">{label}</p>
                {description && <p className="text-xs text-gray-400">{description}</p>}
            </div>
        </div>
        <div className="flex-shrink-0">{children[1]}</div>
    </div>
);
const Toggle: FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${checked ? 'bg-sky-500' : 'bg-gray-700'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);
const timeSince = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if(seconds < 60) return "Just now";
    const minutes = Math.floor(seconds/60);
    if(minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes/60);
    if(hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours/24);
    return `${days}d ago`;
}

const SecurityScreen: FC<{ onBack: () => void; }> = ({ onBack }) => {
    const { appSettings, setAppSettings, loginActivity } = useContext(FinancialContext);

    const handle2FAToggle = (value: boolean) => {
        setAppSettings(prev => ({ ...prev, privacy: { ...prev.privacy, is2FAEnabled: value } }));
    };

    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-[#0a0f1f] to-[#0D1117] text-gray-200 animate-slide-in-right-fade">
             <header className="sticky top-0 z-20 p-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl">
                <div className="flex items-center">
                    <button onClick={onBack} className="p-2 -ml-2 text-gray-300 rounded-full hover:bg-white/10"><ChevronLeftIcon /></button>
                    <div className="text-center flex-1">
                        <h1 className="text-2xl font-bold text-gray-100">Security</h1>
                    </div>
                    <div className="w-8"></div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-6">
                <SettingsCard title="Authentication">
                    <SettingsRow label="Change Password" description="Last changed 3 months ago" onClick={() => alert("Change password flow initiated.")}>
                        <LockClosedIcon /><span />
                    </SettingsRow>
                    <SettingsRow label="Two-Factor Authentication" description="Adds an extra layer of security to your account">
                        <DevicePhoneMobileIcon /><Toggle checked={appSettings.privacy.is2FAEnabled} onChange={handle2FAToggle} />
                    </SettingsRow>
                </SettingsCard>
                
                <SettingsCard title="Recovery">
                    <SettingsRow label="Recovery Email" description={appSettings.privacy.recoveryEmail}>
                        <EnvelopeIcon /><span />
                    </SettingsRow>
                </SettingsCard>

                <SettingsCard title="Login Activity">
                     {loginActivity.map(activity => (
                        <div key={activity.id} className="flex items-center space-x-3 bg-black/20 p-3 rounded-lg">
                           <DevicePhoneMobileIcon />
                            <div className="flex-1">
                                <p className="font-semibold text-gray-200">{activity.device}</p>
                                <p className="text-xs text-gray-400">{activity.location}</p>
                            </div>
                            <div className="text-right">
                                {activity.isCurrent 
                                    ? <p className="text-xs font-bold text-green-400">Active now</p> 
                                    : <p className="text-xs text-gray-500">{timeSince(activity.timestamp)}</p>
                                }
                            </div>
                        </div>
                     ))}
                     <button className="text-sm font-semibold text-sky-400 pt-2 w-full text-center">Sign out of all other sessions</button>
                </SettingsCard>
            </main>
        </div>
    );
};

export default SecurityScreen;