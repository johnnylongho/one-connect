'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useOneConnectStore } from '@/lib/store';
import { Building2, Users, Calendar, BarChart3, Plus, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AssociationAdminDashboard() {
  const { state } = useOneConnectStore();
  const org = state.organizations[0];

  return (
    <div className="min-h-screen bg-[#07090e] text-white">
      <Navbar />

      <main className="app-container max-w-5xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Building2 className="w-6 h-6 text-purple-400" /> Dashboard Quản Lý Hội / CLB (SCR-C01)
            </h1>
            <p className="text-xs text-gray-400">
              Quản trị viên: {org?.name}
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/admin/org/members" className="btn-secondary text-xs">
              <Users className="w-4 h-4 text-cyan-400" /> Quản Lý Hội Viên ({org?.memberCount})
            </Link>
            <Link href="/admin/events" className="btn-primary text-xs">
              <Plus className="w-4 h-4" /> Tạo Sự Kiện Mới
            </Link>
          </div>
        </div>

        {/* Association Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel p-5 space-y-2 border-purple-500/30">
            <p className="text-xs text-gray-400 font-semibold">Tổng Số Hội Viên Kích Hoạt</p>
            <p className="text-3xl font-black text-purple-400 font-['Outfit']">{org?.memberCount}</p>
            <p className="text-[11px] text-emerald-400">↑ 12% so với tháng trước</p>
          </div>

          <div className="glass-panel p-5 space-y-2 border-cyan-500/30">
            <p className="text-xs text-gray-400 font-semibold">Sự Kiện Đang Vận Hành</p>
            <p className="text-3xl font-black text-cyan-400 font-['Outfit']">{state.events.length}</p>
            <p className="text-[11px] text-cyan-300">Tỷ lệ Check-in trung bình: 82%</p>
          </div>

          <div className="glass-panel p-5 space-y-2 border-emerald-500/30">
            <p className="text-xs text-gray-400 font-semibold">Tổng Số Kết Nối Giao Thương</p>
            <p className="text-3xl font-black text-emerald-400 font-['Outfit']">480+</p>
            <p className="text-[11px] text-emerald-300">Đã qua kiểm duyệt PDPL Consent</p>
          </div>
        </div>

        {/* Member Directory Preview */}
        <div className="glass-panel p-6 space-y-4 border-cyan-500/30">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-bold text-white text-base font-['Outfit'] flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" /> Danh Sách Hội Viên Tiêu Biểu
            </h3>
            <Link href="/admin/org/members" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
              Xem Tất Cả ({state.identities.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {state.identities.map(m => (
              <div key={m.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                <img src={m.avatarUrl} alt={m.fullName} className="w-12 h-12 rounded-xl object-cover border border-cyan-400/50" />
                <div>
                  <h4 className="font-bold text-white text-sm">{m.fullName}</h4>
                  <p className="text-xs text-cyan-300">{m.title}</p>
                  <p className="text-[11px] text-gray-400">{m.businesses[0]?.businessName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
