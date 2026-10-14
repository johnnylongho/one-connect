'use client';

import React from 'react';
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

  return (
    <div className="space-y-4">
      {/* Admin Sub-navigation Header */}
      <nav
        aria-label="Admin Navigation"
        className="w-full bg-white border border-slate-200/90 rounded-2xl p-1.5 shadow-2xs overflow-x-auto"
      >
        <div className="flex items-center gap-1.5 min-w-max">
          {ADMIN_SUB_NAV.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              tab.href === '/admin'
                ? pathname === '/admin'
                : pathname === tab.href || pathname?.startsWith(tab.href + '/');
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

      {/* Admin Body Content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
