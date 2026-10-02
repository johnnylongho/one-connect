'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/PageHeader';
import { useOneConnectStore } from '@/lib/store';
import { Calendar, Plus, MapPin, Users, CheckCircle2, Clock, Zap, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function EventManagementAdminPage() {
  const { state } = useOneConnectStore();
  const [showModal, setShowModal] = useState(false);
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('Nha Trang, Khánh Hòa');

  return (
    <div className="space-y-6 w-full pb-16 antialiased">
      {/* 1. STANDARDIZED PAGE HEADER */}
      <PageHeader
        supertitle="ONE CONNECT NETWORK • MODULE 2: QUẢN LÝ EVENT"
        title="Quản Lý Sự Kiện & Hội Nghị"
        description="Khởi tạo sự kiện mới, cổng đăng ký trực tuyến & cấu hình trạm soát vé"
        icon={Calendar}
        badge="EVENT ADMIN"
        badgeVariant="orange"
        backHref="/dashboard"
        backLabel="Về Tổng quan"
        actions={
          <Button
            onClick={() => setShowModal(true)}
            className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs py-2 px-3.5 shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Khởi Tạo Sự Kiện Mới
          </Button>
        }
      />

      {/* Existing Events Table */}
      <div className="space-y-3.5">
        {state.events.map((evt) => (
          <div
            key={evt.id}
            className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-all"
          >
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                  {evt.status}
                </Badge>
                <span className="text-xs text-slate-400 font-mono font-bold">Mã: {evt.slug}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading truncate">
                {evt.name}
              </h3>
              <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" /> {evt.locationName}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 justify-end">
              <div className="text-right mr-2 hidden sm:block">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Tỷ lệ Check-in</p>
                <p className="text-base font-black text-[#0066FF] font-heading">
                  {evt.checkInCount} / {evt.registrationCount} (
                  {((evt.checkInCount / Math.max(1, evt.registrationCount)) * 100).toFixed(0)}%)
                </p>
              </div>

              <Link
                href="/operator/checkin"
                className="px-3.5 py-2 rounded-xl bg-orange-50 text-[#FF6B00] hover:bg-orange-100 border border-orange-200 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" /> Mở Trạm Check-in
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Create Event Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="font-black text-slate-900 text-base flex items-center gap-2 font-heading">
                <Calendar className="w-5 h-5 text-[#0066FF]" /> Khởi Tạo Sự Kiện Mới
              </h4>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-bold mb-1 block">Tên Sự Kiện Doanh Nhân</label>
                <input
                  type="text"
                  placeholder="VD: StartUp Deal Day 2026"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold mb-1 block">Địa Điểm Tổ Chức</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => setShowModal(false)}
                variant="outline"
                className="flex-1 text-xs rounded-xl py-2.5 border-slate-200 cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  alert(`Đã khởi tạo sự kiện "${eventName || 'Mới'}" thành công!`);
                  setShowModal(false);
                }}
                className="flex-1 text-xs rounded-xl py-2.5 bg-[#0066FF] hover:bg-blue-700 text-white font-bold cursor-pointer"
              >
                Xuất Bản Sự Kiện
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
