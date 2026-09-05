'use client';

import React, { useState, useEffect } from 'react';
import { Plus_Jakarta_Sans, Inter, Be_Vietnam_Pro } from 'next/font/google';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  FileText,
  Target,
} from 'lucide-react';
import { useOneConnectStore } from '@/lib/store';
import { Logo } from '@/components/shared/Logo';
import { PublicHeader } from '@/components/shared/PublicHeader';
import { RealtimeConnectionModal } from '@/components/realtime/connection-request-modal';
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

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  allowedRoles: string[];
  section: 'PERSONAL' | 'OPERATION' | 'ADMIN' | 'PITCHING';
}

const ALL_NAV_ITEMS: NavItem[] = [
  // PHÂN HỆ 1: DOANH NHÂN & B2B (MEMBER, EXECUTIVE_BOARD, ORG_ADMIN, SUPER_ADMIN)
  {
    href: '/dashboard',
    label: 'Trung Tâm Điều Hành',
    icon: LayoutDashboard,
    allowedRoles: ['MEMBER', 'EXECUTIVE_BOARD', 'ORG_ADMIN', 'SUPER_ADMIN'],
    section: 'PERSONAL',
  },
  {
    href: '/dashboard/card',
    label: 'Danh Thiếp Số & Thẻ NFC',
    icon: CreditCard,
    allowedRoles: ['MEMBER', 'EXECUTIVE_BOARD', 'ORG_ADMIN', 'SUPER_ADMIN'],
    section: 'PERSONAL',
  },
  {
    href: '/dashboard/connections',
    label: 'Sổ Tay Quan Hệ & CRM',
    icon: Users,
    allowedRoles: ['MEMBER', 'EXECUTIVE_BOARD', 'ORG_ADMIN', 'SUPER_ADMIN'],
    section: 'PERSONAL',
  },
  {
    href: '/matching',
    label: 'Kết Nối Cung Cầu AI',
    icon: Sparkles,
    badge: 'AI Smart',
    allowedRoles: ['MEMBER', 'EXECUTIVE_BOARD', 'ORG_ADMIN', 'SUPER_ADMIN'],
    section: 'PERSONAL',
  },
  {
    href: '/dashboard/leads',
    label: 'Đo Lường Leads & Thị Trường',
    icon: Target,
    badge: 'LEADS',
    allowedRoles: ['MEMBER', 'EXECUTIVE_BOARD', 'ORG_ADMIN', 'SUPER_ADMIN'],
    section: 'PERSONAL',
  },

  // PHÂN HỆ 2: QUẢN LÝ SỰ KIỆN MICE (OPERATOR, EXECUTIVE_BOARD, ORG_ADMIN, SUPER_ADMIN)
  {
    href: '/operator/events',
    label: 'Hội Nghị & Diễn Đàn',
    icon: Calendar,
    allowedRoles: ['OPERATOR', 'EXECUTIVE_BOARD', 'ORG_ADMIN', 'SUPER_ADMIN'],
    section: 'OPERATION',
  },
  {
    href: '/operator/checkin',
    label: 'Trạm Check-in NFC (<1s)',
    icon: Zap,
    badge: '<0.42s',
    allowedRoles: ['OPERATOR', 'EXECUTIVE_BOARD', 'ORG_ADMIN', 'SUPER_ADMIN'],
    section: 'OPERATION',
  },
  {
    href: '/operator/attendees',
    label: 'Khách Mời & Thẻ Đại Biểu',
    icon: UserCheck,
    allowedRoles: ['OPERATOR', 'EXECUTIVE_BOARD', 'ORG_ADMIN', 'SUPER_ADMIN'],
    section: 'OPERATION',
  },

  // PHÂN HỆ 3: QUẢN TRỊ HIỆP HỘI & TỔ CHỨC (Chỉ ORG_ADMIN, SUPER_ADMIN)
  {
    href: '/admin/org',
    label: 'Không Gian Hiệp Hội YBA',
    icon: Layers,
    allowedRoles: ['ORG_ADMIN', 'SUPER_ADMIN'],
    section: 'ADMIN',
  },
  {
    href: '/admin/org/members',
    label: 'Hội Viên & Cấp Quyền RBAC',
    icon: Users,
    allowedRoles: ['ORG_ADMIN', 'SUPER_ADMIN'],
    section: 'ADMIN',
  },
  {
    href: '/admin/nfc-cards',
    label: 'Cấp Phát Phôi Thẻ NFC',
    icon: Smartphone,
    allowedRoles: ['ORG_ADMIN', 'SUPER_ADMIN'],
    section: 'ADMIN',
  },
  {
    href: '/admin/reports',
    label: 'Báo Cáo & Tuân Thủ PDPL',
    icon: BarChart3,
    allowedRoles: ['ORG_ADMIN', 'SUPER_ADMIN'],
    section: 'ADMIN',
  },
  {
    href: '/admin/articles',
    label: 'Quản Lý Bài Viết & SEO',
    icon: FileText,
    allowedRoles: ['ORG_ADMIN', 'SUPER_ADMIN'],
    section: 'ADMIN',
  },

  // TIỆN ÍCH: DEMO HUB (Chỉ Super Admin)
  {
    href: '/demo',
    label: 'Live Pitching Prototype',
    icon: Sparkles,
    allowedRoles: ['SUPER_ADMIN'],
    section: 'PITCHING',
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentIdentity, state, setCurrentRole, logoutUser, isHydrated } = useOneConnectStore();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentUserName = currentIdentity?.displayName || currentIdentity?.fullName || 'Hội Viên One Connect';
  const currentUserAvatar = currentIdentity?.avatarUrl || (currentIdentity?.username === 'johnnylongho' ? '/avatar-johnny-long.jpg' : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUserName)}`);
  
  const isJohnnySuperAdmin = currentIdentity?.username === 'johnnylongho' || 
                             currentIdentity?.email === 'contact.johnnylongho@gmail.com' ||
                             currentIdentity?.id === 'id-001' || 
                             currentIdentity?.id === '11111111-1111-1111-1111-111111111111';
  const effectiveRole = isJohnnySuperAdmin ? (state?.currentRole || 'SUPER_ADMIN') : (currentIdentity?.role || 'MEMBER');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('one_connect_sidebar_collapsed');
      if (saved !== null) {
        setIsSidebarCollapsed(saved === 'true');
      }
    } catch (e) {}
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('one_connect_sidebar_collapsed', String(next));
      } catch (e) {}
      return next;
    });
  };

  const allowedNavItems = ALL_NAV_ITEMS.filter((item) =>
    item.allowedRoles.includes(effectiveRole as any)
  );

  const personalItems = allowedNavItems.filter((item) => item.section === 'PERSONAL');
  const operationItems = allowedNavItems.filter((item) => item.section === 'OPERATION');
  const adminItems = allowedNavItems.filter((item) => item.section === 'ADMIN');
  const pitchingItems = allowedNavItems.filter((item) => item.section === 'PITCHING');

  const isStandalonePage = 
    pathname === '/' ||
    pathname === '/intro' ||
    pathname === '/social-value' ||
    pathname === '/posts' ||
    pathname?.startsWith('/posts/') ||
    pathname === '/demo' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname?.startsWith('/auth') ||
    pathname?.startsWith('/p/') || 
    pathname?.startsWith('/c/');

  useEffect(() => {
    // Only verify auth AFTER hydration is complete to avoid false-positive redirects
    if (!isHydrated) return;

    const cookieExists = typeof document !== 'undefined' && 
      (document.cookie.includes('one_connect_auth_session=') || document.cookie.includes('sb-access-token='));

    if (!state.currentIdentityId && !cookieExists && !isStandalonePage) {
      router.replace('/login');
    }
  }, [state.currentIdentityId, isStandalonePage, isHydrated, router]);

  if (isStandalonePage) {
    const isPublicPortal = 
      pathname === '/' ||
      pathname === '/intro' ||
      pathname === '/social-value' ||
      pathname === '/posts' ||
      pathname?.startsWith('/posts');

    return (
      <html
        lang="vi"
        className={`${plusJakartaSans.variable} ${beVietnamPro.variable} ${inter.variable}`}
        suppressHydrationWarning
      >
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#0A1124" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
          <meta name="zalo-platform-site-verification" content="QFsG8gZ97ozZr9CBk-S0DKcNXm-buLrPCpKm" />
        </head>
        <body
          className={`min-h-screen ${isPublicPortal ? 'bg-[#F8FAFD]' : 'bg-white'} text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden`}
          suppressHydrationWarning
        >
          {isPublicPortal && <PublicHeader />}
          {children}
        </body>
      </html>
    );
  }

  const hasClientAuthCookie = typeof document !== 'undefined' && 
    (document.cookie.includes('one_connect_auth_session=') || document.cookie.includes('sb-access-token='));

  if (!isStandalonePage && (!isHydrated || (!state.currentIdentityId && !hasClientAuthCookie))) {
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
          className="min-h-screen bg-[#070A12] text-slate-100 font-sans antialiased flex flex-col items-center justify-center p-4"
          suppressHydrationWarning
        >
          <div className="w-9 h-9 border-3 border-[#0066FF] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-slate-400 font-mono">Đang kiểm tra quyền truy cập hệ thống...</p>
        </body>
      </html>
    );
  }

  const renderNavGroup = (items: NavItem[], title: string, subtitle?: string) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-1 pt-1.5 first:pt-0">
        {!isSidebarCollapsed ? (
          <div className="flex items-center justify-between px-2 pb-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider truncate">
              {title}
            </span>
            {subtitle && (
              <span className="text-[9px] font-medium text-slate-400 shrink-0">
                {subtitle}
              </span>
            )}
          </div>
        ) : (
          <div className="my-1.5 border-t border-slate-100 first:hidden" />
        )}

        <nav className="space-y-1 text-xs font-medium">
          {items.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isSidebarCollapsed ? `${item.label} (${title})` : undefined}
                className={`flex items-center h-9 rounded-xl transition-all ${
                  isActive
                    ? 'font-bold bg-blue-50 text-[#0066FF] border border-blue-200/80 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                } ${isSidebarCollapsed ? 'w-9' : 'w-full'}`}
              >
                {/* Fixed Icon Container (36px x 36px) - NEVER SHIFTS ON COLLAPSE/EXPAND */}
                <div className="w-9 h-9 flex items-center justify-center shrink-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? 'text-[#0066FF]'
                        : 'text-slate-500'
                    }`}
                  />
                </div>

                {/* Label + Badges (Only visible in expanded mode) */}
                {!isSidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0 pr-2.5">
                    <span className="truncate">{item.label}</span>
                    <div className="flex items-center gap-1 shrink-0 ml-1.5">
                      {item.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                          isActive
                            ? 'bg-blue-100 text-[#0066FF] border-blue-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
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
        <meta name="zalo-platform-site-verification" content="QFsG8gZ97ozZr9CBk-S0DKcNXm-buLrPCpKm" />
      </head>
      <body
        className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden"
        suppressHydrationWarning
      >
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] w-full overflow-x-hidden">
          
          {/* ================================================================= */}
          {/* 1. TOP HEADER BAR (CỐ ĐỊNH TRÊN CÙNG - FIXED HEADER) */}
          {/* ================================================================= */}
          <header className="h-14 border-b border-slate-200/90 bg-white/95 backdrop-blur-md fixed top-0 left-0 right-0 z-40 px-3 sm:px-5 flex items-center justify-between shadow-2xs">
            {/* Left: Independent Logo + Search */}
            <div className="flex items-center gap-3">
              {/* Brand Logo - Fixed & Outside sidebar */}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 pr-1 group shrink-0"
                title="One Connect Network"
              >
                <img
                  src="/one_connect_final_logo_orange.png?v=20260904_tagline"
                  alt="One Connect"
                  className="h-7 sm:h-8 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
                />
              </Link>

              <div className="h-5 w-px bg-slate-200 hidden md:block" />

              {/* Search Bar */}
              <div className="relative w-56 lg:w-72 hidden sm:block">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm đại biểu, NFC..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Right: Quick Actions, Role Switcher, Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/operator/checkin" className="hidden sm:block">
                <span className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0066FF] text-xs font-bold border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer">
                  <Smartphone className="w-3.5 h-3.5" /> Trạm Check-in NFC
                </span>
              </Link>

              <div className="h-4 w-px bg-slate-200 hidden sm:block" />

              {/* Role Indicator / Switcher (Chỉ hiển thị công cụ chuyển đổi cho Super Admin Johnny Long Hồ) */}
              {isJohnnySuperAdmin ? (
                <div className="relative">
                  <button
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors cursor-pointer"
                    title="Góc nhìn kiểm thử (Chỉ dành cho Super Admin)"
                  >
                    <span className="hidden sm:inline">Quyền:</span>
                    <strong className="text-blue-950" suppressHydrationWarning>{effectiveRole}</strong>
                    <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
                  </button>

                  {isRoleDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 space-y-1">
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        Kiểm thử phân quyền hệ thống
                      </div>
                      <button
                        onClick={() => {
                          setCurrentRole('SUPER_ADMIN');
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                          effectiveRole === 'SUPER_ADMIN' ? 'bg-blue-50 text-[#0066FF]' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        SUPER_ADMIN (Quản Trị Hệ Thống)
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
                        MEMBER (Hội Viên Doanh Nghiệp)
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Hội Viên</span>
                </div>
              )}

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden cursor-pointer"
                title="Mở menu di động"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </header>

          {/* ================================================================= */}
          {/* 2. BODY LAYOUT: FIXED DESKTOP SIDEBAR + SCROLLABLE MAIN CONTENT */}
          {/* ================================================================= */}
          <div className="flex-1 flex w-full min-h-[calc(100vh-3.5rem)]">
            
            {/* DESKTOP FIXED COLLAPSIBLE SLEEK SIDEBAR (CỐ ĐỊNH HOÀN TOÀN BÊN TRÁI KHÔNG BỊ CUỘN THEO TRANG) */}
            <aside
              className={`shrink-0 border-r border-slate-200/90 bg-white flex flex-col justify-between hidden md:flex fixed top-14 left-0 bottom-0 h-[calc(100vh-3.5rem)] z-30 shadow-2xs transition-all duration-200 ease-in-out ${
                isSidebarCollapsed ? 'w-14' : 'w-60'
              }`}
            >
              {/* Menu Navigation Items (Cuộn độc lập bên trong menu nếu danh sách dài) */}
              <div className="flex-1 space-y-2.5 overflow-y-auto p-2 scrollbar-thin">
                {/* Sidebar Header: Toggle Minimize Button placed at fixed X position above Overview icon */}
                <div className="pb-2 mb-1 border-b border-slate-100/90 flex items-center">
                  <button
                    onClick={toggleSidebar}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-[#0066FF] hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                    title={isSidebarCollapsed ? "Mở rộng Sidebar" : "Thu gọn Sidebar"}
                  >
                    {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                  </button>
                  {!isSidebarCollapsed && (
                    <span
                      onClick={toggleSidebar}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-900 ml-2.5 cursor-pointer truncate transition-colors select-none"
                    >
                      Thu gọn Menu
                    </span>
                  )}
                </div>

                {/* Categorized RBAC Navigation Groups (Starts with Overview) */}
                <div className="space-y-2">
                  {renderNavGroup(personalItems, '1. ĐỊNH DANH (IDENTITY)', 'Hồ sơ')}
                  {renderNavGroup(operationItems, '2. SỰ KIỆN DOANH NGHIỆP', 'Sự kiện')}
                  {renderNavGroup(adminItems, '3. MẠNG LƯỚI & CRM B2B', 'Giao thương')}
                  {renderNavGroup(pitchingItems, '4. QUẢN TRỊ HỆ THỐNG', 'Điều hành')}
                </div>
              </div>

              {/* Bottom Sidebar User Info / Status (Cố định ở đáy Sidebar) */}
              <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-2 flex items-center justify-between text-xs text-slate-500">
                {!isSidebarCollapsed ? (
                  <>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-9 h-9 flex items-center justify-center shrink-0">
                        <img
                          src={currentUserAvatar}
                          alt={currentUserName}
                          className="w-7 h-7 rounded-full object-cover border border-blue-500 bg-white"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUserName)}&backgroundColor=0066ff,00c2ff`;
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1 pr-1">
                        <p className="font-bold text-slate-900 text-xs truncate" suppressHydrationWarning>{currentUserName}</p>
                        <p className="text-[9.5px] text-blue-600 font-bold truncate uppercase" suppressHydrationWarning>{effectiveRole}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logoutUser();
                        router.push('/login');
                      }}
                      title="Đăng xuất"
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="w-full flex flex-col items-center gap-2">
                    <div title={`${currentUserName} (${effectiveRole})`} className="w-9 h-9 flex items-center justify-center relative shrink-0">
                      <img
                        src={currentUserAvatar}
                        alt={currentUserName}
                        className="w-7 h-7 rounded-full object-cover border border-blue-500 bg-white"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUserName)}&backgroundColor=0066ff,00c2ff`;
                        }}
                      />
                      <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logoutUser();
                        router.push('/login');
                      }}
                      title="Đăng xuất"
                      className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </aside>

            {/* MOBILE DRAWER NAVIGATION */}
            {isMobileMenuOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200">
                <div className="bg-white w-72 h-full p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
                  <div className="space-y-4 overflow-y-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <img
                        src="/one_connect_final_logo_orange.png?v=20260904_tagline"
                        alt="One Connect"
                        className="h-7 w-auto object-contain"
                      />
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Mobile Menu User Badge */}
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
                        <p className="text-[9.5px] font-bold text-blue-700 uppercase">{effectiveRole}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {renderNavGroup(personalItems, 'MODULE 1: DOANH NHÂN & B2B')}
                      {renderNavGroup(operationItems, 'MODULE 2: QUẢN LÝ EVENT')}
                      {renderNavGroup(adminItems, 'MODULE 3: QUẢN TRỊ HIỆP HỘI')}
                      {renderNavGroup(pitchingItems, 'DEMO HUB PROTOTYPE')}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[10px] font-semibold text-slate-700">PDPL 91/2025</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logoutUser();
                        router.push('/login');
                      }}
                      title="Đăng xuất"
                      className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MAIN CONTENT CONTAINER (Chừa lề chuẩn cho Fixed Header và Fixed Sidebar) */}
            <div className={`flex-1 flex flex-col min-w-0 min-h-screen w-full pt-14 transition-all duration-200 ease-in-out ${
              isSidebarCollapsed ? 'md:pl-14' : 'md:pl-60'
            }`}>
              <RealtimeConnectionModal />
              {/* Page Main Content - Fixed Unified Container Width across all routes */}
              <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto overflow-x-hidden">
                {children}
              </main>
            </div>

          </div>
        </div>
      </body>
    </html>
  );
}
