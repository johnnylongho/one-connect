import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Zap, ArrowLeft, ShieldCheck, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Vận Hành Trạm Check-in Event | One Connect Network',
  description: 'Trạm điều phối tiếp đón, điểm danh đại biểu 1-chạm NFC và QR Code với SLA dưới 0.8 giây.',
};

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-[#0066FF] selection:text-white">
      {/* 1. DEDICATED OPERATOR TOPBAR (NO PUBLIC NAVBAR POLLUTION) */}
      <header className="sticky top-0 z-40 h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/events"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Về Quản Trị Sự Kiện"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-black">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-slate-900 tracking-tight font-heading">
                  OPERATOR PORTAL
                </span>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-mono font-bold">
                  SLA &lt; 0.8s
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Hệ thống điều phối trạm cửa &amp; tiếp đón đại biểu MICE
              </p>
            </div>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-bold border border-slate-200/80">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>REALTIME GATEWAY</span>
          </div>
          <Badge className="bg-blue-50 text-[#0066FF] border-blue-200 text-xs font-bold px-2.5 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5 inline-block" />
            ONLINE LIVE
          </Badge>
        </div>
      </header>

      {/* 2. OPERATIONAL WORKSPACE (FLUID & TABLET-FIRST) */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
