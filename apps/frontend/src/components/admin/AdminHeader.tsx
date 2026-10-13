'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  LayoutGrid, 
  Moon, 
  Sun, 
  Globe, 
  Tablet,
  Monitor
} from 'lucide-react';
import { useOneConnectStore } from '@/lib/store';

interface AdminHeaderProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  isTabletView?: boolean;
  setIsTabletView?: (val: boolean) => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  onOpenQrScanner?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  searchQuery = '',
  setSearchQuery,
  isTabletView = false,
  setIsTabletView,
  onOpenNotifications,
  onOpenProfile,
  onOpenQrScanner,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeLang, setActiveLang] = useState<'VI' | 'EN'>('VI');
  const { currentIdentity } = useOneConnectStore();

  const currentUserName = currentIdentity?.displayName || currentIdentity?.fullName || 'Hồ Hoàng Long (Johnny)';
  const currentUserCompany = currentIdentity?.title ? `${currentIdentity.title} · Aplusvn` : 'Tập đoàn Công nghệ số A+';
  const userInitials = currentUserName
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || 'JL';

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 z-10 w-full shadow-2xs">
      {/* Left/Center: Search System Bar */}
      <div className="flex-1 max-w-2xl relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            placeholder="Tìm kiếm đại biểu, mã UID NFC, doanh nghiệp, hội nghị MICE..."
            className="w-full pl-10 pr-20 py-2 bg-slate-50 border border-slate-200/80 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
          />
          <div className="absolute right-3 flex items-center gap-1 pointer-events-none">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/60 rounded">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Action Icons & User Account */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Tablet Mode Toggle for iPad Receptionists */}
        {setIsTabletView && (
          <button
            onClick={() => setIsTabletView(!isTabletView)}
            title={isTabletView ? "Chuyển sang chế độ Màn hình Desktop" : "Mô phỏng Giao diện Tablet (iPad Lễ tân MICE)"}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              isTabletView 
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/60'
            }`}
          >
            {isTabletView ? (
              <>
                <Tablet className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden md:inline text-[11px]">iPad Mode (Bật)</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline text-[11px]">Tablet Simulator</span>
              </>
            )}
          </button>
        )}

        {/* Pilot Telemetry Status Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>TRL-7 Live (Singapore Supabase)</span>
        </div>

        {/* QR Code Scanner Quick Trigger */}
        {onOpenQrScanner && (
          <button
            onClick={onOpenQrScanner}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80 transition-colors shadow-2xs cursor-pointer"
            title="Mở Camera Quét Mã QR vCard 3.0"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden md:inline">Quét QR</span>
          </button>
        )}

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            onClick={onOpenNotifications}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors relative cursor-pointer"
            title="Thông báo hệ thống"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
          </button>
        </div>

        {/* App Launcher / Module Grid */}
        <button
          onClick={() => alert("Phân hệ Module: 1. Thẻ 3D | 2. Trạm Check-in | 3. Quản trị Hiệp hội | 4. AI Matchmaker")}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Chuyển phân hệ ứng dụng"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title={isDarkMode ? "Chuyển Chế độ Sáng" : "Chuyển Chế độ Tối"}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Language Indicator */}
        <button
          onClick={() => setActiveLang(activeLang === 'VI' ? 'EN' : 'VI')}
          className="flex items-center gap-1 p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors text-xs font-semibold cursor-pointer"
          title="Thay đổi ngôn ngữ (VI / EN)"
        >
          <Globe className="w-4 h-4 text-slate-400" />
          <span className="text-[11px] font-mono">{activeLang}</span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 mx-0.5" />

        {/* User Profile Avatar Lockup */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-xl hover:bg-slate-100 transition-colors text-left group cursor-pointer"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white shadow-xs">
              {userInitials}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-xs font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors truncate max-w-[130px]">
              {currentUserName}
            </span>
            <span className="text-[10px] text-slate-500 leading-tight truncate max-w-[130px]">
              {currentUserCompany}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
