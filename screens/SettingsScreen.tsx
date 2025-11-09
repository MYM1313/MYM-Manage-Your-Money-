import React, { FC, useContext, useState } from 'react';
import { FinancialContext } from '../App';
import { AppSettings } from '../types';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';

// Local icon components for this screen
const UserCircleIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const BellIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const PaintBrushIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 00-1.622-3.385m-5.043-.025a15.998 15.998 0 01-3.388-1.621m-5.043.025a15.998 15.998 0 00-3.388-1.622m5.043-.025a15.998 15.998 0 01-1.622-3.385" /></svg>;
const ShieldLockIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l1.5 1.5 3-3.75M9 12l2.25 2.25L15 9.75M21 12c0 1.268-.63 2.4-1.683 3.034l-7.822 5.475-7.822-5.475A3.75 3.75 0 013 12V8.25a3.75 3.75 0 013.75-3.75h7.5A3.75 3.75 0 0121 8.25V12z" /></svg>;
const InfoCircleIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ChevronRightIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>;
const TrashIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09a2.09 2.09 0 00-2.09 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const ResetIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691L15 12" /></svg>;
const ExportIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;

// Reusable Components
const SettingsCard: FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string; animationDelay?: number; }> = ({ title, icon, children, className, animationDelay = 0 }) => (
    <div className={`premium-glass !rounded-2xl !p-0 animate-slide-up-fade-in ${className}`} style={{ animationDelay: `${animationDelay}ms` }}>
        <div className="p-4 flex items-center space-x-3 border-b border-white/10">
            <div className="p-2 bg-black/20 rounded-lg">{icon}</div>
            <h2 className="text-lg font-bold text-gray-200">{title}</h2>
        </div>
        <div className="p-4 space-y-4">{children}</div>
    </div>
);

const SettingsRow: FC<{ label: string; description?: string; children: React.ReactNode; onClick?: () => void; }> = ({ label, description, children, onClick }) => (
    <div onClick={onClick} className={`flex justify-between items-center min-h-[40px] ${onClick ? 'cursor-pointer group' : ''}`}>
        <div>
            <p className="font-semibold text-gray-200 group-hover:text-sky-300 transition-colors">{label}</p>
            {description && <p className="text-xs text-gray-400 max-w-xs">{description}</p>}
        </div>
        <div className="flex-shrink-0">{children}</div>
    </div>
);

