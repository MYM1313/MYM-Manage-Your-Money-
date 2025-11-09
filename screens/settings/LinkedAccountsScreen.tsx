import React, { FC, useContext, useState } from 'react';
import { FinancialContext } from '../../App';
import { LinkedAccount } from '../../types';
import { ChevronLeftIcon } from '../../components/icons/ChevronLeftIcon';

const BankIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 12h6m-6 5.25h6M5.25 6h.008v.008H5.25V6zm0 5.25h.008v.008H5.25v-0.008zm0 5.25h.008v.008H5.25v-0.008zm13.5-5.25h.008v.008h-.008v-0.008zm0 5.25h.008v.008h-.008v-0.008zM18 6h.008v.008H18V6z" /></svg>;
const WalletIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 3a9 9 0 00-18 0z" /></svg>;
const InvestmentIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>;

const AccountCard: FC<{ account: LinkedAccount; onRemove: () => void; }> = ({ account, onRemove }) => {
    const icons = {
        Bank: <BankIcon />,
        Wallet: <WalletIcon />,
        Investment: <InvestmentIcon />
    };

    return (
        <div className="premium-glass !p-4 flex items-center justify-between group">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-black/20 rounded-lg">{icons[account.type]}</div>
                <div>
                    <p className="font-bold text-gray-100">{account.name}</p>
                    <p className="text-sm text-gray-400">{account.type} ending in •••• {account.last4}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-xs font-semibold text-gray-400 hover:text-white">Refresh</button>
                <button onClick={onRemove} className="text-xs font-semibold text-red-400 hover:text-red-300">Remove</button>
            </div>
        </div>
    );
};

const LinkedAccountsScreen: FC<{ onBack: () => void; }> = ({ onBack }) => {
    const { linkedAccounts, removeLinkedAccount } = useContext(FinancialContext);
    
    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-[#0a0f1f] to-[#0D1117] text-gray-200 animate-slide-in-right-fade">
             <header className="sticky top-0 z-20 p-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl">
                <div className="flex items-center">
                    <button onClick={onBack} className="p-2 -ml-2 text-gray-300 rounded-full hover:bg-white/10"><ChevronLeftIcon /></button>
                    <div className="text-center flex-1">
                        <h1 className="text-2xl font-bold text-gray-100">Linked Accounts</h1>
                    </div>
                    <div className="w-8"></div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-4">
                    {linkedAccounts.map(acc => (
                        <AccountCard key={acc.id} account={acc} onRemove={() => removeLinkedAccount(acc.id)} />
                    ))}
                </div>
            </main>

            <footer className="p-4 bg-gradient-to-t from-[#0D1117] to-transparent">
                <button onClick={() => alert("This would open a secure connection flow (e.g., Plaid) to link a new bank account.")} className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/20 hover:scale-[1.02] active:scale-100 transition-transform transform text-lg">
                    Link New Account
                </button>
            </footer>
        </div>
    );
};

export default LinkedAccountsScreen;