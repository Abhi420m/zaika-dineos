import React, { useState, useEffect } from 'react';
import { useDineOS } from '../../context/DineOSContext';
import {
  Lock,
  X,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  Delete,
  ChefHat,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const StaffAuthModal: React.FC = () => {
  const {
    staffAuthModalOpen,
    setStaffAuthModalOpen,
    unlockStaff,
    restaurantProfile,
    pendingStaffView
  } = useDineOS();

  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState<boolean>(false);

  useEffect(() => {
    if (staffAuthModalOpen) {
      setPin('');
      setError(null);
      setShake(false);
    }
  }, [staffAuthModalOpen]);

  if (!staffAuthModalOpen) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      const next = pin + digit;
      setPin(next);
      setError(null);
      if (next.length === (restaurantProfile.adminPin?.length || 4)) {
        verifyPin(next);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(null);
  };

  const verifyPin = (candidatePin: string) => {
    const success = unlockStaff(candidatePin);
    if (!success) {
      setError('Incorrect Security PIN. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPin('');
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin) {
      setError('Please enter your 4-digit PIN');
      return;
    }
    verifyPin(pin);
  };

  const handleAutofillDemoPin = () => {
    const demoPin = restaurantProfile.adminPin || '1234';
    setPin(demoPin);
    verifyPin(demoPin);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setStaffAuthModalOpen(false);
      }}
    >
      <div
        className={`relative w-full max-w-sm bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl text-slate-100 overflow-hidden flex flex-col transition-transform ${
          shake ? 'animate-bounce' : ''
        }`}
        role="dialog"
        aria-label="Staff Security Authentication"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-xl text-slate-950 font-black shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Staff & Operations Access
              </h3>
              <p className="text-[11px] text-slate-400">
                Restricted to Kitchen & Restaurant Staff
              </p>
            </div>
          </div>
          <button
            onClick={() => setStaffAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <KeyRound className="w-6 h-6" />
          </div>

          <div>
            <h4 className="text-base font-bold text-white">Enter Staff Security PIN</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              To view Kitchen Display (KDS), Live Floor Map, or Hotel Settings
            </p>
          </div>

          {/* PIN Dots Display */}
          <div className="flex items-center justify-center gap-3 py-2">
            {[0, 1, 2, 3].map((index) => {
              const isFilled = pin.length > index;
              return (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-150 border-2 ${
                    isFilled
                      ? 'bg-amber-400 border-amber-400 shadow-[0_0_10px_#f59e0b]'
                      : 'bg-slate-950 border-slate-700'
                  }`}
                />
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Touch Numpad */}
          <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigit(digit)}
                className="h-12 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-lg font-bold text-white border border-slate-700/80 active:scale-95 transition-all shadow-sm flex items-center justify-center"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleBackspace}
              className="h-12 rounded-2xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-800 active:scale-95 transition-all flex items-center justify-center"
              title="Delete"
            >
              <Delete className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleDigit('0')}
              className="h-12 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-lg font-bold text-white border border-slate-700/80 active:scale-95 transition-all shadow-sm flex items-center justify-center"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black border border-amber-400 active:scale-95 transition-all shadow-md flex items-center justify-center"
              title="Unlock"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Demo PIN Helper */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">
              Demo PIN: <strong className="text-amber-400 font-mono">1234</strong>
            </span>
            <button
              type="button"
              onClick={handleAutofillDemoPin}
              className="text-amber-400 hover:underline font-bold text-[11px] flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Auto-fill Demo PIN</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={() => setStaffAuthModalOpen(false)}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            ← Return to Table Guest Menu
          </button>
        </div>
      </div>
    </div>
  );
};
