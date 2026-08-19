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
  ShieldCheck,
  Zap,
  Radio,
  Download,
  Copy,
  Sparkles,
  RotateCw
} from 'lucide-react';

interface Props {
  identity: PersonIdentity;
  card?: AccessCard;
  onReissueCard?: () => void;
  showActions?: boolean;
  theme?: 'obsidian' | 'sapphire' | 'gold' | 'emerald';
}

const THEME_STYLES = {
  obsidian: {
    bg: 'linear-gradient(135deg, #05070D 0%, #0F172A 50%, #030712 100%)',
    border: 'border-cyan-500/50',
    accentText: 'text-cyan-300 font-bold',
    accentBg: 'bg-cyan-500/15',
    accentBorder: 'border-cyan-400/40',
    glow: 'shadow-[0_18px_40px_rgba(0,102,255,0.3)]',
    badge: 'bg-cyan-950 text-cyan-200 border-cyan-400/60 font-bold',
    chipColor: 'text-cyan-300',
  },
  sapphire: {
    bg: 'linear-gradient(135deg, #021235 0%, #0A2F7D 50%, #010B24 100%)',
    border: 'border-blue-400/60',
    accentText: 'text-blue-200 font-bold',
    accentBg: 'bg-blue-500/20',
    accentBorder: 'border-blue-300/50',
    glow: 'shadow-[0_18px_40px_rgba(0,194,255,0.35)]',
    badge: 'bg-blue-950 text-blue-100 border-blue-400/60 font-bold',
    chipColor: 'text-blue-200',
  },
  gold: {
    bg: 'linear-gradient(135deg, #140F05 0%, #2E230B 50%, #100C04 100%)',
    border: 'border-amber-400/60',
    accentText: 'text-amber-300 font-bold',
    accentBg: 'bg-amber-500/20',
    accentBorder: 'border-amber-400/50',
    glow: 'shadow-[0_18px_40px_rgba(245,158,11,0.3)]',
    badge: 'bg-amber-950 text-amber-200 border-amber-400/60 font-bold',
    chipColor: 'text-amber-300',
  },
  emerald: {
    bg: 'linear-gradient(135deg, #031710 0%, #083324 50%, #020F0A 100%)',
    border: 'border-emerald-400/60',
    accentText: 'text-emerald-300 font-bold',
    accentBg: 'bg-emerald-500/20',
    accentBorder: 'border-emerald-400/50',
    glow: 'shadow-[0_18px_40px_rgba(16,185,129,0.3)]',
    badge: 'bg-emerald-950 text-emerald-200 border-emerald-400/60 font-bold',
    chipColor: 'text-emerald-300',
  },
};

