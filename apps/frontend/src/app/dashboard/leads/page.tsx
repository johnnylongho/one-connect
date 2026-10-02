'use client';

import React from 'react';
import Link from 'next/link';
import { Target, ArrowLeft, ExternalLink, Sparkles, Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MarketDemandReport } from '@/components/dashboard/MarketDemandReport';

export default function DashboardLeadsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* HEADER BANNER */}
      <div className="glass-panel p-6 sm:p-7 relative overflow-hidden bg-gradient-to-r from-white via-emerald-50/20 to-blue-50/30 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Trung Tâm Điều Hành
              </Link>
              <span className="text-slate-300">/</span>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                REAL-TIME ANALYTICS
              </Badge>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading flex items-center gap-2.5">
              <Target className="w-6 h-6 text-emerald-600" />
              Đo Lường Mối Quan Tâm Thị Trường &amp; Leads
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
              Thống kê trực tiếp lượt xem, mức độ quan tâm của khách hàng theo 3 nhóm giải pháp (Doanh Nhân Cá Nhân, Doanh Nghiệp Sự Kiện MICE, Hiệp Hội &amp; Tổ Chức) và danh sách liên hệ khách hàng tiềm năng.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0 flex-wrap">
            <Link href="/services" target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl cursor-pointer shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#0066FF]" /> Xem Trang Gói Dịch Vụ
              </Button>
            </Link>

            <Link href="/dashboard/connections">
              <Button
                size="sm"
                className="gap-1.5 bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" /> Sổ Tay Mạng Lưới B2B
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* REPORT CONTENT */}
      <MarketDemandReport />
    </div>
  );
}
