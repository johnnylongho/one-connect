'use client';

import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Zap,
  Calendar,
  Search,
  Building2,
  MessageSquare,
  Plus,
  Send,
  XCircle,
  MapPin,
  Sparkles,
  Check,
  X,
  UserCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';

export interface BusinessUser {
  id: string;
  fullName: string;
  phone: string;
  avatarUrl: string;
  company: string;
  position: string;
  industry: string;
  association: string;
}

export interface MatchingRequest {
  id: string;
  eventId: string;
  senderId: string;
  senderName: string;
  senderCompany: string;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  receiverCompany: string;
  receiverAvatar: string;
  status: 'pending' | 'accepted' | 'rejected';
  meetingTime: string;
  tableNumber: string;
  note: string;
  createdAt: string;
}

const MOCK_COMPANIES: BusinessUser[] = [
  {
    id: '33333333-3333-3333-3333-333333333333',
    fullName: 'Trần Minh Đức',
    phone: '0923456789',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    company: 'TechCorp Vietnam',
    position: 'Chủ tịch HĐQT TechCorp',
    industry: 'Phần mềm & AI',
    association: 'Hiệp hội Doanh nhân Công nghệ Aplusvn',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    fullName: 'Lê Hoàng Nam',
    phone: '0934567890',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    company: 'InnovateX Global',
    position: 'CEO & Founder InnovateX',
    industry: 'IoT & Phần cứng NFC',
    association: 'Hiệp hội Doanh nhân Công nghệ Aplusvn',
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    fullName: 'Phạm Phương Anh',
    phone: '0945678901',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    company: 'GlobalBiz Corp',
    position: 'Giám đốc Marketing GlobalBiz',
    industry: 'Truyền thông & Sự kiện',
    association: 'Hiệp hội Doanh nhân Công nghệ Aplusvn',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    fullName: 'Nguyễn Thu Hà',
    phone: '0912345678',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    company: 'Vina Capital Invest',
    position: 'Giám đốc Đầu tư B2B',
    industry: 'Quỹ Đầu Tư & Tài Chính',
    association: 'Hiệp hội Doanh nhân Công nghệ Aplusvn',
  },
];

const DEFAULT_MATCHINGS: MatchingRequest[] = [
  {
    id: 'm1',
    eventId: 'ea111111-1111-1111-1111-111111111111',
    senderId: '11111111-1111-1111-1111-111111111111',
    senderName: 'Johnny Long Hồ',
    senderCompany: 'Aplusvn Media & Tech',
    senderAvatar: '/avatar-johnny-long.jpg',
    receiverId: '33333333-3333-3333-3333-333333333333',
    receiverName: 'Trần Minh Đức',
    receiverCompany: 'TechCorp Vietnam',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    status: 'accepted',
    meetingTime: '14:00 - 14:30',
    tableNumber: 'Bàn B2B-08',
    note: 'Trao đổi hợp tác tích hợp hạ tầng giải pháp thẻ danh thiếp số One Connect cho cán bộ TechCorp.',
    createdAt: '10 phút trước',
  },
  {
    id: 'm2',
    eventId: 'ea111111-1111-1111-1111-111111111111',
    senderId: '44444444-4444-4444-4444-444444444444',
    senderName: 'Lê Hoàng Nam',
    senderCompany: 'InnovateX Global',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    receiverId: '11111111-1111-1111-1111-111111111111',
    receiverName: 'Johnny Long Hồ',
    receiverCompany: 'Aplusvn Media & Tech',
    receiverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    status: 'pending',
    meetingTime: '15:00 - 15:30',
    tableNumber: 'Bàn B2B-03',
    note: 'Đề xuất cung cấp module chip phần cứng NFC và thiết bị quét tốc độ cao.',
    createdAt: '25 phút trước',
  },
];

interface B2BMatchmakingViewProps {
  initialMatchings?: MatchingRequest[];
}

