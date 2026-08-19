'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  ArrowRight,
  Zap,
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
import BusinessCard3D from '@/components/BusinessCard3D';

export default function LoginPage() {
  const router = useRouter();
  const { state, loginUser, currentIdentity, currentCard } = useOneConnectStore();

  const [authMethod, setAuthMethod] = useState<'otp' | 'password' | 'nfc'>('otp');
  const [identifier, setIdentifier] = useState('contact.johnnylongho@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successUser, setSuccessUser] = useState<string | null>(null);

  // Handle Request OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('Vui lòng nhập Email hoặc Số điện thoại của bạn');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setOtpStep('verify');
    }, 600);
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
    if (entered.length < 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số mã xác thực OTP');
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
        setErrorMsg('Mã OTP không chính xác hoặc đã hết hạn. Vui lòng thử lại.');
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

  // Handle NFC Tap Login
  const handleNfcSimulateLogin = () => {
    setLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      const user = loginUser('johnnylongho');
      if (user) {
        setSuccessUser(user.fullName);
        setLoading(false);
        setTimeout(() => {
          router.push('/dashboard/card');
        }, 800);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="p-4 sm:p-6 flex items-center justify-between max-w-7xl mx-auto w-full z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/one_connect_final_logo_orange.png"
            alt="One Connect Logo"
            className="h-8 sm:h-9 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
          />
          <span className="font-black text-lg sm:text-xl tracking-tight text-white font-heading">
            ONE<span className="text-[#00C2FF]">CONNECT</span>
          </span>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Trang chủ</span>
        </Link>
      </header>

      {/* Main Split-Screen Container */}
      <main className="max-w-7xl mx-auto w-full px-4 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto z-10">
        {/* Left Column: 3D Showcase & Trust Highlights */}
        <div className="lg:col-span-6 space-y-6 hidden lg:block text-left">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-[#00C2FF] text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NỀN TẢNG ĐỊNH DANH DOANH NHÂN B2B</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading leading-tight">
              Đăng Nhập Quản Trị <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                Hệ Sinh Thái Danh Thiếp Số
              </span>
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Truy cập Dashboard quản trị danh thiếp số 3D, danh bạ đối tác B2B, quản lý trạm check-in sự kiện và không gian tổ chức của bạn.
            </p>
          </div>

          {/* Interactive Card Mini Showcase */}
          <div className="pt-2">
            {currentIdentity && (
              <div className="scale-95 origin-top-left pointer-events-none">
                <BusinessCard3D
                  identity={currentIdentity}
                  card={currentCard}
                  showActions={false}
                />
              </div>
            )}
          </div>

          {/* Trust & Compliance Badges */}
          <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Nghị định 91/2025 PDPL</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <Radio className="w-4 h-4 text-[#00C2FF] shrink-0" />
              <span>Chip NFC NTAG215</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Multi-Tenant B2B</span>
            </div>
          </div>
        </div>

        {/* Right Column: Modern High-Security Auth Box */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6">
            {/* Header */}
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
                <Zap className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white font-heading">
                Đăng Nhập Hệ Thống
              </h2>
              <p className="text-xs text-slate-400">
                Lựa chọn phương thức xác thực nhanh chóng và an toàn
              </p>
            </div>

            {/* Auth Method Selector Tabs */}
            <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-bold">
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
                <span>Mã OTP</span>
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

              <button
                type="button"
                onClick={() => {
                  setAuthMethod('nfc');
                  setErrorMsg('');
                }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMethod === 'nfc'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                <span>Thẻ NFC</span>
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
                            Email công tác hoặc Số điện thoại:
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                            <input
                              type="text"
                              required
                              placeholder="contact.johnnylongho@gmail.com"
                              value={identifier}
                              onChange={(e) => setIdentifier(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                            />
                          </div>
                          <p className="text-[10.5px] text-slate-500">
                            Hệ thống sẽ gửi mã bảo mật 6 số qua Email/SMS để đăng nhập không cần mật khẩu.
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
                              Đổi Email / SĐT
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOtpCode(['1', '2', '3', '4', '5', '6']);
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
                        Tài khoản, Email hoặc Username:
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                        <input
                          type="text"
                          required
                          placeholder="johnnylongho"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
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

                {/* ========================================================= */}
                {/* 3. METHOD 3: NFC 1-TAP LOGIN */}
                {/* ========================================================= */}
                {authMethod === 'nfc' && (
                  <div className="space-y-4 text-center py-2">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-cyan-950/80 border-2 border-cyan-400/50 flex items-center justify-center relative shadow-lg shadow-cyan-500/20">
                      <Radio className="w-10 h-10 text-[#00C2FF] animate-pulse" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 animate-ping" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-white">Chạm Thẻ NFC Để Đăng Nhập</h4>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                        Áp thẻ NFC vật lý của bạn vào lưng điện thoại hoặc đầu đọc thẻ để xác thực 1-chạm tức thì.
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={handleNfcSimulateLogin}
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-2xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Radio className="w-4 h-4" />
                          <span>Kích Hoạt Cảm Biến Chạm Thẻ</span>
                        </>
                      )}
                    </Button>
                  </div>
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

                {/* 1-Click Google & Zalo OAuth Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handlePasswordLogin({ preventDefault: () => {} } as any)}
                    className="py-2.5 px-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePasswordLogin({ preventDefault: () => {} } as any)}
                    className="py-2.5 px-3 rounded-2xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/50 text-blue-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <span className="w-4 h-4 rounded bg-blue-600 text-white font-black text-[10px] flex items-center justify-center">Z</span>
                    <span>Zalo Business</span>
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
