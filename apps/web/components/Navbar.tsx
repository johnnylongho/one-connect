'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOneConnectStore } from '@/lib/store';
import { RoleType } from '@/lib/types';
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
  Smartphone
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { state, currentIdentity, setCurrentRole, setCurrentIdentityId, resetState } = useOneConnectStore();
  const [showRoleModal, setShowRoleModal] = useState(false);

  const rolesList: { role: RoleType; label: string; desc: string; icon: any }[] = [
    { role: 'SUPER_ADMIN', label: 'Quản trị viên Hệ thống (System Admin)', desc: 'Toàn quyền kiểm soát, xem Audit Log, Quản lý Thẻ NFC & PDPL Reports', icon: ShieldCheck },
    { role: 'ORG_ADMIN', label: 'Ban Quản trị Hội/CLB (Association Admin)', desc: 'Quản lý Hội viên, Tổ chức Sự kiện & Báo cáo Giao thương', icon: Building2 },
    { role: 'EVENT_OPERATOR', label: 'Vận hành Trạm Check-in (Event Operator)', desc: 'Giao diện Điểm danh siêu tốc NFC/QR < 1 giây tại cửa sự kiện', icon: Zap },
    { role: 'MEMBER', label: 'Doanh nhân / Hội viên (Member)', desc: 'Quản lý Hồ sơ Số, Thẻ NFC cá nhân, Kết nối Consent & Lưu Ghi chú', icon: Users },
    { role: 'GUEST', label: 'Khách quan tâm / Guest Profile', desc: 'Trải nghiệm Quét QR / Thẻ NFC từ góc nhìn người dùng mới', icon: UserCheck },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#07090e]/85 border-b border-white/10 mb-6">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-black font-extrabold text-lg shadow-[0_0_15px_rgba(0,229,255,0.4)] group-hover:scale-105 transition-transform">
            1C
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-lg tracking-tight text-white font-['Outfit']">
              ONE CONNECT <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">MVP v1.0</span>
            </div>
            <p className="text-[10px] text-gray-400 -mt-1 hidden sm:block">Pre-CRM & Relationship Layer Ecosystem</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/dashboard/card"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              pathname === '/dashboard/card' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Thẻ Số Cá Nhân
          </Link>
          <Link
            href="/dashboard/connections"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              pathname.startsWith('/dashboard/connections') ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" /> Mạng Lưới (Consent)
          </Link>
          <Link
            href="/events"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              pathname.startsWith('/events') ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" /> Sự Kiện
          </Link>

          {(state.currentRole === 'SUPER_ADMIN' || state.currentRole === 'ORG_ADMIN') && (
            <Link
              href="/admin/org"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname.startsWith('/admin/org') ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 className="w-4 h-4" /> Quản Lý Hội/CLB
            </Link>
          )}

          {(state.currentRole === 'SUPER_ADMIN' || state.currentRole === 'EVENT_OPERATOR') && (
            <Link
              href="/operator/checkin"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname.startsWith('/operator/checkin') ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse' : 'text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" /> Trạm Check-in (&lt;1s)
            </Link>
          )}

          {state.currentRole === 'SUPER_ADMIN' && (
            <Link
              href="/admin/reports"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname.startsWith('/admin/reports') ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Báo Cáo PDPL
            </Link>
          )}
        </nav>

        {/* User Persona & Role Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRoleModal(!showRoleModal)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all text-xs"
          >
            <img
              src={currentIdentity?.avatarUrl}
              alt={currentIdentity?.fullName}
              className="w-7 h-7 rounded-full object-cover border border-cyan-400/50"
            />
            <div className="hidden sm:block">
              <p className="font-semibold text-white leading-tight flex items-center gap-1">
                {currentIdentity?.displayName || currentIdentity?.fullName}
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </p>
              <p className="text-[10px] text-cyan-400 font-mono">
                Vai trò: {state.currentRole}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Role Switcher Modal Dropdown */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-end pt-20 pr-4 sm:pr-8 bg-black/60 backdrop-blur-sm" onClick={() => setShowRoleModal(false)}>
          <div
            className="w-full max-w-md bg-[#0f172a] border border-cyan-500/30 rounded-2xl p-5 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Chuyển Đổi Vai Trò & Persona Thử Nghiệm
              </h3>
              <button onClick={() => setShowRoleModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-400">Chọn vai trò để trải nghiệm luồng thao tác tương ứng:</p>
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
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      active
                        ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mt-0.5 ${active ? 'bg-cyan-500 text-black' : 'bg-white/10 text-gray-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm flex items-center gap-2">
                        {r.label}
                        {active && <span className="text-[10px] px-1.5 py-0.5 bg-cyan-500 text-black font-bold rounded">ĐANG CHỌN</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{r.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-white/10 pt-3 flex items-center justify-between text-xs text-gray-400">
              <span>Đổi người dùng thử nghiệm:</span>
              <div className="flex gap-2">
                {state.identities.map(id => (
                  <button
                    key={id.id}
                    onClick={() => {
                      setCurrentIdentityId(id.id);
                      setShowRoleModal(false);
                    }}
                    className={`px-2 py-1 rounded text-[11px] font-medium border ${
                      state.currentIdentityId === id.id
                        ? 'border-cyan-400 text-cyan-300 bg-cyan-500/20'
                        : 'border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {id.displayName?.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => {
                  resetState();
                  setShowRoleModal(false);
                }}
                className="text-xs text-red-400 hover:underline"
              >
                Khôi phục Dữ liệu Thử nghiệm Ban đầu
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
