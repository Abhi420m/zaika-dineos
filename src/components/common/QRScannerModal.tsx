import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useDineOS } from '../../context/DineOSContext';
import { TableId } from '../../types';
import {
  QrCode,
  Camera,
  Check,
  X,
  Printer,
  Sparkles,
  Wifi,
  ExternalLink,
  Smartphone,
  RefreshCw,
  VideoOff,
  Copy
} from 'lucide-react';

export const QRScannerModal: React.FC = () => {
  const {
    qrModalOpen,
    setQrModalOpen,
    tables,
    selectedTableId,
    setSelectedTableId,
    setMainView,
    setGuestTab
  } = useDineOS();

  const [activeTab, setActiveTab] = useState<'table_qr' | 'select' | 'scan'>('table_qr');
  const [standeeTable, setStandeeTable] = useState<TableId>(selectedTableId);
  const [showAllQrs, setShowAllQrs] = useState<boolean>(false);
  const [qrDataUrls, setQrDataUrls] = useState<Record<string, string>>({});
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  // Host configuration for scanning (allows testing on phone over Wi-Fi)
  const defaultHost = typeof window !== 'undefined'
    ? (window.location.hostname === 'localhost' ? '10.204.81.147:5174' : window.location.host)
    : '10.204.81.147:5174';

  const [customHost, setCustomHost] = useState<string>(defaultHost);
  const [useLocalhost, setUseLocalhost] = useState<boolean>(false);

  // Real Camera Streaming State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Calculate current target URL for a table
  const getTableUrl = (tId: TableId) => {
    if (useLocalhost) {
      return `http://localhost:5174/?table=${tId}`;
    }
    const host = customHost.trim() || defaultHost;
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    return `${protocol}//${host}/?table=${tId}`;
  };

  // Generate real scannable QR code data URLs
  useEffect(() => {
    if (!qrModalOpen) return;

    const generateQrs = async () => {
      const urls: Record<string, string> = {};
      for (const t of tables) {
        const targetUrl = getTableUrl(t.id);
        try {
          const dataUrl = await QRCode.toDataURL(targetUrl, {
            width: 320,
            margin: 2,
            errorCorrectionLevel: 'M',
            color: {
              dark: '#0f172a', // Deep slate for sharp contrast
              light: '#ffffff'
            }
          });
          urls[t.id] = dataUrl;
        } catch (err) {
          console.error('Failed to generate QR for table', t.id, err);
        }
      }
      setQrDataUrls(urls);
    };

    generateQrs();
  }, [qrModalOpen, customHost, useLocalhost, tables]);

  // Handle Real Camera Activation in 'scan' tab
  useEffect(() => {
    let stream: MediaStream | null = null;
    let barcodeInterval: ReturnType<typeof setInterval> | null = null;

    if (qrModalOpen && activeTab === 'scan') {
      setCameraError(null);
      setScanResult(null);

      // Attempt to access live camera
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: 'environment' } })
          .then((mediaStream) => {
            stream = mediaStream;
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream;
              videoRef.current.play();
              setCameraActive(true);
            }

            // Check if modern BarcodeDetector API is available
            if ('BarcodeDetector' in window) {
              try {
                const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
                barcodeInterval = setInterval(async () => {
                  if (videoRef.current && videoRef.current.readyState === 4) {
                    try {
                      const barcodes = await detector.detect(videoRef.current);
                      if (barcodes.length > 0) {
                        const rawVal = barcodes[0].rawValue;
                        handleDetectedUrl(rawVal);
                      }
                    } catch {
                      // Detector frame drop
                    }
                  }
                }, 400);
              } catch {
                // BarcodeDetector initialization fallback
              }
            }
          })
          .catch((err) => {
            console.warn('Camera access error or permission denied:', err);
            setCameraError('Camera access not available or permission denied. You can tap any table button below to simulate scanning!');
            setCameraActive(false);
          });
      } else {
        setCameraError('Camera API is not supported on this browser. You can use 1-tap table buttons below.');
      }
    }

    return () => {
      if (barcodeInterval) clearInterval(barcodeInterval);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setCameraActive(false);
    };
  }, [qrModalOpen, activeTab]);

  const handleDetectedUrl = (url: string) => {
    // Parse table query parameter from URL
    try {
      const parsed = new URL(url);
      const t = parsed.searchParams.get('table');
      if (t && ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'].includes(t)) {
        setScanResult(t);
        setTimeout(() => {
          handleSelectTable(t as TableId);
        }, 800);
        return;
      }
    } catch {
      // Fallback string match
      const match = url.match(/table[=_](T[1-6])/i) || url.match(/(T[1-6])/i);
      if (match && match[1]) {
        const found = match[1].toUpperCase() as TableId;
        setScanResult(found);
        setTimeout(() => {
          handleSelectTable(found);
        }, 800);
      }
    }
  };

  const handleSelectTable = (id: TableId) => {
    setSelectedTableId(id);
    setStandeeTable(id);
    setMainView('guest');
    setGuestTab('menu');
    setQrModalOpen(false);
  };

  const handleCopyCurrentUrl = () => {
    navigator.clipboard.writeText(getTableUrl(standeeTable));
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!qrModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setQrModalOpen(false);
      }}
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-xl text-slate-950 font-black shadow-md">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Real Scannable QR Codes & Table Standees
              </h2>
              <p className="text-xs text-slate-400">
                Point any phone camera at the screen to test instant dine-in ordering
              </p>
            </div>
          </div>
          <button
            onClick={() => setQrModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 pt-2 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('table_qr')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'table_qr'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Real Phone-Scannable QR Standees</span>
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'scan'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera Scanner</span>
          </button>
          <button
            onClick={() => setActiveTab('select')}
            className={`pb-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'select'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Switch Table Context
          </button>
        </div>

        {/* Tab 1: Real Scannable QR Standees */}
        {activeTab === 'table_qr' && (
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
            {/* Wi-Fi & Phone Testing Helper Bar */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">
                  Phone Scan Target IP:
                </span>
                <input
                  type="text"
                  value={customHost}
                  onChange={(e) => setCustomHost(e.target.value)}
                  placeholder="e.g. 10.204.81.147:5174"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500 w-44"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUseLocalhost(!useLocalhost)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                    useLocalhost
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {useLocalhost ? 'Localhost Mode' : 'Wi-Fi LAN Mode'}
                </button>
                <button
                  onClick={handlePrint}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Standees</span>
                </button>
              </div>
            </div>

            {/* Table Selector Pills */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-xs text-slate-400 font-bold mr-1">Select Table:</span>
                {tables.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setStandeeTable(t.id);
                      setShowAllQrs(false);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all border ${
                      standeeTable === t.id && !showAllQrs
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {t.id}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAllQrs(!showAllQrs)}
                className="text-xs text-amber-400 hover:underline font-bold"
              >
                {showAllQrs ? '← Show Single Table View' : 'View All 6 Tables Grid →'}
              </button>
            </div>

            {/* Standee Card */}
            {!showAllQrs ? (
              <div className="p-4 bg-slate-950/70 rounded-3xl border border-slate-800 text-center space-y-3">
                {/* Physical Table Card with Real 2D QR Code */}
                <div className="mx-auto max-w-sm p-6 bg-gradient-to-b from-amber-50 via-amber-50 to-orange-100 rounded-3xl shadow-2xl text-slate-950 border-4 border-amber-500/60 relative">
                  <div className="text-center mb-2">
                    <span className="text-[10px] font-black tracking-widest text-amber-900 uppercase">
                      Zaika Indian Bistro
                    </span>
                    <h3 className="text-2xl font-black text-slate-950 font-serif">
                      TABLE {standeeTable}
                    </h3>
                    <p className="text-[11px] text-amber-900 font-semibold">
                      Scan with Phone Camera for Contactless Menu & Pay
                    </p>
                  </div>

                  {/* REAL SCAN-READY QR IMAGE */}
                  <div className="mx-auto w-48 h-48 bg-white p-2.5 rounded-2xl border-2 border-slate-900/20 shadow-md flex items-center justify-center">
                    {qrDataUrls[standeeTable] ? (
                      <img
                        src={qrDataUrls[standeeTable]}
                        alt={`QR Code for Table ${standeeTable}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-xs text-slate-400 flex flex-col items-center">
                        <RefreshCw className="w-5 h-5 animate-spin mb-1 text-amber-500" />
                        Generating QR...
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-amber-900/20 text-xs text-amber-950 space-y-0.5">
                    <p>⚡ WiFi: <strong className="font-mono">Zaika_Guest_5G</strong></p>
                    <p>🔑 Key: <strong className="font-mono">zaika2026</strong></p>
                  </div>

                  <div className="mt-2 text-[10px] text-amber-800 font-mono truncate">
                    {getTableUrl(standeeTable)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    onClick={() => handleSelectTable(standeeTable)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg hover:opacity-95 transition-all"
                  >
                    Open Menu for Table {standeeTable}
                  </button>
                  <button
                    onClick={handleCopyCurrentUrl}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copiedUrl ? 'Link Copied!' : 'Copy Table Link'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* All 6 QR Codes Grid */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tables.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleSelectTable(t.id)}
                    className="p-3 bg-gradient-to-b from-amber-50 to-orange-100 rounded-2xl shadow-md text-slate-950 border-2 border-amber-500/50 text-center cursor-pointer hover:scale-105 transition-transform"
                  >
                    <span className="text-[9px] font-black tracking-wider text-amber-900 uppercase block">
                      ZAIKA BISTRO
                    </span>
                    <h4 className="text-base font-black font-serif text-slate-950">
                      TABLE {t.id}
                    </h4>

                    {/* Real QR */}
                    <div className="mx-auto w-28 h-28 bg-white rounded-xl my-1.5 p-1 border border-slate-900/10 shadow-sm flex items-center justify-center">
                      {qrDataUrls[t.id] ? (
                        <img
                          src={qrDataUrls[t.id]}
                          alt={`QR for ${t.id}`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400">Loading...</span>
                      )}
                    </div>

                    <p className="text-[10px] text-amber-950 font-bold">
                      Tap to Open Menu →
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Live Camera Scanner */}
        {activeTab === 'scan' && (
          <div className="p-5 text-center space-y-4">
            <div className="relative mx-auto w-72 h-72 bg-slate-950 rounded-3xl border-2 border-amber-500/50 overflow-hidden shadow-2xl flex flex-col items-center justify-center">
              {/* Real Video Element */}
              <video
                ref={videoRef}
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
              />

              {!cameraActive && (
                <div className="p-4 text-center space-y-2">
                  <Camera className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
                  <p className="text-xs font-bold text-slate-300">
                    Camera Scanner Viewport
                  </p>
                  {cameraError && (
                    <p className="text-[11px] text-amber-400/90 max-w-xs mx-auto">
                      {cameraError}
                    </p>
                  )}
                </div>
              )}

              {/* Viewfinder Overlay & Laser */}
              <div className="absolute inset-5 border-2 border-amber-400/50 rounded-2xl pointer-events-none" />
              <div className="absolute left-4 right-4 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-bounce pointer-events-none" style={{ top: '48%' }} />

              {scanResult && (
                <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center text-emerald-400 animate-in zoom-in-90 duration-150 z-20">
                  <Check className="w-12 h-12 mb-1" />
                  <p className="text-base font-black">Scanned Table {scanResult}!</p>
                  <p className="text-xs text-emerald-300">Opening Digital Menu...</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-300">
                Or tap a table button below to test scan instantly:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {tables.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setScanResult(t.id);
                      setTimeout(() => handleSelectTable(t.id), 600);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 border border-slate-700 text-xs font-bold text-slate-200 transition-all shadow-sm"
                  >
                    Scan Table {t.id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Table Context Switcher */}
        {activeTab === 'select' && (
          <div className="p-4 space-y-3 overflow-y-auto">
            <p className="text-xs text-slate-400">
              Select any table to immediately open its guest digital menu:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {tables.map((t) => {
                const isSelected = t.id === selectedTableId;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTable(t.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30'
                        : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-white bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-700">
                          {t.id}
                        </span>
                        <span className="text-xs font-bold text-slate-200">{t.name}</span>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                        {t.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Guests: <strong className="text-slate-200">{t.guests.join(', ')}</strong> ({t.capacity} Seats)
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Real QR codes decode to <strong className="text-amber-400">?table=T1..T6</strong>
          </span>
          <button
            onClick={() => setQrModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
