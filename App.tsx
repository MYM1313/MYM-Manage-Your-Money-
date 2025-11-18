import React, { useState, useMemo, createContext, FC, ReactNode, useEffect, useRef, useContext, useCallback } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase';

import { Tab, Transaction, DetailedSavingsGoal, Investment, InsurancePolicy, Debt, SuperCategory, TransactionType, DebtPlan, FinancialContextType, InvestmentGoal, Notification, AppSettings, User, LinkedAccount, LoginActivity, Asset, Liability, Strategy, RoadmapItem, DebtPaymentDetail, OnboardingData } from './types';
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
import NotificationScreen from './screens/NotificationScreen';
import SettingsScreen from './screens/SettingsScreen';
import PlaceholderScreen from './screens/settings/PlaceholderScreen';
import EditProfileScreen from './screens/settings/EditProfileScreen';
import LinkedAccountsScreen from './screens/settings/LinkedAccountsScreen';
import SecurityScreen from './screens/settings/SecurityScreen';
import SimpleOnboardingScreen, { OnboardingResult } from './screens/SimpleOnboardingScreen';
import LoginScreen from './screens/LoginScreen';


// --- FINANCIAL CONTEXT ---
const initialAppSettings: AppSettings = {
    notifications: {
        pushEnabled: true,
        aiAlerts: true,
        reminders: true,
        insights: true,
        learningUpdates: true,
        reminderFrequency: 'Weekly',
        alertTone: 'Default'
    },
    appearance: {
        theme: 'Dark',
        animationIntensity: 75,
        fontSize: 'Medium',
        accentColor: '#38bdf8' // sky-400
    },
    privacy: {
        appLock: 'None',
        analyticsConsent: true,
        is2FAEnabled: false,
        recoveryEmail: 'a.sharma.recovery@example.com',
    },
    system: {
        language: 'English'
    },
    labs: {
        betaFeatures: false,
        experimentalAITools: false,
    }
};

const defaultUser: User = {
    name: 'Guest',
    email: '',
};

