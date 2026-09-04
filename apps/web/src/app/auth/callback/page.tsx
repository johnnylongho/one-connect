'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useOneConnectStore } from '@/lib/store';
import { CheckCircle2, AlertCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerIdentity, setCurrentIdentityId, setCurrentRole, state } = useOneConnectStore();

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'provider_disabled'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [syncedUser, setSyncedUser] = useState<string | null>(null);

  useEffect(() => {
    // 1. Kiểm tra tham số lỗi từ URL (nếu có)
    const errorParam = searchParams.get('error');
    const errorDesc = searchParams.get('error_description');

    if (errorParam || errorDesc) {
      if (errorDesc?.includes('not enabled') || errorParam === 'unsupported_provider') {
        setStatus('provider_disabled');
        setErrorMessage(errorDesc || 'Nhà cung cấp xác thực chưa được bật trong hệ thống.');
        return;
      }
      setStatus('error');
      setErrorMessage(errorDesc || errorParam || 'Xác thực không thành công.');
      return;
    }

    // 1.1 Kiểm tra callback từ Zalo OAuth
    const provider = searchParams.get('provider');
    if (provider === 'zalo') {
      const zaloName = searchParams.get('name') || 'Hội viên Zalo';
      const zaloId = searchParams.get('id') || `usr_zalo_${Date.now()}`;
      const zaloUser = searchParams.get('user') || `zalo_${Date.now().toString().slice(-6)}`;
      const zaloAvatar = searchParams.get('avatar') || '';

      processUserSession({
        id: zaloId,
        email: `${zaloUser}@oneconnect.id.vn`,
        user_metadata: {
          full_name: zaloName,
          name: zaloName,
          user_name: zaloUser,
          avatar_url: zaloAvatar,
        },
      });
      return;
    }

    // 2. Lắng nghe và xử lý session từ Supabase Auth
    const handleAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.warn('Session error:', sessionError);
          setStatus('error');
          setErrorMessage(sessionError.message);
          return;
        }

        if (session?.user) {
          await processUserSession(session.user);
          return;
        }

        // Lắng nghe onAuthStateChange nếu session chưa sẵn sàng ngay lập tức (implicit hash flow)
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            await processUserSession(session.user);
          }
        });

        // Timeout dự phòng sau 5s nếu không có session
        const timer = setTimeout(() => {
          if (status === 'loading') {
            setStatus('error');
            setErrorMessage('Phiên đăng nhập Google đã hết hạn hoặc không tìm thấy dữ liệu.');
          }
        }, 5000);

        return () => {
          authListener?.subscription.unsubscribe();
          clearTimeout(timer);
        };
      } catch (err: any) {
        console.error('Callback error:', err);
        setStatus('error');
        setErrorMessage(err?.message || 'Lỗi xử lý xác thực');
      }
    };

    handleAuth();
  }, [searchParams]);

  // Xử lý thông tin người dùng Google và đồng bộ vào Store & Database
  const processUserSession = async (user: any) => {
    const email = user.email || '';
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0];
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
    const baseSlug = (user.user_metadata?.user_name || email.split('@')[0])
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    const isJohnny = email.toLowerCase() === 'contact.johnnylongho@gmail.com' || baseSlug === 'johnnylongho';
    const role = isJohnny ? 'SUPER_ADMIN' : 'MEMBER';

    // 1. Kiểm tra tài khoản đã tồn tại trong local store chưa
    let existing = isJohnny 
      ? state.identities.find(i => i.id === 'id-001' || i.id === '11111111-1111-1111-1111-111111111111' || i.username === 'johnnylongho')
      : state.identities.find(
          (i) => (i.email && i.email.toLowerCase() === email.toLowerCase()) || 
                 (i.username && i.username.toLowerCase() === baseSlug)
        );

    let targetId = isJohnny ? 'id-001' : existing?.id;

    if (!existing && !isJohnny) {
      // Đăng ký mới vào Store
      const { identity } = registerIdentity({
        fullName: fullName,
        username: baseSlug,
        title: 'Hội Viên Doanh Nhân',
        businessName: 'Doanh Nghiệp Hội Viên',
        phone: user.phone || '',
        email: email,
        password: `google-oauth-${Date.now()}`,
        role: role,
      });

      targetId = identity.id;

      // Đồng bộ ngầm lên Supabase Cloud Database qua API
      fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: targetId,
          username: baseSlug,
          email: email,
          fullName: fullName,
          cardUid: `NFC-GOOGLE-${Date.now().toString().slice(-4)}`,
        }),
      }).catch((e) => console.warn('Background sync error:', e));
    }

    if (targetId) {
      setCurrentIdentityId(targetId);
      setCurrentRole(role);

      // Lưu tức thì vào localStorage để các trang tiếp theo đọc được ngay
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('one_connect_app_state_v2');
          const parsed = raw ? JSON.parse(raw) : { ...state };
          parsed.currentIdentityId = targetId;
          parsed.currentRole = role;
          localStorage.setItem('one_connect_app_state_v2', JSON.stringify(parsed));
        } catch (e) {}
        document.cookie = `one_connect_auth_session=${targetId}; path=/; max-age=2592000; SameSite=Lax`;
      }
    }

    setSyncedUser(isJohnny ? 'Hồ Hoàng Long (Johnny Long Hồ)' : fullName);
    setStatus('success');

    setTimeout(() => {
      router.push('/dashboard/card');
    }, 1200);
  };

  // Tính năng thử nghiệm giả lập tài khoản Google Mail khi chưa gắn Client Secret Supabase
  const handleQuickDemoGoogleLogin = (demoEmail: string, demoName: string, isSuper: boolean = false) => {
    setStatus('loading');
    setTimeout(() => {
      processUserSession({
        id: isSuper ? '11111111-1111-1111-1111-111111111111' : `google-test-${Date.now()}`,
        email: demoEmail,
        user_metadata: {
          full_name: demoName,
          name: demoName,
          avatar_url: isSuper ? '/avatar-johnny-long.jpg' : `https://ui-avatars.com/api/?name=${encodeURIComponent(demoName)}&background=0284c7&color=fff&bold=true`,
        },
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-40 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6 z-10">
        
        {status === 'loading' && (
          <div className="space-y-4 py-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-[#00C2FF] flex items-center justify-center mx-auto border border-blue-500/30">
              <span className="w-7 h-7 border-3 border-[#00C2FF] border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">Đang Xác Thực Google Mail...</h2>
              <p className="text-xs text-slate-400 mt-1">
                Hệ thống đang kết nối dữ liệu tài khoản và phân quyền người dùng.
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 py-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-heading">Đăng Nhập Thành Công!</h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Chào mừng <strong className="text-emerald-400">{syncedUser}</strong> đã kết nối qua Google Mail. Đang chuyển hướng vào Dashboard...
              </p>
            </div>
            <div className="pt-2">
              <Button
                onClick={() => router.push('/dashboard/card')}
                className="w-full bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Vào Dashboard Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {status === 'provider_disabled' && (
          <div className="space-y-4 text-left py-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h2 className="text-base font-bold text-white font-heading">Cấu Hình Google OAuth Cần Thiết</h2>
              <p className="text-xs text-slate-400 mt-1">
                Dự án Supabase hiện chưa bật <strong>Google Provider</strong> trong Supabase Dashboard.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1.5 leading-relaxed">
              <p className="font-bold text-slate-300">Hướng dẫn kích hoạt Google thật:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Vào Supabase Dashboard: <code>Authentication &gt; Providers &gt; Google</code></li>
                <li>Bật switch <strong>Enable Google</strong></li>
                <li>Nhập <code>Client ID</code> và <code>Client Secret</code> từ Google Cloud Console</li>
              </ol>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-[11px] text-center text-slate-400 font-semibold">
                Hoặc trải nghiệm kiểm thử quy trình Google Mail tức thì:
              </p>
              
              <Button
                type="button"
                onClick={() => handleQuickDemoGoogleLogin('user.member@gmail.com', 'Nguyễn Doanh Nhân', false)}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Đăng Nhập Test Google Mail (Quyền Member)</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickDemoGoogleLogin('contact.johnnylongho@gmail.com', 'Hồ Hoàng Long (Johnny Long Hồ)', true)}
                className="w-full border-amber-500/40 text-amber-300 hover:bg-amber-500/10 font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>👑 Đăng Nhập Test Google Mail (Super Admin Johnny)</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/login')}
                className="w-full text-slate-400 hover:text-white text-xs py-2"
              >
                Quay lại màn hình đăng nhập
              </Button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 py-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">Xác Thực Không Thành Công</h2>
              <p className="text-xs text-rose-400 mt-1 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 font-mono">
                {errorMessage}
              </p>
            </div>
            <div className="pt-2">
              <Button
                onClick={() => router.push('/login')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 rounded-2xl"
              >
                Quay lại Đăng Nhập
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#040814] flex flex-col items-center justify-center p-4">
          <span className="w-8 h-8 border-3 border-[#00C2FF] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthCallbackContent />
    </React.Suspense>
  );
}
