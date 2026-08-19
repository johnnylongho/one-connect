'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  LayoutDashboard,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  Globe,
  Share2,
  Sparkles,
  ExternalLink,
  Download,
  UserCheck,
  QrCode,
  Zap,
  Briefcase,
  Layers,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Copy,
  Check,
  Award,

  MapPin,
  Calendar,
  CreditCard,
  Hash,
  Send,
  Lock,
  BadgeCheck,
  FileCheck2,
  Clock,
  Compass,
  History,
  CalendarCheck,
  CheckCircle2,
  TrendingUp,
  Star,
  Edit3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { ToastProvider, useToast } from '@/components/ui/toast';
import { useOneConnectStore } from '@/lib/store';

// Official Enterprise Verified Badge Component with Guaranteed Fixed Dimensions
export function EnterpriseVerifiedBadge({ className = "w-6 h-6 min-w-[24px] min-h-[24px]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width="24"
      height="24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Enterprise Verified Badge"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <path
        d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6S8.65 2.475 8.01 3.738c-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.585 9.55.71 10.92.71 12.5s.875 2.95 2.138 3.6c-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238.64 1.263 2.01 2.138 3.59 2.138s2.95-.875 3.59-2.138c.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6z"
        fill="#0066FF"
      />
      <path
        d="M9.8 15.6L6.2 12L7.6 10.6L9.8 12.8L16.2 6.4L17.6 7.8L9.8 15.6Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

interface ProductItem {
  id: string;
  title: string;
  category: string;
  image: string;
  highlight: string;
  description: string;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'p1',
    title: 'Thẻ Doanh Nhân Số NFC One Connect Premium',
    category: 'Phần Cứng & Thẻ Kim Loại Khắc Laser',
    highlight: 'Chip NTAG215 • 1 Chạm Zero Friction',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    description: 'Thẻ kim loại nguyên khối chống nước IP68, bảo mật UID độc lập, trao đổi danh thiếp và hồ sơ năng lực chỉ với 1 chạm vào lưng điện thoại.',
  },
  {
    id: 'p2',
    title: 'Trạm Soát Vé & Check-in Sự Kiện Siêu Tốc (<0.5s)',
    category: 'Giải Pháp Số Hóa Sự Kiện B2B',
    highlight: 'Xử lý 60 lượt/phút • Không Ùn Tắc',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
    description: 'Hệ thống điểm danh trạm cửa kết hợp Web NFC và Dynamic QR, tự động đối soát vé VIP và kích hoạt thông báo vị trí ngồi tức thì.',
  },
  {
    id: 'p3',
    title: 'Nền Tảng B2B Matchmaking & Quản Trị Mối Quan Hệ',
    category: 'Phần Mềm Doanh Nghiệp & CRM Layer',
    highlight: 'Xác Thực 2 Chiều • 2-Way Consent',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
    description: 'Tầng hạ tầng quản lý mối quan hệ giao thương 1:1, phân bổ bàn hẹn B2B tự động và đồng bộ Lead chất lượng cao về hệ thống CRM.',
  },
];

const JOINED_EVENTS = [
  {
    id: 'ev-1',
    title: 'Diễn Đàn Kết Nối Doanh Nghiệp Quốc Gia 2026',
    role: 'VIP Executive Delegate',
    date: '14/08/2026',
    location: 'Khu A - Bàn Đại Biểu VIP #01',
    status: 'ĐÃ CHECK-IN',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'ev-2',
    title: 'Hội Nghị Thượng Đỉnh Chuyển Đổi Số & B2B Tech 2026',
    role: 'Diễn Giả & Khách Mời Danh Dự',
    date: '28/05/2026',
    location: 'Trung Tâm Hội Nghị Quốc Gia',
    status: 'ĐÃ THAM DỰ',
    statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'ev-3',
    title: 'Gala Doanh Nhân Đổi Mới Sáng Tạo Aplusvn Tech',
    role: 'Ban Tổ Chức & Media Director',
    date: '18/01/2026',
    location: 'Aplusvn Innovation Tower',
    status: 'HOÀN THÀNH',
    statusColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
];

function DigitalProfileContent() {
  const params = useParams();
  const cardId = (params?.card_id as string) || (params?.username as string) || 'NFC-HA-777';
  const { toast } = useToast();
  const { state, currentIdentity, updateIdentity } = useOneConnectStore();

  const [activeTab, setActiveTab] = useState('about');
  const [mounted, setMounted] = useState(false);
  const [isConnRequested, setIsConnRequested] = useState(false);
  const [isB2bModalOpen, setIsB2bModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isVerifiedModalOpen, setIsVerifiedModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [currentDateStr, setCurrentDateStr] = useState('14/08/2026');

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setCurrentDateStr(now.toLocaleDateString('vi-VN'));
  }, []);

  // Find matched identity from store
  const matchedIdentity =
    state.identities.find(
      (i) =>
        i.username.toLowerCase() === cardId.toLowerCase() ||
        i.id.toLowerCase() === cardId.toLowerCase() ||
        (cardId.toLowerCase() === 'hoanglong' && i.username === 'johnnylong')
    ) || (cardId.toLowerCase() === 'hoanglong' ? currentIdentity : null) || state.identities[0];

  const matchedCard = state.cards.find(c => c.personIdentityId === matchedIdentity?.id && c.status === 'ACTIVE') || state.cards[0];

  // Quyền chỉnh sửa: CHỈ cho phép chủ sở hữu tài khoản (hoặc Super Admin) chỉnh sửa hồ sơ
  const isOwner = Boolean(
    currentIdentity &&
    matchedIdentity &&
    (currentIdentity.id === matchedIdentity.id ||
     currentIdentity.username.toLowerCase() === matchedIdentity.username.toLowerCase() ||
     currentIdentity.userId === matchedIdentity.userId ||
     state.currentRole === 'SUPER_ADMIN')
  );

  // Edit Profile Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVcardModalOpen, setIsVcardModalOpen] = useState(false);
  const [isZaloModalOpen, setIsZaloModalOpen] = useState(false);
  const [editFullName, setEditFullName] = useState(matchedIdentity?.fullName || 'Hồ Hoàng Long');
  const [editDisplayName, setEditDisplayName] = useState(matchedIdentity?.displayName || matchedIdentity?.fullName || 'Johnny Long Hồ');
  const [editTitle, setEditTitle] = useState(matchedIdentity?.title || 'Project Manager & Media Director');
  const [editCompany, setEditCompany] = useState(matchedIdentity?.businesses?.[0]?.businessName || 'Tập đoàn Công nghệ Số A+ (APLUSVN)');
  const [editTaxCode, setEditTaxCode] = useState(matchedIdentity?.taxCode || matchedIdentity?.businesses?.[0]?.taxCode || '0316888999');
  const [editAddress, setEditAddress] = useState(matchedIdentity?.address || matchedIdentity?.businesses?.[0]?.address || 'Tầng 8, Tòa nhà ASIA, 25 Lê Lợi, TP. Nha Trang, Khánh Hòa');
  const [editAssociation, setEditAssociation] = useState(matchedIdentity?.association || matchedIdentity?.businesses?.[0]?.association || 'Hội Doanh Nhân Trẻ Khánh Hòa (YBA) • Ban Công Nghệ');
  const [editSlogan, setEditSlogan] = useState(matchedIdentity?.slogan || 'Bứt Phá Giao Thương - Chuyển Hóa Mối Quan Hệ Kinh Doanh Số');
  const [editPhone, setEditPhone] = useState(matchedIdentity?.phone || '0794677369');
  const [editEmail, setEditEmail] = useState(matchedIdentity?.email || 'contact.johnnylongho@gmail.com');
  const [editBio, setEditBio] = useState(matchedIdentity?.bio || 'Chuyên gia triển khai giải pháp hạ tầng danh thiếp số NFC...');
  const [editWebsite, setEditWebsite] = useState(matchedIdentity?.website || 'https://aplusvn.net');

  useEffect(() => {
    const now = new Date();
    setCurrentDateStr(now.toLocaleDateString('vi-VN'));
  }, []);

  // Synchronized Profile Object (Phản ánh dữ liệu mới nhất ngay khi store cập nhật)
  const profile = {
    fullName: matchedIdentity?.fullName || 'Hồ Hoàng Long',
    displayName: matchedIdentity?.displayName || matchedIdentity?.fullName || 'Johnny Long Hồ',
    title: matchedIdentity?.title || 'Project Manager & Media Director',
    roleVietnamese: matchedIdentity?.title || 'Giám Đốc Dự Án kiêm Trưởng Ban Truyền Thông',
    company: matchedIdentity?.businesses?.[0]?.businessName || 'Tập đoàn Công nghệ Số A+ (APLUSVN)',
    taxCode: matchedIdentity?.taxCode || matchedIdentity?.businesses?.[0]?.taxCode || '0316888999',
    address: matchedIdentity?.address || matchedIdentity?.businesses?.[0]?.address || 'Tầng 8, Tòa nhà ASIA, 25 Lê Lợi, TP. Nha Trang, Khánh Hòa',
    association: matchedIdentity?.association || matchedIdentity?.businesses?.[0]?.association || 'Hội Doanh Nhân Trẻ Khánh Hòa (YBA) • Ban Công Nghệ',
    slogan: matchedIdentity?.slogan || 'Bứt Phá Giao Thương - Chuyển Hóa Mối Quan Hệ Kinh Doanh Số',
    bio: matchedIdentity?.bio || 'Chuyên gia triển khai giải pháp hạ tầng danh thiếp số NFC, định danh doanh nghiệp và tự động hóa giao thương B2B sự kiện.',
    phone: matchedIdentity?.phone || '0794677369',
    email: matchedIdentity?.email || 'contact.johnnylongho@gmail.com',
    website: matchedIdentity?.website || 'https://aplusvn.net',
    websiteDisplay: (matchedIdentity?.website || 'https://aplusvn.net').replace('https://', '').replace('http://', ''),
    zalo: `https://zalo.me/${(matchedIdentity?.phone || '0794677369').replace(/[^0-9]/g, '')}`,
    avatarUrl: matchedIdentity?.avatarUrl || '/avatar-johnny-long.jpg',
    ticketCode: `QR_ONECONNECT_${(matchedIdentity?.username || 'USER').toUpperCase()}_2026`,
    cardUid: matchedCard?.cardUid || 'NFC-HA-777',
    cardType: 'NFC Executive Black Metal',
    eventJoined: 'Diễn Đàn Kết Nối Doanh Nghiệp Quốc Gia 2026',
    ticketTier: 'VIP Executive Pass',
    seatLocation: 'Khu A - Bàn Đại Biểu VIP #01',
    skills: ['NFC Infrastructure', 'Event Tech', 'B2B Matchmaking', 'Digital Identity', 'Automation n8n'],
    experienceYears: '8+',
    b2bMatchesCount: '350+',
    trustRating: 'Hạng A+',
    verificationLevel: 'Enterprise Level 3 Verified',
    signatureHash: '0x9F4C82A3E1B8D9720066FF',
  };

  const handleOpenEditModal = () => {
    if (!isOwner) {
      toast({
        title: 'BẠN KHÔNG CÓ QUYỀN CHỈNH SỬA! 🔒',
        description: 'Chỉ chủ sở hữu hồ sơ mới có quyền cập nhật thông tin này.',
        variant: 'destructive',
      });
      return;
    }
    setEditFullName(matchedIdentity?.fullName || profile.fullName);
    setEditDisplayName(matchedIdentity?.displayName || profile.displayName);
    setEditTitle(matchedIdentity?.title || profile.title);
    setEditCompany(matchedIdentity?.businesses?.[0]?.businessName || profile.company);
    setEditTaxCode(matchedIdentity?.taxCode || matchedIdentity?.businesses?.[0]?.taxCode || profile.taxCode);
    setEditAddress(matchedIdentity?.address || matchedIdentity?.businesses?.[0]?.address || profile.address);
    setEditAssociation(matchedIdentity?.association || profile.association);
    setEditSlogan(matchedIdentity?.slogan || profile.slogan);
    setEditPhone(matchedIdentity?.phone || profile.phone);
    setEditEmail(matchedIdentity?.email || profile.email);
    setEditBio(matchedIdentity?.bio || profile.bio);
    setEditWebsite(matchedIdentity?.website || profile.website);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedIdentity || !isOwner) {
      toast({
        title: 'BẠN KHÔNG CÓ QUYỀN CHỈNH SỬA! 🔒',
        description: 'Chỉ chủ sở hữu hồ sơ mới có quyền cập nhật thông tin này.',
        variant: 'destructive',
      });
      return;
    }

    updateIdentity(matchedIdentity.id, {
      fullName: editFullName,
      displayName: editDisplayName,
      title: editTitle,
      businessName: editCompany,
      taxCode: editTaxCode,
      address: editAddress,
      association: editAssociation,
      slogan: editSlogan,
      phone: editPhone,
      email: editEmail,
      bio: editBio,
      website: editWebsite,
    });

    setIsEditModalOpen(false);
    toast({
      title: 'ĐÃ CẬP NHẬT HỒ SƠ THÀNH CÔNG! ✨',
      description: 'Dữ liệu hồ sơ số, doanh nghiệp và MST đã được cập nhật theo thời gian thực.',
      variant: 'success',
    });
  };




  // Convert exact profile image to Base64 reliably using Canvas for vCard export
  const getAvatarBase64 = async (): Promise<string> => {
    try {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const targetDim = 320;
            canvas.width = targetDim;
            canvas.height = targetDim;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve('');
              return;
            }
            // Center-crop square
            const minSide = Math.min(img.naturalWidth || img.width, img.naturalHeight || img.height);
            const sx = ((img.naturalWidth || img.width) - minSide) / 2;
            const sy = ((img.naturalHeight || img.height) - minSide) / 2;
            ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, targetDim, targetDim);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
            resolve(base64);
          } catch {
            resolve('');
          }
        };
        img.onerror = () => resolve('');
        // Handle both relative & absolute URLs
        const srcUrl = profile.avatarUrl.startsWith('http')
          ? profile.avatarUrl
          : typeof window !== 'undefined'
          ? `${window.location.origin}${profile.avatarUrl}`
          : profile.avatarUrl;
        img.src = srcUrl;
      });
    } catch {
      return '';
    }
  };

  // Generate standard vCard 3.0 with photo base64, tax code, address and Zalo link
  const handleSaveContact = async () => {
    const now = new Date();
    const formattedDateTime = `${now.toLocaleDateString('vi-VN')} lúc ${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;

    // Clean Phone number without 'tel:' prefix (0794677369)
    const rawPhone = profile.phone || '0794677369';
    const cleanPhone = rawPhone.replace(/[^0-9+]/g, '');

    // Parse Vietnamese Name parts (Họ / Tên đệm & Tên)
    const nameParts = profile.fullName.trim().split(' ');
    const lastName = nameParts[0] || 'Hồ';
    const firstName = nameParts.slice(1).join(' ') || 'Hoàng Long';

    // Get Avatar Base64 of profile
    const photoBase64 = await getAvatarBase64();
    const photoField = photoBase64 ? `PHOTO;TYPE=JPEG;ENCODING=B:${photoBase64}\n` : '';

    // Standard RFC 2426 vCard 3.0 format 100% compatible with iOS & Android
    const vCardData = `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};;;