const Toggle: FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${checked ? 'bg-sky-500' : 'bg-gray-700'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const SegmentedControl: FC<{ options: string[]; value: string; onSelect: (val: string) => void; }> = ({ options, value, onSelect }) => (
    <div className="flex gap-1 bg-black/30 p-1 rounded-lg">
        {options.map(opt => (
            <button key={opt} onClick={() => onSelect(opt)} className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${value === opt ? 'bg-gray-600 text-white' : 'text-gray-400'}`}>
                {opt}
            </button>
        ))}
    </div>
);

const ConfirmationModal: FC<{ title: string; message: string; onConfirm: () => void; onCancel: () => void; confirmText?: string; confirmClass?: string; }> = ({ title, message, onConfirm, onCancel, confirmText = "Confirm", confirmClass="bg-red-600 hover:bg-red-500" }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onCancel}>
        <div className="premium-glass w-full max-w-sm !p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-100">{title}</h3>
            <p className="text-gray-400 mt-2">{message}</p>
            <div className="flex justify-end space-x-3 mt-6">
                <button onClick={onCancel} className="px-4 py-2 bg-gray-700 text-gray-200 font-semibold rounded-lg hover:bg-gray-600 transition-colors">Cancel</button>
                <button onClick={onConfirm} className={`px-4 py-2 text-white font-semibold rounded-lg transition-colors ${confirmClass}`}>{confirmText}</button>
            </div>
        </div>
    </div>
);

const Toast: FC<{ message: string; show: boolean; }> = ({ message, show }) => (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${show ? 'animate-slide-in-from-top' : 'animate-slide-out-to-top pointer-events-none'}`}>
        <div className="bg-green-900/50 backdrop-blur-md text-green-300 font-semibold py-3 px-5 rounded-xl shadow-2xl flex items-center space-x-3 border border-green-500/30">
            <span>✅</span>
            <span>{message}</span>
        </div>
    </div>
);


const SettingsScreen: FC<{ onBack: () => void; onNavigate: (view: string, params?: any) => void; }> = ({ onBack, onNavigate }) => {
    const { appSettings, setAppSettings, resetAppSettings, deleteAllData } = useContext(FinancialContext);
    const [confirmAction, setConfirmAction] = useState<null | 'reset' | 'delete'>(null);
    const [toastMessage, setToastMessage] = useState('');

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const updateSetting = <K extends keyof AppSettings, V extends keyof AppSettings[K]>(category: K, key: V, value: AppSettings[K][V]) => {
        setAppSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value,
            }
        }));
        showToast("Settings updated");
    };

    const handleReset = () => {
        resetAppSettings();
        setConfirmAction(null);
        showToast("All settings have been reset to default.");
    };
    
    const handleDeleteData = () => {
        deleteAllData();
        setConfirmAction(null);
        showToast("All your data has been scheduled for deletion.");
    };

    const handleExport = () => {
        showToast("Your data export is being prepared.");
    }

    return (
        <>
            <Toast message={toastMessage} show={!!toastMessage} />
            {confirmAction === 'reset' && <ConfirmationModal title="Reset All Settings?" message="This will restore all settings to their original defaults. Are you sure?" onConfirm={handleReset} onCancel={() => setConfirmAction(null)} confirmText="Reset" confirmClass="bg-amber-600 hover:bg-amber-500" />}
            {confirmAction === 'delete' && <ConfirmationModal title="Delete All Your Data?" message="This action is irreversible and will permanently delete all your financial data from the app." onConfirm={handleDeleteData} onCancel={() => setConfirmAction(null)} confirmText="Yes, Delete" />}
            
            <div className="h-full flex flex-col bg-gradient-to-b from-[#0a0f1f] to-[#0D1117] text-gray-200">
                <header className="sticky top-0 z-20 p-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl">
                    <div className="flex items-center">
                        <button onClick={onBack} className="p-2 -ml-2 text-gray-300 rounded-full hover:bg-white/10"><ChevronLeftIcon /></button>
                        <div className="text-center flex-1">
                            <h1 className="text-2xl font-bold text-gray-100">Settings</h1>
                        </div>
                        <div className="w-8"></div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 space-y-6">
                    <SettingsCard title="Account & Profile" icon={<UserCircleIcon />} animationDelay={0}>
                        <SettingsRow label="Edit Profile" onClick={() => onNavigate('editProfile')}><ChevronRightIcon /></SettingsRow>
                        <SettingsRow label="Linked Accounts" onClick={() => onNavigate('linkedAccounts')}><ChevronRightIcon /></SettingsRow>
                        <SettingsRow label="Security" onClick={() => onNavigate('security')}><ChevronRightIcon /></SettingsRow>
                    </SettingsCard>

                    <SettingsCard title="Notifications & Alerts" icon={<BellIcon />} animationDelay={50}>
                        <SettingsRow label="Push Notifications"><Toggle checked={appSettings.notifications.pushEnabled} onChange={v => updateSetting('notifications', 'pushEnabled', v)} /></SettingsRow>
                        <SettingsRow label="AI Smart Alerts"><Toggle checked={appSettings.notifications.aiAlerts} onChange={v => updateSetting('notifications', 'aiAlerts', v)} /></SettingsRow>
                        <SettingsRow label="Reminder Frequency"><SegmentedControl options={['Daily', 'Weekly', 'Monthly']} value={appSettings.notifications.reminderFrequency} onSelect={v => updateSetting('notifications', 'reminderFrequency', v as typeof appSettings.notifications.reminderFrequency)} /></SettingsRow>
                    </SettingsCard>

                    <SettingsCard title="Appearance & Interface" icon={<PaintBrushIcon />} animationDelay={100}>
                        <SettingsRow label="Theme Mode"><SegmentedControl options={['Light', 'Dark', 'Auto']} value={appSettings.appearance.theme} onSelect={v => updateSetting('appearance', 'theme', v as typeof appSettings.appearance.theme)} /></SettingsRow>
                        <SettingsRow label="Font Size"><SegmentedControl options={['Small', 'Medium', 'Large']} value={appSettings.appearance.fontSize} onSelect={v => updateSetting('appearance', 'fontSize', v as typeof appSettings.appearance.fontSize)} /></SettingsRow>
                        <SettingsRow label="Animation Intensity" description={`${appSettings.appearance.animationIntensity}%`}><input type="range" min="0" max="100" value={appSettings.appearance.animationIntensity} onChange={e => updateSetting('appearance', 'animationIntensity', parseInt(e.target.value))} className="w-24" /></SettingsRow>
                    </SettingsCard>
                    
                    <SettingsCard title="Privacy & Data" icon={<ShieldLockIcon />} animationDelay={150}>
                        <SettingsRow label="App Lock"><SegmentedControl options={['None', 'PIN', 'Biometric']} value={appSettings.privacy.appLock} onSelect={v => updateSetting('privacy', 'appLock', v as any)} /></SettingsRow>
                        <SettingsRow label="Analytics Consent"><Toggle checked={appSettings.privacy.analyticsConsent} onChange={v => updateSetting('privacy', 'analyticsConsent', v)} /></SettingsRow>
                        <SettingsRow label="Export My Data" onClick={handleExport}><button className="flex items-center space-x-2 text-sm font-semibold text-sky-400"><ExportIcon /><span>Export</span></button></SettingsRow>
                        <SettingsRow label="Delete My Data" onClick={() => setConfirmAction('delete')}><button className="flex items-center space-x-2 text-sm font-semibold text-red-400"><TrashIcon /><span>Delete</span></button></SettingsRow>
                    </SettingsCard>
                    
                    <SettingsCard title="About & Support" icon={<InfoCircleIcon />} animationDelay={250}>
                        <SettingsRow label="App Version"><span className="text-sm font-semibold text-gray-400">1.0.0</span></SettingsRow>
                        <SettingsRow label="Terms & Privacy" onClick={() => onNavigate('terms')}><ChevronRightIcon /></SettingsRow>
                        <SettingsRow label="Contact Support" onClick={() => onNavigate('support')}><ChevronRightIcon /></SettingsRow>
                    </SettingsCard>

                     <div className="text-center pt-4 animate-slide-up-fade-in" style={{ animationDelay: '300ms' }}>
                        <button onClick={() => setConfirmAction('reset')} className="group flex items-center space-x-2 text-sm font-semibold text-amber-400 bg-amber-900/30 px-6 py-3 rounded-lg hover:bg-amber-900/50 transition-colors mx-auto">
                            <ResetIcon />
                            <span>Reset All Settings</span>
                        </button>
                    </div>
                </main>
            </div>
        </>
    );
};

export default SettingsScreen;