import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Layers,
  Users,
  Smartphone,
  BarChart3,
  FileText,
  Activity,
  ShieldCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quản Trị Hệ Thống & Hiệp Hội | One Connect Network',
  description: 'Trung tâm quản trị tổ chức, phân quyền hội viên, cấp phát thẻ NFC và giám sát chỉ số sự kiện thực tế.',
};

const ADMIN_SUB_NAV = [
  { href: '/admin/org', label: 'Tổng Quan Hiệp Hội', icon: Layers },
  { href: '/admin/org/members', label: 'Hội Viên & RBAC', icon: Users },
  { href: '/admin/nfc-cards', label: 'Cấp Phát Thẻ NFC', icon: Smartphone },
  { href: '/admin/reports', label: 'Báo Cáo & Đo Lường', icon: BarChart3 },
  { href: '/admin/articles', label: 'Tin Tức & CMS', icon: FileText },
  { href: '/admin/pilot-metrics', label: 'Chỉ Số Pilot Telemetry', icon: Activity, badge: 'REALTIME' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full space-y-6">
      {/* Top Admin Sub-navigation Header */}
      <nav
        aria-label="Admin Navigation"
        className="w-full bg-white border border-slate-200/90 rounded-2xl p-2 shadow-2xs overflow-x-auto"
      >
        <div className="flex items-center gap-1.5 min-w-max">
          {ADMIN_SUB_NAV.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-[#0066FF] hover:bg-blue-50/80 transition-all border border-transparent hover:border-blue-100 cursor-pointer active:scale-95"
              >
                <Icon className="w-4 h-4 text-slate-500" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9.5px] font-mono font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 tracking-wider">
                    {tab.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Admin Page Content */}
      <div>{children}</div>
    </div>
  );
}
