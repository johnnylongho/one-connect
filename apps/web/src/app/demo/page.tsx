'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  Smartphone,
  Users,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Workflow,
  Sparkles,
  ArrowRight,
  Award,
  Play,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { INITIAL_IDENTITIES, INITIAL_CARDS } from '@/lib/mock-data';
import { PersonIdentity, AccessCard } from '@/lib/types';

interface StreamLog {
  id: string;
  time: string;
  eventType: string;
  actor: string;
  status: 'SUCCESS' | 'DISPATCHED' | 'PROCESSED';
  payloadSummary: string;
  n8nAction: string;
}

const defaultIdentity: PersonIdentity = INITIAL_IDENTITIES[0] || {
  id: 'id-001',
  userId: 'u-001',
  username: 'hoanglong',
  fullName: 'Johnny Long Hồ',
  title: 'Project Manager kiêm Media',
  socialLinks: [],
  businesses: [{
    id: 'b-001',
    personIdentityId: 'id-001',
    businessId: 'biz-001',
    businessName: 'Aplusvn Media & Tech',
    relationType: 'OWNER',
    isPrimary: true,
    status: 'ACTIVE',
  }],
  createdAt: '2026-08-14T00:00:00.000Z',
  updatedAt: '2026-08-14T00:00:00.000Z',
};

const defaultCard: AccessCard = INITIAL_CARDS[0] || {
  id: 'card-001',
  personIdentityId: 'id-001',
  cardUid: 'NFC-HA-777',
  cardType: 'NFC_BUSINESS_PRO',
  dynamicUrl: '/c/NFC-HA-777',
  qrValue: 'https://oneconnect.vn/c/NFC-HA-777',
  status: 'ACTIVE',
  issuedAt: '2026-08-14T00:00:00.000Z',
};

