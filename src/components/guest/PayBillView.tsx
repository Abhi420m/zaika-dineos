import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useDineOS } from '../../context/DineOSContext';
import { Order } from '../../types';
import { sounds } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Receipt,
  Users,
  CreditCard,
  DollarSign,
  Smartphone,
  CheckCircle2,
  Mail,
  Printer,
  Star,
  Sparkles,
  QrCode,
  ShieldCheck,
  Percent,
  ArrowRight,
  Heart
} from 'lucide-react';

export const PayBillView: React.FC = () => {
  const {
    selectedTableId,
    activeTable,
    getCurrentOrderForTable,
    updateTip,
    confirmPayment,
    submitReview,
    setGuestTab,
    restaurantProfile
  } = useDineOS();

  const currentOrder = getCurrentOrderForTable(selectedTableId);
  const [billUpiQr, setBillUpiQr] = useState<string>('');

  // Bill Split Mode: 'single' | 'even' | 'by_guest'
  const [splitMode, setSplitMode] = useState<'single' | 'even' | 'by_guest'>('by_guest');
  const [splitCount, setSplitCount] = useState<number>(activeTable.guests.length || 2);

  // Selected Tip Percentage
  const [selectedTip, setSelectedTip] = useState<number>(currentOrder?.tipPercentage ?? 5);

  // Selected Payment Method
  const [paymentMethod, setPaymentMethod] = useState<NonNullable<Order['paymentMethod']>>('Google Pay');

  // Receipt Modal & Email confirmation
  const [showReceipt, setShowReceipt] = useState<boolean>(currentOrder?.paymentStatus === 'PAID');
  const [emailInput, setEmailInput] = useState<string>('aman.sharma@example.com');
  const [emailSent, setEmailSent] = useState<boolean>(false);

  // 1-Tap Review State
  const [rating, setRating] = useState<number>(5);
  const [reviewTags, setReviewTags] = useState<string[]>(['Delicious Gravy', 'Super Fast Service']);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  if (!currentOrder) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl max-w-xl mx-auto text-slate-400">
        <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">No Active Bill for Table {selectedTableId}</h3>
        <p className="text-xs text-slate-400 mt-1">
          Place items from the digital menu first to generate an itemized bill.
        </p>
        <button
          onClick={() => setGuestTab('menu')}
          className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Open Digital Menu
        </button>
      </div>
    );
  }

  const subtotal = currentOrder.subtotal;
  const taxGst = currentOrder.taxGst;
  const tipAmount = Math.round(subtotal * (selectedTip / 100));
  const finalTotal = subtotal + taxGst + tipAmount;

  // Handle Tip Change
  const handleSelectTip = (percentage: number) => {
    setSelectedTip(percentage);
    updateTip(currentOrder.id, percentage);
  };

  // Dynamic Bill UPI QR Generator (Real NPCI Standard)
  useEffect(() => {
    if (!currentOrder || !restaurantProfile.upiId) return;
    const upiUri = `upi://pay?pa=${restaurantProfile.upiId}&pn=${encodeURIComponent(restaurantProfile.merchantName || restaurantProfile.name)}&am=${finalTotal.toFixed(2)}&cu=INR&tn=Table_${selectedTableId}_Bill_${currentOrder.orderNumber.replace('#', '')}`;
    QRCode.toDataURL(upiUri, {
      width: 220,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' }
    })
      .then(url => setBillUpiQr(url))
      .catch(() => {});
  }, [currentOrder, restaurantProfile.upiId, restaurantProfile.merchantName, restaurantProfile.name, finalTotal, selectedTableId]);

  // Handle Payment Submit
  const handlePayNow = () => {
    confirmPayment(currentOrder.id, paymentMethod);
    setShowReceipt(true);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }
  };

  // Handle Review Submit
  const handleReviewSubmit = () => {
    submitReview(currentOrder.id, rating, reviewTags, reviewComment);
    setReviewSubmitted(true);
  };

  const handleSendEmailReceipt = () => {
    if (!emailInput) return;
    sounds.playSuccess();
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const availableTags = [
    'Delicious Gravy',
    'Super Fast Service',
    'Courteous Staff',
    'Perfect Spice Level',
    'Crisp Tandoori Naan',
    'Cozy Ambiance'
  ];

  const toggleTag = (tag: string) => {
    setReviewTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-4 pb-28 max-w-xl mx-auto">
      {/* 1. Itemized Bill Summary Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        {/* Bill Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/30 text-purple-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">Itemized Dine-In Bill</h3>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border uppercase ${
                  currentOrder.paymentStatus === 'PAID'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                }`}>
                  {currentOrder.paymentStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Order <span className="text-white font-mono">{currentOrder.orderNumber}</span> • Table {selectedTableId} • Captain {activeTable.serverName}
              </p>
            </div>
          </div>
        </div>

        {/* Itemized Dish Breakdown */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Ordered Dishes ({currentOrder.items.length})
          </span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {currentOrder.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-white">{item.name}</span>
                    <span className="text-[10px] text-slate-400">({item.portion})</span>
                    <span className="text-[10px] font-black text-amber-400">x{item.quantity}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span>🌶️ {item.spiceChoice}</span>
                    <span>•</span>
                    <span className="text-blue-300 font-medium">👤 {item.assignedGuest}</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-white text-xs">
                  ₹{item.totalPrice}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subtotal, GST, Tip Summary */}
        <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal</span>
            <span className="font-mono text-slate-200">₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Taxes (Restaurant GST 5%)</span>
            <span className="font-mono text-slate-200">₹{taxGst}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Staff Gratuity / Tip ({selectedTip}%)</span>
            <span className="font-mono text-amber-300 font-bold">₹{tipAmount}</span>
          </div>
          <div className="flex justify-between text-slate-100 font-black text-sm pt-2 border-t border-slate-800">
            <span>Grand Total Payable</span>
            <span className="font-mono text-amber-400 text-base">₹{finalTotal}</span>
          </div>
        </div>

        {/* 2. Tip Selector Buttons */}
        {currentOrder.paymentStatus !== 'PAID' && (
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                Add Staff Tip for Server {activeTable.serverName}
              </label>
              <span className="text-[11px] text-amber-400 font-bold">
                ₹{tipAmount} ({selectedTip}%)
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 5, 10, 15].map((pct) => (
                <button
                  key={pct}
                  onClick={() => handleSelectTip(pct)}
                  className={`py-2 rounded-xl text-xs font-black transition-all border ${
                    selectedTip === pct
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {pct === 0 ? 'No Tip' : `${pct}%`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Bill Splitting Options */}
        {currentOrder.paymentStatus !== 'PAID' && (
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                Split Bill Option
              </label>
              <span className="text-[11px] text-slate-400">
                Table {selectedTableId} ({activeTable.guests.join(' & ')})
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSplitMode('single')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border text-center ${
                  splitMode === 'single'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300 ring-1 ring-blue-500/30'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Single Bill
              </button>

              <button
                onClick={() => setSplitMode('even')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border text-center ${
                  splitMode === 'even'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300 ring-1 ring-blue-500/30'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Split Evenly (1/2)
              </button>

              <button
                onClick={() => setSplitMode('by_guest')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border text-center ${
                  splitMode === 'by_guest'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300 ring-1 ring-blue-500/30'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Split by Guest
              </button>
            </div>

            {/* Split breakdown details */}
            {splitMode === 'even' && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center text-slate-300">
                <span>Split evenly between {splitCount} guests:</span>
                <span className="font-mono font-black text-amber-400 text-sm">
                  ₹{Math.round(finalTotal / splitCount)} each
                </span>
              </div>
            )}

            {splitMode === 'by_guest' && (
              <div className="space-y-1.5 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                {activeTable.guests.map((guest) => {
                  const guestItems = currentOrder.items.filter(i => i.assignedGuest === guest);
                  const sharedItems = currentOrder.items.filter(i => i.assignedGuest === 'Shared' || i.assignedGuest === 'Table');
                  const directSub = guestItems.reduce((s, i) => s + i.totalPrice, 0);
                  const sharedShare = sharedItems.reduce((s, i) => s + i.totalPrice, 0) / (activeTable.guests.length || 1);
                  const guestShareTotal = Math.round((directSub + sharedShare) * (1 + 0.05 + selectedTip / 100));

                  return (
                    <div key={guest} className="flex justify-between items-center text-slate-300 py-0.5">
                      <span className="font-semibold text-white">👤 {guest}'s Share:</span>
                      <span className="font-mono font-black text-amber-400">
                        ₹{guestShareTotal}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 4. Payment Method Selector */}
        {currentOrder.paymentStatus !== 'PAID' && (
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'Google Pay', icon: '⚡' },
                { id: 'Apple Pay', icon: '🍎' },
                { id: 'Card', icon: '💳' },
                { id: 'Bank transfer', icon: '🏦' },
                { id: 'Cash', icon: '💵' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-2 ${
                    paymentMethod === m.id
                      ? 'bg-amber-500/15 border-amber-500 text-white ring-1 ring-amber-500/40 shadow-sm'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base">{m.icon}</span>
                  <span className="truncate">{m.id}</span>
                </button>
              ))}
            </div>

            {/* Live UPI QR Code for GPay / PhonePe / Paytm / BHIM */}
            {(paymentMethod === 'Google Pay' || paymentMethod === 'Bank transfer') && billUpiQr && (
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-emerald-500/40 text-center space-y-2 mt-2">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                    <Smartphone className="w-3.5 h-3.5" />
                    Scan with GPay / PhonePe / Paytm to Pay Directly
                  </span>
                  <span className="font-mono font-bold text-white">₹{finalTotal}</span>
                </div>

                <div className="mx-auto w-36 h-36 bg-white p-2 rounded-xl shadow-md border border-slate-700 flex items-center justify-center">
                  <img src={billUpiQr} alt="UPI Payment QR" className="w-full h-full object-contain" />
                </div>

                <p className="text-[11px] text-slate-300">
                  Pay directly to: <strong className="text-white">{restaurantProfile.merchantName || restaurantProfile.name}</strong>
                </p>
                <p className="text-[10px] text-emerald-400 font-mono">
                  UPI VPA: {restaurantProfile.upiId}
                </p>
                <div className="flex items-center justify-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-wider pt-0.5">
                  <span>Google Pay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
                </div>
              </div>
            )}

            {/* Pay Action Button */}
            <button
              onClick={handlePayNow}
              className="w-full mt-3 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-slate-950" />
              <span>Confirm & Pay ₹{finalTotal} via {paymentMethod}</span>
            </button>
            <p className="text-[10px] text-slate-500 text-center">
              Instant digital receipt & meal review prompt will appear immediately
            </p>
          </div>
        )}
      </div>

      {/* 5. Digital Receipt Card (Visible once paid or for paid tables) */}
      {(showReceipt || currentOrder.paymentStatus === 'PAID') && (
        <div className="p-5 rounded-3xl bg-slate-900 border-2 border-emerald-500/50 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
          <div className="text-center pb-3 border-b border-slate-800">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Payment Confirmed • Table {selectedTableId}
            </span>
            <h4 className="text-xl font-extrabold text-white mt-1.5 font-serif">
              {restaurantProfile.name}
            </h4>
            <p className="text-[11px] text-slate-300 font-medium">
              {restaurantProfile.legalEntity}
            </p>
            <p className="text-[10px] text-slate-400">
              {restaurantProfile.address}, {restaurantProfile.city}
            </p>
            <p className="text-[10px] text-amber-300 font-mono mt-0.5">
              FSSAI Lic: {restaurantProfile.fssaiNumber} • GSTIN: {restaurantProfile.gstin}
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-1">
              Invoice #{currentOrder.orderNumber}-TX • {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="space-y-1.5 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-slate-300">
              <span>Paid Total:</span>
              <span className="font-mono font-black text-emerald-400 text-sm">₹{finalTotal}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Payment Mode:</span>
              <span className="text-white font-semibold">{currentOrder.paymentMethod || paymentMethod}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Server Gratuity:</span>
              <span className="text-amber-300 font-semibold">₹{tipAmount}</span>
            </div>
          </div>

          {/* Email Receipt Action */}
          <div className="pt-1 space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              Email Itemized Receipt
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleSendEmailReceipt}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors whitespace-nowrap"
              >
                {emailSent ? 'Sent!' : 'Email Receipt'}
              </button>
            </div>
            {emailSent && (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Receipt sent to {emailInput} successfully!
              </p>
            )}
          </div>

          {/* 6. 1-Tap 5-Star Meal Rating Prompt */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <div className="text-center">
              <h5 className="text-sm font-extrabold text-white">
                How was your meal at Zaika today?
              </h5>
              <p className="text-[11px] text-slate-400">
                1-tap feedback helps our tandoor & curry chefs maintain top quality
              </p>
            </div>

            {/* Star selector */}
            <div className="flex justify-center items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-125 transition-transform"
                  aria-label={`${star} star rating`}
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Compliment Chips */}
            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                    reviewTags.includes(tag)
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {reviewTags.includes(tag) ? `✓ ${tag}` : `+ ${tag}`}
                </button>
              ))}
            </div>

            {/* Review Comment & Submit */}
            {!reviewSubmitted ? (
              <div className="space-y-2 pt-1">
                <input
                  type="text"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Optional review note (e.g. Garlic Naan was divine!)..."
                  maxLength={120}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleReviewSubmit}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-md hover:opacity-95 transition-all"
                >
                  Post 1-Tap Review
                </button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-xs text-emerald-300 font-bold animate-in fade-in">
                🎉 Thank you {activeTable.guests.join(' & ')}! Your 5-star review has been recorded.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
