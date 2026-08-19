'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  Building2,
  Phone,
  Mail,
  ArrowRight,
  Zap,
  ShieldCheck,
  Briefcase,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Layers,
  Crown,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOneConnectStore } from '@/lib/store';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams?.get('type') === 'org' ? 'org' : 'personal';

  const { registerIdentity, registerOrganization, setCurrentIdentityId } = useOneConnectStore();

  const [accountType, setAccountType] = useState<'personal' | 'org'>(initialType);
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');

  // Personal Form Fields
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Organization Form Fields
  const [orgName, setOrgName] = useState('');
  const [orgIndustry, setOrgIndustry] = useState('Hiệp hội Doanh nghiệp & Công nghệ');
  const [orgMemberCount, setOrgMemberCount] = useState('100');
  const [adminFullName, setAdminFullName] = useState('');
  const [adminTitle, setAdminTitle] = useState('Chủ tịch / Trưởng ban tổ chức');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');

  // OTP Verification States
  const [generatedOtp, setGeneratedOtp] = useState('123456');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredProfileUrl, setRegisteredProfileUrl] = useState('');
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (searchParams?.get('type') === 'org') {
      setAccountType('org');
    }
  }, [searchParams]);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  // Step 1: Proceed to OTP Verification
  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (accountType === 'personal') {
      if (!fullName.trim() || !businessName.trim() || !email.trim()) {
        setErrorMsg('Vui lòng điền đầy đủ Họ tên, Tên doanh nghiệp và Email');
        return;
      }
      if (!password || password.length < 6) {
        setErrorMsg('Vui lòng tạo mật khẩu tối thiểu 6 ký tự để bảo mật tài khoản');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại');
        return;
      }
    } else {
      if (!orgName.trim() || !adminFullName.trim() || !adminEmail.trim()) {
        setErrorMsg('Vui lòng điền đầy đủ Tên tổ chức, Người đại diện và Email');
        return;
      }
      if (!adminPassword || adminPassword.length < 6) {
        setErrorMsg('Vui lòng tạo mật khẩu quản trị tối thiểu 6 ký tự');
        return;
      }
      if (adminPassword !== adminConfirmPassword) {
        setErrorMsg('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại');
        return;
      }
    }

    setLoading(true);

    // Sinh mã ngẫu nhiên 6 chữ số
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setCountdown(60);
    setOtpCode(['', '', '', '', '', '']);

    setTimeout(() => {
      setLoading(false);
      setStep('otp');
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
      const nextInput = document.getElementById(`reg-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Step 2: Confirm OTP & Activate Account
  const handleVerifyAndActivate = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered.length < 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số mã xác thực OTP');
      return;
    }

    if (entered !== generatedOtp && entered !== '123456') {
      setErrorMsg(`Mã OTP không chính xác. Vui lòng nhập mã: ${generatedOtp} (hoặc mã 123456)`);
      return;
    }

    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      if (accountType === 'personal') {
        const { identity } = registerIdentity({
          fullName,
          title: title || 'Giám Đốc Doanh Nghiệp',
          businessName,
          phone: phone || '0794677369',
          email,
          password,
        });

        setCurrentIdentityId(identity.id);
        const targetUrl = `/p/${identity.username}`;
        setRegisteredProfileUrl(targetUrl);
        setStep('success');
        setLoading(false);

        setTimeout(() => {
          router.push(targetUrl);
        }, 1500);
      } else {
        const { organization, admin } = registerOrganization({
          orgName,
          industry: orgIndustry,
          memberCountEstimate: parseInt(orgMemberCount, 10) || 100,
          adminFullName,
          adminTitle,
          adminEmail,
          adminPhone,
          adminPassword,
        });

        setCurrentIdentityId(admin.id);
        const targetUrl = `/admin/org/members`;
        setRegisteredProfileUrl(targetUrl);
        setStep('success');
        setLoading(false);

        setTimeout(() => {
          router.push(targetUrl);
        }, 1500);
      }
    }, 800);
  };

  const currentEmailTarget = accountType === 'personal' ? email : adminEmail;

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

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
          href="/login"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
        >
          <span>Đã có tài khoản? Đăng nhập</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto w-full px-4 py-6 sm:py-10 my-auto z-10">
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-[#00C2FF] text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GIA NHẬP HỆ SINH THÁI ONE CONNECT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Đăng Ký & Khởi Tạo Danh Tính Số
            </h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Tạo mật khẩu đăng nhập bảo mật và xác thực OTP 2 lớp theo tiêu chuẩn PDPL 91/2025
            </p>
          </div>

          {/* Progress Step Bar */}
          <div className="flex items-center justify-center gap-3 text-xs font-bold">
            <div className={`flex items-center gap-1.5 ${step === 'form' ? 'text-[#00C2FF]' : 'text-emerald-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'form' ? 'bg-[#0066FF] text-white' : 'bg-emerald-500 text-white'}`}>
                1
              </span>
              <span>Thông Tin & Mật Khẩu</span>
            </div>
            <div className="w-8 h-[1px] bg-slate-700" />
            <div className={`flex items-center gap-1.5 ${step === 'otp' ? 'text-[#00C2FF]' : step === 'success' ? 'text-emerald-400' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'otp' ? 'bg-[#0066FF] text-white' : step === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                2
              </span>
              <span>Xác Thực OTP</span>
            </div>
            <div className="w-8 h-[1px] bg-slate-700" />
            <div className={`flex items-center gap-1.5 ${step === 'success' ? 'text-emerald-400' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                3
              </span>
              <span>Kích Hoạt</span>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2 animate-in fade-in-0 duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ============================================================= */}
          {/* STEP 1: FORM INPUT WITH PASSWORD */}
          {/* ============================================================= */}
          {step === 'form' && (
            <div className="space-y-5">
              {/* Account Type Selector */}
              <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-950/90 border border-slate-800 gap-1.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAccountType('personal')}
                  className={`p-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1 text-center cursor-pointer ${
                    accountType === 'personal'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-bold">Doanh Nhân Cá Nhân</span>
                  </div>
                  <span className="text-[10px] opacity-80">Danh thiếp số VIP & Thẻ NFC</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('org')}
                  className={`p-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1 text-center cursor-pointer ${
                    accountType === 'org'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-bold">Tổ Chức / Hiệp Hội B2B</span>
                  </div>
                  <span className="text-[10px] opacity-80">Không gian YBA & Quản trị hội viên</span>
                </button>
              </div>

              {/* Personal Form */}
              {accountType === 'personal' && (
                <form onSubmit={handleProceedToOtp} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Họ và tên Doanh nhân <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                        <input
                          type="text"
                          required
                          placeholder="VD: Nguyễn Nhật Thanh"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Chức vụ / Vị trí
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                        <input
                          type="text"
                          placeholder="VD: Tổng Giám Đốc / Founder"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Tên Doanh nghiệp / Công ty <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="VD: Công ty TNHH Giải Pháp Nhật Thanh"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Số điện thoại Hotline / Zalo <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                        <input
                          type="tel"
                          required
                          placeholder="0912345678"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Email công tác <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                        <input
                          type="email"
                          required
                          placeholder="nhatthanh@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800/80 pt-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Tạo mật khẩu đăng nhập <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Tối thiểu 6 ký tự"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-9 pr-9 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Xác nhận lại mật khẩu <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Nhập lại mật khẩu"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Đăng Ký & Nhận Mã OTP Xác Thực</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {/* Organization Form */}
              {accountType === 'org' && (
                <form onSubmit={handleProceedToOtp} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Tên Tổ chức / Hiệp hội / Doanh nghiệp <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-3 text-purple-400" />
                      <input
                        type="text"
                        required
                        placeholder="VD: Hội Doanh Nhân Trẻ Khánh Hòa (YBA)"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Lĩnh vực hoạt động
                      </label>
                      <select
                        value={orgIndustry}
                        onChange={(e) => setOrgIndustry(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="Hiệp hội Doanh nghiệp & Công nghệ">Hiệp hội Doanh nghiệp & Công nghệ</option>
                        <option value="Tập đoàn Bất động sản & Nghỉ dưỡng">Tập đoàn Bất động sản & Nghỉ dưỡng</option>
                        <option value="Câu lạc bộ Xúc tiến Thương mại B2B">Câu lạc bộ Xúc tiến Thương mại B2B</option>
                        <option value="Tổ chức Sự kiện & Hội nghị Quốc gia">Tổ chức Sự kiện & Hội nghị Quốc gia</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Quy mô Hội viên / Nhân sự
                      </label>
                      <select
                        value={orgMemberCount}
                        onChange={(e) => setOrgMemberCount(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                      >
                        <option value="50">Gói Thử Nghiệm: 50 Hội viên</option>
                        <option value="200">Gói Tiêu Chuẩn: 200 Hội viên</option>
                        <option value="500">Gói Doanh Nghiệp: 500 Hội viên</option>
                        <option value="2000">Gói Đại Hội: 2,000+ Đại biểu</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-3 space-y-3">
                    <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400">
                      Thông Tin Người Đại Diện Quản Trị (Org Admin):
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">
                          Họ và tên Trưởng ban / Chủ tịch <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="VD: Nguyễn Nhật Thanh"
                          value={adminFullName}
                          onChange={(e) => setAdminFullName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">
                          Chức vụ trong tổ chức
                        </label>
                        <input
                          type="text"
                          placeholder="VD: Chủ tịch / Tổng thư ký"
                          value={adminTitle}
                          onChange={(e) => setAdminTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">
                          Email công vụ nhận mã OTP <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="admin.nhatthanh@example.com"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">
                          Số điện thoại liên hệ
                        </label>
                        <input
                          type="tel"
                          placeholder="0912345678"
                          value={adminPhone}
                          onChange={(e) => setAdminPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Admin Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800/80 pt-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">
                          Tạo mật khẩu quản trị <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Tối thiểu 6 ký tự"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">
                          Xác nhận mật khẩu quản trị <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Nhập lại mật khẩu"
                          value={adminConfirmPassword}
                          onChange={(e) => setAdminConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Crown className="w-4 h-4 text-amber-300" />
                          <span>Đăng Ký & Nhận Mã OTP Tổ Chức</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ============================================================= */}
          {/* STEP 2: OTP VERIFICATION STEP */}
          {/* ============================================================= */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyAndActivate} className="space-y-5 text-center">
              {/* Simulated OTP Notification Banner */}
              <div className="p-3.5 rounded-2xl bg-blue-500/15 border border-blue-400/30 text-left flex items-start gap-3 shadow-lg">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <p className="text-[11px] font-bold text-slate-200">
                    One Connect Verification Service:
                  </p>
                  <p className="text-xs text-[#00C2FF]">
                    Mã OTP của bạn là: <strong className="font-mono text-white text-sm tracking-wider bg-slate-950 px-2 py-0.5 rounded-md border border-blue-400/40">{generatedOtp}</strong>
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Đã gửi tới: {currentEmailTarget} (Hiệu lực: {countdown}s)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode(generatedOtp.split(''));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold shrink-0 cursor-pointer shadow-xs"
                >
                  Tự điền mã
                </button>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Nhập Mã Xác Thực OTP</h3>
                <p className="text-xs text-slate-400">
                  Nhập mã 6 số để kích hoạt bảo mật và hoàn tất đăng ký tài khoản
                </p>
              </div>

              {/* 6-Digit OTP Boxes */}
              <div className="flex items-center justify-center gap-2 pt-2">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`reg-otp-${idx}`}
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
                  onClick={() => setStep('form')}
                  className="text-slate-400 hover:text-white underline cursor-pointer"
                >
                  ← Sửa thông tin & mật khẩu
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedOtp(newOtp);
                    setCountdown(60);
                    setOtpCode(['', '', '', '', '', '']);
                  }}
                  className="text-[#00C2FF] font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Gửi lại mã mới</span>
                </button>
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
                    <span>Xác Nhận OTP & Kích Hoạt Tài Khoản</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* ============================================================= */}
          {/* STEP 3: SUCCESS & REDIRECTION */}
          {/* ============================================================= */}
          {step === 'success' && (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Đăng Ký & Xác Thực Thành Công!</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                Chào mừng <strong>{fullName || adminFullName}</strong> gia nhập One Connect Network. Mật khẩu và tài khoản của bạn đã được thiết lập bảo mật.
              </p>
              <div className="pt-2">
                <span className="text-[11px] text-emerald-400 font-mono flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Đang mở Profile số: <strong>{registeredProfileUrl}</strong>...
                </span>
              </div>
            </div>
          )}

          {/* Bottom Login Redirect */}
          {step === 'form' && (
            <div className="pt-3 border-t border-slate-800/80 text-center space-y-1 text-xs">
              <p className="text-slate-400">
                Đã có tài khoản?{' '}
                <Link href="/login" className="font-bold text-[#00C2FF] hover:underline">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-600 border-t border-slate-900 z-10">
        <p>© 2026 One Connect Network • Bảo vệ dữ liệu cá nhân Nghị định 91/2025 • Mã hóa đầu cuối</p>
      </footer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070A12] text-slate-100 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}

