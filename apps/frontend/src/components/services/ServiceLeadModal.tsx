'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Send, Sparkles, Phone, Mail, User, Building, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PackageType, PACKAGE_INFO } from '@/lib/services/market-demand-service';

interface ServiceLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPackage?: PackageType;
  onSuccess?: () => void;
}

export function ServiceLeadModal({
  isOpen,
  onClose,
  defaultPackage = 'MICE_ENTERPRISE',
  onSuccess,
}: ServiceLeadModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<PackageType>(defaultPackage);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [organizationType, setOrganizationType] = useState('Doanh nghiệp tư nhân');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Update selectedPackage if defaultPackage changes when opened
  React.useEffect(() => {
    if (defaultPackage) {
      setSelectedPackage(defaultPackage);
    }
  }, [defaultPackage]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và Tên.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Vui lòng nhập Số điện thoại liên hệ.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/market-demand/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageType: selectedPackage,
          fullName,
          phone,
          email,
          companyName,
          organizationType,
          notes,
          source: 'WEBSITE_MODAL_FORM',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
      }

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể gửi thông tin. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFullName('');
    setPhone('');
    setEmail('');
    setCompanyName('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-[#0D1527] border border-slate-700 shadow-2xl text-white">
        {/* Top Glow Background */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="p-8 sm:p-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-bold uppercase">
                GỬI YÊU CẦU THÀNH CÔNG
              </Badge>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-white">
                Cảm Ơn Quý Khách Đã Quan Tâm!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Hệ thống One Connect đã tiếp nhận thông tin đăng ký gói{' '}
                <strong className="text-blue-400">{PACKAGE_INFO[selectedPackage].name}</strong> của Quý khách. Đội ngũ
                chuyên viên tư vấn giải pháp sẽ liên hệ trực tiếp qua số điện thoại <strong className="text-emerald-400">{phone}</strong> trong vòng 15-30 phút.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left text-xs space-y-1 text-slate-400 font-mono">
              <div className="flex justify-between">
                <span>Khách hàng:</span>
                <span className="text-white font-bold">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span>Gói dịch vụ:</span>
                <span className="text-blue-400 font-bold">{PACKAGE_INFO[selectedPackage].name}</span>
              </div>
              <div className="flex justify-between">
                <span>Trạng thái:</span>
                <span className="text-emerald-400 font-bold">Đã phân bổ Lead CSKH</span>
              </div>
            </div>

            <Button
              onClick={handleReset}
              className="w-full bg-[#0066FF] hover:bg-blue-600 text-white font-bold rounded-xl h-11 cursor-pointer"
            >
              Hoàn Tất & Đóng
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-[10px] font-bold uppercase">
                  TƯ VẤN & TRẢI NGHIỆM GIẢI PHÁP
                </Badge>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white">
                Đăng Ký Tư Vấn Gói Dịch Vụ
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Để lại thông tin để nhận báo giá chi tiết, kịch bản triển khai trạm check-in MICE hoặc mẫu thẻ thông minh NFC.
              </p>
            </div>

            {/* Package Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                1. Lựa chọn gói giải pháp bạn đang quan tâm:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(['ENTREPRENEUR', 'MICE_ENTERPRISE', 'ASSOCIATION'] as PackageType[]).map((pkg) => (
                  <button
                    type="button"
                    key={pkg}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedPackage === pkg
                        ? 'border-blue-500 bg-blue-600/20 shadow-sm shadow-blue-500/20 ring-1 ring-blue-500'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {pkg === 'MICE_ENTERPRISE' ? '⭐ NỔI BẬT' : 'GÓI GIẢI PHÁP'}
                    </span>
                    <span className={`text-xs font-extrabold mt-1 ${selectedPackage === pkg ? 'text-white' : 'text-slate-300'}`}>
                      {PACKAGE_INFO[pkg].name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input fields */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-400" /> Họ và Tên <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="VD: Nguyễn Văn Hùng"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" /> Số Điện Thoại <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="VD: 0905 123 456"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Công Việc
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="VD: hung.nguyen@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-amber-400" /> Doanh Nghiệp / Tổ Chức
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="VD: Nha Trang Pearl MICE & Travel"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-purple-400" /> Nhu Cầu Cụ Thể / Quy Mô Dự Kiến
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="VD: Số lượng đại biểu dự kiến, thời gian tổ chức sự kiện, hoặc số lượng phôi thẻ kim loại cần làm..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                className="text-slate-400 hover:text-white hover:bg-slate-800 text-xs rounded-xl h-10 px-4 cursor-pointer"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="gap-2 bg-gradient-to-r from-[#0066FF] to-[#0052CC] hover:from-blue-600 hover:to-blue-700 text-white font-extrabold text-xs rounded-xl h-10 px-6 shadow-md shadow-blue-500/25 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Gửi Yêu Cầu Tư Vấn
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
