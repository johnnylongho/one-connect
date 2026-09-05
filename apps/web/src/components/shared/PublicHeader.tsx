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
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PublicHeader() {
  const pathname = usePathname();
  const { currentIdentity } = useOneConnectStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === '/' || pathname === '/intro';
  const isSocialValue = pathname === '/social-value';
  const isPosts = pathname?.startsWith('/posts');

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

        {/* Desktop Navigation Links - Standard Items */}
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
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              isSocialValue
                ? 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 shadow-xs'
                : 'text-slate-300 hover:text-emerald-400 hover:bg-white/5'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            Giá Trị Xã Hội &amp; ESG
          </Link>

          {/* Thông Tin Thêm */}
          <Link
            href="/posts"
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              isPosts
                ? 'text-blue-300 bg-blue-500/15 border border-blue-500/30 shadow-xs'
                : 'text-slate-300 hover:text-blue-400 hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
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
            className={`w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
              isSocialValue ? 'text-emerald-300 bg-emerald-500/20' : 'text-emerald-400 hover:bg-slate-800/60'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            Giá Trị Xã Hội &amp; ESG
          </Link>

          <Link
            href="/posts"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
              isPosts ? 'text-blue-300 bg-blue-500/20' : 'text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
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
