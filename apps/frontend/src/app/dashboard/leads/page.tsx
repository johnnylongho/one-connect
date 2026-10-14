'use client';

import React from 'react';
import Link from 'next/link';
import { Target, ArrowLeft, ExternalLink, Sparkles, Building2, Users, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MarketDemandReport } from '@/components/dashboard/MarketDemandReport';

export default function DashboardLeadsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 antialiased">
      {/* 1. TOP STATUS BAR: BREADCRUMB & REALTIME SYNC */}
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
                Phân Tích Nhu Cầu Thị Trường &amp; Đo Lường Leads
              </span>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-mono font-bold">
                REAL-TIME TELEMETRY
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Hệ thống đo lường mức độ quan tâm của khách hàng theo 3 nhóm giải pháp thực tế
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <Link href="/services" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-bold border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl shadow-2xs cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" /> Xem Gói Dịch Vụ
            </Button>
          </Link>
          <Link href="/dashboard/connections">
            <Button
              size="sm"
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" /> Sổ Tay Mạng Lưới B2B
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. HERO BANNER THEME MỚI (DARK SLATE/EMERALD GRADIENT) */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-blue-950 rounded-3xl p-6 sm:p-7 text-white border border-emerald-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-semibold border border-emerald-400/30">
              PHÂN HỆ 3 · MARKET INTELLIGENCE &amp; TELEMETRY
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> 100% Dữ Liệu Thực Tế (Supabase Cloud)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Đo Lường Mối Quan Tâm Thị Trường &amp; Danh Sách Leads
          </h2>
          <p className="text-xs text-emerald-100/80 max-w-xl leading-relaxed">
            Thống kê trực tiếp lượt xem, mức độ tương tác theo 3 nhóm giải pháp (Thẻ Doanh Nhân Số, Trạm Check-in MICE, Hiệp Hội &amp; Tổ Chức) và danh sách liên hệ khách hàng tiềm năng thực tế.
          </p>
        </div>
      </div>

      {/* 3. REPORT CONTENT */}
      <MarketDemandReport />
    </div>
  );
}
