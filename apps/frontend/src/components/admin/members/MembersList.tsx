'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  Phone,
  Mail,
  CreditCard,
  Plus,
  ExternalLink,
  Crown,
  Lock,
  Unlock,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Award,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RoleType } from '@/lib/types';

export interface MemberItem {
  id: string;
  fullName: string;
  displayName?: string;
  title?: string;
  avatarUrl?: string;
  phone?: string;
  email?: string;
  role?: RoleType | string;
  status?: string;
  username?: string;
  businesses?: Array<{
    businessName: string;
    industry?: string;
  }>;
}

export interface MembersListProps {
  members: MemberItem[];
  cards: Array<{
    id?: string;
    cardUid: string;
    personIdentityId: string;
    status: string;
  }>;
  onIssueCard?: (member: MemberItem) => void;
  onViewCard?: (member: MemberItem, cardUid?: string) => void;
  onChangeRole?: (memberId: string, newRole: RoleType) => void;
  onToggleStatus?: (member: MemberItem) => void;
  onDeleteMember?: (member: MemberItem) => void;
}

export function MembersList({
  members,
  cards,
  onIssueCard,
  onViewCard,
  onChangeRole,
  onToggleStatus,
  onDeleteMember,
}: MembersListProps) {
  // Empty State: Tuân thủ Zero Mock Data Mandate
  if (!members || members.length === 0) {
    return (
      <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-10 sm:p-14 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 text-[#0066FF] flex items-center justify-center border border-blue-100 shadow-2xs">
          <Users className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
            Chưa có hội viên nào trong tổ chức
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Hệ thống hiển thị trạng thái thực tế từ cơ sở dữ liệu Supabase. Vui lòng thêm hội viên mới hoặc kiểm tra lại bộ lọc tìm kiếm.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 w-full">
      {members.map((m) => {
        // Find assigned active card
        const assignedCard =
          cards.find((c) => c.personIdentityId === m.id && c.status === 'ACTIVE') ||
          cards.find((c) => c.personIdentityId === m.id);

        const hasCard = Boolean(assignedCard && assignedCard.cardUid);
        const cardUid = assignedCard?.cardUid || '';

        const companyName =
          m.businesses && m.businesses[0]?.businessName
            ? m.businesses[0].businessName
            : 'Doanh nghiệp Hội viên';

        const profileLink = `/p/${m.username || m.id}`;
        const isInactive = m.status === 'INACTIVE';
        const isSuperAdmin =
          m.username === 'johnnylongho' ||
          m.id === 'id-001' ||
          m.id === '11111111-1111-1111-1111-111111111111' ||
          (m.email && m.email.toLowerCase() === 'contact.johnnylongho@gmail.com');

        return (
          <div
            key={m.id}
            className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 sm:p-5 bg-white rounded-2xl border shadow-sm hover:shadow-md hover:border-blue-300 transition-all gap-4 group ${
              isInactive
                ? 'bg-slate-50/70 border-slate-300 opacity-80'
                : 'border-slate-200/90'
            }`}
          >
            {/* Left side: Avatar, Tên, Chức danh, Công ty, Số điện thoại */}
            <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
              <div className="relative shrink-0">
                <img
                  src={m.avatarUrl || '/avatar-johnny-long.jpg'}
                  alt={m.fullName}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shadow-2xs border bg-slate-100 group-hover:scale-105 transition-transform ${
                    isInactive ? 'border-rose-300 grayscale-30' : 'border-slate-200'
                  }`}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      m.fullName
                    )}&backgroundColor=0066ff,00c2ff`;
                  }}
                />
                {isInactive && (
                  <div
                    className="absolute -bottom-1 -right-1 bg-rose-600 text-white rounded-full p-1 shadow-xs"
                    title="Tài khoản tạm khóa"
                  >
                    <Lock className="w-3 h-3" />
                  </div>
                )}
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4
                    className={`font-black text-sm sm:text-base tracking-tight font-heading truncate ${
                      isInactive ? 'text-slate-500 line-through' : 'text-slate-900'
                    }`}
                  >
                    {m.fullName}
                  </h4>

                  {isSuperAdmin ? (
                    <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-[10px] font-extrabold">
                      SUPER ADMIN
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-50 text-[#0066FF] border-blue-200 text-[10px] font-bold">
                      {(m.role as string) || 'MEMBER'}
                    </Badge>
                  )}
                </div>

                <p className="text-xs sm:text-[13px] font-bold text-[#0066FF] truncate">
                  {m.title || 'Hội Viên Doanh Nhân'}
                </p>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1 truncate max-w-xs">
                    <Building2 className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                    <span className="truncate">{companyName}</span>
                  </span>

                  {m.phone && (
                    <a
                      href={`tel:${m.phone}`}
                      className="inline-flex items-center gap-1 font-mono text-slate-500 hover:text-[#0066FF] shrink-0"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{m.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right side: Badge trạng thái thẻ & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
              {/* Badge trạng thái: Xanh (Đã có thẻ) / Vàng (Chưa có thẻ) */}
              <div className="flex items-center gap-2">
                {hasCard ? (
                  <Badge className="h-9 sm:h-10 px-3 bg-emerald-50 text-emerald-700 border-emerald-300 text-xs font-mono font-bold rounded-xl gap-1.5 flex items-center shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>ĐÃ NHẬN THẺ: {cardUid}</span>
                  </Badge>
                ) : (
                  <Badge className="h-9 sm:h-10 px-3 bg-amber-50 text-amber-700 border-amber-300 text-xs font-bold rounded-xl gap-1.5 flex items-center shadow-2xs">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>CHƯA CÓ THẺ NFC</span>
                  </Badge>
                )}
              </div>

              {/* Tablet-First Touch Action Buttons (min h-10 px-4) */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {hasCard ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onViewCard?.(m, cardUid)}
                    className="h-10 px-4 rounded-xl border-slate-200 text-slate-800 hover:bg-slate-50 font-bold text-xs sm:text-sm gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                  >
                    <CreditCard className="w-4 h-4 text-[#0066FF] shrink-0" />
                    <span>Xem Thẻ</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => onIssueCard?.(m)}
                    className="h-10 px-4 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm gap-1.5 shadow-sm cursor-pointer active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>Cấp Thẻ Mới</span>
                  </Button>
                )}

                <Link
                  href={profileLink}
                  className="h-10 px-3 rounded-xl bg-blue-50/80 text-[#0066FF] hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-all inline-flex items-center justify-center gap-1 shadow-2xs"
                  title="Xem Profile Doanh Nhân"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Hồ Sơ</span>
                </Link>

                {/* Inline Deactivate / Activate Button */}
                {!isSuperAdmin && onToggleStatus && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onToggleStatus(m)}
                    className={`h-10 w-10 rounded-xl transition-all cursor-pointer ${
                      isInactive
                        ? 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        : 'border-slate-200 text-slate-500 hover:text-amber-700 hover:bg-amber-50'
                    }`}
                    title={isInactive ? 'Kích hoạt lại tài khoản' : 'Khóa tài khoản này'}
                  >
                    {isInactive ? (
                      <Unlock className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </Button>
                )}

                {/* Delete Member Button */}
                {!isSuperAdmin && onDeleteMember && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onDeleteMember(m)}
                    className="h-10 w-10 rounded-xl border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer"
                    title="Xóa hội viên"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
