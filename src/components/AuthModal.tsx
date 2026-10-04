import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Users,
  LogOut,
  ArrowRight,
  UserCheck,
  Building2,
  Sparkles,
  Lock
} from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { CURRENT_USERS } from '../data/mockData';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    currentUser,
    loginWithGoogle,
    signUpWithGoogle,
    logoutUser,
    loginWithPersona,
    authError
  } = usePlaceComm();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setLocalError(null);
      if (authMode === 'signup') {
        await signUpWithGoogle();
      } else {
        await loginWithGoogle();
      }
    } catch (err: any) {
      console.warn('Google Auth completed with message:', err.message);
      // If popup was blocked or failed, give helpful message
      setLocalError(
        err.message?.includes('popup')
          ? 'Popup closed or blocked by browser. You can also select a coordinator persona below to sign in.'
          : 'Google authentication encountered an issue. You can use direct coordinator sign-in below.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header with IIFT Placement Committee Brand */}
        <div className="bg-slate-900 text-white p-5 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-0.5 bg-blue-600 rounded text-[11px] font-bold text-white uppercase tracking-wider">
              IIFT Delhi
            </div>
            <span className="text-xs text-slate-400">PlaceComm OS</span>
          </div>

          <h2 className="text-lg font-bold text-white tracking-tight">
            {authMode === 'signin' ? 'Sign In to Placement Portal' : 'Register Placement Coordinator'}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Authorized access for IIFT Delhi Placement Committee members and administrators.
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Active Session Card if user is already signed in */}
          {currentUser && (
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-blue-300"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</p>
                    {currentUser.isGoogleLinked && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Google Linked</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 truncate max-w-[180px]">{currentUser.email}</p>
                  <p className="text-[10px] font-semibold text-blue-700 mt-0.5">
                    Role: {currentUser.pcRole || currentUser.role.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <button
                onClick={logoutUser}
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Sign out of current account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setAuthMode('signin')}
              className={`flex-1 py-1.5 rounded-md transition-all ${
                authMode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In with Google
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-1.5 rounded-md transition-all ${
                authMode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Coordinator Sign Up
            </button>
          </div>

          {/* Error Message */}
          {(authError || localError) && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Authentication Notice</p>
                <p className="text-[11px] text-rose-700 mt-0.5">{authError || localError}</p>
              </div>
            </div>
          )}

          {/* Official Google OAuth Sign In / Sign Up Button */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-3 transition-all hover:shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {/* Google 4-color SVG Logo */}
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>

              <span>
                {loading
                  ? 'Connecting to Google OAuth...'
                  : authMode === 'signup'
                  ? 'Sign up with Google Workspace'
                  : 'Continue with Google Account'}
              </span>
            </button>

            <p className="text-[11px] text-slate-500 text-center">
              Secured with Google OAuth 2.0 &amp; Firebase Authentication
            </p>
          </div>

          {/* Quick Coordinator Persona Selector (For rapid testing / offline dev) */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Instant Coordinator Sign-in
              </span>
              <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.2 rounded">
                Development Switcher
              </span>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {CURRENT_USERS.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    loginWithPersona(user);
                    closeAuthModal();
                  }}
                  className={`w-full p-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between border ${
                    currentUser.id === user.id
                      ? 'bg-blue-50/80 border-blue-300 font-semibold text-blue-950'
                      : 'hover:bg-slate-50 border-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <p className="truncate font-semibold text-slate-900 leading-none">{user.name}</p>
                      <p className="text-[10px] text-slate-500 leading-none mt-1 truncate">{user.email}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                    {user.pcRole || user.role.split('_')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-[11px]">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Role-Based Access Control (RBAC)</span>
          </span>
          <button
            onClick={closeAuthModal}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
