'use client';

import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import BusinessCard3D from '@/components/BusinessCard3D';
import { useOneConnectStore } from '@/lib/store';
import {
  CreditCard,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Smartphone,
  Zap,
  Lock,
  Unlock,
  Radio,
  Plus,
  Search,
  Building2,
  TrendingUp,
  ExternalLink,
  Phone,
  Mail,
  Globe,
  SlidersHorizontal,
  History,
  ShieldAlert,
  ArrowRight,
  Eye,
  EyeOff,
  UserCheck,
  Sparkles,
  Info,
  Edit3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

export interface NfcCardItem {
  id: string;
  uid: string;
  serialNumber: string;
  cardType: string;
  ownerName: string | null;
  companyName: string | null;
  avatarUrl: string | null;
  status: 'ACTIVE' | 'LOCKED' | 'UNASSIGNED';
  tapCount: number;
  lastTappedAt: string | null;
}

const INITIAL_NFC_CARDS: NfcCardItem[] = [
  {
    id: 'nfc-001',
    uid: '04:8F:2A:1B:9C:5D:80',
    serialNumber: 'NFC-2026-APLUS-001',
    cardType: 'Metal NTAG215 (Laser Etched)',
    ownerName: 'Hồ Hoàng Long (Johnny Long Hồ)',
    companyName: 'Tập đoàn Công nghệ số A+ (Aplusvn)',
    avatarUrl: '/avatar-johnny-long.jpg',
    status: 'ACTIVE',
    tapCount: 342,
    lastTappedAt: '10:45 AM (5 phút trước)',
  },
  {
    id: 'nfc-002',
    uid: '04:99:3B:2C:0A:4E:91',
    serialNumber: 'NFC-2026-APLUS-002',
    cardType: 'Metal NTAG215 (Laser Etched)',
    ownerName: 'Trần Minh Đức',
    companyName: 'TechCorp Vietnam Group',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    tapCount: 189,
    lastTappedAt: '09:30 AM (1 giờ trước)',
  },
  {
    id: 'nfc-003',
    uid: '04:A1:4C:3D:1B:5F:A2',
    serialNumber: 'NFC-2026-APLUS-003',
    cardType: 'PVC Standard NTAG215',
    ownerName: 'Lê Hoàng Nam',
    companyName: 'InnovateX Global',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    status: 'LOCKED',
    tapCount: 45,
    lastTappedAt: 'Báo mất thẻ (Hôm qua)',
  },
  {
    id: 'nfc-004',
    uid: '04:B2:5D:4E:2C:60:B3',
    serialNumber: 'NFC-2026-APLUS-004',
    cardType: 'PVC Standard NTAG215',
    ownerName: 'Phạm Phương Anh',
    companyName: 'GlobalBiz Corp',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    tapCount: 98,
    lastTappedAt: '08:15 AM (2 giờ trước)',
  },
  {
    id: 'nfc-005',
    uid: '04:C3:6E:5F:3D:71:C4',
    serialNumber: 'NFC-2026-APLUS-005',
    cardType: 'Metal NTAG215',
    ownerName: null,
    companyName: null,
    avatarUrl: null,
    status: 'UNASSIGNED',
    tapCount: 0,
    lastTappedAt: null,
  },
  {
    id: 'nfc-006',
    uid: '04:D4:7F:60:4E:82:D5',
    serialNumber: 'NFC-2026-APLUS-006',
    cardType: 'PVC Standard NTAG215',
    ownerName: null,
    companyName: null,
    avatarUrl: null,
    status: 'UNASSIGNED',
    tapCount: 0,
    lastTappedAt: null,
  },
];

const DELEGATE_OPTIONS = [
  { id: 'u1', name: 'Nguyễn Thu Hà', company: 'Vina Capital Invest' },
  { id: 'u2', name: 'Đặng Quốc Bảo', company: 'FPT Software & Cloud' },
  { id: 'u3', name: 'Vũ Thị Minh Trang', company: 'Viettel Telecom Solution' },
  { id: 'u4', name: 'Bùi Tuấn Anh', company: 'VinFast Auto Group' },
];

const TAP_LOGS = [
  {
    id: 'tap-1',
    time: '10:45:12 AM',
    device: 'iPhone 15 Pro (CoreNFC)',
    event: 'Diễn đàn Lãnh đạo Doanh nghiệp 2026',
    action: 'Trao đổi Consent 2 Chiều',
    status: 'CONSENT_GRANTED',
  },
  {
    id: 'tap-2',
    time: '10:32:04 AM',
    device: 'Samsung Galaxy S24 (WebNFC)',
    event: 'Diễn đàn Lãnh đạo Doanh nghiệp 2026',
    action: 'Điểm danh Check-in Trạm Cửa',
    status: 'CHECKIN_SUCCESS',
  },
  {
    id: 'tap-3',
    time: '09:15:40 AM',
    device: 'iPhone 14 (CoreNFC)',
    event: 'Diễn đàn Lãnh đạo Doanh nghiệp 2026',
    action: 'Trao đổi Consent 2 Chiều',
    status: 'CONSENT_GRANTED',
  },
  {
    id: 'tap-4',
    time: 'Hôm qua, 16:20',
    device: 'Xiaomi 13 (WebNFC)',
    event: 'Hội nghị Xúc tiến Đầu tư Aplusvn',
    action: 'Xem Hồ sơ Công khai',
    status: 'VIEW_ONLY',
  },
];

export default function DigitalNfcCardPage() {
  const { currentIdentity, currentCard, reissueCard, updateIdentity } = useOneConnectStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Active Sub-Tab
  const [activeTab, setActiveTab] = useState<'my-card' | 'inventory' | 'analytics' | 'pdpl'>('my-card');


  // Inventory & Issuance State
  const [cards, setCards] = useState<NfcCardItem[]>(INITIAL_NFC_CARDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'LOCKED' | 'UNASSIGNED'>('ALL');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDelegateId, setSelectedDelegateId] = useState('');
  const [inputUid, setInputUid] = useState('');
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Tap Simulation State
  const [isSimulatingTap, setIsSimulatingTap] = useState(false);
  const [tapSuccess, setTapSuccess] = useState(false);

  // Edit Profile Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editFullName, setEditFullName] = useState(currentIdentity?.fullName || '');
  const [editDisplayName, setEditDisplayName] = useState(currentIdentity?.displayName || currentIdentity?.fullName || '');
  const [editTitle, setEditTitle] = useState(currentIdentity?.title || '');
  const [editBusinessName, setEditBusinessName] = useState(currentIdentity?.businesses?.[0]?.businessName || '');
  const [editPhone, setEditPhone] = useState(currentIdentity?.phone || '');
  const [editEmail, setEditEmail] = useState(currentIdentity?.email || '');
  const [editBio, setEditBio] = useState(currentIdentity?.bio || '');
  const [editWebsite, setEditWebsite] = useState(currentIdentity?.website || 'https://aplusvn.net');

  const handleOpenEditModal = () => {
    setEditFullName(currentIdentity?.fullName || '');
    setEditDisplayName(currentIdentity?.displayName || currentIdentity?.fullName || '');
    setEditTitle(currentIdentity?.title || '');
    setEditBusinessName(currentIdentity?.businesses?.[0]?.businessName || '');
    setEditPhone(currentIdentity?.phone || '');
    setEditEmail(currentIdentity?.email || '');
    setEditBio(currentIdentity?.bio || '');
    setEditWebsite(currentIdentity?.website || 'https://aplusvn.net');
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentIdentity) return;

    updateIdentity(currentIdentity.id, {
      fullName: editFullName,
      displayName: editDisplayName,
      title: editTitle,
      businessName: editBusinessName,
      phone: editPhone,
      email: editEmail,
      bio: editBio,
      website: editWebsite,
    });

    setIsEditProfileOpen(false);
    showAlert('Đã lưu và cập nhật thành công Hồ sơ Định danh Doanh nhân!', 'success');
  };


  // PDPL Settings State
  const [requireConsent, setRequireConsent] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [maskSensitiveData, setMaskSensitiveData] = useState(true);


  const showAlert = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleToggleCardStatus = (cardId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    setCards((prev) =>
      prev.map((item) => (item.id === cardId ? { ...item, status: nextStatus as any } : item))
    );

    if (nextStatus === 'LOCKED') {
      showAlert(`Đã khóa thẻ [${cardId}] từ xa thành công! Thẻ không thể quét được nữa.`, 'error');
    } else {
      showAlert(`Đã mở khóa và kích hoạt lại thẻ [${cardId}] thành công!`, 'success');
    }
  };

  const handleQuickAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDelegateId || !inputUid) {
      showAlert('Vui lòng chọn đại biểu và nhập/quét mã UID thẻ NFC!', 'error');
      return;
    }

    const selectedDelegate = DELEGATE_OPTIONS.find((d) => d.id === selectedDelegateId);
    const newCard: NfcCardItem = {
      id: `nfc-00${cards.length + 1}`,
      uid: inputUid.toUpperCase(),
      serialNumber: `NFC-2026-APLUS-00${cards.length + 1}`,
      cardType: 'Metal NTAG215 (Laser Etched)',
      ownerName: selectedDelegate?.name || 'Đại biểu Hội viên',
      companyName: selectedDelegate?.company || 'Doanh nghiệp Hội viên',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      tapCount: 1,
      lastTappedAt: 'Vừa kích hoạt',
    };

    setCards((prev) => [newCard, ...prev]);
    setIsAssignModalOpen(false);
    setSelectedDelegateId('');
    setInputUid('');
    showAlert(`Đã gán thành công mã UID [${newCard.uid}] cho ${newCard.ownerName}!`, 'success');
  };

  const handleSimulateUidScan = () => {
    const randomHex = Array.from({ length: 7 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0')
        .toUpperCase()
    ).join(':');
    setInputUid(randomHex);
    showAlert(`Đã nhận diện mã UID NFC từ đầu đọc: ${randomHex}`, 'info');
  };

  const handleTriggerSimulatedTap = () => {
    setIsSimulatingTap(true);
    setTapSuccess(false);

    setTimeout(() => {
      setIsSimulatingTap(false);
      setTapSuccess(true);
      showAlert('⚡ Chạm thẻ NFC 1-chạm thành công (0.42s)! Đã truyền tải Token định danh số.', 'success');
      setTimeout(() => setTapSuccess(false), 3000);
    }, 800);
  };

  const filteredCards = cards.filter((c) => {
    const matchesSearch =
      c.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.ownerName && c.ownerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.companyName && c.companyName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCards = cards.length;
  const activeCount = cards.filter((c) => c.status === 'ACTIVE').length;
  const unassignedCount = cards.filter((c) => c.status === 'UNASSIGNED').length;

  return (
    <div className="space-y-6 pb-12">
      {/* ===================================================================== */}
      {/* 1. TOP HEADER & BREADCRUMB */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
              Tổng quan
            </Link>
            <span>/</span>
            <span className="text-blue-600">Thẻ NFC Doanh Nhân</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
              <CreditCard className="w-6 h-6" />
            </div>
            Thẻ NFC Doanh Nhân & Trạm Cấp Phát
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Quản lý thẻ số cá nhân, kho thẻ vật lý NTAG215/216, cấp phát ghép thẻ và phân tích tương tác NFC 1-chạm
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            onClick={handleOpenEditModal}
            className="gap-2 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-blue-600" />
            Chỉnh Sửa Hồ Sơ
          </Button>

          <Button
            onClick={handleTriggerSimulatedTap}
            variant="outline"
            className="gap-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-sm cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            {isSimulatingTap ? 'Đang chạm NFC...' : 'Mô Phỏng Chạm Thẻ'}
          </Button>

          <Button
            onClick={() => {
              setActiveTab('inventory');
              setIsAssignModalOpen(true);
            }}
            className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 rounded-xl cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Gán Thẻ NFC Mới
          </Button>
        </div>
      </div>


      {/* ALERT NOTIFICATION */}
      {alertMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold animate-in fade-in duration-200 ${
            alertMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : alertMessage.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {alertMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {alertMessage.type === 'error' && <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />}
            {alertMessage.type === 'info' && <Info className="w-4 h-4 text-blue-600 shrink-0" />}
            <span>{alertMessage.text}</span>
          </div>
          <button onClick={() => setAlertMessage(null)} className="text-slate-400 hover:text-slate-700">
            ✕
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. SUB-TABS NAVIGATION (4 TABS) */}
      {/* ===================================================================== */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 overflow-x-auto">
        <button
          onClick={() => setActiveTab('my-card')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'my-card'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>1. Thẻ Định Danh Số Của Tôi</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700">SCR-B01</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>2. Kho Quản Trị & Cấp Phát Thẻ</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">{totalCards}</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <History className="w-4 h-4" />
          <span>3. Lịch Sử Chạm & Phân Tích</span>
        </button>

        <button
          onClick={() => setActiveTab('pdpl')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'pdpl'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>4. Bảo Mật & Tuân Thủ PDPL</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 3. TAB 1: THẺ ĐỊNH DANH SỐ CỦA TÔI (MY DIGITAL CARD) */}
      {/* ===================================================================== */}
      {activeTab === 'my-card' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: 3D Card Interactive Preview */}
          <div className="lg:col-span-7 space-y-5">
            <div className="glass-panel p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Thẻ NFC Executive 3D
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  UID: {currentCard?.cardUid || '04:8F:2A:1B:9C:5D:80'}
                </span>
              </div>

              {/* 3D Card Display */}
              {currentIdentity && (
                <BusinessCard3D
                  identity={currentIdentity}
                  card={currentCard}
                  onReissueCard={() => {
                    const newCard = reissueCard();
                    showAlert(
                      `Đã cấp đổi thẻ NFC mới [${newCard.cardUid}]! Lịch sử dữ liệu và danh bạ của bạn được bảo toàn 100%.`,
                      'success'
                    );
                  }}
                />
              )}

              {/* Simulated Tap Live Reaction Box */}
              {tapSuccess && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-300 flex items-center justify-between animate-in zoom-in-95 duration-200 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black">
                      ⚡
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-900">ĐÃ NHẬN DIỆN THẺ NFC CHẠM GẦN</p>
                      <p className="text-[11px] text-emerald-700">
                        Đang đồng bộ hồ sơ @{currentIdentity?.username || 'johnnylong'} vào thiết bị đối tác
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-600 text-white text-[10px]">0.42s FAST TAP</Badge>
                </div>
              )}

              {/* Card Continuity Explanation Box */}
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-left space-y-2 text-xs">
                <h4 className="font-bold text-purple-900 flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-purple-600" /> Cơ Chế Card Replacement Continuity (Bảo Toàn Quan Hệ):
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  Theo kiến trúc cơ sở dữ liệu One Connect, UID thẻ NFC được quản lý độc lập với tài khoản người dùng tại bảng{' '}
                  <code className="bg-purple-100 text-purple-900 px-1 py-0.5 rounded font-mono font-bold">access_cards</code>.
                  Khi bạn đổi thẻ physical mới, hệ thống chỉ cập nhật liên kết thẻ mà{' '}
                  <strong>không làm gián đoạn bất kỳ dữ liệu kết nối, ghi chú quan hệ hay lịch sử sự kiện nào</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Specs & Business Details */}
          <div className="lg:col-span-5 space-y-5">
            {/* NFC Hardware Specs */}
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-blue-600" /> Thông Số Kỹ Thuật Chip NFC
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ISO 14443-A
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Model Chip:</span>
                  <span className="font-bold text-slate-900">NXP NTAG215 (Laser Etched)</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Dung lượng bộ nhớ:</span>
                  <span className="font-bold text-slate-900 font-mono">504 Bytes (NDEF Ready)</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Tần số hoạt động:</span>
                  <span className="font-bold text-slate-900 font-mono">13.56 MHz (High Frequency)</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Đường dẫn Dynamic:</span>
                  <span className="font-bold text-blue-600 font-mono truncate max-w-[200px]">
                    https://oneconnect.network/p/johnnylong
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Khóa Chống Ghi Đè:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Read-Only Password Protected
                  </span>
                </div>
              </div>
            </div>

            {/* Business Contact Channels Synchronized on Card */}
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" /> Thông Tin Doanh Nghiệp Đồng Bộ
                </h3>
                <Link
                  href="/p/johnny-long"
                  target="_blank"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Xem Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Tập đoàn Công nghệ số A+ (Aplusvn)</p>
                    <p className="text-[11px] text-slate-500">Hội viên Ban Chấp Hành Hiệp Hội Doanh Nghiệp</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-mono font-bold text-slate-800">0903.888.999</span>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-mono font-bold text-slate-800">longhh@aplusvn.com</span>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <Globe className="w-4 h-4 text-orange-600 shrink-0" />
                  <span className="font-mono font-bold text-slate-800">https://aplusvn.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. TAB 2: KHO QUẢN TRỊ & CẤP PHÁT THẺ (INVENTORY & ISSUANCE) */}
      {/* ===================================================================== */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-5 space-y-2 border-l-4 border-l-blue-600">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng Số Thẻ NFC</span>
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                {totalCards} <span className="text-xs font-normal text-slate-500">Thẻ</span>
              </div>
              <p className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                <Radio className="w-3 h-3" /> NXP NTAG215 / NTAG216
              </p>
            </div>

            <div className="glass-panel p-5 space-y-2 border-l-4 border-l-emerald-600">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đang Hoạt Động</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                {activeCount} <span className="text-xs font-normal text-slate-500">Thẻ</span>
              </div>
              <p className="text-xs text-emerald-600 font-semibold">
                Đã gán định danh hội viên & đại biểu
              </p>
            </div>

            <div className="glass-panel p-5 space-y-2 border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kho Sẵn Sàng (Chưa Gán)</span>
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                {unassignedCount} <span className="text-xs font-normal text-slate-500">Thẻ</span>
              </div>
              <p className="text-xs text-amber-600 font-semibold">
                Sẵn sàng cấp phát tại trạm check-in
              </p>
            </div>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="glass-panel p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Tìm theo UID, Số Serial, Tên đại biểu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200 text-xs rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              {(['ALL', 'ACTIVE', 'LOCKED', 'UNASSIGNED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'ALL' && 'Tất Cả'}
                  {st === 'ACTIVE' && 'Đang Hoạt Động'}
                  {st === 'LOCKED' && 'Đã Khóa'}
                  {st === 'UNASSIGNED' && 'Chưa Gán'}
                </button>
              ))}
            </div>
          </div>

          {/* NFC CARD INVENTORY TABLE */}
          <div className="glass-panel overflow-hidden border border-slate-200 shadow-sm rounded-2xl">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 border-b border-slate-200">
                  <TableRow>
                    <TableHead className="font-extrabold text-slate-700 text-xs">Mã Thẻ / UID</TableHead>
                    <TableHead className="font-extrabold text-slate-700 text-xs">Chủ Thẻ / Doanh Nghiệp</TableHead>
                    <TableHead className="font-extrabold text-slate-700 text-xs">Loại Phôi Thẻ</TableHead>
                    <TableHead className="font-extrabold text-slate-700 text-xs text-center">Lượt Chạm</TableHead>
                    <TableHead className="font-extrabold text-slate-700 text-xs">Trạng Thái</TableHead>
                    <TableHead className="font-extrabold text-slate-700 text-xs text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCards.map((card) => (
                    <TableRow key={card.id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell className="font-mono text-xs">
                        <div className="font-bold text-slate-900">{card.uid}</div>
                        <div className="text-[10px] text-slate-400">{card.serialNumber}</div>
                      </TableCell>

                      <TableCell>
                        {card.ownerName ? (
                          <div className="flex items-center gap-2.5">
                            <img
                              src={card.avatarUrl || '/avatar-johnny-long.jpg'}
                              alt={card.ownerName}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-xs text-slate-900">{card.ownerName}</p>
                              <p className="text-[11px] text-slate-500">{card.companyName}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Chưa gán chủ thẻ</span>
                        )}
                      </TableCell>

                      <TableCell className="text-xs text-slate-600">
                        <span className="font-semibold">{card.cardType}</span>
                      </TableCell>

                      <TableCell className="text-center font-mono font-bold text-xs text-slate-900">
                        {card.tapCount}
                      </TableCell>

                      <TableCell>
                        {card.status === 'ACTIVE' && (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-bold">
                            HOẠT ĐỘNG
                          </Badge>
                        )}
                        {card.status === 'LOCKED' && (
                          <Badge className="bg-rose-100 text-rose-800 border-rose-300 text-[10px] font-bold">
                            ĐÃ KHÓA
                          </Badge>
                        )}
                        {card.status === 'UNASSIGNED' && (
                          <Badge className="bg-slate-100 text-slate-700 border-slate-300 text-[10px] font-bold">
                            CHƯA GÁN
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        {card.status === 'ACTIVE' && (
                          <Button
                            onClick={() => handleToggleCardStatus(card.id, card.status)}
                            size="sm"
                            variant="outline"
                            className="text-xs border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl"
                          >
                            <Lock className="w-3.5 h-3.5 mr-1" /> Khóa Thẻ
                          </Button>
                        )}
                        {card.status === 'LOCKED' && (
                          <Button
                            onClick={() => handleToggleCardStatus(card.id, card.status)}
                            size="sm"
                            variant="outline"
                            className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl"
                          >
                            <Unlock className="w-3.5 h-3.5 mr-1" /> Mở Khóa
                          </Button>
                        )}
                        {card.status === 'UNASSIGNED' && (
                          <Button
                            onClick={() => {
                              setInputUid(card.uid);
                              setIsAssignModalOpen(true);
                            }}
                            size="sm"
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                          >
                            <UserCheck className="w-3.5 h-3.5 mr-1" /> Gán Đại Biểu
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. TAB 3: LỊCH SỬ CHẠM & PHÂN TÍCH (TAP ANALYTICS) */}
      {/* ===================================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-5 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Lượt Chạm Hôm Nay</span>
              <div className="text-3xl font-black text-slate-900 font-heading">142</div>
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +28% so với sự kiện trước
              </p>
            </div>

            <div className="glass-panel p-5 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Tốc Độ Đọc Trung Bình</span>
              <div className="text-3xl font-black text-slate-900 font-heading">0.42s</div>
              <p className="text-xs text-blue-600 font-semibold">Tối ưu hóa độ trễ 0-lag</p>
            </div>

            <div className="glass-panel p-5 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Tỷ Lệ Thiết Bị</span>
              <div className="text-3xl font-black text-slate-900 font-heading">iOS 68% / Android 32%</div>
              <p className="text-xs text-slate-500">Tương thích 100% smartphone NFC</p>
            </div>
          </div>

          {/* TAP AUDIT LOG TABLE */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" /> Nhật Ký Chạm Thẻ Thời Gian Thực (Idempotent Audit Log)
              </h3>
              <Badge className="bg-slate-100 text-slate-700 text-xs">Mã Hóa 256-bit</Badge>
            </div>

            <div className="space-y-2.5">
              {TAP_LOGS.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{log.action}</p>
                      <p className="text-[11px] text-slate-500">
                        {log.event} • Thiết bị: <span className="font-mono text-slate-700">{log.device}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:justify-end">
                    <span className="text-slate-400 font-mono text-[11px]">{log.time}</span>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-bold">
                      {log.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. TAB 4: BẢO MẬT & TUÂN THỦ PDPL (PRIVACY & SECURITY) */}
      {/* ===================================================================== */}
      {activeTab === 'pdpl' && (
        <div className="glass-panel p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Cài Đặt Quyền Riêng Tư & Tuân Thủ Luật PDPL Số 91/2025/QH15
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Bảo vệ danh bạ và quyền sở hữu dữ liệu cá nhân theo nguyên tắc Đồng ý Tự nguyện (Explicit Consent)
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="space-y-0.5 max-w-xl">
                <p className="font-bold text-slate-900">Yêu cầu Đồng ý 2 Chiều (2-Way Consent)</p>
                <p className="text-slate-500 text-[11px]">
                  Khi đối tác chạm thẻ NFC, thông tin nhạy cảm (SĐT cá nhân, Email bảo mật) chỉ hiển thị sau khi cả 2 bên cùng nhấn Đồng ý Kết nối.
                </p>
              </div>
              <Switch checked={requireConsent} onCheckedChange={setRequireConsent} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="space-y-0.5 max-w-xl">
                <p className="font-bold text-slate-900">Chế độ Hiển Thị Hồ Sơ Công Khai (Public Identity)</p>
                <p className="text-slate-500 text-[11px]">
                  Cho phép mọi người quét QR hoặc chạm thẻ để xem thông tin doanh nghiệp cơ bản tại trang Public Profile.
                </p>
              </div>
              <Switch checked={publicProfile} onCheckedChange={setPublicProfile} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="space-y-0.5 max-w-xl">
                <p className="font-bold text-slate-900">Ẩn danh hóa / Che mờ dữ liệu trước khi kết nối (Data Masking)</p>
                <p className="text-slate-500 text-[11px]">
                  Tự động che 4 chữ số cuối của SĐT (vd: 0903.***.999) cho khách vãng lai chưa được duyệt.
                </p>
              </div>
              <Switch checked={maskSensitiveData} onCheckedChange={setMaskSensitiveData} />
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 7. MODAL GÁN THẺ NFC MỚI (ASSIGN DIALOG) */}
      {/* ===================================================================== */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Radio className="w-5 h-5 text-blue-600" /> Cấp Phát & Ghép Thẻ NFC Cho Đại Biểu
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Gán mã UID chip NFC vật lý vào tài khoản định danh số của hội viên.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleQuickAssignSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">1. Chọn Hội Viên / Đại Biểu:</label>
              <select
                value={selectedDelegateId}
                onChange={(e) => setSelectedDelegateId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">-- Chọn đại biểu cần cấp thẻ --</option>
                {DELEGATE_OPTIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.company}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">2. Mã UID Chip Thẻ NFC:</label>
                <button
                  type="button"
                  onClick={handleSimulateUidScan}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Zap className="w-3 h-3 text-amber-500" /> Quét Thẻ Tự Động
                </button>
              </div>
              <Input
                placeholder="VD: 04:8F:2A:1B:9C:5D:80"
                value={inputUid}
                onChange={(e) => setInputUid(e.target.value)}
                className="font-mono text-xs bg-slate-50 border-slate-300 uppercase rounded-xl"
                required
              />
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAssignModalOpen(false)}
                className="text-xs rounded-xl"
              >
                Hủy Bỏ
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20"
              >
                Xác Nhận Kích Hoạt Thẻ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ===================================================================== */}
      {/* 6. MODAL: CHỈNH SỬA HỒ SƠ DOANH NHÂN (EDIT PROFILE DIALOG) */}
      {/* ===================================================================== */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
          <DialogHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black text-slate-900 font-heading">
                  Chỉnh Sửa Hồ Sơ Định Danh Doanh Nhân
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Cập nhật thông tin hiển thị trên Thẻ Danh Thiếp Số 3D và Trang Profile Công Khai
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">Họ và Tên <span className="text-red-500">*</span></label>
                <Input
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="VD: Hồ Hoàng Long"
                  className="rounded-xl text-xs font-semibold bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">Tên Thường Gọi</label>
                <Input
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  placeholder="VD: Johnny Long Hồ"
                  className="rounded-xl text-xs font-semibold bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-blue-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">Chức Vụ / Vị Trí Công Tác</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="VD: Tổng Giám Đốc / Giám Đốc Dự Án"
                className="rounded-xl text-xs font-semibold bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">Tên Doanh Nghiệp / Hiệp Hội <span className="text-red-500">*</span></label>
              <Input
                required
                value={editBusinessName}
                onChange={(e) => setEditBusinessName(e.target.value)}
                placeholder="VD: Tập đoàn Công nghệ Số A+ (APLUSVN)"
                className="rounded-xl text-xs font-semibold bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">Số Điện Thoại Cá Nhân</label>
                <Input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="VD: 0794677369"
                  className="rounded-xl text-xs font-semibold bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">Email Làm Việc</label>
                <Input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="VD: contact@aplusvn.com"
                  className="rounded-xl text-xs font-semibold bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-blue-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">Website / Cổng Thông Tin</label>
              <Input
                value={editWebsite}
                onChange={(e) => setEditWebsite(e.target.value)}
                placeholder="VD: https://aplusvn.net"
                className="rounded-xl text-xs font-semibold bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">Giới Thiệu Bản Thân / Lĩnh Vực Hoạt Động (Bio)</label>
              <textarea
                rows={3}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Mô tả kinh nghiệm, thế mạnh kinh doanh và sứ mệnh kết nối..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditProfileOpen(false)}
                className="text-xs font-bold rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Hủy Bỏ
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md py-2.5 px-5 cursor-pointer"
              >
                Lưu Thay Đổi Hồ Sơ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

