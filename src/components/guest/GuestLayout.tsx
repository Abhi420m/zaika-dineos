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
  Sparkles,
  Lock,
  ShieldCheck,
  CheckCircle2
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
    getCurrentOrderForTable,
    isStaffUnlocked,
    setStaffAuthModalOpen
  } = useDineOS();

  const currentOrder = getCurrentOrderForTable(selectedTableId);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { id: 'menu', label: 'Digital Menu', icon: Utensils, badge: null },
    {
      id: 'wait',
      label: 'Food Status',
      icon: Hourglass,
      badge: currentOrder && currentOrder.status === 'COOKING' ? 'Cooking' : null
    },
    {
      id: 'call',
      label: 'Call Waiter',
      icon: Bell,
      badge: activeTable.waiterRequest.active ? 'Active' : null
    },
    {
      id: 'pay',
      label: 'Bill & Pay',
      icon: CreditCard,
      badge: currentOrder ? `₹${currentOrder.totalAmount}` : null
    }
  ];

  const content = (
    <div className="relative flex flex-col min-h-full bg-slate-950 text-slate-100 pb-20">
      {/* Table Welcome & Wi-Fi Banner */}
      <div className="p-3 sm:p-4 bg-gradient-to-b from-slate-900/80 to-slate-950 border-b border-slate-800/60">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black text-xs flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Table {selectedTableId}</span>
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Guests: <strong className="text-white">{activeTable.guests.join(' & ')}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span>WiFi: <strong className="text-slate-200 font-mono">Zaika_Guest_5G</strong></span>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 p-3 sm:p-4 overflow-y-auto">
        {guestTab === 'menu' && <GuestMenu />}
        {guestTab === 'wait' && <WhileYouWait />}
        {guestTab === 'call' && (
          <div className="p-4 max-w-md mx-auto space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-2 shadow-inner">
                <Bell className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-white">Call Table Waiter</h3>
              <p className="text-xs text-slate-400">
                Tap below for instant waiter service right at Table {selectedTableId}
              </p>
            </div>
            <button
              onClick={() => setCallWaiterModalOpen(true)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 active:scale-98 transition-transform"
            >
              <Bell className="w-5 h-5" />
              <span>Request Waiter to Table {selectedTableId}</span>
            </button>
          </div>
        )}
        {guestTab === 'pay' && <PayBillView />}
      </main>

      {/* Privacy Guarantee & Subtle Staff Portal Footer */}
      <footer className="mt-8 px-4 py-6 border-t border-slate-900 text-center space-y-2 text-xs text-slate-500">
        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Guest Privacy • No App Download • No Phone Number Required</span>
        </p>
        <p className="text-[10px] text-slate-600">
          Zaika Indian Bistro • FSSAI Lic. 11524021000345 • Powered by Zaika DineOS
        </p>
        {!isStaffUnlocked && (
          <div className="pt-2">
            <button
              onClick={() => setStaffAuthModalOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-amber-400 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Staff & Kitchen Portal Login</span>
            </button>
          </div>
        )}
      </footer>

      {/* Floating Bottom Navigation Bar for Guests */}
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

  // Responsive Display: Clean full-width on mobile phones, elegant centered view on desktop
  return (
    <div className="min-h-[calc(100vh-60px)] bg-slate-950 flex flex-col">
      <div className="w-full max-w-xl mx-auto flex-1 flex flex-col bg-slate-950 sm:border-x sm:border-slate-800/60 shadow-2xl">
        {content}
      </div>
    </div>
  );
};
