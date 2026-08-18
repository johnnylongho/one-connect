'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Building2, Phone, Mail, ArrowRight, Zap, ShieldCheck, Briefcase, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useOneConnectStore } from '@/lib/store';

export default function RegisterPage() {
  const router = useRouter();
  const { registerIdentity } = useOneConnectStore();

  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !businessName || !email) return;

    setLoading(true);
    
    setTimeout(() => {
      // Register new user into One Connect System
      registerIdentity({
        fullName,
        title: title || 'Giám Đốc Doanh Nghiệp',
        businessName,
        phone: phone || '0903.888.999',
        email,
      });

      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        router.push('/dashboard/card');
      }, 1000);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07090E] p-4 py-12">
      <Card className="w-full max-w-lg border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center space-y-2 pb-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-white">Đăng Ký Danh Thiếp Số NFC</CardTitle>
          <CardDescription className="text-slate-400 text-xs">
            Khởi tạo Hồ sơ Định danh Doanh nhân & Cấp Thẻ NFC Chuẩn PDPL 91/2025
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          {success ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Khởi Tạo Danh Thiếp Số Thành Công!</h3>
              <p className="text-xs text-slate-300">
                Chào mừng <strong className="text-emerald-400">{fullName}</strong> gia nhập Hệ sinh thái One Connect. Đang chuyển hướng về thẻ của bạn...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Họ và tên Doanh nhân <span className="text-red-400">*</span></label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="VD: Johnny Long Hồ"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Chức vụ / Vị trí</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder="VD: Tổng Giám Đốc / Nhà Sáng Lập"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Tên Doanh nghiệp / Đơn vị <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="VD: Aplusvn Media & Technology"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="tel"
                      placeholder="VD: 0903.888.999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Email làm việc <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="VD: johnny@aplusvn.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Hồ sơ được tự động kích hoạt cơ chế <strong>Bảo Mật 2-Way Consent</strong> (che mờ số điện thoại cho đến khi có sự đồng thuận 2 chiều).
                </span>
              </div>

              <Button type="submit" disabled={loading} variant="emerald" className="w-full gap-2 mt-2 py-5 font-bold cursor-pointer">
                {loading ? 'Đang Khởi Tạo...' : 'Tạo Thẻ Danh Thiếp Số & Kích Hoạt NFC'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-emerald-400 hover:underline font-semibold">
              Đăng nhập ngay
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

