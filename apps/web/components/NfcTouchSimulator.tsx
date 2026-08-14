'use client';

import React, { useState } from 'react';
import { Smartphone, Zap, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useOneConnectStore } from '@/lib/store';

interface Props {
  targetCardUid?: string;
  onSuccess?: (res: any) => void;
}

export default function NfcTouchSimulator({ targetCardUid = 'NFC-HA-777', onSuccess }: Props) {
  const { performCheckIn, requestConnection, state } = useOneConnectStore();
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const simulateTouch = () => {
    setIsScanning(true);
    setResult(null);

    setTimeout(() => {
      setIsScanning(false);
      // Determine action based on current role
      let res;
      if (state.currentRole === 'EVENT_OPERATOR') {
        const activeEvent = state.events[0];
        res = activeEvent ? performCheckIn(activeEvent.id, targetCardUid, 'NFC') : { success: false, message: 'No event' };
      } else {
        const targetIdentity = state.identities.find(i => i.username === 'nguyenthuha') || state.identities[1];
        res = targetIdentity ? requestConnection(targetIdentity.id) : { success: false, message: 'No identity' };
      }

      setResult(res);
      if (onSuccess) onSuccess(res);
    }, 800); // 800ms < 1s latency requirement!
  };

  return (
    <div className="glass-panel p-5 space-y-4 border-cyan-500/30">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white flex items-center gap-2 font-['Outfit']">
          <Smartphone className="w-4 h-4 text-cyan-400" /> Mô Phỏng Chạm Thẻ NFC 1-Chạm (0.8s)
        </h4>
        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
          NFC API Mock
        </span>
      </div>

      <p className="text-xs text-gray-300 leading-relaxed">
        Chạm thẻ NFC physical vào mặt lưng smartphone để thực hiện giao dịch (Điểm danh check-in hoặc Trao đổi Consent định danh số).
      </p>

      <div className="text-center py-4 bg-black/40 rounded-xl border border-white/10 relative overflow-hidden">
        {isScanning ? (
          <div className="space-y-3 py-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center animate-ping">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-xs text-cyan-300 font-mono animate-pulse">Đang truyền dữ liệu NFC (800ms)...</p>
          </div>
        ) : result ? (
          <div className="space-y-2 p-2">
            {result.success ? (
              <div className="text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> {result.message}
              </div>
            ) : (
              <div className="text-rose-400 text-xs font-semibold flex items-center justify-center gap-1.5">
                <AlertCircle className="w-5 h-5 text-rose-400" /> {result.message}
              </div>
            )}
            <button
              onClick={() => setResult(null)}
              className="mt-2 text-[11px] text-gray-400 hover:text-white underline flex items-center justify-center gap-1 mx-auto"
            >
              <RefreshCw className="w-3 h-3" /> Thử Chạm Thẻ Lần Nữa
            </button>
          </div>
        ) : (
          <button
            onClick={simulateTouch}
            className="btn-primary w-11/12 text-sm shadow-[0_0_20px_rgba(0,229,255,0.3)] animate-pulse-glow"
          >
            <Zap className="w-4 h-4" /> CHẠM THẺ NFC NGAY ({targetCardUid})
          </button>
        )}
      </div>
    </div>
  );
}
