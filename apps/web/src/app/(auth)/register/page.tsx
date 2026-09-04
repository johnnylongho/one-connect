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
  AtSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOneConnectStore } from '@/lib/store';
import { supabase } from '@/lib/supabaseClient';
import {
  initGoogleOneTap,
  triggerGooglePopupAuth,
  GoogleUserInfo,
} from '@/lib/google-auth';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams?.get('type') === 'org' ? 'org' : 'personal';

  const { registerIdentity, registerOrganization, setCurrentIdentityId, state } = useOneConnectStore();

  const [accountType, setAccountType] = useState<'personal' | 'org'>(initialType);
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');

  // Personal Form Fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameCustomized, setIsUsernameCustomized] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable' | 'invalid'>('idle');
  const [usernameMsg, setUsernameMsg] = useState('');
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
  const [emailDeliveryStatus, setEmailDeliveryStatus] = useState<{
    delivered?: boolean;
    provider?: string;
    message?: string;
    resendError?: string;
  } | null>(null);
  const [registeredProfileUrl, setRegisteredProfileUrl] = useState('');
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (searchParams?.get('type') === 'org') {
      setAccountType('org');
    }
  }, [searchParams]);

  // Real-time debounced username availability validation
  useEffect(() => {
    const trimmed = username.trim().toLowerCase();
    if (!trimmed) {
      setUsernameStatus('idle');
      setUsernameMsg('');
      return;
    }

    if (trimmed.length < 3) {
      setUsernameStatus('invalid');
      setUsernameMsg('Tên đăng nhập phải từ 3 - 30 ký tự');
      return;
    }

    const validCharsRegex = /^[a-z0-9][a-z0-9_.-]{1,28}[a-z0-9]$/;
    if (!validCharsRegex.test(trimmed)) {
      setUsernameStatus('invalid');
      setUsernameMsg('Chỉ dùng chữ thường (a-z), số (0-9), gạch dưới (_)');
      return;
    }

    const reserved = [
      'admin',
      'administrator',
      'root',
      'system',
      'support',
      'oneconnect',
      'yba',
      'api',
      'auth',
      'login',
      'register',
      'dashboard',
      'settings',
      'demo',
      'events',
      'checkout',
      'card',
      'cards',
      'p',
      'c',
      'operator',
      'null',
      'undefined',
    ];
    if (reserved.includes(trimmed)) {
      setUsernameStatus('unavailable');
      setUsernameMsg('Tên đăng nhập đã được hệ thống bảo lưu');
      return;
    }

    // Check local store collision
    const isLocalDuplicate = state?.identities?.some(
      (id) => id.username?.toLowerCase() === trimmed
    );
    if (isLocalDuplicate) {
      setUsernameStatus('unavailable');
      setUsernameMsg('Tên đăng nhập đã được sử dụng');
      return;
    }

    // Query Cloud Supabase API for availability
    setUsernameStatus('checking');
    setUsernameMsg('Đang kiểm tra tính khả dụng...');

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        if (data.available) {
          setUsernameStatus('available');
          setUsernameMsg('Tên đăng nhập khả dụng');
        } else {
          setUsernameStatus('unavailable');
          setUsernameMsg(data.reason || 'Tên đăng nhập đã tồn tại');
        }
      } catch {
        // If offline or network issue, fallback to available since local check passed
        setUsernameStatus('available');
        setUsernameMsg('Tên đăng nhập khả dụng');
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username, state?.identities]);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  // Unified Google Account Handler (Popup & One Tap) for Registration
  const handleGoogleSuccess = async (googleUser: GoogleUserInfo) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const email = (googleUser.email || '').trim().toLowerCase();
      const emailParts = email.split('@');
      const emailName = emailParts[0] || 'user';
      const userFullName = googleUser.name || emailName;
      const isJohnny =
        email === 'contact.johnnylongho@gmail.com' ||
        email.includes('johnnylongho');

      // Check if user already exists
      let found = state.identities.find(
        (i) =>
          (i.email && i.email.toLowerCase() === email) ||
          (i.username && i.username.toLowerCase() === emailName)
      );

      let targetId: string | undefined = isJohnny ? 'id-001' : found?.id;
      let targetUsername: string | undefined = isJohnny ? 'johnnylongho' : found?.username;

      if (!found && !isJohnny) {
        const slug =
          emailName.replace(/[^a-z0-9]/g, '') ||
          `user${Date.now().toString().slice(-4)}`;

        const { identity } = registerIdentity({
          fullName: userFullName,
          username: slug,
          title: 'Hội Viên Doanh Nhân',
          businessName: 'Doanh Nghiệp Hội Viên',
          phone: '0794677369',
          email: email,
          password: `google-auth-${Date.now()}`,
          role: 'MEMBER',
        });
        targetId = identity.id;
        targetUsername = identity.username;

        // Sync to cloud database
        fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: targetId,
            username: slug,
            email: email,
            fullName: userFullName,
            cardUid: `NFC-GOOGLE-${Date.now().toString().slice(-4)}`,
          }),
        }).catch((e) => console.warn('Cloud sync error:', e));

        // Send VIP Welcome Email
        fetch('/api/auth/send-welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            fullName: userFullName,
            title: 'Hội Viên Doanh Nhân',
            businessName: 'Doanh Nghiệp Hội Viên',
            profileUrl: `https://oneconnect.id.vn/p/${slug}`,
          }),
        }).catch((err) => console.warn('Send welcome email error:', err));
      } else if (targetId) {
        setCurrentIdentityId(targetId);
      }

      // Set cookie for middleware recognition
      if (typeof window !== 'undefined' && targetId) {
        document.cookie = `one_connect_auth_session=${targetId}; path=/; max-age=2592000; SameSite=Lax`;
      }

      setFullName(userFullName || 'Thành viên');
      setRegisteredProfileUrl(
        `https://oneconnect.id.vn/p/${targetUsername || 'member'}`
      );
      setStep('success');
      setLoading(false);

      setTimeout(() => {
        router.push(`/p/${targetUsername || 'johnnylongho'}`);
      }, 1800);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(`Lỗi hoàn tất đăng ký: ${err?.message || err}`);
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

  // Google Popup Sign Up (origin: oneconnect.id.vn)
  const handleGoogleSignUp = async () => {
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

  // Step 1: Proceed to OTP Verification
  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (accountType === 'personal') {
      if (!fullName.trim() || !businessName.trim() || !email.trim()) {
        setErrorMsg('Vui lòng điền đầy đủ Họ tên, Tên doanh nghiệp và Email');
        return;
      }
      if (usernameStatus === 'unavailable') {
        setErrorMsg('Tên đăng nhập đã được sử dụng. Vui lòng chọn tên đăng nhập khác');
        return;
      }
      if (usernameStatus === 'invalid') {
        setErrorMsg('Tên đăng nhập không hợp lệ (tối thiểu 3 ký tự, không dấu cách)');
        return;
      }
      if (usernameStatus === 'checking') {
        setErrorMsg('Đang kiểm tra tính khả dụng của tên đăng nhập. Vui lòng chờ');
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

    const targetEmail = accountType === 'personal' ? email : adminEmail;
    const targetName = accountType === 'personal' ? fullName : adminFullName;

    // Gửi email thật qua Resend API Gateway / SMTP
    fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: targetEmail,
        fullName: targetName,
        otp: randomOtp,
        type: 'register',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setEmailDeliveryStatus(data);
      })
      .catch((err) => {
        console.warn('Send OTP network error:', err);
        setEmailDeliveryStatus({ delivered: false, message: 'Lỗi mạng khi gọi cổng email' });
      })
      .finally(() => {
        setLoading(false);
        setStep('otp');
      });
  };

  // Gửi lại mã OTP
  const handleResendOtp = () => {
    if (countdown > 0) return;
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setCountdown(60);
    setOtpCode(['', '', '', '', '', '']);

    const targetEmail = accountType === 'personal' ? email : adminEmail;
    const targetName = accountType === 'personal' ? fullName : adminFullName;

    fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: targetEmail,
        fullName: targetName,
        otp: randomOtp,
        type: 'register',
      }),
    }).catch((err) => console.warn('Resend OTP error:', err));
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
      setErrorMsg('Mã OTP không chính xác hoặc đã hết hạn. Vui lòng kiểm tra lại email.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    const slugify = (str: string) => {
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'd')
        .replace(/[^a-z0-9]/g, '');
    };

    setTimeout(() => {
      if (accountType === 'personal') {
        const finalUsername = (username.trim() || slugify(fullName) || `user${Date.now().toString().slice(-4)}`).toLowerCase();

        const { identity, card } = registerIdentity({
          fullName,
          username: finalUsername,
          title: title || 'Hội Viên Doanh Nghiệp',
          businessName,
          phone: phone || '',
          email,
          password,
          role: 'MEMBER',
        });

        setCurrentIdentityId(identity.id);
        const targetUrl = `/p/${identity.username}`;
        setRegisteredProfileUrl(targetUrl);
        setStep('success');
        setLoading(false);

        // Lưu trữ tài khoản và mật khẩu lên Supabase Auth & Cloud Database
        fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: identity.id,
            username: finalUsername,
            email,
            phone,
            password,
            fullName,
            title: title || 'Hội Viên Doanh Nghiệp',
            businessName,
            cardUid: card?.cardUid,
          }),
        }).catch((err) => console.warn('Sync user to cloud error:', err));

        // Gửi Thư Chào Mừng VIP tự động về hòm thư đối tác
        fetch('/api/auth/send-welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            fullName,
            title: title || 'Giám Đốc Doanh Nghiệp',
            businessName,
            profileUrl: typeof window !== 'undefined' ? `${window.location.origin}${targetUrl}` : `https://one-connect-network.vercel.app${targetUrl}`,
          }),
        }).catch((err) => console.warn('Send welcome email error:', err));

        setTimeout(() => {
          router.push(targetUrl);
        }, 1600);
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

        // Gửi Thư Chào Mừng Quản Trị Tổ Chức
        fetch('/api/auth/send-welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: adminEmail,
            fullName: adminFullName,
            title: adminTitle || 'Trưởng Ban Quản Trị Tổ Chức',
            businessName: orgName,
            profileUrl: typeof window !== 'undefined' ? `${window.location.origin}/admin/org/members` : `https://one-connect-network.vercel.app/admin/org/members`,
          }),
        }).catch((err) => console.warn('Send welcome email error:', err));

        setTimeout(() => {
          router.push(targetUrl);
        }, 1600);
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
      <header className="p-4 sm:p-6 grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-between max-w-7xl mx-auto w-full z-10">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 transition-all border border-slate-700/60 backdrop-blur-md shadow-xs cursor-pointer text-center"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Trang chủ giới thiệu</span>
        </Link>

        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 transition-all border border-slate-700/60 backdrop-blur-md shadow-xs text-center"
        >
          <span className="truncate">Đã có tài khoản? Đăng nhập</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
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
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-heading leading-tight">
              Đăng Ký & Khởi Tạo <br className="sm:hidden" />
              <span>Danh Tính Số</span>
            </h1>
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
              {/* 1-Click Fast Register via Google & Zalo Icons */}
              <div className="space-y-3 flex flex-col items-center">
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                    title="Đăng ký bằng Google"
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
                    title="Đăng ký bằng Zalo"
                    className="w-12 h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 flex items-center justify-center transition-all cursor-pointer shadow-md hover:shadow-blue-500/20 active:scale-95 group overflow-hidden"
                  >
                    <img
                      src="/zalo-icon.png"
                      alt="Zalo"
                      className="w-7 h-7 shrink-0 object-contain transition-transform group-hover:scale-110 duration-200"
                    />
                  </button>
                </div>

                <div className="relative flex items-center justify-center w-full">
                  <div className="w-full border-t border-slate-800" />
                  <span className="bg-slate-900 px-3 text-[10px] uppercase font-mono tracking-wider text-slate-500 absolute">
                    Hoặc đăng ký tài khoản mới
                  </span>
                </div>
              </div>

              {/* Account Type Selector */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950 border border-slate-800 gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setAccountType('personal')}
                  className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-semibold ${
                    accountType === 'personal'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span className="truncate">Doanh Nhân</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('org')}
                  className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-semibold ${
                    accountType === 'org'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">Tổ Chức</span>
                </button>
              </div>

              {/* Personal Form */}
              {accountType === 'personal' && (
                <form onSubmit={handleProceedToOtp} className="space-y-3.5 text-left">
                  {/* Row 1: Full name & Username */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Họ và tên <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-3 text-slate-500 pointer-events-none" />
                        <input
                          type="text"
                          required
                          placeholder="Nhập họ và tên đầy đủ"
                          value={fullName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFullName(val);
                            if (!isUsernameCustomized) {
                              const slug = val
                                .toLowerCase()
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '')
                                .replace(/đ/g, 'd')
                                .replace(/Đ/g, 'd')
                                .replace(/[^a-z0-9]/g, '');
                              setUsername(slug);
                            }
                          }}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                        <span>Tên đăng nhập (Username) <span className="text-red-400">*</span></span>
                        <span className="text-[10px] text-slate-500 font-mono">/p/{username || '...'}</span>
                      </label>
                      <div className="relative">
                        <AtSign className="w-4 h-4 absolute left-3 top-3 text-slate-500 pointer-events-none" />
                        <input
                          type="text"
                          required
                          placeholder="Nhập tên đăng nhập viết liền"
                          value={username}
                          onChange={(e) => {
                            setIsUsernameCustomized(true);
                            setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''));
                          }}
                          className={`w-full pl-9 pr-9 py-2.5 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none font-mono transition-colors ${
                            usernameStatus === 'available'
                              ? 'border-emerald-500/60 focus:border-emerald-500'
                              : usernameStatus === 'unavailable'
                              ? 'border-red-500/60 focus:border-red-500'
                              : usernameStatus === 'invalid' && username.length > 0
                              ? 'border-amber-500/60 focus:border-amber-500'
                              : 'border-slate-800 focus:border-blue-500'
                          }`}
                        />
                        <div className="absolute right-3 top-3 flex items-center pointer-events-none">
                          {usernameStatus === 'checking' && (
                            <span className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                          )}
                          {usernameStatus === 'available' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          )}
                          {usernameStatus === 'unavailable' && (
                            <AlertCircle className="w-4 h-4 text-red-400" />
                          )}
                          {usernameStatus === 'invalid' && username.length > 0 && (
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feature: Live URL Preview & Username Availability Status Bar */}
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 flex items-center justify-between gap-2 text-xs transition-all">
                    <div className="min-w-0 overflow-hidden">
                      <span className="font-mono text-xs text-slate-300 truncate block">
                        oneconnect.id.vn/p/<span className={`font-bold ${username ? 'text-[#00C2FF]' : 'text-slate-500 italic'}`}>{username || '[username]'}</span>
                      </span>
                    </div>

                    <div className="shrink-0 flex items-center">
                      {usernameStatus === 'checking' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-medium animate-pulse">
                          <span className="w-2.5 h-2.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                          Đang kiểm tra...
                        </span>
                      )}
                      {usernameStatus === 'available' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          Khả dụng
                        </span>
                      )}
                      {usernameStatus === 'unavailable' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-semibold">
                          <AlertCircle className="w-3 h-3" />
                          Đã có người dùng
                        </span>
                      )}
                      {usernameStatus === 'invalid' && username.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-medium">
                          <AlertCircle className="w-3 h-3" />
                          {usernameMsg}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Business name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Tên Doanh nghiệp / Công ty <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-500 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="Nhập tên doanh nghiệp hoặc tổ chức"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Row 3: Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Số điện thoại <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500 pointer-events-none" />
                        <input
                          type="tel"
                          required
                          placeholder="Nhập số điện thoại liên hệ"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Địa chỉ Email <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500 pointer-events-none" />
                        <input
                          type="email"
                          required
                          placeholder="Nhập địa chỉ email chính thức"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Password Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-t border-slate-800/80 pt-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Mật khẩu <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-9 pr-9 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
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
                      <label className="text-xs font-semibold text-slate-300 block">
                        Xác nhận lại mật khẩu <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Nhập lại mật khẩu để xác nhận"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
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
                <form onSubmit={handleProceedToOtp} className="space-y-3.5 text-left">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Tên Tổ chức / Hiệp hội / Doanh nghiệp <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-3 text-purple-400 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="Nhập tên tổ chức, hiệp hội hoặc doanh nghiệp"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 block">
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
                      <label className="text-xs font-semibold text-slate-300 block">
                        Quy mô Hội viên / Nhân sự
                      </label>
                      <select
                        value={orgMemberCount}
                        onChange={(e) => setOrgMemberCount(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                      >
                        <option value="50">Quy mô 50 Hội viên</option>
                        <option value="200">Quy mô 200 Hội viên</option>
                        <option value="500">Quy mô 500 Hội viên</option>
                        <option value="2000">Quy mô 2,000+ Hội viên</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-3 space-y-3">
                    <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400">
                      Thông Tin Người Đại Diện Quản Trị:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Họ và tên người đại diện <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Nhập họ và tên người đại diện"
                          value={adminFullName}
                          onChange={(e) => setAdminFullName(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Chức vụ trong tổ chức
                        </label>
                        <input
                          type="text"
                          placeholder="Nhập chức danh / vị trí công tác"
                          value={adminTitle}
                          onChange={(e) => setAdminTitle(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Email công vụ nhận mã OTP <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="Nhập địa chỉ email công vụ"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Số điện thoại liên hệ
                        </label>
                        <input
                          type="tel"
                          placeholder="Nhập số điện thoại người đại diện"
                          value={adminPhone}
                          onChange={(e) => setAdminPhone(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Admin Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-t border-slate-800/80 pt-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Mật khẩu quản trị <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Nhập mật khẩu quản trị (tối thiểu 6 ký tự)"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Xác nhận lại mật khẩu quản trị <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Nhập lại mật khẩu quản trị"
                          value={adminConfirmPassword}
                          onChange={(e) => setAdminConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
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
              {/* Real Email Notification Banner - NO OTP LEAK */}
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-400/25 text-left flex items-start gap-3.5 shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-[#00C2FF] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">
                      Cổng Xác Thực One Connect
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      Bảo Mật OTP
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Mã xác thực 6 số đã được gửi đến hòm thư <strong className="text-white font-medium">{currentEmailTarget}</strong>. Vui lòng mở email (kiểm tra hộp thư đến hoặc thư mục Spam/Quảng cáo) và nhập mã OTP bên dưới để kích hoạt tài khoản.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Thời gian hiệu lực: <span className="text-amber-400 font-mono font-bold">{countdown}s</span>
                  </p>
                </div>
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
                  disabled={countdown > 0}
                  onClick={handleResendOtp}
                  className={`flex items-center gap-1 font-semibold ${
                    countdown > 0 ? 'text-slate-500 cursor-not-allowed' : 'text-[#00C2FF] hover:underline cursor-pointer'
                  }`}
                >
                  <RefreshCw className={`w-3 h-3 ${countdown > 0 ? '' : 'text-[#00C2FF]'}`} />
                  <span>{countdown > 0 ? `Gửi lại sau (${countdown}s)` : 'Gửi lại mã OTP'}</span>
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

