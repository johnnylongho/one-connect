'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOneConnectStore } from '@/lib/store';
import { ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function RootGatewayPage() {
  const router = useRouter();
  const { state, currentIdentity } = useOneConnectStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Slight timeout allows hydration of localStorage store
    const timer = setTimeout(() => {
      if (state.currentIdentityId && currentIdentity) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [state.currentIdentityId, currentIdentity, router]);

  return (
    <div className="min-h-screen bg-[#040814] flex flex-col items-center justify-center text-slate-100 px-4 select-none">
      <div className="flex flex-col items-center text-center space-y-5 max-w-sm animate-in fade-in zoom-in duration-300">
        {/* Animated Brand Vector Emblem */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 p-0.5 shadow-xl shadow-blue-500/30 flex items-center justify-center">
          <div className="w-full h-full bg-[#070e22] rounded-[14px] flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="14" stroke="url(#root_accent)" strokeWidth="2.8" strokeDasharray="5 3" />
              <circle cx="20" cy="20" r="6" fill="#00C2FF" />
              <defs>
                <linearGradient id="root_accent" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0066FF" />
                  <stop offset="1" stopColor="#00C2FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-base sm:text-lg font-black tracking-wider uppercase text-white font-heading">
            ONE CONNECT NETWORK
          </h1>
          <p className="text-xs text-slate-400">
            Hạ tầng Định danh & Kết nối Doanh nghiệp B2B
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-300 text-xs font-semibold">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
          <span>Đang điều hướng phiên làm việc...</span>
        </div>

        <div className="pt-2 text-center text-xs text-slate-500 space-y-2">
          <div>
            Nếu trang không tự chuyển hướng, bấm vào{' '}
            <Link href="/login" className="text-cyan-400 hover:underline font-bold">
              Đăng nhập
            </Link>{' '}
            hoặc{' '}
            <Link href="/intro" className="text-cyan-400 hover:underline font-bold">
              Tìm hiểu sản phẩm
            </Link>
          </div>
          <div className="text-[11px] text-slate-600 flex items-center justify-center gap-1.5 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Mã hóa bảo mật phiên kết nối theo tiêu chuẩn PDPL 91</span>
          </div>
        </div>
      </div>
    </div>
  );
}
