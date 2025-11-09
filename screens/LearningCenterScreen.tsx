
import React, { useState, useMemo, FC, useEffect } from 'react';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { PlayIcon } from '../components/icons/PlayIcon';
import { CheckIcon } from '../components/icons/CheckIcon';
import { ToolsIcon } from '../components/icons/ToolsIcon';
import { BronzeMedalIcon } from '../components/icons/BronzeMedalIcon';
import { SilverMedalIcon } from '../components/icons/SilverMedalIcon';
import { GoldMedalIcon } from '../components/icons/GoldMedalIcon';
import { ChartBarSquareIcon } from '../components/icons/ChartBarSquareIcon';
import { TrophyIcon } from '../components/icons/TrophyIcon';
import { LockIcon } from '../components/icons/LockIcon';

// --- DATA STRUCTURE (Original) ---

const LEARNING_CONTENT = {
    Expenses: {
        totalTopics: 15,
        levels: {
            Beginner: [
                { title: 'What Are Expenses?', description: 'Understand the fundamental concept of expenses and how they impact your financial life.', tools: ['Expense Tracker'], nextStep: 'Track your next 5 expenses.' },
                { title: 'Essential vs Non-Essential', description: 'Learn to differentiate between needs and wants to prioritize your spending effectively.', tools: ['Budget Planner'], nextStep: 'Categorize last week\'s spending.' },
                { title: 'The 50/30/20 Rule', description: 'A simple, popular budgeting framework to allocate your income towards needs, wants, and savings.', tools: ['Budget Planner'], nextStep: 'Apply the 50/30/20 rule to your income.' },
                { title: 'How Overspending Destroys Wealth', description: 'Visualize the long-term negative impact of small, consistent overspending habits.', tools: ['Spending Insights'], nextStep: 'Identify one area of overspending.' },
                { title: 'Basic Budgeting Methods', description: 'Explore simple techniques like the envelope system or digital trackers to get started.', tools: ['Expense Tracker'], nextStep: 'Choose a budgeting method.' },
            ],
            Intermediate: [
                { title: 'Automating Your Expenses', description: 'Set up automatic payments for bills to avoid late fees and simplify your financial management.', tools: [], nextStep: 'Automate one recurring bill.' },
                { title: 'Tracking Daily & Monthly Spending', description: 'Develop a habit of consistently tracking where your money goes for better control.', tools: ['Expense Tracker'], nextStep: 'Track all spending for 7 days.' },
                { title: 'Analyzing Spending Patterns', description: 'Use data to identify trends, outliers, and opportunities for optimization in your spending.', tools: ['Spending Insights'], nextStep: 'Review your monthly spending report.' },
                { title: 'Reducing Wasteful Spending', description: 'Actionable strategies to cut down on non-essential costs without sacrificing quality of life.', tools: ['Lifestyle Optimizer'], nextStep: 'Cancel one unused subscription.' },
                { title: 'Setting Monthly Expense Targets', description: 'Create realistic and achievable spending goals for different categories to stay on track.', tools: ['Budget Planner'], nextStep: 'Set a target for your \'Food\' category.' },
            ],
            Advanced: [
                { title: 'Advanced Budgeting Frameworks', description: 'Explore complex methods like Zero-Based Budgeting for granular control over every rupee.', tools: ['Budget Planner'], nextStep: 'Create a zero-based budget.' },
                { title: 'Optimizing Lifestyle Costs', description: 'Strategies for major expenses like housing, transportation, and utilities to unlock significant savings.', tools: ['Lifestyle Optimizer'], nextStep: 'Compare your electricity providers.' },
                { title: 'Psychology of Spending', description: 'Understand the behavioral biases that lead to poor spending decisions and how to counteract them.', tools: [], nextStep: 'Read about cognitive biases.' },
                { title: 'Creating a Sustainable Spending System', description: 'Build a long-term, flexible spending plan that adapts to your life changes and goals.', tools: [], nextStep: 'Review your budget quarterly.' },
                { title: 'Building an Expense Forecast Plan', description: 'Project future expenses to prepare for large, predictable costs and avoid financial surprises.', tools: [], nextStep: 'Forecast your next year\'s expenses.' },
            ],
        }
    },
    Saving: {
        totalTopics: 15,
        levels: {
            Beginner: [
                { title: 'Why Saving Matters', description: 'Understand the core importance of saving for financial security and achieving life goals.', tools: ['Goal-Based Savings Tool'], nextStep: 'Define one financial goal.' },
                { title: 'Pay Yourself First Rule', description: 'The simple but powerful habit of saving a portion of your income before you spend on anything else.', tools: ['Auto-Save Planner'], nextStep: 'Set up a recurring transfer.' },
                { title: 'Emergency Fund Basics', description: 'Learn what an emergency fund is, why you need one, and how much you should save.', tools: ['Emergency Fund Calculator'], nextStep: 'Calculate your ideal emergency fund.' },
                { title: 'Setting Saving Goals', description: 'How to set specific, measurable, achievable, relevant, and time-bound (SMART) savings goals.', tools: ['Goal-Based Savings Tool'], nextStep: 'Create your first savings goal.' },
                { title: 'Short vs Long Term Saving', description: 'Understand the difference in strategies and financial products for short-term and long-term goals.', tools: [], nextStep: 'Categorize your goals.' },
            ],
            Intermediate: [
                { title: 'Saving Automation Strategies', description: 'Leverage technology to make saving effortless and consistent through automated transfers.', tools: ['Auto-Save Planner'], nextStep: 'Automate 10% of your income to savings.' },
                { title: 'High-Yield Savings Accounts', description: 'Discover how to make your saved money work for you by earning higher interest rates.', tools: [], nextStep: 'Research high-yield accounts.' },
                { title: 'Saving Challenges', description: 'Gamify your saving habits with popular challenges like the 52-week or no-spend challenges.', tools: [], nextStep: 'Start a 1-month saving challenge.' },
                { title: 'Inflation & Real Value of Savings', description: 'Learn how inflation erodes the purchasing power of your savings over time.', tools: [], nextStep: 'Calculate inflation\'s effect on your savings.' },
                { title: 'Linking Saving to Future Goals', description: 'Connect every rupee you save to a tangible future goal to boost motivation and discipline.', tools: ['Goal-Based Savings Tool'], nextStep: 'Link your savings to a goal.' },
            ],
            Advanced: [
                { title: 'Saving for Financial Freedom', description: 'Understand the concept of FIRE (Financial Independence, Retire Early) and how to calculate your number.', tools: [], nextStep: 'Calculate your FIRE number.' },
                { title: 'Layered Savings Strategy', description: 'Build a multi-tiered savings plan that includes emergency funds, sinking funds, and investment capital.', tools: [], nextStep: 'Design your layered strategy.' },
                { title: 'Behavioral Saving Hacks', description: 'Use psychological tricks and tips to "fool" your brain into saving more money effortlessly.', tools: [], nextStep: 'Implement one behavioral hack.' },
                { title: 'Emergency Fund Rebalancing', description: 'Know when and how to adjust your emergency fund based on changes in your income or expenses.', tools: ['Emergency Fund Calculator'], nextStep: 'Review your emergency fund.' },
                { title: 'Transition from Saving to Investing', description: 'Learn the crucial step of moving from simply accumulating cash to making your money grow.', tools: [], nextStep: 'Decide your investment transition point.' },
            ],
        }
    },
    Investing: {
        totalTopics: 15,
        levels: {
            Beginner: [
                { title: 'What Is Investing?', description: 'A foundational look at what it means to invest and how it differs from saving.', tools: [], nextStep: 'Open a demat account.' },
                { title: 'Power of Compounding', description: 'Often called the eighth wonder of the world, see how compounding can exponentially grow your wealth.', tools: ['Compound Interest Calculator'], nextStep: 'Calculate compounding on ₹1000.' },
                { title: 'Risk vs Return Basics', description: 'Understand the fundamental trade-off between risk and potential return in any investment.', tools: [], nextStep: 'Assess your risk tolerance.' },
                { title: 'Types of Investment Assets', description: 'An overview of the main asset classes: stocks, bonds, mutual funds, real estate, and gold.', tools: [], nextStep: 'Research one asset class.' },
                { title: 'SIP & Mutual Fund Basics', description: 'Learn about Systematic Investment Plans (SIPs) as a simple and effective way to start investing.', tools: ['SIP Calculator'], nextStep: 'Simulate a SIP.' },
            ],
            Intermediate: [
                { title: 'Asset Allocation Strategies', description: 'Learn how to distribute your investments across different asset classes to balance risk and return.', tools: ['Asset Allocation Tool'], nextStep: 'Create a sample allocation.' },
                { title: 'Diversification & Portfolio Risk', description: 'Understand why you shouldn\'t put all your eggs in one basket and how to diversify effectively.', tools: [], nextStep: 'Analyze your portfolio\'s diversity.' },
                { title: 'How to Analyze Investments', description: 'An introduction to fundamental and technical analysis for making informed investment decisions.', tools: [], nextStep: 'Analyze one stock.' },
                { title: 'Long-Term vs Short-Term Investing', description: 'Explore the different strategies and mindsets required for long-term wealth building versus short-term gains.', tools: ['Goal Planner'], nextStep: 'Define a long-term goal.' },
                { title: 'ETF, Index Funds & Passive Strategies', description: 'Discover low-cost, passive investment options that track market indices.', tools: [], nextStep: 'Compare Nifty 50 ETFs.' },
            ],
            Advanced: [
                { title: 'Building a Goal-Based Portfolio', description: 'Construct a tailored investment portfolio designed to achieve specific life goals like retirement or a house down payment.', tools: ['Goal Planner'], nextStep: 'Build a portfolio for one goal.' },
                { title: 'Managing Volatility & Market Cycles', description: 'Learn how to stay calm and make rational decisions during market downturns and bubbles.', tools: [], nextStep: 'Read about market history.' },
                { title: 'Tax-Efficient Investing', description: 'Strategies to minimize the impact of taxes on your investment returns through tax-saving instruments.', tools: [], nextStep: 'Explore tax-saving investments.' },
                { title: 'Rebalancing & Portfolio Review', description: 'The discipline of periodically reviewing and adjusting your portfolio to maintain your desired asset allocation.', tools: ['Asset Allocation Tool'], nextStep: 'Schedule an annual review.' },
                { title: 'Retirement & Financial Independence', description: 'Advanced planning for building a corpus that can sustain your lifestyle without active income.', tools: [], nextStep: 'Calculate your retirement corpus.' },
            ],
        }
    },
    Debt: {
        totalTopics: 15,
        levels: {
            Beginner: [
                { title: 'What Is Debt?', description: 'A simple explanation of debt, liabilities, and the role they play in your financial life.', tools: [], nextStep: 'List all your current debts.' },
                { title: 'Good Debt vs Bad Debt', description: 'Learn to distinguish between debt that can build assets (like a home loan) and high-interest consumer debt.', tools: [], nextStep: 'Categorize your debts.' },
                { title: 'Interest Rates Explained', description: 'Understand how interest works, the difference between APR and flat rates, and its impact on your payments.', tools: [], nextStep: 'Find the interest rate for one debt.' },
                { title: 'Credit Score Basics', description: 'What a credit score is, why it\'s crucial for your financial health, and how it is calculated.', tools: ['Credit Score Estimator'], nextStep: 'Check your credit score.' },
                { title: 'Debt-to-Income Ratio', description: 'Learn how to calculate your DTI ratio, a key metric lenders use to assess your financial stability.', tools: ['DTI Calculator'], nextStep: 'Calculate your DTI ratio.' },
            ],
            Intermediate: [
                { title: 'Repayment Strategies', description: 'Compare the Snowball (paying smallest first) and Avalanche (highest interest first) methods of debt repayment.', tools: ['Repayment Planner'], nextStep: 'Choose a repayment strategy.' },
                { title: 'Debt Consolidation Explained', description: 'Understand the pros and cons of combining multiple debts into a single loan, potentially at a lower interest rate.', tools: [], nextStep: 'Research consolidation options.' },
                { title: 'Impact of Late Payments', description: 'See the severe damage that late or missed payments can do to your credit score and financial future.', tools: [], nextStep: 'Review your payment history.' },
                { title: 'How to Negotiate with Lenders', description: 'Strategies and scripts for communicating with creditors to potentially lower interest rates or arrange a payment plan.', tools: [], nextStep: 'Draft a negotiation script.' },
                { title: 'Credit Utilization Best Practices', description: 'Learn the importance of keeping your credit card balances low relative to your limits to boost your credit score.', tools: [], nextStep: 'Check your credit utilization.' },
            ],
            Advanced: [
                { title: 'Advanced Credit Score Optimization', description: 'Deep dive into the factors that influence your credit score and actionable steps to maximize it.', tools: ['Credit Score Estimator'], nextStep: 'Identify one factor to improve.' },
                { title: 'Using Debt Strategically', description: 'Explore how leverage (using borrowed capital) can be used to acquire appreciating assets, like real estate.', tools: [], nextStep: 'Learn about leverage.' },
                { title: 'Building a Debt-Free Roadmap', description: 'Create a detailed, month-by-month plan to become completely debt-free, including milestones and targets.', tools: ['Repayment Planner'], nextStep: 'Create a 12-month payoff plan.' },
                { title: 'Emergency Fund + Debt Strategy', description: 'Understand the critical balance between saving for emergencies and aggressively paying down debt.', tools: [], nextStep: 'Allocate funds to both.' },
                { title: 'Preventing Future Debt Traps', description: 'Develop the mindset and habits required to avoid falling back into high-interest consumer debt.', tools: [], nextStep: 'Set a rule for future borrowing.' },
            ],
        }
    },
    Insurance: {
        totalTopics: 15,
        levels: {
            Beginner: [
                { title: 'Why Insurance Matters', description: 'Understand insurance as a tool to protect yourself and your loved ones from financial ruin due to unforeseen events.', tools: [], nextStep: 'Assess one risk in your life.' },
                { title: 'Types of Insurance Explained', description: 'An overview of the most common types of insurance: life, health, vehicle, and property.', tools: [], nextStep: 'Identify which insurance you have.' },
                { title: 'Life Insurance Basics', description: 'Learn the fundamental purpose of life insurance and who needs it most.', tools: ['Coverage Calculator'], nextStep: 'Determine if you need life insurance.' },
                { title: 'Health Insurance Basics', description: 'Understand the critical importance of health insurance in an era of rising medical costs.', tools: ['Health Cover Tool'], nextStep: 'Review your current health cover.' },
                { title: 'Understanding Premiums', description: 'A simple breakdown of what a premium is and the factors that determine how much you pay.', tools: ['Term Plan Estimator'], nextStep: 'Get a sample premium quote.' },
            ],
            Intermediate: [
                { title: 'Term Insurance vs Whole Life', description: 'A clear comparison between pure protection (Term) plans and investment-linked (Whole Life) policies.', tools: [], nextStep: 'Compare quotes for both types.' },
                { title: 'Riders & Add-Ons Explained', description: 'Learn about optional extras you can add to your policy, such as critical illness or accidental death benefits.', tools: [], nextStep: 'Research one useful rider.' },
                { title: 'Claim Settlement Process', description: 'Understand the steps involved in making a claim and the importance of the Claim Settlement Ratio.', tools: ['Claim Checklist'], nextStep: 'Check the CSR of one insurer.' },
                { title: 'Asset Insurance (Property, Vehicle)', description: 'Learn about protecting your valuable physical assets from damage or loss.', tools: [], nextStep: 'Review your vehicle insurance.' },
                { title: 'How to Calculate Coverage Needs', description: 'A step-by-step guide to determining the right amount of life and health insurance coverage for your situation.', tools: ['Coverage Calculator'], nextStep: 'Calculate your life cover needs.' },
            ],
            Advanced: [
                { title: 'Tax Benefits of Insurance', description: 'Explore how you can save on taxes by paying insurance premiums under sections like 80C and 80D.', tools: [], nextStep: 'Check your tax savings.' },
                { title: 'Planning Family Protection', description: 'A holistic approach to ensuring your family is fully protected against all major financial risks.', tools: [], nextStep: 'Create a family protection plan.' },
                { title: 'Combining Insurance with Investments', description: 'Understand the debate around keeping insurance and investments separate versus using bundled products.', tools: [], nextStep: 'Read about ULIPs vs Mutual Funds.' },
                { title: 'Reviewing & Updating Policies', description: 'The importance of periodically reviewing your insurance coverage as your life changes (e.g., marriage, children).', tools: [], nextStep: 'Schedule an annual insurance review.' },
                { title: 'Mistakes to Avoid When Buying', description: 'Common pitfalls like under-insuring, choosing the wrong policy, or not disclosing information, and how to avoid them.', tools: [], nextStep: 'Make a personal checklist.' },
            ],
        }
    }
};

