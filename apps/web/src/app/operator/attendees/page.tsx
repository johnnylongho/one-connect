'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useOneConnectStore } from '@/lib/store';
import { Users, Search, CheckCircle2, Clock, Smartphone, QrCode, Zap, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function RealtimeAttendeeDirectory() {
  const { state } = useOneConnectStore();
  const activeEvent = state.events[0];
  const [search, setSearch] = useState('');

  const attendees = state.identities.map(identity => {
    const reg = activeEvent ? state.registrations.find(r => r.eventId === activeEvent.id && r.personIdentityId === identity.id) : null;
    const checkin = activeEvent ? state.checkIns.find(c => c.eventId === activeEvent.id && c.personIdentityId === identity.id) : null;
    return {
      identity,
      registered: !!reg,
      checkIn: checkin,
    };
  });

  const filtered = attendees.filter(a => {
    const company = a.identity.businesses && a.identity.businesses[0] ? a.identity.businesses[0].businessName : '';
    return (
      a.identity.fullName.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 pb-16 antialiased">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-orange-50 text-[#FF6B00] border border-orange-200">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  Danh Sách Khách Tham Dự Realtime
                </h1>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                  LIVE SYNC
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                {activeEvent?.name || 'Sự kiện'} • Cập nhật điểm danh thời gian thực tại các cổng
              </p>
            </div>
          </div>

          <Link
            href="/operator/checkin"
            className="px-4 py-2.5 rounded-2xl bg-[#FF6B00] hover:bg-orange-600 text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Zap className="w-4 h-4" /> Mở Trạm Soát Vé (&lt;0.5s)
          </Link>
        </div>

        {/* Search Bar */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Tra cứu khách mời theo tên, chức danh, doanh nghiệp..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Đại biểu:</span>
            <Badge className="bg-slate-100 text-slate-700 border-slate-300 font-mono text-xs">
              {filtered.length} Khách
            </Badge>
          </div>
        </div>

        {/* Attendee Directory Table */}
        <div className="space-y-3">
          {filtered.map(item => {
            const company = item.identity.businesses && item.identity.businesses[0] ? item.identity.businesses[0].businessName : 'Tập đoàn Công nghệ Số A+ (APLUSVN)';
            const profileLink = item.identity.username === 'johnnylong' ? '/p/hoanglong' : `/p/${item.identity.username || item.identity.id}`;

            return (
              <div
                key={item.identity.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.identity.avatarUrl || '/avatar-johnny-long.jpg'}
                    alt={item.identity.fullName}
                    className="w-14 h-14 rounded-2xl object-cover shadow-2xs bg-slate-100 shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-base text-slate-900 font-heading">
                        {item.identity.fullName}
                      </h4>
                      <Link href={profileLink} className="text-[#0066FF] hover:underline flex items-center text-xs font-bold">
                        <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                      </Link>
                    </div>
                    <p className="text-xs sm:text-sm text-[#0066FF] font-semibold">{item.identity.title}</p>
                    <p className="text-[12px] text-slate-500 truncate">{company}</p>
                  </div>
                </div>

                <div className="text-right w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                  {item.checkIn ? (
                    <div className="space-y-0.5 text-right">
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã Check-in ({item.checkIn.method})
                      </Badge>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {new Date(item.checkIn.checkedInAt).toLocaleTimeString('vi-VN')}
                      </p>
                    </div>
                  ) : (
                    <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-bold">
                      Chưa Đến Trạm Cửa
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
