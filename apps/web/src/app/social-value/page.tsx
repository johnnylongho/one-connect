'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Leaf,
  ShieldCheck,
  Users,
  Building2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TreeDeciduous,
  Droplets,
  CloudRain,
  Award,
  Lock,
  Globe2,
  Share2,
  ChevronRight,
  Play,
  ArrowUp,
  Check,
  Layers,
  FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useOneConnectStore } from '@/lib/store';

export default function SocialValuePage() {
  const { currentIdentity } = useOneConnectStore();

  // Interactive Green Calculator
  const [delegatesCount, setDelegatesCount] = useState(500);
  const [eventsCount, setEventsCount] = useState(6);

  const totalInteractions = delegatesCount * eventsCount;
  const paperSheetsSaved = totalInteractions * 8; // Each interaction replaces namecard + 7 pages brochure
  const co2SavedKg = Math.round(paperSheetsSaved * 0.045); // ~45g CO2 per paper packet
  const treesPreserved = (paperSheetsSaved / 8333).toFixed(1); // 1 tree ~ 8,333 paper sheets
  const moneySavedVND = (paperSheetsSaved * 3500).toLocaleString('vi-VN');

  return (
    <div className="min-h-screen bg-[#F8FAFD] text-slate-900 antialiased selection:bg-emerald-600 selection:text-white overflow-x-hidden relative font-sans">
      
      {/* Background Liquid Mesh Gradient Blurs (Emerald / Teal / Deep Navy) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-br from-emerald-400/15 via-teal-300/15 to-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-[35%] -left-40 w-[600px] h-[500px] bg-emerald-300/10 rounded-full blur-3xl" />
        <div className="absolute top-[60%] -right-40 w-[600px] h-[500px] bg-teal-400/10 rounded-full blur-3xl" />
      </div>

      {/* ================================================================= */}
      {/* 2. HERO SECTION */}
      {/* ================================================================= */}
      <section className="pt-12 pb-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-black uppercase tracking-wider shadow-2xs">
            <Leaf className="w-4 h-4 text-emerald-600" />
            TIÊU CHUẨN ESG • PHÁT TRIỂN BỀN VỮNG
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black text-slate-950 tracking-tight font-heading leading-tight [text-wrap:balance]">
            Kiến Tạo Giá Trị Cho Xã Hội &amp; <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
              Chuyển Đổi Xanh Trong Kết Nối B2B
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-700 font-medium max-w-3xl mx-auto leading-relaxed">
            One Connect không chỉ là công nghệ chạm danh thiếp và check-in sự kiện. Chúng tôi đồng hành cùng cộng đồng doanh nghiệp Việt Nam tiến tới mục tiêu <strong>Net Zero</strong>, bảo vệ tài nguyên môi trường, bình đẳng số hóa cho SMEs và thúc đẩy văn hóa quản trị minh bạch.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/login">
              <Button
                size="lg"
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl h-12 px-7 text-sm shadow-lg shadow-emerald-500/25 cursor-pointer active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" /> Bắt Đầu Chuyển Đổi Xanh
              </Button>
            </Link>
            <Link href="#calculator">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl h-12 px-6 text-sm shadow-xs cursor-pointer"
              >
                <TreeDeciduous className="w-4 h-4 text-emerald-600" /> Tính Toán Tiết Kiệm CO₂
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. BA TRỤ CỘT ESG TOÀN DIỆN */}
      {/* ================================================================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-black uppercase">
            KHUNG TIÊU CHUẨN QUỐC TẾ
          </Badge>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black text-slate-950 font-heading tracking-tight leading-snug [text-wrap:balance]">
            Tác Động Toàn Diện Qua 3 Trụ Cột ESG
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Tích hợp trách nhiệm xã hội vào từng điểm chạm công nghệ hàng ngày của doanh nhân.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1: Environmental */}
          <div className="rounded-3xl bg-white border border-emerald-100 shadow-xl shadow-emerald-500/5 p-7 sm:p-8 space-y-6 flex flex-col justify-between hover:-translate-y-1 transition-all">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
                <Leaf className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black text-emerald-600 tracking-wider uppercase">TRỤ CỘT E • ENVIRONMENTAL</span>
                <h3 className="text-xl font-black text-slate-950 font-heading">Bảo Vệ Môi Trường &amp; Zero Paper</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Loại bỏ hoàn toàn thói quen in ấn hàng triệu danh thiếp giấy và tài liệu quảng bá dùng một lần.
              </p>
              
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Paper Waste:</strong> Giảm 100% rác thải giấy sau các sự kiện MICE và hội nghị.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Cắt giảm dấu chân Carbon:</strong> Giảm phát thải CO₂ từ khâu sản xuất bột giấy, hóa chất in ấn và vận chuyển.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Báo cáo phát thải Net Zero:</strong> Cung cấp số liệu chính xác để doanh nghiệp nộp báo cáo phát triển bền vững.</span>
                </li>
              </ul>
            </div>
            
            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-[11px] font-bold text-emerald-800 flex items-center gap-2">
              <TreeDeciduous className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>1 thẻ One Connect bảo tồn tương đương 2 cây xanh trưởng thành.</span>
            </div>
          </div>

          {/* Pillar 2: Social */}
          <div className="rounded-3xl bg-white border border-blue-100 shadow-xl shadow-blue-500/5 p-7 sm:p-8 space-y-6 flex flex-col justify-between hover:-translate-y-1 transition-all">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
                <Users className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black text-blue-600 tracking-wider uppercase">TRỤ CỘT S • SOCIAL</span>
                <h3 className="text-xl font-black text-slate-950 font-heading">Bình Đẳng Số Hóa &amp; Cộng Đồng</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tạo cơ hội tiếp cận công nghệ nhận diện chuyên nghiệp chuẩn quốc tế cho mọi doanh nghiệp vừa và nhỏ.
              </p>
              
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Bình đẳng công nghệ cho SMEs:</strong> Doanh nghiệp siêu nhỏ cũng sở hữu bộ hồ sơ số chuyên nghiệp như tập đoàn lớn.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Gắn kết giao thương nội khối:</strong> Giúp các hội viên hiệp hội tương trợ, ưu tiên sử dụng dịch vụ của nhau.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Văn hóa kết nối văn minh:</strong> Tôn trọng thời gian, trao đổi thông tin chuẩn mực và giảm ô nhiễm tiếng ồn.</span>
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 text-[11px] font-bold text-blue-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Đồng hành cùng hơn 500+ doanh nghiệp vừa và nhỏ tại Việt Nam.</span>
            </div>
          </div>

          {/* Pillar 3: Governance */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-500/5 p-7 sm:p-8 space-y-6 flex flex-col justify-between hover:-translate-y-1 transition-all">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shadow-xs">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-700 tracking-wider uppercase">TRỤ CỘT G • GOVERNANCE</span>
                <h3 className="text-xl font-black text-slate-950 font-heading">Minh Bạch &amp; Chuẩn Luật PDPL 91</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Định danh số chuẩn xác, ngăn ngừa gian lận thương mại và bảo vệ tuyệt đối quyền riêng tư dữ liệu cá nhân.
              </p>
              
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <span><strong>Minh bạch danh tính doanh nghiệp:</strong> Hồ sơ xác thực pháp nhân, tạo sự tin cậy tuyệt đối trong thương vụ.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <span><strong>Đồng thuận 2 chiều (Two-way Consent):</strong> Chỉ trao đổi khi cả 2 bên cho phép, triệt tiêu cuộc gọi rác và lộ dữ liệu.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <span><strong>Tuân thủ pháp lý toàn diện:</strong> Đáp ứng đầy đủ Nghị định 13/2023/NĐ-CP và Luật PDPL 91/2025/QH15.</span>
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-slate-100/90 border border-slate-200 text-[11px] font-bold text-slate-800 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-700 shrink-0" />
              <span>Hệ thống mã hóa chuẩn ngân hàng và tôn trọng quyền riêng tư.</span>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. INTERACTIVE GREEN CALCULATOR (#calculator) */}
      {/* ================================================================= */}
      <section id="calculator" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-[#0A261E] to-[#0A1124] text-white p-8 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs font-bold uppercase">
                BỘ ĐO LƯỜNG TÁC ĐỘNG MÔI TRƯỜNG
              </Badge>
              
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black font-heading tracking-tight text-white leading-snug [text-wrap:balance]">
                Ước Tính Khối Lượng CO₂ &amp; Chi Phí Doanh Nghiệp Tiết Kiệm
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
                Kéo thanh trượt để tính toán lượng rác thải giấy được cắt giảm và lượng khí nhà kính được ngăn chặn khi chuyển từ danh thiếp giấy sang thẻ thông minh One Connect.
              </p>

              {/* Sliders */}
              <div className="space-y-5 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-emerald-200">Số lượng đại biểu / nhân sự:</span>
                    <span className="text-white font-mono text-sm bg-emerald-800/60 px-2.5 py-0.5 rounded-lg border border-emerald-600/40">{delegatesCount} người</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="5000"
                    step="50"
                    value={delegatesCount}
                    onChange={(e) => setDelegatesCount(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer h-2 bg-emerald-950/80 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-emerald-200">Số sự kiện / chu kỳ gặp gỡ trong năm:</span>
                    <span className="text-white font-mono text-sm bg-emerald-800/60 px-2.5 py-0.5 rounded-lg border border-emerald-600/40">{eventsCount} sự kiện</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={eventsCount}
                    onChange={(e) => setEventsCount(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer h-2 bg-emerald-950/80 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Live Metrics Display */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              
              <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-5 flex flex-col justify-between space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">{co2SavedKg.toLocaleString('vi-VN')} kg</div>
                  <div className="text-[11px] font-semibold text-emerald-200 mt-1">CO₂ Cắt Giảm Trực Tiếp</div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-5 flex flex-col justify-between space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <TreeDeciduous className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">{treesPreserved} cây</div>
                  <div className="text-[11px] font-semibold text-teal-200 mt-1">Cây Xanh Được Bảo Tồn</div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-5 flex flex-col justify-between space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">{paperSheetsSaved.toLocaleString('vi-VN')}</div>
                  <div className="text-[11px] font-semibold text-blue-200 mt-1">Trang Giấy Loại Bỏ Hoàn Toàn</div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-5 flex flex-col justify-between space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{moneySavedVND} đ</div>
                  <div className="text-[11px] font-semibold text-amber-200 mt-1">Chi Phí In Ấn Tiết Kiệm</div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 5. CHỨNG CHỈ SỰ KIỆN XANH (GREEN EVENT CERTIFICATE) */}
      {/* ================================================================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-white border border-emerald-200/80 p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs font-bold uppercase">
              DÀNH CHO BAN TỔ CHỨC &amp; HIỆP HỘI
            </Badge>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-heading leading-snug [text-wrap:balance]">
              Cấp Chứng Nhận Sự Kiện Xanh &amp; Báo Cáo Đo Lường ESG Tự Động
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mỗi sự kiện ứng dụng giải pháp Check-in và Thẻ đại biểu NFC của One Connect đều được hệ thống tự động tổng hợp số liệu đại biểu tham dự, tính toán số kg CO₂ cắt giảm được và cấp mã chứng nhận <strong>Green MICE Certificate</strong> có thể tra cứu công khai.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Check className="w-4 h-4 text-emerald-600" /> Tích hợp vào Báo cáo Thường niên
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Check className="w-4 h-4 text-emerald-600" /> Nâng cao uy tín nhà tài trợ
              </span>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <Link href="/login">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl h-12 px-7 text-sm shadow-md cursor-pointer"
              >
                Đăng Ký Sự Kiện Xanh Ngay
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 6. CALL TO ACTION FOOTER */}
      {/* ================================================================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-950 text-white rounded-3xl p-8 sm:p-14 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black tracking-tight font-heading relative z-10 leading-snug [text-wrap:balance]">
            Cùng One Connect Xây Dựng Tương Lai Kinh Doanh Bền Vững
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto relative z-10 font-medium leading-relaxed">
            Chỉ với một chiếc thẻ thông minh, bạn vừa sở hữu công cụ kết nối B2B hiện đại nhất, vừa góp phần bảo vệ hành tinh xanh cho thế hệ mai sau.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto gap-2 bg-white hover:bg-slate-100 text-emerald-900 font-black rounded-2xl h-12 px-7 text-sm shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-700" /> Trải Nghiệm Dự Án Ngay
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto gap-2 border-white/40 bg-emerald-950/40 hover:bg-emerald-900 text-white font-extrabold rounded-2xl h-12 px-6 text-sm cursor-pointer"
              >
                Về Trang Chủ Giới Thiệu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
            <Link href="/" title="One Connect Network">
              <img
                src="/brand_logo_transparent.png?v=20260904_tagline"
                alt="One Connect"
                className="h-7 w-auto object-contain"
              />
            </Link>
            <span className="font-medium text-slate-600">
              © 2026 One Connect Network. Giải pháp Định danh số &amp; ESG Xanh.
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <span className="flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" /> Chuẩn ESG &amp; Nghị định 13
            </span>
            <Link href="/" className="hover:text-emerald-600">Trang Chủ</Link>
            <Link href="/posts" className="hover:text-emerald-600">Bài Viết</Link>
            <Link href="/login" className="hover:text-emerald-600">Đăng Nhập</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
