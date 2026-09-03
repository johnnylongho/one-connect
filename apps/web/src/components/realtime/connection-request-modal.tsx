'use client';

import React, { useEffect, useState } from 'react';
import { useOneConnectStore } from '@/lib/store';
import { Sparkles, UserCheck, ShieldCheck, X, Check, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RealtimeConnectionModal() {
  const { state, acceptConnection, rejectConnection, clearIncomingRequest } = useOneConnectStore();
  const incoming = state.incomingRequest;
  const [acceptedToast, setAcceptedToast] = useState<string | null>(null);

  useEffect(() => {
    if (incoming) {
      // Haptic feedback on mobile if supported
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([100, 50, 150]);
        } catch (e) {
          // ignore
        }
      }
    }
  }, [incoming]);

  if (acceptedToast) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-md w-full bg-emerald-950/90 border border-emerald-500/40 backdrop-blur-xl rounded-2xl p-4 shadow-2xl shadow-emerald-950/80 text-white flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0 text-emerald-400">
          <UserCheck className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Đã chấp thuận kết nối</p>
          <p className="text-sm font-medium text-slate-200 truncate">{acceptedToast}</p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setAcceptedToast(null)}
          className="text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  if (!incoming) return null;

  const handleAccept = () => {
    if (!incoming) return;
    const reqId = incoming.id;
    const partnerName = incoming.requesterName;
    clearIncomingRequest();
    acceptConnection(reqId);
    setAcceptedToast(`Đã thiết lập liên kết thành công với ${partnerName}.`);
    setTimeout(() => setAcceptedToast(null), 4000);
  };

  const handleReject = () => {
    if (!incoming) return;
    const reqId = incoming.id;
    clearIncomingRequest();
    rejectConnection(reqId);
  };

  return (
    <div className="fixed inset-x-4 top-6 md:top-8 md:right-8 md:left-auto md:max-w-md z-50 animate-in fade-in slide-in-from-top-6 duration-300">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-cyan-500/40 p-5 shadow-2xl shadow-cyan-950/60 backdrop-blur-2xl text-white ring-1 ring-white/10">
        {/* Glowing top line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
            <BellRing className="w-3.5 h-3.5 animate-bounce text-cyan-300" />
            <span>Yêu cầu kết nối Realtime</span>
          </div>
          <button
            onClick={clearIncomingRequest}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            title="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3.5 my-3">
          {incoming.requesterAvatar ? (
            <img
              src={incoming.requesterAvatar}
              alt={incoming.requesterName}
              className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400/50 shadow-md shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-white text-base shadow-md shrink-0">
              {incoming.requesterName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="text-base font-bold text-white tracking-tight truncate">
              {incoming.requesterName}
            </h4>
            <p className="text-xs text-slate-300 truncate">
              {incoming.requesterTitle || 'Đại diện Doanh nghiệp Hội viên'}
            </p>
            <p className="text-[11px] text-cyan-300/90 mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              <span>Chạm thẻ NFC • Chờ phê duyệt Consent</span>
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-4 bg-slate-950/50 p-2.5 rounded-xl border border-white/5 leading-relaxed">
          Đối tác muốn trao đổi danh thiếp số và lưu trữ thông tin liên hệ bảo mật với bạn theo chuẩn Luật PDPL 91/2025.
        </p>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleAccept}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-xs py-2 rounded-xl shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Chấp nhận kết nối</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleReject}
            className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs py-2 px-3 rounded-xl cursor-pointer"
          >
            Từ chối
          </Button>
        </div>
      </div>
    </div>
  );
}
