'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useOneConnectStore } from '@/lib/store';
import { Users, Search, CheckCircle2, Clock, Smartphone, QrCode } from 'lucide-react';

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

  const filtered = attendees.filter(a =>
    a.identity.fullName.toLowerCase().includes(search.toLowerCase()) ||
    a.identity.businesses[0]?.businessName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#07090e] text-white">
      <Navbar />

      <main className="app-container max-w-4xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Users className="w-6 h-6 text-cyan-400" /> Danh Sách Khách Tham Dự Realtime (SCR-D03)
            </h1>
            <p className="text-xs text-gray-400">
              {activeEvent?.name || 'Sự kiện'} • Cập nhật điểm danh thời gian thực tại các cửa
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Tra cứu khách mời theo tên, doanh nghiệp..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-glass pl-10"
          />
        </div>

        {/* Directory Table */}
        <div className="glass-panel overflow-hidden border-cyan-500/30">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Danh Sách Attendee ({filtered.length})</h3>
            <span className="badge-cyan">EVENT OPERATOR ACCESS</span>
          </div>

          <div className="divide-y divide-white/5">
            {filtered.map(item => (
              <div key={item.identity.id} className="p-4 flex items-center justify-between gap-4 hover:bg-white/5">
                <div className="flex items-center gap-3">
                  <img src={item.identity.avatarUrl} alt={item.identity.fullName} className="w-12 h-12 rounded-xl object-cover border border-cyan-400/50" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{item.identity.fullName}</h4>
                    <p className="text-xs text-cyan-300">{item.identity.title}</p>
                    <p className="text-[11px] text-gray-400">{item.identity.businesses[0]?.businessName}</p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  {item.checkIn ? (
                    <div className="space-y-0.5">
                      <span className="badge-emerald font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã Check-in ({item.checkIn.method})
                      </span>
                      <p className="text-[10px] text-gray-400 font-mono">
                        {new Date(item.checkIn.checkedInAt).toLocaleTimeString('vi-VN')}
                      </p>
                    </div>
                  ) : (
                    <span className="badge-amber">
                      Chưa Đến Trạm Cửa
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
