'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BusinessCard3D from '@/components/BusinessCard3D';
import { useOneConnectStore } from '@/lib/store';
import {
  CreditCard,
  Users,
  Calendar,
  Zap,
  ShieldCheck,
  Building2,
  BarChart3,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  TrendingUp,
  Smartphone,
  Layers,
  Lock,
  Compass,
  FileText,
  Play,
  RotateCw,
  QrCode,
  Sliders,
  DollarSign,
  Leaf,
  Check,
  ChevronRight,
  ExternalLink,
  Download,
  Share2,
  Award,
  Globe,
  Radio,
  Eye,
  Unlock,
  Tag,
  Cpu,
  RefreshCw,
  Search,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const { state, currentIdentity, currentCard, reissueCard } = useOneConnectStore();

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

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-10 antialiased">
      {/* ========================================================================= */}
      {/* 1. EXECUTIVE HERO BANNER (ĐỒNG BỘ THEO GIAO DIỆN LIVE WEB DEMO) */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-blue-50/35 to-slate-50 border border-slate-200/90 p-4 sm:p-6 lg:p-7 shadow-xs text-slate-900">
        {/* Glow ambient background effects */}
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#0066FF] text-[11px] font-bold tracking-wide shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" /> Cuộc Thi Khởi Nghiệp ĐMST Khánh Hòa 2026
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Live MVP v1.0
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug font-heading">
              Physical Touch • Digital Memory • Enterprise Trust <br />
              <span className="bg-gradient-to-r from-[#0066FF] to-[#00C2FF] bg-clip-text text-transparent">
                Hạ Tầng Định Danh Số B2B
              </span>
            </h1>

            <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed max-w-2xl font-normal">
              <strong>ONE CONNECT NETWORK</strong> là nền tảng SaaS đột phá biến mọi điểm chạm sự kiện MICE và gặp gỡ doanh nhân thành <strong className="text-slate-900">mối quan hệ kinh doanh có dữ liệu</strong>, điểm danh siêu tốc <strong className="text-[#0066FF]">&lt;0.42s</strong> và tiên phong bảo mật 2 chiều tuân thủ nghiêm ngặt <strong className="text-[#0066FF]">Luật Dữ liệu Cá nhân 91/2025/QH15</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <Link href="#features">
                <Button size="default" className="gap-2 bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs h-9 px-4 shadow-xs transition-all active:scale-95 cursor-pointer">
                  <Play className="w-3.5 h-3.5 fill-white" /> Khám Phá 5 Tính Năng Đột Phá
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="default" variant="outline" className="gap-2 border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-[#0066FF] font-bold rounded-xl text-xs h-9 px-3.5 cursor-pointer">
                  <Layers className="w-3.5 h-3.5" /> Dashboard Quản Trị
                </Button>
              </Link>
              <Link href="/operator/checkin">
                <Button size="default" variant="outline" className="gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs h-9 px-3.5 cursor-pointer">
                  <Zap className="w-3.5 h-3.5 text-slate-700" /> Trạm Check-in (&lt;1s)
                </Button>
              </Link>
              <Link href="#dossier">
                <Button size="default" variant="ghost" className="gap-2 text-[#0066FF] hover:text-blue-800 hover:bg-blue-50/50 font-semibold text-xs h-9 px-3 cursor-pointer">
                  <FileText className="w-3.5 h-3.5" /> Xem Hồ Sơ Cuộc Thi <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-2.5 border-t border-slate-200/80 max-w-lg">
              <div>
                <div className="text-base sm:text-xl font-black text-[#0066FF] font-heading">0.42s</div>
                <div className="text-[10.5px] text-slate-500 font-medium">Tốc độ chạm NFC</div>
              </div>
              <div>
                <div className="text-base sm:text-xl font-black text-emerald-600 font-heading">100%</div>
                <div className="text-[10.5px] text-slate-500 font-medium">PDPL 91 Consent</div>
              </div>
              <div>
                <div className="text-base sm:text-xl font-black text-slate-800 font-heading">85%</div>
                <div className="text-[10.5px] text-slate-500 font-medium">Tiết kiệm in ấn</div>
              </div>
            </div>
          </div>

          {/* Right Hero: Interactive 3D Card Simulation */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center w-full min-w-0">
            <div className="w-full relative group">
              <div className="relative rounded-2xl bg-white border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2.5 text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-[#0066FF]">
                    <Radio className="w-3.5 h-3.5 text-[#0066FF]" /> Thẻ 3D NFC Thông Minh
                  </span>
                  <span className="text-[10.5px] text-slate-400">Chạm hoặc lật 2 mặt</span>
                </div>

                {currentIdentity ? (
                  <BusinessCard3D
                    identity={currentIdentity}
                    card={currentCard}
                    onReissueCard={() => reissueCard()}
                  />
                ) : (
                  <div className="h-48 flex items-center justify-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                    Đang nạp thẻ danh thiếp 3D...
                  </div>
                )}

                <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0066FF]" /> Chuẩn mã hóa NFC NTAG216
                  </span>
                  <Link href="/dashboard/card" className="text-[#0066FF] hover:underline font-semibold flex items-center gap-0.5">
                    Tùy chỉnh thẻ <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE FEATURE SIMULATOR HUB (5-IN-1) */}
      {/* ========================================================================= */}
      <section id="features" className="space-y-4">
        <div className="text-center max-w-3xl mx-auto space-y-1">
          <Badge variant="outline" className="px-2.5 py-0.5 bg-blue-50 text-[#0066FF] border-blue-200 text-[11px] font-bold uppercase tracking-wider">
            VÒNG LẶP TRẢI NGHIỆM TƯƠNG TÁC THỰC TẾ
          </Badge>
          <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight font-heading whitespace-normal sm:whitespace-nowrap">
            5 Trải Nghiệm Đột Phá Của One Connect
          </h2>
          <p className="text-xs text-slate-600">
            Khám phá trực quan từng cấu phần: từ cú chạm NFC siêu tốc 0.42s đến bảo mật PDPL 91 và bộ nhớ quan hệ.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl max-w-3xl mx-auto border border-slate-200/80">
          <button
            onClick={() => setActiveSimTab('nfc')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSimTab === 'nfc'
                ? 'bg-white text-[#0066FF] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> 1. Chạm NFC 0.42s
          </button>
          <button
            onClick={() => setActiveSimTab('checkin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSimTab === 'checkin'
                ? 'bg-white text-[#0066FF] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> 2. Trạm Check-in &lt;1s
          </button>
          <button
            onClick={() => setActiveSimTab('consent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSimTab === 'consent'
                ? 'bg-white text-[#0066FF] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> 3. Bảo Mật PDPL 91
          </button>
          <button
            onClick={() => setActiveSimTab('memory')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSimTab === 'memory'
                ? 'bg-white text-[#0066FF] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> 4. Bộ Nhớ Quan Hệ
          </button>
          <button
            onClick={() => setActiveSimTab('ai')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSimTab === 'ai'
                ? 'bg-white text-[#0066FF] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> 5. AI Matchmaking
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7 max-w-4xl mx-auto">
          {/* SIMULATOR 1: NFC TAP */}
          {activeSimTab === 'nfc' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-6 space-y-3.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0066FF] text-xs font-bold">
                  <Smartphone className="w-3.5 h-3.5" /> Thẻ NFC Kim Loại 1-Chạm Không Ma Sát
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Chạm 1 Giây Mở Hồ Sơ Doanh Nhân Số
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Không cần cài App. Tương thích 100% iPhone và Android. Chip NFC NTAG216 truyền tải đường dẫn định danh mã hóa, lập tức giải nén hồ sơ năng lực 3D.
                </p>

                {/* Material Switcher */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-700">Chọn Chất Liệu Thẻ Vật Lý:</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedTheme('obsidian')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        selectedTheme === 'obsidian'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Obsidian Metal
                    </button>
                    <button
                      onClick={() => setSelectedTheme('sapphire')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        selectedTheme === 'sapphire'
                          ? 'bg-blue-900 text-white border-blue-900 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Sapphire Blue
                    </button>
                    <button
                      onClick={() => setSelectedTheme('gold')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        selectedTheme === 'gold'
                          ? 'bg-amber-900 text-amber-100 border-amber-800 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      24K Gold
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <Button
                    onClick={handleSimulateNfcTap}
                    disabled={nfcTapping}
                    className="w-full sm:w-auto gap-2 bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl px-5 h-9 text-xs shadow-xs cursor-pointer"
                  >
                    {nfcTapping ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang truyền sóng NFC...
                      </>
                    ) : (
                      <>
                        <Radio className="w-3.5 h-3.5 text-cyan-300" /> Bấm Thử Nghiệm Chạm Thẻ Vào Điện Thoại
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* High Contrast Screen Box */}
              <div className="md:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center relative overflow-hidden min-h-[260px]">
                {nfcTapping ? (
                  <div className="space-y-3 z-10 animate-pulse">
                    <div className="w-14 h-14 rounded-full bg-blue-500/30 border border-cyan-400 flex items-center justify-center mx-auto text-cyan-300">
                      <Radio className="w-7 h-7 animate-spin" />
                    </div>
                    <div className="text-cyan-300 font-bold text-xs">Đang kích hoạt sóng NFC...</div>
                  </div>
                ) : nfcTapped ? (
                  <div className="space-y-2.5 z-10 animate-in fade-in zoom-in duration-300">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                      <Check className="w-6 h-6" />
                    </div>
                    <div className="text-emerald-400 font-extrabold text-sm">
                      ĐÃ MỞ KHÓA PROFILE ({tapLatency}ms)
                    </div>
                    <div className="bg-slate-900/90 rounded-xl p-3 text-left border border-slate-800 max-w-xs mx-auto text-xs space-y-1">
                      <div className="font-bold text-white">Hồ Hoàng Long</div>
                      <div className="text-[11px] text-cyan-400">Quản lý Dự án & Phát triển Sản phẩm</div>
                      <div className="text-[10px] text-slate-400">Tập đoàn Công nghệ số A+ (A PLUSVN)</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 z-10 text-slate-400">
                    <Smartphone className="w-10 h-10 text-slate-500 mx-auto" />
                    <div className="text-xs font-semibold text-slate-300">Chưa có tín hiệu NFC</div>
                    <div className="text-[11px] text-slate-500 max-w-xs">
                      Bấm nút bên trái để kích hoạt truyền tải danh thiếp số
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SIMULATOR 2: FAST CHECK-IN */}
          {activeSimTab === 'checkin' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-6 space-y-3.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-bold">
                  <Zap className="w-3.5 h-3.5 text-slate-700" /> Trạm Điểm Danh Cửa Tốc Độ Cao
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Check-in Dưới 1 Giây & Offline Sync
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Loại bỏ hoàn toàn việc in thẻ đeo giấy và danh sách dò tên thủ công. Quét mã QR vé hoặc chạm thẻ NFC lập tức xác thực đại biểu với âm thanh <em>*Beep!*</em> xác nhận.
                </p>

                <div className="flex items-center gap-3 py-1">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="text-[11px] text-slate-500 font-medium">Đại biểu đã có mặt</div>
                    <div className="text-lg font-extrabold text-emerald-600 font-mono">{attendeeCount} / 300</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="text-[11px] text-slate-500 font-medium">Tốc độ đo được</div>
                    <div className="text-lg font-extrabold text-[#0066FF] font-mono">140 ms</div>
                  </div>
                </div>

                <div className="pt-1">
                  <Button
                    onClick={handleSimulateCheckin}
                    disabled={checkinScanning}
                    className="w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-5 h-9 text-xs shadow-xs cursor-pointer"
                  >
                    {checkinScanning ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang quét mã QR...
                      </>
                    ) : (
                      <>
                        <QrCode className="w-3.5 h-3.5" /> Quét Thử Nghiệm 1 Đại Biểu Tại Cửa
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Simulation Box */}
              <div className="md:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center relative overflow-hidden min-h-[260px]">
                {checkinScanning ? (
                  <div className="space-y-3 z-10">
                    <div className="w-16 h-16 border-2 border-emerald-400 border-dashed rounded-xl flex items-center justify-center mx-auto text-emerald-400 animate-pulse">
                      <QrCode className="w-8 h-8" />
                    </div>
                    <div className="text-emerald-400 font-bold text-xs">Đang đối chiếu danh sách vé Supabase...</div>
                  </div>
                ) : checkinSuccess ? (
                  <div className="space-y-2 z-10 animate-in fade-in zoom-in duration-300">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                      <Check className="w-5 h-5" />
                    </div>
                    <div className="text-emerald-400 font-extrabold text-xs tracking-wide">
                      VERIFIED • VIP DELEGATE (140ms)
                    </div>
                    <div className="bg-slate-900/90 rounded-xl p-3 text-left border border-slate-800 max-w-xs mx-auto text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">Nguyễn Thu Hà</span>
                        <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[9.5px] font-bold rounded">VIP BÀN A1</span>
                      </div>
                      <div className="text-[11px] text-slate-300">Tổng Giám Đốc Vinacoffee</div>
                      <div className="text-[9.5px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Cổng Gate 1 - Đã gửi thông báo Zalo OA
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 z-10 text-slate-400">
                    <Zap className="w-10 h-10 text-slate-500 mx-auto" />
                    <div className="text-xs font-semibold text-slate-300">Trạm Check-in Sẵn Sàng (Live Gate)</div>
                    <div className="text-[11px] text-slate-500 max-w-xs">
                      Bấm nút bên trái để thực hiện điểm danh đại biểu tức thì
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SIMULATOR 3: 2-WAY CONSENT */}
          {activeSimTab === 'consent' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-6 space-y-3.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Chuẩn Pháp Lý PDPL 91/2025/QH15
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Ma Trận Bảo Mật Đồng Thuận 2 Chiều
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thông tin cá nhân nhạy cảm (SĐT cá nhân, Email bảo mật) tự động che mờ (Data Masking). Chỉ khi cả 2 bên cùng xác nhận <strong>Consent</strong>, dữ liệu mới được giải mã.
                </p>

                <div className="pt-1">
                  <Button
                    onClick={() => setConsentGranted(!consentGranted)}
                    className={`w-full sm:w-auto gap-2 font-bold rounded-xl px-5 h-9 text-xs shadow-xs transition-all cursor-pointer ${
                      consentGranted
                        ? 'bg-slate-800 hover:bg-slate-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {consentGranted ? (
                      <>
                        <Lock className="w-3.5 h-3.5" /> Khóa Lại (Thu Hồi Consent)
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" /> Bấm Đồng Thuận 2 Chiều (Grant Consent)
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Simulation Box */}
              <div className="md:col-span-6 p-5 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white">Hồ Sơ Đối Tác B2B</span>
                  <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                    consentGranted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {consentGranted ? '✓ ĐÃ ĐỒNG THUẬN (CONSENTED)' : 'CHẾ ĐỘ CÔNG KHAI (MASKED)'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div>
                    <div className="text-[10px] text-slate-400">Họ và tên / Chức vụ:</div>
                    <div className="font-bold text-slate-200">Trần Minh Đức — Chủ tịch TechCorp</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400">Số Điện Thoại Bảo Mật:</div>
                    <div className="font-mono font-bold text-xs">
                      {consentGranted ? (
                        <span className="text-emerald-400 animate-in fade-in duration-300">0923.456.789</span>
                      ) : (
                        <span className="text-slate-500">0923.•••.••• (Cần Consent)</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400">Email Giao Thương:</div>
                    <div className="font-mono font-bold text-xs">
                      {consentGranted ? (
                        <span className="text-emerald-400 animate-in fade-in duration-300">minhduc@techcorp.vn</span>
                      ) : (
                        <span className="text-slate-500">m••••••@techcorp.vn (Cần Consent)</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[9.5px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Tuân thủ Nghị định 13/2023/NĐ-CP & Luật PDPL 91
                </div>
              </div>
            </div>
          )}

          {/* SIMULATOR 4: RELATIONSHIP MEMORY */}
          {activeSimTab === 'memory' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-6 space-y-3.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-bold">
                  <MessageSquare className="w-3.5 h-3.5" /> Sổ Tay Quan Hệ (Pre-CRM)
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Ghi Nhớ Bối Cảnh & Phân Loại Khách Hàng
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Lưu lại ngay lập tức bối cảnh cuộc gặp tại sự kiện, nhu cầu Cung - Cầu và gắn thẻ Lead WARM / HOT để không bao giờ bỏ lỡ cơ hội ký kết hợp đồng.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Phân Loại Mức Độ Tiềm Năng (Lead Tag):</label>
                  <div className="flex gap-2">
                    {(['WARM', 'HOT', 'CONVERTED'] as const).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setLeadStatus(tag)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          leadStatus === tag
                            ? tag === 'HOT'
                              ? 'bg-red-500 text-white border-red-500'
                              : tag === 'WARM'
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Simulation Box */}
              <div className="md:col-span-6 p-5 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-cyan-400" /> Ghi Chú Riêng Tư (Private Note)
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                  placeholder="Nhập ghi chú cuộc gặp..."
                />

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Hẹn gặp lại: Sáng Thứ 5 tuần tới</span>
                  <span className="text-emerald-400 font-bold">✓ Tự động lưu vào CRM</span>
                </div>
              </div>
            </div>
          )}

          {/* SIMULATOR 5: AI MATCHMAKING */}
          {activeSimTab === 'ai' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-6 space-y-3.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-bold">
                  <Cpu className="w-3.5 h-3.5" /> Thuật Toán AI Ghép Đôi Giao Thương
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  AI Matchmaking & Tự Động Xếp Bàn Tiệc
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thuật toán tự động phân tích ma trận Cung (Supply) và Cầu (Demand) của từng đại biểu để đề xuất đối tác giao thương tiềm năng nhất và chỉ định bàn tiệc tương thích.
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Bên Cung Ứng:</label>
                    <select
                      value={supplyIndustry}
                      onChange={(e) => setSupplyIndustry(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    >
                      <option>Công Nghệ & AI</option>
                      <option>Nông Sản Xuất Khẩu</option>
                      <option>Truyền Thông MICE</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Bên Nhu Cầu:</label>
                    <select
                      value={demandIndustry}
                      onChange={(e) => setDemandIndustry(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    >
                      <option>Khách Sạn & MICE</option>
                      <option>Chuỗi Bán Lẻ</option>
                      <option>Chuyển Đổi Số</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Simulation Box */}
              <div className="md:col-span-6 p-5 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2.5 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center mx-auto text-cyan-300">
                  <Sparkles className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Độ Tương Thích AI Đánh Giá</div>
                  <div className="text-xl font-black text-cyan-300">96% COMPATIBILITY</div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-left text-xs space-y-1">
                  <div className="text-white font-bold">Chỉ định phiên giao thương:</div>
                  <div className="text-cyan-300 font-semibold">Bàn VIP A1 — Phiên Kết Nối Công Nghệ & Du Lịch MICE</div>
                  <div className="text-[10px] text-slate-400">Dự kiến giá trị thương thảo: 250,000,000 VNĐ</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. 4 TRỤ CỘT GIÁ TRỊ CỐT LÕI (CORE VALUE PILLARS) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="text-center max-w-3xl mx-auto space-y-1">
          <Badge variant="outline" className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-bold uppercase tracking-wider">
            GIÁ TRỊ VƯỢT TRỘI
          </Badge>
          <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight font-heading whitespace-normal sm:whitespace-nowrap">
            Tại Sao Doanh Nghiệp & Ban Tổ Chức Chọn One Connect?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
          <Card className="border-slate-200/90 hover:border-blue-300 hover:shadow-xs transition-all rounded-2xl bg-white shadow-2xs">
            <CardHeader className="pb-1.5 p-4">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 mb-1.5">
                <Leaf className="w-4 h-4 text-slate-700" />
              </div>
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-900">MICE Xanh & Net-Zero</CardTitle>
            </CardHeader>
            <CardContent className="text-[11.5px] text-slate-600 leading-relaxed px-4 pb-4 pt-0">
              Cắt giảm 100% rác thải danh thiếp giấy và dây đeo nhựa dùng một lần. Tiết kiệm hàng trăm triệu đồng chi phí in ấn cho mỗi kỳ hội nghị.
            </CardContent>
          </Card>

          <Card className="border-slate-200/90 hover:border-blue-300 hover:shadow-xs transition-all rounded-2xl bg-white shadow-2xs">
            <CardHeader className="pb-1.5 p-4">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 mb-1.5">
                <RefreshCw className="w-4 h-4 text-slate-700" />
              </div>
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-900">Bảo Toàn Dữ Liệu Thẻ</CardTitle>
            </CardHeader>
            <CardContent className="text-[11.5px] text-slate-600 leading-relaxed px-4 pb-4 pt-0">
              Tách biệt UID chip NFC vật lý khỏi mã định danh. Đổi/cấp lại phôi thẻ kim loại trong 30 giây mà không bao giờ mất danh bạ đã kết nối.
            </CardContent>
          </Card>

          <Card className="border-slate-200/90 hover:border-blue-300 hover:shadow-xs transition-all rounded-2xl bg-white shadow-2xs">
            <CardHeader className="pb-1.5 p-4">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
              </div>
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-900">Chuẩn Luật PDPL 91</CardTitle>
            </CardHeader>
            <CardContent className="text-[11.5px] text-slate-600 leading-relaxed px-4 pb-4 pt-0">
              Tiên phong tuân thủ Luật Bảo vệ Dữ liệu Cá nhân số 91/2025/QH15. Cơ chế Đồng thuận 2 chiều minh bạch, quyền xuất dữ liệu và xóa bỏ.
            </CardContent>
          </Card>

          <Card className="border-slate-200/90 hover:border-blue-300 hover:shadow-xs transition-all rounded-2xl bg-white shadow-2xs">
            <CardHeader className="pb-1.5 p-4">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 mb-1.5">
                <TrendingUp className="w-4 h-4 text-slate-700" />
              </div>
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-900">Chuyển Hóa Hợp Đồng</CardTitle>
            </CardHeader>
            <CardContent className="text-[11.5px] text-slate-600 leading-relaxed px-4 pb-4 pt-0">
              Biến điểm chạm thoáng qua thành hợp đồng giao thương qua Sổ tay quan hệ, gắn thẻ phân loại Lead WARM/HOT và nhắc lịch hẹn tự động.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE ESG & ROI CALCULATOR */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-slate-900 border border-slate-200/90 shadow-2xs">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
              BỘ TÍNH TOÁN HIỆU QUẢ KINH TẾ & MÔI TRƯỜNG
            </Badge>
            <h2 className="text-base sm:text-xl lg:text-2xl font-black font-heading text-slate-900 whitespace-normal sm:whitespace-nowrap">
              Ước Tính Giá Trị One Connect Mang Lại Cho Doanh Nghiệp
            </h2>
            <p className="text-xs text-slate-600">
              Kéo thanh trượt bên dưới để ước tính chi phí tiết kiệm và chỉ số Xanh (ESG) theo quy mô tổ chức của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
            {/* Sliders */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Số lượng Đại biểu / Sự kiện:</span>
                  <span className="text-[#0066FF] font-mono text-xs">{attendeesPerEvent} Người</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={attendeesPerEvent}
                  onChange={(e) => setAttendeesPerEvent(Number(e.target.value))}
                  className="w-full accent-[#0066FF] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Số Sự Kiện / Năm:</span>
                  <span className="text-[#0066FF] font-mono text-xs">{eventsPerYear} Sự kiện</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={eventsPerYear}
                  onChange={(e) => setEventsPerYear(Number(e.target.value))}
                  className="w-full accent-[#0066FF] cursor-pointer"
                />
              </div>
            </div>

            {/* Realtime Computed Metrics */}
            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                <div className="text-[10.5px] text-slate-500">Tiết Kiệm In Ấn</div>
                <div className="text-sm sm:text-base font-extrabold text-emerald-600 font-mono" suppressHydrationWarning>
                  {(paperCostSaved / 1000000).toFixed(1)} Triệu
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                <div className="text-[10.5px] text-slate-500">Cắt Giảm CO2</div>
                <div className="text-sm sm:text-base font-extrabold text-[#0066FF] font-mono" suppressHydrationWarning>
                  {co2SavedKg} kg CO2
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                <div className="text-[10.5px] text-slate-500">Giảm Danh Thiếp Rác</div>
                <div className="text-sm sm:text-base font-extrabold text-slate-800 font-mono" suppressHydrationWarning>
                  {totalDelegates.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Tờ
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                <div className="text-[10.5px] text-slate-500">Thời Gian Đón Tiếp Giảm</div>
                <div className="text-sm sm:text-base font-extrabold text-[#0066FF] font-mono" suppressHydrationWarning>
                  {checkinHoursSaved} Giờ
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SHOWCASE BỘ HỒ SƠ CUỘC THI KHỞI NGHIỆP ĐMST 2026 */}
      {/* ========================================================================= */}
      <section id="dossier" className="space-y-4">
        <div className="text-center max-w-3xl mx-auto space-y-1">
          <Badge variant="outline" className="px-2.5 py-0.5 bg-blue-50 text-[#0066FF] border-blue-200 text-[11px] font-bold uppercase tracking-wider">
            HỒ SƠ CHÍNH THỨC
          </Badge>
          <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight font-heading whitespace-normal sm:whitespace-nowrap">
            Bộ Hồ Sơ Tham Dự Cuộc Thi Khởi Nghiệp ĐMST 2026
          </h2>
          <p className="text-xs text-slate-600">
            Toàn bộ 5 tài liệu đã được chuẩn hóa và đồng bộ 100% theo thông tin đăng ký chính thức của đại diện dự án Hồ Hoàng Long.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5 max-w-5xl mx-auto">
          {/* Doc 1 */}
          <Card className="border-slate-200/90 rounded-2xl bg-white hover:border-blue-400 transition-all shadow-2xs">
            <CardHeader className="pb-1.5 p-4">
              <Badge className="w-fit bg-blue-100 text-blue-800 text-[9.5px] font-bold">VĂN BẢN 01</Badge>
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-900">Đơn Đăng Ký Dự Thi</CardTitle>
            </CardHeader>
            <CardContent className="text-[11.5px] text-slate-600 space-y-1 px-4 pb-4 pt-0">
              <p>Đại diện Hồ Hoàng Long (CCCD 056095014168), Tập đoàn Công nghệ số A+ (A PLUSVN).</p>
              <div className="text-[10.5px] text-[#0066FF] font-semibold">✓ Đầy đủ chữ ký & cam kết SHTT</div>
            </CardContent>
          </Card>

          {/* Doc 2 */}
          <Card className="border-slate-200/90 rounded-2xl bg-white hover:border-blue-400 transition-all shadow-2xs">
            <CardHeader className="pb-1.5 p-4">
              <Badge className="w-fit bg-emerald-100 text-emerald-800 text-[9.5px] font-bold">VĂN BẢN 02</Badge>
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-900">Bản Thuyết Minh Dự Án</CardTitle>
            </CardHeader>
            <CardContent className="text-[11.5px] text-slate-600 space-y-1 px-4 pb-4 pt-0">
              <p>Đặc tả 8 phần: Tính cấp thiết MICE Khánh Hòa, giải pháp công nghệ, Lean Canvas, ESG và kế hoạch Pilot.</p>
              <div className="text-[10.5px] text-emerald-600 font-semibold">✓ Khảo sát & Luận chứng thực tế</div>
            </CardContent>
          </Card>

          {/* Doc 3 */}
          <Card className="border-slate-200/90 rounded-2xl bg-white hover:border-blue-400 transition-all shadow-2xs">
            <CardHeader className="pb-1.5 p-4">
              <Badge className="w-fit bg-purple-100 text-purple-800 text-[9.5px] font-bold">VĂN BẢN 03</Badge>
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-900">Kịch Bản Pitching 10 Slides</CardTitle>
            </CardHeader>
            <CardContent className="text-[11.5px] text-slate-600 space-y-1 px-4 pb-4 pt-0">
              <p>Khung thuyết trình 3 - 5 phút chuẩn quốc tế kèm lời thoại chi tiết và thao tác Live Demo trực tiếp.</p>
              <div className="text-[10.5px] text-purple-600 font-semibold">✓ Kèm lời thoại từng slide</div>
            </CardContent>
          </Card>

          {/* Doc 4 */}
          <Card className="border-slate-200/90 rounded-2xl bg-white hover:border-blue-400 transition-all shadow-2xs">
            <CardHeader className="pb-1.5 p-4">
              <Badge className="w-fit bg-amber-100 text-amber-800 text-[9.5px] font-bold">VĂN BẢN 04</Badge>
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-900">Ma Trận SWOT & Rủi Ro</CardTitle>
            </CardHeader>
            <CardContent className="text-[11.5px] text-slate-600 space-y-1 px-4 pb-4 pt-0">
              <p>Phân tích 4 góc độ SWOT và biện pháp xử lý rủi ro mất mạng (Offline-First), hỏng thẻ, pháp lý dữ liệu.</p>
              <div className="text-[10.5px] text-amber-600 font-semibold">✓ Cơ chế Offline Sync & Backup</div>
            </CardContent>
          </Card>

          {/* Doc 5 */}
          <Card className="border-slate-200/90 rounded-2xl bg-white hover:border-blue-400 transition-all shadow-2xs">
            <CardHeader className="pb-1.5 p-4">
              <Badge className="w-fit bg-indigo-100 text-indigo-800 text-[9.5px] font-bold">VĂN BẢN 05</Badge>
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-900">Kế Hoạch Tài Chính 2026-2028</CardTitle>
            </CardHeader>
            <CardContent className="text-[11.5px] text-slate-600 space-y-1 px-4 pb-4 pt-0">
              <p>Unit Economics: CAC = 85k, LTV = 1.45M, LTV/CAC = 17x. Kế hoạch sử dụng vốn mồi 30k – 50k USD.</p>
              <div className="text-[10.5px] text-indigo-600 font-semibold">✓ Điểm hòa vốn trong 1.5 tháng</div>
            </CardContent>
          </Card>

          {/* Team Box */}
          <Card className="border-blue-300 bg-blue-50/50 rounded-2xl flex flex-col justify-between shadow-2xs">
            <CardHeader className="pb-1.5 p-4">
              <Badge className="w-fit bg-[#0066FF] text-white text-[9.5px] font-bold">ĐỘI NGŨ SÁNG LẬP</Badge>
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-900">Tập Đoàn Công Nghệ Số A+</CardTitle>
            </CardHeader>
            <CardContent className="text-[11.5px] text-slate-700 space-y-0.5 px-4 pb-4 pt-0">
              <div>• <strong>Hồ Hoàng Long:</strong> Quản lý dự án & sản phẩm</div>
              <div>• <strong>Nguyễn Nhật Thanh:</strong> Trưởng phòng phát triển AI</div>
              <div>• <strong>Trần Tuấn Kiệt:</strong> Định hướng kinh doanh</div>
              <div className="pt-1 text-[10px] text-slate-500">Địa chỉ: Tầng 8, Tòa nhà ASIA, 25 Lê Lợi, TP. Nha Trang</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION FOOTER */}
      {/* ========================================================================= */}
      <section className="text-center bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-2.5 shadow-2xs">
        <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight font-heading whitespace-normal sm:whitespace-nowrap">
          Sẵn Sàng Kiến Tạo Du Lịch MICE Xanh & Định Danh Số
        </h2>
        <p className="text-xs text-slate-600 max-w-xl mx-auto">
          Dự án One Connect đã sẵn sàng cho sự kiện Pilot 150 - 300 đại biểu tại tỉnh Khánh Hòa trong Quý 4/2026.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <Link href="/demo">
            <Button size="default" className="gap-2 bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl h-9 px-4 text-xs shadow-xs cursor-pointer">
              <Play className="w-3.5 h-3.5 fill-white" /> Mở Live Demo Hub
            </Button>
          </Link>
          <Link href="/operator/checkin">
            <Button size="default" variant="outline" className="gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl h-9 px-3.5 text-xs cursor-pointer">
              <Zap className="w-3.5 h-3.5 text-slate-700" /> Trạm Check-in Cửa (&lt;1s)
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
