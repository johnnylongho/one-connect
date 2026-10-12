'use client';

import React from 'react';
import Link from 'next/link';
import { useOneConnectStore } from '@/lib/store';
import {
  Zap,
  Play,
  Users,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Building2,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function EventOperationsHubPage() {
  const { state } = useOneConnectStore();

  return (
    <div className="space-y-6 w-full pb-12 antialiased">
      {/* 1. SECTION HEADER (TABLET OPTIMIZED) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#0066FF] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FF6B00]" /> TRẠM ĐIỀU PHỐI VẬN HÀNH SỰ KIỆN
            </span>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10.5px]">
              TRL-7 OPERATIONAL
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight font-heading">
            Vận Hành Trạm Check-in &amp; Đón Tiếp Đại Biểu
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Chọn sự kiện để mở giao diện trạm điểm danh 1-Chạm NFC &amp; quét mã QR tốc độ cao (SLA &lt; 0.8 giây) trên iPad/Tablet.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/operator/attendees" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-11 sm:h-12 px-4 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm gap-2 shadow-2xs w-full sm:w-auto"
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>Tra Cứu Danh Bạ</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. OPERATIONAL EVENTS GRID (EXECUTIVE CARD VIEW) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0066FF]" /> Danh Sách Hội Nghị &amp; Sự Kiện Đang Mở Cổng ({state.events.length})
          </h2>
          <span className="text-xs font-mono text-emerald-600 font-bold">● GATEWAY READY</span>
        </div>

        {state.events.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center space-y-3 shadow-xs">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Hiện Chưa Có Sự Kiện Mở Cổng</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Vui lòng tạo hoặc kích hoạt sự kiện mới tại cổng Quản trị trước khi mở trạm check-in.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {state.events.map((evt) => {
              const attendeeCount = state.identities.length;
              const isLive = evt.status === 'PUBLISHED' || evt.status === 'ONGOING' || !evt.status;

              return (
                <div
                  key={evt.id}
                  className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
                >
                  {/* Left: Event Details */}
                  <div className="space-y-3 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-extrabold text-[10.5px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block" />
                        ĐANG MỞ CỬA CHECK-IN
                      </Badge>
                      <Badge className="bg-blue-50 text-[#0066FF] border-blue-200 text-[10.5px] font-mono">
                        GATE 01 - MAIN ENTRANCE
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-heading group-hover:text-[#0066FF] transition-colors">
                        {evt.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                        <span className="truncate">{evt.locationName || 'Trung tâm Hội nghị Quốc tế'}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-600 font-medium pt-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <strong>{attendeeCount}</strong> Đại biểu đăng ký
                      </span>
                      <span className="flex items-center gap-1 font-mono text-emerald-600">
                        <ShieldCheck className="w-3.5 h-3.5" /> 100% NFC Ready
                      </span>
                    </div>
                  </div>

                  {/* Right: Big Touch Action Buttons for iPad */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <Link href="/operator/attendees" className="flex-1 sm:flex-initial">
                      <Button
                        variant="outline"
                        className="h-12 px-5 rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-bold text-xs sm:text-sm gap-2 shadow-2xs w-full cursor-pointer"
                      >
                        <Users className="w-4 h-4 text-slate-500" />
                        <span>Danh Sách Đại Biểu</span>
                      </Button>
                    </Link>

                    <Link href="/operator/checkin" className="flex-1 sm:flex-initial">
                      <Button
                        className="h-12 px-6 rounded-2xl bg-[#0066FF] hover:bg-blue-600 active:scale-95 text-white font-extrabold text-xs sm:text-sm gap-2 shadow-sm shadow-blue-500/20 w-full cursor-pointer transition-all"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Mở Trạm Check-in NFC / QR</span>
                        <ChevronRight className="w-4 h-4 ml-0.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. HARDWARE & SLA TELEMETRY INFO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Tốc Độ Điểm Danh</div>
            <div className="text-[11.5px] text-slate-500 font-mono">Độ trễ TB &lt; 350ms</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Bảo Mật 2-Way Consent</div>
            <div className="text-[11.5px] text-slate-500">Chống trùng lặp điểm danh</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Chế Độ Offline-First</div>
            <div className="text-[11.5px] text-slate-500">Tự động đồng bộ khi có mạng</div>
          </div>
        </div>
      </div>
    </div>
  );
}
