import React, { useState, useEffect } from 'react';
import { useDineOS } from '../../context/DineOSContext';
import { TableInfo, TableStatus, TableId } from '../../types';
import {
  MapPin,
  Bell,
  Users,
  CheckCircle2,
  Clock,
  Flame,
  Receipt,
  Utensils,
  AlertTriangle,
  Sparkles,
  X,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const StaffFloorMap: React.FC = () => {
  const {
    tables,
    orders,
    acknowledgeWaiter,
    resolveWaiter,
    callWaiter,
    setSelectedTableId,
    setMainView,
    setGuestTab
  } = useDineOS();

  // Elapsed ticker
  const [now, setNow] = useState<number>(Date.now());
  const [selectedInspectTable, setSelectedInspectTable] = useState<TableInfo | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openWaiterAlerts = tables.filter(t => t.waiterRequest.active);

  const formatElapsed = (startMs?: number) => {
    if (!startMs) return '0s';
    const secs = Math.floor((now - startMs) / 1000);
    if (secs < 60) return `${secs}s ago`;
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}m ${remSecs}s ago`;
  };

  const statusConfig: Record<TableStatus, { label: string; badge: string; ring: string }> = {
    VACANT: {
      label: 'VACANT',
      badge: 'bg-slate-800 text-slate-400 border-slate-700',
      ring: 'border-slate-800'
    },
    ORDERING: {
      label: 'ORDERING',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      ring: 'border-blue-500/40 hover:border-blue-400'
    },
    COOKING: {
      label: 'COOKING',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      ring: 'border-amber-500/40 hover:border-amber-400'
    },
    EATING: {
      label: 'EATING',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      ring: 'border-emerald-500/40 hover:border-emerald-400'
    },
    BILL: {
      label: 'BILL REQ',
      badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      ring: 'border-purple-500/40 hover:border-purple-400'
    },
    HELP: {
      label: 'HELP REQ',
      badge: 'bg-rose-500 text-white font-black border-rose-400 animate-pulse',
      ring: 'border-rose-500 ring-4 ring-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto p-3 sm:p-6 text-slate-100">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-500 rounded-xl text-slate-950 font-black shadow-lg">
            <MapPin className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-tight">
                Live Restaurant Floor Map & Service Alerts
              </h2>
              <span className="text-xs bg-slate-800 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-slate-700">
                6/6 Tables Monitored
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-time table status with pulsing waiter alerts and response dispatch
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] font-bold">
          <span className="flex items-center gap-1 text-slate-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-slate-400" /> Vacant
          </span>
          <span className="flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/30">
            <span className="w-2 h-2 rounded-full bg-blue-400" /> Ordering
          </span>
          <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Cooking
          </span>
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Eating
          </span>
          <span className="flex items-center gap-1 text-purple-400 bg-purple-500/10 px-2 py-1 rounded-lg border border-purple-500/30">
            <span className="w-2 h-2 rounded-full bg-purple-400" /> Bill
          </span>
          <span className="flex items-center gap-1 text-rose-400 bg-rose-500/20 px-2 py-1 rounded-lg border border-rose-500/40 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-400" /> Help Alert
          </span>
        </div>
      </div>

      {/* Critical Waiter Assistance Notification Banner (if any table has called waiter) */}
      {openWaiterAlerts.length > 0 && (
        <div className="p-4 rounded-3xl bg-rose-950/40 border-2 border-rose-500 shadow-2xl space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-rose-500 text-white rounded-xl shadow-lg animate-bounce">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  Active Guest Assistance Request ({openWaiterAlerts.length})
                </h4>
                <p className="text-xs text-rose-300">
                  Floor servers should acknowledge and respond immediately
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {openWaiterAlerts.map((table) => (
              <div
                key={table.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-rose-500/60 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-white bg-rose-600 px-2.5 py-0.5 rounded-lg">
                        Table {table.id}
                      </span>
                      <span className="text-xs font-bold text-slate-200">
                        {table.guests.join(' & ')}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-black text-rose-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatElapsed(table.waiterRequest.requestedAt)}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 bg-slate-950 p-2 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Request:</span>
                      <span className="font-bold text-amber-300">
                        {table.waiterRequest.type || 'Assistance'}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Assigned Server:</span>
                      <span className="text-white font-medium">{table.serverName}</span>
                    </div>
                    {table.notes && (
                      <div className="text-[10px] text-slate-400 italic">
                        "{table.notes}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800">
                  {!table.waiterRequest.acknowledged ? (
                    <button
                      onClick={() => acknowledgeWaiter(table.id)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all"
                    >
                      Acknowledge Server
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged
                    </span>
                  )}

                  <button
                    onClick={() => resolveWaiter(table.id)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolve / Served</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Floor Layout Architectural Grid */}
      <div className="p-4 sm:p-6 bg-slate-900/60 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="text-center mb-6">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
            DINING ROOM FLOOR PLAN • ARCHITECTURAL VIEW
          </span>
        </div>

        {/* Floor Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Section 1: Window Booths (T1 & T5) */}
          <div className="space-y-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-amber-300">
                🪟 Window Boulevard Booths
              </span>
              <span>2 Tables</span>
            </div>

            <div className="space-y-4">
              {[tables[0], tables[4]].map((table) => {
                if (!table) return null;
                const statusStyle = statusConfig[table.status];
                const activeOrder = orders.find(o => o.tableId === table.id && o.paymentStatus !== 'PAID');
                const isHelp = table.status === 'HELP';

                return (
                  <div
                    key={table.id}
                    onClick={() => setSelectedInspectTable(table)}
                    className={`p-4 rounded-2xl bg-slate-900 border-2 transition-all cursor-pointer relative ${statusStyle.ring} ${isHelp ? 'pulse-help' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base text-white bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-700">
                            {table.id}
                          </span>
                          <span className="text-xs font-extrabold text-white">
                            {table.name.split('-')[0]}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          <strong className="text-slate-200">{table.guests.join(' & ')}</strong>
                        </p>
                      </div>

                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${statusStyle.badge}`}>
                        {table.status}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Server: <strong className="text-slate-200">{table.serverName}</strong></span>
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

          {/* Section 2: Main Dining Center (T2 & T3) */}
          <div className="space-y-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-blue-300">
                🏛️ Main Royal Dining Hall
              </span>
              <span>2 Tables</span>
            </div>

            <div className="space-y-4">
              {[tables[1], tables[2]].map((table) => {
                if (!table) return null;
                const statusStyle = statusConfig[table.status];
                const activeOrder = orders.find(o => o.tableId === table.id && o.paymentStatus !== 'PAID');
                const isHelp = table.status === 'HELP';

                return (
                  <div
                    key={table.id}
                    onClick={() => setSelectedInspectTable(table)}
                    className={`p-4 rounded-2xl bg-slate-900 border-2 transition-all cursor-pointer relative ${statusStyle.ring} ${isHelp ? 'pulse-help' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base text-white bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-700">
                            {table.id}
                          </span>
                          <span className="text-xs font-extrabold text-white">
                            {table.name.split('-')[0]}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          <strong className="text-slate-200">{table.guests.join(' & ')}</strong>
                        </p>
                      </div>

                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${statusStyle.badge}`}>
                        {table.status}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Server: <strong className="text-slate-200">{table.serverName}</strong></span>
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

          {/* Section 3: Patio & Chef Counter (T4 & T6) */}
          <div className="space-y-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-emerald-300">
                🌿 Patio Garden & Chef Counter
              </span>
              <span>2 Tables</span>
            </div>

            <div className="space-y-4">
              {[tables[3], tables[5]].map((table) => {
                if (!table) return null;
                const statusStyle = statusConfig[table.status];
                const activeOrder = orders.find(o => o.tableId === table.id && o.paymentStatus !== 'PAID');
                const isHelp = table.status === 'HELP';

                return (
                  <div
                    key={table.id}
                    onClick={() => setSelectedInspectTable(table)}
                    className={`p-4 rounded-2xl bg-slate-900 border-2 transition-all cursor-pointer relative ${statusStyle.ring} ${isHelp ? 'pulse-help' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base text-white bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-700">
                            {table.id}
                          </span>
                          <span className="text-xs font-extrabold text-white">
                            {table.name.split('-')[0]}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          <strong className="text-slate-200">{table.guests.join(' & ')}</strong>
                        </p>
                      </div>

                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${statusStyle.badge}`}>
                        {table.status}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Server: <strong className="text-slate-200">{table.serverName}</strong></span>
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
      </div>

      {/* Drill-Down Table Inspector Modal */}
      {selectedInspectTable && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedInspectTable(null);
          }}
        >
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-5 text-slate-100 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg text-white bg-slate-950 px-3 py-1 rounded-xl border border-slate-700">
                    Table {selectedInspectTable.id}
                  </span>
                  <span className="text-sm font-extrabold text-slate-200">
                    {selectedInspectTable.name}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Section: {selectedInspectTable.section} • Capacity: {selectedInspectTable.capacity} Seats
                </p>
              </div>
              <button
                onClick={() => setSelectedInspectTable(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Guests & Server */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Guests:</span>
                <span className="font-bold text-white">{selectedInspectTable.guests.join(', ')}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Assigned Server:</span>
                <span className="font-bold text-amber-300">{selectedInspectTable.serverName}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setSelectedTableId(selectedInspectTable.id);
                  setMainView('guest');
                  setGuestTab('menu');
                  setSelectedInspectTable(null);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Switch Guest View to Table {selectedInspectTable.id}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  callWaiter(selectedInspectTable.id, 'Water');
                  setSelectedInspectTable(null);
                }}
                className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5 text-rose-400" />
                <span>Simulate Call Waiter for Table {selectedInspectTable.id}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
