import React, { useState, useMemo, createContext, FC, ReactNode } from 'react';
import { Tab, Transaction, DetailedSavingsGoal, Investment, InsurancePolicy, Debt, SuperCategory, TransactionType, DebtPlan, FinancialContextType, InvestmentGoal } from './types';
import TopNav from './components/layout/TopNav';
import BottomNav from './components/layout/BottomNav';
import HomeScreen from './screens/HomeScreen';
import ExpenseScreen from './screens/TrackScreen';
import SaveScreen from './screens/SaveScreen';
import InvestScreen from './screens/InvestScreen';
import ProfileScreen from './screens/ProfileScreen';

// Sub-screen imports for navigation
import ManageDebtScreen from './screens/ManageDebtScreen';
import InsuranceScreen from './screens/InsuranceScreen';
import NetWorthScreen from './screens/NetWorthScreen';
import ToolsAndCalculatorsScreen from './screens/ToolsAndCalculatorsScreen';
import AIChatScreen from './screens/AIChatScreen';
import LearningCenterScreen from './screens/LearningCenterScreen';
import BookExpertScreen from './screens/BookExpertScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import AIAnalysisScreen from './screens/AIAnalysisScreen';

// --- FINANCIAL CONTEXT ---

// FIX: Added explicit types to empty arrays in the default context value.
// This prevents TypeScript from inferring them as `never[]`, which caused type errors
// in components consuming this context (e.g., `HomeScreen`).
export const FinancialContext = createContext<FinancialContextType>({
    transactions: [] as Transaction[],
    addTransaction: (transaction: Omit<Transaction, 'id' | 'type' | 'paymentMode' | 'tags' | 'superCategory'> & { transactionType: 'income' | 'expense'; notes?: string; }) => '',
    removeTransaction: () => {},
    savingsGoals: [] as DetailedSavingsGoal[],
    addSavingsGoal: () => {},
    updateSavingsGoal: () => {},
    addFundsToGoal: () => {},
    investments: [] as Investment[],
    addInvestment: () => {},
    insurancePolicies: [] as InsurancePolicy[],
    addInsurancePolicy: () => {},
    updateInsurancePolicy: () => {},
    debts: [] as Debt[],
    addDebt: () => {},
    categorySplit: { essential: 50, investment: 30, wants: 20 },
    setCategorySplit: () => {},
    debtPlan: null,
    setDebtPlan: () => {},
    investmentGoals: [] as InvestmentGoal[],
    addInvestmentGoal: () => {},
    updateInvestmentGoal: () => {},
    deleteInvestmentGoal: () => {},
});

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<{ view: string; params?: any }>({ view: 'Home' });

  const handleNavigation = (view: string, params?: any) => {
    setCurrentView({ view, params });
  };

  const activeTab = useMemo(() => {
    const topLevelTabs: Tab[] = ['Home', 'Expense', 'Save', 'Invest', 'Profile'];
    if (topLevelTabs.includes(currentView.view as Tab)) {
        return currentView.view as Tab;
    }
    const profileSubViews = ['debt', 'insurance', 'netWorth', 'tools', 'aiChat', 'learning', 'bookExpert', 'transactions', 'aiAnalysis'];
    if (profileSubViews.includes(currentView.view)) {
        return 'Profile';
    }
    return 'Home'; // Fallback
  }, [currentView.view]);

  const renderContent = () => {
    const handleBackToHome = () => handleNavigation('Home');
    const handleBackToProfile = () => handleNavigation('Profile');

    switch (currentView.view) {
      case 'Home':
        return <HomeScreen onNavigate={handleNavigation} />;
      case 'Expense':
        return <ExpenseScreen onNavigate={handleNavigation} />;
      case 'Save':
        return <SaveScreen />;
      case 'Invest':
        return <InvestScreen />;
      case 'Profile':
        return <ProfileScreen onNavigate={handleNavigation} />;
      case 'tools':
        return <ToolsAndCalculatorsScreen onBack={activeTab === 'Home' ? handleBackToHome : handleBackToProfile} initialCategory={currentView.params?.category} />;
      case 'aiAnalysis':
        return <AIAnalysisScreen onBack={activeTab === 'Home' ? handleBackToHome : handleBackToProfile} />;
      case 'bookExpert':
        return <BookExpertScreen onBack={activeTab === 'Home' ? handleBackToHome : handleBackToProfile} />;
      case 'aiChat':
        return <AIChatScreen onBack={activeTab === 'Home' ? handleBackToHome : handleBackToProfile} />;
      case 'debt':
        return <ManageDebtScreen onBack={handleBackToProfile} onNavigate={handleNavigation} />;
      case 'insurance':
        return <InsuranceScreen onBack={handleBackToProfile} onNavigate={handleNavigation} />;
      case 'netWorth':
        return <NetWorthScreen onBack={handleBackToProfile} />;
      case 'learning':
        return <LearningCenterScreen onBack={handleBackToProfile} initialCategory={currentView.params?.category} />;
      case 'transactions':
        return <TransactionsScreen onBack={handleBackToProfile} />;
      default:
        return <HomeScreen onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="h-screen w-full bg-[#0D1117] font-sans relative flex flex-col overflow-hidden">
        <TopNav setActiveTab={(tab) => handleNavigation(tab)} />
        <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
          {renderContent()}
        </main>
        <BottomNav activeTab={activeTab} setActiveTab={(tab) => handleNavigation(tab)} />
    </div>
  );
};

