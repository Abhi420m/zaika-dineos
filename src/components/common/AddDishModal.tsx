import React, { useState } from 'react';
import { useDineOS } from '../../context/DineOSContext';
import { MenuItem, KitchenStation, SpiceLevel } from '../../types';
import { PRESET_DISH_PHOTOS } from '../../data/dishPhotos';
import { PlusCircle, X, Sparkles, Flame, Utensils, Check, Upload, Image as ImageIcon, Camera } from 'lucide-react';

export const AddDishModal: React.FC = () => {
  const { addDishModalOpen, setAddDishModalOpen, addMenuItem } = useDineOS();

  const [name, setName] = useState('');
  const [hindiName, setHindiName] = useState('');
  const [category, setCategory] = useState<MenuItem['category']>('Mains');
  const [kitchenStation, setKitchenStation] = useState<KitchenStation>('CURRY');
  const [priceHalf, setPriceHalf] = useState<number>(220);
  const [priceFull, setPriceFull] = useState<number>(360);
  const [description, setDescription] = useState('');
  const [spiceDefault, setSpiceDefault] = useState<SpiceLevel>('Medium');
  const [allergens, setAllergens] = useState('Dairy');
  const [imageUrl, setImageUrl] = useState(PRESET_DISH_PHOTOS[0].url);
  const [popularTag, setPopularTag] = useState<'Chef Special' | 'Bestseller' | 'Must Try' | 'Signature' | ''>('Chef Special');
  const [photoTab, setPhotoTab] = useState<'presets' | 'upload' | 'url'>('presets');

  if (!addDishModalOpen) return null;

  // Handle Device File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newDish: MenuItem = {
      id: `dish-${Date.now()}`,
      name: name.trim(),
      hindiName: hindiName.trim() || undefined,
      category,
      kitchenStation,
      priceHalf: Number(priceHalf) || 150,
      priceFull: Number(priceFull) || 280,
      description: description.trim() || 'Freshly prepared specialty cooked with aromatic herbs and house-ground spices.',
      spiceDefault,
      allergens: allergens ? allergens.split(',').map((s) => s.trim()).filter(Boolean) : [],
      isVeg: true,
      image: imageUrl.trim() || PRESET_DISH_PHOTOS[0].url,
      popularTag: popularTag || undefined
    };

    addMenuItem(newDish);
    setAddDishModalOpen(false);

    // Reset
    setName('');
    setHindiName('');
    setDescription('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setAddDishModalOpen(false);
      }}
    >
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl text-slate-100 overflow-hidden max-h-[94vh] flex flex-col"
        role="region"
        aria-label="Add New Dish with Photo"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-xl text-slate-950 font-black shadow-md">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Add New Dish with Photo</h3>
              <p className="text-xs text-slate-400">Pick matching photo from presets or upload from device</p>
            </div>
          </div>
          <button
            onClick={() => setAddDishModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Dish Photo Selector (Core Feature for User Request) */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Dish Photo (डिश की फोटो चुनें या अपलोड करें)</span>
              </label>

              {/* Photo Mode Switcher */}
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg text-[11px] font-bold border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPhotoTab('presets')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    photoTab === 'presets' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Dish Presets
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoTab('upload')}
                  className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 ${
                    photoTab === 'upload' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoTab('url')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    photoTab === 'url' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  URL
                </button>
              </div>
            </div>

            {/* Photo Preview & Current Selection */}
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-900 border-2 border-amber-500/50 flex-shrink-0 shadow-md">
                <img
                  src={imageUrl}
                  alt="Selected Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-center font-bold text-white py-0.5">
                  Preview
                </div>
              </div>

              <div className="flex-1 text-xs text-slate-400">
                <p className="text-white font-bold">{name || 'Your Dish Name'}</p>
                <p className="text-[11px] text-amber-300">
                  {category} • {kitchenStation} Station
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Selected photo will be displayed in the guest menu, dish drawer, and order tickets.
                </p>
              </div>
            </div>

            {/* Sub-view 1: Preset Photos Thumbnails Grid */}
            {photoTab === 'presets' && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Tap to pick matching Indian dish photo:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
                  {PRESET_DISH_PHOTOS.map((preset) => {
                    const isSelected = imageUrl === preset.url;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => setImageUrl(preset.url)}
                        className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-video group ${
                          isSelected ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                          <span className="text-[9px] font-bold text-white leading-tight truncate">
                            {preset.name.split('/')[0]}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-view 2: Upload from Device */}
            {photoTab === 'upload' && (
              <div className="pt-1">
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl bg-slate-900/60 cursor-pointer transition-all">
                  <Upload className="w-6 h-6 text-amber-400 mb-1.5" />
                  <span className="text-xs font-bold text-slate-200">
                    Click to select photo from Phone or Computer
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    Supports JPG, PNG, WEBP (stored instantly in browser)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Sub-view 3: Custom URL */}
            {photoTab === 'url' && (
              <div className="pt-1">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste direct image URL (https://...)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            )}
          </div>

          {/* Dish Name & Hindi Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Dish Name (English) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Shahi Paneer Butter Masala"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Hindi / Local Name
              </label>
              <input
                type="text"
                value={hindiName}
                onChange={(e) => setHindiName(e.target.value)}
                placeholder="e.g. शाही पनीर बटर मसाला"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Category & Kitchen Station */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Starters">Starters</option>
                <option value="Mains">Mains</option>
                <option value="Breads">Breads</option>
                <option value="Drinks">Drinks</option>
                <option value="Desserts">Desserts</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Kitchen Station (Routing)
              </label>
              <select
                value={kitchenStation}
                onChange={(e) => setKitchenStation(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="CURRY">CURRY (Gravies, Rice, Desserts)</option>
                <option value="TANDOOR">TANDOOR (Naan, Tikka, Chaap)</option>
                <option value="DRINKS">DRINKS (Lassi, Chai, Mocktails)</option>
              </select>
            </div>
          </div>

          {/* Half & Full Prices */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Half Price (₹)
              </label>
              <input
                type="number"
                min="10"
                value={priceHalf}
                onChange={(e) => setPriceHalf(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Full Price (₹)
              </label>
              <input
                type="number"
                min="10"
                value={priceFull}
                onChange={(e) => setPriceFull(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono font-bold text-amber-400"
              />
            </div>
          </div>

          {/* Spice Level & Tag */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Default Spice Level
              </label>
              <select
                value={spiceDefault}
                onChange={(e) => setSpiceDefault(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Mild">🌶️ Mild</option>
                <option value="Medium">🌶️🌶️ Medium</option>
                <option value="Spicy">🌶️🌶️🌶️ Spicy</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Badge / Tag
              </label>
              <select
                value={popularTag}
                onChange={(e) => setPopularTag(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">None</option>
                <option value="Chef Special">Chef Special</option>
                <option value="Bestseller">Bestseller</option>
                <option value="Must Try">Must Try</option>
                <option value="Signature">Signature</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Description & Ingredients
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Fresh cottage cheese simmered with bell peppers and roasted cumin in satin gravy..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAddDishModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg hover:opacity-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Dish with Photo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
