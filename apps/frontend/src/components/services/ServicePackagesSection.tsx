'use client';
import React, { useState, useEffect } from 'react';
import {
  Check,
  Sparkles,
  Zap,
  Building2,
  CreditCard,
  Heart,
  TrendingUp,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PackageType } from '@/lib/services/market-demand-service';
import { ServiceLeadModal } from './ServiceLeadModal';

interface ServicePackagesSectionProps {
  id?: string;
  className?: string;
}

const TARGET_VOTES = 100;

export function ServicePackagesSection({ id = 'services', className = '' }: ServicePackagesSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activePackage, setActivePackage] = useState<PackageType>('MICE_ENTERPRISE');

  // Real-time market demand survey votes
  const [votes, setVotes] = useState<Record<PackageType, number>>({
    ENTREPRENEUR: 0,
    MICE_ENTERPRISE: 0,
    ASSOCIATION: 0,
  });
  const [votedPackages, setVotedPackages] = useState<Record<string, boolean>>({});
  const [votingPackage, setVotingPackage] = useState<PackageType | null>(null);

  useEffect(() => {
    // 1. Record page impression in real-time
    fetch('/api/market-demand/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packageType: 'MICE_ENTERPRISE',
        eventType: 'VIEW_PACKAGE',
        metadata: { source: 'ServicesPage_Impression' },
      }),
    }).catch(() => {});

    // 2. Fetch genuine live survey votes from database
    const fetchVotes = () => {
      fetch('/api/market-demand/vote')
        .then((res) => res.json())
        .then((data) => {
          if (data?.votes) {
            setVotes(data.votes);
          }
        })
        .catch((err) => console.warn('Could not fetch market votes:', err));
    };

    fetchVotes();

    // 3. Load locally stored voted packages to prevent duplicate voting from the same client
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('oneconnect_market_survey_votes');
        if (saved) {
          setVotedPackages(JSON.parse(saved));
        }
      } catch (e) {}
    }

    // 4. Polling for real-time survey updates every 8 seconds
    const interval = setInterval(fetchVotes, 8000);
    return () => clearInterval(interval);
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

  const handleVote = async (pkg: PackageType) => {
    if (votedPackages[pkg] || votingPackage) return;

    setVotingPackage(pkg);

    // Optimistic UI increment
    setVotes((prev) => ({
      ...prev,
      [pkg]: (prev[pkg] || 0) + 1,
    }));

    const updatedVoted = { ...votedPackages, [pkg]: true };
    setVotedPackages(updatedVoted);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('oneconnect_market_survey_votes', JSON.stringify(updatedVoted));
      } catch (e) {}
    }

    try {
      const res = await fetch('/api/market-demand/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageType: pkg,
          metadata: { source: 'ServicesSection_SurveyVote' },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.votes) {
          setVotes(data.votes);
        }
      }
    } catch (err) {
      console.warn('Error recording market vote:', err);
    } finally {
      setVotingPackage(null);
    }
  };

  return (
    <section id={id} className={`py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 scroll-mt-24 ${className}`}>
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          HỆ SINH THÁI GÓI DỊCH VỤ ONE CONNECT
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-heading [text-wrap:balance]">
          Lựa Chọn Giải Pháp Phù Hợp Với Quy Mô Của Bạn
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto [text-wrap:balance]">
          Từ danh thiếp số cá nhân đến trạm check-in MICE tốc độ cao và nền tảng quản trị danh bạ hiệp hội tập trung.
        </p>

        {/* Realtime Survey Indicator Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs shadow-xs">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/30" />
          <span className="text-slate-400">Khảo sát thị trường:</span>
          <span className="font-semibold text-cyan-300">Bấm nút "Quan tâm" để biểu quyết nhu cầu thực tế (Mục tiêu 100 phản hồi/gói)</span>
        </div>
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

          {/* Survey & CTA Area */}
          <div className="space-y-3 pt-2">
            {/* Realtime Market Survey Module */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Heart className={`w-3.5 h-3.5 ${votedPackages.ENTREPRENEUR ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                  Tiến độ khảo sát:
                </span>
                <span className="font-mono font-extrabold text-white text-xs">
                  {votes.ENTREPRENEUR} <span className="text-slate-500 font-normal">/ {TARGET_VOTES} phiếu</span>
                </span>
              </div>

              {/* Progress Bar (Target 100) */}
              <div className="space-y-1">
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, (votes.ENTREPRENEUR / TARGET_VOTES) * 100))}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Mức độ quan tâm thị trường</span>
                  <span className="font-bold text-slate-300">
                    {Math.round((votes.ENTREPRENEUR / TARGET_VOTES) * 100)}%
                  </span>
                </div>
              </div>

              {/* Vote Button */}
              <button
                type="button"
                onClick={() => handleVote('ENTREPRENEUR')}
                disabled={Boolean(votedPackages.ENTREPRENEUR) || votingPackage === 'ENTREPRENEUR'}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  votedPackages.ENTREPRENEUR
                    ? 'bg-blue-500/15 border border-blue-500/40 text-blue-300 cursor-default'
                    : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white active:scale-95 shadow-xs'
                }`}
              >
                {votedPackages.ENTREPRENEUR ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span>Đã Ghi Nhận Quan Tâm ({votes.ENTREPRENEUR})</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>Bỏ Phiếu Quan Tâm</span>
                  </>
                )}
              </button>
            </div>

            {/* Main CTA */}
            <Button
              onClick={() => handleOpenLeadModal('ENTREPRENEUR')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-extrabold rounded-xl text-xs h-11 border border-slate-700 cursor-pointer transition-all active:scale-95"
            >
              Đăng Ký Tư Vấn &amp; Nhận Thẻ
            </Button>
          </div>
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

          {/* Survey & CTA Area */}
          <div className="space-y-3 pt-2">
            {/* Realtime Market Survey Module (Highlighted) */}
            <div className="p-3.5 rounded-2xl bg-blue-950/60 border border-blue-500/40 space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                  Tiến độ khảo sát:
                </span>
                <span className="font-mono font-black text-white text-xs">
                  {votes.MICE_ENTERPRISE} <span className="text-blue-300/70 font-normal">/ {TARGET_VOTES} phiếu</span>
                </span>
              </div>

              {/* Progress Bar (Target 100) */}
              <div className="space-y-1">
                <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-blue-500/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, (votes.MICE_ENTERPRISE / TARGET_VOTES) * 100))}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-blue-200">
                  <span>Mức độ quan tâm thị trường</span>
                  <span className="font-bold text-cyan-300">
                    {Math.round((votes.MICE_ENTERPRISE / TARGET_VOTES) * 100)}%
                  </span>
                </div>
              </div>

              {/* Vote Button */}
              <button
                type="button"
                onClick={() => handleVote('MICE_ENTERPRISE')}
                disabled={Boolean(votedPackages.MICE_ENTERPRISE) || votingPackage === 'MICE_ENTERPRISE'}
                className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  votedPackages.MICE_ENTERPRISE
                    ? 'bg-cyan-500/20 border border-cyan-400/60 text-cyan-200 cursor-default'
                    : 'bg-blue-600 hover:bg-blue-500 border border-blue-400/50 text-white active:scale-95 shadow-md shadow-blue-600/30'
                }`}
              >
                {votedPackages.MICE_ENTERPRISE ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Đã Ghi Nhận Quan Tâm ({votes.MICE_ENTERPRISE})</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
                    <span>Bỏ Phiếu Quan Tâm</span>
                  </>
                )}
              </button>
            </div>

            {/* Main CTA */}
            <Button
              onClick={() => handleOpenLeadModal('MICE_ENTERPRISE')}
              className="w-full bg-gradient-to-r from-[#0066FF] to-[#0052CC] hover:from-blue-600 hover:to-blue-700 text-white font-black rounded-xl text-xs h-11 shadow-lg shadow-blue-500/30 cursor-pointer transition-all active:scale-95"
            >
              Đăng Ký Tư Vấn Giải Pháp MICE
            </Button>
          </div>
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

          {/* Survey & CTA Area */}
          <div className="space-y-3 pt-2">
            {/* Realtime Market Survey Module */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Heart className={`w-3.5 h-3.5 ${votedPackages.ASSOCIATION ? 'text-emerald-400 fill-emerald-400' : 'text-slate-400'}`} />
                  Tiến độ khảo sát:
                </span>
                <span className="font-mono font-extrabold text-white text-xs">
                  {votes.ASSOCIATION} <span className="text-slate-500 font-normal">/ {TARGET_VOTES} phiếu</span>
                </span>
              </div>

              {/* Progress Bar (Target 100) */}
              <div className="space-y-1">
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, (votes.ASSOCIATION / TARGET_VOTES) * 100))}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Mức độ quan tâm thị trường</span>
                  <span className="font-bold text-slate-300">
                    {Math.round((votes.ASSOCIATION / TARGET_VOTES) * 100)}%
                  </span>
                </div>
              </div>

              {/* Vote Button */}
              <button
                type="button"
                onClick={() => handleVote('ASSOCIATION')}
                disabled={Boolean(votedPackages.ASSOCIATION) || votingPackage === 'ASSOCIATION'}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  votedPackages.ASSOCIATION
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 cursor-default'
                    : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white active:scale-95 shadow-xs'
                }`}
              >
                {votedPackages.ASSOCIATION ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Đã Ghi Nhận Quan Tâm ({votes.ASSOCIATION})</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Bỏ Phiếu Quan Tâm</span>
                  </>
                )}
              </button>
            </div>

            {/* Main CTA */}
            <Button
              onClick={() => handleOpenLeadModal('ASSOCIATION')}
              variant="outline"
              className="w-full border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white font-extrabold rounded-xl text-xs h-11 cursor-pointer transition-all active:scale-95"
            >
              Liên Hệ Hợp Tác Hiệp Hội
            </Button>
          </div>
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
