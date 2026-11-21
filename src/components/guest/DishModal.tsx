import React, { useState, useEffect } from 'react';
import { useDineOS } from '../../context/DineOSContext';
import { PortionSize, SpiceLevel, OrderItem } from '../../types';
import { X, Flame, ShieldAlert, Plus, Minus, Check, Users, Sparkles } from 'lucide-react';

export const DishModal: React.FC = () => {
  const {
    selectedDish,
    setSelectedDish,
    activeTable,
    addToCart,
    placeOrder,
    setCartDrawerOpen
  } = useDineOS();

  if (!selectedDish) return null;

  const [portion, setPortion] = useState<PortionSize>('Full');
  const [spice, setSpice] = useState<SpiceLevel>(selectedDish.spiceDefault || 'Medium');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedAddons, setSelectedAddons] = useState<{ name: string; price: number }[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [assignedGuest, setAssignedGuest] = useState<string>(activeTable.guests[0] || 'Shared');

  // Reset state when dish changes
  useEffect(() => {
    if (selectedDish) {
      setPortion('Full');
      setSpice(selectedDish.spiceDefault || 'Medium');
      setQuantity(1);
      setSelectedAddons([]);
      setSpecialInstructions('');
      setAssignedGuest(activeTable.guests[0] || 'Shared');
    }
  }, [selectedDish, activeTable]);

  const basePrice = portion === 'Half' ? selectedDish.priceHalf : selectedDish.priceFull;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = basePrice + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleToggleAddon = (addon: { name: string; price: number }) => {
    setSelectedAddons(prev => {
      const exists = prev.some(a => a.name === addon.name);
      if (exists) {
        return prev.filter(a => a.name !== addon.name);
      }
      return [...prev, addon];
    });
  };

  const handleAddToCart = () => {
    const item: OrderItem = {
      id: `ord-item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      menuItemId: selectedDish.id,
      name: selectedDish.name,
      portion,
      unitPrice: basePrice,
      quantity,
      spiceChoice: spice,
      addons: selectedAddons,
      specialInstructions: specialInstructions.trim() || undefined,
      assignedGuest,
      station: selectedDish.kitchenStation,
      itemStatus: 'Pending',
      totalPrice
    };

    addToCart(item);
    setSelectedDish(null);
  };

  const handleQuickPlaceOrder = () => {
    const item: OrderItem = {
      id: `ord-item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      menuItemId: selectedDish.id,
      name: selectedDish.name,
      portion,
      unitPrice: basePrice,
      quantity,
      spiceChoice: spice,
      addons: selectedAddons,
      specialInstructions: specialInstructions.trim() || undefined,
      assignedGuest,
      station: selectedDish.kitchenStation,
      itemStatus: 'Pending',
      totalPrice
    };

    addToCart(item);
    setSelectedDish(null);
    setCartDrawerOpen(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedDish(null);
      }}
    >
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl text-slate-100 overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200"
        role="region"
        aria-label={selectedDish.name}
      >
        {/* Top Image Banner */}
        <div className="relative h-48 sm:h-56 w-full bg-slate-950 flex-shrink-0 overflow-hidden">
          <img
            src={selectedDish.image}
            alt={selectedDish.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setSelectedDish(null)}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md transition-all shadow-lg"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badges on image */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white backdrop-blur-sm flex items-center gap-1 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              100% Pure Veg
            </span>
            {selectedDish.popularTag && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950 backdrop-blur-sm flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3 fill-slate-950" />
                {selectedDish.popularTag}
              </span>
            )}
          </div>

          {/* Dish Name & Station */}
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {selectedDish.name}
                </h3>
                {selectedDish.hindiName && (
                  <p className="text-xs text-amber-400 font-serif font-medium">
                    {selectedDish.hindiName}
                  </p>
                )}
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded bg-slate-800/80 border border-slate-700 text-amber-300 uppercase tracking-wider">
                {selectedDish.kitchenStation} STATION
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto overscroll-contain">
          {/* Description & Allergens */}
          <div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedDish.description}
            </p>

            {selectedDish.allergens.length > 0 && (
              <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Allergens:
                </span>
                {selectedDish.allergens.map(a => (
                  <span
                    key={a}
                    className="text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md"
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>

          <hr className="border-slate-800" />

          {/* 1. Portion Size Toggle with Dynamic Pricing */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Portion Size
              </label>
              <span className="text-xs text-amber-400 font-medium">
                {portion === 'Half' ? 'Half Portion (1 Guest)' : 'Full Portion (2-3 Guests)'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPortion('Half')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  portion === 'Half'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold ring-1 ring-amber-500/40 shadow-sm'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="text-xs font-bold">Half Portion</div>
                <div className="text-sm font-extrabold text-white mt-0.5">₹{selectedDish.priceHalf}</div>
              </button>

              <button
                type="button"
                onClick={() => setPortion('Full')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  portion === 'Full'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold ring-1 ring-amber-500/40 shadow-sm'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-center gap-1">
                  Full Portion
                  <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500 text-slate-950 font-black">Popular</span>
                </div>
                <div className="text-sm font-extrabold text-white mt-0.5">₹{selectedDish.priceFull}</div>
              </button>
            </div>
          </div>

          {/* 2. Spice Level Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                Spice Level
              </label>
              <span className="text-xs text-slate-400">
                {spice === 'Mild' ? 'Gentle & aromatic' : spice === 'Medium' ? 'Balanced Dhaba heat' : 'Fiery traditional heat'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['Mild', 'Medium', 'Spicy'] as SpiceLevel[]).map((level) => {
                const isSelected = spice === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSpice(level)}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? level === 'Mild'
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40'
                          : level === 'Medium'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300 ring-1 ring-amber-500/40'
                          : 'bg-rose-500/10 border-rose-500 text-rose-300 ring-1 ring-rose-500/40'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{level === 'Mild' ? '🌶️ Mild' : level === 'Medium' ? '🌶️🌶️ Medium' : '🌶️🌶️🌶️ Spicy'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Combo / Deal Add-On */}
          {selectedDish.dealCombo && (
            <div>
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-2">
                Special Combo Pairings
              </label>
              <div
                onClick={() => handleToggleAddon({ name: selectedDish.dealCombo!.name, price: selectedDish.dealCombo!.price })}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedAddons.some(a => a.name === selectedDish.dealCombo!.name)
                    ? 'bg-amber-500/15 border-amber-500 text-white'
                    : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    selectedAddons.some(a => a.name === selectedDish.dealCombo!.name)
                      ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold'
                      : 'border-slate-600 bg-slate-900'
                  }`}>
                    {selectedAddons.some(a => a.name === selectedDish.dealCombo!.name) && (
                      <Check className="w-3 h-3 stroke-[3]" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-300">
                      {selectedDish.dealCombo.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {selectedDish.dealCombo.description}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-extrabold text-amber-400 whitespace-nowrap pl-2">
                  + ₹{selectedDish.dealCombo.price}
                </div>
              </div>
            </div>
          )}

          {/* 4. Guest Tagging (Who is this for?) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                Assign To Guest (For Split Bill)
              </label>
              <span className="text-[11px] text-slate-400">Powers itemized bill split</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[...activeTable.guests, 'Shared'].map(guest => (
                <button
                  key={guest}
                  type="button"
                  onClick={() => setAssignedGuest(guest)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    assignedGuest === guest
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300 ring-1 ring-blue-500/30'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {guest === 'Shared' ? '🤝 Shared by Table' : `👤 ${guest}`}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Special Instructions */}
          <div>
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-1.5">
              Special Kitchen Notes
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Less oil, extra coriander, crisp edges..."
              maxLength={80}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-slate-800 rounded-xl border border-slate-700 p-1">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-extrabold text-white">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 max-w-[200px] py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black shadow-lg shadow-orange-500/20 hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Add to Order</span>
              <span className="bg-black/20 px-1.5 py-0.5 rounded text-[11px]">
                ₹{totalPrice}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
