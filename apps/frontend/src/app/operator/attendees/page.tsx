'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useOneConnectStore } from '@/lib/store';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  ArrowLeft,
  Building2,
  CreditCard,
  Zap,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function RealtimeAttendeeDirectory() {
  const { state } = useOneConnectStore();
  const activeEvent = state.events[0];

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CHECKED_IN' | 'NOT_CHECKED_IN'>('ALL');
  const [viewMode, setViewMode] = useState<'CARD' | 'TABLE'>('CARD');

  // Map attendees with real registration, card, and checkin records
  const attendees = useMemo(() => {
    return (state.identities || []).map((identity) => {
      const reg = activeEvent
        ? (state.registrations || []).find(
            (r) => r.eventId === activeEvent.id && r.personIdentityId === identity.id
          )
        : null;
      const checkin = activeEvent
        ? (state.checkIns || []).find(
            (c) => c.eventId === activeEvent.id && c.personIdentityId === identity.id
          )
        : null;
      const card = (state.cards || []).find((c) => c.personIdentityId === identity.id);

      return {
        identity,
        registered: !!reg,
        checkIn: checkin,
        card,
      };
    });
  }, [state.identities, state.registrations, state.checkIns, state.cards, activeEvent]);

  // Filtered attendees based on search and status
  const filtered = useMemo(() => {
    return attendees.filter((item) => {
      const company =
        item.identity.businesses && item.identity.businesses[0]
          ? item.identity.businesses[0].businessName
          : item.identity.association || '';
      const cardUid = item.card?.cardUid || '';
      const q = search.toLowerCase().trim();

      const matchesSearch =
        !q ||
        item.identity.fullName.toLowerCase().includes(q) ||
        company.toLowerCase().includes(q) ||
        (item.identity.title && item.identity.title.toLowerCase().includes(q)) ||
        cardUid.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'CHECKED_IN' && !!item.checkIn) ||
        (statusFilter === 'NOT_CHECKED_IN' && !item.checkIn);

      return matchesSearch && matchesStatus;
    });
  }, [attendees, search, statusFilter]);

  // Metrics
  const totalCount = attendees.length;
  const checkedInCount = attendees.filter((a) => !!a.checkIn).length;
  const pendingCount = totalCount - checkedInCount;
  const attendanceRate = totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 w-full pb-16 antialiased">
      {/* 1. TOP CONTROL BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-3 sm:px-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Về Command Center Quản Trị"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">
                {activeEvent?.name || 'Diễn Đàn Doanh Nghiệp MICE Khánh Hòa 2026'}
              </span>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-mono font-bold">
                REALTIME SYNC
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Danh bạ khách mời, thẻ đại biểu &amp; giám sát tiếp đón qua cửa thời gian thực
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <Link
            href="/operator/checkin"
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" /> Mở Trạm Check-in (&lt;0.8s)
          </Link>
        </div>
      </div>

      {/* 2. HERO BANNER THEME MỚI (DARK GRADIENT) */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 rounded-3xl p-6 sm:p-7 text-white border border-blue-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[11px] font-semibold border border-blue-400/30">
              PHÂN HỆ 2 · QUẢN TRỊ ĐẠI BIỂU &amp; EVENT
            </span>
            <span className="text-[11px] text-slate-300 font-medium">
              Trung Tâm Hội Nghị MICE Nha Trang
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Khách Mời &amp; Danh Bạ Thẻ Đại Biểu MICE
          </h2>
          <p className="text-xs text-blue-200/80 max-w-xl leading-relaxed">
            Giám sát trạng thái điểm danh 1-chạm NFC &amp; mã QR theo thời gian thực. Tự động liên kết thẻ số doanh nhân với phân luồng tiếp đón VIP.
          </p>
        </div>

        {/* METRICS STATS PILLS */}
        <div className="grid grid-cols-3 gap-2.5 bg-white/10 p-2.5 rounded-2xl border border-white/15 self-start md:self-auto shrink-0 text-center">
          <div className="px-3 py-1.5 bg-white/5 rounded-xl">
            <span className="text-[10px] text-blue-200 block uppercase font-medium">Tổng số</span>
            <span className="font-mono font-bold text-sm sm:text-base text-white">{totalCount}</span>
          </div>
          <div className="px-3 py-1.5 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
            <span className="text-[10px] text-emerald-300 block uppercase font-medium">Đã Check-in</span>
            <span className="font-mono font-bold text-sm sm:text-base text-emerald-300">{checkedInCount}</span>
          </div>
          <div className="px-3 py-1.5 bg-amber-500/20 rounded-xl border border-amber-400/30">
            <span className="text-[10px] text-amber-300 block uppercase font-medium">Tỷ lệ</span>
            <span className="font-mono font-bold text-sm sm:text-base text-amber-300">{attendanceRate}%</span>
          </div>
        </div>
      </div>

      {/* 3. CONTROL TOOLBAR: SEARCH, FILTERS & VIEW MODE */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tra cứu đại biểu theo tên, chức vụ, công ty, mã thẻ UID..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 justify-between lg:justify-end">
          {/* Status Filter Buttons */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('CHECKED_IN')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                statusFilter === 'CHECKED_IN'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Đã check-in ({checkedInCount})
            </button>
            <button
              onClick={() => setStatusFilter('NOT_CHECKED_IN')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                statusFilter === 'NOT_CHECKED_IN'
                  ? 'bg-white text-amber-700 shadow-2xs'
                  : 'text-slate-600 hover:text-amber-700'
              }`}
            >
              Chưa vào ({pendingCount})
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* View Mode Toggle: Card vs Table */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl text-xs">
            <button
              onClick={() => setViewMode('CARD')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'CARD'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Card View (Tablet)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'TABLE'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Bảng Chi Tiết"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. MAIN ATTENDEES PRESENTATION */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Không tìm thấy đại biểu phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {search
              ? `Không có đại biểu nào khớp với từ khóa "${search}". Vui lòng thử tìm với từ khóa khác.`
              : 'Chưa có dữ liệu đại biểu nào trong danh sách sự kiện hiện tại.'}
          </p>
        </div>
      ) : viewMode === 'CARD' ? (
        /* CARD VIEW: TABLET & DESKTOP GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const company =
              item.identity.businesses && item.identity.businesses[0]
                ? item.identity.businesses[0].businessName
                : item.identity.association || 'Doanh nghiệp Hội viên';
            const profileLink = `/p/${item.identity.username || item.identity.id}`;
            const isCheckedIn = !!item.checkIn;

            return (
              <div
                key={item.identity.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.identity.avatarUrl || '/avatar-johnny-long.jpg'}
                        alt={item.identity.fullName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100 shadow-2xs shrink-0"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                            item.identity.fullName
                          )}&backgroundColor=0066ff,00c2ff`;
                        }}
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {item.identity.fullName}
                        </h4>
                        <p className="text-[11px] text-blue-600 font-semibold truncate">
                          {item.identity.title || 'Đại biểu khách mời'}
                        </p>
                      </div>
                    </div>

                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                      VIP
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate pt-1 border-t border-slate-100">
                    <Building2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate">{company}</span>
                  </div>

                  {item.card?.cardUid && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                      <CreditCard className="w-3 h-3 text-slate-400" />
                      <span>UID: {item.card.cardUid}</span>
                    </div>
                  )}
                </div>

                {/* Status & Quick Action Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    {isCheckedIn ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Đã Check-in</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Chờ tiếp đón</span>
                      </span>
                    )}
                  </div>

                  <Link
                    href={profileLink}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <span>Hồ sơ 3D</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW: DETAILED ENTERPRISE TABLE */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Đại Biểu</th>
                  <th className="py-3.5 px-4">Doanh Nghiệp &amp; Chức Vụ</th>
                  <th className="py-3.5 px-4">Thẻ NFC UID</th>
                  <th className="py-3.5 px-4 text-center">Trạng Thái Check-in</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const company =
                    item.identity.businesses && item.identity.businesses[0]
                      ? item.identity.businesses[0].businessName
                      : item.identity.association || 'Doanh nghiệp Hội viên';
                  const profileLink = `/p/${item.identity.username || item.identity.id}`;
                  const isCheckedIn = !!item.checkIn;

                  return (
                    <tr key={item.identity.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.identity.avatarUrl || '/avatar-johnny-long.jpg'}
                            alt={item.identity.fullName}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                                item.identity.fullName
                              )}&backgroundColor=0066ff,00c2ff`;
                            }}
                          />
                          <div>
                            <div className="font-bold text-slate-900">{item.identity.fullName}</div>
                            <div className="text-[10.5px] text-slate-400 font-mono">
                              {item.identity.phone || '090-xxx-xxxx'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{company}</div>
                        <div className="text-[11px] text-blue-600">
                          {item.identity.title || 'Đại biểu'}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {item.card?.cardUid || (
                          <span className="text-slate-300 italic">Chưa gán thẻ</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isCheckedIn ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Đã Điểm Danh</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Chưa Điểm Danh</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={profileLink}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-blue-600 inline-flex items-center transition-colors"
                          title="Xem Profile Doanh Nhân 3D"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
