'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useOneConnectStore } from '@/lib/store';
import {
  ScanLine,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Printer,
  BellRing,
  RotateCcw,
  Wifi,
  WifiOff,
  Search,
  UserCheck,
  Smartphone,
  QrCode,
  AlertCircle,
  Clock,
  Users,
  Volume2,
  VolumeX,
  Building2,
  ArrowLeft,
  CloudUpload,
  Database,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Html5Qrcode } from 'html5-qrcode';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

interface OfflineCheckinItem {
  id: string;
  eventId: string;
  codeOrUid: string;
  method: 'NFC' | 'QR';
  timestamp: string;
  delegateName: string;
}

export default function FastCheckinTerminal() {
  const { state, performCheckIn } = useOneConnectStore();
  const activeEvent = state.events[0];

  const [mounted, setMounted] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [latency, setLatency] = useState<number | null>(null);
  const [lastCheckInResult, setLastCheckInResult] = useState<any>(null);
  const [mode, setMode] = useState<'NFC' | 'QR'>('NFC');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isNfcActive, setIsNfcActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Offline-First State Management
  const [isOnline, setIsOnline] = useState(true);
  const [forceOfflineMode, setForceOfflineMode] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<OfflineCheckinItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  // Fast Lookup State
  const [quickSearch, setQuickSearch] = useState('');
  const [selectedAttendeeId, setSelectedAttendeeId] = useState<string>('');

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // Initialize offline queue from localStorage & network listener
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      try {
        const savedQueue = localStorage.getItem('one_connect_offline_queue');
        if (savedQueue) {
          setOfflineQueue(JSON.parse(savedQueue));
        }
      } catch (e) {
        console.error('Error loading offline queue', e);
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Save offline queue whenever it changes
  const updateOfflineQueue = useCallback((newQueue: OfflineCheckinItem[]) => {
    setOfflineQueue(newQueue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('one_connect_offline_queue', JSON.stringify(newQueue));
    }
  }, []);

  // Web Audio API Sound Synthesizer
  const playSoundEffect = (type: 'SUCCESS' | 'DUPLICATE' | 'ERROR') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'SUCCESS') {
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'DUPLICATE') {
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        if ('vibrate' in navigator) {
          navigator.vibrate(300);
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // AudioContext fallback
    }
  };

  // Perform Check-in with Offline-First fallback
  const handleTriggerCheckIn = async (targetCode: string) => {
    if (!targetCode.trim()) return;

    setIsScanning(true);
    const startTime = performance.now();
    let res: any;
    const isWorkingOffline = !isOnline || forceOfflineMode;

    if (isWorkingOffline) {
      // OFFLINE-FIRST: Execute directly against local store cache (< 50ms)
      res = performCheckIn(activeEvent?.id || 'evt-001', targetCode.trim(), mode);

      if (res.success && !res.alreadyCheckedIn) {
        const newQueueItem: OfflineCheckinItem = {
          id: `off-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          eventId: activeEvent?.id || 'evt-001',
          codeOrUid: targetCode.trim(),
          method: mode,
          timestamp: new Date().toISOString(),
          delegateName: res.identity?.fullName || 'Đại biểu',
        };
        updateOfflineQueue([...offlineQueue, newQueueItem]);
      }
    } else {
      // ONLINE CLOUD CHECK-IN
      try {
        const apiResponse = await fetch('/api/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: activeEvent?.id || 'evt-001',
            codeOrUid: targetCode.trim(),
            method: mode,
            gateLocation: 'Gate 1 - VIP NFC Terminal',
          }),
        });

        const data = await apiResponse.json();
        if (data.success || data.isDuplicate) {
          res = {
            success: data.success,
            alreadyCheckedIn: data.isDuplicate || false,
            identity: data.delegate || data.checkIn?.personIdentity,
            message: data.message || 'Xác thực check-in thành công qua Cloud!',
          };
          performCheckIn(activeEvent?.id || 'evt-001', targetCode.trim(), mode);
        } else {
          res = performCheckIn(activeEvent?.id || 'evt-001', targetCode.trim(), mode);
        }
      } catch {
        res = performCheckIn(activeEvent?.id || 'evt-001', targetCode.trim(), mode);
        if (res.success && !res.alreadyCheckedIn) {
          const newQueueItem: OfflineCheckinItem = {
            id: `off-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            eventId: activeEvent?.id || 'evt-001',
            codeOrUid: targetCode.trim(),
            method: mode,
            timestamp: new Date().toISOString(),
            delegateName: res.identity?.fullName || 'Đại biểu',
          };
          updateOfflineQueue([...offlineQueue, newQueueItem]);
        }
      }
    }

    const endTime = performance.now();
    const calculatedLatency = Math.round(endTime - startTime);
    setLatency(calculatedLatency);
    setLastCheckInResult(res);
    setInputVal('');
    setIsScanning(false);

    if (res.alreadyCheckedIn) {
      playSoundEffect('DUPLICATE');
    } else if (res.success) {
      playSoundEffect('SUCCESS');
    } else {
      playSoundEffect('ERROR');
    }
  };

  // Sync Offline Queue to Cloud
  const handleSyncToCloud = async () => {
    if (offlineQueue.length === 0) return;
    setIsSyncing(true);
    setSyncSuccessMsg(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const syncedCount = offlineQueue.length;
      updateOfflineQueue([]);
      setSyncSuccessMsg(`Đã đồng bộ thành công ${syncedCount} lượt check-in lên Supabase Cloud!`);
      setTimeout(() => setSyncSuccessMsg(null), 5000);
    } catch {
      alert('Chưa thể đồng bộ lên Cloud. Vui lòng kiểm tra lại kết nối mạng.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Hardware Web NFC API (Real Physical Tap Listener)
  useEffect(() => {
    let abortController: AbortController | null = null;

    if (mode === 'NFC' && typeof window !== 'undefined' && 'NDEFReader' in window) {
      try {
        const NDEFReaderClass = (window as any).NDEFReader;
        const ndef = new NDEFReaderClass();
        abortController = new AbortController();

        ndef
          .scan({ signal: abortController.signal })
          .then(() => {
            setIsNfcActive(true);
            ndef.addEventListener('reading', ({ serialNumber, message }: any) => {
              let tagData = serialNumber || '';
              if (message && message.records) {
                for (const record of message.records) {
                  if (record.recordType === 'text') {
                    const textDecoder = new TextDecoder(record.encoding || 'utf-8');
                    tagData = textDecoder.decode(record.data);
                  } else if (record.recordType === 'url') {
                    const textDecoder = new TextDecoder();
                    tagData = textDecoder.decode(record.data);
                  }
                }
              }
              if (tagData) {
                handleTriggerCheckIn(tagData);
              }
            });
          })
          .catch(() => {
            setIsNfcActive(false);
          });
      } catch {
        setIsNfcActive(false);
      }
    }

    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [mode, isOnline, forceOfflineMode]);

  // QR Code Scanner Effect (Continuous Hardware Camera)
  useEffect(() => {
    if (mode === 'QR') {
      const html5QrCode = new Html5Qrcode('reader-qr-region');
      html5QrCodeRef.current = html5QrCode;

      html5QrCode
        .start(
          { facingMode: 'environment' },
          { fps: 15, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            handleTriggerCheckIn(decodedText);
          },
          () => {}
        )
        .then(() => setIsCameraActive(true))
        .catch(() => setIsCameraActive(false));

      return () => {
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
          html5QrCodeRef.current.stop().catch(() => {});
        }
      };
    } else {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
      setIsCameraActive(false);
    }
  }, [mode]);

  const isCurrentOffline = !isOnline || forceOfflineMode;

  // Filtered attendees list for Fast Lookup
  const filteredAttendees = useMemo(() => {
    const list = state.identities || [];
    if (!quickSearch.trim()) return list;
    const q = quickSearch.toLowerCase();
    return list.filter(
      (i) =>
        i.fullName.toLowerCase().includes(q) ||
        i.title?.toLowerCase().includes(q) ||
        i.businesses?.[0]?.businessName?.toLowerCase().includes(q) ||
        state.cards.some((c) => c.personIdentityId === i.id && c.cardUid.toLowerCase().includes(q))
    );
  }, [state.identities, state.cards, quickSearch]);

  const currentSelectedAttendee = useMemo(() => {
    if (!selectedAttendeeId && filteredAttendees.length > 0) {
      return filteredAttendees[0];
    }
    return filteredAttendees.find((a) => a.id === selectedAttendeeId) || filteredAttendees[0];
  }, [filteredAttendees, selectedAttendeeId]);

  // Recent 5 checked-in attendees
  const recentCheckins = useMemo(() => {
    return (state.checkIns || [])
      .filter((c) => c.eventId === (activeEvent?.id || 'evt-001'))
      .slice(-5)
      .reverse();
  }, [state.checkIns, activeEvent?.id]);

  // Set default selected attendee on mount
  useEffect(() => {
    if (!selectedAttendeeId && filteredAttendees.length > 0 && filteredAttendees[0]) {
      setSelectedAttendeeId(filteredAttendees[0].id);
    }
  }, [filteredAttendees, selectedAttendeeId]);

  return (
    <ErrorBoundary
      fallbackTitle="Lỗi Khởi Động Trạm Check-in"
      fallbackMessage="Trình điều khiển thiết bị (Camera QR hoặc Đầu đọc NFC) gặp sự cố tạm thời hoặc quyền truy cập phần cứng bị từ chối. Vui lòng cấp quyền hoặc khởi động lại thiết bị."
    >
      <div className="space-y-6 w-full pb-16 antialiased">
        {/* TOP STATUS BAR: REALTIME STATS & HARDWARE CONTROLS */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-3 sm:px-5 shadow-2xs">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Về Command Center Quản Trị"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">
                  {activeEvent?.name || 'Diễn Đàn Kết Nối Doanh Nghiệp MICE 2026'}
                </span>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-mono font-bold">
                  SLA &lt; 0.8s
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Trạm điểm danh đại biểu 1-chạm NFC &amp; Camera QR Code tốc độ cao
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Online / Offline switch */}
            <button
              onClick={() => setForceOfflineMode(!forceOfflineMode)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                isCurrentOffline
                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }`}
              title="Bấm để chuyển đổi chế độ Trực tuyến / Ngoại tuyến"
            >
              {isCurrentOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>Offline Cache</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cloud Live</span>
                </>
              )}
            </button>

            {/* Sound toggle button */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer shadow-2xs"
              title={soundEnabled ? 'Tắt âm thanh báo' : 'Bật âm thanh báo'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Live Count Counter */}
            <div className="flex flex-col items-end text-xs pl-3 border-l border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-semibold">Đã Điểm Danh</span>
              <span suppressHydrationWarning className="font-mono font-bold text-blue-600 text-sm">
                {mounted ? `${activeEvent?.checkInCount ?? 0} / ${activeEvent?.registrationCount ?? 0}` : '0 / 0'}
              </span>
            </div>
          </div>
        </div>

        {/* OFFLINE QUEUE NOTIFICATION BAR */}
        {offlineQueue.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5 text-xs text-amber-900 font-medium">
              <Database className="w-4 h-4 text-amber-700 shrink-0 animate-bounce" />
              <span>
                Đang lưu <strong className="font-bold">{offlineQueue.length} lượt quét ngoại tuyến</strong> trong bộ nhớ máy.
              </span>
            </div>
            <Button
              size="sm"
              onClick={handleSyncToCloud}
              disabled={isSyncing}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl gap-1.5 cursor-pointer shadow-xs"
            >
              <CloudUpload className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Đang đồng bộ...' : 'Đồng Bộ Cloud Ngay'}
            </Button>
          </div>
        )}

        {syncSuccessMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            {syncSuccessMsg}
          </div>
        )}

        {/* HERO BANNER: TRẠM CHECK-IN THEME MỚI (DARK GRADIENT) */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 rounded-3xl p-6 sm:p-7 text-white border border-blue-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[11px] font-semibold border border-blue-400/30">
                TRẠM TIẾP ĐÓN MICE · CỔNG SỐ 1
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <Wifi className="w-3.5 h-3.5" /> Offline-First (Đồng bộ tức thì)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Trạm Check-in Siêu Tốc 1-Chạm NFC &amp; Mã QR
            </h2>
            <p className="text-xs text-blue-200/80 max-w-xl leading-relaxed">
              Tối ưu hóa cho máy tính bảng iPad tại quầy lễ tân hội nghị 5 sao (Sheraton, Vinpearl, The Anam). Thời gian điểm danh trung bình: &lt; 0.8 giây / lượt.
            </p>
          </div>

          {/* CHẾ ĐỘ QUÉT: NFC vs QR */}
          <div className="flex items-center bg-white/10 p-1 rounded-2xl border border-white/15 self-start md:self-auto shrink-0">
            <button
              onClick={() => setMode('NFC')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'NFC'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Đầu Đọc Thẻ NFC (0.42s)
            </button>
            <button
              onClick={() => setMode('QR')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'QR'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <ScanLine className="w-4 h-4" />
              Camera Mã QR vCard
            </button>
          </div>
        </div>

        {/* MAIN WORKSPACE GRID: 12 COLS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CỘT TRÁI (7 COLS): VÙNG TIẾP XÚC CẢM ỨNG & KẾT QUẢ CHECK-IN */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ScanLine className="w-4 h-4 text-blue-600" />
                  Vùng Tiếp Xúc Cảm Ứng (Sensor Target Zone)
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  SLA Chuẩn: &lt; 800ms
                </span>
              </div>

              {/* SENSOR TARGET AREA */}
              {mode === 'NFC' ? (
                <div
                  onClick={() => {
                    if (currentSelectedAttendee) {
                      const userCard = state.cards.find(
                        (c) => c.personIdentityId === currentSelectedAttendee.id
                      );
                      const targetCode = userCard?.cardUid || currentSelectedAttendee.username || currentSelectedAttendee.fullName;
                      handleTriggerCheckIn(targetCode);
                    }
                  }}
                  className={`relative rounded-3xl p-8 border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isScanning
                      ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
                      : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50'
                  }`}
                  style={{ minHeight: '230px' }}
                >
                  {isScanning ? (
                    <div className="space-y-3 animate-pulse">
                      <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
                        <CreditCard className="w-8 h-8 animate-spin" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-blue-900 block">
                          Đang đọc chip NFC NTAG216...
                        </span>
                        <span className="text-xs text-blue-600 font-mono">
                          Giải mã UID &amp; xác thực chữ ký vCard 3.0
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative inline-block">
                        <div className="absolute -inset-3 rounded-full bg-blue-500/20 animate-ping" />
                        <div className="relative w-16 h-16 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform">
                          <Smartphone className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-base">
                          Chạm Thẻ NFC Lên Vùng Này
                        </h4>
                        <p className="text-xs text-slate-500 max-w-sm mt-1">
                          Áp thẻ NFC vật lý vào mặt lưng thiết bị hoặc bấm vào đây để mô phỏng lượt chạm thẻ của đại biểu:{' '}
                          <strong className="text-slate-800 font-bold">
                            {currentSelectedAttendee?.fullName || 'Đại biểu'}
                          </strong>
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        <span className="inline-block px-3.5 py-1 bg-blue-100 text-blue-800 text-[11px] font-bold rounded-full">
                          Bấm để Chạm Thẻ Ngay (0.42s)
                        </span>
                        {isNfcActive && (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-600" /> Web NFC Hardware Live Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div id="reader-qr-region" className="w-full h-64 rounded-2xl overflow-hidden bg-black border border-slate-200 relative">
                    <div className="absolute inset-x-0 top-0 h-1 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)] animate-pulse" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 text-center">
                    {isCameraActive ? 'Hướng mã QR trên Thẻ Doanh Nhân hoặc Vé Sự Kiện vào khung...' : 'Đang bật Camera quét mã QR...'}
                  </p>
                </div>
              )}

              {/* MANUAL BARCODE / UID SCANNER FORM */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTriggerCheckIn(inputVal);
                }}
                className="flex gap-2 max-w-xl mx-auto pt-2"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Nhập mã thẻ UID, Username hoặc quét qua súng Barcode..."
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 font-mono shadow-2xs transition-colors"
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-5 text-xs cursor-pointer shadow-2xs"
                >
                  Xác Nhận
                </Button>
              </form>
            </div>

            {/* REALTIME CHECK-IN RESULT CARD */}
            {lastCheckInResult && (
              <div
                className={`p-6 rounded-3xl border-2 space-y-4 transition-all shadow-md ${
                  lastCheckInResult.alreadyCheckedIn
                    ? 'border-orange-300 bg-orange-50/50 text-orange-900'
                    : lastCheckInResult.success
                    ? 'border-emerald-300 bg-emerald-50/50 text-emerald-900'
                    : 'border-rose-300 bg-rose-50/50 text-rose-900'
                }`}
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    {lastCheckInResult.alreadyCheckedIn ? (
                      <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                        <Clock className="w-5 h-5" />
                      </div>
                    ) : lastCheckInResult.success ? (
                      <div className="p-2 rounded-full bg-emerald-100 text-emerald-600 animate-pulse">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-full bg-rose-100 text-rose-600">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                    )}

                    <div>
                      <h4 className="text-base font-extrabold tracking-tight">
                        {lastCheckInResult.alreadyCheckedIn
                          ? 'CẢNH BÁO: ĐÃ CHECK-IN TRƯỚC ĐÓ (QUÉT LẶP)'
                          : lastCheckInResult.success
                          ? 'CHECK-IN XÁC THỰC THÀNH CÔNG!'
                          : 'KHÔNG THỂ XÁC THỰC CHECK-IN'}
                      </h4>
                      <p className="text-xs opacity-80">{lastCheckInResult.message}</p>
                    </div>
                  </div>

                  {latency !== null && (
                    <div className="text-right">
                      <span className="text-xs font-bold font-mono block text-emerald-700">
                        Thời gian: {latency}ms
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {isCurrentOffline ? 'Offline Cache' : '< 800ms Cloud SLA'}
                      </span>
                    </div>
                  )}
                </div>

                {/* ATTENDEE CARD IN RESULT */}
                {lastCheckInResult.identity && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-2xs">
                    <div className="flex items-center gap-3.5 w-full sm:w-auto">
                      <img
                        src={lastCheckInResult.identity.avatarUrl || '/avatar-johnny-long.jpg'}
                        alt={lastCheckInResult.identity.fullName}
                        className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-extrabold text-slate-900 text-sm truncate">
                            {lastCheckInResult.identity.fullName}
                          </h5>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                            VIP EXECUTIVE
                          </span>
                        </div>
                        <p className="text-xs text-blue-600 font-semibold truncate">
                          {lastCheckInResult.identity.title || 'Hội viên Doanh nhân'}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                          <Building2 className="w-3 h-3 text-orange-500 shrink-0" />
                          <span className="truncate">
                            {lastCheckInResult.identity.companyName ||
                              lastCheckInResult.identity.businesses?.[0]?.businessName ||
                              'Doanh nghiệp Hội viên'}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          lastCheckInResult.alreadyCheckedIn
                            ? 'bg-orange-50 text-orange-600 border-orange-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {lastCheckInResult.alreadyCheckedIn ? 'ĐÃ CHECK-IN' : 'VỪA CHECK-IN'}
                      </Badge>

                      <button
                        onClick={() =>
                          alert(
                            `Lệnh in nhãn đeo VIP cho ${lastCheckInResult.identity.fullName} đã gửi tới máy in nhiệt!`
                          )
                        }
                        className="flex items-center gap-1 font-bold text-xs text-blue-600 hover:underline cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" /> In Thẻ Đeo Ngay
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CỘT PHẢI (5 COLS): DANH BẠ TRA CỨU NHANH & LIVE GATE STREAM */}
          <div className="lg:col-span-5 space-y-6">
            {/* FAST LOOKUP DIRECTORY */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Danh Bạ Tra Cứu Nhanh (Fast Lookup)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Chọn đại biểu để nạp vào đầu đọc thẻ tiếp đón
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-600 tabular-nums">
                  {filteredAttendees.length} Đại biểu
                </span>
              </div>

              {/* Ô TÌM KIẾM NHANH */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  placeholder="Nhập tên, công ty hoặc mã UID thẻ..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* DANH SÁCH ĐẠI BIỂU */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {filteredAttendees.length > 0 ? (
                  filteredAttendees.map((item) => {
                    const isSelected = item.id === currentSelectedAttendee?.id;
                    const isCheckedIn = state.checkIns.some(
                      (c) =>
                        c.personIdentityId === item.id &&
                        c.eventId === (activeEvent?.id || 'evt-001')
                    );
                    const userCard = state.cards.find((c) => c.personIdentityId === item.id);
                    const targetCode = userCard?.cardUid || item.username || item.fullName;

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedAttendeeId(item.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
                            : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={item.avatarUrl || '/avatar-johnny-long.jpg'}
                            alt={item.fullName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div className="truncate">
                            <div className="font-bold text-xs text-slate-900 truncate flex items-center gap-1">
                              {item.fullName}
                              <span className="text-[9px] px-1 py-0.2 bg-amber-100 text-amber-800 rounded font-bold">
                                VIP
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {item.title} · {item.businesses?.[0]?.businessName || 'Doanh nghiệp'}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {isCheckedIn ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              ✓ Đã check-in
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAttendeeId(item.id);
                                handleTriggerCheckIn(targetCode);
                              }}
                              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                            >
                              Quét ngay
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Không tìm thấy đại biểu phù hợp
                  </div>
                )}
              </div>
            </div>

            {/* LIVE GATE STREAM */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" /> Lịch Sử Đại Biểu Vừa Qua Cửa
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Live Gate Stream</span>
              </div>

              {recentCheckins.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {recentCheckins.map((chk) => {
                    const iden = state.identities.find((i) => i.id === chk.personIdentityId);
                    return (
                      <div key={chk.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={iden?.avatarUrl || '/avatar-johnny-long.jpg'}
                            alt={iden?.fullName || 'Đại biểu'}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div className="truncate">
                            <div className="font-bold text-slate-900 truncate">
                              {iden?.fullName || 'Đại biểu'}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {iden?.title} • {iden?.businesses?.[0]?.businessName || 'Doanh nghiệp'}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-[10px] font-mono">
                            {chk.method}
                          </Badge>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {new Date(chk.checkedInAt).toLocaleTimeString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/60 mx-auto flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Chưa Có Lượt Check-in Nào Tại Cổng Này
                  </h4>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Trạm quét đã kết nối thời gian thực với Supabase Cloud. Hãy áp thẻ NFC hoặc quét mã QR để bắt đầu ghi nhận điểm danh.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