export const FinancialContext = createContext<FinancialContextType>({
    transactions: [] as Transaction[],
    addTransaction: () => '',
    removeTransaction: () => {},
    savingsGoals: [] as DetailedSavingsGoal[],
    addSavingsGoal: () => {},
    updateSavingsGoal: () => {},
    addFundsToGoal: () => {},
    investments: [] as Investment[],
    addInvestment: () => {},
    updateInvestment: () => {},
    deleteInvestment: () => {},
    insurancePolicies: [] as InsurancePolicy[],
    addInsurancePolicy: () => {},
    updateInsurancePolicy: () => {},
    deleteInsurancePolicy: () => {},
    debts: [] as Debt[],
    addDebt: () => {},
    deleteAllData: () => {},
    categorySplit: { essential: 50, investment: 30, wants: 20 },
    setCategorySplit: () => {},
    debtPlan: null,
    setDebtPlan: () => {},
    investmentGoals: [] as InvestmentGoal[],
    addInvestmentGoal: () => {},
    updateInvestmentGoal: () => {},
    deleteInvestmentGoal: () => {},
    notifications: [] as Notification[],
    addNotification: () => {},
    markNotificationAsRead: () => {},
    clearAllNotifications: () => {},
    deleteNotification: () => {},
    toggleNotificationReadStatus: () => {},
    appSettings: initialAppSettings,
    setAppSettings: () => {},
    resetAppSettings: () => {},
    user: defaultUser,
    updateUser: () => {},
    linkedAccounts: [] as LinkedAccount[],
    removeLinkedAccount: () => {},
    loginActivity: [] as LoginActivity[],
    logout: () => {},
    assets: [] as Asset[],
    addAsset: () => {},
    deleteAsset: () => {},
    liabilities: [] as Liability[],
    addLiability: () => {},
    deleteLiability: () => {},
});

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<{ view: string; params?: any }>({ view: 'Home' });
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const mainRef = useRef<HTMLElement>(null);
  const { appSettings } = useContext(FinancialContext);

  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const handleScroll = () => {
        const currentScrollY = mainEl.scrollTop;
        if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
            if (isBottomNavVisible) setIsBottomNavVisible(false);
        } else {
            if (!isBottomNavVisible) setIsBottomNavVisible(true);
        }
        lastScrollY.current = currentScrollY <= 0 ? 0 : currentScrollY;
    };

    mainEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => mainEl.removeEventListener('scroll', handleScroll);
  }, [isBottomNavVisible]);
  
  useEffect(() => {
    const root = document.documentElement;
    
    if (appSettings.appearance.theme === 'Light') {
        root.classList.add('light');
    } else {
        root.classList.remove('light');
    }
    
    if (appSettings.appearance.fontSize === 'Small') {
        root.style.fontSize = '14px';
    } else if (appSettings.appearance.fontSize === 'Large') {
        root.style.fontSize = '18px';
    } else {
        root.style.fontSize = '16px';
    }

  }, [appSettings.appearance.theme, appSettings.appearance.fontSize]);


  const handleNavigation = (view: string, params?: any) => {
    setCurrentView({ view, params });
  };

  const activeTab = useMemo(() => {
    const topLevelTabs: Tab[] = ['Home', 'Expense', 'Save', 'Invest', 'aiChat'];
    if (topLevelTabs.includes(currentView.view as Tab)) {
        return currentView.view as Tab;
    }
    if(currentView.view === 'Profile') return 'Home';
    const profileSubViews = ['debt', 'insurance', 'netWorth', 'tools', 'learning', 'bookExpert', 'transactions', 'aiAnalysis', 'notifications', 'settings', 'editProfile', 'linkedAccounts', 'security', 'language', 'terms', 'support', 'feedback', 'community', 'faq'];
    if (profileSubViews.includes(currentView.view)) {
         return 'Home';
    }
    return 'Home';
  }, [currentView.view]);

  const renderContent = () => {
    const handleBackToHome = () => handleNavigation('Home');
    const handleBackToProfile = () => handleNavigation('Profile');
    const handleBackToSettings = () => handleNavigation('settings');

    switch (currentView.view) {
      case 'Home':
        return <HomeScreen onNavigate={handleNavigation} />;
      case 'Expense':
        return <ExpenseScreen onNavigate={handleNavigation} />;
      case 'Save':
        return <SaveScreen onNavigate={handleNavigation} />;
      case 'Invest':
        return <InvestScreen onNavigate={handleNavigation} />;
      case 'Profile':
        return <ProfileScreen onNavigate={handleNavigation} />;
      case 'notifications':
        return <NotificationScreen onBack={() => handleNavigation(activeTab)} onNavigate={handleNavigation} />;
      case 'settings':
        return <SettingsScreen onBack={handleBackToProfile} onNavigate={handleNavigation} />;
      case 'tools':
        return <ToolsAndCalculatorsScreen onBack={activeTab === 'Home' ? handleBackToHome : handleBackToProfile} initialCategory={currentView.params?.category} />;
      case 'aiAnalysis':
        return <AIAnalysisScreen onBack={activeTab === 'Home' ? handleBackToHome : handleBackToProfile} />;
      case 'bookExpert':
        return <BookExpertScreen onBack={activeTab === 'Home' ? handleBackToHome : handleBackToProfile} />;
      case 'aiChat':
        return <AIChatScreen onBack={handleBackToHome} />;
      case 'debt':
        return <ManageDebtScreen onBack={handleBackToProfile} onNavigate={handleNavigation} />;
      case 'insurance':
        return <InsuranceScreen onBack={handleBackToProfile} onNavigate={handleNavigation} />;
      case 'netWorth':
        return <NetWorthScreen onBack={handleBackToHome} />;
      case 'learning':
        return <LearningCenterScreen onBack={handleBackToProfile} initialCategory={currentView.params?.category} />;
      case 'transactions':
        return <TransactionsScreen onBack={handleBackToProfile} />;
      case 'editProfile':
        return <EditProfileScreen onBack={handleBackToSettings} />;
      case 'linkedAccounts':
          return <LinkedAccountsScreen onBack={handleBackToSettings} />;
      case 'security':
          return <SecurityScreen onBack={handleBackToSettings} />;
      case 'language':
          return <PlaceholderScreen title="Language" onBack={handleBackToSettings} />;
      case 'terms':
          return <PlaceholderScreen title="Terms & Privacy" onBack={handleBackToProfile} />;
      case 'support':
          return <PlaceholderScreen title="Support" onBack={handleBackToProfile} />;
      case 'feedback':
          return <PlaceholderScreen title="Feedback & Suggestions" onBack={handleBackToProfile} />;
      case 'community':
          return <PlaceholderScreen title="Community" onBack={handleBackToProfile} />;
      case 'faq':
          return <PlaceholderScreen title="FAQs" onBack={handleBackToProfile} />;
      default:
        return <HomeScreen onNavigate={handleNavigation} />;
    }
  };
  
  const isProfileScreen = currentView.view === 'Profile';


  return (
    <div className="h-screen w-full bg-[#0D1117] font-sans relative flex flex-col overflow-hidden">
        {!isProfileScreen && <TopNav setActiveTab={handleNavigation} />}
        <main ref={mainRef} className={`flex-1 overflow-y-auto no-scrollbar ${!isProfileScreen ? 'pb-24' : ''}`}>
          {renderContent()}
        </main>
        {!isProfileScreen && <BottomNav activeTab={activeTab} setActiveTab={handleNavigation} isVisible={isBottomNavVisible} />}
    </div>
  );
};


