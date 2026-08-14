'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useOneConnectStore } from '@/lib/store';
import { Settings, ShieldCheck, RefreshCw, Lock, Eye, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export default function SettingsAndPrivacyPage() {
  const { state, updatePrivacy, reissueCard, currentCard } = useOneConnectStore();
  const privacy = state.privacy;

  const [profileVis, setProfileVis] = useState(privacy.profileVisibility);
  const [contactVis, setContactVis] = useState(privacy.contactVisibility);
  const [copiedAudit, setCopiedAudit] = useState(false);

  const handleSavePrivacy = () => {
    updatePrivacy({
      profileVisibility: profileVis,
      contactVisibility: contactVis,
    });
    alert('Đã cập nhật cài đặt riêng tư PDPL thành công!');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white">
      <Navbar />

      <main className="app-container max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Settings className="w-6 h-6 text-cyan-400" /> Cài Đặt & Tuân Thủ PDPL (SCR-B05)
          </h1>
          <p className="text-xs text-gray-400">
            Quản lý quyền riêng tư hồ sơ cá nhân, cấp đổi thẻ NFC & quyền chủ quyền dữ liệu
          </p>
        </div>

        {/* Card Replacement Continuity Block */}
        <div className="glass-panel p-6 space-y-4 border-cyan-500/30">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2 font-['Outfit']">
              <RefreshCw className="w-5 h-5 text-purple-400" /> Card Replacement Continuity (Đổi Thẻ An Toàn)
            </h3>
            <span className="badge-purple">NFC UID: {currentCard?.cardUid || 'ACTIVE'}</span>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            Nếu bạn đánh mất thẻ NFC physical hoặc nâng cấp thẻ mới, hãy bấm nút dưới đây. Thẻ cũ sẽ bị thu hồi và thẻ mới sẽ được liên kết vào tài khoản mà <strong>không làm mất bất kỳ dữ liệu kết nối hay lịch sử sự kiện nào</strong>.
          </p>

          <button
            onClick={() => {
              const card = reissueCard();
              alert(`Đã cấp thẻ mới thành công! Mã UID mới: ${card.cardUid}`);
            }}
            className="btn-primary text-xs py-2.5 px-4 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            <RefreshCw className="w-4 h-4 text-purple-300" /> Thu Hồi Thẻ Cũ & Cấp Thẻ NFC Mới
          </button>
        </div>

        {/* PDPL Privacy Controls */}
        <div className="glass-panel p-6 space-y-5 border-cyan-500/30">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2 font-['Outfit']">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Cài Đặt Khả Năng Hiển Thị PDPL (Law 91/2025/QH15)
            </h3>
            <span className="badge-emerald">COMPLIANT</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-gray-300 font-semibold mb-1 block">Khả năng hiển thị Hồ Sơ Số (Digital Profile)</label>
              <select
                value={profileVis}
                onChange={e => setProfileVis(e.target.value as any)}
                className="input-glass"
              >
                <option value="PUBLIC">Công Khai (Hiển thị đầy đủ khi chạm thẻ / quét QR)</option>
                <option value="MEMBERS_ONLY">Chỉ Thành Viên Trong Cùng Hội/CLB</option>
                <option value="PRIVATE">Riêng Tư (Chỉ hiển thị tên & chức danh)</option>
              </select>
            </div>

            <div>
              <label className="text-gray-300 font-semibold mb-1 block">Khả năng hiển thị Thông Tin Liên Hệ (SĐT & Email)</label>
              <select
                value={contactVis}
                onChange={e => setContactVis(e.target.value as any)}
                className="input-glass"
              >
                <option value="MEMBERS_ONLY">Chỉ Khi 2 Bên Đã Xác Nhận Consent (Khuyên Dùng)</option>
                <option value="PUBLIC">Công Khai Cho Mọi Người</option>
                <option value="PRIVATE">Chỉ Mình Tôi</option>
              </select>
            </div>

            <button onClick={handleSavePrivacy} className="btn-primary text-xs py-2 px-4">
              <CheckCircle2 className="w-4 h-4" /> Lưu Cài Đặt Riêng Tư PDPL
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
