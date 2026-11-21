import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useDineOS } from '../../context/DineOSContext';
import { RestaurantProfile } from '../../types';
import {
  Building2,
  X,
  CreditCard,
  ShieldCheck,
  Check,
  Lock,
  QrCode,
  FileText,
  DollarSign,
  Smartphone,
  Info,
  ExternalLink,
  Sparkles,
  KeyRound,
  ShieldAlert,
  Server
} from 'lucide-react';

export const RestaurantSetupModal: React.FC = () => {
  const {
    restaurantSetupModalOpen,
    setRestaurantSetupModalOpen,
    restaurantProfile,
    updateRestaurantProfile,
    selectedTableId
  } = useDineOS();

  const [activeTab, setActiveTab] = useState<'register' | 'payments' | 'privacy' | 'guide'>('register');

  // Form State
  const [formData, setFormData] = useState<RestaurantProfile>(restaurantProfile);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [testUpiQr, setTestUpiQr] = useState<string>('');

  // Keep form in sync with context
  useEffect(() => {
    setFormData(restaurantProfile);
  }, [restaurantProfile]);

  // Generate a live test UPI payment QR string
  useEffect(() => {
    const generateTestUpi = async () => {
      if (!formData.upiId) return;
      // Standard UPI Payment URI specification (NPCI standard)
      const upiUri = `upi://pay?pa=${formData.upiId}&pn=${encodeURIComponent(formData.merchantName || formData.name)}&am=500.00&cu=INR&tn=Table_${selectedTableId}_Bill`;
      try {
        const qrUrl = await QRCode.toDataURL(upiUri, {
          width: 240,
          margin: 1,
          color: { dark: '#0f172a', light: '#ffffff' }
        });
        setTestUpiQr(qrUrl);
      } catch {
        // Fallback
      }
    };
    generateTestUpi();
  }, [formData.upiId, formData.merchantName, formData.name, selectedTableId]);

  if (!restaurantSetupModalOpen) return null;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateRestaurantProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setRestaurantSetupModalOpen(false);
      }}
    >
      <div
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[94vh]"
        role="region"
        aria-label="Restaurant Registration, Payment & Security Console"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 rounded-xl text-slate-950 font-black shadow-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Hotel Registration, Payments & Data Security
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active Profile
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Setup restaurant FSSAI/GST, direct bank UPI gateway, and zero-data-leak privacy
              </p>
            </div>
          </div>
          <button
            onClick={() => setRestaurantSetupModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-4 pt-2 gap-2 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('register')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'register'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>1. Hotel Registration (होटल का रजिस्ट्रेशन)</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'payments'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>2. Receive Payments (पेमेंट कैसे लें)</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. Privacy & Security (डेटा सुरक्षा)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>4. Step-by-Step Guide</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: HOTEL REGISTRATION */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200">
                <strong className="text-white block mb-0.5">💡 Restaurant Business Onboarding:</strong>
                यहाँ अपने होटल/रेस्टोरेंट का आधिकारिक नाम, FSSAI लाइसेंस, GSTIN और संपर्क विवरण दर्ज करें। यह विवरण आपके QR Standees, Digital Bill Receipts और KDS ऑर्डर्स पर तुरंत लागू हो जाता है।
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Restaurant Brand Name * (दुकान/होटल का नाम)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Zaika Indian Bistro"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Tagline / Cuisine Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Crafted North Indian Dining & Tandoor"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Legal Business / Trade Name
                  </label>
                  <input
                    type="text"
                    value={formData.legalEntity}
                    onChange={(e) => setFormData({ ...formData, legalEntity: e.target.value })}
                    placeholder="e.g. Zaika Hospitality & Foods Pvt. Ltd."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    FSSAI License No. * (खाद्य सुरक्षा लाइसेंस)
                  </label>
                  <input
                    type="text"
                    value={formData.fssaiNumber}
                    onChange={(e) => setFormData({ ...formData, fssaiNumber: e.target.value })}
                    placeholder="14-digit FSSAI (e.g. 11524021000345)"
                    maxLength={14}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    GSTIN No. (15-Digit Goods & Services Tax)
                  </label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                    placeholder="e.g. 27AABCZ1234F1Z5"
                    maxLength={15}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Official Contact Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Restaurant Address & City
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Shop / Floor, Commercial Hub, City, State, PIN"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RECEIVE PAYMENTS (DIRECT BANK UPI + GATEWAY) */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-200">
                <strong className="text-white block mb-0.5">💰 Zero-Commission Direct Bank UPI Settlements:</strong>
                भारत में डाइन-इन रेस्टोरेंट के लिए सबसे तेज़ और सुरक्षित तरीका <strong>Direct Merchant UPI</strong> है। ग्राहक टेबल पर अपने GPay, PhonePe, Paytm या BHIM से QR स्कैन करता है और पैसा सीधे आपके बैंक खाते में <strong>0% MDR फीस</strong> पर तुरंत आ जाता है।
              </div>

              {/* UPI Configuration Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    Direct Merchant UPI Settlement (Bank Account)
                  </h4>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Merchant UPI VPA / ID * (अपना बैंक UPI ID डालें)
                    </label>
                    <input
                      type="text"
                      value={formData.upiId}
                      onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                      placeholder="e.g. yourhotel@icici, 9876543210@paytm"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      ICICI, HDFC, SBI, Paytm Business, PhonePe Business का Merchant UPI VPA
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Bank Account Name / Business Title
                    </label>
                    <input
                      type="text"
                      value={formData.merchantName}
                      onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })}
                      placeholder="e.g. Zaika Indian Bistro"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Payment Method Option */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Default Payment Route
                    </label>
                    <select
                      value={formData.paymentGateway}
                      onChange={(e) => setFormData({ ...formData, paymentGateway: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="UPI_DIRECT">Direct UPI Dynamic QR (Instant 0% Fee Bank Transfer)</option>
                      <option value="RAZORPAY">Razorpay Gateway (Cards, NetBanking, International)</option>
                      <option value="STRIPE">Stripe Connect (Global Apple Pay / Google Pay)</option>
                      <option value="CASH_CARD">Offline Staff EDC Card Machine & Cash</option>
                    </select>
                  </div>
                </div>

                {/* Real Live Dynamic UPI QR Preview */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center">
                  <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 mb-2">
                    Live UPI Payment QR Preview
                  </span>

                  <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-md border border-slate-700 flex items-center justify-center">
                    {testUpiQr ? (
                      <img src={testUpiQr} alt="UPI QR" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-slate-400">Enter UPI ID</span>
                    )}
                  </div>

                  <p className="text-[11px] text-white font-bold mt-2">
                    Payable to: <strong className="text-emerald-400">{formData.merchantName || formData.name}</strong>
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    VPA: {formData.upiId || 'Not Configured'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Customer gets this QR in the "Pay Bill" tab with their exact bill total.
                  </p>
                </div>
              </div>

              {/* Razorpay Gateway Keys (Optional) */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-purple-400" />
                    Online Card & NetBanking Gateway (Razorpay / Stripe)
                  </h4>
                  <span className="text-[10px] text-slate-400">Optional for International Cards</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Razorpay Key ID (Client Key)
                    </label>
                    <input
                      type="text"
                      value={formData.razorpayKeyId || ''}
                      onChange={(e) => setFormData({ ...formData, razorpayKeyId: e.target.value })}
                      placeholder="rzp_live_..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Webhook Secret (Auto-Mark Paid)
                    </label>
                    <input
                      type="password"
                      value={formData.razorpaySecret || ''}
                      onChange={(e) => setFormData({ ...formData, razorpaySecret: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DATA PRIVACY & BANK-GRADE SECURITY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-xs text-blue-200">
                <strong className="text-white block mb-0.5">🔒 Zero-Leak Guest Data Privacy Architecture:</strong>
                Zaika DineOS को "Privacy by Design" सिद्धांत पर बनाया गया है। इसमें ग्राहकों को कोई ऐप डाउनलोड नहीं करनी पड़ती और न ही कोई अनिवार्य फोन नंबर या पासवर्ड देना होता है।
              </div>

              {/* Privacy Toggles & Admin Security PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Anonymous Dining Toggle */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Anonymous Dining Mode
                      </span>
                      <input
                        type="checkbox"
                        checked={formData.anonymousMode}
                        onChange={(e) => setFormData({ ...formData, anonymousMode: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-700"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      ग्राहक बिना अपना मोबाइल नंबर या ईमेल दिए सीधे क्यूआर स्कैन करके ऑर्डर कर सकते हैं। कोई स्पैम या डेटा लीक नहीं।
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded w-fit">
                    GDPR & DPDP Act 2023 Compliant
                  </span>
                </div>

                {/* Master Admin Security PIN */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-amber-400" />
                      Owner / Admin Master PIN
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    रेवेन्यू, दैनिक कमाई और बैंक सेटलमेंट सेटिंग्स को केवल अधिकृत मालिक/मैनेजर ही देख सके।
                  </p>
                  <input
                    type="password"
                    maxLength={6}
                    value={formData.adminPin}
                    onChange={(e) => setFormData({ ...formData, adminPin: e.target.value })}
                    placeholder="4 or 6-digit PIN"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono tracking-widest text-center font-black focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Data Security Guarantees Checklist */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold text-white">Security & Privacy Checklist for DineOS:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-start gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>No Card Data Stored (PCI-DSS):</strong> कार्ड की जानकारी कभी होटल के सर्वर पर नहीं रुकती, सीधे बैंक गेटवे पर प्रोसेस होती है।</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Role-Based Access:</strong> किचन शेफ को केवल डिशेज और टेबल नंबर दिखता है, ग्राहक का कोई पर्सनल डेटा नहीं।</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Session Wipe:</strong> टेबल बिल का भुगतान होते ही सेशन डेटा सुरक्षित रूप से आर्काइव/वाइप हो जाता है।</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Private Server / Cloud:</strong> आप इसे अपने खुद के AWS/GCP/डिजिटल ओशन प्राइवेट सर्वर पर बिना किसी थर्ड पार्टी ट्रैकर के चला सकते हैं।</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STEP-BY-STEP GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>होटल को कानूनी और तकनीकी रूप से सेटअप करने के 4 आसान चरण:</span>
                </h4>

                <div className="space-y-3 pl-1">
                  <div className="border-l-2 border-amber-500 pl-3">
                    <strong className="text-white block">कदम 1: FSSAI और GST रजिस्ट्रेशन (कानूनी मान्यता)</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      भारत में किसी भी रेस्टोरेंट के लिए 14-अंकों का <strong>FSSAI खाद्य सुरक्षा लाइसेंस</strong> (foscos.fssai.gov.in) अनिवार्य है। यदि आपका टर्नओवर ₹20 लाख से अधिक है तो <strong>GSTIN</strong> लें (रेस्टोरेंट डाइन-इन पर 5% GST लागू होता है)।
                    </p>
                  </div>

                  <div className="border-l-2 border-emerald-500 pl-3">
                    <strong className="text-white block">कदम 2: बैंक से Merchant UPI ID एक्टिवेट करें</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      अपने चालू खाते (Current Account) से ICICI Eazypay, HDFC SmartHub, SBI YONO Merchant या Paytm/PhonePe Business ऐप पर अपनी मर्चेंट UPI ID (जैसे <code>hotelname@icici</code>) बना लें। इस ID को DineOS के "Receive Payments" टैब में डालें।
                    </p>
                  </div>

                  <div className="border-l-2 border-blue-500 pl-3">
                    <strong className="text-white block">कदम 3: टेबल QR Standees का प्रिंटआउट लगाएं</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      DineOS के <strong>QR Codes & Matrix Hub</strong> में जाएं और <strong>"Print Standees"</strong> दबाकर टेबल T1 से T6 तक के स्टैंडी कार्ड्स प्रिंट करके हर टेबल पर एक्रेलिक स्टैंड में रख दें।
                    </p>
                  </div>

                  <div className="border-l-2 border-purple-500 pl-3">
                    <strong className="text-white block">कदम 4: डाइन-इन ऑर्डर और ऑटोमैटिक पेमेंट चालू</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      ग्राहक टेबल पर बैठते ही फोन से QR स्कैन करेगा, मेन्यू से अपनी पसंद की डिश चुनेगा, और पेमेंट टैब में सीधे आपके बैंक खाते में UPI से भुगतान कर देगा। किचन के KDS पर ऑर्डर तुरंत दिखेगा!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          {savedSuccess ? (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Restaurant Profile & Payment Gateway Saved Successfully!</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Changes update your digital receipts, QR codes & UPI payment links immediately.
            </span>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setRestaurantSetupModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg hover:opacity-95 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save & Update Hotel Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
