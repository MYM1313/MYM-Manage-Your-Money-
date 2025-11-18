import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const Logo: React.FC = () => (
    <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="animate-float">
        <defs>
            <linearGradient id="barFaceGradient" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stopColor="#5B8DEA"/><stop offset="100%" stopColor="#3A6AC1"/></linearGradient>
            <linearGradient id="barTopGradient" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stopColor="#7CA3EE"/><stop offset="100%" stopColor="#5B8DEA"/></linearGradient>
            <filter id="starGlow"><feGaussianBlur in="SourceGraphic" stdDeviation="1.5"/></filter>
        </defs>
        <circle cx="50" cy="50" r="47" fill="#0B142B"/>
        <g transform="translate(0, 5)"><rect x="22" y="40" width="14" height="45" fill="url(#barFaceGradient)"/><path d="M22 40 L25 37 L39 37 L36 40 Z" fill="url(#barTopGradient)"/><rect x="40" y="53" width="14" height="32" fill="url(#barFaceGradient)"/><path d="M40 53 L43 50 L57 50 L54 53 Z" fill="url(#barTopGradient)"/><rect x="58" y="35" width="14" height="50" fill="url(#barFaceGradient)"/><path d="M58 35 L61 32 L75 32 L72 35 Z" fill="url(#barTopGradient)"/><rect x="76" y="25" width="14" height="60" fill="url(#barFaceGradient)"/><path d="M76 25 L79 22 L93 22 L90 25 Z" fill="url(#barTopGradient)"/></g>
        <g fill="white" filter="url(#starGlow)"><path transform="translate(30 25) scale(0.5)" d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"/><path transform="translate(48 18) scale(0.65)" d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"/><path transform="translate(68 22) scale(0.6)" d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"/><path transform="translate(82 17) scale(0.4)" d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"/></g>
    </svg>
);

const GoogleIcon: React.FC = () => (
    <svg className="w-6 h-6" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.519-3.108-11.187-7.469l-6.571,4.819C9.656,39.663,16.318,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.438,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);


const LoginScreen: React.FC = () => {
    
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            // Auth state change will be handled by the listener in App.tsx
        } catch (error) {
            console.error("Error signing in with Google: ", error);
            alert("Could not sign in with Google. Please try again.");
        }
    };

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0D1117] via-[#0a0f1f] to-[#0D1117] animate-aurora text-gray-200 p-6">
            <div className="w-full max-w-sm text-center">
                 <div className="animate-slide-up-fade-in">
                    <Logo />
                </div>
                
                <div className="mt-8 animate-slide-up-fade-in" style={{ animationDelay: '100ms' }}>
                    <h1 className="text-3xl font-bold font-montserrat cinematic-title">Welcome to MYM</h1>
                    <p className="text-gray-400 mt-2">Manage Your Money with confidence.</p>
                </div>
                
                 <div className="mt-12 w-full animate-slide-up-fade-in" style={{ animationDelay: '200ms' }}>
                    <button 
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center space-x-3 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-lg font-semibold text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all transform"
                    >
                        <GoogleIcon />
                        <span>Sign in with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
