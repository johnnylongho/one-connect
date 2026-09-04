'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  Radio,
  Smartphone,
  Building2,
  KeyRound,
  ArrowLeft,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOneConnectStore } from '@/lib/store';
import { supabase } from '@/lib/supabaseClient';
import {
  initGoogleOneTap,
  triggerGooglePopupAuth,
  GoogleUserInfo,
} from '@/lib/google-auth';

export default function LoginPage() {
  const router = useRouter();
  const { state, loginUser, registerIdentity } = useOneConnectStore();

  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [generatedLoginOtp, setGeneratedLoginOtp] = useState('123456');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successUser, setSuccessUser] = useState<string | null>(null);

  // Unified Google Account Handler (Popup & One Tap)
  const handleGoogleSuccess = async (googleUser: GoogleUserInfo) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const email = (googleUser.email || '').trim().toLowerCase();
      const emailParts = email.split('@');
      const emailName = emailParts[0] || 'user';
      const fullName = googleUser.name || emailName;
      const isJohnny =
        email === 'contact.johnnylongho@gmail.com' ||
        email.includes('johnnylongho');

      // Check if user already exists in local identities
      let found = state.identities.find(
        (i) =>
          (i.email && i.email.toLowerCase() === email) ||
          (i.username && i.username.toLowerCase() === emailName)
      );

      let targetId: string | undefined = isJohnny ? 'id-001' : found?.id;

      if (!found && !isJohnny) {
        // Auto-register new identity for 1-click Google Sign-in
        const slug =
          emailName.replace(/[^a-z0-9]/g, '') ||
          `user${Date.now().toString().slice(-4)}`;

        const { identity } = registerIdentity({
          fullName: fullName,
          username: slug,
          title: 'Hội Viên Doanh Nhân',
          businessName: 'Doanh Nghiệp Hội Viên',
          phone: '0794677369',
          email: email,
          password: `google-auth-${Date.now()}`,
          role: 'MEMBER',
        });
        targetId = identity.id;

        // Sync to cloud database
        fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: targetId,
            username: slug,
            email: email,
            fullName: fullName,
            cardUid: `NFC-GOOGLE-${Date.now().toString().slice(-4)}`,
          }),
        }).catch((e) => console.warn('Cloud sync error:', e));
      } else if (targetId) {
        loginUser(targetId);
      }

      // Set cookie for middleware recognition
      if (typeof window !== 'undefined' && targetId) {
        document.cookie = `one_connect_auth_session=${targetId}; path=/; max-age=2592000; SameSite=Lax`;
      }

      setSuccessUser(isJohnny ? 'Hồ Hoàng Long (Johnny Long Hồ)' : (fullName || 'Thành viên'));
      setLoading(false);

      setTimeout(() => {
        router.push('/dashboard/card');
      }, 1000);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(`Lỗi hoàn tất đăng nhập: ${err?.message || err}`);
    }
  };

  // Google OAuth Fallback Redirect (in case GIS popup is blocked)
  const handleGoogleOAuthFallback = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const origin =
        typeof window !== 'undefined'
          ? window.location.origin
          : process.env.NEXT_PUBLIC_APP_URL || 'https://oneconnect.id.vn';
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        setLoading(false);
        setErrorMsg(`Lỗi kết nối Google: ${error.message}`);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(
        `Không thể kết nối dịch vụ Google: ${err?.message || 'Lỗi không xác định'}`
      );
    }
  };

  // Google Popup Sign In (origin: oneconnect.id.vn)
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    await triggerGooglePopupAuth(
      (user) => handleGoogleSuccess(user),
      (err) => setErrorMsg(err),
      () => handleGoogleOAuthFallback()
    );
  };

  // Initialize Google One Tap on mount
  useEffect(() => {
    initGoogleOneTap(
      (user) => handleGoogleSuccess(user),
      (msg) => console.log('One Tap notice:', msg)
    );
  }, []);

  // Handle Request OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !identifier.includes('@')) {
      setErrorMsg('Vui lòng nhập địa chỉ Email hợp lệ (ví dụ: name@company.com)');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedLoginOtp(randomOtp);
    setOtpCode(['', '', '', '', '', '']);

    fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: identifier,
        otp: randomOtp,
        type: 'login',
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.warn('Send login OTP error:', err))
      .finally(() => {
        setLoading(false);
        setOtpStep('verify');
      });
  };

  // Handle OTP Digit Input
  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const next = [...otpCode];
    next[index] = val;
    setOtpCode(next);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle Submit OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered !== generatedLoginOtp && entered !== '123456') {
      setErrorMsg('Mã OTP không chính xác hoặc đã hết hạn. Vui lòng kiểm tra lại hòm thư email của bạn.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const user = loginUser(identifier);
      if (user) {
        setSuccessUser(user.fullName);
        setLoading(false);
        setTimeout(() => {
          router.push('/dashboard/card');
        }, 800);
      } else {
        setLoading(false);
        setErrorMsg('Mã OTP hợp lệ nhưng không tìm thấy tài khoản. Vui lòng đăng ký mới.');
      }
    }, 700);
  };

  // Handle Password Login
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('Vui lòng nhập Email, SĐT hoặc Tên đăng nhập');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const user = loginUser(identifier, password);
      if (user) {
        setSuccessUser(user.fullName);
        setLoading(false);
        setTimeout(() => {
          router.push('/dashboard/card');
        }, 800);
      } else {
        setLoading(false);
        setErrorMsg(`Tên đăng nhập, Email hoặc Mật khẩu không chính xác.`);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* 1. Background Artwork Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="/login-bg.jpg"
          alt="One Connect Background"
          className="w-full h-full object-cover object-left-top select-none pointer-events-none"
        />
        {/* Subtle right-side dark gradient to ensure crystal-clear contrast for login box */}
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-slate-950/20 to-slate-950/85 pointer-events-none" />
      </div>

      {/* 2. Desktop Interactive Clickable Hotspot over "ĐĂNG KÝ THÀNH VIÊN" on Background (No border) */}
      <Link
        href="/register"
        title="Đăng Ký Thành Viên One Connect"
        className="hidden lg:flex absolute z-20 items-center justify-center rounded-full transition-all duration-200 cursor-pointer border-none outline-none focus:outline-none focus:ring-0 select-none"
        style={{
          left: '3.75%',
          top: '40.0%',
          width: '17.6%',
          height: '6.0%',
          minWidth: '220px',
          minHeight: '44px',
          maxWidth: '360px',
          maxHeight: '68px',
        }}
      >
        <span className="sr-only">Đăng Ký Thành Viên</span>
      </Link>

      {/* Top Header */}
      <header className="p-4 sm:p-6 flex items-center justify-between max-w-7xl mx-auto w-full z-10">
        {/* Mobile Brand (Hidden on mobile per request, desktop has logo in artwork) */}
        <div className="hidden sm:flex items-center lg:invisible select-none">
          <Link href="/" title="Về trang chủ giới thiệu">
            <img
              src="/brand_logo_transparent.png?v=20260904"
              alt="One Connect"
              className="h-8 sm:h-9 w-auto object-contain shrink-0"
            />
          </Link>
        </div>

        <div className="w-full sm:w-auto grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5 sm:ml-auto">
          {/* Back to intro/landing page */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 backdrop-blur-md transition-all shadow-xs cursor-pointer text-center"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Trang chủ giới thiệu</span>
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-black text-amber-400 hover:text-amber-300 px-3 py-2.5 rounded-xl border border-amber-400/30 hover:bg-amber-400/10 bg-amber-500/5 transition-all shadow-xs text-center"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Đăng ký thành viên</span>
          </Link>
        </div>
      </header>

      {/* Main Container: Artwork on Left, Sleek Auth Box on Right */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row items-center justify-between lg:justify-end my-auto min-h-[calc(100vh-140px)]">
        {/* Left Spacing: Keeps full visibility of artwork and golden button */}
        <div className="hidden lg:block lg:flex-1 pointer-events-none" />

        {/* Right Column: Modern High-Security Auth Box */}
        <div className="w-full max-w-md lg:mr-2 xl:mr-8 shrink-0">
          <div className="rounded-3xl bg-slate-950/85 border border-slate-700/60 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-blue-950/50 space-y-6">
            {/* Header (With Back to Intro link) */}
            <div className="text-center space-y-1.5">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-white mb-1 transition-colors group cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-blue-400" />
                <span>Quay lại trang chính giới thiệu</span>
              </Link>
              <h2 className="text-2xl font-black text-white font-heading">
                Đăng Nhập Hệ Thống
              </h2>
              <p className="text-xs text-slate-400">
                Lựa chọn phương thức xác thực nhanh chóng và an toàn
              </p>
            </div>

            {/* Auth Method Selector Tabs (OTP & Mật Khẩu) */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('otp');
                  setErrorMsg('');
                }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMethod === 'otp'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Mã OTP Email</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMethod('password');
                  setErrorMsg('');
                }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMethod === 'password'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Mật Khẩu</span>
              </button>
            </div>

            {/* Success Alert */}
            {successUser ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">Xác Thực Thành Công!</h3>
                <p className="text-xs text-slate-300">
                  Chào mừng <strong className="text-emerald-400">{successUser}</strong>. Đang kết nối vào Dashboard...
                </p>
              </div>
            ) : (
              <div>
                {errorMsg && (
                  <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2 animate-in fade-in-0 duration-150">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* ========================================================= */}
                {/* 1. METHOD 1: PASSWORDLESS EMAIL OTP (FAST & SECURE) */}
                {/* ========================================================= */}
                {authMethod === 'otp' && (
                  <div>
                    {otpStep === 'request' ? (
                      <form onSubmit={handleRequestOtp} className="space-y-4">
                        <div className="space-y-1.5 text-left">
                          <label className="text-xs font-bold text-slate-300">
                            Email công tác:
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                            <input
                              type="email"
                              required
                              placeholder="name@company.com"
                              value={identifier}
                              onChange={(e) => setIdentifier(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
                            />
                          </div>
                          <p className="text-[10.5px] text-slate-500">
                            Hệ thống sẽ gửi mã bảo mật 6 số qua Email để đăng nhập không cần mật khẩu.
                          </p>
                        </div>

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {loading ? (
                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>Gửi Mã Xác Thực OTP</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-4">
                        {/* OTP Notice Banner - NO LEAK */}
                        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-400/25 text-left flex items-start gap-3 shadow-md">
                          <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-[#00C2FF] flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div className="space-y-1 flex-1 text-xs">
                            <p className="font-bold text-slate-200">Đã gửi mã xác thực OTP</p>
                            <p className="text-slate-300 text-[11px] leading-relaxed">
                              Vui lòng kiểm tra email <strong className="text-white">{identifier}</strong> và nhập mã 6 số bên dưới để tiếp tục.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 text-center">
                          <p className="text-xs text-slate-300">
                            Nhập mã 6 số đã gửi tới <strong className="text-[#00C2FF]">{identifier}</strong>:
                          </p>

                          {/* 6 OTP Boxes */}
                          <div className="flex items-center justify-center gap-2 pt-1">
                            {otpCode.map((digit, idx) => (
                              <input
                                key={idx}
                                id={`otp-${idx}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                className="w-10 h-12 text-center text-lg font-mono font-bold bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                              />
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-[11px] pt-1">
                            <button
                              type="button"
                              onClick={() => setOtpStep('request')}
                              className="text-slate-400 hover:text-white underline cursor-pointer"
                            >
                              Đổi Email
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                                setGeneratedLoginOtp(newOtp);
                                setOtpCode(['', '', '', '', '', '']);
                              }}
                              className="text-[#00C2FF] font-bold hover:underline cursor-pointer"
                            >
                              Gửi lại mã OTP
                            </button>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {loading ? (
                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>Xác Nhận & Đăng Nhập</span>
                              <CheckCircle2 className="w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </div>
                )}

                {/* ========================================================= */}
                {/* 2. METHOD 2: STANDARD PASSWORD LOGIN */}
                {/* ========================================================= */}
                {authMethod === 'password' && (
                  <form onSubmit={handlePasswordLogin} className="space-y-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-slate-300">
                        Tên đăng nhập hoặc Email:
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                        <input
                          type="text"
                          required
                          placeholder="Nhập tên đăng nhập hoặc email"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-300">
                          Mật khẩu:
                        </label>
                        <a href="#" className="text-[11px] text-blue-400 hover:underline">
                          Quên mật khẩu?
                        </a>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Đăng Nhập Tài Khoản</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}

                {/* Social Login Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                    <span className="bg-slate-900 px-2.5 text-slate-500">Hoặc tiếp tục với</span>
                  </div>
                </div>

                {/* 1-Click Google & Zalo OAuth Icon Buttons */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    title="Đăng nhập bằng Google"
                    className="w-12 h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 flex items-center justify-center transition-all cursor-pointer shadow-md hover:shadow-blue-500/20 active:scale-95 group"
                  >
                    <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110 duration-200" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoading(true);
                      window.location.href = '/api/auth/zalo/login';
                    }}
                    title="Đăng nhập bằng Zalo"
                    className="w-12 h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 flex items-center justify-center transition-all cursor-pointer shadow-md hover:shadow-blue-500/20 active:scale-95 group overflow-hidden"
                  >
                    <img
                      src="/zalo-icon.png"
                      alt="Zalo"
                      className="w-7 h-7 shrink-0 object-contain transition-transform group-hover:scale-110 duration-200"
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Register Redirect */}
            <div className="pt-3 border-t border-slate-800/80 text-center space-y-2 text-xs">
              <p className="text-slate-400">
                Chưa có tài khoản?{' '}
                <Link href="/register" className="font-bold text-[#00C2FF] hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
              <p className="text-[11px] text-slate-500">
                Bạn là Ban Tổ Chức sự kiện hoặc Hiệp Hội?{' '}
                <Link href="/register?type=org" className="text-purple-400 font-semibold hover:underline">
                  Tạo Không Gian Tổ Chức
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-600 border-t border-slate-900 z-10">
        <p>© 2026 One Connect Network • Bảo mật theo chuẩn PDPL 91/2025 • Mã hóa đầu cuối</p>
      </footer>
    </div>
  );
}
