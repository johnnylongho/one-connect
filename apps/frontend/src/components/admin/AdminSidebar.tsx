'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  CreditCard, 
  ScanLine, 
  Contact, 
  GitCompare, 
  BarChart3, 
  Cpu, 
  FileText, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Target
} from 'lucide-react';
import { useOneConnectStore } from '@/lib/store';

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  setCollapsed
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentIdentity, logoutUser } = useOneConnectStore();

  const mainNavigation = [
    { id: 'dashboard', label: 'Trung tâm Điều hành', icon: LayoutDashboard, path: '/admin' },
    { id: 'card', label: 'Danh thiếp 3D & NFC', icon: CreditCard, path: '/dashboard/card' },
    { id: 'members', label: 'Quản lý Hội viên', icon: Users, path: '/admin/org/members' },
    { id: 'events', label: 'Quản lý Sự kiện MICE', icon: CalendarDays, path: '/admin/events' },
    { id: 'nfc-cards', label: 'Kho Thẻ NFC Vật lý', icon: CreditCard, path: '/admin/nfc-cards' },
  ];

  const operatorNavigation = [
    { id: 'checkin', label: 'Trạm Check-in <0.8s', icon: ScanLine, path: '/operator/checkin' },
    { id: 'attendees', label: 'Danh bạ Đại biểu', icon: Contact, path: '/operator/attendees' },
    { id: 'matching', label: 'AI Matchmaking 1:1', icon: GitCompare, path: '/matching' },
    { id: 'leads', label: 'Đo lường Leads B2B', icon: Target, path: '/dashboard/leads' },
    { id: 'connections', label: 'Sổ tay Quan hệ & CRM', icon: Users, path: '/dashboard/connections' },
  ];

  const reportNavigation = [
    { id: 'reports', label: 'Báo cáo Đo lường', icon: BarChart3, path: '/admin/reports' },
    { id: 'telemetry', label: 'Telemetry Pilot TRL-7', icon: Cpu, path: '/admin/pilot-metrics' },
    { id: 'articles', label: 'CMS Tin tức & Báo chí', icon: FileText, path: '/admin/articles' },
    { id: 'settings', label: 'Cấu hình & Phân quyền', icon: Settings, path: '/admin/settings' },
  ];

  const isLinkActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin' || pathname === '/admin/';
    }
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  // Render a single nav item with FIXED ICON AXIS (zero pixel horizontal shift on collapse)
  const renderNavItem = (item: { id: string; label: string; icon: React.ElementType; path: string }) => {
    const Icon = item.icon;
    const isActive = isLinkActive(item.path);

    return (
      <div key={item.id} className="relative group">
        <Link
          href={item.path}
          title={collapsed ? item.label : undefined}
          className={`w-full h-10 px-2 rounded-xl transition-all flex items-center text-left ${
            isActive
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90'
          }`}
        >
          {/* Fixed Icon Anchor: width & height always 32px at exact same coordinate */}
          <div className="w-8 h-8 flex items-center justify-center shrink-0 rounded-lg">
            <Icon className={`w-4 h-4 transition-transform ${
              isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'
            }`} />
          </div>

          {/* Expanded Label Text */}
          {!collapsed && (
            <span className="ml-2.5 text-xs font-medium truncate flex-1 min-w-0 animate-in fade-in-50 duration-150">
              {item.label}
            </span>
          )}

          {!collapsed && isActive && (
            <ChevronRight className="w-3.5 h-3.5 ml-auto text-blue-200 shrink-0" />
          )}
        </Link>

        {/* Collapsed Tooltip: appears fixed right next to the icon */}
        {collapsed && (
          <div className="fixed left-[76px] top-auto z-50 pointer-events-none hidden group-hover:flex items-center px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap animate-in fade-in-50 duration-100">
            {item.label}
            <div className="absolute -left-1 w-2 h-2 bg-slate-900 rotate-45" />
          </div>
        )}
      </div>
    );
  };

  return (
    <aside 
      className={`relative bg-white border-r border-slate-200/90 transition-all duration-300 ease-in-out flex flex-col justify-between shrink-0 select-none z-20 shadow-2xs h-full ${
        collapsed ? 'w-[72px]' : 'w-64 lg:w-72'
      }`}
    >
      {/* 1. TOP HEADER: FIXED TOP-LEFT TOGGLE BUTTON & CENTERED BALANCED LOGO */}
      <div className="h-16 px-3 border-b border-slate-100/90 flex items-center justify-between shrink-0">
        {/* Fixed Top-Left Collapse Button (Icon Only - No Text Annotation) */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="w-8 h-8 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          title={collapsed ? "Mở rộng Sidebar (Phím [)" : "Thu gọn Sidebar (Phím [)"}
          aria-label="Toggle Sidebar"
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-blue-600" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Logo at Center (Balanced) when expanded */}
        {!collapsed && (
          <div className="flex-1 flex items-center justify-center px-2 overflow-hidden">
            <Link href="/admin" className="flex items-center justify-center group" title="ONE CONNECT">
              <img
                src="/one_connect_logo_transparent.png"
                alt="ONE CONNECT"
                className="h-7 sm:h-8 w-auto object-contain max-w-[155px] group-hover:scale-105 transition-transform"
              />
            </Link>
          </div>
        )}

        {/* Right Symmetry Spacer when expanded */}
        {!collapsed && (
          <div className="w-8 h-8 shrink-0 pointer-events-none" aria-hidden="true" />
        )}
      </div>

      {/* 2. NAVIGATION GROUPS (Fixed Icon Axis) */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 transition-all scrollbar-thin">
        {/* Section 1: Tổng quan */}
        <div>
          {!collapsed ? (
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tổng Quan & Ban Quản Trị
            </div>
          ) : (
            <div className="w-8 h-px bg-slate-200/80 mx-auto my-1.5" />
          )}
          <nav className="space-y-1">
            {mainNavigation.map(renderNavItem)}
          </nav>
        </div>

        {/* Section 2: Vận hành thực địa (Operator Station) */}
        <div>
          {!collapsed ? (
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Vận Hành Thực Địa (Operator)
            </div>
          ) : (
            <div className="w-8 h-px bg-slate-200/80 mx-auto my-1.5" />
          )}
          <nav className="space-y-1">
            {operatorNavigation.map(renderNavItem)}
          </nav>
        </div>

        {/* Section 3: Báo cáo & Cài đặt */}
        <div>
          {!collapsed ? (
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Dữ Liệu & Tuân Thủ
            </div>
          ) : (
            <div className="w-8 h-px bg-slate-200/80 mx-auto my-1.5" />
          )}
          <nav className="space-y-1">
            {reportNavigation.map(renderNavItem)}
          </nav>
        </div>
      </div>

      {/* 3. BOTTOM ACCOUNT & SUPPORT ZONE (Chỉ để icon, không chú thích rườm rà) */}
      <div className="border-t border-slate-100/90 p-3 space-y-1 shrink-0">
        {/* Support */}
        <div className="relative group">
          <a
            href="mailto:contact.johnnylongho@gmail.com?subject=One%20Connect%20Admin%20Support"
            className="w-full h-10 px-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center text-left"
            title={collapsed ? "Hỗ trợ Kỹ thuật: contact.johnnylongho@gmail.com" : undefined}
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0 text-slate-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            {!collapsed && <span className="ml-2.5 truncate">Hỗ trợ Kỹ thuật</span>}
          </a>
          {collapsed && (
            <div className="fixed left-[76px] top-auto z-50 pointer-events-none hidden group-hover:flex items-center px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap animate-in fade-in-50 duration-100">
              Hỗ trợ Kỹ thuật
              <div className="absolute -left-1 w-2 h-2 bg-slate-900 rotate-45" />
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="relative group">
          <button
            onClick={handleLogout}
            className="w-full h-10 px-2 rounded-xl text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer flex items-center text-left"
            title={collapsed ? `Đăng xuất: ${currentIdentity?.fullName || 'Quản trị viên'}` : undefined}
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0 text-rose-500">
              <LogOut className="w-4 h-4" />
            </div>
            {!collapsed && <span className="ml-2.5 truncate">Đăng xuất</span>}
          </button>
          {collapsed && (
            <div className="fixed left-[76px] top-auto z-50 pointer-events-none hidden group-hover:flex items-center px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap animate-in fade-in-50 duration-100">
              Đăng xuất
              <div className="absolute -left-1 w-2 h-2 bg-slate-900 rotate-45" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
