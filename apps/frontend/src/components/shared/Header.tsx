'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, User, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 shadow-md shadow-blue-500/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            ONE<span className="text-blue-500">CONNECT</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
          <Link href="/organizer/dashboard" className="hover:text-blue-400 transition-colors">
            Portal Hiệp Hội & BTC
          </Link>
          <Link href="/attendee/my-card" className="hover:text-emerald-400 transition-colors">
            Thẻ Doanh Nhân Số (PWA)
          </Link>
          <Link href="/events" className="hover:text-blue-400 transition-colors">
            Sự Kiện
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          <Link href="/login">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              Đăng nhập
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="default" size="sm">
              Tạo Hồ Sơ NFC
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