// --- TYPE DEFINITIONS ---
interface Topic {
    id: string;
    title: string;
    description: string;
    tools: string[];
    nextStep: string;
    level: string;
    category: string;
    index: number; // Overall index in the flattened list
}
type LearningCategoryName = keyof typeof LEARNING_CONTENT;
type TopicStatus = 'completed' | 'current' | 'locked';

interface LearningCenterScreenProps {
    onBack: () => void;
    initialCategory?: string;
}

// --- HELPER FUNCTIONS ---
const getFlattenedTopics = (category: LearningCategoryName): Topic[] => {
    const categoryData = LEARNING_CONTENT[category];
    let topics: Topic[] = [];
    let overallIndex = 0;
    Object.entries(categoryData.levels).forEach(([levelName, levelTopics]) => {
        levelTopics.forEach(topic => {
            topics.push({
                ...topic,
                id: `${category}-${levelName}-${topic.title}`,
                level: levelName,
                category: category,
                index: overallIndex++
            });
        });
    });
    return topics;
};

// --- SUB-COMPONENTS ---

const GlassmorphicPanel: FC<{ children: React.ReactNode; className?: string; onClick?: () => void; }> = ({ children, className = '', onClick }) => (
    <div
        onClick={onClick}
        className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl shadow-black/30 ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
        {children}
    </div>
);


