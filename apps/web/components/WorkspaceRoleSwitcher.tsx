'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Building2,
  Zap,
  User,
  ChevronDown,
  Check,
  Sparkles,
} from 'lucide-react';
import { useOneConnectStore } from '@/lib/store';
import { RoleType } from '@/lib/types';

export default function WorkspaceRoleSwitcher() {
  const router = useRouter();
  const { state, currentIdentity, switchWorkspace } = useOneConnectStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const WORKSPACES = [
    {
      role: 'SUPER_ADMIN' as RoleType,
      label: 'Quản Trị Nền Tảng',
      sublabel: 'One Connect Platform Root',
      icon: Shield,
      badge: 'SUPER ADMIN',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      activeColor: 'border-rose-500 bg-rose-50/50',
      href: '/admin/org',
    },
    {
      role: 'ORG_ADMIN' as RoleType,
      label: 'Hội Doanh Nhân Trẻ (YBA)',
      sublabel: 'Không gian Tổ chức B2B',
      icon: Building2,
      badge: 'ORG ADMIN',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      activeColor: 'border-purple-500 bg-purple-50/50',
      href: '/admin/org/members',
    },
    {
      role: 'EVENT_OPERATOR' as RoleType,
      label: 'Trạm Soát Vé Tiếp Đón',
      sublabel: 'Điều hành Cửa Check-in Realtime',
      icon: Zap,
      badge: 'OPERATOR',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      activeColor: 'border-amber-500 bg-amber-50/50',
      href: '/operator/checkin',
    },
    {
      role: 'MEMBER' as RoleType,
      label: currentIdentity?.fullName || 'Hồ Hoàng Long',
      sublabel: `@${currentIdentity?.username || 'johnnylongho'} • Danh thiếp số`,
      icon: User,
      badge: 'MEMBER VIP',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      activeColor: 'border-blue-500 bg-blue-50/50',
      href: '/dashboard/card',
    },
  ];

  const currentWorkspace =
    WORKSPACES.find((w) => w.role === state.currentRole) || WORKSPACES[3]!;

  const handleSelectWorkspace = (ws: typeof WORKSPACES[0]) => {
    switchWorkspace(ws.role);
    setIsOpen(false);
    router.push(ws.href);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-all text-xs font-bold shadow-2xs cursor-pointer active:scale-98"
      >
        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
          <currentWorkspace.icon className="w-3.5 h-3.5" />
        </div>

        <div className="text-left hidden sm:block">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-extrabold leading-none">
            Không Gian
          </p>
          <p className="text-xs font-bold text-slate-900 truncate max-w-[130px] mt-0.5 leading-none">
            {currentWorkspace.label}
          </p>
        </div>

        <span
          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md border hidden md:inline-block ${currentWorkspace.badgeColor}`}
        >
          {currentWorkspace.badge}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-76 sm:w-84 rounded-3xl bg-white border border-slate-200 shadow-2xl z-50 p-2.5 space-y-1.5 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Chuyển Đổi Không Gian & Vai Trò
              </span>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                RBAC v2
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Chọn môi trường làm việc phù hợp với thẩm quyền của bạn
            </p>
          </div>

          <div className="space-y-1">
            {WORKSPACES.map((ws) => {
              const Icon = ws.icon;
              const isActive = state.currentRole === ws.role;

              return (
                <button
                  key={ws.role}
                  onClick={() => handleSelectWorkspace(ws)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl border transition-all text-left cursor-pointer ${
                    isActive
                      ? `${ws.activeColor} shadow-2xs`
                      : 'border-transparent hover:bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                        isActive
                          ? 'bg-white shadow-xs border-slate-200 text-blue-600'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {ws.label}
                        </span>
                        <span
                          className={`text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded border ${ws.badgeColor}`}
                        >
                          {ws.badge}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 truncate">
                        {ws.sublabel}
                      </p>
                    </div>
                  </div>

                  {isActive && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Info Box */}
          <div className="p-2.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-[11px] text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Đang kết nối: <strong>{currentIdentity?.fullName}</strong></span>
            </div>
            <span className="font-mono text-[10px] text-blue-700 font-bold">
              ID: {currentIdentity?.id}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
