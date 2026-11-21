import React from 'react';
import { useDineOS } from '../../context/DineOSContext';
import {
  BarChart3,
  Users,
  ShoppingBag,
  DollarSign,
  Clock,
  Bell,
  TrendingUp,
  ChefHat,
  Flame,
  Coffee,
  Utensils,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  PlusCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const StaffOverview: React.FC = () => {
  const {
    tables,
    orders,
    activeOrdersCount,
    totalSalesToday,
    occupiedTablesCount,
    openWaiterRequestsCount,
    setMainView,
    setSelectedTableId,
    setGuestTab,
    callWaiter,
    setRestaurantSetupModalOpen,
    resetDemoData
  } = useDineOS();

  // Simulated activity feed entries
  const recentActivities = [
    { time: 'Just now', text: 'Table T5 (Aman & Riya) order #ORD-1085 active in Curry station', type: 'order' },
    { time: '2m ago', text: 'Table T6 server Pooja notified for extra napkins & chilled water', type: 'waiter' },
    { time: '6m ago', text: 'Tandoor station completed Garlic Butter Naan batch for Table T5', type: 'kitchen' },
    { time: '11m ago', text: 'Table T4 requested bill (₹1,978) - server Vikram assigned', type: 'bill' },
    { time: '18m ago', text: 'Table T1 served Dum Biryani & Dal Makhani mains', type: 'kitchen' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-3 sm:p-6 text-slate-100">
      {/* Overview Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 rounded-xl text-slate-950 font-black shadow-lg">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-tight">
                Restaurant Executive Command & Real-Time KPIs
              </h2>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                DineOS Engine Online
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Shift manager analytics, station throughput, and floor health
            </p>
          </div>
        </div>

        {/* Demo simulator tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRestaurantSetupModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Hotel Setup & Bank UPI</span>
          </button>
          <button
            onClick={() => callWaiter('T6', 'Water')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5 text-rose-400" />
            <span>Test Waiter Alert</span>
          </button>
          <button
            onClick={resetDemoData}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Real-Time KPI Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Active Occupancy */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Table Occupancy</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {occupiedTablesCount} / {tables.length}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            100% Capacity Seated
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {activeOrdersCount}
          </div>
          <div className="text-[11px] text-purple-300 font-semibold mt-1">
            {orders.filter(o => o.status === 'COOKING').length} orders in kitchen
          </div>
        </div>

        {/* KPI 3: Live Sales Total */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Live Day Sales</span>
            <span className="text-sm font-black text-amber-400">₹</span>
          </div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            ₹{(totalSalesToday / 1000).toFixed(1)}k
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +18.4% vs last week
          </div>
        </div>

        {/* KPI 4: Avg Ticket Prep Time */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Ticket Time</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">
            14.2 <span className="text-sm text-slate-400 font-medium">min</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">
            Target &lt;18 min (Optimal)
          </div>
        </div>

        {/* KPI 5: Waiter Alert Badge */}
        <div className={`p-4 rounded-2xl border shadow-md col-span-2 lg:col-span-1 ${
          openWaiterRequestsCount > 0
            ? 'bg-rose-500/10 border-rose-500/40'
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Floor Alerts</span>
            <Bell className={`w-4 h-4 ${openWaiterRequestsCount > 0 ? 'text-rose-400 animate-bounce' : 'text-slate-400'}`} />
          </div>
          <div className={`text-2xl font-black mt-1 ${openWaiterRequestsCount > 0 ? 'text-rose-400' : 'text-white'}`}>
            {openWaiterRequestsCount} Pending
          </div>
          <div className="text-[11px] text-slate-400 font-semibold mt-1">
            {openWaiterRequestsCount > 0 ? 'Requires attention on floor' : 'Zero service bottlenecks'}
          </div>
        </div>
      </div>

      {/* Middle Row: Station Throughput & Live Floor Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Station Kitchen Throughput */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-black text-white">Station Throughput & KOT Load</h3>
            </div>
            <span className="text-xs text-emerald-400 font-bold">100% Online</span>
          </div>

          <div className="space-y-4">
            {/* Tandoor */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  TANDOOR (Naans, Tikka, Chaap)
                </span>
                <span className="font-mono text-amber-400 font-bold">92% load (24 fulfilled)</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-orange-500 to-rose-500 h-full rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            {/* Curry */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-400" />
                  CURRY (Dal, Paneer Makhani, Biryani)
                </span>
                <span className="font-mono text-amber-400 font-bold">88% load (31 fulfilled)</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            {/* Drinks */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-cyan-400" />
                  DRINKS (Mango Lassi, Chai, Sodas)
                </span>
                <span className="font-mono text-amber-400 font-bold">96% load (18 fulfilled)</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: '96%' }} />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Overall KDS Fulfillment Rate:</span>
            <span className="text-emerald-400 font-black">94.8% on-time</span>
          </div>
        </div>

        {/* Live Table Floor Grid */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span>Live Dining Tables Grid (T1–T6)</span>
            </h3>
            <button
              onClick={() => setMainView('staff_floor')}
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View Full Floor Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {tables.map((table) => {
              const activeOrder = orders.find(o => o.tableId === table.id && o.paymentStatus !== 'PAID');
              const isHelp = table.status === 'HELP';

              return (
                <div
                  key={table.id}
                  onClick={() => {
                    setSelectedTableId(table.id);
                    setMainView('guest');
                    setGuestTab('menu');
                  }}
                  className={`p-3.5 rounded-2xl bg-slate-950 border transition-all cursor-pointer hover:border-amber-500/50 group ${
                    isHelp ? 'border-rose-500 ring-2 ring-rose-500/40 shadow-lg' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {table.id}
                    </span>
                    <span className={`text-[10px] font-black px-1.5 py-0.2 rounded border uppercase ${
                      table.status === 'HELP' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {table.status}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-200 truncate mt-1">
                    {table.guests.join(' & ')}
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between mt-1 pt-1 border-t border-slate-900">
                    <span>Server: {table.serverName}</span>
                    {activeOrder && (
                      <span className="font-mono text-amber-400 font-bold">
                        ₹{activeOrder.totalAmount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity Feed / Audit Log */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-sm font-black text-white">Real-Time Dining Activity Audit Log</h3>
        <div className="space-y-2">
          {recentActivities.map((act, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-950/70 border border-slate-800"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-slate-300">{act.text}</span>
              </div>
              <span className="text-[11px] text-slate-500 whitespace-nowrap pl-2">
                {act.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