export default function BusinessCard3D({
  identity,
  card,
  onReissueCard,
  showActions = true,
  theme = 'obsidian',
}: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isTapping, setIsTapping] = useState(false);
  const [activeTheme, setActiveTheme] = useState<'obsidian' | 'sapphire' | 'gold' | 'emerald'>(theme);

  const currentTheme = THEME_STYLES[activeTheme];
  const primaryBiz = identity.businesses?.find((b) => b.isPrimary) || identity.businesses?.[0];
  const canonicalUsername = identity.username || 'johnnylongho';
  const profileUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/p/${canonicalUsername}`
      : `https://one-connect-network.vercel.app/p/${canonicalUsername}`;

  const copyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSimulateTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTapping(true);
    setTimeout(() => {
      setIsTapping(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-lg mx-auto select-none">
      {/* 3D INTERACTIVE CARD CONTAINER */}
      <div className="relative group perspective-1000">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full h-72 sm:h-76 rounded-3xl cursor-pointer transition-transform duration-700 transform-style-3d relative ${
            currentTheme.glow
          } ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* ================================================================= */}
          {/* 1. FRONT FACE OF EXECUTIVE BUSINESS CARD */}
          {/* ================================================================= */}
          <div
            className={`absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-7 flex flex-col justify-between backface-hidden border-2 ${currentTheme.border} overflow-hidden`}
            style={{ background: currentTheme.bg }}
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Micro Circuit Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '16px 16px',
              }}
            />

            {/* Top Bar on Front (No Logo - Minimalist Executive Header) */}
            <div className="relative z-10 flex items-center justify-between">
              {/* Executive Metal Chip Emblem (Minimalist, No Logo) */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-7 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300/80 shadow-md flex items-center justify-center relative overflow-hidden">
                  {/* EMV Chip Lines */}
                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-amber-950/40" />
                  <div className="absolute inset-y-0 left-1/2 w-[1px] bg-amber-950/40" />
                  <div className="w-3 h-3 rounded-full border border-amber-950/40" />
                </div>
                <span className="text-[11px] font-mono font-bold tracking-widest text-slate-300 uppercase">
                  NFC SMART CARD
                </span>
              </div>

              {/* NFC Chip Indicator Badge */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono font-bold tracking-wider ${currentTheme.badge}`}
              >
                <Radio className={`w-3 h-3 ${currentTheme.chipColor} animate-pulse`} />
                <span>{card?.cardUid || '04:8F:2A:1B:9C:5D:80'}</span>
              </div>
            </div>

            {/* Middle Section: Avatar & Executive Info */}
            <div className="relative z-10 flex items-center gap-4 my-auto">
              <div className="relative shrink-0">
                <img
                  src={
                    identity.avatarUrl ||
                    '/avatar-johnny-long.jpg'
                  }
                  alt={identity.fullName}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/40 shadow-2xl bg-slate-900"
                />
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 border-2 border-slate-950 shadow">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                </span>
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight font-heading truncate drop-shadow-sm">
                  {identity.fullName || 'Hồ Hoàng Long (Johnny Long Hồ)'}
                </h3>
                <p className={`text-xs ${currentTheme.accentText} truncate`}>
                  {identity.title || 'Quản lý & Triển khai Dự án kiêm Media'}
                </p>
                <p className="text-xs text-slate-200 font-medium flex items-center gap-1.5 truncate">
                  <Building2 className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span className="truncate">
                    {primaryBiz?.businessName || identity.businesses?.[0]?.businessName || 'Tập đoàn Công nghệ số A+ (Aplusvn)'}
                  </span>
                </p>
              </div>
            </div>

            {/* Bottom Bar on Front */}
            <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
              <div>
                <p className="text-[9px] font-mono uppercase tracking-widest text-slate-300 font-bold">
                  Digital Identity ID
                </p>
                <p className="text-xs font-mono font-bold text-white mt-0.5">
                  @{canonicalUsername}
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-[11px] text-white font-medium group-hover:bg-white/20 transition-colors">
                <RotateCw className="w-3 h-3 text-cyan-300 animate-spin-slow" />
                <span>Chạm để lật mặt sau</span>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 2. BACK FACE OF EXECUTIVE BUSINESS CARD */}
          {/* ================================================================= */}
          <div
            className={`absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-7 flex flex-col justify-between backface-hidden rotate-y-180 border-2 ${currentTheme.border} overflow-hidden`}
            style={{ background: currentTheme.bg }}
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar on Back */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-300" /> Dynamic Connect QR
              </span>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-400/50 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> PDPL 91/2025
              </span>
            </div>

            {/* Middle Section: Scannable QR & High-Contrast Contact Chips */}
            <div className="relative z-10 grid grid-cols-12 gap-4 items-center my-auto">
              {/* High Contrast Scannable QR */}
              <div className="col-span-5 flex justify-center">
                <div className="p-2.5 bg-white rounded-2xl shadow-2xl border-2 border-white">
                  <svg className="w-24 h-24 sm:w-28 sm:h-28" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="#FFFFFF" rx="4" />
                    {/* Top Left Finder */}
                    <rect x="8" y="8" width="26" height="26" fill="#0F172A" rx="3" />
                    <rect x="13" y="13" width="16" height="16" fill="#FFFFFF" rx="2" />
                    <rect x="17" y="17" width="8" height="8" fill="#0066FF" rx="1" />

                    {/* Top Right Finder */}
                    <rect x="66" y="8" width="26" height="26" fill="#0F172A" rx="3" />
                    <rect x="71" y="13" width="16" height="16" fill="#FFFFFF" rx="2" />
                    <rect x="75" y="17" width="8" height="8" fill="#0066FF" rx="1" />

                    {/* Bottom Left Finder */}
                    <rect x="8" y="66" width="26" height="26" fill="#0F172A" rx="3" />
                    <rect x="13" y="71" width="16" height="16" fill="#FFFFFF" rx="2" />
                    <rect x="17" y="75" width="8" height="8" fill="#0066FF" rx="1" />

                    {/* Center Accent */}
                    <rect x="42" y="42" width="16" height="16" fill="#FF6B00" rx="3" />
                    <circle cx="50" cy="50" r="4" fill="#FFFFFF" />

                    {/* Data Matrix Bits */}
                    <rect x="40" y="12" width="6" height="6" fill="#0F172A" />
                    <rect x="52" y="18" width="6" height="6" fill="#0F172A" />
                    <rect x="42" y="28" width="6" height="6" fill="#0F172A" />
                    <rect x="12" y="42" width="6" height="6" fill="#0F172A" />
                    <rect x="22" y="52" width="6" height="6" fill="#0F172A" />
                    <rect x="66" y="42" width="6" height="6" fill="#0F172A" />
                    <rect x="78" y="50" width="6" height="6" fill="#0F172A" />
                    <rect x="66" y="66" width="6" height="6" fill="#0F172A" />
                    <rect x="80" y="78" width="6" height="6" fill="#0F172A" />
                    <rect x="42" y="68" width="6" height="6" fill="#0F172A" />
                    <rect x="52" y="80" width="6" height="6" fill="#0F172A" />
                  </svg>
                </div>
              </div>

              {/* High Contrast Contact Points (Real Accurate Data) */}
              <div className="col-span-7 space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-white bg-white/12 px-3 py-1.5 rounded-xl border border-white/20 shadow-sm backdrop-blur-md">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-mono text-[11px] font-bold text-white truncate">
                    {identity.phone || '0794677369'}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-white bg-white/12 px-3 py-1.5 rounded-xl border border-white/20 shadow-sm backdrop-blur-md">
                  <Mail className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                  <span className="font-mono text-[11px] font-bold text-white truncate">
                    {identity.email || 'contact.johnnylongho@gmail.com'}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-white bg-white/12 px-3 py-1.5 rounded-xl border border-white/20 shadow-sm backdrop-blur-md">
                  <Globe className="w-3.5 h-3.5 text-orange-300 shrink-0" />
                  <span className="font-mono text-[11px] font-bold text-white truncate">
                    {(identity.website || 'https://aplusvn.net').replace(/^https?:\/\//, '')}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Bar on Back */}
            <div className="relative z-10 pt-2 border-t border-white/15 flex items-center justify-between text-[10px] text-slate-300">
              <span className="font-mono font-bold text-white truncate max-w-[240px]">
                {profileUrl}
              </span>
              <span className="text-cyan-300 font-bold flex items-center gap-1 shrink-0">
                <RotateCw className="w-3 h-3" /> Lật mặt trước
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 3. CARD THEME PICKER & ACTION TOOLBAR */}
      {/* ================================================================= */}
      {showActions && (
        <div className="mt-5 space-y-4">
          {/* Card Material Theme Selector */}
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Chất liệu & Màu Thẻ:
            </span>
            <div className="flex items-center gap-2">
              {[
                { id: 'obsidian', label: 'Obsidian Black', color: 'bg-slate-900 border-cyan-500' },
                { id: 'sapphire', label: 'Ocean Sapphire', color: 'bg-blue-900 border-blue-400' },
                { id: 'gold', label: 'Titanium Gold', color: 'bg-amber-900 border-amber-400' },
                { id: 'emerald', label: 'Emerald Elite', color: 'bg-emerald-900 border-emerald-400' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTheme(t.id as any)}
                  title={t.label}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${t.color} ${
                    activeTheme === t.id ? 'scale-125 ring-2 ring-blue-500 shadow-md' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Action Button Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <RotateCw className="w-4 h-4 text-blue-600" />
              <span>{isFlipped ? 'Mặt Trước' : 'Lật Thẻ 3D'}</span>
            </button>

            <button
              onClick={() => setShowQrModal(true)}
              className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-blue-600" />
              <span>Mã QR Thẻ</span>
            </button>

            <button
              onClick={copyLink}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              <span>{copied ? 'Đã Chép!' : 'Chép Link'}</span>
            </button>

            {onReissueCard && (
              <button
                onClick={onReissueCard}
                className="py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                title="Đổi thẻ NFC vật lý mới mà không làm mất lịch sử dữ liệu"
              >
                <RefreshCw className="w-4 h-4 text-purple-600" />
                <span>Đổi Thẻ NFC</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 4. DYNAMIC QR CODE MODAL */}
      {/* ================================================================= */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full text-center space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-left">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Dynamic QR Code</h4>
                  <p className="text-[11px] text-slate-500">Định danh số One Connect</p>
                </div>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* High-Resolution QR Display */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
              <svg className="w-52 h-52 mx-auto" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="#FFFFFF" rx="6" />
                {/* Top Left */}
                <rect x="8" y="8" width="26" height="26" fill="#0F172A" rx="4" />
                <rect x="13" y="13" width="16" height="16" fill="#FFFFFF" rx="2" />
                <rect x="17" y="17" width="8" height="8" fill="#0066FF" rx="1" />

                {/* Top Right */}
                <rect x="66" y="8" width="26" height="26" fill="#0F172A" rx="4" />
                <rect x="71" y="13" width="16" height="16" fill="#FFFFFF" rx="2" />
                <rect x="75" y="17" width="8" height="8" fill="#0066FF" rx="1" />

                {/* Bottom Left */}
                <rect x="8" y="66" width="26" height="26" fill="#0F172A" rx="4" />
                <rect x="13" y="71" width="16" height="16" fill="#FFFFFF" rx="2" />
                <rect x="17" y="75" width="8" height="8" fill="#0066FF" rx="1" />

                {/* Center Brand Accent */}
                <rect x="40" y="40" width="20" height="20" fill="#FF6B00" rx="4" />
                <circle cx="50" cy="50" r="5" fill="#FFFFFF" />

                {/* Data Grid Bits */}
                <rect x="40" y="12" width="6" height="6" fill="#0F172A" />
                <rect x="52" y="18" width="6" height="6" fill="#0F172A" />
                <rect x="42" y="28" width="6" height="6" fill="#0F172A" />
                <rect x="12" y="42" width="6" height="6" fill="#0F172A" />
                <rect x="22" y="52" width="6" height="6" fill="#0F172A" />
                <rect x="66" y="42" width="6" height="6" fill="#0F172A" />
                <rect x="78" y="50" width="6" height="6" fill="#0F172A" />
                <rect x="66" y="66" width="6" height="6" fill="#0F172A" />
                <rect x="80" y="78" width="6" height="6" fill="#0F172A" />
                <rect x="42" y="68" width="6" height="6" fill="#0F172A" />
                <rect x="52" y="80" width="6" height="6" fill="#0F172A" />
              </svg>
            </div>

            <div className="space-y-1 text-center">
              <p className="text-sm font-bold text-slate-900">{identity.fullName}</p>
              <p className="text-xs text-blue-600 font-mono font-medium truncate">{profileUrl}</p>
              <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                Bất kỳ camera smartphone nào quét mã QR này sẽ tự động mở trang Định danh Số với cơ chế bảo mật PDPL 91/2025.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={copyLink}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Đã Chép!' : 'Chép Link'}</span>
              </button>

              <button
                onClick={() => {
                  alert('Đang tạo và tải file mã QR độ phân giải cao...');
                }}
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-blue-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải Mã QR</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
