import React from 'react';
import { useDineOS, MainView } from '../../context/DineOSContext';
import {
  Smartphone,
  ChefHat,
  MapPin,
  BarChart3,
  QrCode,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Monitor,
  Flame,
  Bell,
  PlusCircle,
  ShieldCheck
} from 'lucide-react';

export const HeaderNav: React.FC = () => {
  const {
    mainView,
    setMainView,
    selectedTableId,
    activeTable,
    setQrModalOpen,
    setAddDishModalOpen,
    setRestaurantSetupModalOpen,
    soundMuted,
    toggleSound,
    resetDemoData,
    isDeviceFrame,
    setIsDeviceFrame,
    openWaiterRequestsCount
  } = useDineOS();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-3 lg:px-6 py-2.5 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-black text-xl tracking-wider">
            <Flame className="w-6 h-6 text-amber-200 fill-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-white font-serif">
                Zaika <span className="text-amber-400 font-sans font-black text-sm uppercase px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">DineOS</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              QR Ordering • KDS Stations • Floor & Guest Management
            </p>
          </div>
        </div>

        {/* Navigation Switcher Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner overflow-x-auto max-w-full">
          <button
            onClick={() => setMainView('guest')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              mainView === 'guest'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Guest Menu ({selectedTableId})</span>
          </button>

          <button
            onClick={() => setMainView('staff_kds')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              mainView === 'staff_kds'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Kitchen (KDS)</span>
          </button>

          <button
            onClick={() => setMainView('staff_floor')}
            className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              mainView === 'staff_floor'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Floor Map</span>
            {openWaiterRequestsCount > 0 && (
              <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white animate-pulse">
                {openWaiterRequestsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMainView('staff_overview')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              mainView === 'staff_overview'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Command View</span>
          </button>
        </nav>

        {/* Action Controls & Table Switcher */}
        <div className="flex items-center gap-2">
          {/* Hotel Setup & Security */}
          <button
            onClick={() => setRestaurantSetupModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all shadow-sm"
            title="Hotel Registration, Bank UPI & Data Security Settings"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Hotel Setup & Security</span>
          </button>

          {/* Add Dish Button */}
          <button
            onClick={() => setAddDishModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all shadow-sm"
            title="Add New Dish to Menu Catalog"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">+ Add Dish</span>
          </button>

          {/* Table Switcher / QR Modal Trigger */}
          <button
            onClick={() => setQrModalOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all group"
            title="Scan or Switch Table QR Standee"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="font-bold">{activeTable.id}</span>
            <span className="text-[11px] text-amber-200/80 hidden md:inline truncate max-w-[90px]">
              {activeTable.guests.join(' & ')}
            </span>
          </button>

          {/* Device Simulator Frame Toggle (only active in Guest view) */}
          {mainView === 'guest' && (
            <button
              onClick={() => setIsDeviceFrame(!isDeviceFrame)}
              className={`p-1.5 rounded-lg border text-xs font-medium transition-all hidden sm:flex items-center gap-1.5 ${
                isDeviceFrame
                  ? 'bg-slate-800 border-slate-700 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title={isDeviceFrame ? 'Switch to Full Width View' : 'Switch to Phone Mockup View'}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden lg:inline">{isDeviceFrame ? 'Phone Frame' : 'Full Screen'}</span>
            </button>
          )}

          {/* Audio Chime Mute/Unmute */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              soundMuted
                ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                : 'bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700'
            }`}
            title={soundMuted ? 'Unmute Kitchen Audio' : 'Mute Kitchen Audio'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={resetDemoData}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
            title="Reset All Demo Orders & Tables"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
