'use client';

import React, { useState, useEffect } from 'react';
import { Plus_Jakarta_Sans, Inter, Be_Vietnam_Pro } from 'next/font/google';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Calendar,
  Zap,
  BarChart3,
  LogOut,
  ShieldCheck,
  Search,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  Smartphone,
  PanelLeftClose,
  PanelLeftOpen,
  UserCheck,
  Layers,
} from 'lucide-react';
import { useOneConnectStore } from '@/lib/store';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

export interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
  highlight?: boolean;
  allowedRoles: ('SUPER_ADMIN' | 'ORG_ADMIN' | 'EVENT_OPERATOR' | 'MEMBER' | 'GUEST')[];
  section: 'PERSONAL' | 'OPERATION' | 'ADMIN' | 'PITCHING';
  deviceTag?: '📱' | '💻';
}

export const ALL_NAV_ITEMS: NavItem[] = [
  // 1. CÁ NHÂN & GIAO THƯƠNG B2B (Doanh Nhân - Mobile/Laptop)
  {
    href: '/dashboard',
    label: 'Tổng Quan',
    icon: LayoutDashboard,
    allowedRoles: ['SUPER_ADMIN', 'ORG_ADMIN', 'EVENT_OPERATOR', 'MEMBER', 'GUEST'],
    section: 'PERSONAL',
  },
  {
    href: '/dashboard/card',
    label: 'Thẻ NFC Doanh Nhân',
    icon: CreditCard,
    allowedRoles: ['SUPER_ADMIN', 'ORG_ADMIN', 'MEMBER'],
    section: 'PERSONAL',
    deviceTag: '📱',
  },
  {
    href: '/dashboard/connections',
    label: 'Mạng Lưới B2B & Consent',
    icon: UserCheck,
    badge: 'PDPL 91',
    allowedRoles: ['SUPER_ADMIN', 'ORG_ADMIN', 'MEMBER'],
    section: 'PERSONAL',
  },
  {
    href: '/matching',
    label: 'AI B2B Matchmaking',
    icon: Zap,
    badge: 'AI Match',
    allowedRoles: ['SUPER_ADMIN', 'ORG_ADMIN', 'EVENT_OPERATOR', 'MEMBER'],
    section: 'PERSONAL',
  },

  // 2. VẬN HÀNH HIỆN TRƯỜNG (Sự Kiện - Ưu tiên Mobile / Tablet)
  {
    href: '/operator/checkin',
    label: 'Trạm Check-in Siêu Tốc',
    icon: Smartphone,
    badge: '<1s',
    allowedRoles: ['SUPER_ADMIN', 'ORG_ADMIN', 'EVENT_OPERATOR'],
    section: 'OPERATION',
    deviceTag: '📱',
  },
  {
    href: '/operator/attendees',
    label: 'Danh Sách Điểm Danh',
    icon: UserCheck,
    allowedRoles: ['SUPER_ADMIN', 'ORG_ADMIN', 'EVENT_OPERATOR'],
    section: 'OPERATION',
  },
  {
    href: '/events',
    label: 'Sự Kiện & Lịch Trình',
    icon: Calendar,
    allowedRoles: ['SUPER_ADMIN', 'ORG_ADMIN', 'EVENT_OPERATOR', 'MEMBER', 'GUEST'],
    section: 'OPERATION',
  },

  // 3. QUẢN TRỊ HIỆP HỘI & HỆ THỐNG (Admin Cockpit - Ưu tiên Laptop)
  {
    href: '/admin/org',
    label: 'Đại Biểu & Hiệp Hội',
    icon: Users,
    allowedRoles: ['SUPER_ADMIN', 'ORG_ADMIN'],
    section: 'ADMIN',
    deviceTag: '💻',
  },
  {
    href: '/admin/nfc-cards',
    label: 'Kho Thẻ & Phôi NFC',
    icon: Layers,
    allowedRoles: ['SUPER_ADMIN'],
    section: 'ADMIN',
    deviceTag: '💻',
  },
  {
    href: '/reports',
    label: 'Báo Cáo & KPI MICE',
    icon: BarChart3,
    allowedRoles: ['SUPER_ADMIN', 'ORG_ADMIN'],
    section: 'ADMIN',
    deviceTag: '💻',
  },
  {
    href: '/dashboard/settings',
    label: 'Bảo Mật & Phân Quyền',
    icon: ShieldCheck,
    allowedRoles: ['SUPER_ADMIN', 'ORG_ADMIN', 'MEMBER'],
    section: 'ADMIN',
    deviceTag: '💻',
  },

  // 4. LIVE DEMO HUB
  {
    href: '/demo',
    label: 'Live Demo Pitching Hub',
    icon: Sparkles,
    highlight: true,
    allowedRoles: ['SUPER_ADMIN', 'ORG_ADMIN', 'EVENT_OPERATOR', 'MEMBER', 'GUEST'],
    section: 'PITCHING',
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { currentIdentity, state, setCurrentRole } = useOneConnectStore();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentUserName = currentIdentity?.displayName || currentIdentity?.fullName || 'Hội Viên One Connect';
  const currentUserAvatar = currentIdentity?.avatarUrl || (currentIdentity?.username === 'johnnylongho' ? '/avatar-johnny-long.jpg' : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUserName)}`);
  const effectiveRole = state?.currentRole || 'MEMBER';

  // Load saved sidebar state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('one_connect_sidebar_collapsed');
      if (saved !== null) {
        setIsSidebarCollapsed(saved === 'true');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('one_connect_sidebar_collapsed', String(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  // Filter navigation items by active user role (RBAC)
  const allowedNavItems = ALL_NAV_ITEMS.filter((item) =>
    item.allowedRoles.includes(effectiveRole as any)
  );

  const personalItems = allowedNavItems.filter((item) => item.section === 'PERSONAL');
  const operationItems = allowedNavItems.filter((item) => item.section === 'OPERATION');
  const adminItems = allowedNavItems.filter((item) => item.section === 'ADMIN');
  const pitchingItems = allowedNavItems.filter((item) => item.section === 'PITCHING');

  const isPublicCardPage = pathname?.startsWith('/p/') || pathname?.startsWith('/c/');

  if (isPublicCardPage) {
    return (
      <html
        lang="vi"
        className={`${plusJakartaSans.variable} ${beVietnamPro.variable} ${inter.variable}`}
        suppressHydrationWarning
      >
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#FFFFFF" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        </head>
        <body
          className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden"
          suppressHydrationWarning
        >
          {children}
        </body>
      </html>
    );
  }

  const renderNavGroup = (items: NavItem[], title: string, subtitle?: string) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-1 pt-1.5 first:pt-0">
        {!isSidebarCollapsed && (
          <div className="flex items-center justify-between px-2 pb-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              {title}
            </span>
            {subtitle && (
              <span className="text-[9px] font-medium text-slate-400">
                {subtitle}
              </span>
            )}
          </div>
        )}

        <nav className="space-y-1 text-xs font-medium">
          {items.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isSidebarCollapsed ? `${item.label} (${item.deviceTag || ''})` : undefined}
                className={`flex items-center rounded-xl transition-all ${
                  isSidebarCollapsed
                    ? 'justify-center p-2.5'
                    : 'justify-between px-3 py-2'
                } ${
                  isActive
                    ? 'font-bold bg-blue-50 text-[#0066FF] border border-blue-200/80 shadow-2xs'
                    : item.highlight
                    ? 'text-orange-600 bg-orange-50/80 hover:bg-orange-100/80 border border-orange-200/80 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className={`flex items-center ${isSidebarCollapsed ? '' : 'gap-2.5'} min-w-0`}>
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? 'text-[#0066FF]'
                        : item.highlight
                        ? 'text-[#FF6B00]'
                        : 'text-slate-500'
                    }`}
                  />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isSidebarCollapsed && (
                  <div className="flex items-center gap-1 shrink-0">
                    {item.deviceTag && (
                      <span className="text-[9.5px] opacity-70" title="Thiết bị ưu tiên">
                        {item.deviceTag}
                      </span>
                    )}
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-600 border border-orange-200">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    );
  };

  return (
    <html
      lang="vi"
      className={`${plusJakartaSans.variable} ${beVietnamPro.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0066FF" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body
        className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden"
        suppressHydrationWarning
      >
        <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC] w-full overflow-x-hidden">
          
          {/* ================================================================= */}
          {/* 1. DESKTOP / TABLET COLLAPSIBLE SIDEBAR */}
          {/* ================================================================= */}
          <aside
            className={`shrink-0 border-r border-slate-200/90 bg-white flex flex-col justify-between hidden md:flex sticky top-0 h-screen z-30 shadow-2xs transition-all duration-300 ease-in-out ${
              isSidebarCollapsed ? 'w-18' : 'w-64'
            }`}
          >
            {/* Top Brand Logo & Menu Items */}
            <div className={`space-y-4 overflow-y-auto ${isSidebarCollapsed ? 'p-2.5' : 'p-4'}`}>
              {/* Brand Header */}
              <div className="relative">
                {!isSidebarCollapsed ? (
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href="/dashboard"
                      className="flex-1 flex flex-col items-center justify-center p-1.5 rounded-2xl hover:bg-slate-50 transition-all text-center group"
                    >
                      <img
                        src="/one_connect_final_logo_orange.png"
                        alt="One Connect"
                        className="h-8 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="mt-1 flex items-center justify-center">
                        <span className="text-[9px] font-extrabold tracking-widest px-2 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 uppercase inline-flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-[#FF6B00]" /> RBAC Enterprise
                        </span>
                      </div>
                    </Link>

                    {/* Minimize Button */}
                    <button
                      onClick={toggleSidebar}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                      title="Thu gọn Menu"
                    >
                      <PanelLeftClose className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Link
                      href="/dashboard"
                      className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-slate-50 transition-all text-center group"
                      title="ONE CONNECT"
                    >
                      <img
                        src="/one_connect_final_logo_orange.png"
                        alt="One Connect"
                        className="h-7 w-auto object-contain shrink-0 group-hover:scale-110 transition-transform"
                      />
                    </Link>

                    {/* Expand Button */}
                    <button
                      onClick={toggleSidebar}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Mở rộng Menu"
                    >
                      <PanelLeftOpen className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* User Admin Badge */}
              {!isSidebarCollapsed ? (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                  <img
                    src={currentUserAvatar}
                    alt={currentUserName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-blue-500 shadow-2xs shrink-0 bg-white"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUserName)}&backgroundColor=0066ff,00c2ff`;
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 text-xs truncate">{currentUserName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 uppercase">
                        {effectiveRole}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="flex justify-center p-1 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer"
                  title={`${currentUserName} (${effectiveRole})`}
                >
                  <div className="relative">
                    <img
                      src={currentUserAvatar}
                      alt={currentUserName}
                      className="w-7 h-7 rounded-full object-cover border-2 border-blue-500 bg-white"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUserName)}&backgroundColor=0066ff,00c2ff`;
                      }}
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                  </div>
                </div>
              )}

              {/* Categorized RBAC Navigation Groups */}
              <div className="space-y-3">
                {renderNavGroup(personalItems, 'Doanh Nhân & B2B', '📱💻')}
                {renderNavGroup(operationItems, 'Hiện Trường Sự Kiện', '📱')}
                {renderNavGroup(adminItems, 'Quản Trị & Báo Cáo', '💻')}
                {renderNavGroup(pitchingItems, 'Live Demo')}
              </div>
            </div>

            {/* Bottom Footer Status */}
            <div
              className={`border-t border-slate-200 bg-slate-50 flex items-center text-xs text-slate-500 ${
                isSidebarCollapsed ? 'p-2.5 flex-col justify-center gap-2' : 'p-3 justify-between'
              }`}
            >
              {!isSidebarCollapsed ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-[10.5px] text-slate-700 font-semibold truncate">PDPL 91/2025 Compliant</span>
                  </div>
                  <Link href="/login" title="Đăng xuất" className="p-1 text-slate-400 hover:text-rose-600 transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                  </Link>
                </>
              ) : (
                <>
                  <div title="PDPL 91/2025 Compliant">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <Link href="/login" title="Đăng xuất" className="p-1 text-slate-400 hover:text-rose-600 transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}
            </div>
          </aside>

          {/* ================================================================= */}
          {/* 2. MOBILE TOPBAR (Chỉ hiển thị trên Mobile) */}
          {/* ================================================================= */}
          <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3.5 py-2 flex items-center justify-between shadow-2xs">
            <Link href="/dashboard" className="flex items-center gap-2">
              <img
                src="/one_connect_final_logo_orange.png"
                alt="One Connect"
                className="h-6 w-auto object-contain shrink-0"
              />
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                {effectiveRole}
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Link href="/demo">
                <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#FF6B00]" /> Demo
                </span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)}>
              <div
                className="w-4/5 max-w-xs h-full bg-white p-4 space-y-4 shadow-2xl flex flex-col justify-between overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <img src="/one_connect_final_logo_orange.png" alt="Logo" className="h-6 w-auto" />
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                        {effectiveRole}
                      </span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile User Tag */}
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <img
                      src={currentUserAvatar}
                      alt={currentUserName}
                      className="w-7 h-7 rounded-full object-cover border border-blue-500 bg-white shrink-0"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUserName)}&backgroundColor=0066ff,00c2ff`;
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 text-xs truncate">{currentUserName}</p>
                      <p className="text-[9px] text-blue-700 font-semibold">{effectiveRole}</p>
                    </div>
                  </div>

                  <nav className="space-y-1 text-xs font-medium">
                    {allowedNavItems.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                            isActive
                              ? 'bg-blue-50 text-[#0066FF] font-bold border border-blue-200/80'
                              : item.highlight
                              ? 'text-orange-600 bg-orange-50 font-semibold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{item.label}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {item.deviceTag && <span className="text-[10px] opacity-70">{item.deviceTag}</span>}
                            {item.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-600">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[10px] font-semibold text-slate-700">PDPL 91/2025</span>
                  </div>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-rose-600">
                    <LogOut className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* 3. MAIN CONTENT CONTAINER (Nội dung từng trang) */}
          {/* ================================================================= */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen w-full overflow-x-hidden">
            {/* Desktop Top Header Bar */}
            <header className="hidden md:flex h-14 border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-20 px-5 items-center justify-between shadow-2xs">
              {/* Search Bar */}
              <div className="relative w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm đại biểu, mã NFC, sự kiện..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Topbar Right Quick Actions */}
              <div className="flex items-center gap-3">
                <Link href="/operator/checkin">
                  <span className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0066FF] text-xs font-bold border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer">
                    <Smartphone className="w-3.5 h-3.5" /> Trạm Check-in NFC
                  </span>
                </Link>

                <div className="h-4 w-px bg-slate-200" />

                {/* Role Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
                  >
                    <span>Vai trò: <strong className="text-slate-900">{effectiveRole}</strong></span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {isRoleDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-30 space-y-1">
                      <button
                        onClick={() => {
                          setCurrentRole('SUPER_ADMIN');
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                          effectiveRole === 'SUPER_ADMIN' ? 'bg-blue-50 text-[#0066FF]' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        👑 SUPER_ADMIN (Quản Trị Hệ Thống)
                      </button>
                      <button
                        onClick={() => {
                          setCurrentRole('ORG_ADMIN');
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                          effectiveRole === 'ORG_ADMIN' ? 'bg-blue-50 text-[#0066FF]' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        🏛️ ORG_ADMIN (Quản Trị Hiệp Hội)
                      </button>
                      <button
                        onClick={() => {
                          setCurrentRole('EVENT_OPERATOR');
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                          effectiveRole === 'EVENT_OPERATOR' ? 'bg-blue-50 text-[#0066FF]' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        📱 EVENT_OPERATOR (Lễ Tân / Check-in)
                      </button>
                      <button
                        onClick={() => {
                          setCurrentRole('MEMBER');
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                          effectiveRole === 'MEMBER' ? 'bg-blue-50 text-[#0066FF]' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        💼 MEMBER (Doanh Nhân / Hội Viên)
                      </button>
                      <button
                        onClick={() => {
                          setCurrentRole('GUEST');
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                          effectiveRole === 'GUEST' ? 'bg-blue-50 text-[#0066FF]' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        👤 GUEST (Khách Mời Vãng Lai)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Page Main Content */}
            <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto overflow-x-hidden">
              {children}
            </main>
          </div>

        </div>
      </body>
    </html>
  );
}
