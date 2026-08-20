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

  const navItems = [
    { href: '/dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
    { href: '/dashboard/card', label: 'Thẻ NFC Doanh Nhân', icon: CreditCard },
    { href: '/matching', label: 'B2B Matchmaking', icon: Zap, badge: 'AI Match' },
    { href: '/events', label: 'Sự Kiện & Check-in', icon: Calendar },
    { href: '/admin/org', label: 'Đại Biểu & Hiệp Hội', icon: Users },
    { href: '/reports', label: 'Báo Cáo & KPI', icon: BarChart3 },
    { href: '/dashboard/settings', label: 'Bảo Mật & PDPL', icon: ShieldCheck },
    { href: '/demo', label: 'Live Demo Hub', icon: Sparkles, highlight: true },
  ];

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
            className={`shrink-0 border-r border-slate-200/90 bg-white flex flex-col justify-between hidden md:flex sticky top-0 h-screen z-30 shadow-xs transition-all duration-300 ease-in-out ${
              isSidebarCollapsed ? 'w-20' : 'w-64'
            }`}
          >
            {/* Top Brand Logo & Menu Items */}
            <div className={`space-y-5 overflow-y-auto ${isSidebarCollapsed ? 'p-3' : 'p-5'}`}>
              {/* Brand Header */}
              <div className="relative">
                {!isSidebarCollapsed ? (
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href="/dashboard"
                      className="flex-1 flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 transition-all text-center group"
                    >
                      <img
                        src="/one_connect_final_logo_orange.png"
                        alt="One Connect"
                        className="h-9 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="mt-1 flex items-center justify-center">
                        <span className="text-[10px] font-extrabold tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 uppercase inline-flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-[#FF6B00]" /> Enterprise MVP
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
                        className="h-8 w-auto object-contain shrink-0 group-hover:scale-110 transition-transform"
                      />
                      <span className="text-[8px] font-extrabold px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 mt-1 uppercase">
                        MVP
                      </span>
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
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                  <img
                    src={currentUserAvatar}
                    alt={currentUserName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-blue-500 shadow-xs shrink-0 bg-white"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUserName)}&backgroundColor=0066ff,00c2ff`;
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 text-xs truncate">{currentUserName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 uppercase">
                        {effectiveRole}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="flex justify-center p-1.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer"
                  title={`${currentUserName} (${effectiveRole})`}
                >
                  <div className="relative">
                    <img
                      src={currentUserAvatar}
                      alt={currentUserName}
                      className="w-8 h-8 rounded-full object-cover border-2 border-blue-500 bg-white"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUserName)}&backgroundColor=0066ff,00c2ff`;
                      }}
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                  </div>
                </div>
              )}

              {/* Menu Navigation Group */}
              <div className="space-y-1">
                {!isSidebarCollapsed && (
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 pb-1">
                    Hệ Thống Quản Trị
                  </div>
                )}

                <nav className="space-y-1 text-xs font-medium">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={isSidebarCollapsed ? item.label : undefined}
                        className={`flex items-center rounded-xl transition-all ${
                          isSidebarCollapsed
                            ? 'justify-center p-3'
                            : 'justify-between px-3 py-2.5'
                        } ${
                          isActive
                            ? 'font-bold bg-blue-50 text-[#0066FF] border border-blue-200/80 shadow-xs'
                            : item.highlight
                            ? 'text-orange-600 bg-orange-50/80 hover:bg-orange-100/80 border border-orange-200/80 font-semibold'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <div className={`flex items-center ${isSidebarCollapsed ? '' : 'gap-2.5'}`}>
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive
                                ? 'text-[#0066FF]'
                                : item.highlight
                                ? 'text-[#FF6B00]'
                                : 'text-slate-500'
                            }`}
                          />
                          {!isSidebarCollapsed && <span>{item.label}</span>}
                        </div>
                        {!isSidebarCollapsed && item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600 border border-orange-200">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Bottom Footer Status */}
            <div
              className={`border-t border-slate-200 bg-slate-50 flex items-center text-xs text-slate-500 ${
                isSidebarCollapsed ? 'p-3 flex-col justify-center gap-3' : 'p-3.5 justify-between'
              }`}
            >
              {!isSidebarCollapsed ? (
                <>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-[11px] text-slate-700 font-semibold truncate">PDPL 91/2025 Compliant</span>
                  </div>
                  <Link href="/login" title="Đăng xuất" className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </Link>
                </>
              ) : (
                <>
                  <div title="PDPL 91/2025 Compliant">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <Link href="/login" title="Đăng xuất" className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          </aside>

          {/* ================================================================= */}
          {/* 2. MOBILE TOPBAR (Chỉ hiển thị trên Mobile) */}
          {/* ================================================================= */}
          <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3.5 py-2.5 flex items-center justify-between shadow-xs">
            <Link href="/dashboard" className="flex items-center gap-2">
              <img
                src="/one_connect_final_logo_orange.png"
                alt="One Connect"
                className="h-7 w-auto object-contain shrink-0"
              />
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                MVP
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Link href="/demo">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" /> Demo
                </span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)}>
              <div
                className="w-4/5 max-w-xs h-full bg-white p-5 space-y-5 shadow-2xl flex flex-col justify-between overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <img src="/one_connect_final_logo_orange.png" alt="Logo" className="h-6 w-auto" />
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                        MVP
                      </span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Mobile User Tag */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                    <img
                      src={currentUserAvatar}
                      alt={currentUserName}
                      className="w-8 h-8 rounded-full object-cover border border-blue-500 bg-white shrink-0"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUserName)}&backgroundColor=0066ff,00c2ff`;
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 text-xs truncate">{currentUserName}</p>
                      <p className="text-[10px] text-blue-700 font-semibold">{effectiveRole}</p>
                    </div>
                  </div>

                  <nav className="space-y-1 text-sm font-medium">
                    {navItems.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                            isActive
                              ? 'bg-blue-50 text-[#0066FF] font-bold border border-blue-200/80'
                              : item.highlight
                              ? 'text-orange-600 bg-orange-50 font-semibold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <Link
                    href="/operator/checkin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 text-xs shadow-md shadow-blue-500/20"
                  >
                    <Smartphone className="w-4 h-4" /> Trạm Check-in NFC / QR
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* 3. MAIN CONTENT AREA */}
          {/* ================================================================= */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen w-full overflow-x-hidden">
            {/* Desktop Top Header Bar */}
            <header className="hidden md:flex h-16 border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-20 px-6 items-center justify-between shadow-xs">
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
                  <span className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0066FF] text-xs font-bold border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer">
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
            <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
              {children}
            </main>
          </div>

        </div>
      </body>
    </html>
  );
}
