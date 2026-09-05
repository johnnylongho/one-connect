import React from 'react';
import Link from 'next/link';
import {
  Users,
  CheckCircle2,
  Zap,
  Plus,
  Calendar,
  TrendingUp,
  Building2,
  Sparkles,
  Clock,
  ShieldCheck,
  CreditCard,
  Smartphone,
  UserCheck,
  ArrowRight,
  Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DelegateCheckinTable, Delegate } from '@/components/organizer/delegate-checkin-table';
import { MarketDemandReport } from '@/components/dashboard/MarketDemandReport';
import { createClient } from '@/lib/supabase/server';

export default async function OrganizerDashboardPage() {
  let delegatesList: Delegate[] = [];
  let b2bMatchingCount = 0;

  try {
    const supabase = await createClient();
    const { data: registrations } = await supabase
      .from('event_registrations')
      .select(`
        id,
        qr_code_hash,
        status,
        ticket_tier,
        registered_at,
        person_identities (
          id,
          full_name,
          email,
          phone,
          avatar_url,
          title
        )
      `)
      .limit(20);

    if (registrations && registrations.length > 0) {
      delegatesList = registrations.map((r: any) => {
        const p = Array.isArray(r.person_identities) ? r.person_identities[0] : r.person_identities;
        return {
          id: r.id,
          ticketCode: r.qr_code_hash || `QR_${r.id.substring(0, 8)}`,
          fullName: p?.full_name || 'Đại biểu Doanh nhân',
          email: p?.email || 'email@example.com',
          phone: p?.phone || '0900000000',
          avatarUrl: p?.avatar_url || '',
          company: 'Doanh nghiệp Hội viên',
          position: p?.title || 'Đại biểu VIP',
          associationName: 'Hiệp hội Doanh nhân Công nghệ Aplusvn',
          ticketType: (r.ticket_tier === 'VIP' ? 'VIP' : 'Standard') as any,
          checkInTime: r.status === 'CHECKED_IN' ? '10:30' : null,
          status: (r.status === 'CHECKED_IN' ? 'checked_in' : 'pending') as any,
        };
      });
    }

    const { count } = await supabase
      .from('connections')
      .select('*', { count: 'exact', head: true });

    if (typeof count === 'number' && count > 0) {
      b2bMatchingCount = count;
    }
  } catch (error) {
    // Offline preview fallback
  }

  const totalDelegates = delegatesList.length;
  const checkedInDelegates = delegatesList.filter((d) => d.status === 'checked_in').length;
  const checkInPercentage =
    totalDelegates > 0 ? Math.round((checkedInDelegates / totalDelegates) * 100) : 0;

  return (
    <div className="space-y-6 w-full pb-12">
      {/* 1. HEADER EXECUTIVE BANNER WITH ONE CONNECT LOGO & LIGHT THEME ELEVATION */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-2xs w-full">
        {/* Soft Ambient glow for Light Theme */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#0066FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FF6B00]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left Header Info with Logo */}
          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0066FF] border border-blue-100 flex items-center justify-center shrink-0 shadow-2xs">
                <Building2 className="w-5 h-5 text-[#0066FF]" />
              </div>

              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10.5px] sm:text-[11px] font-black tracking-widest text-[#0066FF] uppercase font-mono">
                    ONE CONNECT NETWORK • MODULE 1: DOANH NHÂN & B2B
                  </span>
                  <Badge variant="outline" className="text-[9.5px] bg-blue-50 text-[#0066FF] border-blue-200 font-bold px-1.5 py-0.2">
                    LIVE EVENT
                  </Badge>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading leading-tight">
                  Tổng Quan Cá Nhân & Quản Trị Sự Kiện
                </h1>

                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-normal">
                  "One Identity, Connect Everywhere." — Nền tảng định danh số & ghi nhớ quan hệ doanh nghiệp
                </p>
              </div>
            </div>

            {/* Organizing Committee Info */}
            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 pt-0.5">
              <span className="flex items-center gap-1.5 text-slate-800 font-medium">
                <Building2 className="w-3.5 h-3.5 text-[#0066FF]" />
                Hiệp hội Doanh nhân Công nghệ Aplusvn
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5 text-slate-800">
                <Users className="w-3.5 h-3.5 text-[#0066FF]" />
                Chủ trì: Johnny Long Hồ (Project Manager)
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5 text-slate-800">
                <Calendar className="w-3.5 h-3.5 text-[#FF6B00]" />
                Sự kiện: Diễn Đàn Kết Nối Doanh Nghiệp 2026
              </span>
            </div>
          </div>

          {/* Right Primary CTA Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
            <Link href="/dashboard/connections">
              <Button
                size="default"
                variant="outline"
                className="gap-1.5 border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-[#0066FF] font-bold rounded-xl cursor-pointer shadow-2xs h-9 text-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0066FF]" /> Mạng Lưới B2B & Consent
              </Button>
            </Link>

            <Link href="/dashboard/leads">
              <Button
                size="default"
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl cursor-pointer shadow-xs h-9 text-xs"
              >
                <Target className="w-3.5 h-3.5 text-white" /> Đo Lường Thị Trường &amp; Leads
              </Button>
            </Link>

            <Link href="/events">
              <Button
                size="default"
                className="gap-1.5 bg-gradient-to-r from-[#0066FF] to-[#FF6B00] hover:opacity-90 text-white font-bold shadow-xs rounded-xl cursor-pointer transition-all h-9 text-xs"
              >
                <Plus className="w-4 h-4" /> Tạo Sự Kiện Mới
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. METRIC CARDS WITH CLEAN LIGHT DESIGN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Metric Card 1: Tổng số Đại biểu */}
        <Card className="border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all shadow-sm group cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-800 transition-colors">
              Tổng Số Đại Biểu Đăng Ký
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5 text-[#0066FF]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-extrabold text-slate-900 font-heading">{totalDelegates} <span className="text-sm font-normal text-slate-500">Đại biểu</span></div>
            <p className="text-xs text-[#0066FF] flex items-center gap-1 font-medium pt-1">
              <TrendingUp className="w-3.5 h-3.5" /> 100% Hồ sơ đã xác thực định danh số
            </p>
          </CardContent>
        </Card>

        {/* Metric Card 2: Số lượng đã Check-in */}
        <Card className="border-blue-200 bg-white hover:border-blue-400 hover:shadow-md transition-all shadow-sm group cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-[#0066FF] uppercase tracking-wider transition-colors">
              Đã Check-in Trạm NFC/QR
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5 text-[#0066FF]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-extrabold text-slate-900 font-heading">
                {checkedInDelegates} <span className="text-sm font-normal text-slate-500">/ {totalDelegates}</span>
              </div>
              <span className="text-sm font-bold text-[#0066FF] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {checkInPercentage}%
              </span>
            </div>

            <div className="space-y-1.5">
              <Progress value={checkInPercentage} className="h-2.5 bg-slate-100 border border-slate-200" />
              <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-[#0066FF] font-semibold">
                  <Sparkles className="w-3 h-3" /> Tốc độ check-in &lt; 0.5s/lượt
                </span>
                <span>Tiến độ Realtime</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric Card 3: Kết Nối B2B Matchmaking */}
        <Card className="border-orange-200 bg-white hover:border-orange-400 hover:shadow-md transition-all shadow-sm group cursor-pointer sm:col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider transition-colors">
              Kết Nối B2B Matchmaking
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-[#FF6B00]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-extrabold text-slate-900 font-heading">{b2bMatchingCount} <span className="text-sm font-normal text-slate-500">Cuộc hẹn B2B</span></div>
            <p className="text-xs text-[#FF6B00] flex items-center gap-1 font-medium pt-1">
              <TrendingUp className="w-3.5 h-3.5" /> Khởi tạo từ chạm thẻ NFC Doanh nhân
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2.5. VÒNG LẶP PROTOTYPE LÕI (CORE FLYWHEEL): IDENTITY ➔ EVENT ➔ CONNECTION */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50/70 via-white to-orange-50/50 border border-blue-100 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-blue-100/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] font-black tracking-widest text-[#0066FF] uppercase font-mono">
                ONE CONNECT PROTOTYPE FLOW • PHASE 1
              </span>
              <Badge className="bg-[#0066FF] text-white text-[9.5px] font-bold px-2 py-0.2 rounded-full">
                CORE FLYWHEEL
              </Badge>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-heading mt-0.5">
              Vòng Lặp Nguyên Mẫu Lõi: Định Danh ➔ Sự Kiện ➔ Kết Nối & Ghi Nhớ
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Quy trình 3 bước khép kín giúp biến mỗi lần chạm mặt tại sự kiện thành mối quan hệ kinh doanh có thể ghi nhớ và phát triển.
            </p>
          </div>

          <Link href="/demo">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs font-bold border-blue-300 text-[#0066FF] bg-white hover:bg-blue-50 rounded-xl cursor-pointer shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" /> Trình Diễn Live Pitching
            </Button>
          </Link>
        </div>

        {/* 4 Step Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {/* Step 1: Identity */}
          <Link href="/dashboard/card" className="group block">
            <div className="h-full p-4 rounded-xl bg-white border border-slate-200 group-hover:border-blue-400 group-hover:shadow-md transition-all flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-[#0066FF] font-black text-xs flex items-center justify-center font-mono">
                    01
                  </span>
                  <Badge variant="outline" className="text-[9.5px] font-bold text-blue-700 bg-blue-50 border-blue-200">
                    IDENTITY
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#0066FF]" />
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#0066FF] transition-colors">
                    Định Danh &amp; Thẻ 3D NFC
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Thiết lập hồ sơ doanh nhân, pháp nhân công ty, thẻ 3D Smart Card xoay lật và bảo mật PDPL 91/2025.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0066FF] group-hover:translate-x-0.5 transition-transform">
                <span>Xem Thẻ &amp; QR Động</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* Step 2: Event Check-in */}
          <Link href="/operator/checkin" className="group block">
            <div className="h-full p-4 rounded-xl bg-white border border-slate-200 group-hover:border-blue-400 group-hover:shadow-md transition-all flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-[#0066FF] font-black text-xs flex items-center justify-center font-mono">
                    02
                  </span>
                  <Badge variant="outline" className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border-emerald-200">
                    EVENT &lt;1S
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#0066FF]" />
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#0066FF] transition-colors">
                    Sự Kiện &amp; Check-in &lt;1s
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Trạm quét điểm danh tức thì tại cửa bằng thẻ NFC hoặc camera QR, đếm số lượng đại biểu có mặt thời gian thực.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0066FF] group-hover:translate-x-0.5 transition-transform">
                <span>Vào Trạm Check-in Live</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* Step 3: Connection & Relationship Memory */}
          <Link href="/dashboard/connections" className="group block">
            <div className="h-full p-4 rounded-xl bg-white border border-slate-200 group-hover:border-orange-400 group-hover:shadow-md transition-all flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF6B00] font-black text-xs flex items-center justify-center font-mono">
                    03
                  </span>
                  <Badge variant="outline" className="text-[9.5px] font-bold text-orange-700 bg-orange-50 border-orange-200">
                    RELATIONSHIP
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#FF6B00]" />
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#FF6B00] transition-colors">
                    Kết Nối &amp; Ghi Nhớ Quan Hệ
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Chạm kết nối 2-Way Consent, lưu ghi chú riêng tư (Private Note), gắn tag Lead (HOT/WARM) và lịch sử gặp gỡ.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#FF6B00] group-hover:translate-x-0.5 transition-transform">
                <span>Xem Mạng Lưới B2B</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* Step 4: Market Demand & Leads */}
          <Link href="/dashboard/leads" className="group block">
            <div className="h-full p-4 rounded-xl bg-gradient-to-br from-emerald-50/50 to-white border border-emerald-200/90 group-hover:border-emerald-500 group-hover:shadow-md transition-all flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center font-mono shadow-xs">
                    04
                  </span>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[9.5px] font-bold">
                    MARKET LEADS
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                    Đo Lường Leads &amp; Thị Trường
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Đo lường mức độ quan tâm của 3 gói giải pháp, tỷ lệ chuyển đổi và quản lý danh sách Leads tiềm năng.
                </p>
              </div>
              <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                <span>Mở Báo Cáo &amp; Leads</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 2.8. BÁO CÁO ĐO LƯỜNG NHU CẦU THỊ TRƯỜNG & DANH SÁCH LEADS */}
      <div id="market-demand-report" className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-black text-slate-900 font-heading">
              Đo Lường Mối Quan Tâm Thị Trường &amp; Danh Sách Leads
            </h2>
          </div>
          <Link href="/dashboard/leads">
            <Button variant="ghost" size="sm" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 gap-1 cursor-pointer">
              Mở Trang Chuyên Biệt <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
        <MarketDemandReport />
      </div>

      {/* 3. DELEGATES TABLE WITH LIGHT THEME */}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0066FF]" />
              Danh Sách Đại Biểu Check-in
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Quản lý danh sách đăng ký, bộ lọc đa chiều và thao tác in thẻ QR hàng loạt
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/operator/checkin">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer">
                <Clock className="w-3.5 h-3.5 text-[#0066FF]" /> Trạm Check-in Live
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <DelegateCheckinTable delegates={delegatesList} />
        </CardContent>
      </Card>
    </div>
  );
}