const DUMMY_NOTIFICATIONS: Notification[] = [
    { id: 'n-welcome', category: 'Welcome', icon: '🎉', title: 'Welcome to MYM!', message: 'We\'re excited to help you on your journey to financial freedom. Explore the app to get started.', timestamp: new Date().toISOString(), isRead: false, action: { label: 'Explore Features', view: 'Home' }},
];

const AppContainer: FC<{ userId: string; initialData: OnboardingResult & { financials?: any }, onLogout: () => void }> = ({ userId, initialData, onLogout }) => {
    const { user: onboardedUser, data: onboardingData, financials } = initialData;

    const [transactions, setTransactions] = useState<Transaction[]>(financials?.transactions || []);
    const [savingsGoals, setSavingsGoals] = useState<DetailedSavingsGoal[]>(financials?.savingsGoals || []);
    const [investments, setInvestments] = useState<Investment[]>(financials?.investments || []);
    const [investmentGoals, setInvestmentGoals] = useState<InvestmentGoal[]>(financials?.investmentGoals || []);
    const [insurancePolicies, setInsurancePolicies] = useState<InsurancePolicy[]>(financials?.insurancePolicies || []);
    const [debts, setDebts] = useState<Debt[]>(financials?.debts || []);
    const [assets, setAssets] = useState<Asset[]>(financials?.assets || []);
    const [liabilities, setLiabilities] = useState<Liability[]>(financials?.liabilities || []);
    const [categorySplit, setCategorySplit] = useState(financials?.categorySplit || { essential: 50, investment: 30, wants: 20 });
    const [debtPlan, setDebtPlan] = useState<DebtPlan | null>(financials?.debtPlan || null);
    
    const [notifications, setNotifications] = useState<Notification[]>(financials?.notifications || DUMMY_NOTIFICATIONS);
    const [appSettings, setAppSettings] = useState<AppSettings>(financials?.appSettings || initialAppSettings);
    const [user, setUser] = useState<User>(onboardedUser);
    const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>(financials?.linkedAccounts || []);
    const [loginActivity, setLoginActivity] = useState<LoginActivity[]>(financials?.loginActivity || [{ id: 'la1', device: 'Current Device', location: 'Unknown', timestamp: new Date().toISOString(), isCurrent: true }]);

    const initialized = useRef(!!financials);

    const categoryToSuperCategoryMap: Record<string, SuperCategory> = { 'Groceries': 'Essential', 'Bills': 'Essential', 'EMI': 'Essential', 'Loan Payment': 'Essential', 'Rent': 'Essential', 'Transport': 'Essential', 'Health': 'Essential', 'Utilities': 'Essential', 'Education': 'Essential', 'Household': 'Essential', 'Investment': 'Investment', 'SIP': 'Investment', 'Savings': 'Savings', 'Insurance Premium': 'Essential', 'Goal Contribution': 'Savings', 'Food': 'Entertainment', 'Shopping': 'Entertainment', 'Entertainment': 'Entertainment', 'Travel': 'Entertainment', 'Gifts': 'Entertainment', 'Personal Care': 'Entertainment', 'Subscriptions': 'Entertainment', 'Other': 'Entertainment', 'Salary': 'Income', 'Business': 'Income', 'Freelance': 'Income', 'Investment Returns': 'Income', 'Rental Income': 'Income', };

    const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'type' | 'paymentMode' | 'tags' | 'superCategory'> & { transactionType: 'income' | 'expense'; notes?: string; }): string => {
        let superCategory: SuperCategory;
        if (transaction.transactionType === 'income') {
            superCategory = 'Income';
        } else {
            superCategory = categoryToSuperCategoryMap[transaction.category] || 'Entertainment';
        }

        const typeMap: Record<SuperCategory, TransactionType> = { 'Income': 'income', 'Essential': 'expense', 'Entertainment': 'expense', 'Savings': 'savings', 'Investment': 'investment' };
        
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
            paymentMode: 'UPI',
            tags: [transaction.category.toLowerCase()]
        };

        setTransactions(prev => [...prev, newTransaction].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        return newTransactionId;
    }, []);

    const addDebt = useCallback((debt: Omit<Debt, 'id'>) => {
        setDebts(prev => [...prev, { ...debt, id: Date.now().toString() }]);
    }, []);

    const addInvestment = useCallback((investment: Omit<Investment, 'id'>) => {
        const newInv: Investment = { ...investment, id: Date.now().toString(), change: 0, changeType: 'increase' };
        setInvestments(prev => [...prev, newInv]);
        if (investment.goalId) {
             setInvestmentGoals(prevGoals => prevGoals.map(g => g.id === investment.goalId ? { ...g, currentAmount: g.currentAmount + investment.value } : g));
        }
    }, []);
    
    const addInsurancePolicy = useCallback((policy: Omit<InsurancePolicy, 'id'>) => {
        setInsurancePolicies(prev => [...prev, { ...policy, id: Date.now().toString() }]);
    }, []);

    useEffect(() => {
        if (initialized.current || !onboardingData) return;

        if (onboardingData.monthlyIncome > 0) {
            addTransaction({
                merchant: 'Initial Monthly Income',
                amount: onboardingData.monthlyIncome,
                category: 'Salary',
                date: new Date().toISOString(),
                isRecurring: true,
                transactionType: 'income'
            });
        }
        
        if (onboardingData.hasDebts === 'Yes' && onboardingData.debts) {
            onboardingData.debts.forEach(d => {
                if(d.outstandingAmount > 0) {
                    addDebt({ name: d.type, amount: d.outstandingAmount, apr: d.interestRate, minPayment: d.affordablePayment, paymentDate: 1 });
                }
            });
        }
        
        if (onboardingData.invests === 'Yes' && onboardingData.investmentLocation) {
             addInvestment({
                name: `${onboardingData.investmentLocation} Holding`,
                value: onboardingData.totalInvestmentAmount || 0,
                category: onboardingData.investmentLocation,
            });
        }

        if(onboardingData.hasInsurance === 'Yes' && onboardingData.insurancePolicies) {
            onboardingData.insurancePolicies.forEach(p => {
                if (p.coverage > 0) {
                    addInsurancePolicy({
                        type: p.type,
                        provider: p.type,
                        coverage: p.coverage,
                        premium: 0,
                        premiumFrequency: 'Annually',
                        premiumDueDate: new Date().toISOString(),
                        expiryDate: new Date().toISOString(),
                    });
                }
            });
        }

        initialized.current = true;
    }, [onboardingData, addTransaction, addDebt, addInvestment, addInsurancePolicy]);

    useEffect(() => {
        if (!userId) return;
        const storageKey = `mym_app_data_${userId}`;
        const appData = {
            user: onboardedUser,
            data: onboardingData,
            financials: {
                transactions, savingsGoals, investments, investmentGoals, insurancePolicies,
                debts, assets, liabilities, categorySplit, debtPlan, notifications,
                appSettings, linkedAccounts, loginActivity
            }
        };
        localStorage.setItem(storageKey, JSON.stringify(appData));
    }, [
        userId, transactions, savingsGoals, investments, investmentGoals, insurancePolicies,
        debts, assets, liabilities, categorySplit, debtPlan, notifications, appSettings,
        linkedAccounts, loginActivity, onboardedUser, onboardingData
    ]);

    const removeTransaction = (transactionId: string) => { setTransactions(prev => prev.filter(t => t.id !== transactionId)); };
    const addSavingsGoal = (goal: Omit<DetailedSavingsGoal, 'id'>) => { setSavingsGoals(prev => [...prev, { ...goal, id: Date.now().toString() }]); };
    const updateSavingsGoal = (goalId: string, updates: Partial<Omit<DetailedSavingsGoal, 'id'>>) => { setSavingsGoals(prev => prev.map(goal => goal.id === goalId ? { ...goal, ...updates } : goal)); };
    const addFundsToGoal = (goalId: string, goalName: string, amount: number, notes?: string) => {
        setSavingsGoals(prevGoals => prevGoals.map(goal => {
            if (goal.id === goalId) {
                const newSavedAmount = Math.min(goal.saved + amount, goal.target);
                return { ...goal, saved: newSavedAmount };
            }
            return goal;
        }));
        addTransaction({ merchant: `Fund: ${goalName}`, amount, category: 'Savings', date: new Date().toISOString(), isRecurring: false, notes, transactionType: 'expense' });
    };

    const updateInvestment = (investmentId: string, updates: Partial<Omit<Investment, 'id'>>) => {
        setInvestments(prev => prev.map(inv => inv.id === investmentId ? { ...inv, ...updates } : inv));
    };

    const deleteInvestment = (investmentId: string) => { setInvestments(prev => prev.filter(inv => inv.id !== investmentId)); };
    
    const updateInsurancePolicy = (policyId: string, updates: Partial<InsurancePolicy>) => { setInsurancePolicies(prev => prev.map(p => p.id === policyId ? { ...p, ...updates } : p)); };
    const deleteInsurancePolicy = (policyId: string) => { setInsurancePolicies(prev => prev.filter(p => p.id !== policyId)); };
    
    const deleteAllData = () => {
        setTransactions([]); setSavingsGoals([]); setInvestments([]); setInvestmentGoals([]); setInsurancePolicies([]); setDebts([]); setDebtPlan(null); setAssets([]); setLiabilities([]);
    };
        
    const addInvestmentGoal = (goal: Omit<InvestmentGoal, 'id' | 'currentAmount' | 'status' | 'createdAt'>) => {
        const newGoal: InvestmentGoal = { ...goal, id: Date.now().toString(), currentAmount: 0, status: 'active', createdAt: new Date().toISOString() };
        setInvestmentGoals(prev => [...prev, newGoal]);
    };

    const updateInvestmentGoal = (goalId: string, updates: Partial<Omit<InvestmentGoal, 'id'>>) => {
        setInvestmentGoals(prev => prev.map(g => g.id === goalId ? { ...g, ...updates } : g));
    };

    const deleteInvestmentGoal = (goalId: string) => { setInvestmentGoals(prev => prev.filter(g => g.id !== goalId)); };

    const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
        const newNotif = { ...notification, id: Date.now().toString(), timestamp: new Date().toISOString(), isRead: false };
        setNotifications(prev => [newNotif, ...prev]);
    };
    const markNotificationAsRead = (id: string | 'all') => { setNotifications(prev => prev.map(n => (id === 'all' || n.id === id) ? { ...n, isRead: true } : n)); };
    const clearAllNotifications = () => { setNotifications([]); };
    const deleteNotification = (id: string) => { setNotifications(prev => prev.filter(n => n.id !== id)); };
    const toggleNotificationReadStatus = (id: string) => { setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n)); };
    
    const resetAppSettings = () => { setAppSettings(initialAppSettings); };
    const updateUser = (updates: Partial<User>) => { setUser(prev => ({ ...prev, ...updates })); };
    const removeLinkedAccount = (id: string) => { setLinkedAccounts(prev => prev.filter(acc => acc.id !== id)); };

    const addAsset = (asset: Omit<Asset, 'id'>) => { setAssets(prev => [...prev, { ...asset, id: Date.now().toString() }]); };
    const deleteAsset = (assetId: string) => { setAssets(prev => prev.filter(a => a.id !== assetId)); };
    const addLiability = (liability: Omit<Liability, 'id'>) => { setLiabilities(prev => [...prev, { ...liability, id: Date.now().toString() }]); };
    const deleteLiability = (liabilityId: string) => { setLiabilities(prev => prev.filter(l => l.id !== liabilityId)); };


    const value: FinancialContextType = {
        transactions, addTransaction, removeTransaction,
        savingsGoals, addSavingsGoal, updateSavingsGoal, addFundsToGoal,
        investments, addInvestment, updateInvestment, deleteInvestment,
        insurancePolicies, addInsurancePolicy, updateInsurancePolicy, deleteInsurancePolicy,
        debts, addDebt,
        deleteAllData,
        categorySplit, setCategorySplit,
        debtPlan, setDebtPlan,
        investmentGoals, addInvestmentGoal, updateInvestmentGoal, deleteInvestmentGoal,
        notifications, addNotification, markNotificationAsRead, clearAllNotifications, deleteNotification, toggleNotificationReadStatus,
        appSettings, setAppSettings, resetAppSettings,
        user, updateUser,
        linkedAccounts, removeLinkedAccount,
        loginActivity, logout: onLogout,
        assets, addAsset, deleteAsset,
        liabilities, addLiability, deleteLiability,
    };

    return (
        <FinancialContext.Provider value={value}>
            <AppContent />
        </FinancialContext.Provider>
    );
};


