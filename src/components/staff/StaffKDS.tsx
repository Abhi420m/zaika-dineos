import React, { useState, useEffect } from 'react';
import { useDineOS } from '../../context/DineOSContext';
import { KitchenStation, Order, OrderItem } from '../../types';
import {
  ChefHat,
  Flame,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Coffee,
  Utensils,
  Filter,
  Check,
  RefreshCw,
  BellRing
} from 'lucide-react';

export const StaffKDS: React.FC = () => {
  const {
    orders,
    tables,
    sendToKitchen,
    updateItemStationStatus,
    bumpOrder,
    markOrderServed,
    setMainView
  } = useDineOS();

  // Active Station Tab: 'ALL' | 'TANDOOR' | 'CURRY' | 'DRINKS'
  const [selectedStation, setSelectedStation] = useState<KitchenStation | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'kds_stations' | 'incoming_queue'>('kds_stations');

  // Elapsed Time ticker
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter active unpaid or cooking/ready orders
  const activeOrders = orders.filter(o => o.paymentStatus !== 'PAID');
  const incomingNewOrders = activeOrders.filter(o => o.status === 'NEW');
  const cookingOrders = activeOrders.filter(o => o.status === 'COOKING' || o.status === 'READY');

  // Format elapsed time (mm:ss)
  const formatTimer = (startMs?: number) => {
    if (!startMs) return '00:00';
    const totalSecs = Math.max(0, Math.floor((currentTime - startMs) / 1000));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer Color Class
  const getTimerColor = (startMs?: number) => {
    if (!startMs) return 'text-slate-400 bg-slate-800';
    const totalMins = (currentTime - startMs) / 60000;
    if (totalMins > 10) return 'text-rose-400 bg-rose-500/20 border-rose-500/40 animate-pulse';
    if (totalMins > 5) return 'text-amber-400 bg-amber-500/20 border-amber-500/40';
    return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
  };

  const stations: { id: KitchenStation | 'ALL'; label: string; icon: any }[] = [
    { id: 'ALL', label: 'All Stations', icon: ChefHat },
    { id: 'TANDOOR', label: 'Tandoor & Breads', icon: Flame },
    { id: 'CURRY', label: 'Curry & Gravies', icon: Utensils },
    { id: 'DRINKS', label: 'Drinks & Bar', icon: Coffee }
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto p-3 sm:p-6 text-slate-100">
      {/* Top Console Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-rose-600 rounded-xl text-slate-950 font-black shadow-lg">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-tight">
                Kitchen Display System (KDS) & Order Console
              </h2>
              <span className="text-xs bg-slate-800 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-slate-700">
                {activeOrders.length} Active Tickets
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live automated station routing with elapsed prep timers
            </p>
          </div>
        </div>

        {/* View Mode Toggle: Stations vs Incoming Orders */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs font-bold">
            <button
              onClick={() => setViewMode('kds_stations')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'kds_stations'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Station View</span>
            </button>
            <button
              onClick={() => setViewMode('incoming_queue')}
              className={`relative px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'incoming_queue'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Incoming Queue</span>
              {incomingNewOrders.length > 0 && (
                <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white animate-bounce">
                  {incomingNewOrders.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Station Category Filter Tabs */}
      {viewMode === 'kds_stations' && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {stations.map((stn) => {
            const Icon = stn.icon;
            const isSelected = selectedStation === stn.id;
            return (
              <button
                key={stn.id}
                onClick={() => setSelectedStation(stn.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{stn.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* VIEW 1: Incoming Orders Console (Waitstaff firing to kitchen) */}
      {viewMode === 'incoming_queue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold">
              Incoming Table Orders awaiting Kitchen Dispatch ({incomingNewOrders.length})
            </span>
          </div>

          {incomingNewOrders.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-base font-bold text-white">All Incoming Orders Fired</h4>
              <p className="text-xs text-slate-400 mt-1">
                New orders placed on guest table QR codes appear here immediately.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {incomingNewOrders.map((order) => {
                const table = tables.find(t => t.id === order.tableId);
                return (
                  <div
                    key={order.id}
                    className="p-5 rounded-3xl bg-slate-900 border-2 border-amber-500/50 shadow-xl space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-lg border border-amber-500/30">
                              Table {order.tableId}
                            </span>
                            <span className="text-xs text-slate-300 font-bold">
                              {table?.guests.join(' & ')}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                            {order.orderNumber} • {table?.capacity} Seats
                          </span>
                        </div>
                        <span className="text-sm font-mono font-black text-emerald-400">
                          ₹{order.totalAmount}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-2 mt-3 max-h-48 overflow-y-auto pr-1">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex justify-between items-start"
                          >
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{item.name}</span>
                                <span className="text-amber-400 text-[10px]">x{item.quantity}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <span>🌶️ {item.spiceChoice}</span>
                                <span>•</span>
                                <span className="text-slate-300 font-semibold">{item.station}</span>
                              </div>
                              {item.specialInstructions && (
                                <p className="text-[10px] text-amber-300 italic mt-0.5">
                                  "{item.specialInstructions}"
                                </p>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-slate-300">
                              ₹{item.totalPrice}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Send to Kitchen Action */}
                    <button
                      onClick={() => sendToKitchen(order.id)}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:opacity-95 text-white font-black text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send to Kitchen Stations</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: KDS Stations (Live cooking tickets) */}
      {viewMode === 'kds_stations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cookingOrders.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-base font-bold text-white">No Active Orders Cooking</h4>
              <p className="text-xs text-slate-400 mt-1">
                Place an order from the Guest Menu to view live station routing and elapsed timers.
              </p>
            </div>
          ) : (
            cookingOrders.map((order) => {
              const table = tables.find(t => t.id === order.tableId);
              // Filter items by selected station if not ALL
              const stationItems = selectedStation === 'ALL'
                ? order.items
                : order.items.filter(i => i.station === selectedStation);

              if (stationItems.length === 0) return null;

              const isOrderReady = order.status === 'READY';
              const timerColorClass = getTimerColor(order.sentToKitchenAt || order.createdAt);

              return (
                <div
                  key={order.id}
                  className={`p-4 rounded-3xl bg-slate-900 border-2 transition-all shadow-xl flex flex-col justify-between ${
                    isOrderReady
                      ? 'border-emerald-500/60 ring-2 ring-emerald-500/20'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Ticket Header */}
                    <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-white bg-slate-950 px-2.5 py-0.5 rounded-xl border border-slate-700">
                            Table {order.tableId}
                          </span>
                          <span className="text-xs text-slate-300 font-extrabold truncate max-w-[140px]">
                            {table?.guests.join(' & ')}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                          {order.orderNumber} • Server: {table?.serverName}
                        </span>
                      </div>

                      {/* Live Cooking Elapsed Timer */}
                      <div className={`px-2.5 py-1 rounded-xl border font-mono font-black text-xs flex items-center gap-1.5 shadow-inner ${timerColorClass}`}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatTimer(order.sentToKitchenAt || order.createdAt)}</span>
                      </div>
                    </div>

                    {/* Ticket Station Items */}
                    <div className="space-y-2 mt-3">
                      {stationItems.map((item) => {
                        const isItemReady = item.itemStatus === 'Ready' || item.itemStatus === 'Served';
                        return (
                          <div
                            key={item.id}
                            className={`p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between gap-2 ${
                              isItemReady
                                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                                : 'bg-slate-950/80 border-slate-800/80 text-white'
                            }`}
                          >
                            <div className="flex-1 truncate">
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold truncate">{item.name}</span>
                                <span className="text-amber-400 font-black text-[11px]">x{item.quantity}</span>
                                <span className="text-[10px] text-slate-400 px-1 rounded bg-slate-900 border border-slate-800">
                                  {item.portion}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                <span>🌶️ {item.spiceChoice}</span>
                                <span className="text-amber-400/80 font-bold">[{item.station}]</span>
                                {item.assignedGuest && (
                                  <span className="text-blue-300">👤 {item.assignedGuest}</span>
                                )}
                              </div>
                              {item.specialInstructions && (
                                <p className="text-[10px] text-amber-300 italic mt-0.5 truncate">
                                  "{item.specialInstructions}"
                                </p>
                              )}
                            </div>

                            {/* Item Bump Button */}
                            <button
                              onClick={() => {
                                const nextStatus =
                                  item.itemStatus === 'Cooking' || item.itemStatus === 'Pending'
                                    ? 'Ready'
                                    : 'Served';
                                updateItemStationStatus(order.id, item.id, nextStatus);
                              }}
                              className={`p-1.5 rounded-lg border text-xs font-black transition-all flex items-center gap-1 ${
                                item.itemStatus === 'Served'
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                  : item.itemStatus === 'Ready'
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30'
                                  : 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-amber-500 hover:text-slate-950'
                              }`}
                              title={item.itemStatus === 'Ready' ? 'Mark Served' : 'Mark Station Ready'}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span className="text-[10px]">{item.itemStatus}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Ticket Bump Action */}
                  <div className="pt-3 border-t border-slate-800/80 mt-4 flex items-center gap-2">
                    {!isOrderReady ? (
                      <button
                        onClick={() => bumpOrder(order.id)}
                        className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Bump Ticket (All Ready)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => markOrderServed(order.id)}
                        className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Order Served to Table {order.tableId}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
