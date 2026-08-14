'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import BusinessCard3D from '@/components/BusinessCard3D';
import { useOneConnectStore } from '@/lib/store';
import { CreditCard, RefreshCw, ShieldCheck, CheckCircle2, QrCode, Smartphone, Zap } from 'lucide-react';

export default function MyDigitalCardPage() {
  const { currentIdentity, currentCard, reissueCard } = useOneConnectStore();

  return (
    <div className="min-h-screen bg-[#07090e] text-white">
      <Navbar />

      <main className="app-container max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-cyan-400" /> Thẻ Số Cá Nhân (SCR-B01)
            </h1>
            <p className="text-xs text-gray-400">
              Quản lý thẻ NFC physical và mã Dynamic QR Code cá nhân
            </p>
          </div>
          <span className="badge-cyan py-1 px-3">
            CARD UID: {currentCard?.cardUid || 'ACTIVE'}
          </span>
        </div>

        {/* 3D Interactive Card Preview */}
        <div className="glass-panel p-8 text-center space-y-6 border-cyan-500/30">
          {currentIdentity && (
            <BusinessCard3D
              identity={currentIdentity}
              card={currentCard}
              onReissueCard={() => {
                const newCard = reissueCard();
                alert(`ĐÃ CẤP THẺ NFC MỚI (${newCard.cardUid})! Lịch sử dữ liệu và danh bạ kết nối của bạn được bảo toàn 100%.`);
              }}
            />
          )}

          {/* Card Continuity Explanation Box */}
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl text-left space-y-2 text-xs">
            <h4 className="font-bold text-purple-300 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-purple-400" /> Cơ Chế Card Replacement Continuity:
            </h4>
            <p className="text-gray-300">
              Theo kiến trúc cơ sở dữ liệu One Connect, UID thẻ NFC được quản lý độc lập với tài khoản người dùng tại bảng <code className="text-cyan-300 font-mono">access_cards</code>. Khi đổi thẻ physical mới, hệ thống chỉ cập nhật liên kết thẻ mà <strong>không làm gián đoạn bất kỳ dữ liệu kết nối nào</strong>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
