'use client';

import React, { useState } from 'react';
import { PersonIdentity, AccessCard } from '@/lib/types';
import {
  CreditCard,
  QrCode,
  Globe,
  Phone,
  Mail,
  Building2,
  Share2,
  RefreshCw,
  CheckCircle2,
  Lock,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface Props {
  identity: PersonIdentity;
  card?: AccessCard;
  onReissueCard?: () => void;
  showActions?: boolean;
}

export default function BusinessCard3D({ identity, card, onReissueCard, showActions = true }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const primaryBiz = identity.businesses.find(b => b.isPrimary) || identity.businesses[0];
  const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/p/${identity.username}` : `https://oneconnect.network/p/${identity.username}`;

  const copyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 3D Glass Executive Business Card */}
      <div className="relative group perspective-1000">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full h-64 rounded-2xl cursor-pointer transition-all duration-700 transform-style-3d shadow-[0_15px_40px_rgba(0,0,0,0.6)] border border-cyan-500/30 overflow-hidden relative ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(15, 23, 42, 0.98) 100%)',
          }}
        >
          {/* Card Front Ambient Decorative Elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          {/* NFC Chip Indicator Icon */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-mono font-bold tracking-wider">
            <CreditCard className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            NFC {card?.cardUid || 'ACTIVE'}
          </div>

          {/* FRONT FACE */}
          <div className="p-6 h-full flex flex-col justify-between relative z-10">
            <div>
              <div className="flex items-center gap-4">
                <img
                  src={identity.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={identity.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                />
                <div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight font-['Outfit'] flex items-center gap-1.5">
                    {identity.fullName}
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  </h3>
                  <p className="text-xs text-cyan-300 font-medium">{identity.title}</p>
                  {primaryBiz && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" /> {primaryBiz.businessName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs text-gray-300">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-mono">Định danh số One Connect</p>
                <p className="font-mono text-cyan-400 font-semibold">@{identity.username}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500">Chạm thẻ / Quét QR</p>
                <span className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1 justify-end">
                  <QrCode className="w-3.5 h-3.5" /> Xem Mặt Sau (Lật)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Below Card */}
      {showActions && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            onClick={() => setShowQrModal(true)}
            className="py-2.5 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <QrCode className="w-4 h-4 text-cyan-400" /> Mã QR Thẻ
          </button>
          
          <button
            onClick={copyLink}
            className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Share2 className="w-4 h-4 text-indigo-400" /> {copied ? 'Đã Chép Link!' : 'Chia Sẻ'}
          </button>

          {onReissueCard && (
            <button
              onClick={onReissueCard}
              className="py-2.5 px-3 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
              title="Đổi thẻ NFC mới mà không mất dữ liệu lịch sử"
            >
              <RefreshCw className="w-4 h-4 text-purple-400" /> Đổi Thẻ NFC
            </button>
          )}
        </div>
      )}

      {/* QR Code Dynamic Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={() => setShowQrModal(false)}>
          <div className="bg-[#0f172a] border border-cyan-500/40 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <QrCode className="w-5 h-5 text-cyan-400" /> Dynamic QR Code — One Connect
              </h4>
              <button onClick={() => setShowQrModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="p-4 bg-white rounded-2xl inline-block shadow-[0_0_25px_rgba(0,229,255,0.3)]">
              {/* Render dynamic QR code SVG simulation */}
              <svg className="w-48 h-48 mx-auto" viewBox="0 0 100 100">
                <path d="M0,0 L30,0 L30,30 L0,30 Z M70,0 L100,0 L100,30 L70,30 Z M0,70 L30,70 L30,100 L0,100 Z" fill="#000" />
                <path d="M5,5 L25,5 L25,25 L5,25 Z M75,5 L95,5 L95,25 L75,25 Z M5,75 L25,75 L25,95 L5,95 Z" fill="#fff" />
                <rect x="40" y="40" width="20" height="20" fill="#00e5ff" />
                <path d="M35,10 L65,10 L65,25 L35,25 Z M10,35 L25,35 L25,65 L10,65 Z M75,35 L90,35 L90,65 L75,65 Z M35,75 L65,75 L65,90 L35,90 Z" fill="#111" />
              </svg>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">{identity.fullName}</p>
              <p className="text-xs text-cyan-400 font-mono">{card?.dynamicUrl || profileUrl}</p>
              <p className="text-[11px] text-gray-400 pt-2">
                Bất kỳ camera điện thoại nào quét mã này sẽ mở trực tiếp Hồ sơ Định danh Số One Connect với ma sát bằng 0.
              </p>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 transition-colors"
            >
              Đóng Mã QR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
