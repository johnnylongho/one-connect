'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  CheckCircle2,
  Lock,
  Radio,
  Plus,
  Search,
  Zap,
  TrendingUp,
  Building2,
  Sparkles,
  ShieldAlert,
  QrCode,
  RotateCw,
  UserCheck,
  Smartphone,
  ArrowLeft,
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
import { ToastProvider, useToast } from '@/components/ui/toast';

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
    ownerName: 'Johnny Long Hồ',
    companyName: 'Aplusvn Media & Tech',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
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
];

function NfcCardsContent() {
  const { toast } = useToast();
  const [cards, setCards] = useState<NfcCardItem[]>(INITIAL_NFC_CARDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'LOCKED' | 'UNASSIGNED'>('ALL');

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDelegateId, setSelectedDelegateId] = useState('');
  const [inputUid, setInputUid] = useState('');

  const totalCards = cards.length;
  const activatedCards = cards.filter((c) => c.status === 'ACTIVE').length;
  const unassignedCards = cards.filter((c) => c.status === 'UNASSIGNED').length;

  const filteredCards = cards.filter((c) => {
    const matchesSearch =
      c.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.ownerName && c.ownerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.companyName && c.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleCardStatus = (cardId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';

    setCards((prev) =>
      prev.map((item) => (item.id === cardId ? { ...item, status: nextStatus as any } : item))
    );

    if (nextStatus === 'LOCKED') {
      toast({
        title: 'ĐÃ KHÓA THẺ TỪ XA! 🔒',
        description: `Thẻ NFC [${cardId}] đã bị vô hiệu hóa tức thì trên hệ thống.`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'ĐÃ KÍCH HOẠT LẠI THẺ! ⚡',
        description: `Thẻ NFC [${cardId}] đã sẵn sàng hoạt động trở lại.`,
        variant: 'success',
      });
    }
  };

  const handleQuickAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDelegateId || !inputUid) {
      toast({
        title: 'THIẾU THÔNG TIN! ⚠️',
        description: 'Vui lòng chọn đại biểu và nhập mã UID thẻ NFC.',
        variant: 'destructive',
      });
      return;
    }

    const selectedDelegate = DELEGATE_OPTIONS.find((d) => d.id === selectedDelegateId);

    const newCard: NfcCardItem = {
      id: `nfc-00${cards.length + 1}`,
      uid: inputUid.toUpperCase(),
      serialNumber: `NFC-2026-APLUS-00${cards.length + 1}`,
      cardType: 'Metal NTAG215 (Laser Etched)',
      ownerName: selectedDelegate?.name || 'Đại biểu',
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

    toast({
      title: 'ĐỒNG BỘ THẺ THÀNH CÔNG! 🎉',
      description: `Đã gán thành công mã UID [${newCard.uid}] cho đại biểu ${newCard.ownerName}.`,
      variant: 'success',
    });
  };

  const handleSimulateScan = () => {
    const randomHex = Array.from({ length: 7 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0')
        .toUpperCase()
    ).join(':');

    setInputUid(randomHex);
    toast({
      title: 'ĐÃ QUÉT THẺ NFC THÀNH CÔNG! 📡',
      description: `Mã UID [${randomHex}] đã được nạp tự động từ đầu đọc thẻ.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 pb-16">
      {/* TOP BRAND HEADER */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-4 sticky top-0 z-30 backdrop-blur-md bg-slate-950/90 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors text-slate-300">
              <ArrowLeft className="w-4 h-4" />
            </Link>

            {/* Logo One Connect */}
            <div className="relative p-[1.5px] rounded-xl bg-gradient-to-r from-[#0066FF] to-[#FF6B00] shadow-md shadow-orange-500/20 shrink-0">
              <div className="bg-slate-950 px-2.5 py-1 rounded-[10px] flex items-center justify-center">
                <img
                  src="/one_connect_final_logo_orange.png"
                  alt="One Connect Logo"
                  className="h-7 sm:h-8 w-auto object-contain"
                />
              </div>
            </div>

            <div>
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight font-['Outfit']">
                Trạm Cấp Phát & Ghép Thẻ NFC
              </h1>
              <p className="text-[11px] text-[#00C2FF] font-medium italic">
                One Identity, Connect Everywhere.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsAssignModalOpen(true)}
            size="sm"
            className="gap-2 bg-gradient-to-r from-[#0066FF] to-[#FF6B00] hover:opacity-90 text-white font-extrabold shadow-lg shadow-orange-500/20 rounded-xl cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Gán Thẻ NFC Mới
          </Button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* OVERVIEW METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card className="border-slate-800 bg-slate-900/80 hover:border-[#0066FF]/60 transition-all shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tổng Thẻ NFC Đã Phát Hành
              </CardTitle>
              <div className="p-2.5 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20">
                <CreditCard className="w-5 h-5 text-[#0066FF]" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-black text-white font-['Outfit']">
                {totalCards} <span className="text-sm font-normal text-slate-400">Thẻ</span>
              </div>
              <p className="text-xs text-[#00C2FF] flex items-center gap-1 font-medium pt-1">
                <TrendingUp className="w-3.5 h-3.5" /> Chuẩn chip NTAG215 / NTAG216
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/80 hover:border-emerald-500/50 transition-all shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Thẻ Đã Kích Hoạt
              </CardTitle>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-black text-white font-['Outfit']">
                {activatedCards} <span className="text-sm font-normal text-slate-400">Đại biểu</span>
              </div>
              <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium pt-1">
                <Sparkles className="w-3.5 h-3.5" /> Tốc độ phản hồi 1-chạm siêu tốc
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#FF6B00]/60 bg-slate-900/80 hover:border-[#FF6B00] transition-all shadow-[0_0_20px_rgba(255,107,0,0.2)]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider">
                Thẻ Trắng Chờ Cấp
              </CardTitle>
              <div className="p-2.5 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/30">
                <Radio className="w-5 h-5 text-[#FF6B00]" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-black text-white font-['Outfit']">
                {unassignedCards} <span className="text-sm font-normal text-slate-400">Thẻ sẵn sàng</span>
              </div>
              <p className="text-xs text-[#FF6B00] flex items-center gap-1 font-medium pt-1">
                <Zap className="w-3.5 h-3.5" /> Ghép thẻ siêu tốc tại sảnh Check-in
              </p>
            </CardContent>
          </Card>
        </div>

        {/* NFC CARDS TABLE */}
        <Card className="border-slate-800 bg-slate-900/80 shadow-2xl">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2 font-['Outfit']">
                <CreditCard className="w-5 h-5 text-[#00C2FF]" />
                Danh Sách Quản Lý Thẻ NFC Realtime
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-0.5">
                Xem UID chip, lượt chạm tương tác và quản lý bật/tắt khóa thẻ từ xa
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Tìm UID, tên, công ty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-56 bg-slate-950 border-slate-800 text-xs focus:border-[#00C2FF] rounded-xl"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 text-xs outline-none focus:border-[#00C2FF]"
              >
                <option value="ALL">Tất cả Trạng Thái</option>
                <option value="ACTIVE">Đang Hoạt Động</option>
                <option value="LOCKED">Đã Khóa Tạm Thời</option>
                <option value="UNASSIGNED">Thẻ Trắng (Chưa Gán)</option>
              </select>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
              <Table>
                <TableHeader className="bg-slate-950">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400 text-xs font-bold">Mã UIDs / Serial Thẻ</TableHead>
                    <TableHead className="text-slate-400 text-xs font-bold">Người Sở Hữu (Doanh Nghiệp)</TableHead>
                    <TableHead className="text-slate-400 text-xs font-bold">Loại Chip Thẻ</TableHead>
                    <TableHead className="text-slate-400 text-xs font-bold text-center">Lượt Chạm Analytics</TableHead>
                    <TableHead className="text-slate-400 text-xs font-bold text-center">Trạng Thái Thẻ</TableHead>
                    <TableHead className="text-slate-400 text-xs font-bold text-right">Khóa Từ Xa (Remote Disable)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCards.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-slate-500 text-xs">
                        Không tìm thấy thẻ NFC phù hợp với bộ lọc.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCards.map((card) => (
                      <TableRow key={card.id} className="border-slate-800/60 hover:bg-slate-900/60 transition-colors">
                        <TableCell className="font-mono text-xs">
                          <div className="space-y-0.5">
                            <span className="font-bold text-[#00C2FF] bg-[#00C2FF]/10 px-2 py-0.5 rounded border border-[#00C2FF]/30">
                              {card.uid}
                            </span>
                            <p className="text-[10px] text-slate-500">{card.serialNumber}</p>
                          </div>
                        </TableCell>

                        <TableCell>
                          {card.ownerName ? (
                            <div className="flex items-center gap-2.5">
                              <img
                                src={card.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                                alt={card.ownerName}
                                className="w-8 h-8 rounded-full object-cover border border-[#00C2FF] shrink-0"
                              />
                              <div>
                                <p className="font-bold text-white text-xs">{card.ownerName}</p>
                                <p className="text-[11px] text-slate-400">{card.companyName}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500 italic">Chưa gắn người dùng (Thẻ Trắng)</span>
                          )}
                        </TableCell>

                        <TableCell className="text-xs text-slate-300">
                          <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-[11px]">
                            {card.cardType}
                          </span>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="space-y-0.5">
                            <span className="font-black text-white font-mono text-xs bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                              {card.tapCount} lượt chạm
                            </span>
                            {card.lastTappedAt && (
                              <p className="text-[10px] text-slate-500">{card.lastTappedAt}</p>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          {card.status === 'ACTIVE' ? (
                            <Badge variant="outline" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/40 gap-1 font-bold text-[11px]">
                              <CheckCircle2 className="w-3 h-3" /> Hoạt Động
                            </Badge>
                          ) : card.status === 'LOCKED' ? (
                            <Badge variant="outline" className="bg-rose-500/15 text-rose-400 border-rose-500/40 gap-1 font-bold text-[11px]">
                              <Lock className="w-3 h-3" /> Đã Khóa
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/30 gap-1 text-[11px] font-bold">
                              <Radio className="w-3 h-3 text-[#FF6B00]" /> Thẻ Trắng
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          {card.status !== 'UNASSIGNED' ? (
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-[11px] text-slate-400 font-medium">
                                {card.status === 'ACTIVE' ? 'Khóa Thẻ' : 'Mở Khóa'}
                              </span>
                              <Switch
                                checked={card.status === 'ACTIVE'}
                                onCheckedChange={() => handleToggleCardStatus(card.id, card.status)}
                              />
                            </div>
                          ) : (
                            <Button
                              onClick={() => {
                                setInputUid(card.uid);
                                setIsAssignModalOpen(true);
                              }}
                              variant="outline"
                              size="sm"
                              className="gap-1 text-xs border-[#0066FF] text-[#00C2FF] bg-[#0066FF]/10 hover:bg-[#0066FF]/20 rounded-lg cursor-pointer font-bold"
                            >
                              <UserCheck className="w-3.5 h-3.5" /> Gán Đại Biểu
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* QUICK ASSIGN & WRITE MODAL */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="sm:max-w-md bg-slate-950 border-slate-800 text-white shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-[#00C2FF] font-['Outfit']">
              <CreditCard className="w-5 h-5 text-[#00C2FF]" />
              Kích Hoạt & Đồng Bộ Thẻ NFC Doanh Nhân
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Gán định danh số cho Đại biểu tham gia sự kiện và đồng bộ thẻ NTAG215
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleQuickAssignSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Chọn Đại Biểu Nhận Thẻ</label>
              <select
                value={selectedDelegateId}
                onChange={(e) => setSelectedDelegateId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-2.5 text-xs outline-none focus:border-[#00C2FF]"
                required
              >
                <option value="">-- Chọn Đại Biểu --</option>
                {DELEGATE_OPTIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.company})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">Mã UID Chip Thẻ NFC</label>
                <button
                  type="button"
                  onClick={handleSimulateScan}
                  className="text-[11px] text-[#00C2FF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Smartphone className="w-3 h-3" /> Giả Lập Quét NFC
                </button>
              </div>
              <Input
                type="text"
                placeholder="VD: 04:8F:2A:1B:9C:5D:80"
                value={inputUid}
                onChange={(e) => setInputUid(e.target.value)}
                className="bg-slate-900 border-slate-800 text-xs font-mono focus:border-[#00C2FF] rounded-xl"
                required
              />
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAssignModalOpen(false)}
                className="border-slate-800 text-slate-400 hover:bg-slate-900 text-xs rounded-xl"
              >
                Hủy Bỏ
              </Button>
              <Button
                type="submit"
                className="gap-2 bg-gradient-to-r from-[#0066FF] to-[#FF6B00] hover:opacity-90 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/20 cursor-pointer"
              >
                <Zap className="w-4 h-4" /> Lập Tức Kích Hoạt & Gán Thẻ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function NfcCardsPage() {
  return (
    <ToastProvider>
      <NfcCardsContent />
    </ToastProvider>
  );
}
