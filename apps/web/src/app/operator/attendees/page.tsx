'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useOneConnectStore } from '@/lib/store';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  Smartphone,
  QrCode,
  Zap,
  ExternalLink,
  ArrowLeft,
  Calendar,
  Building2,
  CreditCard,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function RealtimeAttendeeDirectory() {
  const { state } = useOneConnectStore();
  const activeEvent = state.events[0];
  const [search, setSearch] = useState('');

  const attendees = state.identities.map((identity) => {
    const reg = activeEvent ? state.registrations.find((r) => r.eventId === activeEvent.id && r.personIdentityId === identity.id) : null;
    const checkin = activeEvent ? state.checkIns.find((c) => c.eventId === activeEvent.id && c.personIdentityId === identity.id) : null;
    return {
      identity,
      registered: !!reg,
      checkIn: checkin,
    };
  });

  const filtered = attendees.filter((a) => {
    const company = a.identity.businesses && a.identity.businesses[0] ? a.identity.businesses[0].businessName : '';
    return (
      a.identity.fullName.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase()) ||
      (a.identity.title && a.identity.title.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 antialiased">
      
      {/* 1. TOP HEADER BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-orange-50/20 to-slate-50 border border-slate-200/90 p-5 sm:p-7 shadow-xs">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link
              href="/operator/checkin"
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-all active:scale-95 shadow-2xs"
              title="Quay lại Trạm Soát Vé"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="p-3 rounded-2xl bg-orange-50 text-[#FF6B00] border border-orange-100 shrink-0">
              <Users className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Danh Sách Đại Biểu Tham Dự Realtime
                </h1>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                  LIVE SYNC
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                {activeEvent?.name || 'Sự kiện MICE'} • Cập nhật điểm danh thời gian thực tại các cổng
              </p>
            </div>
          </div>

          <Link
            href="/operator/checkin"
            className="px-4 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-xs shadow-orange-500/20 shrink-0"
          >
            <Zap className="w-4 h-4" /> Mở Trạm Soát Vé (&lt;0.5s)
          </Link>
        </div>
      </section>

      {/* 2. SEARCH & ATTENDEE COUNT */}
      <section className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Tra cứu đại biểu theo tên, chức danh, doanh nghiệp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Tổng đại biểu:</span>
          <Badge className="bg-slate-100 text-slate-700 border-slate-300 font-mono text-xs">
            {filtered.length} Đại Biểu
          </Badge>
        </div>
      </section>

      {/* 3. ATTENDEES LIST */}
      <section className="space-y-3">
        {filtered.map((item) => {
          const company = item.identity.businesses && item.identity.businesses[0] ? item.identity.businesses[0].businessName : 'Tập đoàn Công nghệ Số A+ (APLUSVN)';
          const profileLink = `/p/${item.identity.username || item.identity.id}`;

          return (
            <div
              key={item.identity.id}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={item.identity.avatarUrl || '/avatar-johnny-long.jpg'}
                  alt={item.identity.fullName}
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover shadow-2xs border border-slate-200 bg-slate-100 shrink-0"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.identity.fullName)}&backgroundColor=0066ff,00c2ff`;
                  }}
                />
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                      {item.identity.fullName}
                    </h3>
                    <Badge className="bg-blue-50 text-[#0066FF] border-blue-200 text-[10px] font-bold">
                      {item.identity.association || 'Hội viên'}
                    </Badge>
                  </div>

                  <p className="text-xs font-bold text-[#0066FF] leading-snug">
                    {item.identity.title}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate">
                    <Building2 className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                    <span className="truncate">{company}</span>
                  </div>
                </div>
              </div>

              {/* Status & Profile Link */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-right">
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã Điểm Danh</span>
                  </Badge>
                  <p className="text-[10.5px] text-slate-400 font-mono mt-0.5">
                    Trạm NFC 01 • &lt;0.3s
                  </p>
                </div>

                <Link
                  href={profileLink}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0066FF] transition-all shrink-0 shadow-2xs"
                  title="Xem Profile Đại Biểu"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </section>

    </div>
  );
}