export function B2BMatchmakingView({ initialMatchings }: B2BMatchmakingViewProps) {
  const { toast } = useToast();
  const [matchings, setMatchings] = useState<MatchingRequest[]>(initialMatchings || DEFAULT_MATCHINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<BusinessUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'accepted' | 'pending' | 'rejected'>('all');

  const [meetingTime, setMeetingTime] = useState('14:30 - 15:00');
  const [tableNumber, setTableNumber] = useState('Bàn B2B-02');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUserId = '11111111-1111-1111-1111-111111111111';

  const sentRequestsCount = matchings.filter((m) => m.senderId === currentUserId).length;
  const acceptedCount = matchings.filter((m) => m.status === 'accepted').length;
  const pendingCount = matchings.filter((m) => m.status === 'pending').length;

  const filteredCompanies = MOCK_COMPANIES.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMatchings = matchings.filter((m) => {
    if (statusFilter === 'all') return true;
    return m.status === statusFilter;
  });

  const handleOpenRequestModal = (company: BusinessUser) => {
    setSelectedTarget(company);
    setNote(`Mong muốn hẹn gặp ${company.fullName} (${company.company}) để trao đổi cơ hội hợp tác B2B.`);
    setIsDialogOpen(true);
  };

  const handleSubmitRequest = async () => {
    if (!selectedTarget) return;

    setIsSubmitting(true);

    const newRequest: MatchingRequest = {
      id: `m${Date.now().toString(36)}`,
      eventId: 'ea111111-1111-1111-1111-111111111111',
      senderId: currentUserId,
      senderName: 'Johnny Long Hồ',
      senderCompany: 'Aplusvn Media & Tech',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      receiverId: selectedTarget.id,
      receiverName: selectedTarget.fullName,
      receiverCompany: selectedTarget.company,
      receiverAvatar: selectedTarget.avatarUrl,
      status: 'pending',
      meetingTime,
      tableNumber,
      note,
      createdAt: 'Vừa xong',
    };

    setMatchings([newRequest, ...matchings]);
    setIsSubmitting(false);
    setIsDialogOpen(false);

    toast({
      title: 'ĐÃ GỬI LỜI MỜI B2B MATCHMAKING! 🚀',
      description: `Yêu cầu hẹn gặp đã gửi tới ${selectedTarget.fullName} (${selectedTarget.company}). Thông báo đã kích hoạt.`,
      variant: 'success',
    });
  };

  const handleRespondRequest = (requestId: string, newStatus: 'accepted' | 'rejected') => {
    setMatchings((prev) =>
      prev.map((m) => {
        if (m.id === requestId) {
          return { ...m, status: newStatus };
        }
        return m;
      })
    );

    if (newStatus === 'accepted') {
      toast({
        title: 'ĐÃ CHẤP THUẬN CUỘC HẸN B2B! 🤝',
        description: 'Bàn đàm phán đã được khóa và gửi thông báo nhắc lịch đến cả 2 bên.',
        variant: 'success',
      });
    } else {
      toast({
        title: 'ĐÃ TỪ CHỐI CUỘC HẸN!',
        description: 'Đã cập nhật trạng thái từ chối lịch hẹn.',
        variant: 'default',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* HEADER BANNER WITH LIGHT THEME */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200">
                <Zap className="w-6 h-6 text-[#FF6B00]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-widest text-[#FF6B00] uppercase font-mono">
                    ONE CONNECT NETWORK • GIAO THƯƠNG 1:1
                  </span>
                  <Badge variant="outline" className="text-[10px] bg-orange-50 text-[#FF6B00] border-orange-200 font-bold">
                    SCR-B05 & 2-WAY CONSENT
                  </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-['Outfit'] mt-0.5">
                  B2B Matchmaking & Xếp Bàn Giao Thương
                </h1>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl pt-1 leading-relaxed">
              Khởi tạo cuộc hẹn giao thương 1:1 trực tiếp giữa các Doanh chủ, Chủ tịch & CEO tại khu vực sảnh VIP B2B. Tuân thủ 100% cơ chế Consent 2 chiều.
            </p>
          </div>

          <Button
            onClick={() => setIsDialogOpen(true)}
            size="lg"
            className="gap-2 bg-gradient-to-r from-[#0066FF] to-[#FF6B00] hover:opacity-90 text-white font-bold shadow-md shadow-orange-500/20 rounded-xl self-start md:self-center shrink-0 cursor-pointer"
          >
            <Plus className="w-5 h-5" /> Tạo Yêu Cầu Kết Nối
          </Button>
        </div>
      </div>

      {/* 1. HEADER METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-slate-200 bg-white hover:border-blue-300 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Yêu Cầu Đã Gửi
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
              <Send className="w-5 h-5 text-[#0066FF]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-slate-900 font-['Outfit']">{sentRequestsCount} <span className="text-sm font-normal text-slate-500">Cuộc hẹn</span></div>
            <p className="text-xs text-[#0066FF] flex items-center gap-1 font-medium pt-1">
              <Sparkles className="w-3.5 h-3.5" /> Khởi tạo trực tiếp từ thẻ NFC
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-white hover:border-emerald-300 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Đã Đồng Ý (Accepted)
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-emerald-600 font-['Outfit']">{acceptedCount} <span className="text-sm font-normal text-slate-500">Đã chốt bàn</span></div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium pt-1">
              <UserCheck className="w-3.5 h-3.5" /> Đã xếp bàn đàm phán B2B
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-white hover:border-orange-300 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Chờ Phản Hồi (Pending)
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100">
              <Clock className="w-5 h-5 text-[#FF6B00]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-[#FF6B00] font-['Outfit']">{pendingCount} <span className="text-sm font-normal text-slate-500">Đang chờ</span></div>
            <p className="text-xs text-[#FF6B00] flex items-center gap-1 font-medium pt-1">
              <Clock className="w-3.5 h-3.5" /> Thông báo PWA đẩy realtime
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. TAB NAVIGATION & MAIN CONTENT */}
      <Tabs defaultValue="directory" className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <TabsList className="bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="directory" className="gap-2">
              <Building2 className="w-4 h-4" /> Danh Sách Doanh Nghiệp
            </TabsTrigger>
            <TabsTrigger value="my-schedule" className="gap-2">
              <Calendar className="w-4 h-4" /> Lịch Hẹn Của Tôi ({matchings.length})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Tìm tên, công ty, ngành..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-slate-200 text-xs focus:border-blue-500 rounded-xl"
            />
          </div>
        </div>

        {/* TAB 1: DANH SÁCH DOANH NGHIỆP GRID */}
        <TabsContent value="directory" className="space-y-4 m-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredCompanies.map((comp) => (
              <Card key={comp.id} className="border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all shadow-sm group flex flex-col justify-between">
                <CardHeader className="p-5 pb-3 space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={comp.avatarUrl}
                      alt={comp.fullName}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500/20 group-hover:scale-105 transition-transform shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-[#0066FF] transition-colors">
                        {comp.fullName}
                      </h3>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{comp.position}</p>
                      <Badge variant="outline" className="mt-1.5 text-[10px] bg-slate-50 text-slate-600 border-slate-200">
                        {comp.industry}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-5 pb-5 pt-0 space-y-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-800 font-semibold truncate">
                      <Building2 className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                      {comp.company}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{comp.association}</p>
                  </div>

                  <Button
                    onClick={() => handleOpenRequestModal(comp)}
                    size="sm"
                    className="w-full gap-2 bg-gradient-to-r from-[#0066FF] to-[#FF6B00] hover:opacity-90 text-white font-bold rounded-xl shadow-sm cursor-pointer text-xs"
                  >
                    <Plus className="w-4 h-4" /> Gửi Yêu Cầu Hẹn Gặp
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 2: LỊCH HẸN CỦA TÔI */}
        <TabsContent value="my-schedule" className="space-y-4 m-0">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <CardTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#0066FF]" />
                  Danh Sách Cuộc Hẹn B2B Matchmaking
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1">
                  Quản lý các lịch hẹn đàm phán 1:1 đã nhận hoặc đã gửi tới đối tác sự kiện
                </CardDescription>
              </div>

              {/* Status Filter buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {(['all', 'accepted', 'pending', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      statusFilter === st ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'all' ? 'Tất cả' : st === 'accepted' ? 'Đã đồng ý' : st === 'pending' ? 'Chờ phản hồi' : 'Từ chối'}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* MOBILE APPOINTMENT CARDS (Block on mobile, hidden on tablet/desktop) */}
              <div className="block md:hidden divide-y divide-slate-100 p-3 space-y-3">
                {filteredMatchings.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    Không tìm thấy cuộc hẹn nào phù hợp.
                  </div>
                ) : (
                  filteredMatchings.map((item) => {
                    const isIncoming = item.receiverId === currentUserId;
                    const partnerName = isIncoming ? item.senderName : item.receiverName;
                    const partnerCompany = isIncoming ? item.senderCompany : item.receiverCompany;
                    const partnerAvatar = isIncoming ? item.senderAvatar : item.receiverAvatar;

                    return (
                      <div key={item.id} className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={partnerAvatar}
                              alt={partnerName}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 text-xs truncate">{partnerName}</p>
                              <p className="text-[11px] text-slate-600 truncate">{partnerCompany}</p>
                            </div>
                          </div>
                          <div>
                            {item.status === 'accepted' && (
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                                Đã Đồng Ý
                              </Badge>
                            )}
                            {item.status === 'pending' && (
                              <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 text-[10px] font-bold">
                                Chờ Phản Hồi
                              </Badge>
                            )}
                            {item.status === 'rejected' && (
                              <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200 text-[10px] font-bold">
                                Từ Chối
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-slate-100">
                          <span className="flex items-center gap-1 text-[#0066FF] font-bold text-[11px]">
                            <Clock className="w-3.5 h-3.5" /> {item.meetingTime}
                          </span>
                          <span className="flex items-center gap-1 text-[#FF6B00] font-semibold text-[11px]">
                            <MapPin className="w-3.5 h-3.5" /> {item.tableNumber}
                          </span>
                        </div>

                        {item.note && (
                          <p className="text-[11px] text-slate-600 italic bg-white/60 p-2 rounded-lg border border-slate-100">
                            "{item.note}"
                          </p>
                        )}

                        {isIncoming && item.status === 'pending' && (
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <Button
                              onClick={() => handleRespondRequest(item.id, 'accepted')}
                              size="sm"
                              className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl"
                            >
                              <Check className="w-3.5 h-3.5 mr-1" /> Đồng ý
                            </Button>
                            <Button
                              onClick={() => handleRespondRequest(item.id, 'rejected')}
                              size="sm"
                              variant="outline"
                              className="h-8 border-slate-200 text-slate-600 hover:bg-slate-50 text-xs rounded-xl"
                            >
                              <X className="w-3.5 h-3.5 mr-1" /> Từ chối
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* DESKTOP TABLE VIEW (Hidden on mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="border-slate-200 hover:bg-transparent">
                      <TableHead className="text-slate-600 text-xs font-bold">Đối Tác Đàm Phán</TableHead>
                      <TableHead className="text-slate-600 text-xs font-bold">Doanh Nghiệp</TableHead>
                      <TableHead className="text-slate-600 text-xs font-bold">Thời Gian & Số Bàn</TableHead>
                      <TableHead className="text-slate-600 text-xs font-bold">Lời Nhắn Mục Tiêu</TableHead>
                      <TableHead className="text-slate-600 text-xs font-bold text-center">Trạng Thái</TableHead>
                      <TableHead className="text-slate-600 text-xs font-bold text-right">Hành Động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMatchings.map((item) => {
                      const isIncoming = item.receiverId === currentUserId;
                      const partnerName = isIncoming ? item.senderName : item.receiverName;
                      const partnerCompany = isIncoming ? item.senderCompany : item.receiverCompany;
                      const partnerAvatar = isIncoming ? item.senderAvatar : item.receiverAvatar;

                      return (
                        <TableRow key={item.id} className="border-slate-100 hover:bg-slate-50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={partnerAvatar}
                                alt={partnerName}
                                className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                  {partnerName}
                                  {isIncoming ? (
                                    <Badge className="bg-blue-50 text-[#0066FF] border-blue-200 text-[9px]">
                                      Nhận được
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-[9px]">
                                      Đã gửi
                                    </Badge>
                                  )}
                                </p>
                                <p className="text-[11px] text-slate-500">{item.createdAt}</p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-xs font-medium text-slate-800">
                            {partnerCompany}
                          </TableCell>

                          <TableCell>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 text-xs text-[#0066FF] font-bold">
                                <Clock className="w-3.5 h-3.5" />
                                {item.meetingTime}
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-[#FF6B00] font-medium">
                                <MapPin className="w-3 h-3" />
                                {item.tableNumber}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="max-w-xs">
                            <p className="text-xs text-slate-600 line-clamp-2 italic">"{item.note}"</p>
                          </TableCell>

                          <TableCell className="text-center">
                            {item.status === 'accepted' && (
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 font-bold text-[11px]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đã Đồng Ý
                              </Badge>
                            )}
                            {item.status === 'pending' && (
                              <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 gap-1 font-bold text-[11px]">
                                <Clock className="w-3 h-3" /> Chờ Phản Hồi
                              </Badge>
                            )}
                            {item.status === 'rejected' && (
                              <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200 gap-1 font-bold text-[11px]">
                                <XCircle className="w-3 h-3" /> Từ Chối
                              </Badge>
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            {isIncoming && item.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  onClick={() => handleRespondRequest(item.id, 'accepted')}
                                  size="sm"
                                  className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" /> Đồng ý
                                </Button>
                                <Button
                                  onClick={() => handleRespondRequest(item.id, 'rejected')}
                                  size="sm"
                                  variant="outline"
                                  className="h-8 gap-1 border-slate-200 text-slate-600 hover:bg-slate-50 text-xs rounded-lg cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" /> Từ chối
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 font-mono">Đã xử lý</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CREATE REQUEST MODAL */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white border-slate-200 text-slate-900 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
              <Zap className="w-5 h-5 text-[#FF6B00]" />
              Khởi Tạo Cuộc Hẹn B2B Matchmaking
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Gửi lời mời và đăng ký bàn gặp mặt trực tiếp với đại biểu doanh nghiệp tại sự kiện
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {selectedTarget && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <img
                  src={selectedTarget.avatarUrl}
                  alt={selectedTarget.fullName}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedTarget.fullName}</h4>
                  <p className="text-xs text-slate-600">{selectedTarget.position} • {selectedTarget.company}</p>
                  <p className="text-[11px] text-[#0066FF] font-semibold">{selectedTarget.industry}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Khung Giờ Gặp</label>
                <select
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 font-medium"
                >
                  <option value="14:00 - 14:30">14:00 - 14:30</option>
                  <option value="14:30 - 15:00">14:30 - 15:00</option>
                  <option value="15:00 - 15:30">15:00 - 15:30</option>
                  <option value="15:30 - 16:00">15:30 - 16:00</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Khu Vực Bàn Đàm Phán</label>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 font-medium"
                >
                  <option value="Bàn B2B-01">Bàn B2B-01 (Khu VIP)</option>
                  <option value="Bàn B2B-02">Bàn B2B-02 (Khu VIP)</option>
                  <option value="Bàn B2B-03">Bàn B2B-03 (Khu Tech)</option>
                  <option value="Bàn B2B-08">Bàn B2B-08 (Khu Đầu Tư)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nội Dung / Mục Tiêu Giao Thương</label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú vắn tắt nhu cầu hợp tác hoặc sản phẩm muốn giới thiệu..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 text-xs outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitRequest}
              className="bg-gradient-to-r from-[#0066FF] to-[#FF6B00] hover:opacity-90 text-white font-bold shadow-md shadow-orange-500/20"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi Lời Mời Ngay'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
