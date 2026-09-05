'use client';
import React, { useState, useEffect } from 'react';
import {
  Check,
  Sparkles,
  Zap,
  Building2,
  CreditCard,
  Users,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PackageType } from '@/lib/services/market-demand-service';
import { ServiceLeadModal } from './ServiceLeadModal';

interface ServicePackagesSectionProps {
  id?: string;
  className?: string;
}

export function ServicePackagesSection({ id = 'services', className = '' }: ServicePackagesSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activePackage, setActivePackage] = useState<PackageType>('MICE_ENTERPRISE');

  useEffect(() => {
    // Record page impression in real-time
    fetch('/api/market-demand/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packageType: 'MICE_ENTERPRISE',
        eventType: 'VIEW_PACKAGE',
        metadata: { source: 'ServicesPage_Impression' },
      }),
    }).catch(() => {});
  }, []);

  const handleOpenLeadModal = (pkg: PackageType) => {
    setActivePackage(pkg);
    setModalOpen(true);

    // Track click event asynchronously
    fetch('/api/market-demand/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packageType: pkg,
        eventType: 'CLICK_CTA',
        metadata: { sourceSection: 'ServicePackagesSection' },
      }),
    }).catch((err) => console.warn('Demand track error:', err));
  };

  return (
    <section id={id} className={`py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 scroll-mt-24 ${className}`}>
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge
          variant="outline"
          className="px-3.5 py-1 bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs font-extrabold uppercase tracking-wider"
        >
          HỆ SINH THÁI GÓI DỊCH VỤ ONE CONNECT
        </Badge>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-heading [text-wrap:balance]">
          Lựa Chọn Giải Pháp Phù Hợp Với Quy Mô Của Bạn
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto [text-wrap:balance]">
          Từ danh thiếp số cá nhân đến trạm check-in MICE tốc độ cao và nền tảng quản trị danh bạ hiệp hội tập trung.
        </p>
      </div>

      {/* 3 Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        
        {/* ================================================================= */}
        {/* Gói 1: DOANH NHÂN CÁ NHÂN */}
        {/* ================================================================= */}
        <div className="rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-slate-700 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-lg transition-all group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-xs font-extrabold">
                DOANH NHÂN CÁ NHÂN
              </Badge>
              <div className="p-2 rounded-xl bg-slate-800/80 text-blue-400 group-hover:scale-105 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-xl font-black text-white font-heading">Thẻ Danh Thiếp Số 3D</div>
              <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                Dành cho chủ doanh nghiệp, giám đốc kinh doanh và chuyên gia tư vấn B2B.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
                Quyền Lợi Gói Dịch Vụ:
              </span>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>01 Phôi thẻ kim loại / gỗ</strong> cao cấp khắc tên Laser theo yêu cầu</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Profile số đa phương tiện không giới hạn chỉnh sửa</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Dynamic QR Code &amp; Chip NFC bảo mật chống giả mạo</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Lưu danh bạ điện thoại 1-chạm (.vcf chuẩn quốc tế)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Ghi chú riêng tư &amp; Phân loại WARM/HOT sau khi gặp</span>
                </li>
              </ul>
            </div>
          </div>

          <Button
            onClick={() => handleOpenLeadModal('ENTREPRENEUR')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-extrabold rounded-xl text-xs h-11 border border-slate-700 cursor-pointer transition-all active:scale-95"
          >
            Đăng Ký Tư Vấn &amp; Nhận Thẻ
          </Button>
        </div>

        {/* ================================================================= */}
        {/* Gói 2: DOANH NGHIỆP & SỰ KIỆN MICE (HIGHLIGHTED) */}
        {/* ================================================================= */}
        <div className="rounded-3xl bg-gradient-to-b from-blue-950/60 via-[#0B152A] to-slate-900 border-2 border-blue-500 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-2xl shadow-blue-500/15 relative">
          <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-md">
            ⭐ PHỔ BIẾN NHẤT
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 text-xs font-black">
                DOANH NGHIỆP &amp; SỰ KIỆN MICE
              </Badge>
              <div className="p-2 rounded-xl bg-blue-500/20 text-cyan-400">
                <Zap className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-xl font-black text-white font-heading">Trạm Check-in &amp; CRM B2B</div>
              <p className="text-xs text-blue-200/90 mt-1 font-medium leading-relaxed">
                Dành cho công ty tổ chức hội nghị, diễn đàn thương mại, triển lãm và gala doanh nghiệp.
              </p>
            </div>

            <div className="pt-2 border-t border-blue-900/60">
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider block mb-3">
                Tính Năng Nổi Bật:
              </span>
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-start gap-2.5 text-blue-300 font-bold">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Đầy đủ toàn bộ tính năng của gói Doanh Nhân</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Trạm Check-in siêu tốc &lt; 0.42s</strong> tại cổng bằng thẻ NFC hoặc QR</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Thu thập 2-Way Consent tuân thủ Luật Dữ liệu Cá nhân 91/2025</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>B2B Matching tự động kết nối đối tác cung - cầu</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Dashboard báo cáo realtime &amp; Xuất dữ liệu Excel chuyên sâu</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Cơ chế Offline Sync</strong> an toàn ngay cả khi mất mạng internet</span>
                </li>
              </ul>
            </div>
          </div>

          <Button
            onClick={() => handleOpenLeadModal('MICE_ENTERPRISE')}
            className="w-full bg-gradient-to-r from-[#0066FF] to-[#0052CC] hover:from-blue-600 hover:to-blue-700 text-white font-black rounded-xl text-xs h-11 shadow-lg shadow-blue-500/30 cursor-pointer transition-all active:scale-95"
          >
            Đăng Ký Tư Vấn Giải Pháp MICE
          </Button>
        </div>

        {/* ================================================================= */}
        {/* Gói 3: HIỆP HỘI & TỔ CHỨC */}
        {/* ================================================================= */}
        <div className="rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-slate-700 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-lg transition-all group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-xs font-extrabold">
                HIỆP HỘI &amp; TỔ CHỨC
              </Badge>
              <div className="p-2 rounded-xl bg-slate-800/80 text-emerald-400 group-hover:scale-105 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-xl font-black text-white font-heading">Mạng Lưới Hội Viên Số</div>
              <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                Dành cho các Hội Doanh Nhân Trẻ, Hiệp hội ngành nghề, Câu lạc bộ doanh nghiệp.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
                Đặc Quyền Quản Trị Tổ Chức:
              </span>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Quản trị danh bạ hội viên tập trung toàn tỉnh/thành phố</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Phân quyền Ban Chấp Hành / Ban Thư Ký / Hội Viên (RBAC)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Hỗ trợ tên miền riêng &amp; Nhận diện thương hiệu hiệp hội</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Cổng giao thương &amp; Kết nối nhu cầu cung - cầu nội bộ</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Đo lường mức độ gắn kết &amp; Báo cáo phát triển hội viên</span>
                </li>
              </ul>
            </div>
          </div>

          <Button
            onClick={() => handleOpenLeadModal('ASSOCIATION')}
            variant="outline"
            className="w-full border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white font-extrabold rounded-xl text-xs h-11 cursor-pointer transition-all active:scale-95"
          >
            Liên Hệ Hợp Tác Hiệp Hội
          </Button>
        </div>

      </div>

      {/* Lead Capture Modal */}
      <ServiceLeadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultPackage={activePackage}
      />
    </section>
  );
}
