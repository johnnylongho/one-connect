'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BusinessCard3D from '@/components/BusinessCard3D';
import { useOneConnectStore } from '@/lib/store';
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Smartphone,
  Layers,
  Lock,
  FileText,
  Play,
  QrCode,
  Leaf,
  Check,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Radio,
  Unlock,
  Tag,
  Cpu,
  RefreshCw,
  MessageSquare,
  Menu,
  X,
  ExternalLink,
  Users,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const { state, currentIdentity, currentCard, reissueCard } = useOneConnectStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active Simulator Tab
  const [activeSimTab, setActiveSimTab] = useState<'nfc' | 'checkin' | 'consent' | 'memory' | 'ai'>('nfc');
  const [selectedTheme, setSelectedTheme] = useState<'obsidian' | 'sapphire' | 'gold' | 'emerald'>('obsidian');

  // Simulator 1: NFC Tap state
  const [nfcTapping, setNfcTapping] = useState(false);
  const [nfcTapped, setNfcTapped] = useState(false);
  const [tapLatency, setTapLatency] = useState(0);

  // Simulator 2: Fast Checkin state
  const [checkinScanning, setCheckinScanning] = useState(false);
  const [checkinSuccess, setCheckinSuccess] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(142);

  // Simulator 3: 2-Way Consent state
  const [consentGranted, setConsentGranted] = useState(false);

  // Simulator 4: Relationship Memory state
  const [noteText, setNoteText] = useState(
    'Gặp anh Minh Đức tại Diễn đàn MICE Nha Trang. Đối tác quan tâm 1,000 thẻ NFC One Connect cho TechCorp Q3/2026.'
  );
  const [leadStatus, setLeadStatus] = useState<'WARM' | 'HOT' | 'CONVERTED'>('HOT');

  // Simulator 5: AI Matchmaking state
  const [supplyIndustry, setSupplyIndustry] = useState('Công Nghệ & AI');
  const [demandIndustry, setDemandIndustry] = useState('Khách Sạn & MICE');

  // ROI Calculator State
  const [attendeesPerEvent, setAttendeesPerEvent] = useState(300);
  const [eventsPerYear, setEventsPerYear] = useState(12);

  // Calculate ROI
  const totalDelegates = attendeesPerEvent * eventsPerYear;
  const paperCostSaved = totalDelegates * 25000; // 25k VND per printed packet + badge
  const co2SavedKg = Math.round(totalDelegates * 0.18);
  const checkinHoursSaved = Math.round((totalDelegates * 25) / 3600); // 25s saved per person

  const handleSimulateNfcTap = () => {
    setNfcTapping(true);
    setNfcTapped(false);
    const start = Date.now();
    setTimeout(() => {
      setTapLatency(Date.now() - start);
      setNfcTapping(false);
      setNfcTapped(true);
    }, 420);
  };

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

  const previewIdentity = currentIdentity || {
    id: 'demo-identity',
    userId: 'demo-user',
    username: 'hohoanglong',
    fullName: 'Hồ Hoàng Long',
    displayName: 'Hồ Hoàng Long',
    title: 'Quản lý Dự án & Phát triển Sản phẩm',
    avatarUrl: '/avatar-johnny-long.jpg',
    phone: '0923.456.789',
    email: 'contact.johnnylongho@gmail.com',
    association: 'Tập đoàn Công nghệ số A+ (A PLUSVN)',
    slogan: 'Physical Touch • Digital Memory • Enterprise Trust',
    industry: 'Công Nghệ Số & AI B2B',
    socialLinks: [],
    businesses: [
      {
        id: 'biz-01',
        personIdentityId: 'demo-identity',
        businessId: 'biz-01',
        businessName: 'Tập đoàn Công nghệ số A+',
        position: 'Quản lý Dự án & Phát triển Sản phẩm',
        relationType: 'OWNER',
        isPrimary: true,
        status: 'ACTIVE' as const,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const previewCard = currentCard || {
    id: 'card-demo',
    personIdentityId: 'demo-identity',
    cardUid: '1C-NFC-KH2026',
    cardType: 'NFC_BUSINESS_PRO' as const,
    dynamicUrl: 'https://oneconnect.id.vn/c/demo',
    qrValue: 'https://oneconnect.id.vn/c/demo',
    status: 'ACTIVE' as const,
    issuedAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* ================================================================= */}
      {/* 1. STICKY TOP NAVIGATION BAR */}
      {/* ================================================================= */}
      <header className="sticky top-0 z-50 bg-[#070A12]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group select-none shrink-0">
            <div className="relative flex items-center justify-center">
              <img
                src="/one_connect_final_logo_orange.png"
                alt="One Connect Logo"
                className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-wider text-white font-heading leading-tight">
                ONE CONNECT
              </span>
              <span className="text-[9.5px] font-bold tracking-widest uppercase text-cyan-400 font-mono">
                B2B IDENTITY NETWORK
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold text-slate-300">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Tính Năng Cốt Lõi
            </button>
            <button
              onClick={() => scrollToSection('card3d')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Thẻ 3D NFC
            </button>
            <button
              onClick={() => scrollToSection('checkin')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Điểm Danh Sự Kiện
            </button>
            <button
              onClick={() => scrollToSection('security')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Bảo Mật PDPL 91
            </button>
            <button
              onClick={() => scrollToSection('calculator')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Tính Hiệu Quả (ROI)
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Gói Hội Viên
            </button>
            <button
              onClick={() => scrollToSection('dossier')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Hồ Sơ ĐMST 2026
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Quick Learn More Link */}
            <button
              onClick={() => scrollToSection('features')}
              className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              Tìm hiểu thêm
            </button>

            {/* Experience Project / Login Button */}
            <Link href="/login">
              <Button
                size="sm"
                className="gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl text-xs h-9 px-3.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                Trải nghiệm dự án
              </Button>
            </Link>

            {/* Login / Dashboard Link */}
            {state.currentIdentityId ? (
              <Link href="/dashboard">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 border-cyan-500/50 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 font-bold rounded-xl text-xs h-9 px-3 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Vào Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white font-bold rounded-xl text-xs h-9 px-3.5 cursor-pointer"
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
                  className="text-slate-300 hover:text-white hover:bg-slate-800/60 font-semibold rounded-xl text-xs h-9 px-3 cursor-pointer"
                >
                  Đăng ký
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#070A12] py-4 px-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => scrollToSection('features')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-lg"
            >
              Tính Năng Cốt Lõi
            </button>
            <button
              onClick={() => scrollToSection('card3d')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-lg"
            >
              Thẻ 3D NFC
            </button>
            <button
              onClick={() => scrollToSection('checkin')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-lg"
            >
              Điểm Danh Sự Kiện
            </button>
            <button
              onClick={() => scrollToSection('security')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-lg"
            >
              Bảo Mật PDPL 91
            </button>
            <button
              onClick={() => scrollToSection('calculator')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-lg"
            >
              Tính Hiệu Quả (ROI)
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-lg"
            >
              Gói Hội Viên
            </button>
            <button
              onClick={() => scrollToSection('dossier')}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-lg"
            >
              Hồ Sơ ĐMST 2026
            </button>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link href="/login" className="w-full">
                <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl text-xs h-10">
                  <Sparkles className="w-4 h-4" /> Trải nghiệm dự án
                </Button>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full border-slate-700 bg-slate-800 text-white font-bold rounded-xl text-xs h-9">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button variant="ghost" className="w-full bg-slate-800/40 text-slate-300 font-bold rounded-xl text-xs h-9">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ================================================================= */}
      {/* 2. EXECUTIVE HERO BANNER */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Vision & Pitching Hero */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-cyan-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" /> Cuộc Thi Khởi Nghiệp ĐMST Khánh Hòa 2026
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Live Production MVP v1.0
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-heading">
              Physical Touch • Digital Memory • Enterprise Trust <br />
              <span className="bg-gradient-to-r from-[#0066FF] via-[#00C2FF] to-cyan-300 bg-clip-text text-transparent">
                Hệ Sinh Thái Định Danh Số B2B
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              <strong>ONE CONNECT NETWORK</strong> là nền tảng SaaS đột phá biến mọi điểm chạm sự kiện MICE và gặp gỡ doanh nhân thành <strong className="text-white">mối quan hệ kinh doanh có dữ liệu</strong>, điểm danh siêu tốc <strong className="text-cyan-400">&lt; 0.42s</strong> và tiên phong bảo mật 2 chiều tuân thủ nghiêm ngặt <strong className="text-cyan-400">Luật Dữ liệu Cá nhân 91/2025/QH15</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Button: Trải nghiệm dự án -> /login */}
              <Link href="/login">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold rounded-xl text-sm h-11 px-6 shadow-xl shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" /> Trải Nghiệm Dự Án Ngay
                </Button>
              </Link>

              {/* Button: Tìm hiểu thêm -> Scroll to features */}
              <button
                onClick={() => scrollToSection('features')}
                className="inline-flex items-center gap-2 border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-xl text-sm h-11 px-5 transition-all cursor-pointer"
              >
                <span>Tìm Hiểu Thêm</span>
                <ChevronDown className="w-4 h-4 text-cyan-400" />
              </button>

              {/* Button: Đăng ký */}
              <Link href="/register">
                <Button
                  size="lg"
                  variant="ghost"
                  className="gap-2 text-slate-300 hover:text-white hover:bg-slate-800 font-semibold text-sm h-11 px-4 cursor-pointer"
                >
                  Đăng ký tài khoản <ArrowRight className="w-4 h-4 text-slate-400" />
                </Button>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-black text-cyan-400 font-heading">0.42s</div>
                <div className="text-xs text-slate-400 font-medium">Tốc độ chạm NFC</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-heading">100%</div>
                <div className="text-xs text-slate-400 font-medium">PDPL 91 Consent</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-200 font-heading">85%</div>
                <div className="text-xs text-slate-400 font-medium">Tiết kiệm in ấn</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Card Showcase */}
          <div id="card3d" className="lg:col-span-5 flex flex-col items-center justify-center w-full min-w-0">
            <div className="w-full relative group">
              <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-cyan-400">
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" /> Danh Thiếp Số 3D NFC
                  </span>
                  <span className="text-[11px] text-slate-400">Di chuột hoặc lật 2 mặt</span>
                </div>

                <div className="flex justify-center py-2">
                  <BusinessCard3D
                    identity={previewIdentity}
                    card={previewCard}
                    theme={selectedTheme}
                    onReissueCard={() => reissueCard && reissueCard()}
                  />
                </div>

                {/* Theme Selector */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                  <span className="text-[11px] font-semibold">Màu phôi thẻ kim loại:</span>
                  <div className="flex gap-1.5">
                    {(['obsidian', 'sapphire', 'gold', 'emerald'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTheme(t)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                          selectedTheme === t ? 'scale-110 border-white' : 'border-transparent opacity-70'
                        } ${
                          t === 'obsidian'
                            ? 'bg-slate-900'
                            : t === 'sapphire'
                            ? 'bg-blue-600'
                            : t === 'gold'
                            ? 'bg-amber-500'
                            : 'bg-emerald-600'
                        }`}
                        title={`Thẻ ${t.toUpperCase()}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. INTERACTIVE 5-FEATURE SIMULATION HUB */}
      {/* ================================================================= */}
      <section id="features" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <Badge variant="outline" className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
            KHÁM PHÁ CÔNG NGHỆ ĐỘT PHÁ
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-heading">
            Trải Nghiệm Trực Tiếp 5 Phân Hệ Cốt Lõi
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Bấm chọn từng thẻ tính năng bên dưới để kích hoạt mô phỏng tương tác thực tế ngay trên trình duyệt.
          </p>
        </div>

        {/* Feature Tabs Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveSimTab('nfc')}
            className={`p-2.5 sm:p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSimTab === 'nfc'
                ? 'bg-[#0066FF] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5" /> Chạm NFC &lt;0.42s
          </button>
          <button
            onClick={() => setActiveSimTab('checkin')}
            className={`p-2.5 sm:p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSimTab === 'checkin'
                ? 'bg-[#0066FF] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Điểm Danh MICE &lt;1s
          </button>
          <button
            onClick={() => setActiveSimTab('consent')}
            className={`p-2.5 sm:p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSimTab === 'consent'
                ? 'bg-[#0066FF] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Chuẩn PDPL 91
          </button>
          <button
            onClick={() => setActiveSimTab('memory')}
            className={`p-2.5 sm:p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSimTab === 'memory'
                ? 'bg-[#0066FF] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Sổ Tay CRM B2B
          </button>
          <button
            onClick={() => setActiveSimTab('ai')}
            className={`col-span-2 sm:col-span-1 p-2.5 sm:p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSimTab === 'ai'
                ? 'bg-[#0066FF] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> Ghép Đôi AI B2B
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          
          {/* TAB 1: NFC TAP */}
          {activeSimTab === 'nfc' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 text-cyan-300 text-xs font-bold">
                  <Radio className="w-4 h-4 text-cyan-400" /> Tốc Độ Chạm Thực Tế Đo Được
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                  Chạm NFC &lt; 0.42 Giây — Không Cần Cài App
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Chỉ cần đưa thẻ One Connect chạm nhẹ vào mặt lưng điện thoại thông minh (iOS hoặc Android). Hệ thống lập tức mở danh thiếp điện tử đa phương tiện với đầy đủ hồ sơ doanh nghiệp, sản phẩm và danh mục liên hệ.
                </p>

                <div className="pt-2">
                  <Button
                    onClick={handleSimulateNfcTap}
                    disabled={nfcTapping}
                    className="w-full sm:w-auto gap-2 bg-[#0066FF] hover:bg-blue-600 text-white font-bold rounded-xl px-6 h-10 text-xs shadow-md cursor-pointer"
                  >
                    {nfcTapping ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Đang truyền sóng NFC...
                      </>
                    ) : (
                      <>
                        <Radio className="w-4 h-4 text-cyan-300" /> Bấm Thử Nghiệm Chạm Thẻ Vào Điện Thoại
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="md:col-span-6 flex flex-col items-center justify-center p-6 sm:p-8 bg-slate-950 rounded-2xl border border-slate-800 text-center relative overflow-hidden min-h-[280px]">
                {nfcTapping ? (
                  <div className="space-y-3 z-10 animate-pulse">
                    <div className="w-16 h-16 rounded-full bg-blue-500/30 border border-cyan-400 flex items-center justify-center mx-auto text-cyan-300">
                      <Radio className="w-8 h-8 animate-spin" />
                    </div>
                    <div className="text-cyan-300 font-bold text-xs">Đang nhận diện chip NFC NTAG215...</div>
                  </div>
                ) : nfcTapped ? (
                  <div className="space-y-3 z-10 animate-in fade-in zoom-in duration-300">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                      <Check className="w-7 h-7" />
                    </div>
                    <div className="text-emerald-400 font-extrabold text-sm sm:text-base">
                      ĐÃ MỞ KHÓA PROFILE ({tapLatency}ms)
                    </div>
                    <div className="bg-slate-900/95 rounded-xl p-3.5 text-left border border-slate-800 max-w-sm mx-auto text-xs space-y-1.5 shadow-lg">
                      <div className="font-bold text-white text-sm">Hồ Hoàng Long</div>
                      <div className="text-cyan-400 font-medium">Quản lý Dự án & Phát triển Sản phẩm</div>
                      <div className="text-slate-400 text-[11px]">Tập đoàn Công nghệ số A+ (A PLUSVN)</div>
                      <div className="text-emerald-400 text-[10px] font-mono pt-1">✓ Thẻ đã kích hoạt mã định danh 1C-NFC-KH2026</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 z-10 text-slate-400">
                    <Smartphone className="w-12 h-12 text-slate-500 mx-auto" />
                    <div className="text-sm font-semibold text-slate-300">Sẵn sàng nhận diện sóng NFC</div>
                    <div className="text-xs text-slate-500 max-w-xs">
                      Bấm nút bên trái để kích hoạt truyền tải danh thiếp số tức thì
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FAST CHECK-IN */}
          {activeSimTab === 'checkin' && (
            <div id="checkin" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 text-cyan-300 text-xs font-bold">
                  <Zap className="w-4 h-4 text-cyan-400" /> Trạm Điểm Danh Cửa Tốc Độ Cao
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                  Check-in Dưới 1 Giây & Cơ Chế Offline Sync
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Loại bỏ hoàn toàn việc in danh thiếp giấy và danh sách dò tên thủ công. Quét mã QR vé hoặc chạm thẻ NFC lập tức xác thực đại biểu kèm âm thanh xác nhận tức thì.
                </p>

                <div className="flex items-center gap-4 py-1">
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex-1">
                    <div className="text-xs text-slate-400 font-medium">Đại biểu đã có mặt</div>
                    <div className="text-xl font-extrabold text-emerald-400 font-mono">{attendeeCount} / 300</div>
                  </div>
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex-1">
                    <div className="text-xs text-slate-400 font-medium">Tốc độ đo được</div>
                    <div className="text-xl font-extrabold text-cyan-400 font-mono">140 ms</div>
                  </div>
                </div>

                <div className="pt-1">
                  <Button
                    onClick={handleSimulateCheckin}
                    disabled={checkinScanning}
                    className="w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-6 h-10 text-xs shadow-md cursor-pointer"
                  >
                    {checkinScanning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Đang quét mã QR vé...
                      </>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4" /> Quét Thử Nghiệm 1 Đại Biểu Tại Cửa
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="md:col-span-6 flex flex-col items-center justify-center p-6 sm:p-8 bg-slate-950 rounded-2xl border border-slate-800 text-center relative overflow-hidden min-h-[280px]">
                {checkinScanning ? (
                  <div className="space-y-3 z-10">
                    <div className="w-16 h-16 border-2 border-emerald-400 border-dashed rounded-xl flex items-center justify-center mx-auto text-emerald-400 animate-pulse">
                      <QrCode className="w-8 h-8" />
                    </div>
                    <div className="text-emerald-400 font-bold text-xs">Đang đối soát danh sách khách mời...</div>
                  </div>
                ) : checkinSuccess ? (
                  <div className="space-y-3 z-10 animate-in fade-in zoom-in duration-300">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                      <Check className="w-7 h-7" />
                    </div>
                    <div className="text-emerald-400 font-extrabold text-base">
                      ĐÃ CHECK-IN THÀNH CÔNG (140ms)
                    </div>
                    <div className="bg-slate-900 rounded-xl p-3 text-left border border-slate-800 max-w-sm mx-auto text-xs space-y-1">
                      <div className="text-slate-400 text-[11px]">Đại biểu vừa check-in:</div>
                      <div className="text-white font-bold">ThS. Nguyễn Văn Bình — Phó Giám Đốc Sở TT&TT</div>
                      <div className="text-cyan-400 text-[11px]">Vị trí bàn tiệc: Bàn VIP B3 (Hàng ghế đầu)</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 z-10 text-slate-400">
                    <QrCode className="w-12 h-12 text-slate-500 mx-auto" />
                    <div className="text-sm font-semibold text-slate-300">Camera Quét QR Trạm Cửa</div>
                    <div className="text-xs text-slate-500 max-w-xs">
                      Bấm nút để mô phỏng một đại biểu quét mã check-in qua cổng an ninh
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: 2-WAY CONSENT PDPL 91 */}
          {activeSimTab === 'consent' && (
            <div id="security" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" /> Bảo Mật & Pháp Lý Dữ Liệu
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                  Cơ Chế Đồng Thuận 2 Chiều Chuẩn Luật PDPL 91
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Thông tin cá nhân (SĐT, Email) mặc định được che giấu. Chỉ khi <strong>cả hai doanh nhân cùng đồng ý</strong> chia sẻ, dữ liệu liên hệ chi tiết mới được giải mã minh bạch.
                </p>

                <div className="pt-2">
                  <Button
                    onClick={() => setConsentGranted(!consentGranted)}
                    className={`w-full sm:w-auto gap-2 font-bold rounded-xl px-6 h-10 text-xs shadow-md transition-all cursor-pointer ${
                      consentGranted
                        ? 'bg-slate-800 hover:bg-slate-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {consentGranted ? (
                      <>
                        <Lock className="w-4 h-4" /> Khóa Lại (Thu Hồi Consent)
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4" /> Bấm Đồng Thuận 2 Chiều (Grant Consent)
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="md:col-span-6 p-6 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                  <span className="font-bold text-white text-sm">Hồ Sơ Đối Tác B2B</span>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                    consentGranted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {consentGranted ? '✓ ĐÃ ĐỒNG THUẬN (CONSENTED)' : 'CHẾ ĐỘ CÔNG KHAI (MASKED)'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="text-[11px] text-slate-400">Họ và tên / Chức vụ:</div>
                    <div className="font-bold text-slate-200 text-sm">Trần Minh Đức — Chủ tịch TechCorp</div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-400">Số Điện Thoại Bảo Mật:</div>
                    <div className="font-mono font-bold text-xs sm:text-sm">
                      {consentGranted ? (
                        <span className="text-emerald-400 animate-in fade-in duration-300">0923.456.789</span>
                      ) : (
                        <span className="text-slate-500">0923.•••.••• (Cần Consent 2 Chiều)</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-400">Email Giao Thương:</div>
                    <div className="font-mono font-bold text-xs sm:text-sm">
                      {consentGranted ? (
                        <span className="text-emerald-400 animate-in fade-in duration-300">minhduc@techcorp.vn</span>
                      ) : (
                        <span className="text-slate-500">m••••••@techcorp.vn (Cần Consent 2 Chiều)</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Tuân thủ Nghị định 13/2023/NĐ-CP & Luật Dữ liệu Cá nhân số 91/2025/QH15</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RELATIONSHIP MEMORY CRM */}
          {activeSimTab === 'memory' && (
            <div id="crm" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 text-cyan-300 text-xs font-bold">
                  <MessageSquare className="w-4 h-4 text-cyan-400" /> Sổ Tay Quan Hệ (Pre-CRM)
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                  Ghi Nhớ Bối Cảnh & Phân Loại Cơ Hội Giao Thương
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Lưu lại ngay lập tức bối cảnh cuộc gặp tại sự kiện, nhu cầu Cung - Cầu và gắn thẻ Lead WARM / HOT để đội ngũ kinh doanh chuyển hóa thành hợp đồng ký kết.
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Phân Loại Mức Độ Tiềm Năng (Lead Tag):</label>
                  <div className="flex gap-2">
                    {(['WARM', 'HOT', 'CONVERTED'] as const).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setLeadStatus(tag)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          leadStatus === tag
                            ? tag === 'HOT'
                              ? 'bg-red-600 text-white border-red-500'
                              : tag === 'WARM'
                              ? 'bg-amber-600 text-white border-amber-500'
                              : 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-6 p-6 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-cyan-400" /> Ghi Chú Riêng Tư (Private Note)
                  </span>
                  <Badge className={
                    leadStatus === 'HOT' ? 'bg-red-500' : leadStatus === 'WARM' ? 'bg-amber-500' : 'bg-emerald-500'
                  }>
                    {leadStatus} LEAD
                  </Badge>
                </div>

                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                  placeholder="Nhập ghi chú cuộc gặp..."
                />

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Hẹn gặp lại: Sáng Thứ 5 tuần tới tại Nha Trang</span>
                  <span className="text-emerald-400 font-bold">✓ Tự động đồng bộ CRM</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI MATCHMAKING */}
          {activeSimTab === 'ai' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 text-cyan-300 text-xs font-bold">
                  <Cpu className="w-4 h-4 text-cyan-400" /> Thuật Toán Ghép Đôi Giao Thương
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                  AI Matchmaking & Tự Động Xếp Bàn Tiệc
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Hệ thống phân tích ma trận Cung (Supply) và Cầu (Demand) của từng đại biểu để đề xuất đối tác giao thương tiềm năng nhất và chỉ định vị trí bàn tiệc tương thích.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1.5">Bên Cung Ứng:</label>
                    <select
                      value={supplyIndustry}
                      onChange={(e) => setSupplyIndustry(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                    >
                      <option>Công Nghệ & AI</option>
                      <option>Nông Sản Xuất Khẩu</option>
                      <option>Truyền Thông MICE</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1.5">Bên Nhu Cầu:</label>
                    <select
                      value={demandIndustry}
                      onChange={(e) => setDemandIndustry(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                    >
                      <option>Khách Sạn & MICE</option>
                      <option>Chuỗi Bán Lẻ</option>
                      <option>Chuyển Đổi Số</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="md:col-span-6 p-6 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-3 text-center">
                <div className="w-14 h-14 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center mx-auto text-cyan-300">
                  <Sparkles className="w-7 h-7 animate-spin" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Độ Tương Thích AI Đánh Giá</div>
                  <div className="text-2xl font-black text-cyan-300 font-heading">96% COMPATIBILITY</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-left text-xs space-y-1">
                  <div className="text-white font-bold">Chỉ định phiên giao thương:</div>
                  <div className="text-cyan-300 font-semibold">Bàn VIP A1 — Phiên Kết Nối Công Nghệ & Du Lịch MICE</div>
                  <div className="text-[11px] text-slate-400">Dự kiến giá trị thương thảo: 250,000,000 VNĐ</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. 4 TRỤ CỘT GIÁ TRỊ CỐT LÕI */}
      {/* ================================================================= */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <Badge variant="outline" className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            GIÁ TRỊ VƯỢT TRỘI
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-heading">
            Tại Sao Doanh Nghiệp & Ban Tổ Chức Chọn One Connect?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="border-slate-800 hover:border-cyan-500/50 hover:shadow-xl transition-all rounded-3xl bg-slate-900/90 text-slate-100">
            <CardHeader className="pb-2 p-5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 mb-2">
                <Leaf className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm sm:text-base font-bold text-white">MICE Xanh & Net-Zero</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 leading-relaxed px-5 pb-5 pt-0">
              Cắt giảm 100% rác thải danh thiếp giấy và dây đeo thẻ nhựa dùng một lần. Tiết kiệm hàng trăm triệu đồng chi phí in ấn cho mỗi kỳ hội nghị.
            </CardContent>
          </Card>

          <Card className="border-slate-800 hover:border-cyan-500/50 hover:shadow-xl transition-all rounded-3xl bg-slate-900/90 text-slate-100">
            <CardHeader className="pb-2 p-5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 mb-2">
                <RefreshCw className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm sm:text-base font-bold text-white">Bảo Toàn Dữ Liệu Thẻ</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 leading-relaxed px-5 pb-5 pt-0">
              Tách biệt UID chip NFC vật lý khỏi mã định danh. Đổi/cấp lại phôi thẻ kim loại trong 30 giây mà không bao giờ mất danh bạ đã kết nối.
            </CardContent>
          </Card>

          <Card className="border-slate-800 hover:border-cyan-500/50 hover:shadow-xl transition-all rounded-3xl bg-slate-900/90 text-slate-100">
            <CardHeader className="pb-2 p-5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm sm:text-base font-bold text-white">Chuẩn Luật PDPL 91</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 leading-relaxed px-5 pb-5 pt-0">
              Tiên phong tuân thủ Luật Bảo vệ Dữ liệu Cá nhân số 91/2025/QH15. Cơ chế Đồng thuận 2 chiều minh bạch, quyền xuất dữ liệu và xóa bỏ.
            </CardContent>
          </Card>

          <Card className="border-slate-800 hover:border-cyan-500/50 hover:shadow-xl transition-all rounded-3xl bg-slate-900/90 text-slate-100">
            <CardHeader className="pb-2 p-5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 mb-2">
                <TrendingUp className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm sm:text-base font-bold text-white">Chuyển Hóa Hợp Đồng</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 leading-relaxed px-5 pb-5 pt-0">
              Biến điểm chạm thoáng qua thành hợp đồng giao thương qua Sổ tay quan hệ, gắn thẻ phân loại Lead WARM/HOT và nhắc lịch hẹn tự động.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 5. INTERACTIVE ESG & ROI CALCULATOR */}
      {/* ================================================================= */}
      <section id="calculator" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-slate-900/95 rounded-3xl p-6 sm:p-10 text-white border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-xs">
              BỘ TÍNH TOÁN HIỆU QUẢ KINH TẾ & MÔI TRƯỜNG
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-white">
              Ước Tính Giá Trị Tiết Kiệm Khi Áp Dụng One Connect
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Kéo thanh trượt bên dưới để ước tính chi phí in ấn tiết kiệm và chỉ số Xanh (ESG) theo quy mô tổ chức của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-6 rounded-2xl border border-slate-800">
            {/* Sliders */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-300">
                  <span>Số lượng Đại biểu / Sự kiện:</span>
                  <span className="text-cyan-400 font-mono font-bold">{attendeesPerEvent} Người</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={attendeesPerEvent}
                  onChange={(e) => setAttendeesPerEvent(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-300">
                  <span>Số Sự Kiện / Năm:</span>
                  <span className="text-cyan-400 font-mono font-bold">{eventsPerYear} Sự kiện</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={eventsPerYear}
                  onChange={(e) => setEventsPerYear(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Realtime Computed Metrics */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Tiết Kiệm In Ấn</div>
                <div className="text-lg sm:text-2xl font-extrabold text-emerald-400 font-mono">
                  {(paperCostSaved / 1000000).toFixed(1)} Triệu
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Cắt Giảm CO2</div>
                <div className="text-lg sm:text-2xl font-extrabold text-cyan-400 font-mono">
                  {co2SavedKg} kg CO2
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Giảm Danh Thiếp Rác</div>
                <div className="text-lg sm:text-2xl font-extrabold text-slate-200 font-mono">
                  {totalDelegates.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Tờ
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Thời Gian Đón Tiếp Giảm</div>
                <div className="text-lg sm:text-2xl font-extrabold text-cyan-400 font-mono">
                  {checkinHoursSaved} Giờ
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 6. GÓI DỊCH VỤ & HỘI VIÊN */}
      {/* ================================================================= */}
      <section id="pricing" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <Badge variant="outline" className="px-3 py-1 bg-blue-500/10 text-cyan-400 border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
            GÓI HỘI VIÊN & GIẢI PHÁP DOANH NGHIỆP
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-heading">
            Lựa Chọn Giải Pháp Phù Hợp
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Từ doanh nhân độc lập đến các tổ chức Hiệp hội, One Connect cung cấp đầy đủ công cụ định danh và kết nối thông minh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan 1 */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all">
            <div className="space-y-4">
              <Badge className="bg-slate-800 text-slate-300 text-xs font-bold">CÁ NHÂN & DOANH NHÂN</Badge>
              <div className="text-xl font-extrabold text-white font-heading">Thẻ Danh Thiếp Số</div>
              <p className="text-xs text-slate-400">Dành cho chủ doanh nghiệp, chuyên viên kinh doanh và tư vấn độc lập.</p>
              
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">✓ 01 Phôi thẻ kim loại khắc tên Laser cá nhân</li>
                <li className="flex items-center gap-2">✓ Profile số không giới hạn chỉnh sửa</li>
                <li className="flex items-center gap-2">✓ Dynamic QR Code chống giả mạo</li>
                <li className="flex items-center gap-2">✓ Sổ tay quan hệ & lưu danh bạ 1-chạm</li>
              </ul>
            </div>

            <Link href="/login" className="w-full">
              <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs h-10 cursor-pointer">
                Trải nghiệm miễn phí
              </Button>
            </Link>
          </div>

          {/* Plan 2: Highlighted */}
          <div className="rounded-3xl bg-gradient-to-b from-blue-950/60 to-slate-900 border-2 border-[#0066FF] p-6 flex flex-col justify-between space-y-6 shadow-2xl relative">
            <div className="absolute -top-3 right-6 bg-[#0066FF] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
              PHỔ BIẾN NHẤT
            </div>
            
            <div className="space-y-4">
              <Badge className="bg-blue-500/20 text-cyan-300 text-xs font-bold">DOANH NGHIỆP & EVENT MICE</Badge>
              <div className="text-xl font-extrabold text-white font-heading">Trạm Check-in & CRM B2B</div>
              <p className="text-xs text-slate-300">Dành cho công ty tổ chức sự kiện, diễn đàn và kết nối giao thương.</p>
              
              <ul className="space-y-2 text-xs text-slate-200">
                <li className="flex items-center gap-2 text-cyan-300">✓ Toàn bộ tính năng gói Cá Nhân</li>
                <li className="flex items-center gap-2">✓ Trạm Check-in tốc độ cao &lt; 1s tại cửa</li>
                <li className="flex items-center gap-2">✓ B2B Matching & Xếp bàn tiệc AI</li>
                <li className="flex items-center gap-2">✓ Dashboard báo cáo & Xuất dữ liệu Excel</li>
                <li className="flex items-center gap-2">✓ Cơ chế Offline-First khi mất mạng</li>
              </ul>
            </div>

            <Link href="/login" className="w-full">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl text-xs h-10 shadow-lg shadow-blue-500/25 cursor-pointer">
                Trải nghiệm dự án ngay
              </Button>
            </Link>
          </div>

          {/* Plan 3 */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all">
            <div className="space-y-4">
              <Badge className="bg-slate-800 text-slate-300 text-xs font-bold">HIỆP HỘI & TỔ CHỨC</Badge>
              <div className="text-xl font-extrabold text-white font-heading">Mạng Lưới Hội Viên Toàn Diện</div>
              <p className="text-xs text-slate-400">Dành cho YBA, BNI, VCCI, Hội Doanh nhân trẻ các tỉnh thành.</p>
              
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">✓ Quản trị danh bạ hội viên tập trung</li>
                <li className="flex items-center gap-2">✓ Phân quyền Ban Chấp Hành / Hội Viên (RBAC)</li>
                <li className="flex items-center gap-2">✓ Cấp tên miền riêng & Thương hiệu tổ chức</li>
                <li className="flex items-center gap-2">✓ Cổng kết nối Cung - Cầu nội bộ</li>
              </ul>
            </div>

            <Link href="/register" className="w-full">
              <Button variant="outline" className="w-full border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs h-10 cursor-pointer">
                Liên hệ hợp tác
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 7. SHOWCASE BỘ HỒ SƠ CUỘC THI KHỞI NGHIỆP ĐMST 2026 */}
      {/* ================================================================= */}
      <section id="dossier" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <Badge variant="outline" className="px-3 py-1 bg-blue-500/10 text-cyan-400 border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
            HỒ SƠ CHÍNH THỨC
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-heading">
            Bộ Hồ Sơ Tham Dự Cuộc Thi Khởi Nghiệp ĐMST 2026
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Toàn bộ 5 tài liệu đã được chuẩn hóa và đồng bộ 100% theo thông tin đăng ký chính thức của đại diện dự án Hồ Hoàng Long.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {/* Doc 1 */}
          <Card className="border-slate-800 rounded-2xl bg-slate-900 hover:border-cyan-500/50 transition-all text-slate-100">
            <CardHeader className="pb-2 p-5">
              <Badge className="w-fit bg-blue-500/20 text-cyan-300 text-[10px] font-bold">VĂN BẢN 01</Badge>
              <CardTitle className="text-sm font-bold text-white">Đơn Đăng Ký Dự Thi</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 space-y-1.5 px-5 pb-5 pt-0">
              <p>Đại diện Hồ Hoàng Long (CCCD 056095014168), Tập đoàn Công nghệ số A+ (A PLUSVN).</p>
              <div className="text-cyan-400 font-semibold text-[11px]">✓ Đầy đủ chữ ký & cam kết SHTT</div>
            </CardContent>
          </Card>

          {/* Doc 2 */}
          <Card className="border-slate-800 rounded-2xl bg-slate-900 hover:border-emerald-500/50 transition-all text-slate-100">
            <CardHeader className="pb-2 p-5">
              <Badge className="w-fit bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">VĂN BẢN 02</Badge>
              <CardTitle className="text-sm font-bold text-white">Bản Thuyết Minh Dự Án</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 space-y-1.5 px-5 pb-5 pt-0">
              <p>Đặc tả 8 phần: Tính cấp thiết MICE Khánh Hòa, giải pháp công nghệ, Lean Canvas, ESG và kế hoạch Pilot.</p>
              <div className="text-emerald-400 font-semibold text-[11px]">✓ Khảo sát & Luận chứng thực tế</div>
            </CardContent>
          </Card>

          {/* Doc 3 */}
          <Card className="border-slate-800 rounded-2xl bg-slate-900 hover:border-purple-500/50 transition-all text-slate-100">
            <CardHeader className="pb-2 p-5">
              <Badge className="w-fit bg-purple-500/20 text-purple-300 text-[10px] font-bold">VĂN BẢN 03</Badge>
              <CardTitle className="text-sm font-bold text-white">Kịch Bản Pitching 10 Slides</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 space-y-1.5 px-5 pb-5 pt-0">
              <p>Khung thuyết trình 3 - 5 phút chuẩn quốc tế kèm lời thoại chi tiết và kịch bản Live Demo trực tiếp.</p>
              <div className="text-purple-400 font-semibold text-[11px]">✓ Kèm lời thoại từng slide</div>
            </CardContent>
          </Card>

          {/* Doc 4 */}
          <Card className="border-slate-800 rounded-2xl bg-slate-900 hover:border-amber-500/50 transition-all text-slate-100">
            <CardHeader className="pb-2 p-5">
              <Badge className="w-fit bg-amber-500/20 text-amber-300 text-[10px] font-bold">VĂN BẢN 04</Badge>
              <CardTitle className="text-sm font-bold text-white">Ma Trận SWOT & Rủi Ro</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 space-y-1.5 px-5 pb-5 pt-0">
              <p>Phân tích 4 góc độ SWOT và biện pháp xử lý rủi ro mất mạng (Offline-First), hỏng thẻ, pháp lý dữ liệu.</p>
              <div className="text-amber-400 font-semibold text-[11px]">✓ Cơ chế Offline Sync & Backup</div>
            </CardContent>
          </Card>

          {/* Doc 5 */}
          <Card className="border-slate-800 rounded-2xl bg-slate-900 hover:border-indigo-500/50 transition-all text-slate-100">
            <CardHeader className="pb-2 p-5">
              <Badge className="w-fit bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">VĂN BẢN 05</Badge>
              <CardTitle className="text-sm font-bold text-white">Kế Hoạch Tài Chính 2026-2028</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 space-y-1.5 px-5 pb-5 pt-0">
              <p>Unit Economics: CAC = 85k, LTV = 1.45M, LTV/CAC = 17x. Kế hoạch sử dụng vốn mồi 30k – 50k USD.</p>
              <div className="text-indigo-400 font-semibold text-[11px]">✓ Điểm hòa vốn trong 1.5 tháng</div>
            </CardContent>
          </Card>

          {/* Team Box */}
          <Card className="border-blue-500/40 bg-blue-950/20 rounded-2xl flex flex-col justify-between text-slate-100">
            <CardHeader className="pb-2 p-5">
              <Badge className="w-fit bg-[#0066FF] text-white text-[10px] font-bold">ĐỘI NGŨ SÁNG LẬP</Badge>
              <CardTitle className="text-sm font-bold text-white">Tập Đoàn Công Nghệ Số A+</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 space-y-1 px-5 pb-5 pt-0">
              <div>• <strong>Hồ Hoàng Long:</strong> Quản lý dự án & sản phẩm</div>
              <div>• <strong>Nguyễn Nhật Thanh:</strong> Trưởng phòng phát triển AI</div>
              <div>• <strong>Trần Tuấn Kiệt:</strong> Định hướng kinh doanh</div>
              <div className="pt-1.5 text-[11px] text-slate-400">Địa chỉ: Tầng 8, Tòa nhà ASIA, 25 Lê Lợi, TP. Nha Trang</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 8. CALL TO ACTION FOOTER BANNER */}
      {/* ================================================================= */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-heading relative z-10">
            Sẵn Sàng Kiến Tạo Du Lịch MICE Xanh & Định Danh Số Doanh Nghiệp
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto relative z-10">
            Dự án One Connect đã sẵn sàng cho sự kiện Pilot 150 - 300 đại biểu tại tỉnh Khánh Hòa trong Quý 4/2026.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 relative z-10">
            <Link href="/login">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold rounded-xl h-11 px-6 text-sm shadow-xl shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" /> Trải Nghiệm Dự Án Ngay
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl h-11 px-5 text-sm cursor-pointer"
              >
                Đăng ký tài khoản mới
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 9. GLOBAL FOOTER */}
      {/* ================================================================= */}
      <footer className="border-t border-slate-800/80 bg-[#040814] py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/one_connect_final_logo_orange.png"
              alt="One Connect Logo"
              className="h-7 w-auto object-contain"
            />
            <span>© 2026 ONE CONNECT NETWORK. Bảo lưu mọi quyền.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Tuân thủ Nghị định 13 & Luật PDPL 91
            </span>
            <Link href="/login" className="hover:text-white transition-colors">
              Đăng nhập
            </Link>
            <Link href="/register" className="hover:text-white transition-colors">
              Đăng ký
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
