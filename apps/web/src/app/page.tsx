'use client';

import React from 'react';
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
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden">
      {/* 1. EXECUTIVE HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-blue-50/40 to-slate-50 border border-slate-200/90 p-5 sm:p-8 lg:p-10 shadow-sm">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Text & Actions */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0066FF] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" /> Nền Tảng Định Danh Số & AI B2B Matchmaking
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Hạ Tầng Giao Thương B2B <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#0066FF] to-[#00C2FF] bg-clip-text text-transparent">
                Ứng Dụng Trí Tuệ Nhân Tạo (AI)
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              <strong>One Connect Network</strong> là hệ sinh thái định danh số và tối ưu hóa giao thương B2B bằng thuật toán AI Matchmaking ghép cặp Cung - Cầu, kết hợp trạm check-in IoT siêu tốc và cơ chế bảo mật 2 chiều tuân thủ nghiêm ngặt <strong>Luật Bảo vệ Dữ liệu Cá nhân số 91/2025/QH15</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
              <Link href="/dashboard/card" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-[#0066FF] hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 rounded-xl">
                  <CreditCard className="w-4 h-4" /> Quản Lý Thẻ Số Cá Nhân <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/demo" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl">
                  <Sparkles className="w-4 h-4 text-[#FF6B00]" /> Live Demo Pitching Hub
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Interactive 3D Card Preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center w-full min-w-0">
            {currentIdentity ? (
              <div className="w-full flex justify-center">
                <BusinessCard3D
                  identity={currentIdentity}
                  card={currentCard}
                  onReissueCard={() => reissueCard()}
                />
              </div>
            ) : (
              <div className="w-full h-56 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 text-xs">
                Đang tải thẻ doanh nhân 3D...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. EXECUTIVE METRICS KPI (HÀNG NGANG FLEXBOX/GRID) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {/* Card 1 */}
        <Card className="border-slate-200/90 bg-white hover:border-blue-300 transition-all shadow-xs rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-1.5 p-4">
            <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Kết Nối Đã Consent
            </CardTitle>
            <div className="p-2 rounded-xl bg-blue-50 text-[#0066FF]">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-0.5 p-4 pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalConnections} <span className="text-xs font-medium text-slate-500">Đối tác</span></div>
            <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Chuẩn PDPL 91/2025
            </p>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="border-slate-200/90 bg-white hover:border-amber-300 transition-all shadow-xs rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-1.5 p-4">
            <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Chờ Xác Nhận
            </CardTitle>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-0.5 p-4 pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{pendingConsents} <span className="text-xs font-medium text-slate-500">Yêu cầu</span></div>
            <p className="text-[11px] text-amber-600 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> Cơ chế đồng ý 2 chiều
            </p>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="border-slate-200/90 bg-white hover:border-emerald-300 transition-all shadow-xs rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-1.5 p-4">
            <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Check-in Event Live
            </CardTitle>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-0.5 p-4 pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {activeEvent?.checkInCount || 385} <span className="text-xs font-medium text-slate-500">/ 500</span>
            </div>
            <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> 77% Tốc độ &lt;1 giây
            </p>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="border-slate-200/90 bg-white hover:border-purple-300 transition-all shadow-xs rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-1.5 p-4">
            <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              B2B Matchmaking
            </CardTitle>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Zap className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-0.5 p-4 pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              48 <span className="text-xs font-medium text-slate-500">Cuộc hẹn</span>
            </div>
            <p className="text-[11px] text-purple-600 flex items-center gap-1 font-semibold">
              <Building2 className="w-3.5 h-3.5" /> Xếp bàn 1:1 tự động
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 3. FOUR CORE PILLARS OF ONE CONNECT ECOSYSTEM */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">4 Trụ Cột Nền Tảng One Connect</h2>
            <p className="text-xs text-slate-500">Hạ tầng công nghệ toàn diện cho sự kiện và hiệp hội doanh nghiệp</p>
          </div>
          <Link href="/demo" className="text-xs text-[#0066FF] font-bold hover:underline hidden sm:inline-flex items-center gap-1">
            Xem Kịch Bản Trình Diễn <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 transition-all space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">1. Thẻ Doanh Nhân NFC 1 Chạm</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thẻ vật lý tích hợp chip NFC + Dynamic QR code động. Cập nhật hồ sơ realtime không cần in lại danh thiếp giấy.
            </p>
            <Link href="/dashboard/card" className="text-xs font-bold text-[#0066FF] hover:underline inline-flex items-center gap-1 pt-1">
              Khám phá thẻ số <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 transition-all space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">2. Trạm Check-in Siêu Tốc &lt;1s</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Điểm danh tự động qua NFC/QR không cần xếp hàng. Dữ liệu đồng bộ tức thì lên Dashboard ban tổ chức.
            </p>
            <Link href="/operator/checkin" className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1 pt-1">
              Mở trạm check-in <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-300 transition-all space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">3. AI B2B Matchmaking 1:1</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gợi ý đối tác kinh doanh phù hợp theo ngành nghề, tự động cấp mã bàn và lịch hẹn giao thương tại sự kiện.
            </p>
            <Link href="/matching" className="text-xs font-bold text-purple-600 hover:underline inline-flex items-center gap-1 pt-1">
              Xếp bàn giao thương <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Pillar 4 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-300 transition-all space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">4. Chuẩn PDPL 91/2025/QH15</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cơ chế đồng ý 2 chiều (Consent), mã hóa số điện thoại, quyền thu hồi dữ liệu và kiểm toán truy cập minh bạch.
            </p>
            <Link href="/dashboard/settings" className="text-xs font-bold text-amber-600 hover:underline inline-flex items-center gap-1 pt-1">
              Cấu hình bảo mật <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. PRESENTATION CALL TO ACTION */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <Badge className="bg-white/20 text-white border-white/30 text-[10px] font-bold uppercase tracking-wider">
              Pitching Deck 2026
            </Badge>
            <h3 className="text-xl sm:text-2xl font-black">
              Sẵn Sàng Thuyết Trình Ý Tưởng Hệ Thống One Connect
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Trải nghiệm kịch bản tương tác hoàn chỉnh: Chạm NFC mô phỏng, Đổi danh bạ hai chiều có Consent, Điểm danh sự kiện tự động và Xếp bàn B2B.
            </p>
          </div>
          <Link href="/demo" className="shrink-0 w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2 bg-white hover:bg-slate-100 text-blue-700 font-extrabold shadow-md rounded-xl">
              <Sparkles className="w-4 h-4 text-[#FF6B00]" /> Mở Live Demo Hub
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
