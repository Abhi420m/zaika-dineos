import React, { useState, useEffect } from 'react';
import { useDineOS } from '../../context/DineOSContext';
import { WaiterCall } from '../../types';
import { Bell, X, Droplets, FileText, Receipt, UtensilsCrossed, Sparkles, CheckCircle2, Clock } from 'lucide-react';

export const CallWaiterModal: React.FC = () => {
  const {
    callWaiterModalOpen,
    setCallWaiterModalOpen,
    activeTable,
    callWaiter,
    resolveWaiter
  } = useDineOS();

  if (!callWaiterModalOpen) return null;

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Timer for active waiter request
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeTable.waiterRequest.active && activeTable.waiterRequest.requestedAt) {
      interval = setInterval(() => {
        const diff = Math.floor((Date.now() - activeTable.waiterRequest.requestedAt!) / 1000);
        setElapsedSeconds(diff);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTable.waiterRequest]);

  const requestChips: { label: NonNullable<WaiterCall['type']>; icon: React.ReactNode; desc: string }[] = [
    { label: 'Water', icon: <Droplets className="w-4 h-4 text-cyan-400" />, desc: 'Fresh Chilled Water' },
    { label: 'Napkins', icon: <FileText className="w-4 h-4 text-amber-400" />, desc: 'Extra Dinner Napkins' },
    { label: 'Cutlery', icon: <UtensilsCrossed className="w-4 h-4 text-emerald-400" />, desc: 'Forks, Spoons, Plates' },
    { label: 'Bill', icon: <Receipt className="w-4 h-4 text-purple-400" />, desc: 'Request Final Bill' },
    { label: 'Clean Table', icon: <Sparkles className="w-4 h-4 text-yellow-400" />, desc: 'Clear Empty Plates' },
    { label: 'General', icon: <Bell className="w-4 h-4 text-rose-400" />, desc: 'Speak with Server' }
  ];

  const handleTrigger = (type: WaiterCall['type']) => {
    callWaiter(activeTable.id, type);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setCallWaiterModalOpen(false);
      }}
    >
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-slate-100 overflow-hidden animate-in zoom-in-95 duration-200"
        role="region"
        aria-label="Call Waiter"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/30 text-rose-400">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                Call Waiter • Table {activeTable.id}
              </h3>
              <p className="text-xs text-slate-400">
                Assigned Captain: <span className="text-amber-400 font-bold">{activeTable.serverName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setCallWaiterModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {activeTable.waiterRequest.active ? (
            /* Active Call In Progress State */
            <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-center space-y-3 shadow-lg">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mx-auto text-amber-400 animate-pulse">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Request Active ({activeTable.waiterRequest.type || 'Assistance'})
                </span>
                <h4 className="text-lg font-black text-white mt-2">
                  Server {activeTable.serverName} is on the way!
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Alert dispatched to Floor tablet {elapsedSeconds}s ago
                </p>
              </div>

              {activeTable.waiterRequest.acknowledged && (
                <div className="text-xs text-emerald-400 bg-emerald-500/10 py-1 px-3 rounded-lg border border-emerald-500/20 font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Captain acknowledged • Approaching your table
                </div>
              )}

              <button
                onClick={() => resolveWaiter(activeTable.id)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors"
              >
                Cancel / Help Received
              </button>
            </div>
          ) : (
            /* New Request Prompt */
            <>
              <p className="text-xs text-slate-300 leading-relaxed">
                Need anything during your meal? Tap a quick request below or call your server directly to your table:
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {requestChips.map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => handleTrigger(chip.label)}
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-left transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white group-hover:text-amber-400 transition-colors">
                        {chip.label}
                      </span>
                      <div className="p-1 rounded-md bg-slate-900 border border-slate-700">
                        {chip.icon}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {chip.desc}
                    </span>
                  </button>
                ))}
              </div>

              {/* Big General Call Button */}
              <button
                onClick={() => handleTrigger('General')}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 hover:opacity-95 text-white font-black text-sm shadow-xl shadow-rose-600/20 transition-all flex items-center justify-center gap-2 group"
              >
                <Bell className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>One-Tap Call Waiter to Table {activeTable.id}</span>
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-right">
          <button
            onClick={() => setCallWaiterModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
