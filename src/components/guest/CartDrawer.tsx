import React from 'react';
import { useDineOS } from '../../context/DineOSContext';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Utensils, Flame, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartDrawerOpen,
    setCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    selectedTableId,
    activeTable
  } = useDineOS();

  if (!cartDrawerOpen) return null;

  const subtotal = cart.reduce((sum, i) => sum + i.totalPrice, 0);
  const taxGst = Math.round(subtotal * 0.05);
  const total = subtotal + taxGst;

  const handlePlaceOrder = () => {
    placeOrder(selectedTableId);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setCartDrawerOpen(false);
      }}
    >
      <div
        className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-200"
        role="region"
        aria-label="Order Cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                Order Cart • Table {selectedTableId}
              </h3>
              <p className="text-xs text-slate-400">
                {cart.length} item{cart.length !== 1 ? 's' : ''} for {activeTable.guests.join(' & ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCartDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 p-4 overflow-y-auto overscroll-contain space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500 mb-3">
                <Utensils className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">Your Cart is Empty</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Explore our signature curries, tandoori breads, and drinks to add items to your table order.
              </p>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-400 border border-slate-700"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80 hover:border-slate-600 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-white">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300">
                          {item.portion}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>🌶️ {item.spiceChoice}</span>
                        <span>•</span>
                        <span className="text-blue-300 font-medium">👤 For {item.assignedGuest}</span>
                      </div>
                    </div>
                    <div className="text-sm font-black text-white whitespace-nowrap">
                      ₹{item.totalPrice}
                    </div>
                  </div>

                  {/* Addons & Instructions */}
                  {(item.addons.length > 0 || item.specialInstructions) && (
                    <div className="text-[11px] bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-slate-300 space-y-1">
                      {item.addons.map(a => (
                        <div key={a.name} className="text-amber-300 font-medium flex justify-between">
                          <span>+ {a.name}</span>
                          <span>₹{a.price}</span>
                        </div>
                      ))}
                      {item.specialInstructions && (
                        <div className="text-slate-400 italic">
                          "{item.specialInstructions}"
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quantity & Delete Controls */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      ₹{item.unitPrice + item.addons.reduce((s, a) => s + a.price, 0)} each
                    </span>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700 p-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="p-1 hover:bg-slate-800 rounded text-slate-300"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="p-1 hover:bg-slate-800 rounded text-slate-300"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-[11px] text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Clear Cart
                </button>
              </div>
            </>
          )}
        </div>

        {/* Bottom Bill Preview & Place Order Button */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/90 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Taxes (GST 5%)</span>
                <span>₹{taxGst}</span>
              </div>
              <div className="flex justify-between text-slate-200 font-extrabold text-sm pt-1 border-t border-slate-800">
                <span>Total to Fire</span>
                <span className="text-amber-400 text-base">₹{total}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white font-black text-sm shadow-xl shadow-orange-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Place Order & Send to Kitchen</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] text-slate-500 text-center">
              Fires directly to Tandoor, Curry & Drinks stations in real time
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
