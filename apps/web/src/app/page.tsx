'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useOneConnectStore } from '@/lib/store';
import {
  Zap,
  ShieldCheck,
  TrendingUp,
  Smartphone,
  Layers,
  Lock,
  Play,
  QrCode,
  Check,
  Sparkles,
  ArrowRight,
  Radio,
  Unlock,
  Tag,
  RefreshCw,
  MessageSquare,
  Menu,
  X,
  ChevronDown,
  Building2,
  CreditCard,
  Download,
  Users,
  Calendar,
  Activity,
  CheckCircle2,
  ArrowUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const { state } = useOneConnectStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active Interactive Tab
  const [activeTab, setActiveTab] = useState<'checkin' | 'consent' | 'crm'>('checkin');

  // Simulator 1: Fast Check-in state
  const [checkinScanning, setCheckinScanning] = useState(false);
  const [checkinSuccess, setCheckinSuccess] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(148);

  // Simulator 2: 2-Way Consent state
  const [consentGranted, setConsentGranted] = useState(false);

  // Simulator 3: CRM Lead Classification
  const [leadStatus, setLeadStatus] = useState<'WARM' | 'HOT' | 'CONVERTED'>('HOT');
  const [noteText, setNoteText] = useState(
    'Gặp gỡ đại diện đối tác tại diễn đàn. Nhu cầu triển khai 500 thẻ NFC kết nối cho đội ngũ kinh doanh trong Q3.'
  );

  // ROI Calculator State
  const [attendeesPerEvent, setAttendeesPerEvent] = useState(300);
  const [eventsPerYear, setEventsPerYear] = useState(12);

  // Calculate ROI
  const totalDelegates = attendeesPerEvent * eventsPerYear;
  const paperCostSaved = totalDelegates * 25000; // 25k VND per printed packet + badge
  const co2SavedKg = Math.round(totalDelegates * 0.18);
  const checkinHoursSaved = Math.round((totalDelegates * 25) / 3600); // 25s saved per delegate

  const handleSimulateCheckin = () => {
    setCheckinScanning(true);
    setCheckinSuccess(false);
    setTimeout(() => {
      setCheckinScanning(false);
      setCheckinSuccess(true);
      setAttendeeCount((prev) => prev + 1);
    }, 380);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] text-slate-900 antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden relative font-sans">
      
      {/* Background Liquid Mesh Gradient Blurs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-br from-blue-400/15 via-cyan-300/15 to-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute top-[35%] -left-40 w-[600px] h-[500px] bg-blue-300/10 rounded-full blur-3xl" />
        <div className="absolute top-[60%] -right-40 w-[600px] h-[500px] bg-cyan-400/10 rounded-full blur-3xl" />
      </div>

      {/* ================================================================= */}
      {/* 1. DEEP MIDNIGHT NAVY GLASS HEADER (HIGH CONTRAST & ACCENT) */}
      {/* ================================================================= */}
      <header className="sticky top-0 z-50 bg-[#0A1124]/95 backdrop-blur-2xl border-b border-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.18)] transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 sm:h-18 px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo - Transparent Isolated PNG with Cache Buster */}
          <Link href="/" className="flex items-center group select-none shrink-0" title="One Connect Network">
            <img
              src="/brand_logo_transparent.png?v=20260904"
              alt="One Connect Logo"
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-300">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              Tính Năng
            </button>
            <button
              onClick={() => scrollToSection('checkin')}
              className="hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              Check-in Sự Kiện
            </button>
            <button
              onClick={() => scrollToSection('security')}
              className="hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              Bảo Mật PDPL 91
            </button>
            <button
              onClick={() => scrollToSection('roi')}
              className="hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              Hiệu Quả (ROI)
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              Báo Giá
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => scrollToSection('features')}
              className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              Tìm hiểu thêm
            </button>

            {/* Primary Action: Trải nghiệm dự án -> /login */}
            <Link href="/login">
              <Button
                size="sm"
                className="gap-1.5 bg-gradient-to-r from-[#0066FF] to-[#0052CC] hover:from-blue-600 hover:to-blue-700 text-white font-extrabold rounded-xl text-xs h-9 px-4 shadow-sm shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Trải nghiệm dự án
              </Button>
            </Link>

            {/* Login / Dashboard Link */}
            {state.currentIdentityId ? (
              <Link href="/dashboard">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 border-slate-700 bg-slate-800/90 text-slate-100 hover:bg-slate-700 font-bold rounded-xl text-xs h-9 px-3.5 cursor-pointer shadow-2xs"
                >
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  Vào Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-xs h-9 px-3.5 cursor-pointer shadow-2xs"
                >
                  Đăng nhập
                </Button>
              </Link>
            )}

            {!state.currentIdentityId && (
              <Link href="/register">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-white/10 font-bold rounded-xl text-xs h-9 px-3 cursor-pointer"
                >
                  Đăng ký
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/80 lg:hidden cursor-pointer touch-manipulation"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#0A1124]/98 backdrop-blur-2xl py-4 px-4 space-y-2.5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            <button
              onClick={() => scrollToSection('features')}
              className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 rounded-xl"
            >
              Tính Năng Cốt Lõi
            </button>
            <button
              onClick={() => scrollToSection('checkin')}
              className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 rounded-xl"
            >
              Check-in Sự Kiện
            </button>
            <button
              onClick={() => scrollToSection('security')}
              className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 rounded-xl"
            >
              Bảo Mật PDPL 91
            </button>
            <button
              onClick={() => scrollToSection('roi')}
              className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 rounded-xl"
            >
              Tính Hiệu Quả (ROI)
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 rounded-xl"
            >
              Báo Giá
            </button>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link href="/login" className="w-full">
                <Button className="w-full gap-2 bg-[#0066FF] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs h-11 shadow-sm">
                  <Sparkles className="w-4 h-4" /> Trải nghiệm dự án
                </Button>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full border-slate-700 bg-slate-800/80 text-white font-bold rounded-xl text-xs h-10">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button variant="ghost" className="w-full bg-slate-800/50 hover:bg-slate-800 text-slate-200 font-bold rounded-xl text-xs h-10">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ================================================================= */}
      {/* 2. LIQUID GLASS HERO SECTION (EXPANDED TEXT BOX & BALANCED UI) */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden pt-10 pb-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 w-full max-w-5xl mx-auto">
          
          {/* Glass Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-blue-200/80 text-[#0055EE] text-[10px] xs:text-[11px] sm:text-xs font-extrabold tracking-tight shadow-xs whitespace-nowrap max-w-full">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="whitespace-nowrap">Hạ Tầng Định Danh Số B2B &amp; Quản Trị Sự Kiện MICE Thông Minh</span>
          </div>

          {/* Broad Headline Container - Ensures Headline Stays on Single Lines */}
          <div className="w-full max-w-6xl space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[48px] font-black text-slate-950 tracking-tight leading-tight font-heading sm:whitespace-nowrap">
              Kết Nối Doanh Nghiệp Thông Minh
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] xl:text-[42px] font-extrabold text-[#0066FF] tracking-tight leading-tight font-heading sm:whitespace-nowrap">
              Chạm 1 Giây, Giao Thương Bền Vững
            </p>
          </div>

          {/* High Contrast Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-700 font-medium leading-relaxed max-w-3xl">
            <strong>One Connect Network</strong> là giải pháp danh thiếp số thông minh NFC/QR tích hợp trạm Check-in sự kiện MICE và CRM quan hệ đối tác, tiên phong bảo mật 2 chiều tuân thủ nghiêm ngặt <strong>Luật Dữ liệu Cá nhân 91/2025/QH15</strong>.
          </p>

          {/* Action CTAs: Full width on mobile, inline on desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto pt-2">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto gap-2 bg-[#0066FF] hover:bg-blue-700 text-white font-extrabold rounded-2xl text-sm h-12 px-7 shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" /> Trải Nghiệm Dự Án Ngay
              </Button>
            </Link>

            <button
              onClick={() => scrollToSection('features')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-300 bg-white/90 backdrop-blur-md hover:bg-white text-slate-800 font-bold rounded-2xl text-sm h-12 px-6 transition-all shadow-xs cursor-pointer"
            >
              <span>Tìm Hiểu Tính Năng</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="ghost"
                className="w-full sm:w-auto gap-1.5 text-slate-700 hover:text-slate-950 hover:bg-slate-100 font-bold text-sm h-12 px-5 cursor-pointer"
              >
                Đăng ký tài khoản <ArrowRight className="w-4 h-4 text-slate-500" />
              </Button>
            </Link>
          </div>

          {/* Liquid Glass Metric Strip */}
          <div className="w-full max-w-4xl bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-[0_8px_32px_0_rgba(0,102,255,0.06)] p-5 sm:p-7 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
              <div className="pt-2 sm:pt-0 sm:px-3 text-center">
                <div className="text-2xl sm:text-3xl font-black text-[#0066FF] font-heading">&lt; 0.42s</div>
                <div className="text-xs text-slate-700 font-bold mt-1">Tốc độ chạm NFC</div>
                <div className="text-[11px] text-slate-500 font-medium">Không cần tải App</div>
              </div>
              <div className="pt-2 sm:pt-0 sm:px-3 text-center">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-heading">100%</div>
                <div className="text-xs text-slate-700 font-bold mt-1">Chuẩn Luật PDPL 91</div>
                <div className="text-[11px] text-slate-500 font-medium">Đồng thuận 2 chiều</div>
              </div>
              <div className="pt-2 sm:pt-0 sm:px-3 text-center">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">85%</div>
                <div className="text-xs text-slate-700 font-bold mt-1">Tiết kiệm in ấn</div>
                <div className="text-[11px] text-slate-500 font-medium">Sự kiện MICE xanh</div>
              </div>
              <div className="pt-2 sm:pt-0 sm:px-3 text-center">
                <div className="text-2xl sm:text-3xl font-black text-blue-600 font-heading">140ms</div>
                <div className="text-xs text-slate-700 font-bold mt-1">Check-in cổng sự kiện</div>
                <div className="text-[11px] text-slate-500 font-medium">Offline Sync dự phòng</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. 4 TRỤ CỘT GIẢI PHÁP CỐT LÕI (LIQUID GLASS CARDS) (#features) */}
      {/* ================================================================= */}
      <section id="features" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-b from-blue-100/70 via-slate-50/95 to-blue-50/70 rounded-3xl border border-blue-200/80 shadow-xl shadow-blue-500/5 p-6 sm:p-10 lg:p-12 space-y-8 overflow-hidden">
          
          {/* Accent Ambient Glow Orbs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-4xl lg:max-w-5xl mx-auto space-y-2 relative z-10">
            <Badge variant="outline" className="px-3.5 py-1 bg-blue-50 text-[#0066FF] border-blue-200 text-xs font-extrabold uppercase tracking-wider shadow-2xs">
              TÍNH NĂNG NỔI BẬT
            </Badge>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black text-slate-950 tracking-tight font-heading sm:whitespace-nowrap">
              Giải Pháp Toàn Diện Cho Doanh Nghiệp &amp; Sự Kiện
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-2xl mx-auto">
              Hỗ trợ toàn bộ hành trình gặp gỡ và kết nối giao thương B2B từ điểm chạm đầu tiên đến khâu chốt hợp đồng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {/* Card 1 */}
            <div className="bg-white/95 backdrop-blur-xl border border-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/8 transition-all rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF]">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-950 font-heading">Danh Thiếp Số Thông Minh</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  Chạm thẻ NFC hoặc quét mã QR là mở ngay profile đa phương tiện không cần cài ứng dụng. Tự do cập nhật danh mục sản phẩm và liên hệ.
                </p>
              </div>
              <div className="text-xs font-bold text-blue-600 flex items-center gap-1">
                <span>Đổi phôi thẻ không mất dữ liệu</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white/95 backdrop-blur-xl border border-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/8 transition-all rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF]">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-950 font-heading">Check-in MICE &lt; 1s</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  Điểm danh đại biểu siêu tốc bằng QR vé hoặc thẻ NFC. Cắt giảm 100% rác thẻ giấy và tự động đồng bộ thời gian thực khi mất mạng (Offline Sync).
                </p>
              </div>
              <div className="text-xs font-bold text-blue-600 flex items-center gap-1">
                <span>Tự động xếp chỗ &amp; bàn tiệc VIP</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white/95 backdrop-blur-xl border border-white hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/8 transition-all rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-950 font-heading">Chuẩn Luật PDPL 91</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  Tiên phong tuân thủ Luật Bảo vệ Dữ liệu Cá nhân 91/2025/QH15. Cơ chế Đồng thuận 2 chiều minh bạch, chủ động quyền chia sẻ hoặc thu hồi dữ liệu.
                </p>
              </div>
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <span>Bảo vệ quyền riêng tư tuyệt đối</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white/95 backdrop-blur-xl border border-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/8 transition-all rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF]">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-950 font-heading">Sổ Tay Giao Thương (CRM)</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  Ghi nhớ bối cảnh cuộc gặp tại sự kiện, phân loại mức độ tiềm năng (Lead WARM / HOT) và hỗ trợ đội ngũ kinh doanh chốt hợp đồng nhanh chóng.
                </p>
              </div>
              <div className="text-xs font-bold text-blue-600 flex items-center gap-1">
                <span>Tự động nhắc lịch hẹn đối tác</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. TRẢI NGHIỆM TƯƠNG TÁC THỰC TẾ (#checkin & #security) */}
      {/* ================================================================= */}
      <section id="checkin" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        
        <div className="text-center max-w-4xl lg:max-w-5xl mx-auto space-y-2">
          <Badge variant="outline" className="px-3.5 py-1 bg-slate-100 text-slate-800 border-slate-300 text-xs font-extrabold uppercase tracking-wider">
            TRẢI NGHIỆM TRỰC QUAN
          </Badge>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black text-slate-950 tracking-tight font-heading sm:whitespace-nowrap">
            Kiểm Chứng Tính Năng Trực Tiếp Trên Trình Duyệt
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            Bấm chọn từng chức năng để mô phỏng tương tác thực tế của nền tảng One Connect.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/70 border border-slate-300/80 max-w-md w-full shadow-inner">
            <button
              onClick={() => setActiveTab('checkin')}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                activeTab === 'checkin' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              1. Điểm Danh &lt; 1s
            </button>
            <button
              onClick={() => setActiveTab('consent')}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                activeTab === 'consent' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              2. Bảo Mật PDPL 91
            </button>
            <button
              onClick={() => setActiveTab('crm')}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                activeTab === 'crm' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              3. Phân Loại Lead CRM
            </button>
          </div>
        </div>

        {/* Tab Content Box */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-9 border border-white shadow-xl shadow-slate-200/50 max-w-4xl mx-auto">
          
          {/* TAB 1: FAST CHECK-IN */}
          {activeTab === 'checkin' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-extrabold">
                  <Zap className="w-3.5 h-3.5" /> Trạm Điểm Danh Cửa Tốc Độ Cao
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-heading">
                  Quét Mã QR &amp; Đối Soát Trong 140ms
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Đại biểu đưa mã vé điện tử hoặc chạm thẻ vào trạm quét. Hệ thống lập tức xác thực thông tin, thông báo vị trí bàn tiệc và đồng bộ dữ liệu vào danh sách ban tổ chức.
                </p>

                <div className="flex items-center gap-3 py-1">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex-1">
                    <div className="text-[11px] text-slate-600 font-bold">Đại biểu đã có mặt</div>
                    <div className="text-2xl font-black text-emerald-600 font-mono">{attendeeCount} / 300</div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex-1">
                    <div className="text-[11px] text-slate-600 font-bold">Tốc độ đo được</div>
                    <div className="text-2xl font-black text-blue-600 font-mono">140 ms</div>
                  </div>
                </div>

                <div className="pt-1">
                  <Button
                    onClick={handleSimulateCheckin}
                    disabled={checkinScanning}
                    className="w-full sm:w-auto gap-2 bg-[#0066FF] hover:bg-blue-700 text-white font-extrabold rounded-xl px-6 h-11 text-xs shadow-sm cursor-pointer"
                  >
                    {checkinScanning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Đang đối soát vé...
                      </>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4" /> Quét Thử Nghiệm 1 Khách Mời
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="md:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-50/80 rounded-2xl border border-slate-200 text-center min-h-[260px]">
                {checkinScanning ? (
                  <div className="space-y-3">
                    <div className="w-14 h-14 border-2 border-blue-600 border-dashed rounded-xl flex items-center justify-center mx-auto text-blue-600 animate-pulse">
                      <QrCode className="w-7 h-7" />
                    </div>
                    <div className="text-blue-600 font-extrabold text-xs">Đang đối soát danh sách khách mời...</div>
                  </div>
                ) : checkinSuccess ? (
                  <div className="space-y-2.5 animate-in fade-in zoom-in duration-200">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <div className="text-emerald-700 font-extrabold text-sm sm:text-base">
                      ĐÃ CHECK-IN THÀNH CÔNG (140ms)
                    </div>
                    <div className="bg-white rounded-2xl p-3.5 text-left border border-slate-200 shadow-sm max-w-xs mx-auto text-xs space-y-1">
                      <div className="text-slate-500 text-[10px] font-bold">Đại biểu vừa check-in:</div>
                      <div className="font-extrabold text-slate-950">ThS. Nguyễn Văn Bình — Khách Mời VIP</div>
                      <div className="text-blue-600 text-[11px] font-bold">Vị trí: Bàn VIP B3 (Hàng ghế đầu)</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 text-slate-500">
                    <QrCode className="w-12 h-12 text-slate-400 mx-auto" />
                    <div className="text-xs font-bold text-slate-800">Trạm Quét QR Sẵn Sàng</div>
                    <div className="text-[11px] text-slate-600 max-w-xs font-medium">
                      Bấm nút bên trái để thử nghiệm quét mã của 1 đại biểu tại cửa
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CONSENT PDPL 91 */}
          {activeTab === 'consent' && (
            <div id="security" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-extrabold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Chuẩn Nghị Định 13 &amp; Luật PDPL 91
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-heading">
                  Cơ Chế Đồng Thuận 2 Chiều (2-Way Consent)
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Số điện thoại và email cá nhân mặc định được che giấu an toàn. Thông tin liên hệ chỉ mở khóa khi cả hai doanh nhân cùng xác nhận trao đổi, đảm bảo tuân thủ pháp lý bảo vệ dữ liệu.
                </p>

                <div className="pt-1">
                  <Button
                    onClick={() => setConsentGranted(!consentGranted)}
                    className={`gap-2 font-extrabold rounded-xl px-5 h-11 text-xs shadow-sm transition-all cursor-pointer ${
                      consentGranted
                        ? 'bg-slate-800 hover:bg-slate-900 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {consentGranted ? (
                      <>
                        <Lock className="w-3.5 h-3.5" /> Khóa Lại (Thu Hồi Quyền)
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" /> Bấm Đồng Thuận Chia Sẻ Thông Tin
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="md:col-span-6 p-5 sm:p-6 bg-slate-50/80 rounded-2xl border border-slate-200 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-extrabold text-slate-900 text-sm">Dữ Liệu Đối Tác Giao Thương</span>
                  <Badge variant="outline" className={
                    consentGranted ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold' : 'bg-slate-200 text-slate-700 font-bold'
                  }>
                    {consentGranted ? '✓ ĐÃ ĐỒNG THUẬN (HIỂN THỊ)' : 'CHẾ ĐỘ CHE MỜ (MASKED)'}
                  </Badge>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold">Họ và tên / Chức vụ:</div>
                    <div className="font-extrabold text-slate-950 text-sm">Trần Minh Đức — Chủ tịch TechCorp</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 font-bold">Số Điện Thoại Cá Nhân:</div>
                    <div className="font-mono font-extrabold text-xs sm:text-sm">
                      {consentGranted ? (
                        <span className="text-emerald-700">0923.456.789</span>
                      ) : (
                        <span className="text-slate-400">0923.•••.••• (Cần 2 bên đồng thuận)</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 font-bold">Email Trực Tiếp:</div>
                    <div className="font-mono font-extrabold text-xs sm:text-sm">
                      {consentGranted ? (
                        <span className="text-emerald-700">minhduc@techcorp.vn</span>
                      ) : (
                        <span className="text-slate-400">m••••••@techcorp.vn (Cần 2 bên đồng thuận)</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-200 text-[10.5px] text-slate-600 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Tuân thủ Luật Bảo vệ Dữ liệu Cá nhân số 91/2025/QH15</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RELATIONSHIP CRM */}
          {activeTab === 'crm' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-extrabold">
                  <MessageSquare className="w-3.5 h-3.5" /> Sổ Tay Quan Hệ &amp; CRM B2B
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-heading">
                  Ghi Chú Bối Cảnh &amp; Phân Loại Cơ Hội
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Lưu lại ngay lập tức nhu cầu hợp tác tại sự kiện, gắn nhãn phân loại Lead để chuyển giao cho đội ngũ bán hàng chăm sóc kịp thời.
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Phân loại mức độ tiềm năng:</label>
                  <div className="flex gap-2">
                    {(['WARM', 'HOT', 'CONVERTED'] as const).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setLeadStatus(tag)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                          leadStatus === tag
                            ? tag === 'HOT'
                              ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                              : tag === 'WARM'
                              ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                              : 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-6 p-5 sm:p-6 bg-slate-50/80 rounded-2xl border border-slate-200 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-extrabold text-slate-950 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-blue-600" /> Ghi Chú Riêng Tư
                  </span>
                  <Badge className={
                    leadStatus === 'HOT' ? 'bg-rose-600 text-white font-extrabold' : leadStatus === 'WARM' ? 'bg-amber-600 text-white font-extrabold' : 'bg-emerald-600 text-white font-extrabold'
                  }>
                    {leadStatus} LEAD
                  </Badge>
                </div>

                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={3}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
                  placeholder="Nhập ghi chú cuộc gặp..."
                />

                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 font-medium">
                  <span>Lịch hẹn: Sáng Thứ 5 tuần tới</span>
                  <span className="text-emerald-700 font-bold">✓ Tự động lưu vào hệ thống</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ================================================================= */}
      {/* 5. BỘ TÍNH TOÁN HIỆU QUẢ KINH TẾ & TIẾT KIỆM (ROI) (#roi) */}
      {/* ================================================================= */}
      <section id="roi" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-white shadow-xl shadow-slate-200/50 space-y-6">
          <div className="text-center space-y-2 max-w-4xl lg:max-w-5xl mx-auto">
            <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold text-xs">
              HIỆU QUẢ KINH TẾ &amp; MÔI TRƯỜNG
            </Badge>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black text-slate-950 tracking-tight font-heading sm:whitespace-nowrap">
              Ước Tính Chi Phí Tiết Kiệm Khi Sử Dụng One Connect
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Kéo thanh trượt để tính toán chi phí in ấn thẻ giấy và thời gian đón tiếp được cắt giảm theo quy mô tổ chức của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/80 p-6 rounded-2xl border border-slate-200 shadow-2xs">
            {/* Sliders */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs sm:text-sm font-extrabold text-slate-800">
                  <span>Số lượng Đại biểu / Sự kiện:</span>
                  <span className="text-blue-700 font-mono font-bold text-sm sm:text-base">{attendeesPerEvent} Người</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={attendeesPerEvent}
                  onChange={(e) => setAttendeesPerEvent(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs sm:text-sm font-extrabold text-slate-800">
                  <span>Số Sự Kiện / Năm:</span>
                  <span className="text-blue-700 font-mono font-bold text-sm sm:text-base">{eventsPerYear} Sự kiện</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={eventsPerYear}
                  onChange={(e) => setEventsPerYear(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>
            </div>

            {/* Computed Metrics */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-600 font-bold">Tiết Kiệm In Ấn</div>
                <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">
                  {(paperCostSaved / 1000000).toFixed(1)} Triệu
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-600 font-bold">Cắt Giảm Khí CO2</div>
                <div className="text-xl sm:text-2xl font-black text-blue-700 font-mono">
                  {co2SavedKg} kg CO2
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-600 font-bold">Giảm Thẻ Giấy Rác</div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                  {totalDelegates.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Tờ
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-600 font-bold">Thời Gian Đón Tiếp Giảm</div>
                <div className="text-xl sm:text-2xl font-black text-blue-700 font-mono">
                  {checkinHoursSaved} Giờ
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 6. BÁO GIÁ & GÓI HỘI VIÊN (#pricing) */}
      {/* ================================================================= */}
      <section id="pricing" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <Badge variant="outline" className="px-3.5 py-1 bg-blue-50 text-[#0066FF] border-blue-200 text-xs font-extrabold uppercase tracking-wider">
            GÓI DỊCH VỤ
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight font-heading">
            Lựa Chọn Giải Pháp Phù Hợp
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            Từ doanh nhân cá nhân đến các tổ chức sự kiện và hiệp hội doanh nghiệp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan 1 */}
          <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-lg transition-all">
            <div className="space-y-3">
              <Badge className="bg-slate-100 text-slate-800 text-xs font-extrabold">DOANH NHÂN CÁ NHÂN</Badge>
              <div className="text-xl font-black text-slate-950 font-heading">Thẻ Danh Thiếp Số</div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Dành cho chủ doanh nghiệp, giám đốc kinh doanh và chuyên gia tư vấn.</p>
              
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 pt-2 font-medium">
                <li className="flex items-center gap-2">✓ 01 Phôi thẻ kim loại khắc tên Laser theo yêu cầu</li>
                <li className="flex items-center gap-2">✓ Profile số không giới hạn chỉnh sửa</li>
                <li className="flex items-center gap-2">✓ Dynamic QR Code chống giả mạo</li>
                <li className="flex items-center gap-2">✓ Lưu danh bạ điện thoại 1-chạm (.vcf)</li>
              </ul>
            </div>

            <Link href="/login" className="w-full">
              <Button className="w-full bg-slate-950 hover:bg-black text-white font-extrabold rounded-xl text-xs h-11 cursor-pointer">
                Trải nghiệm miễn phí
              </Button>
            </Link>
          </div>

          {/* Plan 2: Highlighted */}
          <div className="rounded-3xl bg-gradient-to-b from-blue-50/70 via-white to-white border-2 border-[#0066FF] p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl relative">
            <div className="absolute -top-3 right-6 bg-[#0066FF] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
              PHỔ BIẾN NHẤT
            </div>
            
            <div className="space-y-3">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs font-extrabold">DOANH NGHIỆP &amp; SỰ KIỆN MICE</Badge>
              <div className="text-xl font-black text-slate-950 font-heading">Trạm Check-in &amp; CRM B2B</div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">Dành cho công ty tổ chức hội nghị, triển lãm và diễn đàn thương mại.</p>
              
              <ul className="space-y-2 text-xs sm:text-sm text-slate-800 pt-2 font-bold">
                <li className="flex items-center gap-2 text-blue-700">✓ Đầy đủ tính năng gói Doanh Nhân</li>
                <li className="flex items-center gap-2">✓ Trạm Check-in tốc độ cao &lt; 1s tại cửa</li>
                <li className="flex items-center gap-2">✓ B2B Matching &amp; Phân loại Lead WARM/HOT</li>
                <li className="flex items-center gap-2">✓ Dashboard báo cáo &amp; Xuất dữ liệu Excel</li>
                <li className="flex items-center gap-2">✓ Cơ chế Offline Sync khi mất kết nối mạng</li>
              </ul>
            </div>

            <Link href="/login" className="w-full">
              <Button className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs h-11 shadow-md shadow-blue-500/25 cursor-pointer">
                Trải nghiệm dự án ngay
              </Button>
            </Link>
          </div>

          {/* Plan 3 */}
          <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-lg transition-all">
            <div className="space-y-3">
              <Badge className="bg-slate-100 text-slate-800 text-xs font-extrabold">HIỆP HỘI &amp; TỔ CHỨC</Badge>
              <div className="text-xl font-black text-slate-950 font-heading">Mạng Lưới Hội Viên Tập Trung</div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Dành cho các Hội Doanh nhân, Hiệp hội ngành nghề, Câu lạc bộ B2B.</p>
              
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 pt-2 font-medium">
                <li className="flex items-center gap-2">✓ Quản trị danh bạ hội viên tập trung toàn tỉnh/thành</li>
                <li className="flex items-center gap-2">✓ Phân quyền Ban Chấp Hành / Hội Viên (RBAC)</li>
                <li className="flex items-center gap-2">✓ Hỗ trợ tên miền riêng &amp; Logo tổ chức</li>
                <li className="flex items-center gap-2">✓ Cổng kết nối Cung - Cầu nội bộ</li>
              </ul>
            </div>

            <Link href="/register" className="w-full">
              <Button className="w-full bg-slate-950 hover:bg-black text-white font-extrabold rounded-xl text-xs h-11 cursor-pointer">
                Liên hệ hợp tác
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 7. CALL TO ACTION BANNER (LIQUID BLUE) */}
      {/* ================================================================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center bg-gradient-to-r from-[#0055EE] via-[#0066FF] to-[#0052CC] text-white rounded-3xl p-8 sm:p-14 space-y-5 shadow-2xl shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black tracking-tight font-heading relative z-10 sm:whitespace-nowrap">
            Sẵn Sàng Nâng Tầm Kết Nối Doanh Nghiệp &amp; Sự Kiện Xanh?
          </h2>
          <p className="text-xs sm:text-sm text-blue-50 max-w-xl mx-auto relative z-10 font-medium leading-relaxed">
            Gia nhập mạng lưới One Connect ngay hôm nay để trải nghiệm danh thiếp số thông minh và giải pháp điểm danh sự kiện không giấy.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto gap-2 bg-white hover:bg-slate-100 text-[#0055EE] font-black rounded-2xl h-12 px-7 text-sm shadow-md cursor-pointer"
              >
                <Play className="w-4 h-4 fill-[#0055EE]" /> Trải Nghiệm Dự Án Ngay
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto gap-2 border-white/40 bg-blue-700/50 hover:bg-blue-700 text-white font-extrabold rounded-2xl h-12 px-6 text-sm cursor-pointer"
              >
                Đăng ký tài khoản mới
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 8. CLEAN GLOBAL FOOTER (OPTIMIZED FOR MOBILE & BACK TO TOP) */}
      {/* ================================================================= */}
      <footer className="border-t border-slate-200/80 bg-white py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Mobile: Centered Logo with Copyright Stacked Directly Below */}
          <div className="flex flex-col items-center sm:items-start gap-2.5 text-center sm:text-left">
            <Link href="/" title="One Connect Network" className="inline-block">
              <img
                src="/brand_logo_transparent.png?v=20260904"
                alt="One Connect"
                className="h-7 sm:h-7 w-auto object-contain mx-auto sm:mx-0"
              />
            </Link>
            <span className="font-medium text-slate-600 block">
              © 2026 One Connect Network. Bảo lưu mọi quyền.
            </span>
          </div>

          {/* Right Actions & Back To Top */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-right">
            <div className="flex items-center gap-4 text-[11px] font-semibold">
              <span className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" /> Tuân thủ Nghị định 13 &amp; Luật PDPL 91
              </span>
              <Link href="/login" className="hover:text-blue-600 transition-colors">
                Đăng nhập
              </Link>
              <Link href="/register" className="hover:text-blue-600 transition-colors">
                Đăng ký
              </Link>
            </div>

            {/* Back to top button */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
              title="Cuộn lên đầu trang"
            >
              <ArrowUp className="w-3.5 h-3.5 text-blue-600 transition-transform group-hover:-translate-y-0.5" />
              <span>Trở lại đầu trang</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Back-To-Top Button (Mobile & Desktop) */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-[#0A1124]/90 hover:bg-black text-white shadow-xl shadow-slate-900/20 border border-slate-700/60 backdrop-blur-md transition-all active:scale-95 cursor-pointer flex items-center justify-center group"
        title="Về đầu trang"
        aria-label="Về đầu trang"
      >
        <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 text-blue-400" />
      </button>

    </div>
  );
}
