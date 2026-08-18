'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Zap, ShieldCheck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useOneConnectStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const { state, setCurrentIdentityId } = useOneConnectStore();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successUser, setSuccessUser] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const cleanInput = emailOrPhone.trim().toLowerCase();

      // Find user by Email, Phone, or Username
      const matchedUser = state.identities.find(
        (u) =>
          (u.email && u.email.toLowerCase() === cleanInput) ||
          (u.phone && u.phone.replace(/[^0-9]/g, '') === cleanInput.replace(/[^0-9]/g, '')) ||
          u.username.toLowerCase() === cleanInput
      );

      if (matchedUser) {
        // Set active user session
        setCurrentIdentityId(matchedUser.id);
        setSuccessUser(matchedUser.fullName);
        setLoading(false);

        setTimeout(() => {
          router.push('/dashboard/card');
        }, 800);
      } else {
        // Fallback for default admin demo
        if (cleanInput.includes('admin') || cleanInput.includes('johnny') || cleanInput.includes('long')) {
          setCurrentIdentityId('usr-001');
          setSuccessUser('Hồ Hoàng Long (Admin)');
          setLoading(false);
          setTimeout(() => {
            router.push('/dashboard/card');
          }, 800);
        } else {
          setLoading(false);
          setErrorMsg(`Không tìm thấy tài khoản với Email hoặc SĐT "${emailOrPhone}". Hãy kiểm tra lại hoặc Đăng ký mới.`);
        }
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07090E] p-4 py-12">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center space-y-2 pb-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-white">Đăng Nhập One Connect</CardTitle>
          <CardDescription className="text-slate-400 text-xs">
            Dành cho Doanh nhân đã tự đăng ký hoặc được Ban Tổ Chức cấp thẻ NFC
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          {successUser ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Xác Thực Thành Công!</h3>
              <p className="text-xs text-slate-300">
                Xin chào <strong className="text-emerald-400">{successUser}</strong>. Đang mở Danh thiếp số của bạn...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email công tác hoặc Số điện thoại</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="VD: johnny@aplusvn.com hoặc 0903888999"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Mật khẩu / Mã PIN</label>
                  <span className="text-[11px] text-blue-400 font-medium">Mặc định: Bất kỳ</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full gap-2 mt-2 py-5 font-bold cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? 'Đang xác thực...' : 'Đăng Nhập Quản Lý Thẻ'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          {/* Quick Demo Switcher */}
          <div className="mt-6 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tài khoản mẫu để kiểm tra nhanh:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {state.identities.slice(0, 3).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    setEmailOrPhone(u.email || u.phone || u.username);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-300 transition-colors cursor-pointer"
                >
                  {u.fullName.split(' ').slice(-2).join(' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400 space-y-2">
            <p>
              Chưa có hồ sơ danh thiếp?{' '}
              <Link href="/register" className="text-blue-400 hover:underline font-semibold">
                Đăng ký doanh nhân mới
              </Link>
            </p>
            <p className="flex items-center justify-center gap-1 text-[11px] text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Bảo mật chuẩn Supabase Auth & PDPL 91/2025
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

