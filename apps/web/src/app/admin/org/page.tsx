'use client';

import React from 'react';
import Link from 'next/link';
import { useOneConnectStore } from '@/lib/store';
import {
  Building2,
  Users,
  Calendar,
  BarChart3,
  Plus,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  CreditCard,
  Zap,
  ArrowLeft,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AssociationAdminDashboard() {
  const { state } = useOneConnectStore();
  const org = state.organizations[0] || { name: 'Hiệp hội Doanh nhân Trẻ Khánh Hòa', memberCount: 150 };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 antialiased">
      
      {/* 1. TOP HEADER BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-purple-50/20 to-slate-50 border border-slate-200/90 p-5 sm:p-7 shadow-xs">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 shrink-0 shadow-2xs">
              <Building2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
                  Quản Trị Hiệp Hội & Câu Lạc Bộ Doanh Nghiệp
                </h1>
                <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-xs font-bold">
                  OFFICIAL PORTAL
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Đơn vị chủ quản: <span className="font-bold text-slate-900">{org.name}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/admin/org/members"
              className="px-4 py-2.5 rounded-xl bg-blue-50 text-[#0066FF] hover:bg-blue-100 border border-blue-200/80 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-2xs"
            >
              <Users className="w-4 h-4" /> Quản Lý Hội Viên ({state.identities.length})
            </Link>
            <Link
              href="/admin/events"
              className="px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-xs shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" /> Tạo Sự Kiện Mới
            </Link>
          </div>
        </div>
      </section>

      {/* 2. EXECUTIVE KPI METRICS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng Số Hội Viên</span>
            <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-[10.5px]">ACTIVE</Badge>
          </div>
          <div className="text-3xl font-black text-purple-700 font-mono">{state.identities.length * 25 + 25}</div>
          <p className="text-[12px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> ↑ 18% Tăng trưởng quý này
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sự Kiện Đang Vận Hành</span>
            <Badge className="bg-blue-50 text-[#0066FF] border-blue-200 text-[10.5px]">LIVE</Badge>
          </div>
          <div className="text-3xl font-black text-[#0066FF] font-mono">{state.events.length}</div>
          <p className="text-[12px] text-slate-600">Tỷ lệ Check-in siêu tốc: <strong>98.5%</strong></p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lượt Giao Thương B2B</span>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10.5px]">2-WAY CONSENT</Badge>
          </div>
          <div className="text-3xl font-black text-emerald-600 font-mono">480+</div>
          <p className="text-[12px] text-slate-500">Đã qua xác thực danh tính doanh nhân</p>
        </div>
      </section>

      {/* 3. FEATURED MEMBERS LIST */}
      <section className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0066FF]" /> Danh Sách Hội Viên Tiêu Biểu
          </h3>
          <Link href="/admin/org/members" className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1">
            Xem Tất Cả ({state.identities.length}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {state.identities.map((m) => {
            const companyName = m.businesses && m.businesses[0] ? m.businesses[0].businessName : 'Tập đoàn Công nghệ Số A+ (APLUSVN)';
            const profileLink = `/p/${m.username || m.id}`;

            return (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={m.avatarUrl || '/avatar-johnny-long.jpg'}
                    alt={m.fullName}
                    className="w-12 h-12 rounded-xl object-cover shadow-2xs shrink-0 border border-slate-200 block"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.fullName)}&backgroundColor=0066ff,00c2ff`;
                    }}
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{m.fullName}</h4>
                    <p className="text-xs text-[#0066FF] font-semibold truncate">{m.title}</p>
                    <p className="text-[11.5px] text-slate-500 truncate">{companyName}</p>
                  </div>
                </div>

                <Link
                  href={profileLink}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-[#0066FF] hover:bg-blue-50 shrink-0 shadow-2xs transition-colors"
                  title="Xem Profile Doanh Nhân"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
