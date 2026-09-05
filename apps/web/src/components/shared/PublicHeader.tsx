'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOneConnectStore } from '@/lib/store';
import {
  Sparkles,
  Layers,
  Menu,
  X,
  CreditCard,
  Leaf,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PublicHeader() {
  const pathname = usePathname();
  const { currentIdentity } = useOneConnectStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const isHome = pathname === '/' || pathname === '/intro';
  const isSocialValue = pathname === '/social-value';
  const isServices = pathname === '/services' || pathname?.startsWith('/services');
  const isPosts = pathname?.startsWith('/posts');

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleServicesClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById('services');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0A1124]/95 backdrop-blur-2xl border-b border-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.18)] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 sm:h-18 px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center group select-none shrink-0"
          title="One Connect Network"
          onClick={() => {
            if (isHome) scrollToTop();
          }}
        >
          <img
            src="/brand_logo_transparent.png?v=20260904_tagline"
            alt="One Connect Logo"
            className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links - Pure Text, No Category Icons */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold">
          {/* Trang Chủ */}
          <Link
            href="/"
            onClick={() => {
              if (isHome) scrollToTop();
            }}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              isHome
                ? 'text-white bg-white/10 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Trang Chủ
          </Link>

          {/* Giá Trị Xã Hội & ESG */}
          <Link
            href="/social-value"
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              isSocialValue
                ? 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 shadow-xs'
                : 'text-slate-300 hover:text-emerald-400 hover:bg-white/5'
            }`}
          >
            Giá Trị Xã Hội &amp; ESG
          </Link>

          {/* Dịch Vụ (Dropdown với 3 gói: Cá nhân, Sự kiện MICE, Hiệp hội) */}
          <div
            className="relative"
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <Link
              href="/services"
              onClick={handleServicesClick}
              className={`px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer ${
                isServices
                  ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 shadow-xs'
                  : 'text-slate-300 hover:text-cyan-400 hover:bg-white/5'
              }`}
            >
              <span>Dịch Vụ</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-cyan-400' : 'text-slate-400'}`} />
            </Link>

            {/* Dropdown Menu */}
            {servicesDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 rounded-2xl bg-[#0D162B] border border-slate-700 shadow-2xl p-2 space-y-1 backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <Link
                  href="/services#packages"
                  onClick={(e) => {
                    setServicesDropdownOpen(false);
                    if (isHome) {
                      e.preventDefault();
                      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="block p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group cursor-pointer"
                >
                  <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                    Doanh Nhân Cá Nhân
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Thẻ danh thiếp số 3D &amp; Profile động
                  </div>
                </Link>

                <Link
                  href="/services#packages"
                  onClick={(e) => {
                    setServicesDropdownOpen(false);
                    if (isHome) {
                      e.preventDefault();
                      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="block p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group cursor-pointer bg-blue-500/10 border border-blue-500/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-cyan-300 group-hover:text-white transition-colors">
                      Doanh Nghiệp Sự Kiện MICE
                    </span>
                    <span className="text-[9px] font-black bg-blue-500 text-white px-1.5 py-0.2 rounded-full uppercase">
                      HOT
                    </span>
                  </div>
                  <div className="text-[10px] text-blue-200 font-medium">
                    Trạm check-in siêu tốc &lt; 0.42s &amp; CRM
                  </div>
                </Link>

                <Link
                  href="/services#packages"
                  onClick={(e) => {
                    setServicesDropdownOpen(false);
                    if (isHome) {
                      e.preventDefault();
                      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="block p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group cursor-pointer"
                >
                  <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Hiệp Hội Tổ Chức
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Mạng lưới hội viên số tập trung toàn tỉnh
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Thông Tin Thêm */}
          <Link
            href="/posts"
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              isPosts
                ? 'text-blue-300 bg-blue-500/15 border border-blue-500/30 shadow-xs'
                : 'text-slate-300 hover:text-blue-400 hover:bg-white/5'
            }`}
          >
            Thông Tin Thêm
          </Link>
        </nav>

        {/* Action CTAs: Sync 100% Across All Pages */}
        <div className="hidden sm:flex items-center gap-2.5">
          {currentIdentity ? (
            <div className="flex items-center gap-2">
              {/* Profile Card Pill with Green Pulse Dot */}
              <Link
                href="/dashboard/card"
                title="Xem hồ sơ danh thiếp số của bạn"
                className="flex items-center gap-2.5 p-1 pl-1.5 pr-3.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/60 transition-all group select-none shadow-sm"
              >
                <img
                  src={
                    currentIdentity.avatarUrl && currentIdentity.avatarUrl.trim() !== ''
                      ? currentIdentity.avatarUrl
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentIdentity.fullName || 'User')}&background=0066FF&color=fff&bold=true`
                  }
                  alt={currentIdentity.fullName}
                  className="w-7 h-7 rounded-full object-cover border border-blue-400/50 shadow-xs shrink-0"
                />
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors max-w-[140px] truncate">
                    {currentIdentity.displayName || currentIdentity.fullName}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    Đã đăng nhập
                  </span>
                </div>
              </Link>

              {/* Dashboard Button */}
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="gap-1.5 bg-[#0066FF] hover:bg-blue-600 text-white font-extrabold rounded-xl text-xs h-9 px-3.5 shadow-sm shadow-blue-500/25 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Trải Nghiệm Dự Án CTA */}
              <Link href="/login">
                <Button
                  size="sm"
                  className="gap-1.5 bg-gradient-to-r from-[#0066FF] to-[#0052CC] hover:from-blue-600 hover:to-blue-700 text-white font-extrabold rounded-xl text-xs h-9 px-4 shadow-sm shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Trải nghiệm dự án
                </Button>
              </Link>

              <Link href="/login">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-xs h-9 px-3.5 cursor-pointer shadow-2xs"
                >
                  Đăng nhập
                </Button>
              </Link>

              <Link href="/register">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-white/10 font-bold rounded-xl text-xs h-9 px-3 cursor-pointer"
                >
                  Đăng ký
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Right Action Area */}
        <div className="flex items-center gap-2 lg:hidden">
          {currentIdentity && (
            <Link
              href="/dashboard/card"
              className="flex items-center gap-1.5 p-1 pr-2.5 rounded-full bg-slate-900/90 border border-slate-700/80 select-none"
              title="Hồ sơ danh thiếp của bạn"
            >
              <img
                src={
                  currentIdentity.avatarUrl && currentIdentity.avatarUrl.trim() !== ''
                    ? currentIdentity.avatarUrl
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentIdentity.fullName || 'User')}&background=0066FF&color=fff&bold=true`
                }
                alt={currentIdentity.fullName}
                className="w-7 h-7 rounded-full object-cover border border-emerald-400/80 shrink-0"
              />
              <span className="text-[11px] font-bold text-white max-w-[75px] truncate">
                {currentIdentity.displayName || currentIdentity.fullName}
              </span>
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0A1124]/98 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl">
          {currentIdentity && (
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between gap-3 shadow-inner mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={
                    currentIdentity.avatarUrl && currentIdentity.avatarUrl.trim() !== ''
                      ? currentIdentity.avatarUrl
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentIdentity.fullName || 'User')}&background=0066FF&color=fff&bold=true`
                  }
                  alt={currentIdentity.fullName}
                  className="w-9 h-9 rounded-full object-cover border border-blue-400/50 shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate">
                    {currentIdentity.fullName}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    Đã đăng nhập
                  </span>
                </div>
              </div>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl h-8 px-3 shrink-0">
                  Dashboard
                </Button>
              </Link>
            </div>
          )}

          <Link
            href="/"
            onClick={() => {
              setMobileMenuOpen(false);
              if (isHome) scrollToTop();
            }}
            className={`w-full block px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
              isHome ? 'text-white bg-slate-800' : 'text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Trang Chủ
          </Link>

          <Link
            href="/social-value"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full block px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
              isSocialValue ? 'text-emerald-300 bg-emerald-500/20' : 'text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Giá Trị Xã Hội &amp; ESG
          </Link>

          {/* Dịch Vụ (Mobile Accordion / Sublinks) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800/60 rounded-xl">
              <Link
                href="/services"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (isHome) {
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`flex-1 ${isServices ? 'text-cyan-300' : 'text-slate-200'}`}
              >
                Dịch Vụ
              </Link>
              <button
                type="button"
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="p-1 text-slate-400 hover:text-white"
                aria-label="Toggle services list"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {mobileServicesOpen && (
              <div className="pl-4 pr-2 py-1 space-y-1 border-l-2 border-slate-700 ml-3">
                <Link
                  href="/services#packages"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (isHome) {
                      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="block px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/40 rounded-lg"
                >
                  Doanh Nhân Cá Nhân
                </Link>
                <Link
                  href="/services#packages"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (isHome) {
                      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="block px-3 py-2 text-xs font-bold text-cyan-300 hover:text-white hover:bg-slate-800/40 rounded-lg flex items-center justify-between"
                >
                  <span>Doanh Nghiệp Sự Kiện MICE</span>
                  <span className="text-[9px] bg-blue-500 text-white px-1.5 py-0.2 rounded-full uppercase">HOT</span>
                </Link>
                <Link
                  href="/services#packages"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (isHome) {
                      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="block px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/40 rounded-lg"
                >
                  Hiệp Hội Tổ Chức
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/posts"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full block px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
              isPosts ? 'text-blue-300 bg-blue-500/20' : 'text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Thông Tin Thêm
          </Link>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {currentIdentity ? (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/dashboard/card" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full gap-1.5 border-slate-700 bg-slate-800/80 text-white font-bold rounded-xl text-xs h-10">
                    <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                    Danh thiếp VIP
                  </Button>
                </Link>
                <Link href="/dashboard" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full gap-1.5 bg-[#0066FF] hover:bg-blue-600 text-white font-bold rounded-xl text-xs h-10 shadow-sm">
                    <Layers className="w-3.5 h-3.5" />
                    Vào Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Link href="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full gap-2 bg-gradient-to-r from-[#0066FF] to-[#0052CC] hover:from-blue-600 hover:to-blue-700 text-white font-extrabold rounded-xl text-xs h-11 shadow-sm">
                    <Sparkles className="w-4 h-4" /> Trải nghiệm dự án
                  </Button>
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-slate-700 bg-slate-800/80 text-white font-bold rounded-xl text-xs h-10">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link href="/register" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full bg-slate-800/50 hover:bg-slate-800 text-slate-200 font-bold rounded-xl text-xs h-10">
                      Đăng ký
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
