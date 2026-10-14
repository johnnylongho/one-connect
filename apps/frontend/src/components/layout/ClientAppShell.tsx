'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useOneConnectStore } from '@/lib/store';
import { PublicHeader } from '@/components/shared/PublicHeader';
import { AdminSidebar, AdminHeader } from '@/components/admin';
import { RealtimeConnectionModal } from '@/components/realtime/connection-request-modal';

export function ClientAppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentIdentity, state, isHydrated } = useOneConnectStore();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Key shortcut '[' to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '[' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        setIsSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // TẦNG 1: BỀ NỔI PUBLISH / PORTAL CÔNG KHAI (Trang Chủ, ESG, Dịch Vụ, Bài Viết)
  const isPublicPortal =
    pathname === '/' ||
    pathname === '/intro' ||
    pathname === '/social-value' ||
    pathname === '/services' ||
    pathname?.startsWith('/services') ||
    pathname === '/posts' ||
    pathname?.startsWith('/posts');

  // Toàn bộ các trang công khai / độc lập không thuộc Tầng 2 Quản trị
  const isStandalonePage =
    isPublicPortal ||
    pathname === '/demo' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname === '/onboarding' ||
    pathname?.startsWith('/auth') ||
    pathname?.startsWith('/p/') ||
    pathname?.startsWith('/c/');

  useEffect(() => {
    if (!isHydrated) return;

    const cookieExists =
      typeof document !== 'undefined' &&
      (document.cookie.includes('one_connect_auth_session=') || document.cookie.includes('sb-access-token='));

    // BẢO VỆ TẦNG QUẢN TRỊ & ĐIỀU HÀNH: Chưa đăng nhập thì chuyển hướng về /login
    if (!state.currentIdentityId && !cookieExists && !isStandalonePage) {
      router.replace('/login');
    }
  }, [state.currentIdentityId, isStandalonePage, isHydrated, router]);

  // 1. Render standalone / public portal pages cleanly
  if (isStandalonePage) {
    return (
      <div className={`min-h-screen ${isPublicPortal ? 'bg-[#F8FAFD]' : 'bg-white'} text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden`}>
        {isPublicPortal && <PublicHeader />}
        {children}
      </div>
    );
  }

  // 2. Auth loading state
  const hasClientAuthCookie =
    typeof document !== 'undefined' &&
    (document.cookie.includes('one_connect_auth_session=') || document.cookie.includes('sb-access-token='));

  if (!isHydrated || (!state.currentIdentityId && !hasClientAuthCookie)) {
    return (
      <div className="min-h-screen bg-[#070A12] text-slate-100 font-sans antialiased flex flex-col items-center justify-center p-4">
        <div className="w-9 h-9 border-3 border-[#0066FF] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-400 font-mono">Đang kiểm tra quyền truy cập hệ thống...</p>
      </div>
    );
  }

  // 3. UNIFIED FULL-SCREEN FLUID LAYOUT (Xóa bỏ hoàn toàn khung xanh đen & bo góc)
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Sidebar chạm sát mép trái, trên và dưới */}
      <AdminSidebar
        collapsed={isSidebarCollapsed}
        setCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Container tràn toàn bộ không gian còn lại */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-slate-50">
        {/* Top Header chạm sát viền trên */}
        <AdminHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenNotifications={() => alert("Thông báo hệ thống: Đã kích hoạt 100% kết nối Supabase Cloud Singapore.")}
          onOpenProfile={() => alert(`Hồ sơ tài khoản: ${currentIdentity?.fullName || currentIdentity?.displayName || 'Thành viên One Connect Network'}`)}
        />

        <RealtimeConnectionModal />

        {/* Scrollable Main Content Container */}
        <main className="flex-1 h-full overflow-y-auto bg-slate-50 relative p-4 sm:p-6 lg:p-8 space-y-6">
          {children}

          {/* Quiet Footer */}
          <footer className="pt-8 pb-4 border-t border-slate-200/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">ONE CONNECT NETWORK © 2026</span>
              <span>·</span>
              <span>Tập đoàn Công nghệ số A+ (Aplusvn Media & Tech)</span>
              <span>·</span>
              <span>Nha Trang, Khánh Hòa</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-[11px]">
              <span>Trưởng dự án: Johnny Long Hồ</span>
              <span>·</span>
              <span>Tuân thủ PDPL 91/2025/QH15</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