const VideoPlaceholder: FC = () => (
    <div className="relative aspect-video bg-gradient-to-br from-sky-900/50 to-indigo-900/50 rounded-2xl flex items-center justify-center overflow-hidden group cursor-pointer">
        <PlayIcon className="h-16 w-16 text-white/70 group-hover:text-white group-hover:scale-110 transition-transform duration-300 z-10" />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
    </div>
);

const InfographicPlaceholder: FC = () => (
    <div className="aspect-video bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-700 p-4 flex flex-col items-center justify-center space-y-2 text-gray-500">
        <ChartBarSquareIcon className="h-10 w-10" />
        <p className="font-semibold">Visual Illustration</p>
        <p className="text-xs text-center">A helpful chart or graphic to explain the concept visually.</p>
    </div>
);

const TopicDetailView: FC<{ topic: Topic; onBack: () => void; onCompleteAndNext: () => void; isLastTopic: boolean; }> = ({ topic, onBack, onCompleteAndNext, isLastTopic }) => {
    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-[#10141b] to-[#0D1117] text-gray-200 animate-fade-in">
            <header className="sticky top-0 z-20 p-4 flex items-center bg-[#10141b]/80 backdrop-blur-sm">
                <button onClick={onBack} className="p-2 text-gray-300 rounded-full hover:bg-white/10">
                    <ChevronLeftIcon />
                </button>
                <div className="text-center flex-1">
                    <p className="text-sm font-semibold text-sky-400">{topic.level}</p>
                    <h1 className="text-xl font-bold text-gray-100">{topic.title}</h1>
                </div>
                <div className="w-10"></div>
            </header>
            <main className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                <VideoPlaceholder />
                <GlassmorphicPanel className="!p-4 md:!p-6">
                    <h2 className="text-lg font-bold text-gray-100 mb-2">Key Takeaways</h2>
                    <p className="text-gray-300">{topic.description}</p>
                </GlassmorphicPanel>
                <InfographicPlaceholder />
                {topic.tools.length > 0 && (
                     <GlassmorphicPanel className="!p-4 md:!p-6">
                        <h2 className="text-lg font-bold text-gray-100 mb-3">Recommended Tools</h2>
                        <div className="flex flex-wrap gap-3">
                            {topic.tools.map((tool: string) => (
                                <div key={tool} className="flex items-center space-x-2 text-sky-300 bg-sky-900/50 px-3 py-2 rounded-lg">
                                    <ToolsIcon />
                                    <span className="font-semibold text-sm">{tool}</span>
                                </div>
                            ))}
                        </div>
                    </GlassmorphicPanel>
                )}
            </main>
            <footer className="p-4 bg-gradient-to-t from-[#0D1117] to-transparent">
                <button onClick={onCompleteAndNext} className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/10 hover:scale-[1.02] active:scale-100 transition-transform transform text-lg">
                    {isLastTopic ? 'Finish & Back to Roadmap' : 'Next Topic'}
                </button>
            </footer>
        </div>
    );
};

