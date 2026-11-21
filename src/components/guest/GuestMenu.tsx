import React, { useState, useMemo } from 'react';
import { useDineOS } from '../../context/DineOSContext';
import { MenuItem, SpiceLevel } from '../../types';
import { Search, Flame, Sparkles, Plus, ShoppingBag, Filter, ShieldAlert, Check, PlusCircle } from 'lucide-react';

export const GuestMenu: React.FC = () => {
  const {
    menu,
    setSelectedDish,
    cart,
    setCartDrawerOpen,
    activeTable,
    selectedTableId,
    setQrModalOpen,
    setAddDishModalOpen
  } = useDineOS();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [spiceFilter, setSpiceFilter] = useState<string>('All');

  const categories = ['All', 'Starters', 'Mains', 'Breads', 'Drinks', 'Desserts'];

  const filteredMenu = useMemo(() => {
    return menu.filter((dish) => {
      // Search
      const matchesSearch =
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dish.hindiName && dish.hindiName.includes(searchQuery));

      // Category
      const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;

      // Spice
      const matchesSpice = spiceFilter === 'All' || dish.spiceDefault === spiceFilter;

      return matchesSearch && matchesCategory && matchesSpice;
    });
  }, [menu, searchQuery, selectedCategory, spiceFilter]);

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="space-y-4 pb-28 max-w-xl mx-auto">
      {/* Table Welcome Greeting Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 shadow-md flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
              TABLE {selectedTableId}
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Welcome, <strong className="text-white">{activeTable.guests.join(' & ')}</strong>!
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-white mt-1 tracking-tight">
            Crafted North Indian Feast
          </h2>
          <p className="text-[11px] text-slate-400">
            Slow-cooked gravies, hand-rolled naans & clay oven tandoors
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAddDishModalOpen(true)}
            className="text-[11px] font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1.5 rounded-xl transition-all whitespace-nowrap shadow-sm flex items-center gap-1"
            title="Add a new dish to the menu"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Add Dish</span>
          </button>
          <button
            onClick={() => setQrModalOpen(true)}
            className="text-[11px] font-bold text-amber-300 bg-slate-900/80 hover:bg-slate-800 border border-amber-500/30 px-2.5 py-1.5 rounded-xl transition-all whitespace-nowrap shadow-sm"
          >
            Change Table
          </button>
        </div>
      </div>

      {/* Live Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search dishes (e.g. Paneer Makhani, Dal, Naan, Lassi)..."
          className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400 shadow-md shadow-orange-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Row: Spice Level */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] font-semibold">Spice Preference:</span>
        </div>
        <div className="flex items-center gap-1">
          {['All', 'Mild', 'Medium', 'Spicy'].map((spice) => (
            <button
              key={spice}
              onClick={() => setSpiceFilter(spice)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all border ${
                spiceFilter === spice
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {spice === 'Mild' ? '🌶️ Mild' : spice === 'Medium' ? '🌶️🌶️ Med' : spice === 'Spicy' ? '🌶️🌶️🌶️ Hot' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Cards List */}
      <div className="space-y-3">
        {filteredMenu.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-slate-900/50 rounded-3xl border border-slate-800">
            <p className="text-sm font-bold text-slate-300">No dishes match your search.</p>
            <p className="text-xs text-slate-500 mt-1">Try another category or keyword.</p>
          </div>
        ) : (
          filteredMenu.map((dish) => (
            <div
              key={dish.id}
              onClick={() => setSelectedDish(dish)}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-amber-500/40 transition-all cursor-pointer shadow-md hover:shadow-lg hover:shadow-amber-500/5 group flex gap-3.5 relative overflow-hidden"
            >
              {/* Dish Photo */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-950 overflow-hidden flex-shrink-0">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-1.5 left-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/90 border border-white flex items-center justify-center shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                </div>
                {dish.popularTag && (
                  <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] font-black uppercase text-center bg-amber-500/95 text-slate-950 py-0.5 rounded shadow">
                    {dish.popularTag}
                  </span>
                )}
              </div>

              {/* Dish Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-amber-300 transition-colors">
                        {dish.name}
                      </h3>
                      {dish.hindiName && (
                        <p className="text-[10px] text-amber-400/80 font-serif">
                          {dish.hindiName}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 whitespace-nowrap">
                      {dish.kitchenStation}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {dish.description}
                  </p>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                    <span className="text-[10px] font-bold text-rose-300 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20">
                      {dish.spiceDefault === 'Mild' ? '🌶️ Mild' : dish.spiceDefault === 'Medium' ? '🌶️🌶️ Medium' : '🌶️🌶️🌶️ Spicy'}
                    </span>
                    {dish.allergens.slice(0, 2).map((a) => (
                      <span key={a} className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.2 rounded">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & Add Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-1">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Half </span>
                    <span className="text-xs font-black text-white">₹{dish.priceHalf}</span>
                    <span className="text-slate-500 mx-1">/</span>
                    <span className="text-xs text-slate-400 font-medium">Full </span>
                    <span className="text-sm font-black text-amber-400">₹{dish.priceFull}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDish(dish);
                    }}
                    className="py-1 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-md flex items-center gap-1 transition-all group-hover:scale-105"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Customize</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Cart Bar (when cart has items) */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 p-3 z-30 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white font-extrabold text-sm shadow-2xl shadow-orange-500/30 flex items-center justify-between hover:scale-[1.02] transition-transform animate-in slide-in-from-bottom-4 duration-200"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-black/25 flex items-center justify-center font-black text-xs">
                  {cartTotalItems}
                </div>
                <div className="text-left">
                  <div className="text-xs font-black">View Table Order</div>
                  <div className="text-[10px] text-amber-100 font-medium">
                    {activeTable.guests.join(' & ')} • Table {selectedTableId}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-black bg-black/20 px-2 py-1 rounded-lg">
                  ₹{cartTotalPrice}
                </span>
                <span className="text-xs font-bold underline decoration-amber-200">
                  Review & Fire →
                </span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