// --- DUMMY DATA ---

// Helper function to generate ISO dates for the current year
const getDate = (day: number, monthOffset = 0, yearOffset = 0) => {
    const today = new Date();
    // Handles month wrapping correctly, e.g., month -1 becomes previous year's December
    return new Date(today.getFullYear() - yearOffset, today.getMonth() - monthOffset, day).toISOString();
};

// FIX: Explicitly cast `type` and `paymentMode` to their respective literal types to fix TypeScript inference errors.
const DUMMY_TRANSACTIONS: Transaction[] = [];
const DUMMY_SAVINGS_GOALS: DetailedSavingsGoal[] = [];
const DUMMY_INVESTMENT_GOALS: InvestmentGoal[] = [];
const DUMMY_INVESTMENTS: Investment[] = [];
const DUMMY_INSURANCE_POLICIES: InsurancePolicy[] = [];
const DUMMY_DEBTS: Debt[] = [];

const App: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(DUMMY_TRANSACTIONS);
    const [savingsGoals, setSavingsGoals] = useState<DetailedSavingsGoal[]>(DUMMY_SAVINGS_GOALS);
    const [investments, setInvestments] = useState<Investment[]>(DUMMY_INVESTMENTS);
    const [investmentGoals, setInvestmentGoals] = useState<InvestmentGoal[]>(DUMMY_INVESTMENT_GOALS);
    const [insurancePolicies, setInsurancePolicies] = useState<InsurancePolicy[]>(DUMMY_INSURANCE_POLICIES);
    const [debts, setDebts] = useState<Debt[]>(DUMMY_DEBTS);
    const [categorySplit, setCategorySplit] = useState({ essential: 50, investment: 30, wants: 20 });
    const [debtPlan, setDebtPlan] = useState<DebtPlan | null>(null);

    const categoryToSuperCategoryMap: Record<string, SuperCategory> = {
        'Groceries': 'Essential',
        'Bills': 'Essential',
        'EMI': 'Essential',
        'Loan Payment': 'Essential',
        'Rent': 'Essential',
        'Transport': 'Essential',
        'Health': 'Essential',
        'Utilities': 'Essential',
        'Education': 'Essential',
        'Household': 'Essential',
        'Investment': 'Investment',
        'Savings': 'Savings',
        'Insurance Premium': 'Essential',
        'Goal Contribution': 'Savings',
        'Food': 'Entertainment',
        'Shopping': 'Entertainment',
        'Entertainment': 'Entertainment',
        'Travel': 'Entertainment',
        'Gifts': 'Entertainment',
    };

    const addTransaction = (transaction: Omit<Transaction, 'id' | 'type' | 'paymentMode' | 'tags' | 'superCategory'> & { transactionType: 'income' | 'expense'; notes?: string; }): string => {
        let superCategory: SuperCategory;
        if (transaction.transactionType === 'income') {
            superCategory = 'Income';
        } else {
            superCategory = categoryToSuperCategoryMap[transaction.category] || 'Essential'; // Default unknown expenses to Essential
        }

        const typeMap: Record<SuperCategory, TransactionType> = {
            'Income': 'income',
            'Essential': 'expense',
            'Entertainment': 'expense',
            'Savings': 'savings',
            'Investment': 'investment'
        };
        
        const newTransactionId = Date.now().toString();
        const newTransaction: Transaction = {
            merchant: transaction.merchant,
            amount: transaction.amount,
            category: transaction.category,
            date: transaction.date,
            isRecurring: transaction.isRecurring,
            notes: transaction.notes,
            id: newTransactionId,
            superCategory,
            type: typeMap[superCategory],
            paymentMode: 'UPI', // Default
            tags: [transaction.category.toLowerCase()]
        };

        setTransactions(prev => [...prev, newTransaction].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        return newTransactionId;
    };

    const removeTransaction = (transactionId: string) => {
        setTransactions(prev => prev.filter(t => t.id !== transactionId));
    };
    
    const addSavingsGoal = (goal: Omit<DetailedSavingsGoal, 'id'>) => {
        setSavingsGoals(prev => [...prev, { ...goal, id: Date.now().toString() }]);
    };
    
    const updateSavingsGoal = (goalId: string, updates: Partial<Omit<DetailedSavingsGoal, 'id'>>) => {
        setSavingsGoals(prev => 
            prev.map(goal => 
                goal.id === goalId ? { ...goal, ...updates } : goal
            )
        );
    };

    const addFundsToGoal = (goalId: string, goalName: string, amount: number, notes?: string) => {
        setSavingsGoals(prevGoals =>
            prevGoals.map(goal => {
                if (goal.id === goalId) {
                    const newSavedAmount = Math.min(goal.saved + amount, goal.target);
                    return { ...goal, saved: newSavedAmount };
                }
                return goal;
            })
        );
        addTransaction({
            merchant: `Fund Goal: ${goalName}`,
            amount,
            category: 'Goal Contribution',
            date: new Date().toISOString(),
            isRecurring: false,
            notes,
            transactionType: 'expense'
        });
    };
    
    const updateInvestmentGoal = (goalId: string, updates: Partial<Omit<InvestmentGoal, 'id'>>) => {
        setInvestmentGoals(prev => 
            prev.map(goal => 
                goal.id === goalId ? { ...goal, ...updates } : goal
            )
        );
    };
    
    const addInvestment = (investment: Omit<Investment, 'id'>) => {
        const newInvestmentWithId = { ...investment, id: Date.now().toString() };
        
        const updatedInvestments = [...investments, newInvestmentWithId];
        setInvestments(updatedInvestments);

        // Also create a corresponding transaction for the cash outflow
        addTransaction({
            merchant: investment.name,
            amount: investment.value,
            category: 'Investment',
            date: new Date().toISOString(),
            isRecurring: false,
            transactionType: 'expense',
        });


        if (investment.goalId) {
            const newCurrentAmountForGoal = updatedInvestments
                .filter(inv => inv.goalId === investment.goalId)
                .reduce((sum, inv) => sum + inv.value, 0);
            
            updateInvestmentGoal(investment.goalId, { currentAmount: newCurrentAmountForGoal });
        }
    };
    
    const addInvestmentGoal = (goal: Omit<InvestmentGoal, 'id' | 'currentAmount' | 'status' | 'createdAt'>) => {
        const newGoal: InvestmentGoal = {
            ...goal,
            id: Date.now().toString(),
            currentAmount: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
        };
        setInvestmentGoals(prev => [...prev, newGoal]);
    };

    const deleteInvestmentGoal = (goalId: string) => {
        setInvestmentGoals(prev => prev.filter(g => g.id !== goalId));
    };

    const addInsurancePolicy = (policy: Omit<InsurancePolicy, 'id'>) => {
        setInsurancePolicies(prev => [...prev, { ...policy, id: Date.now().toString(), autopay: false }]);
    };
    const updateInsurancePolicy = (policyId: string, updates: Partial<InsurancePolicy>) => {
        const policyToUpdate = insurancePolicies.find(p => p.id === policyId);
        if (!policyToUpdate) return;
        
        const finalUpdates = {...updates};

        // If autopay is being enabled
        if (updates.autopay === true && !policyToUpdate.autopay) {
            const transactionId = addTransaction({
                merchant: `${policyToUpdate.provider} Premium`,
                amount: policyToUpdate.premium,
                category: 'Insurance Premium',
                date: policyToUpdate.premiumDueDate,
                isRecurring: true,
                transactionType: 'expense',
            });
            finalUpdates.autopayTransactionId = transactionId;
        } 
        // If autopay is being disabled
        else if (updates.autopay === false && policyToUpdate.autopay && policyToUpdate.autopayTransactionId) {
            removeTransaction(policyToUpdate.autopayTransactionId);
            finalUpdates.autopayTransactionId = undefined;
        }

        setInsurancePolicies(prev => 
            prev.map(p => p.id === policyId ? { ...p, ...finalUpdates } : p)
        );
    };
    const addDebt = (debt: Omit<Debt, 'id'>) => {
        setDebts(prev => [...prev, { ...debt, id: Date.now().toString() }]);
    };

    const value: FinancialContextType = {
        transactions, addTransaction, removeTransaction,
        savingsGoals, addSavingsGoal, updateSavingsGoal, addFundsToGoal,
        investments, addInvestment,
        insurancePolicies, addInsurancePolicy, updateInsurancePolicy,
        debts, addDebt,
        categorySplit, setCategorySplit,
        debtPlan, setDebtPlan,
        investmentGoals, addInvestmentGoal, updateInvestmentGoal, deleteInvestmentGoal,
    };

    return (
        <FinancialContext.Provider value={value}>
            <AppContent />
        </FinancialContext.Provider>
    );
};

export default App;