import React from 'react';
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
  ShieldCheck,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed
}) => {
  const mainNavigation = [
    { id: 'dashboard', label: 'Trung tâm Điều hành', icon: LayoutDashboard, path: '/admin' },
    { id: 'members', label: 'Quản lý Hội viên', icon: Users, path: '/admin/org/members' },
    { id: 'events', label: 'Quản lý Sự kiện MICE', icon: CalendarDays, path: '/admin/events' },
    { id: 'nfc-cards', label: 'Kho Thẻ NFC Vật lý', icon: CreditCard, path: '/admin/nfc-cards' },
  ];

  const operatorNavigation = [
    { id: 'checkin', label: 'Trạm Check-in <0.8s', icon: ScanLine, path: '/operator/checkin' },
    { id: 'attendees', label: 'Danh bạ Đại biểu', icon: Contact, path: '/operator/attendees' },
    { id: 'matching', label: 'AI Matchmaking 1:1', icon: GitCompare, path: '/matching' },
  ];

  const reportNavigation = [
    { id: 'reports', label: 'Báo cáo Đo lường', icon: BarChart3, path: '/admin/reports' },
    { id: 'telemetry', label: 'Telemetry Pilot TRL-7', icon: Cpu, path: '/admin/pilot-metrics' },
    { id: 'articles', label: 'CMS Tin tức & Báo chí', icon: FileText, path: '/admin/articles' },
    { id: 'settings', label: 'Cấu hình & Phân quyền', icon: Settings, path: '/settings' },
  ];

  return (
    <aside 
      className={`bg-white border-r border-slate-200/90 transition-all duration-300 ease-in-out flex flex-col justify-between shrink-0 select-none z-20 shadow-xs ${
        collapsed ? 'w-[72px]' : 'w-64 lg:w-72'
      }`}
    >
      {/* Top Logo Brand Zone with Minimize Button */}
      <div className={`border-b border-slate-100/90 transition-all ${
        collapsed ? 'p-3 flex flex-col items-center gap-2' : 'p-4 flex items-center justify-between gap-2'
      }`}>
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo mark */}
          <div 
            onClick={() => collapsed && setCollapsed(false)}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0 cursor-pointer hover:scale-105 transition-transform"
            title="ONE CONNECT NETWORK (TRL-7 Khánh Hòa)"
          >
            <CreditCard className="w-5 h-5" />
          </div>

          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-base tracking-tight text-slate-900 flex items-center gap-1.5 truncate">
                ONE CONNECT
              </span>
              <span className="text-[11px] font-medium text-slate-400 truncate">
                Network · B2B TRL-7
              </span>
            </div>
          )}
        </div>

        {/* Header Minimize / Expand Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0 flex items-center justify-center ${
            collapsed ? 'w-8 h-8' : 'p-1.5'
          }`}
          title={collapsed ? 'Mở rộng Sidebar (Phím [)' : 'Thu gọn Sidebar (Phím [)'}
          aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-blue-600" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-slate-500 hover:text-slate-800" />
          )}
        </button>
      </div>

      {/* Navigation Groups */}
      <div className={`flex-1 overflow-y-auto py-4 transition-all ${
        collapsed ? 'px-2 space-y-4' : 'px-3 space-y-6'
      }`}>
        {/* Section 1: Tổng quan */}
        <div>
          {!collapsed ? (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tổng Quan & Ban Quản Trị
            </div>
          ) : (
            <div className="w-8 h-px bg-slate-100 mx-auto my-1"></div>
          )}
          <nav className="space-y-1">
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`w-full flex items-center rounded-xl transition-all text-left group ${
                    collapsed
                      ? 'justify-center p-2.5'
                      : 'gap-3 px-3 py-2.5 text-xs font-medium'
                  } ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'
                  } ${collapsed && !isActive ? 'group-hover:scale-110' : ''}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-blue-200" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section 2: Vận hành thực địa (Operator Station) */}
        <div>
          {!collapsed ? (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Vận Hành Thực Địa (Operator)
            </div>
          ) : (
            <div className="w-8 h-px bg-slate-100 mx-auto my-1"></div>
          )}
          <nav className="space-y-1">
            {operatorNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`w-full flex items-center rounded-xl transition-all text-left group ${
                    collapsed
                      ? 'justify-center p-2.5'
                      : 'gap-3 px-3 py-2.5 text-xs font-medium'
                  } ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'
                  } ${collapsed && !isActive ? 'group-hover:scale-110' : ''}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-blue-200" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section 3: Báo cáo & Cài đặt */}
        <div>
          {!collapsed ? (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Dữ Liệu & Tuân Thủ
            </div>
          ) : (
            <div className="w-8 h-px bg-slate-100 mx-auto my-1"></div>
          )}
          <nav className="space-y-1">
            {reportNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`w-full flex items-center rounded-xl transition-all text-left group ${
                    collapsed
                      ? 'justify-center p-2.5'
                      : 'gap-3 px-3 py-2.5 text-xs font-medium'
                  } ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'
                  } ${collapsed && !isActive ? 'group-hover:scale-110' : ''}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-blue-200" />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Legal Trust & Account Action with Dedicated Minimize Control */}
      <div className={`border-t border-slate-100 transition-all ${
        collapsed ? 'p-2 space-y-1.5 flex flex-col items-center' : 'p-3 space-y-1.5'
      }`}>
        {!collapsed && (
          <div className="mb-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="text-[11px] leading-tight text-slate-500 truncate">
              <span className="font-semibold text-slate-700 block">PDPL 91/2025/QH15</span>
              2-Way Consent Shield
            </div>
          </div>
        )}

        {/* Dedicated Minimize / Collapse Button at bottom */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50/80 border border-transparent hover:border-blue-200/60 transition-all group ${
            collapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
          }`}
          title={collapsed ? 'Mở rộng Sidebar (Phím [)' : 'Thu gọn Sidebar (Phím [)'}
        >
          <div className="flex items-center gap-3 truncate">
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-slate-500 group-hover:text-blue-600 shrink-0" />
            )}
            {!collapsed && <span className="truncate">Thu gọn Menu</span>}
          </div>
          {!collapsed && (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-700 rounded transition-colors">
              [
            </kbd>
          )}
        </button>

        <button
          onClick={() => alert("Hỗ trợ kỹ thuật: contact.johnnylongho@gmail.com | Hotline: 0903.888.999")}
          className={`w-full flex items-center rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
            collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'
          }`}
          title="Hỗ trợ Kỹ thuật: contact.johnnylongho@gmail.com | 0903.888.999"
        >
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
          {!collapsed && <span>Hỗ trợ Kỹ thuật</span>}
        </button>

        <button
          onClick={() => alert("Đang ở phiên làm việc quản trị viên: Hồ Hoàng Long (Johnny Long Hồ)")}
          className={`w-full flex items-center rounded-xl text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors ${
            collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'
          }`}
          title="Đăng xuất Quản trị: Hồ Hoàng Long"
        >
          <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};
