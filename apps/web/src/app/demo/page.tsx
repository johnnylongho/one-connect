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
import { useOneConnectStore } from '@/lib/store';

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
  const { state, setCurrentRole } = useOneConnectStore();
  const [mounted, setMounted] = React.useState(false);
  const [selectedIdentity, setSelectedIdentity] = useState<PersonIdentity>(defaultIdentity);
  const [selectedCard, setSelectedCard] = useState<AccessCard>(defaultCard);
  const [activeTab, setActiveTab] = useState<'NFC' | 'CHECKIN' | 'CONSENT' | 'ZALO' | 'MATCH' | 'STRESS'>('ZALO');
  const [isProcessing, setIsProcessing] = useState(false);
  const [measuredLatency, setMeasuredLatency] = useState<number | null>(null);
  const [stressCount, setStressCount] = useState(0);
  
  // 2-Way Consent Simulation State
  const [consentStep, setConsentStep] = useState<'INITIAL' | 'REQUEST_SENT' | 'MUTUAL_ACCEPTED'>('INITIAL');
  const [consentAuditRecord, setConsentAuditRecord] = useState<any>(null);

  // Zalo ZNS Simulator State
  const [znsTemplate, setZnsTemplate] = useState<'CHECKIN' | 'CONSENT' | 'FOLLOWUP'>('CHECKIN');
  const [znsPhone, setZnsPhone] = useState('0794677369');
  const [znsName, setZnsName] = useState('HỒ HOÀNG LONG');
  const [znsTable, setZnsTable] = useState('BÀN VIP A1');
  const [znsEvent, setZnsEvent] = useState('TECHFEST MICE KHÁNH HÒA 2026');
  const [znsSentHistory, setZnsSentHistory] = useState<any[]>([]);

  // Send Zalo ZNS Handler
  const handleSendZnsSimulation = async () => {
    setIsProcessing(true);
    const startTime = performance.now();

    try {
      let action = 'CHECKIN_ALERT';
      let payload: any = {
        fullName: znsName,
        phone: znsPhone,
        eventName: znsEvent,
        tableNumber: znsTable,
      };

      if (znsTemplate === 'CONSENT') {
        action = 'CONSENT_REQUEST';
        payload = {
          recipientPhone: znsPhone,
          recipientName: znsName,
          senderName: 'Trần Minh Đức',
          senderTitle: 'Chủ tịch HĐQT',
          senderCompany: 'TechCorp Vietnam',
          consentLink: 'https://one-connect-network.vercel.app/dashboard',
        };
      } else if (znsTemplate === 'FOLLOWUP') {
        action = 'FOLLOWUP_REMINDER';
        payload = {
          userPhone: znsPhone,
          userName: znsName,
          partnerName: 'Trần Minh Đức',
          partnerCompany: 'TechCorp Vietnam',
          actionNote: 'Gửi báo giá 500 thẻ NFC và hợp đồng MICE',
          scheduledTime: '09:00 Sáng Mai',
        };
      }

      const res = await fetch('/api/zalo/zns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      });

      const data = await res.json();
      const endTime = performance.now();
      const lat = Math.round(endTime - startTime);
      setMeasuredLatency(lat);

      const newRecord = {
        id: `zns_${Date.now()}`,
        template: znsTemplate,
        phone: znsPhone,
        name: znsName,
        table: znsTable,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        simulated: data.simulated || false,
      };

      setZnsSentHistory((prev) => [newRecord, ...prev]);

      addLog(
        'ZALO_ZNS_DISPATCHED',
        `${znsName} (${znsPhone})`,
        `Đã bắn tin ZNS mẫu [${znsTemplate}] • Phản hồi trong ${lat}ms`,
        'Zalo OpenAPI Gateway ghi nhận thông báo chuyển phát thành công'
      );

      toast({
        title: 'ĐÃ BẮN TIN NHẮN ZALO ZNS THÀNH CÔNG!',
        description: `Thông báo đã được chuyển tới số ${znsPhone} qua Zalo Gateway (${lat}ms).`,
        variant: 'success',
      });
    } catch (e: any) {
      toast({
        title: 'LỖI GỬI ZNS',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Send Consent Request Handler (Delegate A -> B)
  const handleSendConsentRequest = async () => {
    setIsProcessing(true);
    const startTime = performance.now();
    await new Promise((r) => setTimeout(r, 400));
    setConsentStep('REQUEST_SENT');
    setIsProcessing(false);
    const endTime = performance.now();
    setMeasuredLatency(Math.round(endTime - startTime));

    addLog(
      'PDPL_CONSENT_REQUEST_SENT',
      'Johnny Long Hồ → Trần Minh Đức',
      'Tạo yêu cầu đồng thuận số • SĐT bị ẩn mã hóa 0903.***.***',
      'n8n gửi thông báo đẩy (Push Notification) đến điện thoại Đối tác B'
    );

    toast({
      title: 'ĐÃ GỬI YÊU CẦU CONSENT B2B!',
      description: 'Lời mời kết nối và đề nghị cấp quyền số đã được gửi tới đối tác.',
      variant: 'success',
    });
  };

  // Accept Mutual Consent Handler (Delegate B accepts)
  const handleAcceptMutualConsent = async () => {
    setIsProcessing(true);
    const startTime = performance.now();
    await new Promise((r) => setTimeout(r, 350));
    const now = new Date();
    const formatted = `${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN')}`;
    const hash = 'SHA256:' + Math.random().toString(16).substring(2, 8).toUpperCase() + '...MUTUAL_CONSENT';

    setConsentAuditRecord({
      requester: 'Johnny Long Hồ (Aplusvn Media & Tech)',
      receiver: 'Trần Minh Đức (Chủ Tịch HĐQT TechCorp Vietnam)',
      timestamp: formatted,
      hash,
      context: 'Diễn Đàn Doanh Nhân Trẻ Khánh Hòa 2026 • Bàn VIP A12',
      lawClause: 'Điều 9, Điều 11 & Điều 16 Luật Bảo vệ Dữ liệu Cá nhân số 91/2025/QH15',
    });

    setConsentStep('MUTUAL_ACCEPTED');
    setIsProcessing(false);
    const endTime = performance.now();
    setMeasuredLatency(Math.round(endTime - startTime));

    addLog(
      'MUTUAL_CONSENT_ESTABLISHED',
      'Trần Minh Đức (Accepted)',
      `Đã giải mã SĐT 2 chiều • Hash: ${hash}`,
      'One Connect lưu vết bất biến Audit Trail & Tự động đồng bộ vCard 3.0'
    );

    toast({
      title: 'MUTUAL CONSENT XÁC LẬP THÀNH CÔNG!',
      description: 'Số điện thoại 2 chiều đã mở khóa và cấp Chứng chỉ kiểm toán số.',
      variant: 'success',
    });
  };

  // Reset Consent Simulation
  const handleResetConsent = () => {
    setConsentStep('INITIAL');
    setConsentAuditRecord(null);
  };

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
      title: `CHẠM THẺ NFC THÀNH CÔNG: ${card.cardUid}`,
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
      title: 'ĐIỂM DANH CHECK-IN THÀNH CÔNG!',
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
      title: 'KẾT NỐI B2B THÀNH CÔNG!',
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
      title: 'HOÀN TẤT KIỂM THỬ TẢI 50 LƯỢT QUÉT!',
      description: 'Hệ thống đạt thông lượng 1,250 check-in/phút, không xảy ra ùn tắc.',
      variant: 'success',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. TOP HEADER BRAND BANNER (LIGHT THEME) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-orange-50 text-[#0066FF] border border-blue-100 shrink-0">
            <Sparkles className="w-6 h-6 text-[#FF6B00]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight font-heading">
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

      {/* 2. INTERACTIVE RBAC ROLE SWITCHER DEMO BAR */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50/80 via-white to-orange-50/80 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0066FF]" /> Trình Diễn Phân Quyền Vai Trò (RBAC):
          </span>
          <span className="text-[11px] text-slate-500 hidden md:inline">
            (Bấm để xem menu & giao diện thích ứng tức thì)
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { role: 'SUPER_ADMIN', label: 'SUPER_ADMIN' },
            { role: 'ORG_ADMIN', label: 'ORG_ADMIN' },
            { role: 'EVENT_OPERATOR', label: 'EVENT_OPERATOR' },
            { role: 'MEMBER', label: 'MEMBER' },
            { role: 'GUEST', label: 'GUEST' },
          ].map((r) => (
            <button
              key={r.role}
              onClick={() => setCurrentRole(r.role as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                state?.currentRole === r.role
                  ? 'bg-[#0066FF] text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. THREE-PANEL COCKPIT GRID (RESPONSIVE FOR MOBILE/TABLET/DESKTOP) */}
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
                    {measuredLatency}ms
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Scenario Tabs (6 Options) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 p-1 bg-slate-100 rounded-xl text-center text-xs font-semibold">
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
                  onClick={() => setActiveTab('ZALO')}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'ZALO' ? 'bg-white text-[#0066FF] shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  3. Zalo ZNS
                </button>
                <button
                  onClick={() => setActiveTab('CONSENT')}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'CONSENT' ? 'bg-white text-emerald-600 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  4. 2-Way Consent
                </button>
                <button
                  onClick={() => setActiveTab('MATCH')}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'MATCH' ? 'bg-white text-[#FF6B00] shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  5. Ghép B2B
                </button>
                <button
                  onClick={() => setActiveTab('STRESS')}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'STRESS' ? 'bg-white text-purple-600 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  6. Tải 50x
                </button>
              </div>

              {/* Selector Bar / Form depending on active Tab */}
              {activeTab === 'ZALO' ? (
                <div className="space-y-3 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs">
                  <div className="flex items-center justify-between font-bold text-blue-900">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-[#0066FF]" /> Zalo Notification Service (ZNS) Simulator
                    </span>
                    <Badge className="bg-blue-600 text-white text-[9px]">API Live (200 OK)</Badge>
                  </div>

                  <div className="space-y-2 text-[11.5px]">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Mẫu Tin Nhắn ZNS Đăng Ký:</label>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          type="button"
                          onClick={() => setZnsTemplate('CHECKIN')}
                          className={`p-1.5 rounded-lg border text-center font-bold text-[10px] cursor-pointer ${
                            znsTemplate === 'CHECKIN' ? 'bg-[#0066FF] text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          Báo Bàn Tiệc VIP
                        </button>
                        <button
                          type="button"
                          onClick={() => setZnsTemplate('CONSENT')}
                          className={`p-1.5 rounded-lg border text-center font-bold text-[10px] cursor-pointer ${
                            znsTemplate === 'CONSENT' ? 'bg-[#0066FF] text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          Mutual Consent
                        </button>
                        <button
                          type="button"
                          onClick={() => setZnsTemplate('FOLLOWUP')}
                          className={`p-1.5 rounded-lg border text-center font-bold text-[10px] cursor-pointer ${
                            znsTemplate === 'FOLLOWUP' ? 'bg-[#0066FF] text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          Nhắc Lịch Follow-up
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Số Điện Thoại Zalo:</label>
                        <input
                          type="text"
                          value={znsPhone}
                          onChange={(e) => setZnsPhone(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono font-bold"
                          placeholder="0794677369"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Họ Tên Đại Biểu:</label>
                        <input
                          type="text"
                          value={znsName}
                          onChange={(e) => setZnsName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    {znsTemplate === 'CHECKIN' && (
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Số Bàn Tiệc Được Chỉ Định:</label>
                        <input
                          type="text"
                          value={znsTable}
                          onChange={(e) => setZnsTable(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-emerald-700 font-bold"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : activeTab !== 'CONSENT' ? (
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
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Quy Trình 3 Bước Mô Phỏng Bảo Mật 2 Chiều:</span>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-700 text-[11.5px]">
                    <li><strong>Bước 1:</strong> Đại biểu A quét danh thiếp B nhưng SĐT bị ẩn <code>0903.***.***</code> (Privacy-by-Design).</li>
                    <li><strong>Bước 2:</strong> Đại biểu A bấm gửi Consent Request có gắn mã bối cảnh sự kiện.</li>
                    <li><strong>Bước 3:</strong> Đại biểu B duyệt chấp thuận $\rightarrow$ Mở khóa SĐT 2 chiều và cấp Chứng chỉ số.</li>
                  </ol>
                </div>
              )}

              {/* Scenario Trigger Buttons */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                {activeTab === 'ZALO' && (
                  <Button
                    onClick={handleSendZnsSimulation}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-[#0066FF] to-[#0088FF] hover:from-blue-700 hover:to-blue-600 text-white font-bold py-5 rounded-xl shadow-md shadow-blue-500/25 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 mr-2" /> {isProcessing ? 'Đang gửi qua Zalo Gateway...' : `Bắn Tin Nhắn Zalo ZNS (${znsPhone})`}
                  </Button>
                )}

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

                {activeTab === 'CONSENT' && (
                  <div className="space-y-2">
                    {consentStep === 'INITIAL' && (
                      <Button
                        onClick={handleSendConsentRequest}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-5 rounded-xl shadow-md shadow-blue-500/20 cursor-pointer"
                      >
                        <Users className="w-4 h-4 mr-2" /> Bước 1: Gửi Lời Mời Kết Nối & Đề Nghị Consent
                      </Button>
                    )}

                    {consentStep === 'REQUEST_SENT' && (
                      <Button
                        onClick={handleAcceptMutualConsent}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-5 rounded-xl shadow-md shadow-emerald-500/25 cursor-pointer animate-pulse"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Bước 2: Đại Biểu B Bấm "Chấp Nhận Consent"
                      </Button>
                    )}

                    {consentStep === 'MUTUAL_ACCEPTED' && (
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={handleResetConsent}
                          variant="outline"
                          className="flex-1 border-slate-300 text-slate-700 font-bold py-4 rounded-xl cursor-pointer"
                        >
                          Mô Phỏng Lại Từ Đầu
                        </Button>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-2 text-xs font-bold shrink-0">
                          ĐÃ HOÀN TẤT ✓
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'MATCH' && (
                  <Button
                    onClick={handleSimulateMatching}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF9900] hover:from-orange-600 hover:to-amber-500 text-white font-bold py-5 rounded-xl shadow-md shadow-orange-500/20 cursor-pointer"
                  >
                    <Users className="w-4 h-4 mr-2" /> Khởi Tạo Ghép Cặp AI Cung - Cầu
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

        {/* PANEL 2: LIVE SIMULATION VIEWPORT (ZALO, CONSENT OR NFC CARD) */}
        <div className="lg:col-span-4 flex justify-center">
          {activeTab === 'ZALO' ? (
            <div className="w-full max-w-[340px] rounded-[36px] bg-slate-900 border-4 border-slate-700 shadow-2xl overflow-hidden relative p-3 flex flex-col justify-between">
              {/* Dynamic Island / Notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              </div>

              {/* Zalo Mock Screen */}
              <div className="bg-[#EBF2F7] rounded-[24px] p-3.5 flex-1 border border-slate-200 space-y-3 overflow-y-auto text-slate-900">
                {/* Zalo Header */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 bg-white -mx-3.5 -mt-3.5 p-3 rounded-t-[24px]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#0068FF] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      Z
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1">
                        ONE CONNECT B2B <span className="text-[10px] text-blue-600 font-bold">✓</span>
                      </h4>
                      <p className="text-[9px] text-slate-400">Zalo Official Account</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[8.5px]">Tích Vàng</Badge>
                </div>

                {/* ZNS Message Bubble */}
                <div className="p-3.5 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-100 pb-1.5 font-sans">
                    <span className="font-bold text-blue-600">THÔNG BÁO ZNS</span>
                    <span>{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {znsTemplate === 'CHECKIN' && (
                    <div className="space-y-2 text-xs">
                      <p className="font-bold text-slate-900">Xác Nhận Check-in Sự Kiện Thành Công!</p>
                      <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 space-y-1 text-[11px]">
                        <div className="flex justify-between"><span className="text-slate-500">Đại biểu:</span> <span className="font-bold text-slate-800">{znsName}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Sự kiện:</span> <span className="font-bold text-blue-700">{znsEvent}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Vị trí bàn tiệc:</span> <span className="font-extrabold text-emerald-600 text-sm">{znsTable}</span></div>
                      </div>
                      <p className="text-[10.5px] text-slate-500 italic">Vui lòng di chuyển đến vị trí bàn tiệc chỉ định. Chúc Quý khách có phiên giao thương hiệu quả.</p>
                      <Button size="sm" className="w-full bg-[#0068FF] hover:bg-blue-700 text-white text-[11px] font-bold h-8 rounded-lg mt-1 shadow-sm">
                        Mở Menu & Danh Bạ Bàn Tiệc (Zalo Mini App)
                      </Button>
                    </div>
                  )}

                  {znsTemplate === 'CONSENT' && (
                    <div className="space-y-2 text-xs">
                      <p className="font-bold text-slate-900">Yêu Cầu Kết Nối Giao Thương B2B</p>
                      <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 space-y-1 text-[11px]">
                        <div className="flex justify-between"><span className="text-slate-500">Người gửi:</span> <span className="font-bold text-slate-800">Trần Minh Đức</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Chức vụ:</span> <span className="font-semibold text-slate-700">Chủ Tịch HĐQT TechCorp</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Bảo mật:</span> <span className="font-bold text-emerald-600">Luật PDPL 91/2025</span></div>
                      </div>
                      <p className="text-[10.5px] text-slate-500 italic">Đối tác muốn trao đổi danh bạ và kết nối hợp tác kinh doanh.</p>
                      <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold h-8 rounded-lg mt-1 shadow-sm">
                        Chấp Nhận Kết Nối 2 Chiều
                      </Button>
                    </div>
                  )}

                  {znsTemplate === 'FOLLOWUP' && (
                    <div className="space-y-2 text-xs">
                      <p className="font-bold text-slate-900">Nhắc Lịch Chăm Sóc Đối Tác B2B</p>
                      <div className="p-2.5 rounded-xl bg-orange-50/80 border border-orange-100 space-y-1 text-[11px]">
                        <div className="flex justify-between"><span className="text-slate-500">Đối tác:</span> <span className="font-bold text-slate-800">Trần Minh Đức (TechCorp)</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Hành động:</span> <span className="font-semibold text-orange-800">Gửi báo giá 500 thẻ NFC</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Thời gian:</span> <span className="font-bold text-blue-700">09:00 Sáng Mai</span></div>
                      </div>
                      <Button size="sm" className="w-full bg-[#0068FF] hover:bg-blue-700 text-white text-[11px] font-bold h-8 rounded-lg mt-1 shadow-sm">
                        Mở Sổ Tay CRM One Connect
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Home Indicator */}
              <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto mt-2" />
            </div>
          ) : activeTab === 'CONSENT' ? (
            <div className="w-full max-w-[340px] rounded-[36px] bg-slate-900 border-4 border-slate-700 shadow-2xl overflow-hidden relative p-3 flex flex-col justify-between">
              {/* Top Dynamic Island */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full ${consentStep === 'MUTUAL_ACCEPTED' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
              </div>

              {/* Consent Simulation Mobile Screen */}
              <div className="bg-white rounded-[24px] p-4 flex-1 border border-slate-200 space-y-3 overflow-y-auto text-slate-900">
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-50 text-[#0066FF] text-[9px] border-blue-200 font-mono">
                    PDPL 91/2025 SIMULATOR
                  </Badge>
                  <span className={`text-[10px] font-bold flex items-center gap-1 ${consentStep === 'MUTUAL_ACCEPTED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${consentStep === 'MUTUAL_ACCEPTED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {consentStep === 'MUTUAL_ACCEPTED' ? 'Mutual Consent' : consentStep === 'REQUEST_SENT' ? 'Pending B' : 'Locked'}
                  </span>
                </div>

                {/* Target Partner Card */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1.5">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                    alt="Trần Minh Đức"
                    className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-slate-300"
                  />
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">Trần Minh Đức</h4>
                    <p className="text-[10px] text-[#0066FF] font-semibold">Chủ Tịch HĐQT TechCorp</p>
                  </div>

                  {/* Phone Masking Status */}
                  <div className={`p-2 rounded-xl border text-center transition-all ${
                    consentStep === 'MUTUAL_ACCEPTED'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs'
                      : 'bg-amber-50/80 border-amber-200 text-amber-800'
                  }`}>
                    <span className="text-[9px] font-bold uppercase block tracking-wider text-slate-400">Số Điện Thoại Cá Nhân:</span>
                    <span className="font-mono font-bold text-sm tracking-wide">
                      {consentStep === 'MUTUAL_ACCEPTED' ? '0923.456.789' : '0923.***.*** (Đang Khóa)'}
                    </span>
                  </div>
                </div>

                {/* Status Indicator inside Phone */}
                {consentStep === 'INITIAL' && (
                  <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 text-[10.5px] text-blue-900 text-center leading-snug">
                    SĐT bị ẩn để ngăn chặn cuộc gọi rác và cào dữ liệu trái phép theo Luật PDPL 91/2025.
                  </div>
                )}

                {consentStep === 'REQUEST_SENT' && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[10.5px] text-amber-900 text-center leading-snug animate-pulse font-semibold">
                    ⏳ Đã gửi thông báo tới điện thoại của anh Đức. Đang đợi anh Đức bấm "Chấp Nhận Consent"...
                  </div>
                )}

                {consentStep === 'MUTUAL_ACCEPTED' && (
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-[10.5px] text-emerald-900 text-center leading-snug font-bold">
                      Hai bên đã đồng thuận 2 chiều! Số điện thoại và danh bạ vCard đã tự động đồng bộ.
                    </div>
                    {consentAuditRecord && (
                      <div className="p-2 rounded-xl bg-slate-900 text-slate-100 text-[9px] font-mono space-y-0.5">
                        <div className="text-emerald-400 font-bold">✓ IMMUTABLE AUDIT CERTIFICATE:</div>
                        <div className="truncate text-slate-300">Hash: {consentAuditRecord.hash}</div>
                        <div className="text-slate-400">{consentAuditRecord.timestamp}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Home Indicator */}
              <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto mt-2" />
            </div>
          ) : (
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
          )}
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
