'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  ArrowLeft,
  ChevronRight,
  GitCompare,
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
    setNote(`Mong muốn hẹn gặp ${target.fullName} (${target.company}) để trao đổi cơ hội hợp tác B2B và ký kết thỏa thuận hợp tác.`);
    setIsDialogOpen(true);
  };

  const handleSubmitRequest = async () => {
    if (!selectedTarget) return;

    setIsSubmitting(true);

    try {
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
      {/* 1. TOP STATUS BAR: BREADCRUMB & REALTIME BADGE */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-3 sm:px-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Về Command Center Quản Trị"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">
                Sàn Giao Thương B2B 1:1 Matchmaking
              </span>
              <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-[10px] font-mono font-bold">
                AI ENGINE · TRL-7
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Hệ thống ghép đôi đối tác thông minh, tự động xếp bàn đàm phán và bảo mật 2-Way Consent
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <Button
            onClick={() => {
              const firstCompany = companies[0];
              if (firstCompany) {
                handleOpenRequestModal(firstCompany);
              } else {
                setIsDialogOpen(true);
              }
            }}
            size="sm"
            className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Tạo Yêu Cầu Kết Nối
          </Button>
        </div>
      </div>

      {/* 2. HERO BANNER: THEME MỚI (DARK PURPLE/INDIGO GRADIENT) */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-7 text-white border border-purple-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[11px] font-semibold border border-purple-400/30">
              PHÂN HỆ 4 · THUẬT TOÁN AI MATCHMAKING
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Khớp nối Cung - Cầu Tự Động &lt;1s
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Sàn Đàm Phán Giao Thương B2B 1:1 Do AI Điều Phối
          </h2>
          <p className="text-xs text-purple-200/80 max-w-xl leading-relaxed">
            Tự động bóc tách hồ sơ năng lực doanh nghiệp, phân loại nhu cầu Cung - Cầu và bố trí 32 bàn đàm phán 1:1 theo từng khung giờ sự kiện. Tuân thủ 100% cơ chế 2-Way Consent theo Luật PDPL 91/2025.
          </p>
        </div>

        {/* METRICS STATS PILLS */}
        <div className="grid grid-cols-3 gap-2.5 bg-white/10 p-2.5 rounded-2xl border border-white/15 self-start md:self-auto shrink-0 text-center">
          <div className="px-3 py-1.5 bg-white/5 rounded-xl">
            <span className="text-[10px] text-purple-200 block uppercase font-medium">Đã Gửi</span>
            <span className="font-mono font-bold text-sm sm:text-base text-white">{sentRequestsCount}</span>
          </div>
          <div className="px-3 py-1.5 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
            <span className="text-[10px] text-emerald-300 block uppercase font-medium">Đã Khóa Bàn</span>
            <span className="font-mono font-bold text-sm sm:text-base text-emerald-300">{acceptedCount}</span>
          </div>
          <div className="px-3 py-1.5 bg-amber-500/20 rounded-xl border border-amber-400/30">
            <span className="text-[10px] text-amber-300 block uppercase font-medium">Chờ Phản Hồi</span>
            <span className="font-mono font-bold text-sm sm:text-base text-amber-300">{pendingCount}</span>
          </div>
        </div>
      </div>

      {/* 3. METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase text-[10px]">Cuộc Hẹn Đã Khởi Tạo</span>
            <Send className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{sentRequestsCount}</div>
          <p className="text-[11px] text-blue-600 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3" /> Chạm thẻ NFC &amp; AI Match
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase text-[10px]">Đã Chốt Bàn Đàm Phán</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600">{acceptedCount}</div>
          <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
            <UserCheck className="w-3 h-3" /> Sẵn sàng ký MOU hợp tác
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase text-[10px]">Đang Chờ Đối Tác</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600">{pendingCount}</div>
          <p className="text-[11px] text-amber-600 flex items-center gap-1 font-medium">
            <Clock className="w-3 h-3" /> Tự động nhắc qua Zalo ZNS
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase text-[10px]">Ứng Viên Khớp Nhu Cầu</span>
            <GitCompare className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-600">{filteredCandidates.length}</div>
          <p className="text-[11px] text-purple-600 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3" /> Tương hợp trên 85%
          </p>
        </div>
      </div>

      {/* 4. MAIN INTERACTIVE TABS */}
      <Tabs defaultValue="ai-matching" className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 sm:px-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <TabsList className="bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="ai-matching" className="gap-2 font-bold text-xs cursor-pointer">
              <Sparkles className="w-4 h-4 text-amber-500" /> AI Đề Xuất Đối Tác ({filteredCandidates.length})
            </TabsTrigger>
            <TabsTrigger value="my-schedule" className="gap-2 font-bold text-xs cursor-pointer">
              <Calendar className="w-4 h-4 text-blue-600" /> Lịch Hẹn Đàm Phán ({matchings.length})
            </TabsTrigger>
            <TabsTrigger value="directory" className="gap-2 font-bold text-xs cursor-pointer">
              <Building2 className="w-4 h-4 text-purple-600" /> Danh Bạ Doanh Nghiệp ({filteredCompanies.length})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, công ty, ngành nghề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* TAB 1: AI ĐỀ XUẤT ĐỐI TÁC SMART MATCH */}
        <TabsContent value="ai-matching" className="space-y-4 m-0">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-2 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-800 text-sm">Chưa có đề xuất đối tác AI phù hợp</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                {searchQuery
                  ? `Không có đối tác nào khớp với từ khóa "${searchQuery}". Vui lòng thử lại.`
                  : 'Hệ thống đang liên tục phân tích hồ sơ năng lực và nhu cầu giao thương của các đại biểu mới.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCandidates.map((cand) => (
                <div
                  key={cand.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-purple-300 hover:shadow-md transition-all shadow-2xs flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={cand.avatarUrl}
                          alt={cand.fullName}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0 group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              cand.fullName
                            )}&background=0066FF&color=fff&bold=true`;
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-purple-600 transition-colors">
                            {cand.fullName}
                          </h4>
                          <p className="text-xs text-slate-500 truncate">{cand.title}</p>
                        </div>
                      </div>

                      {/* AI Match Score Badge */}
                      <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-mono font-bold text-xs shadow-2xs shrink-0">
                        {cand.matchScore}% Match
                      </span>
                    </div>

                    {/* Company Info Box */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-800 font-bold truncate">
                        <Building2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="truncate">{cand.businessName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="truncate">{cand.industry}</span>
                        {cand.taxCode && <span className="font-mono text-[10px] text-slate-400">• MST {cand.taxCode}</span>}
                      </div>
                    </div>

                    {/* AI Synergy Reasons */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" /> Điểm tương hợp Cung - Cầu:
                      </p>
                      <div className="space-y-1">
                        {cand.synergyReasons.slice(0, 2).map((reason, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                            <span className="leading-snug text-[11.5px]">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-100">
                    {cand.connectionStatus === 'ACCEPTED' ? (
                      <Button
                        disabled
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 border-emerald-200 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-xs cursor-not-allowed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Đã Khóa Bàn Đàm Phán
                      </Button>
                    ) : cand.connectionStatus === 'PENDING' ? (
                      <Button
                        disabled
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 border-amber-200 bg-amber-50 text-amber-700 font-bold rounded-xl text-xs cursor-not-allowed"
                      >
                        <Clock className="w-4 h-4 text-amber-600" /> Đang Chờ Đối Tác Phản Hồi
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
                        className="w-full gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-2xs cursor-pointer text-xs active:scale-95 transition-all"
                      >
                        <Plus className="w-4 h-4" /> Đặt Lịch Hẹn Đàm Phán 1:1
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 2: LỊCH HẸN ĐÀM PHÁN (SCHEDULED SESSIONS) */}
        <TabsContent value="my-schedule" className="space-y-4 m-0">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  Danh Sách Cuộc Hẹn B2B Matchmaking
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quản lý các lịch hẹn đàm phán 1:1 đã nhận hoặc đã gửi tới đối tác sự kiện (Bảo mật 2-Way Consent)
                </p>
              </div>

              {/* Status Filter buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                {(['all', 'accepted', 'pending', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      statusFilter === st
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'all'
                      ? 'Tất cả'
                      : st === 'accepted'
                      ? 'Đã đồng ý'
                      : st === 'pending'
                      ? 'Chờ phản hồi'
                      : 'Từ chối'}
                  </button>
                ))}
              </div>
            </div>

            {/* TABLE VIEW */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-200">
                    <TableHead className="text-slate-600 text-xs font-bold py-3.5">Đối Tác Đàm Phán</TableHead>
                    <TableHead className="text-slate-600 text-xs font-bold py-3.5">Doanh Nghiệp</TableHead>
                    <TableHead className="text-slate-600 text-xs font-bold py-3.5">Thời Gian &amp; Bàn</TableHead>
                    <TableHead className="text-slate-600 text-xs font-bold py-3.5">Ghi Chú Hợp Tác</TableHead>
                    <TableHead className="text-slate-600 text-xs font-bold text-center py-3.5">Trạng Thái</TableHead>
                    <TableHead className="text-slate-600 text-xs font-bold text-right py-3.5">Hành Động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMatchings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-36 text-center text-xs text-slate-400">
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
                          <TableCell className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={partnerAvatar}
                                alt={partnerName}
                                className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    partnerName
                                  )}&background=0066FF&color=fff&bold=true`;
                                }}
                              />
                              <div>
                                <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                  {partnerName}
                                  {isIncoming ? (
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                                      Nhận được
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                      Đã gửi
                                    </span>
                                  )}
                                </p>
                                <p className="text-[10px] text-slate-400">{item.createdAt}</p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="py-3 px-4 text-xs font-medium text-slate-800">
                            {partnerCompany}
                          </TableCell>

                          <TableCell className="py-3 px-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 text-xs text-purple-700 font-bold">
                                <Clock className="w-3.5 h-3.5" />
                                {item.meetingTime}
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-amber-700 font-medium">
                                <MapPin className="w-3 h-3" />
                                {item.tableNumber}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="py-3 px-4 text-xs text-slate-600 max-w-xs truncate">
                            {item.note || '—'}
                          </TableCell>

                          <TableCell className="py-3 px-4 text-center">
                            {item.status === 'accepted' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" /> Đã Đồng Ý
                              </span>
                            )}
                            {item.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                <Clock className="w-3 h-3" /> Chờ Phản Hồi
                              </span>
                            )}
                            {item.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                <XCircle className="w-3 h-3" /> Từ Chối
                              </span>
                            )}
                          </TableCell>

                          <TableCell className="py-3 px-4 text-right">
                            {isIncoming && item.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  onClick={() => handleRespondRequest(item.id, 'accepted')}
                                  size="sm"
                                  className="h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg cursor-pointer"
                                >
                                  Đồng ý
                                </Button>
                                <Button
                                  onClick={() => handleRespondRequest(item.id, 'rejected')}
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 border-slate-200 text-slate-600 hover:bg-slate-50 text-[11px] rounded-lg cursor-pointer"
                                >
                                  Từ chối
                                </Button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400 font-mono">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: DANH BẠ DOANH NGHIỆP GIAO THƯƠNG */}
        <TabsContent value="directory" className="space-y-4 m-0">
          {filteredCompanies.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-2 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-800 text-sm">Chưa có dữ liệu doanh nghiệp trong danh bạ</p>
              <p className="text-xs text-slate-400">Danh bạ kết nối đồng bộ trực tiếp từ cơ sở dữ liệu Supabase.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredCompanies.map((comp) => (
                <div
                  key={comp.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-purple-300 hover:shadow-md transition-all shadow-2xs flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={comp.avatarUrl}
                        alt={comp.fullName}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0 group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            comp.fullName
                          )}&background=0066FF&color=fff&bold=true`;
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-purple-600 transition-colors">
                          {comp.fullName}
                        </h4>
                        <p className="text-xs text-slate-500 truncate">{comp.position}</p>
                        <Badge variant="outline" className="mt-1 text-[9px] bg-slate-50 text-slate-600 border-slate-200">
                          {comp.industry}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-800 font-bold truncate">
                        <Building2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="truncate">{comp.company}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 truncate">{comp.association}</p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100">
                    <Button
                      onClick={() => handleOpenRequestModal(comp)}
                      size="sm"
                      className="w-full gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-2xs cursor-pointer text-xs active:scale-95 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Gửi Lời Mời Hẹn Gặp
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 5. MODAL DIALOG: ĐẶT LỊCH HẸN B2B MATCHMAKING */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl">
          <DialogHeader className="space-y-1.5 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-purple-600">
              <Sparkles className="w-5 h-5" />
              <DialogTitle className="text-lg font-bold text-slate-900">
                Khởi Tạo Cuộc Hẹn Đàm Phán B2B 1:1
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500 leading-relaxed">
              Xác nhận thời gian và bàn giao thương VIP. Khi đối tác chấp thuận, thông báo xác nhận sẽ gửi qua Zalo ZNS và xếp lịch tự động.
            </DialogDescription>
          </DialogHeader>

          {selectedTarget && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <img
                src={selectedTarget.avatarUrl}
                alt={selectedTarget.fullName}
                className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs text-slate-900">{selectedTarget.fullName}</p>
                <p className="text-[11px] text-purple-700 font-semibold">{selectedTarget.company}</p>
                <p className="text-[10px] text-slate-400">{selectedTarget.position || selectedTarget.industry}</p>
              </div>
            </div>
          )}

          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Khung Giờ Đàm Phán</label>
                <select
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500"
                >
                  <option value="09:00 - 09:30">09:00 - 09:30</option>
                  <option value="09:30 - 10:00">09:30 - 10:00</option>
                  <option value="10:15 - 10:45">10:15 - 10:45</option>
                  <option value="11:00 - 11:30">11:00 - 11:30</option>
                  <option value="14:00 - 14:30">14:00 - 14:30</option>
                  <option value="14:30 - 15:00">14:30 - 15:00</option>
                  <option value="15:15 - 15:45">15:15 - 15:45</option>
                  <option value="16:00 - 16:30">16:00 - 16:30</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Số Bàn B2B VIP</label>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500"
                >
                  {Array.from({ length: 16 }).map((_, i) => (
                    <option key={i} value={`Bàn B2B-${String(i + 1).padStart(2, '0')}`}>
                      Bàn B2B-{String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Ghi Chú Mục Tiêu Giao Thương / MOU</label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nêu rõ nội dung bạn muốn trao đổi (ví dụ: Nhu cầu cung ứng, đề xuất hợp tác phân phối, ký kết MOU)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-xl border-slate-200 text-slate-600 text-xs"
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleSubmitRequest}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-2xs gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Đang gửi yêu cầu...' : 'Gửi Lời Mời Giao Thương'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
