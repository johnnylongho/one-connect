'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useOneConnectStore } from '@/lib/store';
import { UserCheck, Building2, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function OnboardingWizard() {
  const router = useRouter();
  const { currentIdentity } = useOneConnectStore();

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState(currentIdentity?.fullName || '');
  const [title, setTitle] = useState(currentIdentity?.title || 'CEO & Founder');
  const [businessName, setBusinessName] = useState(currentIdentity?.businesses?.[0]?.businessName || 'Tập đoàn Công nghệ Aplusvn');
  const [bio, setBio] = useState(currentIdentity?.bio || '');

  const handleFinish = () => {
    router.push('/dashboard/card');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white">
      <Navbar />

      <main className="app-container max-w-xl space-y-6 pt-4">
        {/* Wizard Steps Tracker */}
        <div className="flex items-center justify-between px-4">
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 1 ? 'text-cyan-400' : 'text-gray-500'}`}>
            <span className="w-6 h-6 rounded-full border border-cyan-400 flex items-center justify-center text-xs">1</span>
            Định Danh Số
          </div>
          <div className="w-12 h-0.5 bg-white/10" />
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 2 ? 'text-cyan-400' : 'text-gray-500'}`}>
            <span className="w-6 h-6 rounded-full border border-cyan-400 flex items-center justify-center text-xs">2</span>
            Doanh Nghiệp
          </div>
          <div className="w-12 h-0.5 bg-white/10" />
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 3 ? 'text-cyan-400' : 'text-gray-500'}`}>
            <span className="w-6 h-6 rounded-full border border-cyan-400 flex items-center justify-center text-xs">3</span>
            Cài Đặt PDPL
          </div>
        </div>

        <div className="glass-panel p-8 space-y-6 border-cyan-500/30">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white font-['Outfit']">Bước 1: Thiết Lập Định Danh Cá Nhân</h2>
                  <p className="text-xs text-gray-400">Hồ sơ này sẽ xuất hiện khi chạm thẻ NFC hoặc quét mã QR</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs text-gray-300 font-semibold mb-1 block">Họ và Tên Doanh Nhân</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="input-glass"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-semibold mb-1 block">Chức Danh / Vị Trí Công Việc</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="input-glass"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-semibold mb-1 block">Giới Thiệu Ngắn (Bio)</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="input-glass"
                  />
                </div>
              </div>

              <button onClick={() => setStep(2)} className="btn-primary w-full mt-4">
                Tiếp Theo: Thêm Doanh Nghiệp <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white font-['Outfit']">Bước 2: Thông Tin Doanh Nghiệp & Sản Phẩm</h2>
                  <p className="text-xs text-gray-400">Liên kết pháp nhân doanh nghiệp để xây dựng uy tín giao thương</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs text-gray-300 font-semibold mb-1 block">Tên Doanh Nghiệp / Công Ty</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    className="input-glass"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-semibold mb-1 block">Mã Số Thuế (Xác thực Verified Profile)</label>
                  <input
                    type="text"
                    defaultValue="4201889988"
                    className="input-glass font-mono text-cyan-300"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">
                  Quay Lại
                </button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1">
                  Tiếp Theo: PDPL Privacy
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white font-['Outfit']">Hoàn Tất Thiết Lập!</h2>
                <p className="text-xs text-gray-300 mt-1">
                  Cài đặt quyền riêng tư PDPL mặc định: Thông tin công khai (Tên, Chức danh, Công ty) sẽ hiển thị khi chạm thẻ. SĐT & Email cá nhân chỉ mở khi 2 bên phê duyệt Consent.
                </p>
              </div>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-left text-xs space-y-2">
                <p className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Bảo Lưu Định Danh Khi Đổi Thẻ NFC:
                </p>
                <p className="text-gray-300">
                  Thẻ NFC physical của bạn đã được gắn kết nối linh hoạt. Nếu làm mất thẻ, bạn có thể cấp thẻ mới mà không mất bất kỳ lịch sử kết nối nào.
                </p>
              </div>

              <button onClick={handleFinish} className="btn-primary w-full shadow-[0_0_25px_rgba(0,229,255,0.35)]">
                Kích Hoạt Thẻ Số & Vào Dashboard
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
