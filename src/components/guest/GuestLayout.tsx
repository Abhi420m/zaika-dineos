import React from 'react';
import { useDineOS } from '../../context/DineOSContext';
import { GuestMenu } from './GuestMenu';
import { WhileYouWait } from './WhileYouWait';
import { PayBillView } from './PayBillView';
import { DishModal } from './DishModal';
import { CartDrawer } from './CartDrawer';
import { CallWaiterModal } from './CallWaiterModal';
import {
  Utensils,
  Hourglass,
  Bell,
  CreditCard,
  ShoppingBag,
  Flame,
  Wifi,
  Battery,
  Smartphone,
  Sparkles,
  QrCode
} from 'lucide-react';

export const GuestLayout: React.FC = () => {
  const {
    guestTab,
    setGuestTab,
    isDeviceFrame,
    selectedTableId,
    activeTable,
    cart,
    setCartDrawerOpen,
    setCallWaiterModalOpen,
    setQrModalOpen,
    getCurrentOrderForTable
  } = useDineOS();

  const currentOrder = getCurrentOrderForTable(selectedTableId);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { id: 'menu', label: 'Menu', icon: Utensils, badge: null },
    {
      id: 'wait',
      label: 'While-You-Wait',
      icon: Hourglass,
      badge: currentOrder && currentOrder.status === 'COOKING' ? 'Cooking' : null
    },
    {
      id: 'call',
      label: 'Call Waiter',
      icon: Bell,
      badge: activeTable.waiterRequest.active ? 'Alert' : null
    },
    {
      id: 'pay',
      label: 'Pay Bill',
      icon: CreditCard,
      badge: currentOrder ? `₹${currentOrder.totalAmount}` : null
    }
  ];

  const content = (
    <div className="relative flex flex-col min-h-full bg-slate-950 text-slate-100">
      {/* Simulated Mobile Status Bar (Inside phone view) */}
      <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] text-slate-400 font-semibold select-none">
        <span>10:02</span>
        {/* Dynamic Island Pill */}
        <div className="w-20 h-4 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-amber-500/80 animate-pulse" />
        </div>
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-[10px]">5G</span>
          <Battery className="w-4 h-4 text-slate-300" />
        </div>
      </div>

      {/* Guest Sticky Top Bar */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQrModalOpen(true)}
            className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-xl text-xs font-black transition-all"
            title="Scan or Switch Table"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Table {selectedTableId}</span>
          </button>
          <span className="text-xs font-semibold text-slate-300 truncate max-w-[120px]">
            {activeTable.guests.join(' & ')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Call Waiter shortcut */}
          <button
            onClick={() => setCallWaiterModalOpen(true)}
            className={`p-2 rounded-xl text-xs font-bold transition-all relative ${
              activeTable.waiterRequest.active
                ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
            title="Call Waiter"
          >
            <Bell className="w-4 h-4" />
            {activeTable.waiterRequest.active && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-slate-950" />
            )}
          </button>

          {/* Quick Cart Drawer Trigger */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 relative transition-all"
            title="Open Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-black text-slate-950 flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 p-3 sm:p-4 overflow-y-auto">
        {guestTab === 'menu' && <GuestMenu />}
        {guestTab === 'wait' && <WhileYouWait />}
        {guestTab === 'call' && (
          <div className="p-4">
            <h3 className="text-base font-bold text-white mb-2">One-Tap Waiter Assistance</h3>
            <p className="text-xs text-slate-400 mb-4">
              Need water, fresh cutlery, napkins or your check?
            </p>
            <button
              onClick={() => setCallWaiterModalOpen(true)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2"
            >
              <Bell className="w-5 h-5" />
              <span>Open Call Waiter Console</span>
            </button>
          </div>
        )}
        {guestTab === 'pay' && <PayBillView />}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = guestTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'call') {
                    setCallWaiterModalOpen(true);
                  } else {
                    setGuestTab(item.id as any);
                  }
                }}
                className={`py-1.5 px-1 rounded-xl flex flex-col items-center justify-center relative transition-all ${
                  isActive
                    ? 'text-amber-400 bg-amber-500/10 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                <span className="text-[10px] leading-tight truncate">{item.label}</span>
                {item.badge && (
                  <span className="absolute -top-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black shadow-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Global Modals for Guest View */}
      <DishModal />
      <CartDrawer />
      <CallWaiterModal />
    </div>
  );

  if (isDeviceFrame) {
    return (
      <div className="py-6 px-3 flex justify-center items-center min-h-[calc(100vh-60px)] bg-slate-950">
        <div className="relative w-full max-w-[420px] h-[850px] max-h-[92vh] bg-slate-950 rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-[10px] border-slate-800 ring-1 ring-slate-700/80 overflow-hidden flex flex-col">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-slate-950 flex flex-col">
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col">
        {content}
      </div>
    </div>
  );
};