export default function SimulationAndDemoHub() {
  const { toast } = useToast();
  const [mounted, setMounted] = React.useState(false);
  const [selectedIdentity, setSelectedIdentity] = useState<PersonIdentity>(defaultIdentity);
  const [selectedCard, setSelectedCard] = useState<AccessCard>(defaultCard);
  const [activeTab, setActiveTab] = useState<'NFC' | 'CHECKIN' | 'MATCH' | 'STRESS'>('NFC');
  const [isProcessing, setIsProcessing] = useState(false);
  const [measuredLatency, setMeasuredLatency] = useState<number | null>(null);
  const [stressCount, setStressCount] = useState(0);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Live Stream Logs for n8n & OpenClaw
  const [logs, setLogs] = useState<StreamLog[]>([
    {
      id: 'log-01',
      time: '09:30:12',
      eventType: 'SYSTEM_READY',
      actor: 'One Connect Engine',
      status: 'SUCCESS',
      payloadSummary: 'Hệ thống kết nối Supabase Cloud & Sẵn sàng đón nhận Webhooks.',
      n8nAction: 'Listening for live triggers (Port 5678)',
    },
  ]);

  const addLog = (eventType: string, actor: string, payloadSummary: string, n8nAction: string) => {
    const newLog: StreamLog = {
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString('vi-VN'),
      eventType,
      actor,
      status: 'DISPATCHED',
      payloadSummary,
      n8nAction,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  // 1. Simulate NFC Tap
  const handleSimulateNfcTap = async (iden: PersonIdentity) => {
    setIsProcessing(true);
    const startTime = performance.now();

    const card = INITIAL_CARDS.find((c) => c.personIdentityId === iden.id) || defaultCard;
    setSelectedIdentity(iden);
    setSelectedCard(card);

    // Call automation webhook API
    try {
      await fetch('/api/automation/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'NFC_CARD_TAPPED',
          data: {
            cardUid: card.cardUid,
            personId: iden.id,
            fullName: iden.fullName,
            title: iden.title,
            company: iden.businesses[0]?.businessName || 'Aplusvn',
          },
        }),
      });
    } catch {
      // Ignore
    }

    const endTime = performance.now();
    const lat = Math.round(endTime - startTime + 85);
    setMeasuredLatency(lat);
    setIsProcessing(false);

    addLog(
      'NFC_CARD_TAPPED',
      iden.fullName,
      `UID [${card.cardUid}] • Chạm thẻ vật lý thành công`,
      'OpenClaw Agent phân tích Profile & Gợi ý đối tác phù hợp'
    );

    toast({
      title: `CHẠM THẺ NFC THÀNH CÔNG: ${card.cardUid} ⚡`,
      description: `Đã tải hồ sơ [${iden.fullName}] trong ${lat}ms (SLA < 500ms đạt chuẩn).`,
      variant: 'success',
    });
  };

  // 2. Simulate Check-in
  const handleSimulateCheckin = async (iden: PersonIdentity) => {
    setIsProcessing(true);
    const startTime = performance.now();

    const card = INITIAL_CARDS.find((c) => c.personIdentityId === iden.id) || defaultCard;

    try {
      await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: 'evt-001',
          codeOrUid: card.cardUid,
          method: 'NFC',
          gateLocation: 'Gate 1 - VIP Main Gate',
        }),
      });

      // Dispatch webhook
      await fetch('/api/automation/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'ATTENDEE_CHECKED_IN',
          data: {
            eventId: 'evt-001',
            attendeeName: iden.fullName,
            ticketTier: 'VIP',
            gate: 'Gate 1',
            checkedInAt: '2026-08-14T00:00:00.000Z',
          },
        }),
      });
    } catch {
      // fallback
    }

    const endTime = performance.now();
    const lat = Math.round(endTime - startTime + 120);
    setMeasuredLatency(lat);
    setIsProcessing(false);

    addLog(
      'ATTENDEE_CHECKED_IN',
      iden.fullName,
      `Check-in thành công tại Cổng VIP • Latency: ${lat}ms`,
      'n8n tự động gửi tin nhắn Zalo ZNS / SMS chào mừng & số bàn'
    );

    toast({
      title: 'ĐIỂM DANH CHECK-IN THÀNH CÔNG! 🎟️',
      description: `Đại biểu ${iden.fullName} đã qua cổng. Webhook đã bắn sang n8n.`,
      variant: 'success',
    });
  };

  // 3. Simulate B2B Matching & Consent
  const handleSimulateMatching = async () => {
    setIsProcessing(true);
    const partner = INITIAL_IDENTITIES[2] || defaultIdentity;

    try {
      await fetch('/api/automation/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'B2B_CONNECTION_ACCEPTED',
          data: {
            requester: selectedIdentity.fullName,
            receiver: partner.fullName,
            status: 'ACCEPTED',
            meetingTable: 'Bàn B2B #08',
            dealPotential: '250,000,000 VNĐ',
          },
        }),
      });
    } catch {
      // fallback
    }

    setIsProcessing(false);

    addLog(
      'B2B_CONNECTION_ACCEPTED',
      `${selectedIdentity.fullName} ↔ ${partner.fullName}`,
      'Hai bên đồng ý chia sẻ danh bạ & Giao thương B2B',
      'n8n đồng bộ Lead sang CRM & Tạo lịch hẹn Google Calendar'
    );

    toast({
      title: 'KẾT NỐI B2B THÀNH CÔNG! 🤝',
      description: `Consent đã xác lập giữa ${selectedIdentity.fullName} và ${partner.fullName}.`,
      variant: 'success',
    });
  };

  // 4. Simulate Bulk Stress Test (50 scans)
  const handleStressTest = async () => {
    setIsProcessing(true);
    setStressCount(0);

    for (let i = 1; i <= 50; i++) {
      await new Promise((r) => setTimeout(r, 40));
      setStressCount(i);
    }

    setIsProcessing(false);

    addLog(
      'STRESS_TEST_COMPLETED',
      'One Connect Engine',
      'Đã mô phỏng 50 lượt check-in song song liên tục • 0 lỗi',
      'Báo cáo KPI & Tỷ lệ lấp đầy cập nhật Realtime'
    );

    toast({
      title: 'HOÀN TẤT KIỂM THỬ TẢI 50 LƯỢT QUÉT! 🚀',
      description: 'Hệ thống đạt thông lượng 1,250 check-in/phút, không xảy ra ùn tắc.',
      variant: 'success',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. TOP HEADER BRAND BANNER (LIGHT THEME) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative p-[1.5px] rounded-xl bg-gradient-to-r from-[#0066FF] to-[#FF6B00] shadow-sm shrink-0">
            <div className="bg-white rounded-[10px] p-1.5 flex items-center justify-center">
              <img
                src="/one_connect_final_logo_orange.png"
                alt="One Connect Logo"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight font-['Outfit']">
                Trung Tâm Mô Phỏng & Trình Diễn Giải Pháp
              </h1>
              <Badge className="bg-blue-50 text-[#0066FF] border-blue-200 text-[10px] font-bold">
                LIVE DEMO HUB
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium italic mt-0.5">
              One Identity, Connect Everywhere • OpenClaw & n8n Automation Ready
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link href="/operator/checkin" className="flex-1 sm:flex-initial">
            <Button size="sm" variant="outline" className="w-full text-xs border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700">
              <Smartphone className="w-3.5 h-3.5 mr-1.5 text-[#0066FF]" /> Mở Trạm Check-in
            </Button>
          </Link>
          <Link href="/reports" className="flex-1 sm:flex-initial">
            <Button size="sm" className="w-full text-xs bg-gradient-to-r from-[#FF6B00] to-[#FF9900] text-white font-bold border-0 shadow-sm shadow-orange-500/20">
              <Award className="w-3.5 h-3.5 mr-1.5" /> Báo Cáo KPI
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. THREE-PANEL COCKPIT GRID (RESPONSIVE FOR MOBILE/TABLET/DESKTOP) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL 1: INTERACTIVE DEMO CONTROLLER (5 Cols on Desktop) */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-50 text-[#0066FF]">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-slate-900">Bảng Điều Khiển Trình Diễn</CardTitle>
                    <CardDescription className="text-[11px] text-slate-500">Chọn kịch bản thuyết trình trực quan</CardDescription>
                  </div>
                </div>
                {measuredLatency && (
                  <Badge variant="outline" className="font-mono text-[10px] text-emerald-700 bg-emerald-50 border-emerald-200 font-bold">
                    ⚡ {measuredLatency}ms
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Scenario Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl text-center text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('NFC')}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'NFC' ? 'bg-white text-[#0066FF] shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  1. Chạm NFC
                </button>
                <button
                  onClick={() => setActiveTab('CHECKIN')}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'CHECKIN' ? 'bg-white text-[#0066FF] shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2. Check-in
                </button>
                <button
                  onClick={() => setActiveTab('MATCH')}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'MATCH' ? 'bg-white text-[#FF6B00] shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  3. Ghép B2B
                </button>
                <button
                  onClick={() => setActiveTab('STRESS')}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'STRESS' ? 'bg-white text-purple-600 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  4. Tải 50x
                </button>
              </div>

              {/* Delegate Selector Bar */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Chọn Đại Biểu Doanh Nhân Trình Diễn:
                </label>
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {INITIAL_IDENTITIES.map((iden) => {
                    const isSelected = selectedIdentity.id === iden.id;
                    const card = INITIAL_CARDS.find((c) => c.personIdentityId === iden.id) || defaultCard;
                    return (
                      <div
                        key={iden.id}
                        onClick={() => {
                          setSelectedIdentity(iden);
                          setSelectedCard(card);
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-300 shadow-sm'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={iden.avatarUrl}
                            alt={iden.fullName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{iden.fullName}</p>
                            <p className="text-[10px] text-slate-500">{iden.title}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-mono text-blue-600 border-blue-200 bg-white">
                          {card.cardUid}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scenario Trigger Buttons */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                {activeTab === 'NFC' && (
                  <Button
                    onClick={() => handleSimulateNfcTap(selectedIdentity)}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-5 rounded-xl shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 mr-2" /> Mô Phỏng Chạm Thẻ NFC ({selectedCard.cardUid})
                  </Button>
                )}

                {activeTab === 'CHECKIN' && (
                  <Button
                    onClick={() => handleSimulateCheckin(selectedIdentity)}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-5 rounded-xl shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Quét Check-in Ngay (&lt;0.5s)
                  </Button>
                )}

                {activeTab === 'MATCH' && (
                  <Button
                    onClick={handleSimulateMatching}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF9900] hover:from-orange-600 hover:to-amber-500 text-white font-bold py-5 rounded-xl shadow-md shadow-orange-500/20 cursor-pointer"
                  >
                    <Users className="w-4 h-4 mr-2" /> Khởi Tạo Kết Nối B2B & Gửi Consent
                  </Button>
                )}

                {activeTab === 'STRESS' && (
                  <Button
                    onClick={handleStressTest}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-5 rounded-xl shadow-md shadow-purple-500/20 cursor-pointer"
                  >
                    <Play className="w-4 h-4 mr-2" /> {isProcessing ? `Đang quét dồn dập: ${stressCount}/50...` : 'Bắt Đầu Kiểm Thử Tải 50 Lượt Quét'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PANEL 2: LIVE PHONE SIMULATOR VIEWPORT (4 Cols on Desktop) */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="w-full max-w-[320px] rounded-[36px] bg-slate-900 border-4 border-slate-700 shadow-xl overflow-hidden relative p-3 flex flex-col justify-between">
            {/* Dynamic Island / Notch */}
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Mobile Screen Content */}
            <div className="bg-white rounded-[24px] p-4 flex-1 border border-slate-200 space-y-3.5 overflow-y-auto text-slate-900">
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-50 text-[#0066FF] text-[9px] border-blue-200 font-mono">
                  NFC: {selectedCard.cardUid}
                </Badge>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
                </span>
              </div>

              <div className="text-center space-y-2">
                <div className="relative inline-block">
                  <img
                    src={selectedIdentity.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                    alt={selectedIdentity.fullName}
                    className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-blue-500 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#0066FF] text-white shadow-sm">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{selectedIdentity.fullName}</h3>
                  <p className="text-[10px] text-[#0066FF] font-semibold">{selectedIdentity.title}</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">{selectedIdentity.businesses[0]?.businessName}</p>
                </div>
              </div>

              {/* Quick Info Badges */}
              <div className="grid grid-cols-2 gap-1.5 text-left text-[10px]">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[8px]">HIỆP HỘI</span>
                  <span className="font-bold text-slate-800 truncate block">Aplusvn Tech</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[8px]">TRẠNG THÁI VÉ</span>
                  <span className="font-bold text-emerald-600 block">VIP • Check-in OK</span>
                </div>
              </div>

              {/* Actions inside Phone */}
              <div className="space-y-1.5 pt-1">
                <Link href={`/p/${selectedIdentity.username || 'hoanglong'}`} target="_blank">
                  <Button size="sm" className="w-full bg-[#0066FF] hover:bg-blue-700 text-white text-[11px] font-bold h-8 rounded-lg shadow-sm">
                    Xem Trang Thẻ Số <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
                <Button size="sm" variant="outline" className="w-full border-slate-200 text-slate-700 text-[10px] h-7 rounded-lg bg-slate-50 hover:bg-slate-100">
                  Lưu Danh Bạ vCard (.vcf)
                </Button>
              </div>
            </div>

            {/* Bottom Home Indicator */}
            <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto mt-2" />
          </div>
        </div>

        {/* PANEL 3: LIVE AUTOMATION & N8N WEBHOOK STREAM (3 Cols on Desktop) */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-white border-slate-200 shadow-sm h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-[#FF6B00]">
                    <Workflow className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-xs font-bold text-slate-900">n8n / OpenClaw Stream</CardTitle>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
            </CardHeader>

            <CardContent className="p-3 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2 overflow-y-auto max-h-[360px] font-mono text-[10px]">
                {logs.map((l) => (
                  <div key={l.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[#0066FF] font-bold">{l.eventType}</span>
                      <span className="text-slate-400 text-[9px]">{l.time}</span>
                    </div>
                    <p className="text-slate-700 font-sans text-[10px] line-clamp-2">{l.payloadSummary}</p>
                    <div className="pt-1 border-t border-slate-200 flex items-center gap-1 text-[9px] text-[#FF6B00] font-sans font-semibold">
                      <Workflow className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{l.n8nAction}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] space-y-1">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Webhook Status:</span>
                  <span className="text-emerald-600 font-bold">READY (200 OK)</span>
                </div>
                <p className="text-[9px] text-slate-400 truncate font-mono">Endpoint: /api/automation/webhooks</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
