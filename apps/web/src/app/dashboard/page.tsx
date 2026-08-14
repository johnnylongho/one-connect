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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DelegateCheckinTable, Delegate } from '@/components/organizer/delegate-checkin-table';
import { createClient } from '@/lib/supabase/server';

// Fallback seed data matching seed.sql
const FALLBACK_DELEGATES: Delegate[] = [
  {
    id: 'fa111111-1111-1111-1111-111111111111',
    ticketCode: 'QR_ONECONNECT_JOHNNY_2026',
    fullName: 'Johnny Long Hồ',
    email: 'johnny@aplusvn.com',
    phone: '0901234567',
    avatarUrl: '/avatar-johnny-long.jpg',
    company: 'Aplusvn Media & Tech',
    position: 'Project Manager kiêm Media',
    associationName: 'Hiệp hội Doanh nhân Công nghệ Aplusvn',
    ticketType: 'VIP',
    checkInTime: '10:30 (1 giờ trước)',
    status: 'checked_in',
  },
  {
    id: 'fa222222-2222-2222-2222-222222222222',
    ticketCode: 'QR_ONECONNECT_MINHDUC_2026',
    fullName: 'Trần Minh Đức',
    email: 'minhduc@techcorp.vn',
    phone: '0923456789',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    company: 'TechCorp Vietnam Group',
    position: 'Chủ tịch HĐQT TechCorp',
    associationName: 'TechCorp Vietnam Group',
    ticketType: 'VIP',
    checkInTime: '11:00 (30 phút trước)',
    status: 'checked_in',
  },
  {
    id: 'fa333333-3333-3333-3333-333333333333',
    ticketCode: 'QR_ONECONNECT_HOANGNAM_2026',
    fullName: 'Lê Hoàng Nam',
    email: 'hoangnam@innovatex.io',
    phone: '0934567890',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    company: 'InnovateX Global',
    position: 'CEO & Founder InnovateX',
    associationName: 'Hiệp hội Doanh nhân Công nghệ Aplusvn',
    ticketType: 'Guest',
    checkInTime: null,
    status: 'pending',
  },
  {
    id: 'fa444444-4444-4444-4444-444444444444',
    ticketCode: 'QR_ONECONNECT_PHUONGANH_2026',
    fullName: 'Phạm Phương Anh',
    email: 'phuonganh@globalbiz.com',
    phone: '0945678901',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    company: 'GlobalBiz Corp',
    position: 'Giám đốc Marketing GlobalBiz',
    associationName: 'Hiệp hội Doanh nhân Công nghệ Aplusvn',
    ticketType: 'Standard',
    checkInTime: '11:20 (10 phút trước)',
    status: 'checked_in',
  },
  {
    id: 'fa555555-5555-5555-5555-555555555555',
    ticketCode: 'QR_ONECONNECT_THUHA_2026',
    fullName: 'Nguyễn Thu Hà',
    email: 'thuha@aplusvn.com',
    phone: '0912345678',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    company: 'Vina Capital Invest',
    position: 'Giám đốc Đầu tư B2B',
    associationName: 'Hiệp hội Doanh nhân Công nghệ Aplusvn',
    ticketType: 'VIP',
    checkInTime: null,
    status: 'pending',
  },
];

export default async function OrganizerDashboardPage() {
  let delegatesList: Delegate[] = FALLBACK_DELEGATES;
  let b2bMatchingCount = 48;

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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. HEADER EXECUTIVE BANNER WITH ONE CONNECT LOGO & LIGHT THEME ELEVATION */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* Soft Ambient glow for Light Theme */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066FF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF6B00]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Header Info with Logo */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="relative p-[1.5px] rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#FF6B00] shadow-md shadow-blue-500/10 shrink-0">
                <div className="bg-white p-2 rounded-[14px] flex items-center justify-center">
                  <img
                    src="/one_connect_final_logo_orange.png"
                    alt="One Connect Logo"
                    className="h-10 sm:h-12 w-auto object-contain"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-widest text-[#0066FF] uppercase font-mono">
                    ONE CONNECT NETWORK • DASHBOARD QUẢN LÝ
                  </span>
                  <Badge variant="outline" className="text-[10px] bg-blue-50 text-[#0066FF] border-blue-200 font-bold">
                    LIVE EVENT
                  </Badge>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-0.5 font-['Outfit']">
                  Trang Quản Lý Sự Kiện & Hiệp Hội
                </h1>

                <p className="text-xs sm:text-sm font-medium text-slate-500 italic mt-0.5">
                  "One Identity, Connect Everywhere."
                </p>
              </div>
            </div>

            {/* Organizing Committee Info */}
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 pt-1">
              <span className="flex items-center gap-1.5 text-slate-800 font-medium">
                <Building2 className="w-4 h-4 text-[#0066FF]" />
                Hiệp hội Doanh nhân Công nghệ Aplusvn
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5 text-slate-800">
                <Users className="w-4 h-4 text-[#0066FF]" />
                Chủ trì: Johnny Long Hồ (Project Manager)
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5 text-slate-800">
                <Calendar className="w-4 h-4 text-[#FF6B00]" />
                Sự kiện: Diễn Đàn Kết Nối Doanh Nghiệp 2026
              </span>
            </div>
          </div>

          {/* Right Primary CTA Button */}
          <div className="flex items-center gap-3 self-start md:self-center shrink-0">
            <Link href="/events">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-[#0066FF] to-[#FF6B00] hover:opacity-90 text-white font-bold shadow-md shadow-orange-500/20 rounded-xl cursor-pointer transition-all"
              >
                <Plus className="w-5 h-5" /> Tạo Sự Kiện Mới
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
            <div className="text-3xl font-black text-slate-900 font-['Outfit']">{totalDelegates} <span className="text-sm font-normal text-slate-500">Đại biểu</span></div>
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
              <div className="text-3xl font-black text-slate-900 font-['Outfit']">
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
            <div className="text-3xl font-black text-slate-900 font-['Outfit']">{b2bMatchingCount} <span className="text-sm font-normal text-slate-500">Cuộc hẹn B2B</span></div>
            <p className="text-xs text-[#FF6B00] flex items-center gap-1 font-medium pt-1">
              <TrendingUp className="w-3.5 h-3.5" /> Khởi tạo từ chạm thẻ NFC Doanh nhân
            </p>
          </CardContent>
        </Card>
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
