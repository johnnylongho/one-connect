'use client';

import React, { useState, useEffect } from 'react';
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
  Users,
  Radio,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOneConnectStore } from '@/lib/store';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams?.get('type') === 'org' ? 'org' : 'personal';

  const { registerIdentity, registerOrganization } = useOneConnectStore();

  const [accountType, setAccountType] = useState<'personal' | 'org'>(initialType);

  // Personal Form Fields
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Organization Form Fields
  const [orgName, setOrgName] = useState('');
  const [orgIndustry, setOrgIndustry] = useState('Hiệp hội Doanh nghiệp & Công nghệ');
  const [orgMemberCount, setOrgMemberCount] = useState('100');
  const [adminFullName, setAdminFullName] = useState('');
  const [adminTitle, setAdminTitle] = useState('Chủ tịch / Trưởng ban tổ chức');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<{ title: string; desc: string; redirect: string } | null>(null);

  useEffect(() => {
    if (searchParams?.get('type') === 'org') {
      setAccountType('org');
    }
  }, [searchParams]);

  // Handle Personal Registration
  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !businessName || !email) return;

    setLoading(true);

    setTimeout(() => {
      const { identity } = registerIdentity({
        fullName,
        title: title || 'Giám Đốc Dự Án',
        businessName,
        phone: phone || '0794677369',
        email,
      });

      setSuccessMsg({
        title: 'Khởi Tạo Danh Thiếp Số Thành Công!',
        desc: `Chào mừng ${fullName} gia nhập One Connect. Thẻ NFC và Profile số của bạn đã sẵn sàng.`,
        redirect: `/p/${identity.username || 'johnnylongho'}`,
      });
      setLoading(false);

      setTimeout(() => {
        router.push('/dashboard/card');
      }, 1200);
    }, 700);
  };

  // Handle Organization Registration
  const handleOrgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !adminFullName || !adminEmail) return;

    setLoading(true);

    setTimeout(() => {
      const { organization } = registerOrganization({
        orgName,
        industry: orgIndustry,
        memberCountEstimate: parseInt(orgMemberCount, 10) || 100,
        adminFullName,
        adminTitle,
        adminEmail,
        adminPhone,
      });

      setSuccessMsg({
        title: 'Khởi Tạo Không Gian Tổ Chức Thành Công!',
        desc: `Không gian ${orgName} đã được thiết lập. Đang chuyển hướng vào bảng điều khiển quản trị...`,
        redirect: '/admin/org/members',
      });
      setLoading(false);

      setTimeout(() => {
        router.push('/admin/org/members');
      }, 1200);
    }, 800);
  };

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
              Đăng Ký Tài Khoản Mới
            </h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Lựa chọn hình thức đăng ký phù hợp với nhu cầu kết nối và quản trị của bạn
            </p>
          </div>

          {/* Account Type Selector (Personal vs B2B Organization) */}
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

          {/* Success Box */}
          {successMsg ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">{successMsg.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                {successMsg.desc}
              </p>
              <div className="pt-2">
                <span className="text-[11px] text-emerald-400 font-mono flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Đang chuyển hướng vào không gian làm việc...
                </span>
              </div>
            </div>
          ) : (
            <div>
              {/* ============================================================= */}
              {/* 1. PERSONAL REGISTRATION FORM */}
              {/* ============================================================= */}
              {accountType === 'personal' && (
                <form onSubmit={handlePersonalSubmit} className="space-y-4 text-left">
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
                          placeholder="VD: Hồ Hoàng Long"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
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
                          placeholder="VD: Giám Đốc Dự Án"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
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
                        placeholder="VD: Tập đoàn Công nghệ số A+ (Aplusvn)"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
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
                          placeholder="0794677369"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
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
                          placeholder="contact.johnnylongho@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
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
                          <span>Khởi Tạo Danh Thiếp Số 1-Chạm</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {/* ============================================================= */}
              {/* 2. ORGANIZATION (B2B SAAS TENANT) REGISTRATION FORM */}
              {/* ============================================================= */}
              {accountType === 'org' && (
                <form onSubmit={handleOrgSubmit} className="space-y-4 text-left">
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
                        className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
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
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
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
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
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
                          placeholder="VD: Hồ Hoàng Long"
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
                          Email công vụ nhận thông báo <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="contact.johnnylongho@gmail.com"
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
                          placeholder="0794677369"
                          value={adminPhone}
                          onChange={(e) => setAdminPhone(e.target.value)}
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
                          <span>Khởi Tạo Không Gian Quản Trị Tổ Chức</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Bottom Login Redirect */}
          <div className="pt-3 border-t border-slate-800/80 text-center space-y-1 text-xs">
            <p className="text-slate-400">
              Đã có tài khoản?{' '}
              <Link href="/login" className="font-bold text-[#00C2FF] hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-600 border-t border-slate-900 z-10">
        <p>© 2026 One Connect Network • Bảo vệ dữ liệu cá nhân Nghị định 91/2025 • Mã hóa đầu cuối</p>
      </footer>
    </div>
  );
}
