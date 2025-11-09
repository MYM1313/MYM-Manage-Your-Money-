import React, { useState, useMemo, useEffect, useContext } from 'react';
import { Transaction, TransactionType, SuperCategory } from '../types';
import { FinancialContext } from '../App';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { SearchIcon } from '../components/icons/SearchIcon';
import { XIcon } from '../components/icons/XIcon';
import GlassmorphicPanel from '../components/shared/Card';

// --- ICONS (Local to this screen for simplicity) ---
const DownloadIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const categoryIcons: { [key: string]: string } = {
    'Food': '🍔', 'Shopping': '🛍️', 'Transport': '🚗', 'Housing': '🏠', 'Utilities': '💡',
    'Health': '❤️', 'Entertainment': '🎬', 'Groceries': '🛒', 'Salary': '💼',
    'Freelance': '🖋️', 'Investment': '📈', 'Savings': '🎯', 'EMI': '🏦', 'Loan Payment': '🏦', 'Insurance Premium': '🛡️',
    'Default': '💰'
};

// --- SUB-COMPONENTS for Transactions Screen ---

const TransactionCard: React.FC<{ transaction: Transaction; onClick: () => void; }> = ({ transaction, onClick }) => {
    const typeStyles = {
        income: { border: 'border-green-400/50', text: 'text-green-400' },
        expense: { border: 'border-red-400/50', text: 'text-red-400' },
        investment: { border: 'border-purple-400/50', text: 'text-purple-400' },
        savings: { border: 'border-amber-400/50', text: 'text-amber-400' },
    };
    const style = typeStyles[transaction.type];
    const sign = transaction.type === 'income' ? '+' : '-';
    const isDebt = transaction.category === 'EMI' || transaction.category === 'Loan Payment';

    return (
        <div onClick={onClick} className={`bg-black/20 border-l-4 ${style.border} rounded-xl p-4 flex items-center space-x-4 cursor-pointer hover:bg-white/10 transition-all duration-200`}>
            <div className="text-3xl bg-black/30 p-3 rounded-xl relative">
                {isDebt && <span className="absolute -top-1 -right-1 text-xs">💸</span>}
                {categoryIcons[transaction.category] || categoryIcons['Default']}
            </div>
            <div className="flex-1">
                <p className="font-bold text-gray-100">{transaction.merchant}</p>
                <p className="text-sm text-gray-400">{transaction.category}</p>
            </div>
            <div className="text-right">
                <p className={`font-bold text-lg ${style.text}`}>{sign} ₹{transaction.amount.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
            </div>
        </div>
    );
};

const TransactionDetailModal: React.FC<{ transaction: Transaction | null; onClose: () => void; }> = ({ transaction, onClose }) => {
    if (!transaction) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <GlassmorphicPanel className="w-full max-w-md relative !p-0 !bg-[#181C23] border-white/20" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold text-gray-100">{transaction.merchant}</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-white/10 transition-colors"><XIcon /></button>
                </div>
                <div className="p-6 space-y-3 text-gray-300">
                    <div className="flex justify-between"><span className="text-gray-500">Amount:</span> <span className="font-semibold">₹{transaction.amount.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Category:</span> <span className="font-semibold">{transaction.category}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Date:</span> <span className="font-semibold">{new Date(transaction.date).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Payment Mode:</span> <span className="font-semibold">{transaction.paymentMode}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Type:</span> <span className="font-semibold capitalize">{transaction.type}</span></div>
                    {transaction.notes && <div className="pt-2"><p className="text-gray-500">Notes:</p><p className="bg-black/20 p-2 rounded-lg text-sm">{transaction.notes}</p></div>}
                    {transaction.tags.length > 0 && (
                        <div className="pt-2">
                             <p className="text-gray-500 mb-1">Tags:</p>
                             <div className="flex flex-wrap gap-2">
                                {transaction.tags.map(tag => <span key={tag} className="text-xs bg-sky-900/50 text-sky-300 px-2 py-1 rounded-full">#{tag}</span>)}
                            </div>
                        </div>
                    )}
                </div>
            </GlassmorphicPanel>
        </div>
    );
};


// --- MAIN SCREEN COMPONENT ---

const TransactionsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { transactions } = useContext(FinancialContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | TransactionType>('all');
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesFilter = filter === 'all' || t.type === filter;
            const matchesSearch = searchTerm === '' ||
                t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesFilter && matchesSearch;
        });
    }, [transactions, searchTerm, filter]);

    const filterOptions: ('all' | TransactionType)[] = ['all', 'income', 'expense', 'investment', 'savings'];

    return (
        <>
            <div className="h-full flex flex-col bg-[#0D1117] text-gray-200">
                <header className="sticky top-0 z-20 flex items-center p-4 bg-[#0D1117]/80 backdrop-blur-sm">
                    <button onClick={onBack} className="p-2 -ml-2 text-gray-300 rounded-full hover:bg-white/10"><ChevronLeftIcon /></button>
                    <div className="text-center flex-1"><h1 className="text-xl font-bold text-gray-100">Transaction History</h1></div>
                    <div className="w-8"></div>
                </header>

                <main className="flex-1 overflow-y-auto no-scrollbar p-6 pt-2">
                    <div className="space-y-6">
                        
                        <div>
                            <div className="relative mb-3">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><SearchIcon /></div>
                                <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-sky-500 transition"/>
                            </div>
                            <div className="flex space-x-2 no-scrollbar overflow-x-auto">
                                {filterOptions.map(f => (
                                    <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${filter === f ? 'bg-sky-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                                        {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                                    </button>
                                ))}
                                <button className="px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap bg-white/5 text-gray-400 hover:bg-white/10 flex items-center space-x-2"><DownloadIcon /><span>Export</span></button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {filteredTransactions.length > 0 ? filteredTransactions.map((t, index) => (
                                <div key={t.id} className="animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                                    <TransactionCard transaction={t} onClick={() => setSelectedTransaction(t)} />
                                </div>
                            )) : (
                                <div className="text-center py-20 text-gray-500">
                                    <p className="text-lg font-semibold">No Matching Transactions</p>
                                    <p>Try adjusting your search or filter.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            <TransactionDetailModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
        </>
    );
};

export default TransactionsScreen;