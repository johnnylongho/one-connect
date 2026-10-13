'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Layers,
  Users,
  Smartphone,
  BarChart3,
  FileText,
  Activity,
  LayoutDashboard,
  Settings,
} from 'lucide-react';
import { AdminSidebar, AdminHeader } from '@/components/admin';

const ADMIN_SUB_NAV = [
  { href: '/admin', label: 'Command Center', icon: LayoutDashboard },
  { href: '/admin/org', label: 'Tổng Quan Hiệp Hội', icon: Layers },
  { href: '/admin/org/members', label: 'Hội Viên & RBAC', icon: Users },
  { href: '/admin/nfc-cards', label: 'Cấp Phát Thẻ NFC', icon: Smartphone },
  { href: '/admin/reports', label: 'Báo Cáo & Đo Lường', icon: BarChart3 },
  { href: '/admin/articles', label: 'Tin Tức & CMS', icon: FileText },
  { href: '/admin/pilot-metrics', label: 'Chỉ Số Pilot Telemetry', icon: Activity, badge: 'REALTIME' },
  { href: '/admin/settings', label: 'Cấu hình & Phân quyền', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isTabletView, setIsTabletView] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Key shortcut '[' to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '[' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        setCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0d1627] text-slate-800 p-1 sm:p-2 md:p-3 flex flex-col justify-center font-sans antialiased">
      {/* Outer Dashboard Window Container (Mirroring executive command center canvas) */}
      <div 
        className={`w-full min-h-[calc(100vh-1.5rem)] bg-[#f4f7fb] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-slate-700/30 flex flex-col transition-all duration-300 mx-auto ${
          isTabletView 
            ? 'max-w-[1024px] shadow-indigo-950/40 ring-4 ring-indigo-500/20' 
            : 'max-w-[1680px]'
        }`}
      >
        {/* Tablet Simulator Notice (if active) */}
        {isTabletView && (
          <div className="bg-indigo-600 text-white text-xs px-4 py-1.5 flex items-center justify-between font-medium shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Đang mô phỏng màn hình Tablet (iPad 1024px) dành cho Tình nguyện viên & Lễ tân MICE</span>
            </div>
            <button 
              onClick={() => setIsTabletView(false)}
              className="underline text-[11px] hover:text-indigo-200 cursor-pointer"
            >
              Trở về Desktop 1440px
            </button>
          </div>
        )}

        {/* Dashboard Layout: Sidebar + Main Area */}
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          {/* Executive Sidebar */}
          <AdminSidebar
            collapsed={collapsed || isTabletView}
            setCollapsed={setCollapsed}
          />

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 flex flex-col overflow-y-auto bg-[#f8fafc]">
            {/* Top Header */}
            <AdminHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isTabletView={isTabletView}
              setIsTabletView={setIsTabletView}
              onOpenNotifications={() => alert("Thông báo hệ thống: Đã kích hoạt 100% kết nối Supabase Cloud Singapore.")}
              onOpenProfile={() => alert("Hồ sơ quản trị viên: Ban Điều Hành One Connect Network Khánh Hòa.")}
            />

            {/* Admin Sub-navigation Header */}
            <div className="px-4 sm:px-6 pt-3 pb-0">
              <nav
                aria-label="Admin Navigation"
                className="w-full bg-white border border-slate-200/90 rounded-2xl p-1.5 shadow-2xs overflow-x-auto"
              >
                <div className="flex items-center gap-1.5 min-w-max">
                  {ADMIN_SUB_NAV.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = tab.href === '/admin' ? pathname === '/admin' : pathname === tab.href || pathname?.startsWith(tab.href + '/');
                    return (
                      <Link
                        key={tab.href}
                        href={tab.href}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
                          isActive
                            ? 'bg-blue-50 text-[#0066FF] border-blue-200/90 shadow-2xs'
                            : 'text-slate-600 border-transparent hover:text-[#0066FF] hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0066FF]' : 'text-slate-400'}`} />
                        <span>{tab.label}</span>
                        {tab.badge && (
                          <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-700 tracking-wider">
                            {tab.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </div>

            {/* Dashboard Body Content */}
            <main className="flex-1 p-4 sm:p-5 lg:p-6 space-y-5">
              {children}
            </main>

            {/* Quiet Footer */}
            <footer className="px-6 py-3.5 bg-white border-t border-slate-200/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">ONE CONNECT NETWORK © 2026</span>
                <span>·</span>
                <span>Tập đoàn Công nghệ số A+ (Aplusvn Media & Tech)</span>
                <span>·</span>
                <span>Nha Trang, Khánh Hòa</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span>Trưởng dự án: Johnny Long Hồ</span>
                <span>·</span>
                <span>Tuân thủ PDPL 91/2025/QH15</span>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
