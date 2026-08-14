'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useOneConnectStore } from '@/lib/store';
import {
  Zap,
  QrCode,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Search,
  Users,
  Volume2,
  VolumeX,
  RefreshCw,
  Building2,
  UserCheck,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Html5Qrcode } from 'html5-qrcode';

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

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Web Audio API Sound Synthesizer for Zero External Sound File Dependency
  const playSoundEffect = (type: 'SUCCESS' | 'DUPLICATE' | 'ERROR') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'SUCCESS') {
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
    } catch (e) {
      // AudioContext fallback
    }
  };

  const handleTriggerCheckIn = async (targetCode: string) => {
    if (!targetCode.trim()) return;

    const startTime = performance.now();
    let res: any;

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
          message: data.message || 'Xác thực check-in thành công!',
        };
      } else {
        res = performCheckIn(activeEvent?.id || 'evt-001', targetCode.trim(), mode);
      }
    } catch (err) {
      res = performCheckIn(activeEvent?.id || 'evt-001', targetCode.trim(), mode);
    }

    const endTime = performance.now();
    const calculatedLatency = Math.round(endTime - startTime);
    setLatency(calculatedLatency);

    setLastCheckInResult(res);
    setInputVal('');

    if (res.alreadyCheckedIn) {
      playSoundEffect('DUPLICATE');
    } else if (res.success) {
      playSoundEffect('SUCCESS');
    } else {
      playSoundEffect('ERROR');
    }
  };

  // Hardware Web NFC API
  useEffect(() => {
    let ndef: any = null;
    let abortController: AbortController | null = null;

    if (mode === 'NFC' && typeof window !== 'undefined' && 'NDEFReader' in window) {
      try {
        const NDEFReaderClass = (window as any).NDEFReader;
        ndef = new NDEFReaderClass();
        abortController = new AbortController();

        ndef
          .scan({ signal: abortController.signal })
          .then(() => {
            setIsNfcActive(true);
            ndef.addEventListener('reading', ({ serialNumber, message }: any) => {
              let tagData = serialNumber || '';
              for (const record of message.records) {
                if (record.recordType === 'text') {
                  const textDecoder = new TextDecoder(record.encoding);
                  tagData = textDecoder.decode(record.data);
                } else if (record.recordType === 'url') {
                  const textDecoder = new TextDecoder();
                  tagData = textDecoder.decode(record.data);
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
      } catch (e) {
        setIsNfcActive(false);
      }
    }

    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [mode]);

  // QR Code Scanner Effect
  useEffect(() => {
    if (mode === 'QR') {
      const html5QrCode = new Html5Qrcode('reader-qr-region');
      html5QrCodeRef.current = html5QrCode;

      html5QrCode
        .start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* 1. TOP HEADER BRAND BANNER (LIGHT THEME) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors text-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="relative p-[1.5px] rounded-xl bg-gradient-to-r from-[#0066FF] to-[#FF6B00] shadow-sm shrink-0">
            <div className="bg-white px-2 py-1 rounded-[10px] flex items-center justify-center">
              <img
                src="/one_connect_final_logo_orange.png"
                alt="One Connect Logo"
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-['Outfit']">
                Trạm Check-in Siêu Tốc
              </h1>
              <Badge className="bg-blue-50 text-[#0066FF] border-blue-200 text-[10px] font-bold">
                SLA &lt; 0.5s
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 font-medium italic">
              One Identity, Connect Everywhere.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title={soundEnabled ? 'Tắt âm thanh báo' : 'Bật âm thanh báo'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#0066FF]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <div className="flex flex-col items-end text-xs">
            <span className="text-slate-400 text-[10px]">Đã Điểm Danh Live</span>
            <span suppressHydrationWarning className="font-mono font-bold text-[#0066FF]">
              {mounted ? `${activeEvent?.checkInCount || 3} / ${activeEvent?.registrationCount || 5}` : '3 / 5'}
            </span>
          </div>
        </div>
      </div>

      <main className="space-y-6">
        {/* 2. MODE SELECTOR BAR */}
        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={() => setMode('NFC')}
            className={`gap-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${
              mode === 'NFC'
                ? 'bg-gradient-to-r from-[#0066FF] to-[#00C2FF] text-white shadow-md shadow-blue-500/20 border-0'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Smartphone className="w-4 h-4" /> Chạm Thẻ NFC
          </Button>

          <Button
            onClick={() => setMode('QR')}
            className={`gap-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${
              mode === 'QR'
                ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF9900] text-white shadow-md shadow-orange-500/20 border-0'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <QrCode className="w-4 h-4" /> Quét Camera Dynamic QR
          </Button>
        </div>

        {/* 3. TERMINAL SCANNER CONTAINER */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-6 shadow-sm relative overflow-hidden">
          {/* Scanner Viewport */}
          <div className="relative max-w-sm mx-auto p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            {mode === 'NFC' ? (
              <div className="py-8 space-y-3">
                <div className="relative inline-block">
                  <div className="p-4 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 shadow-md">
                    <Smartphone className="w-10 h-10 animate-bounce" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-700">
                    Sẵn sàng đọc thẻ NFC! Chạm Thẻ Doanh Nhân Số vào đầu đọc...
                  </p>
                  {isNfcActive && (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" /> Web NFC Hardware Active (Live Sensor)
                    </Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div id="reader-qr-region" className="w-full h-56 rounded-xl overflow-hidden bg-black border border-slate-200" />
                <p className="text-xs font-semibold text-slate-700">
                  {isCameraActive ? 'Camera đang hoạt động. Hướng mã QR vào khung...' : 'Đang bật Camera quét mã QR...'}
                </p>
              </div>
            )}

            {/* Simulation Quick Tap Buttons */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <span className="text-[10px] text-slate-500 font-mono block uppercase tracking-wider font-bold">
                Mô Phỏng Nhanh Lượt Quét (Bấm Thử Nghiệm):
              </span>
              <div suppressHydrationWarning className="flex flex-wrap justify-center gap-1.5 min-h-[32px]">
                {mounted &&
                  state.cards.slice(0, 5).map((c) => {
                    const iden = state.identities.find((i) => i.id === c.personIdentityId);
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleTriggerCheckIn(c.cardUid)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[11px] font-mono text-[#0066FF] transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <Zap className="w-3 h-3 text-[#FF6B00]" />
                        {iden?.fullName.split(' ')[0] || c.cardUid}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Manual Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTriggerCheckIn(inputVal);
            }}
            className="flex gap-2 max-w-md mx-auto"
          >
            <input
              type="text"
              placeholder="Nhập thủ công Mã QR, UID Thẻ hoặc Username..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 font-mono shadow-sm"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-gradient-to-r from-[#0066FF] to-[#FF6B00] hover:opacity-90 text-white font-bold rounded-xl px-4 cursor-pointer shadow-sm"
            >
              Check-in
            </Button>
          </form>
        </div>

        {/* 4. REALTIME CHECK-IN RESULT CARD WITH ATTENDEE DETAILS */}
        {lastCheckInResult && (
          <div
            className={`p-6 rounded-3xl border-2 space-y-4 text-center transition-all shadow-md ${
              lastCheckInResult.alreadyCheckedIn
                ? 'border-orange-300 bg-orange-50/50 text-orange-900'
                : lastCheckInResult.success
                ? 'border-emerald-300 bg-emerald-50/50 text-emerald-900'
                : 'border-rose-300 bg-rose-50/50 text-rose-900'
            }`}
          >
            {/* Status Header */}
            <div className="flex items-center justify-center gap-2.5">
              {lastCheckInResult.alreadyCheckedIn ? (
                <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                  <Clock className="w-6 h-6" />
                </div>
              ) : lastCheckInResult.success ? (
                <div className="p-2 rounded-full bg-emerald-100 text-emerald-600 animate-pulse">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="p-2 rounded-full bg-rose-100 text-rose-600">
                  <AlertCircle className="w-6 h-6" />
                </div>
              )}

              <h3 className="text-lg sm:text-xl font-black font-['Outfit']">
                {lastCheckInResult.alreadyCheckedIn
                  ? 'CẢNH BÁO: ĐÃ CHECK-IN TRƯỚC ĐÓ (QUÉT LẶP)'
                  : lastCheckInResult.success
                  ? 'CHECK-IN XÁC THỰC THÀNH CÔNG!'
                  : 'KHÔNG THỂ XÁC THỰC CHECK-IN'}
              </h3>
            </div>

            {/* Attendee Info Card */}
            {lastCheckInResult.identity && (
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4 text-left max-w-md mx-auto shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      lastCheckInResult.identity.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                    }
                    alt={lastCheckInResult.identity.fullName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-sm"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {lastCheckInResult.identity.fullName}
                    </h4>
                    <p className="text-xs text-[#0066FF] font-medium">
                      {lastCheckInResult.identity.title}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-[#FF6B00]" />
                      {lastCheckInResult.identity.companyName || 'Doanh nghiệp Hội viên'}
                    </p>
                  </div>
                </div>

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
              </div>
            )}

            <p className="text-xs font-medium text-slate-700">{lastCheckInResult.message}</p>

            {latency !== null && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-mono text-slate-600 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#0066FF]" /> Tốc Độ Phản Hồi:{' '}
                <strong className="text-[#0066FF]">{latency}ms</strong> (&lt; 500ms SLA Target)
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
