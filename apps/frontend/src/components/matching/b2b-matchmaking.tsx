'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
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
  TrendingUp,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Briefcase,
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
import { B2BMatchCandidate } from '@/lib/services/matching-service';

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

interface B2BMatchmakingViewProps {
  initialMatchings?: MatchingRequest[];
  companies?: BusinessUser[];
  aiCandidates?: B2BMatchCandidate[];
  currentUserId?: string;
}

export function B2BMatchmakingView({
  initialMatchings = [],
  companies = [],
  aiCandidates = [],
  currentUserId = '11111111-1111-1111-1111-111111111111',
}: B2BMatchmakingViewProps) {
  const { toast } = useToast();
  const [matchings, setMatchings] = useState<MatchingRequest[]>(initialMatchings);
  const [candidates, setCandidates] = useState<B2BMatchCandidate[]>(aiCandidates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<{
    id: string;
    fullName: string;
    company: string;
    position?: string;
    industry?: string;
    avatarUrl: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'accepted' | 'pending' | 'rejected'>('all');

  const [meetingTime, setMeetingTime] = useState('14:30 - 15:00');
  const [tableNumber, setTableNumber] = useState('Bàn B2B-02');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sentRequestsCount = matchings.filter((m) => m.senderId === currentUserId).length;
  const acceptedCount = matchings.filter((m) => m.status === 'accepted').length;
  const pendingCount = matchings.filter((m) => m.status === 'pending').length;

  const filteredCandidates = candidates.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompanies = companies.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMatchings = matchings.filter((m) => {
    if (statusFilter === 'all') return true;
    return m.status === statusFilter;
  });

  const handleOpenRequestModal = (target: {
    id: string;
    fullName: string;
    company: string;
    position?: string;
    industry?: string;
    avatarUrl: string;
  }) => {
    setSelectedTarget(target);
    setNote(`Mong muốn hẹn gặp ${target.fullName} (${target.company}) để trao đổi cơ hội hợp tác B2B.`);
    setIsDialogOpen(true);
  };

  const handleSubmitRequest = async () => {
    if (!selectedTarget) return;

    setIsSubmitting(true);

    try {
      // Direct persistence to Supabase via /api/matching route
      const response = await fetch('/api/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_REQUEST',
          requesterIdentityId: currentUserId,
          receiverIdentityId: selectedTarget.id,
          eventId: 'ea111111-1111-1111-1111-111111111111',
          meetingTime,
          tableNumber,
          note,
        }),
      });

      const resData = await response.json();

      if (resData.success) {
        const newRequest: MatchingRequest = {
          id: resData.connectionId || `m${Date.now().toString(36)}`,
          eventId: 'ea111111-1111-1111-1111-111111111111',
          senderId: currentUserId,
          senderName: 'Hồ Hoàng Long',
          senderCompany: 'Công ty Cổ phần Công nghệ Aplusvn',
          senderAvatar: '/avatar-johnny-long.jpg',
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

        // Update candidate status in AI view
        setCandidates((prev) =>
          prev.map((c) =>
            c.identityId === selectedTarget.id ? { ...c, connectionStatus: 'PENDING' } : c
          )
        );

        toast({
          title: 'ĐÃ GỬI YÊU CẦU B2B MATCHMAKING THÀNH CÔNG!',
          description: `Yêu cầu hẹn gặp đã lưu vào cơ sở dữ liệu và kích hoạt thông báo Zalo ZNS tới ${selectedTarget.fullName}.`,
          variant: 'success',
        });
        setIsDialogOpen(false);
      } else {
        toast({
          title: 'KHÔNG THỂ GỬI YÊU CẦU',
          description: resData.error || 'Có lỗi xảy ra khi lưu cuộc hẹn.',
          variant: 'default',
        });
      }
    } catch (err: any) {
      toast({
        title: 'LỖI KẾT NỐI MẠNG',
        description: err.message || 'Vui lòng kiểm tra lại đường truyền mạng.',
        variant: 'default',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRespondRequest = async (requestId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const response = await fetch('/api/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESPOND_REQUEST',
          connectionId: requestId,
          status: newStatus.toUpperCase(),
        }),
      });

      const resData = await response.json();

      if (resData.success) {
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
            title: 'ĐÃ CHẤP THUẬN CUỘC HẸN B2B!',
            description: 'Bàn đàm phán đã được khóa và đồng bộ vào Pre-CRM Relationship Memory.',
            variant: 'success',
          });
        } else {
          toast({
            title: 'ĐÃ TỪ CHỐI CUỘC HẸN!',
            description: 'Đã cập nhật trạng thái từ chối lịch hẹn trên cơ sở dữ liệu.',
            variant: 'default',
          });
        }
      }
    } catch (err: any) {
      toast({
        title: 'LỖI PHẢN HỒI KẾT NỐI',
        description: err.message || 'Không thể cập nhật trạng thái kết nối.',
        variant: 'default',
      });
    }
  };

  return (
    <div className="space-y-6 w-full pb-16 antialiased">
      {/* 1. STANDARDIZED PAGE HEADER */}
      <PageHeader
        supertitle="ONE CONNECT NETWORK • MODULE 1: DOANH NHÂN & B2B"
        title="AI B2B Matchmaking & Xếp Bàn Giao Thương"
        description="Thuật toán ghép đôi đối tác đàm phán 1:1 dựa trên ngành nghề, năng lực cung ứng và nhu cầu hợp tác thực tế giữa các Chủ tịch & CEO. Tuân thủ 100% cơ chế 2-Way Consent."
        icon={Users}
        badge="AI MATCHMAKING • TRL-7"
        badgeVariant="orange"
        backHref="/dashboard"
        backLabel="Về Tổng quan"
        actions={
          <Button
            onClick={() => {
              const firstCompany = companies[0];
              if (firstCompany) {
                handleOpenRequestModal(firstCompany);
              } else {
                setIsDialogOpen(true);
              }
            }}
            size="default"
            className="gap-2 bg-gradient-to-r from-[#0066FF] to-[#FF6B00] hover:opacity-90 text-white font-bold text-xs shadow-xs rounded-xl self-start md:self-center shrink-0 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Tạo Yêu Cầu Kết Nối
          </Button>
        }
      />

      {/* 2. HEADER METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-slate-200 bg-white hover:border-blue-300 transition-all shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Yêu Cầu Đã Gửi
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
              <Send className="w-5 h-5 text-[#0066FF]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-slate-900 font-mono font-extrabold">
              {sentRequestsCount} <span className="text-sm font-normal text-slate-500">Cuộc hẹn</span>
            </div>
            <p className="text-xs text-[#0066FF] flex items-center gap-1 font-medium pt-1">
              <Sparkles className="w-3.5 h-3.5" /> Khởi tạo từ chạm thẻ NFC & AI Match
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-white hover:border-emerald-300 transition-all shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Đã Đồng Ý (Accepted)
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-emerald-600 font-mono font-extrabold">
              {acceptedCount} <span className="text-sm font-normal text-slate-500">Đã chốt bàn</span>
            </div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium pt-1">
              <UserCheck className="w-3.5 h-3.5" /> Đã xếp bàn đàm phán B2B VIP
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-white hover:border-orange-300 transition-all shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Chờ Phản Hồi (Pending)
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100">
              <Clock className="w-5 h-5 text-[#FF6B00]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-[#FF6B00] font-mono font-extrabold">
              {pendingCount} <span className="text-sm font-normal text-slate-500">Đang chờ</span>
            </div>
            <p className="text-xs text-[#FF6B00] flex items-center gap-1 font-medium pt-1">
              <Clock className="w-3.5 h-3.5" /> Thông báo Zalo ZNS realtime
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. TAB NAVIGATION & MAIN CONTENT */}
      <Tabs defaultValue="ai-matching" className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <TabsList className="bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="ai-matching" className="gap-2 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-[#FF6B00]" /> AI Đề Xuất Đối Tác ({filteredCandidates.length})
            </TabsTrigger>
            <TabsTrigger value="directory" className="gap-2 font-bold text-xs">
              <Building2 className="w-4 h-4" /> Danh Bạ Doanh Nghiệp ({filteredCompanies.length})
            </TabsTrigger>
            <TabsTrigger value="my-schedule" className="gap-2 font-bold text-xs">
              <Calendar className="w-4 h-4" /> Lịch Hẹn Đàm Phán ({matchings.length})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Tìm theo tên, công ty, ngành nghề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-slate-200 text-xs focus:border-blue-500 rounded-xl"
            />
          </div>
        </div>

        {/* TAB 1: AI ĐỀ XUẤT ĐỐI TÁC SMART MATCH */}
        <TabsContent value="ai-matching" className="space-y-4 m-0">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-2">
              <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">Chưa có đề xuất đối tác AI phù hợp</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery
                  ? `Không có đối tác nào khớp với từ khóa "${searchQuery}". Vui lòng thử lại.`
                  : 'Hệ thống đang liên tục phân tích hồ sơ năng lực và nhu cầu giao thương của các đại biểu mới.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCandidates.map((cand) => (
                <Card
                  key={cand.id}
                  className="border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all shadow-xs flex flex-col justify-between rounded-2xl overflow-hidden group"
                >
                  <CardHeader className="p-5 pb-3 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={cand.avatarUrl}
                          alt={cand.fullName}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500/20 group-hover:scale-105 transition-transform shrink-0"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cand.fullName)}&background=0066FF&color=fff&bold=true`;
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-[#0066FF] transition-colors">
                            {cand.fullName}
                          </h3>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{cand.title}</p>
                        </div>
                      </div>

                      {/* AI Match Score Badge */}
                      <div className="text-right shrink-0">
                        <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-xl shadow-xs">
                          {cand.matchScore}% Match
                        </Badge>
                      </div>
                    </div>

                    {/* Company Info Box */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-800 font-bold truncate">
                        <Building2 className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                        <span className="truncate">{cand.businessName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="truncate">{cand.industry}</span>
                        {cand.taxCode && <span className="font-mono text-[10px] text-slate-400">• MST {cand.taxCode}</span>}
                      </div>
                    </div>

                    {/* AI Synergy Reasons */}
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#FF6B00]" /> Điểm tương hợp B2B:
                      </p>
                      <div className="space-y-1">
                        {cand.synergyReasons.slice(0, 2).map((reason, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] mt-1.5 shrink-0" />
                            <span className="leading-snug">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="px-5 pb-5 pt-0">
                    {cand.connectionStatus === 'ACCEPTED' ? (
                      <Button
                        disabled
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 border-emerald-200 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-xs cursor-not-allowed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Đã Kết Nối (Pre-CRM Partner)
                      </Button>
                    ) : cand.connectionStatus === 'PENDING' ? (
                      <Button
                        disabled
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 border-orange-200 bg-orange-50 text-orange-700 font-bold rounded-xl text-xs cursor-not-allowed"
                      >
                        <Clock className="w-4 h-4 text-orange-600" /> Đang Chờ Đối Tác Phản Hồi
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          handleOpenRequestModal({
                            id: cand.identityId,
                            fullName: cand.fullName,
                            company: cand.businessName,
                            position: cand.title,
                            industry: cand.industry,
                            avatarUrl: cand.avatarUrl,
                          })
                        }
                        size="sm"
                        className="w-full gap-2 bg-gradient-to-r from-[#0066FF] to-[#FF6B00] hover:opacity-90 text-white font-bold rounded-xl shadow-xs cursor-pointer text-xs active:scale-95 transition-all"
                      >
                        <Plus className="w-4 h-4" /> Đặt Lịch Hẹn Giao Thương (1:1 B2B)
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 2: DANH BẠ DOANH NGHIỆP GRID */}
        <TabsContent value="directory" className="space-y-4 m-0">
          {filteredCompanies.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-2">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">Chưa có dữ liệu doanh nghiệp trong danh bạ</p>
              <p className="text-xs text-slate-400">Danh bạ kết nối đồng bộ trực tiếp từ bảng businesses trong cơ sở dữ liệu One Connect.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredCompanies.map((comp) => (
                <Card
                  key={comp.id}
                  className="border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all shadow-xs flex flex-col justify-between rounded-2xl group"
                >
                  <CardHeader className="p-5 pb-3 space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={comp.avatarUrl}
                        alt={comp.fullName}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500/20 group-hover:scale-105 transition-transform shrink-0"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comp.fullName)}&background=0066FF&color=fff&bold=true`;
                        }}
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
                        <span className="truncate">{comp.company}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{comp.association}</p>
                    </div>

                    <Button
                      onClick={() => handleOpenRequestModal(comp)}
                      size="sm"
                      className="w-full gap-2 bg-gradient-to-r from-[#0066FF] to-[#FF6B00] hover:opacity-90 text-white font-bold rounded-xl shadow-xs cursor-pointer text-xs active:scale-95 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Gửi Lời Mời Hẹn Gặp
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 3: LỊCH HẸN CỦA TÔI */}
        <TabsContent value="my-schedule" className="space-y-4 m-0">
          <Card className="border-slate-200 bg-white shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <CardTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#0066FF]" />
                  Danh Sách Cuộc Hẹn B2B Matchmaking
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1">
                  Quản lý các lịch hẹn đàm phán 1:1 đã nhận hoặc đã gửi tới đối tác sự kiện (Lưu vết trên bảng connections)
                </CardDescription>
              </div>

              {/* Status Filter buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {(['all', 'accepted', 'pending', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      statusFilter === st ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'all' ? 'Tất cả' : st === 'accepted' ? 'Đã đồng ý' : st === 'pending' ? 'Chờ phản hồi' : 'Từ chối'}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* MOBILE VIEW */}
              <div className="block md:hidden divide-y divide-slate-100 p-3 space-y-3">
                {filteredMatchings.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    Chưa có cuộc hẹn giao thương nào phù hợp với bộ lọc.
                  </div>
                ) : (
                  filteredMatchings.map((item) => {
                    const isIncoming = item.receiverId === currentUserId;
                    const partnerName = isIncoming ? item.senderName : item.receiverName;
                    const partnerCompany = isIncoming ? item.senderCompany : item.receiverCompany;
                    const partnerAvatar = isIncoming ? item.senderAvatar : item.receiverAvatar;

                    return (
                      <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
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
                              className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5 mr-1" /> Đồng ý
                            </Button>
                            <Button
                              onClick={() => handleRespondRequest(item.id, 'rejected')}
                              size="sm"
                              variant="outline"
                              className="h-8 border-slate-200 text-slate-600 hover:bg-slate-50 text-xs rounded-xl cursor-pointer"
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

              {/* DESKTOP TABLE VIEW */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="border-slate-200 hover:bg-transparent">
                      <TableHead className="text-slate-600 text-xs font-bold">Đối Tác Đàm Phán</TableHead>
                      <TableHead className="text-slate-600 text-xs font-bold">Doanh Nghiệp</TableHead>
                      <TableHead className="text-slate-600 text-xs font-bold">Thời Gian & Số Bàn</TableHead>
                      <TableHead className="text-slate-600 text-xs font-bold">Mục Tiêu Giao Thương</TableHead>
                      <TableHead className="text-slate-600 text-xs font-bold text-center">Trạng Thái</TableHead>
                      <TableHead className="text-slate-600 text-xs font-bold text-right">Hành Động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMatchings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-xs text-slate-500">
                          Chưa có cuộc hẹn giao thương nào phù hợp với bộ lọc.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMatchings.map((item) => {
                        const isIncoming = item.receiverId === currentUserId;
                        const partnerName = isIncoming ? item.senderName : item.receiverName;
                        const partnerCompany = isIncoming ? item.senderCompany : item.receiverCompany;
                        const partnerAvatar = isIncoming ? item.senderAvatar : item.receiverAvatar;

                        return (
                          <TableRow key={item.id} className="border-slate-100 hover:bg-slate-50/80 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img
                                  src={partnerAvatar}
                                  alt={partnerName}
                                  className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&background=0066FF&color=fff&bold=true`;
                                  }}
                                />
                                <div>
                                  <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                    {partnerName}
                                    {isIncoming ? (
                                      <Badge className="bg-blue-50 text-[#0066FF] border-blue-200 text-[9px] font-bold">
                                        Nhận được
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-[9px] font-bold">
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
                                    className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" /> Đồng ý
                                  </Button>
                                  <Button
                                    onClick={() => handleRespondRequest(item.id, 'rejected')}
                                    size="sm"
                                    variant="outline"
                                    className="h-8 gap-1 border-slate-200 text-slate-600 hover:bg-slate-50 text-xs rounded-xl cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" /> Từ chối
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 font-mono">Đã ghi nhận</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
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
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedTarget.fullName)}&background=0066FF&color=fff&bold=true`;
                  }}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{selectedTarget.fullName}</h4>
                  <p className="text-xs text-slate-600 truncate">{selectedTarget.position} • {selectedTarget.company}</p>
                  {selectedTarget.industry && (
                    <p className="text-[11px] text-[#0066FF] font-semibold truncate mt-0.5">{selectedTarget.industry}</p>
                  )}
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
              <label className="text-xs font-bold text-slate-700">Mục Tiêu Giao Thương / Trao Đổi</label>
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
              className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl"
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitRequest}
              className="bg-gradient-to-r from-[#0066FF] to-[#FF6B00] hover:opacity-90 text-white font-bold rounded-xl shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi Lời Mời Ngay'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
