'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, ArrowUp, ShieldCheck, Sparkles } from 'lucide-react';

interface PublicFooterProps {
  theme?: 'light' | 'dark';
}

export function PublicFooter({ theme = 'light' }: PublicFooterProps) {
  const isDark = theme === 'dark';

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer
      className={`border-t py-12 px-4 sm:px-6 lg:px-8 text-xs transition-colors ${
        isDark
          ? 'border-slate-800 bg-[#0A1124] text-slate-400'
          : 'border-slate-200/80 bg-white text-slate-600'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Tier: Brand, Navigation & Back to Top */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200/60 dark:border-slate-800/80">
          {/* Brand Info */}
          <div className="flex flex-col items-center lg:items-start gap-2.5 text-center lg:text-left">
            <Link href="/" title="One Connect Network" className="inline-block">
              <img
                src="/brand_logo_transparent.png?v=20260904_tagline"
                alt="One Connect Network"
                className="h-7 w-auto object-contain mx-auto lg:mx-0"
              />
            </Link>
            <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'} font-medium`}>
              Nền tảng Định danh số B2B, Thẻ Thông minh NFC &amp; Hệ sinh thái Kết nối Xúc tiến Thương mại Chuẩn ESG.
            </p>
          </div>

          {/* Nav Links & Scroll Top */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-4 sm:gap-6">
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold">
              <Link
                href="/services"
                className={`transition-colors ${
                  isDark ? 'text-slate-300 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'
                }`}
              >
                Dịch Vụ
              </Link>
              <Link
                href="/social-value"
                className={`flex items-center gap-1 transition-colors ${
                  isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-600'
                }`}
              >
                <Leaf className="w-3.5 h-3.5" /> Chuẩn ESG Xanh
              </Link>
              <Link
                href="/posts"
                className={`transition-colors ${
                  isDark ? 'text-slate-300 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                Thông Tin Thêm
              </Link>
              <Link
                href="/login"
                className={`transition-colors ${
                  isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className={`transition-colors ${
                  isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                Đăng ký
              </Link>
            </div>

            <button
              onClick={scrollToTop}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer group ${
                isDark
                  ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
              }`}
              title="Cuộn lên đầu trang"
            >
              <ArrowUp className="w-3.5 h-3.5 text-blue-500 transition-transform group-hover:-translate-y-0.5" />
              <span>Lên đầu trang</span>
            </button>
          </div>
        </div>

        {/* Bottom Tier: Intellectual Property, Creator Attribution & Ownership Notice */}
        <div
          className={`rounded-2xl p-4 sm:p-5 border transition-all ${
            isDark
              ? 'bg-slate-900/60 border-slate-800/80 text-slate-400'
              : 'bg-slate-50/90 border-slate-200/70 text-slate-600'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Ownership & Creator */}
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  Bảo hộ Sở hữu Trí tuệ
                </span>
                <span className="font-semibold text-xs tracking-tight text-slate-900 dark:text-slate-100">
                  © 2024 - 2026 ONE CONNECT NETWORK™. All rights reserved.
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Ý tưởng, Thiết kế kiến trúc &amp; Toàn quyền phát triển giải pháp bởi{' '}
                <strong className="text-slate-900 dark:text-white font-semibold">Hồ Hoàng Long</strong>{' '}
                <span className="text-slate-500 dark:text-slate-400">(Founder &amp; Solution Architect)</span>.
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                Dự án được bảo hộ quyền tác giả đối với ý tưởng mô hình kinh doanh, kiến trúc định danh số B2B và quy trình vận hành xúc tiến thương mại. Mọi hành vi sao chép cấu trúc mô hình, quy trình công nghệ hoặc giao diện mà không có văn bản chấp thuận chính thức từ tác giả đều vi phạm pháp luật sở hữu trí tuệ.
              </p>
            </div>

            {/* Creator Badge & Verification */}
            <div className="shrink-0 flex items-center gap-2 self-stretch sm:self-center justify-end">
              <div
                className={`px-3 py-2 rounded-xl border flex items-center gap-2.5 ${
                  isDark
                    ? 'border-slate-800 bg-slate-950/60'
                    : 'border-slate-200/80 bg-white shadow-2xs'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-[11px] shadow-xs">
                  HL
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                    Hồ Hoàng Long
                    <Sparkles className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                  </div>
                  <div className="text-[9px] text-slate-600 dark:text-slate-300 font-medium">System Architect &amp; Creator</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
