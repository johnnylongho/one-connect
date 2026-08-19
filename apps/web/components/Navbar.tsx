'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOneConnectStore } from '@/lib/store';
import { RoleType } from '@/lib/types';
import WorkspaceRoleSwitcher from '@/components/WorkspaceRoleSwitcher';
import {
  CreditCard,
  QrCode,
  Users,
  Calendar,
  Building2,
  Zap,
  ShieldCheck,
  BarChart3,
  UserCheck,
  ChevronDown,
  Sparkles,
  Smartphone,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { state, currentIdentity, setCurrentRole, setCurrentIdentityId, resetState } = useOneConnectStore();
  const [showRoleModal, setShowRoleModal] = useState(false);

  const rolesList: { role: RoleType; label: string; desc: string; icon: any }[] = [
    { role: 'SUPER_ADMIN', label: 'Quản trị viên Hệ thống (System Admin)', desc: 'Toàn quyền kiểm soát, xem Audit Log, Quản lý Thẻ NFC & Báo cáo Giao thương', icon: ShieldCheck },
    { role: 'ORG_ADMIN', label: 'Ban Quản trị Hội/CLB (Association Admin)', desc: 'Quản lý Hội viên, Tổ chức Sự kiện & Điều phối Kết nối', icon: Building2 },
    { role: 'EVENT_OPERATOR', label: 'Vận hành Trạm Check-in (Event Operator)', desc: 'Giao diện Điểm danh siêu tốc NFC/QR < 0.5s tại cửa sự kiện', icon: Zap },
    { role: 'MEMBER', label: 'Doanh nhân / Hội viên (Member)', desc: 'Quản lý Hồ sơ Số, Thẻ NFC cá nhân, Kết nối B2B & Lưu Ghi chú', icon: Users },
    { role: 'GUEST', label: 'Khách quan tâm / Guest Profile', desc: 'Trải nghiệm Quét QR / Thẻ NFC từ góc nhìn đối tác mới', icon: UserCheck },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-slate-200/80 mb-6 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/one_connect_final_logo_orange.png"
            alt="One Connect Logo"
            className="h-9 w-auto object-contain shrink-0 drop-shadow-xs group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-1.5 font-black text-lg tracking-tight text-slate-900 font-heading">
              ONE<span className="text-[#0066FF]">CONNECT</span>
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium -mt-0.5 hidden sm:block">
              Hệ Sinh Thái Danh Thiếp Số & Giao Thương B2B
            </p>
          </div>
        </Link>

        {/* Navigation Links (Light Executive Style) */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link
            href="/p/hoanglong"
            className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 text-[#0066FF] bg-blue-50/80 border border-blue-200/80 hover:bg-blue-100 shadow-2xs"
          >
            <CreditCard className="w-4 h-4 text-[#0066FF]" /> Profile Số
          </Link>

          <Link
            href="/dashboard/card"
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              pathname === '/dashboard/card'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-4 h-4" /> Quản Trị Thẻ
          </Link>

          <Link
            href="/dashboard/connections"
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              pathname.startsWith('/dashboard/connections')
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" /> Mạng Lưới B2B
          </Link>

          <Link
            href="/events"
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              pathname.startsWith('/events')
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" /> Sự Kiện
          </Link>

          {(state.currentRole === 'SUPER_ADMIN' || state.currentRole === 'ORG_ADMIN') && (
            <Link
              href="/admin/org"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                pathname.startsWith('/admin/org')
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-700 bg-purple-50/70 border border-purple-200/80 hover:bg-purple-100'
              }`}
            >
              <Building2 className="w-4 h-4" /> Quản Lý Hội/CLB
            </Link>
          )}

          {(state.currentRole === 'SUPER_ADMIN' || state.currentRole === 'EVENT_OPERATOR') && (
            <Link
              href="/operator/checkin"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                pathname.startsWith('/operator/checkin')
                  ? 'bg-[#FF6B00] text-white shadow-xs animate-pulse'
                  : 'text-[#FF6B00] bg-orange-50/80 border border-orange-200/80 hover:bg-orange-100'
              }`}
            >
              <Zap className="w-4 h-4" /> Trạm Soát Vé (&lt;0.5s)
            </Link>
          )}

          {state.currentRole === 'SUPER_ADMIN' && (
            <Link
              href="/admin/reports"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                pathname.startsWith('/admin/reports')
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 bg-emerald-50/70 border border-emerald-200/80 hover:bg-emerald-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Báo Cáo
            </Link>
          )}
        </nav>

        {/* Workspace & Role Switcher + Auth Options */}
        <div className="flex items-center gap-2.5">
          <WorkspaceRoleSwitcher />

          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Tài Khoản</span>
          </Link>
        </div>
      </div>

      {/* Role Switcher Modal Dropdown (Light Glass Theme) */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-end pt-20 pr-4 sm:pr-8 bg-slate-900/40 backdrop-blur-xs" onClick={() => setShowRoleModal(false)}>
          <div
            className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-3.5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2 font-heading">
                <Sparkles className="w-4 h-4 text-[#0066FF]" /> Chuyển Đổi Vai Trò Thử Nghiệm
              </h3>
              <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500">Chọn vai trò để trải nghiệm luồng thao tác tương ứng:</p>
              {rolesList.map(r => {
                const Icon = r.icon;
                const active = state.currentRole === r.role;
                return (
                  <button
                    key={r.role}
                    onClick={() => {
                      setCurrentRole(r.role);
                      setShowRoleModal(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                      active
                        ? 'bg-blue-50/90 border-[#0066FF] text-slate-900 shadow-xs'
                        : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mt-0.5 ${active ? 'bg-[#0066FF] text-white' : 'bg-slate-200 text-slate-600'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm flex items-center gap-2">
                        {r.label}
                        {active && <span className="text-[10px] px-1.5 py-0.5 bg-[#0066FF] text-white font-bold rounded-md">ĐANG CHỌN</span>}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">Đổi người dùng:</span>
              <div className="flex gap-1.5">
                {state.identities.map(id => (
                  <button
                    key={id.id}
                    onClick={() => {
                      setCurrentIdentityId(id.id);
                      setShowRoleModal(false);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[11.5px] font-bold border cursor-pointer ${
                      state.currentIdentityId === id.id
                        ? 'border-[#0066FF] text-[#0066FF] bg-blue-50'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {id.displayName?.split(' ')[0] || id.fullName.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-1 text-right">
              <button
                onClick={() => {
                  resetState();
                  setShowRoleModal(false);
                }}
                className="text-xs text-red-500 font-semibold hover:underline cursor-pointer"
              >
                Khôi phục Dữ liệu Ban đầu
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
