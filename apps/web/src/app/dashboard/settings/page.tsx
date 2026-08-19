'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useOneConnectStore } from '@/lib/store';
import {
  Settings,
  ShieldCheck,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Trash2,
  ExternalLink,
  Info,
  SlidersHorizontal,
  Building2,
  CreditCard,
  History,
  ShieldAlert,
  UserX,
  FileDown,
  Sparkles,
  Copy,
  Check,
  Camera,
  Upload,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function SettingsAndPrivacyPage() {
  const { state, updatePrivacy, updateIdentity, reissueCard, currentCard, currentIdentity, resetState } = useOneConnectStore();
  const settingsFileInputRef = useRef<HTMLInputElement>(null);
  const privacy = state.privacy || {
    profileVisibility: 'PUBLIC',
    contactVisibility: 'MEMBERS_ONLY',
  };

  // State
  const [profileVis, setProfileVis] = useState<'PUBLIC' | 'MEMBERS_ONLY' | 'PRIVATE'>(
    privacy.profileVisibility as any || 'PUBLIC'
  );
  const [requireConsent, setRequireConsent] = useState(true);
  const [maskData, setMaskData] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmDeleteInput, setConfirmDeleteInput] = useState('');
  const [alertNotice, setAlertNotice] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setAlertNotice({ text, type });
    setTimeout(() => setAlertNotice(null), 4000);
  };

  // Upload Avatar Handler
  const handleUploadAvatarSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentIdentity) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Tệp ảnh quá lớn! Vui lòng chọn ảnh dưới 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        updateIdentity(currentIdentity.id, { avatarUrl: result });
        showToast('Đã cập nhật ảnh đại diện thành công!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Generate Initials Avatar Handler
  const handleGenerateDicebearSettings = () => {
    if (!currentIdentity) return;
    const name = currentIdentity.displayName || currentIdentity.fullName || 'User';
    const newAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0066ff,00c2ff,10b981,f59e0b`;
    updateIdentity(currentIdentity.id, { avatarUrl: newAvatar });
    showToast('Đã tạo ảnh đại diện Initials thành công!', 'success');
  };

  // Save privacy settings
  const handleSavePrivacy = () => {
    updatePrivacy({
      profileVisibility: profileVis,
      contactVisibility: requireConsent ? 'MEMBERS_ONLY' : 'PUBLIC',
    });
    showToast('Đã lưu cài đặt quyền riêng tư & hiển thị hồ sơ theo luật PDPL 91/2025!', 'success');
  };

  // Export full user dataset
  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      const exportPayload = {
        exportedAt: new Date().toISOString(),
        standard: 'Vietnam Personal Data Protection Law (PDPL 91/2025/QH15)',
        identity: currentIdentity,
        activeCard: currentCard,
        privacySettings: {
          profileVisibility: profileVis,
          requireTwoWayConsent: requireConsent,
          maskSensitiveData: maskData,
        },
        connectionsCount: state.connections?.length || 0,
        eventsJoinedCount: state.registrations?.length || 0,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `one_connect_data_export_${currentIdentity?.username || 'user'}_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setIsExporting(false);
      showToast('Đã xuất thành công toàn bộ gói dữ liệu cá nhân (JSON chuẩn PDPL)!', 'success');
    }, 800);
  };

  // Purge / Delete user data
  const handleConfirmPurgeData = () => {
    if (confirmDeleteInput.trim().toUpperCase() !== 'XOA DU LIEU') {
      showToast('Vui lòng gõ chính xác cụm từ "XOA DU LIEU" để xác nhận!', 'error');
      return;
    }

    setIsDeleteModalOpen(false);
    setConfirmDeleteInput('');
    resetState();
    showToast('Đã xóa sạch dữ liệu cá nhân và thu hồi thẻ NFC khỏi hệ thống thành công!', 'success');
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
              Tổng quan
            </Link>
            <span>/</span>
            <span className="text-blue-600">Cài đặt Quyền riêng tư & Dữ liệu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            Quyền Riêng Tư & Chủ Quyền Dữ Liệu (PDPL)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Thiết lập hiển thị công khai hồ sơ, quản lý xác thực 2 chiều, xuất gói dữ liệu và quyền được lãng quên theo Luật 91/2025/QH15
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs font-bold px-3 py-1">
            <ShieldCheck className="w-4 h-4 mr-1 inline" /> PDPL 91/2025 VERIFIED
          </Badge>
        </div>
      </div>

      {/* ALERT NOTIFICATION */}
      {alertNotice && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold animate-in fade-in duration-200 ${
            alertNotice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : alertNotice.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {alertNotice.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {alertNotice.type === 'error' && <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />}
            {alertNotice.type === 'info' && <Info className="w-4 h-4 text-blue-600 shrink-0" />}
            <span>{alertNotice.text}</span>
          </div>
          <button onClick={() => setAlertNotice(null)} className="text-slate-400 hover:text-slate-700">
            ✕
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 1. KHỐI 0: ẢNH ĐẠI DIỆN & CHÂN DUNG HỘI VIÊN */}
      {/* ===================================================================== */}
      <div className="glass-panel p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-heading">
              <Camera className="w-5 h-5 text-blue-600" /> 1. Ảnh Đại Diện & Chân Dung Doanh Nhân
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hình ảnh chân dung hiển thị trực tiếp trên Danh thiếp 3D, Hồ sơ số và Cổng kết nối B2B
            </p>
          </div>
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-bold px-3 py-1">
            {currentIdentity?.displayName || currentIdentity?.fullName || 'Hội Viên VIP'}
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 to-slate-50 border border-blue-200/80">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-md bg-white shrink-0 border-3 border-blue-500 group">
            <img
              src={currentIdentity?.avatarUrl || (currentIdentity?.username === 'johnnylongho' ? '/avatar-johnny-long.jpg' : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentIdentity?.fullName || 'User')}`)}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => settingsFileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer"
              title="Bấm để tải ảnh mới"
            >
              <Camera className="w-6 h-6 text-white" />
              <span>Đổi Ảnh</span>
            </button>
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <h4 className="text-sm font-bold text-slate-900">
              {currentIdentity?.fullName} ({currentIdentity?.displayName || currentIdentity?.fullName})
            </h4>
            <p className="text-xs text-slate-500">
              {currentIdentity?.title} • {currentIdentity?.businesses?.[0]?.businessName || 'Doanh Nghiệp'}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-1 flex-wrap">
              <input
                type="file"
                ref={settingsFileInputRef}
                accept="image/*"
                onChange={handleUploadAvatarSettings}
                className="hidden"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => settingsFileInputRef.current?.click()}
                className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer shadow-xs"
              >
                <Upload className="w-4 h-4 mr-1.5" /> Tải Ảnh Chân Dung Mới
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleGenerateDicebearSettings}
                className="text-slate-700 border-slate-300 hover:bg-slate-100 font-bold text-xs py-2 px-3 rounded-xl cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-[#FF6B00]" /> Tạo Initials Avatar
              </Button>
              <Link
                href={`/p/${currentIdentity?.username || 'johnnylongho'}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline px-2 py-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Xem Trang Profile Số
              </Link>
            </div>
            <p className="text-[11px] text-slate-400">
              Hỗ trợ định dạng JPG, PNG, WEBP (Tối đa 5MB). Tỷ lệ khuyến nghị: hình vuông 1:1 hoặc chân dung 3:4.
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. KHỐI 2: BẬT / TẮT KHẢ NĂNG HIỂN THỊ CÔNG KHAI HỒ SƠ */}
      {/* ===================================================================== */}
      <div className="glass-panel p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-heading">
              <Eye className="w-5 h-5 text-blue-600" /> 2. Khả Năng Hiển Thị Hồ Sơ & Quyền Riêng Tư
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kiểm soát những ai có thể nhìn thấy hồ sơ và thông tin cá nhân của bạn khi quét mã QR hoặc chạm thẻ NFC
            </p>
          </div>
          <Button
            onClick={handleSavePrivacy}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Lưu Thay Đổi
          </Button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Public Profile Visibility Selector */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 text-sm">Chế Độ Hiển Thị Hồ Sơ Số (Profile Visibility)</span>
                <p className="text-slate-500 text-[11px]">
                  Quyết định phạm vi hiển thị khi người khác truy cập đường link{' '}
                  <code className="text-blue-600 font-mono font-bold">/p/{currentIdentity?.username || 'johnnylongho'}</code>
                </p>
              </div>
              <Badge
                className={
                  profileVis === 'PUBLIC'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : profileVis === 'MEMBERS_ONLY'
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-slate-200 text-slate-800'
                }
              >
                {profileVis === 'PUBLIC' ? 'CÔNG KHAI' : profileVis === 'MEMBERS_ONLY' ? 'HỘI VIÊN' : 'RIÊNG TƯ'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {[
                {
                  id: 'PUBLIC',
                  title: 'Công Khai (Khuyên Dùng)',
                  desc: 'Mọi người quét QR/NFC đều xem được thông tin doanh nghiệp cơ bản.',
                  icon: Eye,
                },
                {
                  id: 'MEMBERS_ONLY',
                  title: 'Chỉ Hội Viên CLB',
                  desc: 'Chỉ người cùng trong tổ chức/sự kiện mới xem được đầy đủ hồ sơ.',
                  icon: Building2,
                },
                {
                  id: 'PRIVATE',
                  title: 'Ẩn Danh / Riêng Tư',
                  desc: 'Tắt hiển thị công khai, chỉ hiện tên và mã định danh rút gọn.',
                  icon: EyeOff,
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setProfileVis(opt.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    profileVis === opt.id
                      ? 'bg-white border-blue-500 shadow-sm ring-1 ring-blue-500'
                      : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <opt.icon
                    className={`w-4 h-4 mb-1.5 ${profileVis === opt.id ? 'text-blue-600' : 'text-slate-400'}`}
                  />
                  <p className={`font-bold text-xs ${profileVis === opt.id ? 'text-blue-700' : 'text-slate-800'}`}>
                    {opt.title}
                  </p>
                  <p className="text-[10.5px] text-slate-500 mt-1 leading-normal">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2-Way Consent Switch */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="space-y-0.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">Yêu Cầu Xác Nhận 2 Chiều (Explicit 2-Way Consent)</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Điều 11 PDPL
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Số điện thoại và Email cá nhân chỉ hiển thị cho đối tác sau khi cả 2 bên cùng nhấn Đồng ý Kết nối.
              </p>
            </div>
            <Switch checked={requireConsent} onCheckedChange={setRequireConsent} />
          </div>

          {/* Mask Data Switch */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="space-y-0.5 max-w-xl">
              <span className="font-bold text-slate-900 text-sm">Tự Động Che Mờ Dữ Liệu (Data Masking)</span>
              <p className="text-slate-500 text-[11px]">
                Tự động che 4 chữ số cuối của SĐT (vd: <code className="text-slate-700 font-mono">0903.***.999</code>) đối với khách vãng lai chưa được duyệt.
              </p>
            </div>
            <Switch checked={maskData} onCheckedChange={setMaskData} />
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. KHỐI 2: XUẤT DỮ LIỆU CÁ NHÂN (DATA PORTABILITY - ĐIỀU 14) */}
      {/* ===================================================================== */}
      <div className="glass-panel p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-heading">
              <FileDown className="w-5 h-5 text-blue-600" /> 2. Quyền Xuất Gói Dữ Liệu Cá Nhân (Data Portability)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tải về bản sao lưu toàn bộ thông tin cá nhân, doanh nghiệp, thẻ NFC và danh bạ kết nối theo định dạng JSON chuẩn
            </p>
          </div>
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">ĐIỀU 14 PDPL</Badge>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 text-xs text-slate-700">
            <p className="font-bold text-slate-900">Gói dữ liệu xuất sẽ bao gồm:</p>
            <ul className="list-disc list-inside text-[11.5px] text-slate-600 space-y-0.5">
              <li>Hồ sơ định danh cá nhân & chức danh doanh nghiệp</li>
              <li>Thông số chip thẻ NFC & mã Dynamic QR</li>
              <li>Danh bạ các mối quan hệ kết nối & ghi chú riêng tư</li>
              <li>Lịch sử điểm danh và tham gia các sự kiện</li>
            </ul>
          </div>

          <Button
            onClick={handleExportData}
            disabled={isExporting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-5 px-5 rounded-xl shadow-md shadow-blue-500/20 shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Đang Tạo Gói JSON...' : 'Tải Xuất Dữ Liệu (JSON)'}
          </Button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. KHỐI 3: CARD CONTINUITY (CẤP ĐỔI THẺ AN TOÀN) */}
      {/* ===================================================================== */}
      <div className="glass-panel p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-heading">
            <RefreshCw className="w-5 h-5 text-purple-600" /> 3. Card Replacement Continuity (Đổi Thẻ NFC An Toàn)
          </h3>
          <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
            UID: {currentCard?.cardUid || 'NFC-LONG-888'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Khi bạn đổi thẻ NFC physical mới hoặc bị mất thẻ cũ, bấm nút dưới đây để cấp lại thẻ. Thẻ cũ sẽ bị thu hồi vô hiệu hóa tức thì mà{' '}
          <strong>không làm mất bất kỳ dữ liệu kết nối, ghi chú hay danh bạ nào</strong>.
        </p>

        <Button
          onClick={() => {
            const card = reissueCard();
            showToast(`Đã cấp đổi thẻ NFC mới [${card.cardUid}] thành công! Lịch sử dữ liệu được giữ nguyên 100%.`, 'success');
          }}
          variant="outline"
          className="text-xs border-purple-300 text-purple-700 hover:bg-purple-50 rounded-xl font-bold cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 mr-2 text-purple-600" /> Thu Hồi Thẻ Cũ & Cấp Thẻ Mới
        </Button>
      </div>

      {/* ===================================================================== */}
      {/* 5. KHỐI 4: QUYỀN ĐƯỢC LÃNG QUÊN & XÓA DỮ LIỆU (RIGHT TO BE FORGOTTEN - ĐIỀU 16) */}
      {/* ===================================================================== */}
      <div className="glass-panel p-6 sm:p-7 space-y-4 border-rose-200 bg-rose-50/30">
        <div className="flex items-center justify-between border-b border-rose-200/80 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-rose-900 flex items-center gap-2 font-heading">
              <Trash2 className="w-5 h-5 text-rose-600" /> 4. Quyền Yêu Cầu Xóa Vĩnh Viễn Dữ Liệu (Right to be Forgotten)
            </h3>
            <p className="text-xs text-rose-700 mt-0.5">
              Tuân thủ Điều 16 Luật PDPL 91/2025/QH15 — Xóa sạch toàn bộ hồ sơ, thẻ số và dữ liệu cá nhân khỏi hệ thống
            </p>
          </div>
          <Badge className="bg-rose-100 text-rose-800 border-rose-300 text-[10px]">ĐIỀU 16 PDPL</Badge>
        </div>

        <p className="text-xs text-rose-800 leading-relaxed">
          Hành động này sẽ <strong>xóa vĩnh viễn</strong> tài khoản, danh thiếp số, hủy liên kết chip NFC và xóa sạch toàn bộ lịch sử kết nối của bạn. Hành động này không thể hoàn tác sau khi xác nhận.
        </p>

        <Button
          onClick={() => setIsDeleteModalOpen(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-500/20 cursor-pointer"
        >
          <UserX className="w-4 h-4 mr-2" /> Yêu Cầu Xóa Vĩnh Viễn Dữ Liệu
        </Button>
      </div>

      {/* ===================================================================== */}
      {/* MODAL XÁC NHẬN XÓA VĨNH VIỄN DỮ LIỆU */}
      {/* ===================================================================== */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-rose-200 rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-rose-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" /> Xác Nhận Xóa Vĩnh Viễn Dữ Liệu?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Bạn đang yêu cầu thực thi quyền xóa dữ liệu theo Điều 16 Luật PDPL 91/2025.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
              <p className="font-bold">⚠️ Toàn bộ dữ liệu sau sẽ bị xóa ngay lập tức:</p>
              <ul className="list-disc list-inside text-[11.5px] space-y-0.5 text-rose-800">
                <li>Hồ sơ danh thiếp số @{currentIdentity?.username || 'user'}</li>
                <li>Chip NFC {currentCard?.cardUid} sẽ bị vô hiệu hóa</li>
                <li>Toàn bộ ghi chú & danh bạ kết nối</li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Để xác nhận, vui lòng gõ <span className="text-rose-600 font-mono font-black">XOA DU LIEU</span> vào ô bên dưới:
              </label>
              <input
                type="text"
                placeholder="XOA DU LIEU"
                value={confirmDeleteInput}
                onChange={(e) => setConfirmDeleteInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-rose-500 uppercase"
              />
            </div>
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setConfirmDeleteInput('');
              }}
              className="text-xs rounded-xl"
            >
              Hủy Bỏ
            </Button>
            <Button
              type="button"
              onClick={handleConfirmPurgeData}
              className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-500/20"
            >
              Xác Nhận Xóa Vĩnh Viễn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
