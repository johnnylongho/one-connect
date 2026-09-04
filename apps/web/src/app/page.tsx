'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useOneConnectStore } from '@/lib/store';
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Smartphone,
  Layers,
  Lock,
  Play,
  QrCode,
  Leaf,
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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const { state, currentIdentity } = useOneConnectStore();

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
    'Gặp gỡ đối tác tại diễn đàn doanh nghiệp. Đối tác cần triển khai 500 thẻ NFC cho đội ngũ kinh doanh.'
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
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* ================================================================= */}
      {/* 1. STICKY TOP NAVIGATION BAR (CLEAN WHITE) */}
      {/* ================================================================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 sm:h-18 px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo - Separated Transparent PNG without subtitle text */}
          <Link href="/" className="flex items-center group select-none shrink-0" title="One Connect Network">
            <img
              src="/one_connect_logo_transparent.png"
              alt="One Connect"
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Tính Năng
            </button>
            <button
              onClick={() => scrollToSection('checkin')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Check-in Sự Kiện
            </button>
            <button
              onClick={() => scrollToSection('security')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Bảo Mật PDPL 91
            </button>
            <button
              onClick={() => scrollToSection('roi')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Hiệu Quả (ROI)
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Báo Giá
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => scrollToSection('features')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Tìm hiểu thêm
            </button>

            {/* Primary Action: Trải nghiệm dự án -> /login */}
            <Link href="/login">
              <Button
                size="sm"
                className="gap-1.5 bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs h-9 px-4 shadow-sm shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
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
                  className="gap-1.5 border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 font-bold rounded-xl text-xs h-9 px-3 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  Vào Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs h-9 px-3.5 cursor-pointer"
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
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold rounded-xl text-xs h-9 px-3 cursor-pointer"
                >
                  Đăng ký
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white py-4 px-4 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
            <button
              onClick={() => scrollToSection('features')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Tính Năng Cốt Lõi
            </button>
            <button
              onClick={() => scrollToSection('checkin')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Check-in Sự Kiện
            </button>
            <button
              onClick={() => scrollToSection('security')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Bảo Mật PDPL 91
            </button>
            <button
              onClick={() => scrollToSection('roi')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Tính Hiệu Quả (ROI)
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Báo Giá
            </button>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link href="/login" className="w-full">
                <Button className="w-full gap-2 bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs h-10 shadow-sm">
                  <Sparkles className="w-4 h-4" /> Trải nghiệm dự án
                </Button>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full border-slate-200 text-slate-700 font-semibold rounded-xl text-xs h-9">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button variant="ghost" className="w-full bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs h-9">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ================================================================= */}
      {/* 2. EXECUTIVE HERO BANNER (CLEAN & MINIMALIST WHITE) */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-100/50 via-cyan-50/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0066FF] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Hạ Tầng Định Danh Số B2B & Quản Trị Sự Kiện MICE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight font-heading">
              Kết Nối Doanh Nghiệp Thông Minh <br />
              <span className="text-[#0066FF]">Chạm 1 Giây, Giao Thương Bền Vững</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              <strong>One Connect Network</strong> là giải pháp danh thiếp số thông minh NFC/QR tích hợp trạm Check-in sự kiện MICE và CRM quan hệ đối tác, tiên phong bảo mật 2 chiều tuân thủ nghiêm ngặt <strong>Luật Dữ liệu Cá nhân 91/2025/QH15</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/login">
                <Button
                  size="lg"
                  className="gap-2 bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl text-sm h-11 px-6 shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" /> Trải Nghiệm Dự Án Ngay
                </Button>
              </Link>

              <button
                onClick={() => scrollToSection('features')}
                className="inline-flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm h-11 px-5 transition-all shadow-2xs cursor-pointer"
              >
                <span>Tìm Hiểu Tính Năng</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              <Link href="/register">
                <Button
                  size="lg"
                  variant="ghost"
                  className="gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium text-sm h-11 px-4 cursor-pointer"
                >
                  Đăng ký miễn phí <ArrowRight className="w-4 h-4 text-slate-400" />
                </Button>
              </Link>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#0066FF] font-heading">&lt; 0.42s</div>
                <div className="text-xs text-slate-500 font-medium">Tốc độ chạm NFC</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-600 font-heading">100%</div>
                <div className="text-xs text-slate-500 font-medium">Chuẩn Luật PDPL 91</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-800 font-heading">85%</div>
                <div className="text-xs text-slate-500 font-medium">Tiết kiệm chi phí in</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: Sleek 2D Digital Business Card Mockup */}
          <div className="lg:col-span-5 flex justify-center w-full min-w-0">
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 space-y-5 relative">
              
              {/* Card Header & Chip Indicator */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Thẻ Danh Thiếp Số</span>
                    <span className="text-[10px] font-mono text-slate-400">NFC & Dynamic QR</span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-[10px]">
                  ✓ Hoạt Động 24/7
                </Badge>
              </div>

              {/* Profile Card Body */}
              <div className="flex items-center gap-4 py-1">
                <img
                  src="/avatar-johnny-long.jpg"
                  alt="Hồ Hoàng Long"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-extrabold text-slate-900 truncate">Hồ Hoàng Long</h3>
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  </div>
                  <p className="text-xs text-blue-600 font-medium truncate">Quản lý Dự án & Sản phẩm</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                    <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>Tập đoàn Công nghệ số A+</span>
                  </p>
                </div>
              </div>

              {/* Contact Snapshot */}
              <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 border border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-[11px] text-slate-500">Số Điện Thoại:</span>
                  <span className="font-mono font-semibold text-slate-800">0923.456.789</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-[11px] text-slate-500">Email:</span>
                  <span className="font-mono font-semibold text-slate-800">contact@oneconnect.id.vn</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-[11px] text-slate-500">Bảo mật dữ liệu:</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Chuẩn PDPL 91
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link href="/login" className="w-full">
                  <Button size="sm" className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs h-9 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" /> Thử nghiệm kết nối
                  </Button>
                </Link>
                <Link href="/login" className="w-full">
                  <Button size="sm" variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl text-xs h-9">
                    <Download className="w-3.5 h-3.5" /> Lưu danh bạ (.vcf)
                  </Button>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. 4 TRỤ CỘT GIẢI PHÁP CỐT LÕI (#features) */}
      {/* ================================================================= */}
      <section id="features" className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-slate-50/50 rounded-3xl border border-slate-100 my-6">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-[#0066FF] border-blue-100 text-xs font-bold uppercase tracking-wider">
            TÍNH NĂNG NỔI BẬT
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Giải Pháp Toàn Diện Cho Doanh Nghiệp & Sự Kiện
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Tối ưu hóa hành trình gặp gỡ và kết nối giao thương B2B từ điểm chạm đầu tiên đến khâu chốt hợp đồng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <Card className="border border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all rounded-2xl shadow-2xs">
            <CardHeader className="pb-2 p-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF] mb-2">
                <CreditCard className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-bold text-slate-900">Danh Thiếp Số Thông Minh</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 leading-relaxed px-5 pb-5 pt-0">
              Chạm thẻ NFC hoặc quét mã QR là mở hồ sơ tức thì không cần cài ứng dụng. Thay đổi thông tin cá nhân và doanh nghiệp không giới hạn.
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="border border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all rounded-2xl shadow-2xs">
            <CardHeader className="pb-2 p-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF] mb-2">
                <Zap className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-bold text-slate-900">Check-in MICE &lt; 1s</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 leading-relaxed px-5 pb-5 pt-0">
              Điểm danh đại biểu siêu tốc bằng QR vé hoặc thẻ NFC. Loại bỏ hoàn toàn việc in ấn danh sách giấy và tự động đồng bộ khi mất mạng (Offline Sync).
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="border border-slate-200/90 bg-white hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/5 transition-all rounded-2xl shadow-2xs">
            <CardHeader className="pb-2 p-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-bold text-slate-900">Chuẩn Luật PDPL 91</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 leading-relaxed px-5 pb-5 pt-0">
              Tiên phong tuân thủ Luật Bảo vệ Dữ liệu Cá nhân 91/2025/QH15. Cơ chế Đồng thuận 2 chiều minh bạch, chủ động quyền chia sẻ và thu hồi dữ liệu.
            </CardContent>
          </Card>

          {/* Card 4 */}
          <Card className="border border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all rounded-2xl shadow-2xs">
            <CardHeader className="pb-2 p-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF] mb-2">
                <TrendingUp className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-bold text-slate-900">Sổ Tay Giao Thương (CRM)</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 leading-relaxed px-5 pb-5 pt-0">
              Ghi nhớ ngay bối cảnh cuộc gặp, phân loại mức độ tiềm năng (Lead WARM / HOT) và hỗ trợ đội ngũ kinh doanh chuyển đổi cơ hội thành hợp đồng.
            </CardContent>
          </Card>
        </div>

      </section>

      {/* ================================================================= */}
      {/* 4. TRẢI NGHIỆM TƯƠNG TÁC THỰC TẾ (#checkin & #security) */}
      {/* ================================================================= */}
      <section id="checkin" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="outline" className="px-3 py-1 bg-slate-100 text-slate-700 border-slate-200 text-xs font-bold uppercase tracking-wider">
            TRẢI NGHIỆM TRỰC QUAN
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Kiểm Chứng Tính Năng Trực Tiếp Trên Trình Duyệt
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Bấm chọn từng chức năng bên dưới để mô phỏng tương tác thực tế của nền tảng One Connect.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 max-w-md w-full">
            <button
              onClick={() => setActiveTab('checkin')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'checkin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Điểm Danh &lt; 1s
            </button>
            <button
              onClick={() => setActiveTab('consent')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'consent' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Bảo Mật PDPL 91
            </button>
            <button
              onClick={() => setActiveTab('crm')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'crm' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Phân Loại Lead CRM
            </button>
          </div>
        </div>

        {/* Tab Content Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md max-w-4xl mx-auto">
          
          {/* TAB 1: FAST CHECK-IN */}
          {activeTab === 'checkin' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold">
                  <Zap className="w-3.5 h-3.5" /> Trạm Điểm Danh Cửa Tốc Độ Cao
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                  Quét Mã QR &amp; Đối Soát Trong 140ms
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Đại biểu đưa mã vé điện tử hoặc chạm thẻ vào trạm quét. Hệ thống lập tức xác thực thông tin, báo cáo vị trí bàn tiệc và đồng bộ dữ liệu vào danh sách ban tổ chức.
                </p>

                <div className="flex items-center gap-4 py-1">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex-1">
                    <div className="text-[11px] text-slate-500 font-medium">Đại biểu đã có mặt</div>
                    <div className="text-xl font-black text-emerald-600 font-mono">{attendeeCount} / 300</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex-1">
                    <div className="text-[11px] text-slate-500 font-medium">Tốc độ xử lý</div>
                    <div className="text-xl font-black text-blue-600 font-mono">140 ms</div>
                  </div>
                </div>

                <div className="pt-1">
                  <Button
                    onClick={handleSimulateCheckin}
                    disabled={checkinScanning}
                    className="w-full sm:w-auto gap-2 bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl px-5 h-10 text-xs shadow-sm cursor-pointer"
                  >
                    {checkinScanning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Đang quét mã...
                      </>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4" /> Quét Thử Nghiệm 1 Khách Mời
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="md:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center min-h-[250px]">
                {checkinScanning ? (
                  <div className="space-y-3">
                    <div className="w-14 h-14 border-2 border-blue-600 border-dashed rounded-xl flex items-center justify-center mx-auto text-blue-600 animate-pulse">
                      <QrCode className="w-7 h-7" />
                    </div>
                    <div className="text-blue-600 font-bold text-xs">Đang đối soát danh sách khách mời...</div>
                  </div>
                ) : checkinSuccess ? (
                  <div className="space-y-2.5 animate-in fade-in zoom-in duration-200">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <div className="text-emerald-700 font-extrabold text-sm">
                      ĐÃ CHECK-IN THÀNH CÔNG (140ms)
                    </div>
                    <div className="bg-white rounded-xl p-3 text-left border border-slate-200 shadow-2xs max-w-xs mx-auto text-xs space-y-1">
                      <div className="text-slate-400 text-[10px]">Đại biểu vừa check-in:</div>
                      <div className="font-bold text-slate-900">ThS. Nguyễn Văn Bình — Khách VIP</div>
                      <div className="text-blue-600 text-[11px]">Vị trí bàn tiệc: Bàn VIP B3 (Hàng ghế đầu)</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 text-slate-400">
                    <QrCode className="w-10 h-10 text-slate-400 mx-auto" />
                    <div className="text-xs font-semibold text-slate-700">Trạm Quét QR Sẵn Sàng</div>
                    <div className="text-[11px] text-slate-500 max-w-xs">
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
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Chuẩn Nghị Định 13 &amp; Luật PDPL 91
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                  Cơ Chế Đồng Thuận 2 Chiều (2-Way Consent)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Số điện thoại và email cá nhân mặc định được ẩn. Thông tin liên hệ chỉ hiển thị khi cả 2 doanh nhân cùng xác nhận trao đổi, đảm bảo tuân thủ pháp lý bảo vệ dữ liệu.
                </p>

                <div className="pt-1">
                  <Button
                    onClick={() => setConsentGranted(!consentGranted)}
                    className={`gap-2 font-bold rounded-xl px-5 h-10 text-xs shadow-sm transition-all cursor-pointer ${
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

              <div className="md:col-span-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-800">Dữ Liệu Đối Tác Giao Thương</span>
                  <Badge variant="outline" className={
                    consentGranted ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold' : 'bg-slate-100 text-slate-600 font-bold'
                  }>
                    {consentGranted ? '✓ ĐÃ ĐỒNG THUẬN (HIỂN THỊ)' : 'CHẾ ĐỘ CHE MỜ (MASKED)'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="text-[10px] text-slate-400">Họ và tên / Chức vụ:</div>
                    <div className="font-bold text-slate-800">Trần Minh Đức — Chủ tịch TechCorp</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400">Số Điện Thoại Cá Nhân:</div>
                    <div className="font-mono font-bold text-xs">
                      {consentGranted ? (
                        <span className="text-emerald-600">0923.456.789</span>
                      ) : (
                        <span className="text-slate-400">0923.•••.••• (Cần 2 bên đồng thuận)</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400">Email Trực Tiếp:</div>
                    <div className="font-mono font-bold text-xs">
                      {consentGranted ? (
                        <span className="text-emerald-600">minhduc@techcorp.vn</span>
                      ) : (
                        <span className="text-slate-400">m••••••@techcorp.vn (Cần 2 bên đồng thuận)</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tuân thủ Luật Bảo vệ Dữ liệu Cá nhân số 91/2025/QH15</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RELATIONSHIP CRM */}
          {activeTab === 'crm' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold">
                  <MessageSquare className="w-3.5 h-3.5" /> Sổ Tay Quan Hệ &amp; CRM B2B
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                  Ghi Chú Bối Cảnh &amp; Phân Loại Cơ Hội
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Lưu lại ngay lập tức nhu cầu hợp tác tại sự kiện, gắn nhãn phân loại Lead để chuyển giao cho đội ngũ bán hàng chăm sóc kịp thời.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Phân loại mức độ tiềm năng:</label>
                  <div className="flex gap-2">
                    {(['WARM', 'HOT', 'CONVERTED'] as const).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setLeadStatus(tag)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          leadStatus === tag
                            ? tag === 'HOT'
                              ? 'bg-rose-500 text-white border-rose-600'
                              : tag === 'WARM'
                              ? 'bg-amber-500 text-white border-amber-600'
                              : 'bg-emerald-600 text-white border-emerald-700'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-blue-600" /> Ghi Chú Riêng Tư
                  </span>
                  <Badge className={
                    leadStatus === 'HOT' ? 'bg-rose-500' : leadStatus === 'WARM' ? 'bg-amber-500' : 'bg-emerald-600'
                  }>
                    {leadStatus} LEAD
                  </Badge>
                </div>

                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 shadow-2xs"
                  placeholder="Nhập ghi chú cuộc gặp..."
                />

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Lịch hẹn: Sáng Thứ 5 tuần tới</span>
                  <span className="text-emerald-600 font-bold">✓ Tự động lưu vào hệ thống</span>
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
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-bold text-xs">
              HIỆU QUẢ KINH TẾ &amp; MÔI TRƯỜNG
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              Ước Tính Chi Phí Tiết Kiệm Khi Sử Dụng One Connect
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Kéo thanh trượt để tính toán chi phí in ấn thẻ giấy và thời gian đón tiếp được cắt giảm theo quy mô tổ chức của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            {/* Sliders */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-700">
                  <span>Số lượng Đại biểu / Sự kiện:</span>
                  <span className="text-blue-600 font-mono font-bold">{attendeesPerEvent} Người</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={attendeesPerEvent}
                  onChange={(e) => setAttendeesPerEvent(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-700">
                  <span>Số Sự Kiện / Năm:</span>
                  <span className="text-blue-600 font-mono font-bold">{eventsPerYear} Sự kiện</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={eventsPerYear}
                  onChange={(e) => setEventsPerYear(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Computed Metrics */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">Tiết Kiệm In Ấn</div>
                <div className="text-lg sm:text-2xl font-black text-emerald-600 font-mono">
                  {(paperCostSaved / 1000000).toFixed(1)} Triệu
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">Cắt Giảm Khí CO2</div>
                <div className="text-lg sm:text-2xl font-black text-blue-600 font-mono">
                  {co2SavedKg} kg CO2
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">Giảm Thẻ Giấy Rác</div>
                <div className="text-lg sm:text-2xl font-black text-slate-800 font-mono">
                  {totalDelegates.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Tờ
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">Thời Gian Đón Tiếp Giảm</div>
                <div className="text-lg sm:text-2xl font-black text-blue-600 font-mono">
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
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-[#0066FF] border-blue-100 text-xs font-bold uppercase tracking-wider">
            GÓI DỊCH VỤ
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Lựa Chọn Giải Pháp Phù Hợp
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Từ doanh nhân cá nhân đến các tổ chức sự kiện và hiệp hội doanh nghiệp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan 1 */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 flex flex-col justify-between space-y-6 hover:shadow-lg transition-all shadow-2xs">
            <div className="space-y-3">
              <Badge className="bg-slate-100 text-slate-700 text-xs font-bold">DOANH NHÂN CÁ NHÂN</Badge>
              <div className="text-xl font-extrabold text-slate-900 font-heading">Thẻ Danh Thiếp Số</div>
              <p className="text-xs text-slate-500">Dành cho chủ doanh nghiệp, giám đốc kinh doanh và chuyên gia tư vấn.</p>
              
              <ul className="space-y-2 text-xs text-slate-600 pt-2">
                <li className="flex items-center gap-2">✓ 01 Phôi thẻ kim loại khắc tên Laser theo yêu cầu</li>
                <li className="flex items-center gap-2">✓ Profile số không giới hạn chỉnh sửa</li>
                <li className="flex items-center gap-2">✓ Dynamic QR Code chống giả mạo</li>
                <li className="flex items-center gap-2">✓ Lưu danh bạ điện thoại 1-chạm (.vcf)</li>
              </ul>
            </div>

            <Link href="/login" className="w-full">
              <Button className="w-full bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs h-10 cursor-pointer">
                Trải nghiệm miễn phí
              </Button>
            </Link>
          </div>

          {/* Plan 2: Highlighted */}
          <div className="rounded-3xl bg-white border-2 border-[#0066FF] p-6 flex flex-col justify-between space-y-6 shadow-xl relative">
            <div className="absolute -top-3 right-6 bg-[#0066FF] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
              PHỔ BIẾN NHẤT
            </div>
            
            <div className="space-y-3">
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-bold">DOANH NGHIỆP &amp; SỰ KIỆN MICE</Badge>
              <div className="text-xl font-extrabold text-slate-900 font-heading">Trạm Check-in &amp; CRM B2B</div>
              <p className="text-xs text-slate-500">Dành cho công ty tổ chức hội nghị, triển lãm và diễn đàn thương mại.</p>
              
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2 text-blue-600 font-semibold">✓ Đầy đủ tính năng gói Doanh Nhân</li>
                <li className="flex items-center gap-2">✓ Trạm Check-in tốc độ cao &lt; 1s tại cửa</li>
                <li className="flex items-center gap-2">✓ B2B Matching &amp; Phân loại Lead WARM/HOT</li>
                <li className="flex items-center gap-2">✓ Dashboard báo cáo &amp; Xuất dữ liệu Excel</li>
                <li className="flex items-center gap-2">✓ Cơ chế Offline Sync khi mất kết nối mạng</li>
              </ul>
            </div>

            <Link href="/login" className="w-full">
              <Button className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs h-10 shadow-md shadow-blue-500/25 cursor-pointer">
                Trải nghiệm dự án ngay
              </Button>
            </Link>
          </div>

          {/* Plan 3 */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 flex flex-col justify-between space-y-6 hover:shadow-lg transition-all shadow-2xs">
            <div className="space-y-3">
              <Badge className="bg-slate-100 text-slate-700 text-xs font-bold">HIỆP HỘI &amp; TỔ CHỨC</Badge>
              <div className="text-xl font-extrabold text-slate-900 font-heading">Mạng Lưới Hội Viên Tập Trung</div>
              <p className="text-xs text-slate-500">Dành cho các Hội Doanh nhân, Hiệp hội ngành nghề, Câu lạc bộ B2B.</p>
              
              <ul className="space-y-2 text-xs text-slate-600 pt-2">
                <li className="flex items-center gap-2">✓ Quản trị danh bạ hội viên tập trung toàn tỉnh/thành</li>
                <li className="flex items-center gap-2">✓ Phân quyền Ban Chấp Hành / Hội Viên (RBAC)</li>
                <li className="flex items-center gap-2">✓ Hỗ trợ tên miền riêng &amp; Logo tổ chức</li>
                <li className="flex items-center gap-2">✓ Cổng kết nối Cung - Cầu nội bộ</li>
              </ul>
            </div>

            <Link href="/register" className="w-full">
              <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl text-xs h-10 cursor-pointer">
                Liên hệ hợp tác
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 7. CALL TO ACTION BANNER (CLEAN BLUE) */}
      {/* ================================================================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 text-white rounded-3xl p-8 sm:p-12 space-y-4 shadow-xl shadow-blue-500/10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-heading">
            Sẵn Sàng Nâng Tầm Kết Nối Doanh Nghiệp &amp; Sự Kiện Xanh?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
            Gia nhập mạng lưới One Connect ngay hôm nay để trải nghiệm danh thiếp số thông minh và giải pháp điểm danh sự kiện không giấy.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/login">
              <Button
                size="lg"
                className="gap-2 bg-white hover:bg-slate-100 text-[#0066FF] font-bold rounded-xl h-11 px-6 text-sm shadow-md cursor-pointer"
              >
                <Play className="w-4 h-4 fill-[#0066FF]" /> Trải Nghiệm Dự Án Ngay
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/40 bg-blue-700/40 hover:bg-blue-700 text-white font-semibold rounded-xl h-11 px-5 text-sm cursor-pointer"
              >
                Đăng ký tài khoản mới
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 8. CLEAN GLOBAL FOOTER */}
      {/* ================================================================= */}
      <footer className="border-t border-slate-100 bg-white py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/one_connect_logo_transparent.png"
              alt="One Connect"
              className="h-6 w-auto object-contain"
            />
            <span>© 2026 One Connect Network. Bảo lưu mọi quyền.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Tuân thủ Nghị định 13 &amp; Luật PDPL 91
            </span>
            <Link href="/login" className="hover:text-slate-900 transition-colors">
              Đăng nhập
            </Link>
            <Link href="/register" className="hover:text-slate-900 transition-colors">
              Đăng ký
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
