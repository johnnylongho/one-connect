'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useOneConnectStore } from '@/lib/store';
import { Building2, Users, Calendar, BarChart3, Plus, ShieldCheck, ArrowRight, ExternalLink, CreditCard, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AssociationAdminDashboard() {
  const { state } = useOneConnectStore();
  const org = state.organizations[0] || { name: 'Hiệp hội Doanh nhân Công nghệ Aplusvn', memberCount: 150 };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 pb-16 antialiased">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  Dashboard Quản Lý Hội / CLB
                </h1>
                <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-xs">OFFICIAL</Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Đơn vị chủ quản: <span className="font-bold text-slate-800">{org.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/org/members"
              className="px-4 py-2.5 rounded-2xl bg-blue-50 text-[#0066FF] hover:bg-blue-100 border border-blue-200 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Users className="w-4 h-4" /> Quản Lý Hội Viên ({state.identities.length})
            </Link>
            <Link
              href="/admin/events"
              className="px-4 py-2.5 rounded-2xl bg-[#0066FF] text-white hover:bg-blue-700 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" /> Tạo Sự Kiện Mới
            </Link>
          </div>
        </div>

        {/* Association Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng Số Hội Viên</span>
              <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-[10.5px]">ACTIVE</Badge>
            </div>
            <div className="text-3xl font-black text-purple-700 font-heading">{state.identities.length * 25 + 25}</div>
            <p className="text-[12px] text-emerald-600 font-semibold">↑ 18% Tăng trưởng quý này</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sự Kiện Đang Vận Hành</span>
              <Badge className="bg-blue-50 text-[#0066FF] border-blue-200 text-[10.5px]">LIVE</Badge>
            </div>
            <div className="text-3xl font-black text-[#0066FF] font-heading">{state.events.length}</div>
            <p className="text-[12px] text-slate-600">Tỷ lệ Check-in siêu tốc: <strong>98.5%</strong></p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lượt Giao Thương B2B</span>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10.5px]">2-WAY CONSENT</Badge>
            </div>
            <div className="text-3xl font-black text-emerald-600 font-heading">480+</div>
            <p className="text-[12px] text-slate-500">Đã qua xác thực danh tính doanh nhân</p>
          </div>
        </div>

        {/* Member Directory Preview */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-900 text-base font-heading flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0066FF]" /> Danh Sách Hội Viên Tiêu Biểu
            </h3>
            <Link href="/admin/org/members" className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1">
              Xem Tất Cả ({state.identities.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {state.identities.map((m, idx) => {
              const companyName = m.businesses && m.businesses[0] ? m.businesses[0].businessName : 'Tập đoàn Công nghệ Số A+ (APLUSVN)';
              const profileLink = `/p/${m.username || m.id}`;

              return (
                <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-slate-100/80 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={m.avatarUrl || '/avatar-johnny-long.jpg'} alt={m.fullName} className="w-12 h-12 rounded-xl object-cover shadow-2xs shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate font-heading">{m.fullName}</h4>
                      <p className="text-xs text-[#0066FF] font-semibold truncate">{m.title}</p>
                      <p className="text-[11.5px] text-slate-500 truncate">{companyName}</p>
                    </div>
                  </div>

                  <Link href={profileLink} className="p-2 rounded-xl bg-white border border-slate-200 text-[#0066FF] hover:bg-blue-50 shrink-0 shadow-2xs">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