const AuthenticatedApp: FC<{ user: FirebaseUser }> = ({ user }) => {
    type AppState = 'LOADING' | 'ONBOARDING' | 'APP';
    const [appState, setAppState] = useState<AppState>('LOADING');
    const [appData, setAppData] = useState<OnboardingResult | null>(null);

    useEffect(() => {
        if (!user) return;

        const storageKey = `mym_app_data_${user.uid}`;
        const savedData = localStorage.getItem(storageKey);
        
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                if (parsedData.user && parsedData.data) {
                    setAppData(parsedData);
                    setAppState('APP');
                } else {
                    setAppState('ONBOARDING');
                }
            } catch (error) {
                console.error("Failed to parse saved data:", error);
                setAppState('ONBOARDING');
            }
        } else {
            setAppState('ONBOARDING');
        }
    }, [user]);

    const handleOnboardingComplete = (result: OnboardingResult) => {
        if (!user) return;
        const storageKey = `mym_app_data_${user.uid}`;
        
        const fullResult = { 
            ...result, 
            user: { 
                ...result.user, 
                name: user.displayName || result.user.name,
                email: user.email || result.user.email,
                profilePictureUrl: user.photoURL || `https://avatar.vercel.sh/${user.displayName || 'user'}.png`
            } 
        };
        setAppData(fullResult);
        localStorage.setItem(storageKey, JSON.stringify(fullResult));
        setAppState('APP');
    };

    const handleLogout = () => {
        if (user) {
            const storageKey = `mym_app_data_${user.uid}`;
            localStorage.removeItem(storageKey);
        }
        signOut(auth);
    };

    if (appState === 'LOADING' || !user) {
        return <div className="h-screen w-full bg-[#0D1117] flex items-center justify-center text-white">Loading User Data...</div>;
    }

    if (appState === 'ONBOARDING') {
        const initialUser: User = {
            name: user.displayName || '',
            email: user.email || '',
            profilePictureUrl: user.photoURL,
        };
        return <SimpleOnboardingScreen onComplete={handleOnboardingComplete} initialUser={initialUser} />;
    }

    if (appState === 'APP' && appData) {
        return <AppContainer key={user.uid} userId={user.uid} initialData={appData} onLogout={handleLogout} />;
    }
    
    return <div className="h-screen w-full bg-[#0D1117] flex items-center justify-center text-white">An unexpected error occurred. Please refresh.</div>;
};

const App: FC = () => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className="h-screen w-full bg-[#0D1117] flex items-center justify-center text-white">Initializing...</div>;
    }

    return (
        <>
            {user ? <AuthenticatedApp user={user} /> : <LoginScreen />}
        </>
    );
};

export default App;