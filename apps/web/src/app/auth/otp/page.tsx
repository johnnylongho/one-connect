'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Smartphone, CheckCircle2, ShieldCheck, ArrowRight, Lock } from 'lucide-react';

export default function OtpAuthPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('0908123456');
  const [otp, setOtp] = useState(['8', '8', '8', '8', '8', '8']);
  const [sent, setSent] = useState(true);
  const [verifying, setVerifying] = useState(false);

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      router.push('/onboarding');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white">
      <Navbar />

      <main className="app-container max-w-md space-y-6 pt-6">
        <div className="glass-panel p-8 space-y-6 text-center border-cyan-500/30">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Smartphone className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white font-heading">Xác Thực OTP (SCR-A02)</h2>
            <p className="text-xs text-gray-400 mt-1">
              Đăng nhập ma sát tối thiểu với Mã Xác Thực OTP gửi qua Zalo / SMS
            </p>
          </div>

          <div className="space-y-4 text-left">
            <div>
              <label className="text-xs text-gray-400 font-semibold mb-1 block">Số Điện Thoại Doanh Nhân</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="input-glass font-mono text-cyan-300"
              />
            </div>

            {sent && (
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-semibold flex items-center justify-between">
                  <span>Nhập 6 Số OTP (Mẫu: 888888)</span>
                  <span className="text-cyan-400 text-[11px] font-mono">Hết hạn sau 59s</span>
                </label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={e => {
                        const newOtp = [...otp];
                        newOtp[idx] = e.target.value;
                        setOtp(newOtp);
                      }}
                      className="w-12 h-12 text-center text-xl font-bold font-mono bg-white/5 border border-cyan-500/40 rounded-xl focus:border-cyan-400 focus:outline-none text-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.15)]"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleVerify}
            disabled={verifying}
            className="btn-primary w-full shadow-[0_0_20px_rgba(0,229,255,0.3)]"
          >
            {verifying ? 'Đang Kiểm Tra Mã OTP...' : 'Xác Nhận & Tiếp Tục (Onboarding)'} <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Tuân thủ quy định bảo mật xác thực 2 lớp PDPL
          </div>
        </div>
      </main>
    </div>
  );
}
