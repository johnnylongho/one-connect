'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/PageHeader';
import { useOneConnectStore } from '@/lib/store';
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  ArrowRight,
  Clock,
  Building2,
  Ticket,
  ShieldCheck,
  QrCode,
  ArrowLeft,
  Zap,
  Sparkles,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';

export default function MemberEventHubPage() {
  const { state, currentIdentity, registerForEvent } = useOneConnectStore();
  const { toast } = useToast();

  const [mounted, setMounted] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState<'VIP' | 'STANDARD' | 'SPEAKER'>('VIP');
  const [pdplConsent, setPdplConsent] = useState(true);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleRegister = (eventId: string, eventName: string) => {
    if (!pdplConsent) {
      toast({
        title: 'CẦN ĐỒNG Ý PHÁP LÝ PDPL ⚠️',
        description: 'Vui lòng xác nhận đồng ý chia sẻ thông tin theo Luật PDPL 91/2025/QH15 để đăng ký vé.',
        variant: 'destructive',
      });
      return;
    }

    if (currentIdentity) {
      registerForEvent(eventId, currentIdentity.id, selectedTicketType);
    }
    toast({
      title: 'ĐĂNG KÝ VÉ THÀNH CÔNG! 🎉',
      description: `Mã vé NFC/QR đã được cấp cho sự kiện "${eventName}". Vui lòng xuất trình thẻ tại trạm soát vé.`,
      variant: 'success',
    });
  };

  return (
    <div className="space-y-6 w-full pb-16">
      {/* 1. STANDARDIZED PAGE HEADER */}
      <PageHeader
        supertitle="ONE CONNECT NETWORK • MODULE 2: QUẢN LÝ EVENT"
        title="Lịch Trình & Đăng Ký Sự Kiện"
        description="Đăng ký tham gia các sự kiện kết nối doanh nghiệp và quản lý vé NFC/QR 1-Click"
        icon={Calendar}
        badge="EVENT HUB"
        badgeVariant="orange"
        backHref="/dashboard"
        backLabel="Về Tổng quan"
      />

      <main className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0066FF]" /> Danh Sách Sự Kiện Giao Thương (SCR-B04)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Đăng ký tham gia các sự kiện kết nối doanh nghiệp và quản lý vé NFC/QR 1-Click
            </p>
          </div>
        </div>

        {/* EVENTS LIST */}
        <div className="space-y-6">
          {state.events.map((evt) => {
            const userRegistration = state.registrations.find(
              (r) => r.eventId === evt.id && r.personIdentityId === currentIdentity?.id
            );
            const isConfirmed = userRegistration?.registrationStatus === 'CONFIRMED' || userRegistration?.registrationStatus === 'ATTENDED';

            return (
              <div
                key={evt.id}
                className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all space-y-4 p-5 sm:p-6"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Event Banner */}
                  <div className="w-full md:w-64 h-44 rounded-2xl overflow-hidden relative shrink-0 border border-slate-200">
                    <img
                      src={evt.bannerUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80'}
                      alt={evt.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-[#0066FF] text-white text-[10px] font-bold border-0 shadow-md">
                        {evt.status === 'PUBLISHED' ? 'ĐANG MỞ ĐĂNG KÝ' : 'SẮP DIỄN RA'}
                      </Badge>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-bold text-[#0066FF] uppercase font-mono tracking-wider">
                          {evt.organizationName || 'Hiệp hội Doanh nhân Aplusvn'}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-heading mt-0.5">
                          {evt.name}
                        </h3>
                      </div>

                      {isConfirmed && (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 font-bold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đã Có Vé (NFC Active)
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {evt.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-4 h-4 text-[#0066FF]" />
                        <span suppressHydrationWarning>{new Date(evt.startAt).toLocaleString('vi-VN')}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#FF6B00]" /> {evt.locationName}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-purple-600" />
                        Đã đăng ký: <strong>{evt.registrationCount}</strong> đại biểu
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                        <CheckCircle2 className="w-4 h-4" /> Check-in: {evt.checkInCount} / {evt.registrationCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* TICKET REGISTRATION FORM OR TICKET PREVIEW */}
                {!isConfirmed ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 pt-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Ticket className="w-4 h-4 text-[#0066FF]" /> Chọn Hạng Vé Tham Dự:
                      </span>

                      <div className="flex gap-2">
                        {(['VIP', 'STANDARD', 'SPEAKER'] as const).map((tier) => (
                          <button
                            key={tier}
                            onClick={() => setSelectedTicketType(tier)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              selectedTicketType === tier
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            Vé {tier}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* PDPL Legal Consent Checkbox */}
                    <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer pt-2 border-t border-slate-200">
                      <input
                        type="checkbox"
                        checked={pdplConsent}
                        onChange={(e) => setPdplConsent(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>
                        Tôi đồng ý chia sẻ thông tin định danh doanh nghiệp theo Luật Bảo vệ Dữ liệu Cá nhân (PDPL 91/2025/QH15) khi tham gia sự kiện và kết nối B2B.
                      </span>
                    </label>

                    <Button
                      onClick={() => handleRegister(evt.id, evt.name)}
                      className="w-full bg-gradient-to-r from-[#0066FF] to-[#FF6B00] hover:opacity-90 text-white font-bold py-5 rounded-xl shadow-sm cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 mr-2" /> Xác Nhận Đăng Ký Vé & Kích Hoạt Thẻ NFC
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-900">
                          Vé Đã Sẵn Sàng (Mã QR & NFC Liên Kết)
                        </p>
                        <p className="text-[11px] text-emerald-700">
                          Chạm thẻ thông minh One Connect hoặc mở mã QR trên điện thoại tại cổng soát vé.
                        </p>
                      </div>
                    </div>

                    <Link href={`/c/${currentIdentity?.username || 'hoanglong'}`}>
                      <Button size="sm" variant="outline" className="text-xs border-emerald-300 text-emerald-800 bg-white hover:bg-emerald-50">
                        <QrCode className="w-3.5 h-3.5 mr-1.5" /> Xem Thẻ Số
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
