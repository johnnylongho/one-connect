import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServicePackagesSection } from '@/components/services/ServicePackagesSection';

export const metadata = {
  title: 'Gói Dịch Vụ & Giải Pháp Kết Nối Số | One Connect Network',
  description: 'Khám phá 3 gói giải pháp One Connect: Doanh nhân cá nhân, Doanh nghiệp sự kiện MICE và Hiệp hội tổ chức tập trung.',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#070C18] text-slate-100 flex flex-col justify-between">
      <main className="flex-1">
        {/* Hero Banner */}
        <div className="relative overflow-hidden py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-[#0A1124] to-[#070C18]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              DANH MỤC DỊCH VỤ CHUYÊN NGHIỆP
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-heading [text-wrap:balance]">
              Giải Pháp Số Hóa Kết Nối &amp; Sự Kiện Cho Mọi Cấp Độ
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto [text-wrap:balance]">
              One Connect cung cấp nền tảng danh thiếp số thông minh NFC, trạm điểm danh check-in MICE siêu tốc và hệ thống quản trị hội viên tập trung.
            </p>
          </div>
        </div>

        {/* 3 Service Packages Component */}
        <ServicePackagesSection id="packages" className="py-12 sm:py-16" />

        {/* Bottom CTA Banner */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
          <div className="rounded-3xl bg-gradient-to-r from-blue-900/60 via-blue-800/40 to-slate-900 border border-blue-700/50 p-8 sm:p-12 text-center space-y-5 relative overflow-hidden shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                Bạn Cần Một Kịch Bản Tùy Biến Cho Sự Kiện Lớn?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                Đội ngũ kỹ thuật One Connect sẵn sàng khảo sát thực địa, thiết lập trạm check-in đa luồng và cấu hình máy chủ Offline dự phòng trực tiếp tại địa điểm tổ chức.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/login">
                <Button className="bg-[#0066FF] hover:bg-blue-600 text-white font-bold rounded-xl text-xs h-10 px-5 shadow-md shadow-blue-500/25 cursor-pointer">
                  Trải Nghiệm Hệ Thống Ngay
                </Button>
              </Link>
              <Link href="/posts">
                <Button variant="outline" className="border-slate-700 bg-slate-800/80 text-slate-200 hover:text-white font-bold rounded-xl text-xs h-10 px-5 cursor-pointer">
                  Xem Bài Viết &amp; Cẩm Nang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
