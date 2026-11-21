import React from 'react';
import { useDineOS } from '../../context/DineOSContext';
import {
  Smartphone,
  ChefHat,
  MapPin,
  BarChart3,
  QrCode,
  Volume2,
  VolumeX,
  RotateCcw,
  Flame,
  Bell,
  PlusCircle,
  ShieldCheck,
  Lock,
  Unlock,
  ShoppingBag
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
    openWaiterRequestsCount,
    isStaffUnlocked,
    setStaffAuthModalOpen,
    lockStaff,
    cart,
    setCartDrawerOpen,
    setCallWaiterModalOpen
  } = useDineOS();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 1. GUEST MODE: Strict Privacy - Only Restaurant Logo, Table info, Call Waiter, Cart & Staff Lock
  if (!isStaffUnlocked) {
    return (
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-3 sm:px-4 py-2.5 shadow-xl transition-all">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Brand & Table Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-black text-lg">
              <Flame className="w-5 h-5 text-amber-200 fill-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-base text-white font-serif">
                  Zaika <span className="text-amber-400 font-sans font-black text-xs uppercase px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">DineOS</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Table {selectedTableId}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[170px] sm:max-w-none">
                {activeTable.guests.join(' & ')} • Dine-in QR Menu
              </p>
            </div>
          </div>

          {/* Guest Action Shortcuts & Staff Login Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Call Waiter */}
            <button
              onClick={() => setCallWaiterModalOpen(true)}
              className={`p-2 rounded-xl text-xs font-bold transition-all relative ${
                activeTable.waiterRequest.active
                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
              title="Call Waiter"
            >
              <Bell className="w-4 h-4 text-amber-400" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 transition-all"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-black text-slate-950 flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mute/Sound toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
              title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Discreet Staff Portal Lock Button */}
            <button
              onClick={() => setStaffAuthModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 text-xs font-semibold transition-all"
              title="Restaurant Staff Access (PIN Protected)"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline text-[11px]">Staff Access</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // 2. STAFF MODE: Unlocked with 4-digit PIN (Full Operations Console)
  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-amber-500/30 text-slate-100 px-3 lg:px-6 py-2.5 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Staff Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-black text-xl tracking-wider">
            <Flame className="w-6 h-6 text-amber-200 fill-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-white font-serif">
                Zaika <span className="text-amber-400 font-sans font-black text-sm uppercase px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">DineOS</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
                <Unlock className="w-3 h-3 text-amber-400" />
                Staff Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Kitchen Display (KDS) • Floor Map • Owner Analytics
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
            <span>Guest View ({selectedTableId})</span>
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

          {/* Table QR Standees Generator */}
          <button
            onClick={() => setQrModalOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all group"
            title="Print or Scan Table QR Standees"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="font-bold">{activeTable.id}</span>
            <span className="text-[11px] text-amber-200/80 hidden md:inline truncate max-w-[90px]">
              {activeTable.guests.join(' & ')}
            </span>
          </button>

          {/* Audio Chime Mute/Unmute */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              soundMuted
                ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                : 'bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700'
            }`}
            title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
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

          {/* LOCK STAFF MODE BUTTON */}
          <button
            onClick={lockStaff}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all shadow-sm"
            title="Lock to Guest Mode (Keep staff data private)"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>Lock Staff</span>
          </button>
        </div>
      </div>
    </header>
  );
};
