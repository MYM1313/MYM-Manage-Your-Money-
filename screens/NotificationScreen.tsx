import React, { useState, useContext, useMemo, FC, useRef, useEffect } from 'react';
import { FinancialContext } from '../App';
import { Notification, NotificationCategory } from '../types';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';

// --- HELPER FUNCTIONS & COMPONENTS ---

const timeSince = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) {
        if (Math.floor(interval) === 1) return "Yesterday";
        return Math.floor(interval) + "d ago";
    }
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
};

const EmptyState: FC = () => (
    <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in mt-16">
        <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-sky-500/10 rounded-full animate-ping"></div>
            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-[#181C23]">
                <span className="text-4xl animate-float">🎉</span>
            </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-100">You're all caught up!</h2>
        <p className="text-gray-400 mt-2 max-w-xs">Stay tuned for new insights, reminders, and updates from your AI assistant.</p>
    </div>
);

// --- MAIN SCREEN & SUB-COMPONENTS ---

interface NotificationScreenProps {
    onBack: () => void;
    onNavigate: (view: string, params?: any) => void;
}

const NotificationScreen: FC<NotificationScreenProps> = ({ onBack, onNavigate }) => {
    const { notifications, markNotificationAsRead, clearAllNotifications, deleteNotification, toggleNotificationReadStatus } = useContext(FinancialContext);
    const [filter, setFilter] = useState<NotificationCategory | 'All' | 'Unread'>('All');
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

    const filteredNotifications = useMemo(() => {
        let filtered = [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        if (filter === 'Unread') return filtered.filter(n => !n.isRead);
        if (filter !== 'All') return filtered.filter(n => n.category === filter);
        return filtered;
    }, [notifications, filter]);

    const groupedNotifications = useMemo(() => {
        const groups: { [key: string]: Notification[] } = { Today: [], Yesterday: [], Earlier: [] };
        const today = new Date();
        const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

        filteredNotifications.forEach(n => {
            const nDate = new Date(n.timestamp);
            if (nDate.toDateString() === today.toDateString()) groups.Today.push(n);
            else if (nDate.toDateString() === yesterday.toDateString()) groups.Yesterday.push(n);
            else groups.Earlier.push(n);
        });
        return groups;
    }, [filteredNotifications]);

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
            clearAllNotifications();
        }
    };

    const handleCardClick = (notification: Notification) => {
        setSelectedNotification(notification);
        if (!notification.isRead) markNotificationAsRead(notification.id);
    };

    const filters: (NotificationCategory | 'All' | 'Unread')[] = ['All', 'Unread', 'Insight', 'Reminder', 'AI Mentions', 'System'];
    const filterPillRef = useRef<HTMLDivElement>(null);
    const [pillStyle, setPillStyle] = useState({});

    useEffect(() => {
        const activeTab = filterPillRef.current?.querySelector(`[data-filter="${filter}"]`) as HTMLElement;
        if (activeTab) {
            setPillStyle({
                left: activeTab.offsetLeft,
                width: activeTab.offsetWidth,
            });
        }
    }, [filter]);

    return (
        <>
            <div className="h-full flex flex-col bg-[#0D1117] text-gray-200 animate-slide-in-bottom">
                <header className="sticky top-0 z-20 p-4 pt-6 bg-[#0D1117]/80 backdrop-blur-xl">
                    <div className="flex items-center">
                        <button onClick={onBack} className="p-2 -ml-2 text-gray-300 rounded-full hover:bg-white/10"><ChevronLeftIcon /></button>
                        <div className="text-center flex-1">
                            <h1 className="text-2xl font-bold font-montserrat text-gray-100">Notifications 🔔</h1>
                            <p className="text-xs text-gray-500">Stay updated with your smart money journey.</p>
                        </div>
                        <button onClick={handleClearAll} className="p-2 text-sm font-semibold text-gray-400 rounded-lg hover:bg-white/10">Clear All</button>
                    </div>
                    <div ref={filterPillRef} className="relative mt-4 flex space-x-2 overflow-x-auto no-scrollbar p-1 bg-black/30 rounded-full">
                        <div className="absolute top-1 bottom-1 bg-sky-600 rounded-full transition-all duration-300 ease-in-out" style={pillStyle}></div>
                        {filters.map(f => (
                            <button key={f} data-filter={f} onClick={() => setFilter(f)} className={`relative z-10 px-4 py-1.5 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${filter === f ? 'text-white' : 'text-gray-400'}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-8">
                    {filteredNotifications.length === 0 ? <EmptyState /> : (
                        // FIX: Explicitly type `groupItems` as `Notification[]` to fix TypeScript error where it was being inferred as `unknown`.
                        Object.entries(groupedNotifications).map(([groupTitle, groupItems]: [string, Notification[]]) => groupItems.length > 0 && (
                            <div key={groupTitle} className="animate-fade-in">
                                <h2 className="text-sm font-bold text-gray-500 mb-3 px-2 uppercase tracking-wider">{groupTitle}</h2>
                                <div className="space-y-3">
                                    {groupItems.map((n, index) => <NotificationCard key={n.id} notification={n} onClick={() => handleCardClick(n)} onDelete={() => deleteNotification(n.id)} onToggleRead={() => toggleNotificationReadStatus(n.id)} style={{ animationDelay: `${index * 50}ms` }} />)}
                                </div>
                            </div>
                        ))
                    )}
                </main>
            </div>
            {selectedNotification && <NotificationDetailModal notification={selectedNotification} onClose={() => setSelectedNotification(null)} onNavigate={onNavigate} />}
        </>
    );
};

const NotificationCard: FC<{ notification: Notification; onClick: () => void; onDelete: () => void; onToggleRead: () => void; style?: React.CSSProperties }> = ({ notification, onClick, onDelete, onToggleRead, style }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const startX = useRef(0);
    const currentX = useRef(0);
    const isSwiping = useRef(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const onTouchStart = (e: React.TouchEvent) => {
        isSwiping.current = true;
        startX.current = e.touches[0].clientX;
        if (cardRef.current) cardRef.current.style.transition = 'none';
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (!isSwiping.current) return;
        currentX.current = e.touches[0].clientX;
        const diff = Math.max(-100, Math.min(100, currentX.current - startX.current));
        if (cardRef.current) cardRef.current.style.transform = `translateX(${diff}px)`;
    };

    const onTouchEnd = () => {
        if (!isSwiping.current) return;
        isSwiping.current = false;
        const diff = currentX.current - startX.current;

        if (cardRef.current) {
            cardRef.current.style.transition = 'all 0.3s ease';
            if (diff < -80) { // Swipe left for delete
                if (window.confirm('Delete this notification?')) {
                    setIsDeleting(true);
                    cardRef.current.style.transform = 'translateX(-100%)';
                    setTimeout(onDelete, 300);
                } else {
                    cardRef.current.style.transform = 'translateX(0)';
                }
            } else if (diff > 80) { // Swipe right for read/unread
                onToggleRead();
                cardRef.current.style.transform = 'translateX(0)';
            } else {
                cardRef.current.style.transform = 'translateX(0)';
            }
        }
    };
    
    return (
        <div className={`relative overflow-hidden animate-fade-in ${isDeleting ? 'animate-slide-out-left-fade' : ''}`} style={style}>
            <div className="absolute inset-y-0 left-0 w-full flex justify-between items-center px-6">
                <div className="text-green-400 opacity-0 transition-opacity" style={{ opacity: Math.max(0, (currentX.current - startX.current) / 80 - 0.2) }}>
                    {notification.isRead ? 'Mark Unread' : 'Mark Read'}
                </div>
                <div className="text-red-400 opacity-0 transition-opacity" style={{ opacity: Math.max(0, (startX.current - currentX.current) / 80 - 0.2) }}>
                    Delete
                </div>
            </div>
            <div
                ref={cardRef}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onClick={onClick}
                className={`relative premium-glass !p-4 flex items-start space-x-4 cursor-pointer hover:border-sky-400/50 ${!notification.isRead ? 'animate-active-glow-blue !border-sky-500/30' : ''}`}
            >
                {!notification.isRead && <div className="absolute top-1/2 -translate-y-1/2 left-1.5 w-1.5 h-1.5 bg-sky-400 rounded-full"></div>}
                <div className="text-3xl bg-black/30 p-3 rounded-xl ml-3">{notification.icon}</div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-100 truncate">{notification.title}</p>
                    <p className="text-sm text-gray-400 line-clamp-2">{notification.message}</p>
                </div>
                <p className="text-xs text-gray-500 flex-shrink-0">{timeSince(notification.timestamp)}</p>
            </div>
        </div>
    );
};

const NotificationDetailModal: FC<{ notification: Notification; onClose: () => void; onNavigate: (view: string, params?: any) => void; }> = ({ notification, onClose, onNavigate }) => {
    const handleAction = () => {
        if (notification.action) {
            onNavigate(notification.action.view, notification.action.params);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-[70]" onClick={onClose}>
            <div className="w-full bg-gradient-to-t from-[#181C23] to-[#1F242E] border-t-2 border-sky-500/50 rounded-t-3xl p-6 space-y-6 animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gray-700 rounded-full"></div>
                <div className="text-center pt-4 space-y-2">
                    <div className="inline-block text-5xl bg-black/30 p-4 rounded-2xl">{notification.icon}</div>
                    <h2 className="text-2xl font-bold text-gray-100">{notification.title}</h2>
                    <p className="text-sm text-gray-400">{new Date(notification.timestamp).toLocaleString()}</p>
                </div>
                <p className="text-center text-gray-300 bg-black/20 p-4 rounded-xl">{notification.message}</p>
                {notification.action && (
                    <button onClick={handleAction} className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-500 transition-colors">
                        {notification.action.label}
                    </button>
                )}
            </div>
        </div>
    );
};

export default NotificationScreen;