import React, { FC, useContext, useState } from 'react';
import { FinancialContext } from '../../App';
import { User } from '../../types';
import { ChevronLeftIcon } from '../../components/icons/ChevronLeftIcon';

const Toast: FC<{ message: string; show: boolean; }> = ({ message, show }) => (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${show ? 'animate-slide-in-from-top' : 'animate-slide-out-to-top pointer-events-none'}`}>
        <div className="bg-green-900/50 backdrop-blur-md text-green-300 font-semibold py-3 px-5 rounded-xl shadow-2xl flex items-center space-x-3 border border-green-500/30">
            <span>✅</span>
            <span>{message}</span>
        </div>
    </div>
);

const EditProfileScreen: FC<{ onBack: () => void; }> = ({ onBack }) => {
    const { user, updateUser } = useContext(FinancialContext);
    const [formData, setFormData] = useState<User>(user);
    const [showToast, setShowToast] = useState(false);

    const handleChange = (field: keyof User, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        updateUser(formData);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    handleChange('profilePictureUrl', event.target.result as string);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    return (
        <>
        <Toast message="Profile updated successfully!" show={showToast} />
        <div className="h-full flex flex-col bg-gradient-to-b from-[#0a0f1f] to-[#0D1117] text-gray-200 animate-slide-in-right-fade">
            <header className="sticky top-0 z-20 p-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl">
                <div className="flex items-center">
                    <button onClick={onBack} className="p-2 -ml-2 text-gray-300 rounded-full hover:bg-white/10"><ChevronLeftIcon /></button>
                    <div className="text-center flex-1">
                        <h1 className="text-2xl font-bold text-gray-100">Edit Profile</h1>
                    </div>
                    <div className="w-8"></div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                        <img src={formData.profilePictureUrl} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-sky-500/30" />
                        <label htmlFor="profile-pic-upload" className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span>Change</span>
                        </label>
                        <input id="profile-pic-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-400">Full Name</label>
                        <input type="text" value={formData.name} onChange={e => handleChange('name', e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mt-1 text-base text-gray-100 focus:ring-2 focus:ring-sky-500 transition-all" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-400">Email Address</label>
                        <input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mt-1 text-base text-gray-100 focus:ring-2 focus:ring-sky-500 transition-all" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-400">Phone Number</label>
                        <input type="tel" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mt-1 text-base text-gray-100 focus:ring-2 focus:ring-sky-500 transition-all" />
                    </div>
                </div>
            </main>

            <footer className="p-4 bg-gradient-to-t from-[#0D1117] to-transparent">
                <button onClick={handleSave} className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/20 hover:scale-[1.02] active:scale-100 transition-transform transform text-lg">
                    Save Changes
                </button>
            </footer>
        </div>
        </>
    );
};

export default EditProfileScreen;