FN:${profile.fullName} (${profile.displayName})
ORG:${profile.company}
TITLE:${profile.roleVietnamese}
TEL;TYPE=CELL,VOICE,PREF:${cleanPhone}
EMAIL;TYPE=WORK,INTERNET:${profile.email}
URL:${profile.website}
ADR;TYPE=WORK:;;${profile.address};;;;
X-SOCIALPROFILE;type=zalo:${profile.zalo}
X-TAXCODE:${profile.taxCode}
X-ASSOCIATION:${profile.association}
${photoField}CATEGORIES:One Connect,B2B Partner,VIP Delegate,${profile.eventJoined}
NOTE:👤 ${profile.fullName} (${profile.displayName})\\n🏢 ${profile.company}\\n💼 Chức vụ: ${profile.roleVietnamese}\\n🏛️ Hiệp hội: ${profile.association}\\n📋 MST: ${profile.taxCode}\\n📍 Địa chỉ: ${profile.address}\\n💬 Zalo: ${profile.zalo}\\n📅 Bối cảnh gặp gỡ: ${formattedDateTime}\\n🎪 Sự kiện: ${profile.eventJoined}\\n💡 Slogan: "${profile.slogan}"\\n🌐 Website: ${profile.websiteDisplay}
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${profile.fullName.replace(/\s+/g, '_')}_OneConnect.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsVcardModalOpen(true);
    toast({
      title: 'ĐÃ TẢI DANH BẠ vCARD 1-CLICK! 📇',
      description: `Tệp danh bạ chuẩn của ${profile.fullName} đã được tải về máy.`,
      variant: 'success',
    });
  };

  // 1-Click Zalo Direct Chat
  const handleOpenZaloChat = () => {
    const zaloUrl = profile.zalo;
    if (typeof window !== 'undefined') {
      window.open(zaloUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // 1-Click Zalo Share with Professional B2B Introduction
  const handleShareZalo = () => {
    const shareText = `👤 Kính gửi Quý Đối Tác, tôi xin gửi Danh Thiếp Số One Connect của ${profile.fullName} (${profile.displayName}) - ${profile.roleVietnamese} tại ${profile.company}.\n🌐 Xem hồ sơ & Kết nối B2B: ${typeof window !== 'undefined' ? window.location.href : 'https://one-connect-network.vercel.app/p/johnnylongho'}\n📞 Hotline: ${profile.phone} | 💬 Zalo: ${profile.zalo}`;
    
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: 'ĐÃ SAO CHÉP MẪU TIN NHẮN ZALO! 💬',
        description: 'Đã sao chép lời giới thiệu B2B. Bạn có thể dán vào Zalo gửi ngay.',
        variant: 'success',
      });
      window.open(profile.zalo, '_blank', 'noopener,noreferrer');
    }
  };

  // Instant B2B Connection trigger without any async lag
  const handleRequestConnection = useCallback(() => {
    setIsConnRequested(true);
    setIsB2bModalOpen(true);
    toast({
      title: 'ĐÃ GỬI LỜI MỜI KẾT NỐI B2B! 🤝',
      description: `Lời mời và danh thiếp số đã được gửi tức thì đến ${profile.fullName}.`,
      variant: 'success',
    });
  }, [profile.fullName, toast]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: 'ĐÃ SAO CHÉP LIÊN KẾT DANH THIẾP SỐ! 📋',
        description: 'Bạn có thể dán link gửi qua Zalo, Messenger hoặc Email.',
        variant: 'success',
      });
    }
  };

  const nextProduct = () => {
    setCarouselIndex((prev) => (prev + 1) % PRODUCTS.length);
  };

  const prevProduct = () => {
    setCarouselIndex((prev) => (prev - 1 + PRODUCTS.length) % PRODUCTS.length);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#0066FF] border-t-transparent animate-spin" />
        <p className="text-xs font-mono font-bold text-[#0066FF] animate-pulse">
          Đang tải danh thiếp số One Connect...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 pb-12 antialiased selection:bg-blue-600 selection:text-white" suppressHydrationWarning>

      {/* MOBILE APPLICATION CONTAINER */}
      <div className="max-w-md mx-auto relative bg-white min-h-screen border-x border-slate-200/80 shadow-2xl overflow-hidden pb-8">
        
        {/* 1. TOP APP BAR (Compact Glassmorphic Header) */}
        <header className="bg-white/95 border-b border-slate-100 px-3.5 sm:px-4 py-2.5 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="p-1.5 sm:p-2 rounded-full bg-slate-50 border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-[#0066FF] hover:border-blue-200 transition-all active:scale-95 cursor-pointer shadow-2xs"
              title="Quay lại Trang Tổng Quan Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <img
              src="/one_connect_final_logo_orange.png"
              alt="One Connect Logo"
              className="h-6 sm:h-7 w-auto object-contain shrink-0 drop-shadow-xs"
            />
            <div>
              <div className="text-[12px] sm:text-[13px] text-[#0066FF] font-black tracking-tight uppercase flex items-center gap-1.5 font-heading">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                Executive Digital Pass
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="p-2 rounded-full bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer shadow-xs"
              title="Xem mã QR"
            >
              <QrCode className="w-4 h-4 text-slate-700" />
            </button>
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="p-2 rounded-full bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer shadow-xs"
              title="Chia sẻ hồ sơ"
            >
              <Share2 className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </header>


        {/* 2. EXECUTIVE HERO BLOCK VỚI HIỆU ỨNG LIQUID GLASS */}
        <div className="p-3.5 sm:p-4">
          <div className="relative rounded-[28px] p-4 sm:p-5 overflow-hidden transition-all duration-300 backdrop-blur-2xl bg-white/80 border border-white/90 shadow-[0_12px_40px_rgba(0,102,255,0.12),0_4px_20px_rgba(255,107,0,0.08)] before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-500/[0.07] before:via-white/40 before:to-orange-500/[0.07] before:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-[1.5px] after:bg-gradient-to-r after:from-transparent after:via-white after:to-transparent space-y-3.5 text-center">
            
            {/* Centered Avatar Section */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-1">
              <div className="w-[130px] h-[130px] sm:w-[145px] sm:h-[145px] rounded-3xl overflow-hidden shadow-md bg-slate-100 shrink-0 relative group">
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Chip UID Tag & Quick Edit Pill below Avatar */}
              <div className="mt-2.5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-900/90 text-white text-[10px] sm:text-[11px] font-mono font-bold shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {profile.cardUid}
                </span>

                {isOwner && (
                  <button
                    type="button"
                    onClick={handleOpenEditModal}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#0066FF] text-[10px] sm:text-[11px] font-bold shadow-2xs transition-all cursor-pointer active:scale-95"
                  >
                    <Edit3 className="w-3 h-3 text-[#0066FF]" />
                    <span>Sửa Profile</span>
                  </button>
                )}
              </div>
            </div>



            {/* Name & Enterprise Verified Badge & Company Info */}
            <div className="relative z-10 space-y-1">
              {/* Tên chính: Hồ Hoàng Long + Tích xanh Enterprise Verified (Đảm bảo luôn hiển thị rõ ràng trên mobile) */}
              <div className="flex items-center justify-center gap-1.5 flex-nowrap">
                <h1 className="text-[22px] sm:text-[25px] font-black text-slate-900 tracking-tight font-heading">
                  {profile.fullName}
                </h1>
                {/* Enterprise Verified Rosette Badge */}
                <button
                  type="button"
                  onClick={() => setIsVerifiedModalOpen(true)}
                  className="inline-flex items-center justify-center shrink-0 hover:scale-110 active:scale-95 transition-transform cursor-pointer ml-0.5"
                  title="Enterprise Verified (Bấm để xem chứng nhận)"
                >
                  <EnterpriseVerifiedBadge className="w-6 h-6 min-w-[24px] min-h-[24px] shrink-0 drop-shadow-xs" />
                </button>
              </div>

              {/* Tên thường dùng: Johnny Long Hồ */}
              <p className="text-[14.5px] sm:text-[15.5px] font-bold text-slate-700">
                {profile.displayName}
              </p>

              {/* Chức danh */}
              <p className="text-[14.5px] sm:text-[15.5px] font-bold text-[#0066FF] leading-snug pt-0.5">
                {profile.roleVietnamese}
              </p>

              {/* Doanh nghiệp & Hiệp hội */}
              <div className="space-y-0.5 pt-1 text-[13.5px] sm:text-[14.5px]">
                <div className="inline-flex items-center gap-1.5 font-bold text-slate-800 bg-slate-50/80 px-3 py-1 rounded-full border border-slate-200/70">
                  <Building2 className="w-4 h-4 text-[#FF6B00] shrink-0" />
                  <span>{profile.company}</span>
                </div>
                <p className="text-[12.5px] text-slate-500 font-medium pt-1">
                  {profile.association}
                </p>
              </div>
            </div>

            {/* Event Context Pill */}
            <div className="relative z-10 px-3 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/80 flex items-center justify-between text-[12px] sm:text-[12.5px] text-slate-600 shadow-2xs">
              <div className="flex items-center gap-1.5 truncate">
                <Compass className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span className="truncate font-semibold text-slate-800">{profile.eventJoined}</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-slate-500 shrink-0 ml-2">
                <Calendar className="w-3.5 h-3.5 text-[#0066FF]" />
                <span>{currentDateStr}</span>
              </div>
            </div>

            {/* Executive Motto Slogan */}
            <div className="relative z-10 p-3 rounded-2xl bg-blue-50/80 backdrop-blur-md border border-blue-200/60 text-[14px] text-[#0066FF] font-semibold italic leading-relaxed text-center shadow-2xs">
              "{profile.slogan}"
            </div>

            {/* QUICK 1-TAP CONTACT ICONS BAR (4 nút: Gọi, Email, Zalo, Web) */}
            <div className="relative z-10 grid grid-cols-4 gap-2 pt-1 border-t border-slate-200/60">
              <a
                href={`tel:${profile.phone}`}
                className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-blue-50/90 backdrop-blur-md border border-blue-200/80 hover:bg-blue-100 text-[#0066FF] transition-all active:scale-95 shadow-xs"
                title="Gọi điện thoại"
              >
                <Phone className="w-5 h-5" />
                <span className="text-[12px] font-bold">Gọi</span>
              </a>

              <a
                href={`mailto:${profile.email}`}
                className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-orange-50/90 backdrop-blur-md border border-orange-200/80 hover:bg-orange-100 text-[#FF6B00] transition-all active:scale-95 shadow-xs"
                title="Gửi Email"
              >
                <Mail className="w-5 h-5" />
                <span className="text-[12px] font-bold">Email</span>
              </a>

              <a
                href={profile.zalo}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-cyan-50/90 backdrop-blur-md border border-cyan-200/80 hover:bg-cyan-100 text-cyan-700 transition-all active:scale-95 shadow-xs"
                title="Nhắn Zalo"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-[12px] font-bold">Zalo</span>
              </a>

              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-purple-50/90 backdrop-blur-md border border-purple-200/80 hover:bg-purple-100 text-purple-700 transition-all active:scale-95 shadow-xs"
                title="Website"
              >
                <Globe className="w-5 h-5" />
                <span className="text-[12px] font-bold">Web</span>
              </a>
            </div>

            {/* PRIMARY INLINE ACTION BUTTONS (Mượt mà, phản hồi tức thì 0 delay) */}
            <div className="relative z-10 flex items-center gap-2 pt-2 border-t border-slate-200/60">
              <Button
                type="button"
                onClick={handleSaveContact}
                size="lg"
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-[14px] sm:text-[15px] py-4.5 shadow-sm active:scale-98 transition-all cursor-pointer touch-manipulation"
              >
                <Download className="w-4.5 h-4.5 mr-1.5" /> Lưu Danh Bạ
              </Button>

              <Button
                type="button"
                onClick={handleRequestConnection}
                size="lg"
                className="flex-1 bg-gradient-to-r from-[#0066FF] to-[#FF6B00] hover:opacity-90 text-white font-extrabold rounded-2xl text-[14px] sm:text-[15px] py-4.5 shadow-sm active:scale-98 transition-all cursor-pointer touch-manipulation"
              >
                <UserCheck className="w-4.5 h-4.5 mr-1.5" />
                {isConnRequested ? 'Đã Gửi Kết Nối' : 'Kết Nối B2B'}
              </Button>
            </div>

            {/* EXECUTIVE CREDENTIAL METRICS ROW (Đổi '100% Xác thực' thành 'Hạng A+ Tín Nhiệm Doanh Nghiệp' cao cấp) */}
            <div className="relative z-10 grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/60 text-center">
              <div className="p-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-2xs">
                <div className="text-base sm:text-lg font-black text-slate-900 font-heading">{profile.experienceYears}</div>
                <div className="text-[10.5px] sm:text-[11px] text-slate-600 font-semibold mt-0.5">Năm Kinh Nghiệm</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-2xs">
                <div className="text-base sm:text-lg font-black text-[#0066FF] font-heading">{profile.b2bMatchesCount}</div>
                <div className="text-[10.5px] sm:text-[11px] text-slate-600 font-semibold mt-0.5">Kết Nối B2B</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-2xs">
                <div className="text-base sm:text-lg font-black text-emerald-600 font-heading">{profile.trustRating}</div>
                <div className="text-[10.5px] sm:text-[11px] text-emerald-700 font-semibold mt-0.5">Tín Nhiệm Doanh Nghiệp</div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. HỆ THỐNG 4 NÚT BẤM TAB ĐIỀU HƯỚNG */}
        <div className="px-3.5 sm:px-4 space-y-3.5">
          <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 gap-1 h-auto">
              <TabsTrigger
                value="about"
                className="py-2 sm:py-2.5 px-1 rounded-xl text-[13px] sm:text-[14px] font-bold transition-all data-[state=active]:bg-[#0066FF] data-[state=active]:text-white data-[state=active]:shadow-md flex items-center justify-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5" /> Hồ Sơ
              </TabsTrigger>

              <TabsTrigger
                value="products"
                className="py-2 sm:py-2.5 px-1 rounded-xl text-[13px] sm:text-[14px] font-bold transition-all data-[state=active]:bg-[#0066FF] data-[state=active]:text-white data-[state=active]:shadow-md flex items-center justify-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" /> Sản Phẩm
              </TabsTrigger>

              <TabsTrigger
                value="event"
                className="py-2 sm:py-2.5 px-1 rounded-xl text-[13px] sm:text-[14px] font-bold transition-all data-[state=active]:bg-[#0066FF] data-[state=active]:text-white data-[state=active]:shadow-md flex items-center justify-center gap-1"
              >
                <Zap className="w-3.5 h-3.5" /> Vé Sự Kiện
              </TabsTrigger>

              <TabsTrigger
                value="history"
                className="py-2 sm:py-2.5 px-1 rounded-xl text-[13px] sm:text-[14px] font-bold transition-all data-[state=active]:bg-[#0066FF] data-[state=active]:text-white data-[state=active]:shadow-md flex items-center justify-center gap-1"
              >
                <History className="w-3.5 h-3.5" /> Lịch Sử
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: HỒ SƠ, LỊCH SỬ KẾT NỐI & DOANH NGHIỆP */}
            <TabsContent value="about" className="space-y-3 pt-3 m-0">
              
              {/* LỊCH SỬ & BỐI CẢNH KẾT NỐI */}
              <div className="p-4 rounded-3xl bg-blue-50/60 border border-blue-200/90 shadow-sm space-y-2.5">
                <h3 className="font-black text-slate-900 text-[14px] sm:text-[15px] uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Clock className="w-4 h-4 text-[#0066FF]" /> Lịch Sử & Bối Cảnh Kết Nối
                </h3>

                <div className="grid grid-cols-1 gap-2 text-[13px] sm:text-[13.5px] text-slate-700">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-blue-100">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#0066FF]" /> Ngày Gặp Gỡ:
                    </span>
                    <strong className="text-slate-900 font-mono font-bold">{currentDateStr}</strong>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-blue-100">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#FF6B00]" /> Bối Cảnh Sự Kiện:
                    </span>
                    <strong className="text-slate-900 text-right truncate max-w-[200px]">{profile.eventJoined}</strong>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-blue-100">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-purple-600" /> Kênh Định Danh:
                    </span>
                    <span className="text-blue-700 font-mono font-bold text-[12px]">{profile.cardType} ({profile.cardUid})</span>
                  </div>
                </div>

                <p className="text-[11.5px] text-slate-500 italic text-center pt-0.5">
                  💡 Toàn bộ ảnh đại diện chân dung, lịch sử, ngày giờ và bối cảnh sự kiện được tự động đính kèm vào danh bạ khi bạn bấm <strong>Lưu Danh Bạ</strong>.
                </p>
              </div>

              {/* Tiểu sử */}
              <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2.5">
                <h3 className="font-black text-slate-900 text-[14px] sm:text-[15px] uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Briefcase className="w-4 h-4 text-[#0066FF]" /> Tiểu Sử Chuyên Gia
                </h3>
                <p className="text-[14px] sm:text-[15px] text-slate-700 leading-relaxed">
                  {profile.bio}
                </p>

                {/* Skill Pills */}
                <div className="pt-1">
                  <span className="text-[11px] sm:text-[12px] text-slate-400 font-mono block pb-1.5 font-bold uppercase">
                    Lĩnh Vực Chuyên Môn:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[12px] sm:text-[13px] font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Thông tin pháp nhân doanh nghiệp */}
              <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2.5">
                <h3 className="font-black text-slate-900 text-[14px] sm:text-[15px] uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Building2 className="w-4 h-4 text-[#FF6B00]" /> Thông Tin Doanh Nghiệp
                </h3>

                <div className="space-y-2 text-[13.5px] sm:text-[14px] text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 text-[10px] sm:text-[11px] font-bold block uppercase">DOANH NGHIỆP</span>
                      <strong className="text-slate-900 font-bold text-[14.5px] sm:text-[15px]">{profile.company}</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Hash className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 text-[10px] sm:text-[11px] font-bold block uppercase">MÃ SỐ THUẾ / GPKD</span>
                      <span className="font-mono font-bold text-slate-900 text-[14.5px] sm:text-[15px]">{profile.taxCode}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 text-[10px] sm:text-[11px] font-bold block uppercase">TRỤ SỞ CHÍNH</span>
                      <span className="text-[13.5px] sm:text-[14px] text-slate-800">{profile.address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Globe className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 text-[10px] sm:text-[11px] font-bold block uppercase">WEBSITE DOANH NGHIỆP</span>
                      <a href={profile.website} target="_blank" rel="noreferrer" className="text-[13.5px] sm:text-[14px] text-[#0066FF] font-semibold hover:underline">
                        {profile.websiteDisplay}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: SẢN PHẨM & GIẢI PHÁP CAROUSEL */}
            <TabsContent value="products" className="space-y-3.5 pt-3 m-0">
              <div className="relative rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] sm:text-[15px] font-black text-slate-900 flex items-center gap-2 font-heading">
                    <Layers className="w-4 h-4 text-[#FF6B00]" /> Danh Mục Giải Pháp
                  </span>
                  <span className="text-[11px] sm:text-[12px] font-mono font-bold text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {carouselIndex + 1} / {PRODUCTS.length}
                  </span>
                </div>

                <div className="rounded-2xl overflow-hidden border border-slate-200 h-40 sm:h-44 relative bg-slate-100">
                  <img
                    src={PRODUCTS[carouselIndex]?.image}
                    alt={PRODUCTS[carouselIndex]?.title}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <Badge className="bg-[#0066FF] text-white text-[10.5px] sm:text-[11px] font-bold border-0 shadow-md">
                      {PRODUCTS[carouselIndex]?.category}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[12px] sm:text-[13px] font-mono font-bold text-[#FF6B00]">
                    {PRODUCTS[carouselIndex]?.highlight}
                  </div>
                  <h4 className="font-bold text-slate-900 text-[15px] sm:text-[16px] leading-snug">
                    {PRODUCTS[carouselIndex]?.title}
                  </h4>
                  <p className="text-[13.5px] sm:text-[14px] text-slate-600 leading-relaxed">
                    {PRODUCTS[carouselIndex]?.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Button
                    type="button"
                    onClick={prevProduct}
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 rounded-full border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex gap-1.5">
                    {PRODUCTS.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === carouselIndex ? 'w-6 bg-[#0066FF]' : 'w-1.5 bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <Button
                    type="button"
                    onClick={nextProduct}
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 rounded-full border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: THÔNG TIN SỰ KIỆN & VÉ CHECK-IN */}
            <TabsContent value="event" className="space-y-3 pt-3 m-0">
              <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] sm:text-[15px] font-black text-slate-900 flex items-center gap-2 font-heading">
                    <Zap className="w-4 h-4 text-[#FF6B00]" /> Thẻ VIP & Vé Sự Kiện
                  </span>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10.5px] sm:text-[11px] font-bold">
                    ĐÃ CHECK-IN
                  </Badge>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${profile.ticketCode}`}
                    alt="Ticket QR"
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border border-slate-200 p-1 bg-white shrink-0 shadow-sm"
                  />
                  <div className="space-y-1 text-[13px] sm:text-[14px]">
                    <p className="font-bold text-slate-900 leading-tight text-[14px] sm:text-[15px]">{profile.eventJoined}</p>
                    <p className="font-mono text-[12px] sm:text-[13px] text-[#0066FF] font-bold">{profile.ticketTier}</p>
                    <p className="text-[12px] sm:text-[13px] text-slate-600 font-semibold">{profile.seatLocation}</p>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  size="sm"
                  variant="outline"
                  className="w-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-[13.5px] sm:text-[14px] font-bold rounded-xl py-4 cursor-pointer shadow-xs"
                >
                  <QrCode className="w-4 h-4 mr-2 text-[#0066FF]" /> Phóng To Mã QR Để Quét
                </Button>
              </div>
            </TabsContent>

            {/* TAB 4: LỊCH SỬ CÁC SỰ KIỆN THAM GIA */}
            <TabsContent value="history" className="space-y-3 pt-3 m-0">
              <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] sm:text-[15px] font-black text-slate-900 flex items-center gap-2 font-heading">
                    <CalendarCheck className="w-4 h-4 text-[#0066FF]" /> Lịch Sử Tham Dự Sự Kiện
                  </span>
                  <Badge className="bg-blue-50 text-[#0066FF] border-blue-200 text-[11px] font-bold">
                    {JOINED_EVENTS.length} Sự Kiện
                  </Badge>
                </div>

                <div className="space-y-2.5">
                  {JOINED_EVENTS.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1.5 hover:bg-slate-100/80 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-slate-900 text-[13.5px] sm:text-[14px] leading-snug">
                          {ev.title}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${ev.statusColor}`}>
                          {ev.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate-500">
                        <div className="flex items-center gap-1 font-semibold text-[#0066FF]">
                          <Award className="w-3.5 h-3.5" />
                          <span>{ev.role}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[11.5px] text-slate-600 pt-0.5">
                        <MapPin className="w-3 h-3 text-[#FF6B00] shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* SECONDARY BOTTOM INLINE ACTION BUTTONS */}
          <div className="pt-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handleSaveContact}
                size="lg"
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-[14px] sm:text-[15px] py-5 shadow-sm active:scale-98 transition-all cursor-pointer touch-manipulation"
              >
                <Download className="w-4.5 h-4.5 mr-1.5" /> Lưu Danh Bạ
              </Button>

              <Button
                type="button"
                onClick={handleRequestConnection}
                size="lg"
                className="flex-1 bg-gradient-to-r from-[#0066FF] to-[#FF6B00] hover:opacity-90 text-white font-extrabold rounded-2xl text-[14px] sm:text-[15px] py-5 shadow-sm active:scale-98 transition-all cursor-pointer touch-manipulation"
              >
                <UserCheck className="w-4.5 h-4.5 mr-1.5" />
                {isConnRequested ? 'Đã Gửi Kết Nối' : 'Kết Nối B2B'}
              </Button>
            </div>
          </div>
        </div>

        {/* 4. MODAL XÁC NHẬN KẾT NỐI B2B TỨC THÌ (Zero Delay Modal) */}
        <Dialog open={isB2bModalOpen} onOpenChange={setIsB2bModalOpen}>
          <DialogContent className="sm:max-w-sm bg-white border-slate-200 text-slate-900 shadow-2xl rounded-3xl p-5 space-y-3 text-center">
            <DialogHeader className="space-y-1.5">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <DialogTitle className="text-lg font-black text-slate-900 font-heading">
                Đã Gửi Yêu Cầu Kết Nối B2B!
              </DialogTitle>
              <DialogDescription className="text-[13px] text-slate-600 leading-relaxed">
                Hồ sơ danh thiếp số của bạn đã được gửi thành công đến doanh nhân <strong>{profile.fullName}</strong>.
              </DialogDescription>
            </DialogHeader>

            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1 text-[13px] text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Đối Tác:</span>
                <span className="font-bold text-slate-900">{profile.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tổ Chức:</span>
                <span className="font-semibold text-blue-700 truncate">{profile.company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trạng Thái:</span>
                <span className="font-bold text-emerald-600">Chờ Ghép Đôi 2 Chiều</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setIsB2bModalOpen(false)}
              className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl py-3.5 text-[14px]"
            >
              Đồng Ý & Tiếp Tục
            </Button>
          </DialogContent>
        </Dialog>

        {/* 5. MODAL CHỨNG NHẬN ENTERPRISE VERIFIED */}
        <Dialog open={isVerifiedModalOpen} onOpenChange={setIsVerifiedModalOpen}>
          <DialogContent className="sm:max-w-sm bg-white border-slate-200 text-slate-900 shadow-2xl rounded-3xl p-5 space-y-3">
            <DialogHeader className="text-center space-y-1.5">
              <div className="w-14 h-14 rounded-full bg-blue-50 border-2 border-blue-200 text-[#0066FF] flex items-center justify-center mx-auto shadow-xs">
                <EnterpriseVerifiedBadge className="w-8 h-8 min-w-[32px] min-h-[32px]" />
              </div>
              <DialogTitle className="text-lg font-black text-slate-900 font-heading">
                Chứng Nhận Định Danh Doanh Nhân
              </DialogTitle>
              <DialogDescription className="text-[13px] text-slate-500">
                Bảo chứng bởi One Connect National Trust Network
              </DialogDescription>
            </DialogHeader>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-[13.5px]">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Doanh Nhân:</span>
                <strong className="text-slate-900">{profile.fullName} ({profile.displayName})</strong>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Cấp Độ Xác Minh:</span>
                <span className="font-bold text-[#0066FF] flex items-center gap-1">
                  <EnterpriseVerifiedBadge className="w-4 h-4 min-w-[16px] min-h-[16px]" /> {profile.verificationLevel}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Doanh Nghiệp:</span>
                <span className="font-semibold text-slate-800 text-right">{profile.company}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Chữ Ký Số NFC:</span>
                <span className="font-mono text-[11.5px] font-bold text-slate-700">{profile.signatureHash}</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setIsVerifiedModalOpen(false)}
              className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl py-3.5 text-[14px]"
            >
              Đóng Chứng Nhận
            </Button>
          </DialogContent>
        </Dialog>

        {/* QR CODE EXPANDED MODAL */}
        <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
          <DialogContent className="sm:max-w-xs bg-white border-slate-200 text-slate-900 shadow-2xl rounded-3xl text-center">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center justify-center gap-2 text-slate-900">
                <QrCode className="w-5 h-5 text-[#0066FF]" /> Mã Check-in & Danh Thiếp
              </DialogTitle>
              <DialogDescription className="text-[12.5px] text-slate-500">
                Xuất trình mã này tại sự kiện hoặc để đối tác quét kết nối
              </DialogDescription>
            </DialogHeader>

            <div className="p-3.5 space-y-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${profile.ticketCode}`}
                alt="Ticket QR Big"
                className="w-44 h-44 rounded-2xl border-4 border-blue-500/20 p-2 bg-white mx-auto shadow-md"
              />
              <p className="font-mono text-[13px] font-bold text-[#0066FF]">{profile.ticketCode}</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* SHARE PROFILE MODAL */}
        <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
          <DialogContent className="sm:max-w-xs bg-white border-slate-200 text-slate-900 shadow-2xl rounded-3xl text-center">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center justify-center gap-2 text-slate-900">
                <Share2 className="w-5 h-5 text-[#0066FF]" /> Chia Sẻ Danh Thiếp Số
              </DialogTitle>
              <DialogDescription className="text-[12.5px] text-slate-500">
                Gửi liên kết định danh doanh nhân của bạn đến đối tác
              </DialogDescription>
            </DialogHeader>

            <div className="p-3.5 space-y-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${typeof window !== 'undefined' ? window.location.href : 'https://one-connect-network.vercel.app/p/johnnylongho'}`}
                alt="Profile Link QR"
                className="w-36 h-36 rounded-2xl border border-slate-200 p-2 bg-white mx-auto shadow-sm"
              />

              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={handleShareZalo}
                  size="sm"
                  className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl text-[13px] py-3.5 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Chia Sẻ Qua Zalo 1-Click
                </Button>

                <Button
                  type="button"
                  onClick={handleCopyLink}
                  size="sm"
                  variant="outline"
                  className="w-full border-slate-200 hover:bg-slate-50 text-slate-800 font-bold rounded-xl text-[13px] py-3.5 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {isCopied ? 'Đã Sao Chép Link!' : 'Sao Chép Đường Dẫn'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 1-CLICK vCARD 3.0 EXPORT CONFIRMATION MODAL */}
        <Dialog open={isVcardModalOpen} onOpenChange={setIsVcardModalOpen}>
          <DialogContent className="sm:max-w-sm bg-white border-slate-200 text-slate-900 shadow-2xl rounded-3xl p-5 space-y-3 text-center">
            <DialogHeader className="space-y-1.5">
              <div className="w-14 h-14 rounded-full bg-blue-50 border-2 border-blue-200 text-[#0066FF] flex items-center justify-center mx-auto shadow-xs">
                <Download className="w-7 h-7" />
              </div>
              <DialogTitle className="text-lg font-black text-slate-900 font-heading">
                Đã Xuất Danh Bạ vCard 3.0! 📇
              </DialogTitle>
              <DialogDescription className="text-[13px] text-slate-600 leading-relaxed">
                Tệp danh bạ điện tử chuẩn hóa của <strong>{profile.fullName}</strong> đã được tạo thành công kèm ảnh đại diện, chức vụ, MST và Zalo.
              </DialogDescription>
            </DialogHeader>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Họ & Tên:</span>
                <strong className="text-slate-900">{profile.fullName}</strong>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Doanh nghiệp:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[180px]">{profile.company}</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Số điện thoại:</span>
                <span className="font-mono font-bold text-[#0066FF]">{profile.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Định dạng file:</span>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                  Apple iOS & Android Contacts Ready (.vcf)
                </Badge>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Button
                type="button"
                onClick={handleOpenZaloChat}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl py-3 text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" /> Kết Bạn & Nhắn Zalo Ngay
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsVcardModalOpen(false)}
                className="w-full border-slate-300 text-slate-700 font-bold rounded-xl py-3 text-xs hover:bg-slate-50"
              >
                Đóng Cửa Sổ
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* EDIT PROFILE MODAL (OPTIMIZED RESPONSIVE MODAL WITH STICKY FOOTER) */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-md w-[95vw] sm:w-full bg-white border border-slate-200 text-slate-900 shadow-2xl rounded-3xl p-0 flex flex-col max-h-[88vh] sm:max-h-[85vh] overflow-hidden">
            
            {/* STICKY TOP MODAL HEADER */}
            <div className="px-5 py-4 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#0066FF] shrink-0">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <DialogTitle className="text-base sm:text-lg font-black text-slate-900 font-heading">
                    Chỉnh Sửa Hồ Sơ Cá Nhân
                  </DialogTitle>
                  <DialogDescription className="text-[11.5px] text-slate-500 font-medium">
                    Cập nhật danh thiếp số hiển thị cho đối tác & thẻ NFC 1-chạm
                  </DialogDescription>
                </div>
              </div>
            </div>

            {/* SCROLLABLE FORM BODY */}
            <form onSubmit={handleSaveProfile} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5 overscroll-contain">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1 text-left">
                    <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Họ và Tên <span className="text-red-500">*</span></label>
                    <input
                      required
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      placeholder="VD: Hồ Hoàng Long"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Tên Thường Gọi</label>
                    <input
                      value={editDisplayName}
                      onChange={(e) => setEditDisplayName(e.target.value)}
                      placeholder="VD: Johnny Long Hồ"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Chức Danh / Vị Trí Công Tác <span className="text-red-500">*</span></label>
                  <input
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="VD: Giám Đốc Dự Án & Media Director"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Tên Doanh Nghiệp / Hiệp Hội <span className="text-red-500">*</span></label>
                  <input
                    required
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    placeholder="VD: Tập đoàn Công nghệ Số A+ (APLUSVN)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1 text-left">
                    <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Mã Số Thuế / GPKD</label>
                    <input
                      value={editTaxCode}
                      onChange={(e) => setEditTaxCode(e.target.value)}
                      placeholder="VD: 0316888999"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Hiệp Hội / Đoàn Thể</label>
                    <input
                      value={editAssociation}
                      onChange={(e) => setEditAssociation(e.target.value)}
                      placeholder="VD: Hiệp hội Doanh nhân Aplusvn"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Địa Chỉ Trụ Sở Chính Doanh Nghiệp</label>
                  <input
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="VD: Tầng 8, Tòa nhà ASIA, 25 Lê Lợi, TP. Nha Trang, Khánh Hòa"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Khẩu Hiệu / Slogan Doanh Nghiệp</label>
                  <input
                    value={editSlogan}
                    onChange={(e) => setEditSlogan(e.target.value)}
                    placeholder="VD: Bứt Phá Giao Thương - Chuyển Hóa Mối Quan Hệ Kinh Doanh Số"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1 text-left">
                    <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Số Điện Thoại</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="VD: 0794677369"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Email Công Tác</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="VD: contact@aplusvn.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Website / Cổng Thông Tin</label>
                  <input
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    placeholder="VD: https://aplusvn.net"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Giới Thiệu Ngắn (Bio)</label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Mô tả kinh nghiệm, thế mạnh kinh doanh..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  />
                </div>
              </div>

              {/* STICKY BOTTOM ACTIONS FOOTER (LUÔN NẰM CỐ ĐỊNH, DỄ BẤM TRÊN MOBILE) */}
              <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/95 backdrop-blur-sm shrink-0 flex items-center justify-end gap-2.5 shadow-xs">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 sm:flex-initial text-xs font-bold rounded-xl border-slate-300 text-slate-700 py-3 px-5 cursor-pointer hover:bg-slate-100"
                >
                  Hủy Bỏ
                </Button>
                <Button
                  type="submit"
                  className="flex-1 sm:flex-initial bg-[#0066FF] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl py-3 px-6 shadow-sm cursor-pointer"
                >
                  Lưu & Cập Nhật Thẻ
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}


export default function DigitalBusinessCardPage() {
  return (
    <ToastProvider>
      <DigitalProfileContent />
    </ToastProvider>
  );
}
