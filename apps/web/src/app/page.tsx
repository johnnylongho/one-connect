'use client';

import React from 'react';
import Link from 'next/link';
import BusinessCard3D from '@/components/BusinessCard3D';
import NfcTouchSimulator from '@/components/NfcTouchSimulator';
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
  FileText,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const { state, currentIdentity, currentCard, reissueCard } = useOneConnectStore();

  const activeEvent = state.events[0];
  const totalConnections = state.connections.filter((c) => c.status === 'CONNECTED').length || 28;
  const pendingConsents = state.connections.filter((c) => c.status === 'PENDING').length || 14;

  return (
    <div className="space-y-8">
      {/* 1. EXECUTIVE HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950/70 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Pre-CRM & Relationship Layer Ecosystem
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-['Outfit']">
              Chuyển Hóa Sự Kiện Thành <br />
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Mối Quan Hệ Kinh Doanh Có Cấu Trúc
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              One Connect Network cung cấp **tầng hạ tầng quản lý quan hệ (Relationship Layer)** kết hợp giao diện chạm NFC/QR ma sát bằng 0 và cơ chế đồng ý 2 chiều tuân thủ **Luật Bảo vệ Dữ liệu Cá nhân 91/2025/QH15**.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/dashboard/card">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold shadow-xl shadow-cyan-500/20 rounded-xl">
                  <CreditCard className="w-5 h-5" /> Quản Lý Thẻ Số Cá Nhân <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/operator/checkin">
                <Button size="lg" variant="outline" className="gap-2 border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 rounded-xl">
                  <Zap className="w-5 h-5 text-amber-400" /> Trạm Check-in Live (&lt;1s)
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Interactive 3D Card Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {currentIdentity ? (
              <BusinessCard3D
                identity={currentIdentity}
                card={currentCard}
                onReissueCard={() => reissueCard()}
              />
            ) : (
              <div className="w-full h-64 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 text-xs">
                Đang tải thẻ doanh nhân 3D...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. TAILWIND METRIC CARDS (HÀNG NGANG FLEXBOX/GRID) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1 */}
        <Card className="border-slate-800 bg-slate-900/70 hover:border-cyan-500/40 transition-all shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Kết Nối Đã Consent
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-white font-['Outfit']">{totalConnections} <span className="text-sm font-normal text-slate-400">Đối tác</span></div>
            <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium pt-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Tuân thủ PDPL 91/2025
            </p>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="border-slate-800 bg-slate-900/70 hover:border-amber-500/40 transition-all shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Chờ Phê Duyệt (Consent)
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-white font-['Outfit']">{pendingConsents} <span className="text-sm font-normal text-slate-400">Yêu cầu</span></div>
            <p className="text-xs text-amber-400 flex items-center gap-1 font-medium pt-1">
              <TrendingUp className="w-3.5 h-3.5" /> Đang chờ đối tác xác nhận
            </p>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="border-slate-800 bg-slate-900/70 hover:border-emerald-500/40 transition-all shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Khách Check-in Event
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-white font-['Outfit']">
              {activeEvent?.checkInCount || 385} <span className="text-sm font-normal text-slate-400">/ 500</span>
            </div>
            <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium pt-1">
              <Sparkles className="w-3.5 h-3.5" /> 77% Tiến độ check-in realtime
            </p>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="border-slate-800 bg-slate-900/70 hover:border-purple-500/40 transition-all shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tỷ Lệ Chạm Thẻ NFC
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-white font-['Outfit']">98.5%</div>
            <p className="text-xs text-purple-300 flex items-center gap-1 font-medium pt-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Tốc độ &lt; 0.5s / lượt chạm
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 3. FEATURE MODULES GRID */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-['Outfit']">
              <Building2 className="w-5 h-5 text-cyan-400" /> 8 Module Tính Năng Hệ Sinh Thái One Connect
            </h2>
            <p className="text-xs text-slate-400">Phạm vi P0 & P1 theo tài liệu Feature Map v0.1</p>
          </div>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            SCOPE LOCKED
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/card" className="glass-panel p-5 space-y-3 group hover:border-cyan-400/50">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">1. Business Identity & Cards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Định danh doanh nhân/doanh nghiệp số, độc lập UID thẻ NFC (Card Replacement Continuity).
            </p>
          </Link>

          <Link href="/admin/org" className="glass-panel p-5 space-y-3 group hover:border-indigo-400/50">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">2. Association Membership</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Quản lý tư cách hội viên, phân quyền ban chấp hành và danh bạ tổ chức Hội/CLB.
            </p>
          </Link>

          <Link href="/events" className="glass-panel p-5 space-y-3 group hover:border-purple-400/50">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">3. Event Management</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Khởi tạo sự kiện, mở cổng đăng ký trực tuyến, quản lý vé mời và danh sách người tham dự.
            </p>
          </Link>

          <Link href="/operator/checkin" className="glass-panel p-5 space-y-3 group hover:border-amber-400/50">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">4. Fast NFC/QR Check-in</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Điểm danh trạm cửa siêu tốc (&lt; 1s), chống quét lặp idempotency, hỗ trợ QR camera fallback.
            </p>
          </Link>
        </div>
      </section>

      {/* 4. LIVE TOUCH SIMULATOR & PDPL LAW */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <NfcTouchSimulator targetCardUid="NFC-HA-777" />

        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-['Outfit']">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Tuân Thủ Luật PDPL Số 91/2025/QH15
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Mọi tương tác kết nối trên One Connect Network được bảo vệ nghiêm ngặt:
          </p>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Explicit 2-way Consent</strong>: Quét NFC tạo yêu cầu kết nối; thông tin cá nhân nhạy cảm chỉ hiển thị khi đối phương bấm Chấp Nhận.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Data Sovereignty</strong>: Người dùng có quyền bật/tắt hiển thị hồ sơ cá nhân hoặc yêu cầu xuất dữ liệu / xóa vĩnh viễn tài khoản.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Card Replacement Continuity</strong>: Khi đổi thẻ NFC vật lý mới, ID tài khoản và toàn bộ lịch sử kết nối vẫn được bảo toàn trọn vẹn.</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