const TopicNode: FC<{ topic: Topic; status: TopicStatus; isFirstInLevel: boolean; isLastInLevel: boolean; onClick: () => void; }> = ({ topic, status, isFirstInLevel, isLastInLevel, onClick }) => {
    const isLocked = status === 'locked';
    const isCurrent = status === 'current';
    const isCompleted = status === 'completed';

    const styles = useMemo(() => {
        if (isCompleted) return {
            line: 'bg-green-400',
            nodeBorder: 'border-green-400',
            nodeBg: 'bg-green-900',
            glow: '',
        };
        if (isCurrent) return {
            line: 'bg-sky-400',
            nodeBorder: 'border-sky-400',
            nodeBg: 'bg-sky-900',
            glow: 'shadow-[0_0_12px_rgba(56,189,248,0.7)] animate-pulse',
        };
        return { // Locked
            line: 'bg-gray-700',
            nodeBorder: 'border-gray-600',
            nodeBg: 'bg-gray-800',
            glow: '',
        };
    }, [status]);

    const StatusIndicator: FC = () => {
        if (isCompleted) {
            return (
                <div className="flex items-center space-x-2 text-green-400">
                    <CheckIcon className="w-6 h-6" />
                    <span className="font-semibold text-sm">Completed</span>
                </div>
            );
        }
        if (isLocked) {
            return <LockIcon className="w-7 h-7 text-amber-500/60" />;
        }
        return (
            <button
                onClick={onClick}
                className="px-6 py-2 rounded-lg font-semibold bg-sky-500 text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/20"
            >
                Start
            </button>
        );
    };

    return (
        <div className="flex items-stretch">
            {/* The Card Column */}
            <div className="flex-1 py-3 pr-4">
                <GlassmorphicPanel
                    onClick={!isLocked ? onClick : undefined}
                    className={`!p-5 flex items-center justify-between transition-all duration-300 ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:border-sky-400/50 hover:-translate-y-1'}`}
                >
                    <div className="flex-1 pr-4">
                        <h3 className="font-bold text-gray-100">{topic.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{topic.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                        <StatusIndicator />
                    </div>
                </GlassmorphicPanel>
            </div>

            {/* The Path Column */}
            <div className="w-12 flex-shrink-0 flex flex-col items-center">
                <div className={`w-0.5 flex-1 ${isFirstInLevel ? 'bg-transparent' : styles.line}`}></div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 transition-all duration-300 ${styles.nodeBorder} ${styles.nodeBg} ${styles.glow}`}>
                    {isCurrent && <div className="w-2 h-2 bg-sky-300 rounded-full"></div>}
                </div>
                <div className={`w-0.5 flex-1 ${isLastInLevel ? 'bg-transparent' : styles.line}`}></div>
            </div>
        </div>
    );
};


// --- MAIN SCREEN COMPONENT ---

const LearningCenterScreen: FC<LearningCenterScreenProps> = ({ onBack, initialCategory }) => {
    const tabs: LearningCategoryName[] = ['Expenses', 'Saving', 'Investing', 'Debt', 'Insurance'];
    
    const [activeTab, setActiveTab] = useState<LearningCategoryName>(
        (initialCategory && tabs.includes(initialCategory as any))
            ? initialCategory as LearningCategoryName
            : 'Expenses'
    );
    const [completedTopics, setCompletedTopics] = useState(new Set<string>([
        'Expenses-Beginner-What Are Expenses?', 
    ]));
    const [activeTopic, setActiveTopic] = useState<Topic | null>(null);

    const flattenedTopics = useMemo(() => getFlattenedTopics(activeTab), [activeTab]);
    
    const completedCount = useMemo(() => {
        let count = 0;
        for (const topic of flattenedTopics) {
            if (completedTopics.has(topic.id)) {
                count++;
            } else {
                break; 
            }
        }
        return count;
    }, [completedTopics, flattenedTopics]);
    
    const totalTopicsForCategory = LEARNING_CONTENT[activeTab].totalTopics;
    const progressPercentage = (completedCount / totalTopicsForCategory) * 100;

    const handleTopicSelect = (topic: Topic) => {
        const status: TopicStatus = topic.index < completedCount ? 'completed' : topic.index === completedCount ? 'current' : 'locked';
        if (status !== 'locked') {
            setActiveTopic(topic);
        }
    };

    const handleCompleteAndNext = () => {
        if (!activeTopic) return;
        
        const newCompleted = new Set(completedTopics).add(activeTopic.id);
        setCompletedTopics(newCompleted);

        const nextTopicIndex = activeTopic.index + 1;
        if (nextTopicIndex < flattenedTopics.length) {
            setActiveTopic(flattenedTopics[nextTopicIndex]);
        } else {
            setActiveTopic(null);
        }
    };
    
    const levels = {
        Beginner: { icon: <BronzeMedalIcon />, topics: flattenedTopics.filter(t => t.level === 'Beginner') },
        Intermediate: { icon: <SilverMedalIcon />, topics: flattenedTopics.filter(t => t.level === 'Intermediate') },
        Advanced: { icon: <GoldMedalIcon />, topics: flattenedTopics.filter(t => t.level === 'Advanced') },
    };

    if (activeTopic) {
        return (
            <TopicDetailView
                topic={activeTopic}
                onBack={() => setActiveTopic(null)}
                onCompleteAndNext={handleCompleteAndNext}
                isLastTopic={activeTopic.index === flattenedTopics.length - 1}
            />
        );
    }
    
    return (
        <div className="h-screen flex flex-col bg-[#0D1117] text-gray-200">
            <header className="sticky top-0 z-20 p-6 pb-4 bg-[#0D1117]/80 backdrop-blur-sm">
                <div className="flex items-center">
                    <button onClick={onBack} className="p-2 -ml-2 text-gray-300 rounded-full hover:bg-white/10">
                        <ChevronLeftIcon />
                    </button>
                    <div className="text-center flex-1">
                        <h1 className="text-2xl font-bold text-gray-100">Learning Center</h1>
                        <p className="text-sm text-gray-400">Master your money step-by-step.</p>
                    </div>
                    <div className="w-8"></div>
                </div>
            </header>

            <div className="px-6 py-2">
                <div className="no-scrollbar flex space-x-2 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-all duration-300 ${activeTab === tab ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20' : 'text-gray-400 bg-white/5 hover:bg-white/10'}`}>
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <main className="flex-1 overflow-y-auto p-6 pt-4 no-scrollbar">
                 <GlassmorphicPanel className="!p-4">
                    <div className="flex justify-between items-center text-sm font-semibold mb-1">
                        <span className="text-gray-300">{activeTab} Progress</span>
                        <span className="text-sky-300">{completedCount} / {totalTopicsForCategory} Topics</span>
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-2">
                        <div className="bg-gradient-to-r from-sky-500 to-emerald-400 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </GlassmorphicPanel>
                
                {Object.entries(levels).map(([levelName, levelData]) => {
                    const levelTopics = levelData.topics;
                    if (levelTopics.length === 0) return null;
                    const lastTopicOfLevel = levelTopics[levelTopics.length - 1];
                    const isLevelComplete = completedCount > lastTopicOfLevel.index;

                    return (
                        <div key={levelName} className="animate-fade-in">
                            <div className="flex items-center my-6 space-x-4 pl-4">
                                {levelData.icon}
                                <h2 className="text-2xl font-bold text-gray-100">{levelName} Level</h2>
                                <div className="flex-1 h-px bg-gradient-to-r from-sky-400/30 via-sky-400/30 to-transparent"></div>
                                {isLevelComplete && (
                                    <div className="flex items-center space-x-1.5 bg-amber-900/50 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                                        <TrophyIcon />
                                        <span>Level Complete</span>
                                    </div>
                                )}
                            </div>
                            
                            {levelTopics.map((topic, index) => {
                                const status: TopicStatus = topic.index < completedCount ? 'completed' : topic.index === completedCount ? 'current' : 'locked';
                                return (
                                    <TopicNode
                                        key={topic.id}
                                        topic={topic}
                                        status={status}
                                        isFirstInLevel={index === 0}
                                        isLastInLevel={index === levelTopics.length - 1}
                                        onClick={() => handleTopicSelect(topic)}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </main>
        </div>
    );
};

export default LearningCenterScreen;
