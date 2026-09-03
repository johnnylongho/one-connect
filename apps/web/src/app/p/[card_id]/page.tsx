'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Camera,
  Upload,
  ImageIcon,
  RefreshCw,
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
import { DbService, ensureUuid } from '@/lib/db-service';
import { PersonIdentity } from '@/lib/types';
import BusinessCard3D from '@/components/BusinessCard3D';

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

export const PRESET_INDUSTRIES = [
  'Công Nghệ Thông Tin & AI',
  'Du Lịch, Khách Sạn & MICE',
  'Bất Động Sản & Nghỉ Dưỡng',
  'Năng Lượng Tái Tạo & Môi Trường',
  'Logistics, Cảng Biển & Vận Tải',
  'Nông - Thủy Hải Sản & Chế Biến',
  'Tài Chính, Ngân Hàng & Đầu Tư',
  'Truyền Thông, Media & Sự Kiện',
  'Pháp Lý & Tư Vấn Doanh Nghiệp',
  'Y Tế, Dược Phẩm & Sức Khỏe',
  'Xây Dựng, Vật Liệu & Kiến Trúc',
  'Giáo Dục & Đổi Mới Sáng Tạo',
];

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
  const { state, currentIdentity, updateIdentity, requestConnection } = useOneConnectStore();

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

  // Find matched identity from store (supporting all alias slugs)
  const cleanCardId = decodeURIComponent(cardId).trim().toLowerCase();
  const isJohnnyLongAlias = [
    'johnnylong',
    'johnnylongho',
    'hoanglong',
    'johnny-long',
    'johnny-long-ho',
    'aplus-001',
    '04:8f',
  ].some((alias) => cleanCardId.includes(alias));

  const [cloudIdentity, setCloudIdentity] = useState<PersonIdentity | null>(null);

  const localMatched = state.identities.find(
    (i) =>
      i.username.toLowerCase() === cleanCardId ||
      i.id.toLowerCase() === cleanCardId ||
      (isJohnnyLongAlias && (i.username === 'johnnylongho' || i.username === 'johnnylong' || i.id === 'id-001'))
  );

  useEffect(() => {
    if (!localMatched && !isJohnnyLongAlias) {
      DbService.getIdentity(cleanCardId).then((fetched) => {
        if (fetched) {
          setCloudIdentity(fetched);
        }
      });
    }
  }, [cleanCardId, localMatched, isJohnnyLongAlias]);

  const matchedIdentity = cloudIdentity || localMatched || (isJohnnyLongAlias ? currentIdentity : null) || state.identities[0];

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

  // Live connection status from Cloud Database & Realtime
  const myId = currentIdentity?.id || '';
  const myUuid = ensureUuid(myId);
  const targetId = matchedIdentity?.id || '';
  const targetUuid = ensureUuid(targetId);

  const existingConn = state.connections.find(
    c => (c.requesterIdentityId === myId && c.receiverIdentityId === targetId) ||
         (c.requesterIdentityId === targetId && c.receiverIdentityId === myId) ||
         (ensureUuid(c.requesterIdentityId) === myUuid && ensureUuid(c.receiverIdentityId) === targetUuid) ||
         (ensureUuid(c.requesterIdentityId) === targetUuid && ensureUuid(c.receiverIdentityId) === myUuid)
  );

  const isConnected = isOwner || existingConn?.status === 'CONNECTED';
  const isPending = !isConnected && (existingConn?.status === 'PENDING' || isConnRequested);

  // Guest NFC Contact Exchange States
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCompany, setGuestCompany] = useState('');
  const [guestNote, setGuestNote] = useState('');
  const [isExchanging, setIsExchanging] = useState(false);

  // Edit Profile Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVcardModalOpen, setIsVcardModalOpen] = useState(false);
  const [isZaloModalOpen, setIsZaloModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editFullName, setEditFullName] = useState(matchedIdentity?.fullName || 'Hồ Hoàng Long');
  const [editDisplayName, setEditDisplayName] = useState(matchedIdentity?.displayName || matchedIdentity?.fullName || 'Johnny Long Hồ');
  const [editAvatarUrl, setEditAvatarUrl] = useState(matchedIdentity?.avatarUrl || '');
  const [editTitle, setEditTitle] = useState(matchedIdentity?.title || 'Project Manager & Media Director');
  const [editCompany, setEditCompany] = useState(matchedIdentity?.businesses?.[0]?.businessName || 'Tập đoàn Công nghệ Số A+ (APLUSVN)');
  const [editTaxCode, setEditTaxCode] = useState(matchedIdentity?.taxCode || matchedIdentity?.businesses?.[0]?.taxCode || '0316888999');
  const [editAddress, setEditAddress] = useState(matchedIdentity?.address || matchedIdentity?.businesses?.[0]?.address || 'Tầng 8, Tòa nhà ASIA, 25 Lê Lợi, TP. Nha Trang, Khánh Hòa');
  const [editAssociation, setEditAssociation] = useState(matchedIdentity?.association || matchedIdentity?.businesses?.[0]?.association || 'Hội Doanh Nhân Trẻ Khánh Hòa (YBA) • Ban Công Nghệ');
  const [editSlogan, setEditSlogan] = useState(matchedIdentity?.slogan || 'Bứt Phá Giao Thương - Chuyển Hóa Mối Quan Hệ Kinh Doanh Số');
  const [editIndustry, setEditIndustry] = useState(matchedIdentity?.industry || matchedIdentity?.businesses?.[0]?.industry || 'Công Nghệ Thông Tin & AI');
  const [editSkills, setEditSkills] = useState<string[]>(
    matchedIdentity?.expertiseSkills || matchedIdentity?.businesses?.[0]?.expertiseSkills || ['Hạ Tầng IoT & NFC', 'AI B2B Matchmaking', 'Next.js & Turbopack', 'Truyền Thông Số', 'Sự Kiện MICE']
  );
  const [newSkillInput, setNewSkillInput] = useState('');
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
    fullName: matchedIdentity?.fullName || 'Doanh Nhân Hội Viên',
    displayName: matchedIdentity?.displayName || matchedIdentity?.fullName || 'Doanh Nhân VIP',
    title: matchedIdentity?.title || 'Giám Đốc Doanh Nghiệp',
    roleVietnamese: matchedIdentity?.title || 'Đại Diện Doanh Nghiệp',
    company: matchedIdentity?.businesses?.[0]?.businessName || 'Doanh Nghiệp Hội Viên',
    taxCode: matchedIdentity?.taxCode || matchedIdentity?.businesses?.[0]?.taxCode || 'Đang cập nhật',
    address: matchedIdentity?.address || matchedIdentity?.businesses?.[0]?.address || 'Việt Nam',
    association: matchedIdentity?.association || matchedIdentity?.businesses?.[0]?.association || 'Hội Viên One Connect Network',
    slogan: matchedIdentity?.slogan || 'Bứt Phá Giao Thương - Chuyển Hóa Mối Quan Hệ Kinh Doanh Số',
    industry: matchedIdentity?.industry || matchedIdentity?.businesses?.[0]?.industry || 'Công Nghệ Thông Tin & AI',
    skills: (matchedIdentity?.expertiseSkills && matchedIdentity.expertiseSkills.length > 0)
      ? matchedIdentity.expertiseSkills
      : (matchedIdentity?.businesses?.[0]?.expertiseSkills && matchedIdentity.businesses[0].expertiseSkills.length > 0)
      ? matchedIdentity.businesses[0].expertiseSkills
      : ['Hạ Tầng IoT & NFC', 'AI B2B Matchmaking', 'Next.js & Turbopack', 'Truyền Thông Số', 'Sự Kiện MICE'],
    bio: matchedIdentity?.bio || `Đại diện ${matchedIdentity?.businesses?.[0]?.businessName || 'Doanh nghiệp'} - Thành viên Hệ sinh thái One Connect Network.`,
    phone: matchedIdentity?.phone || '',
    email: matchedIdentity?.email || '',
    website: matchedIdentity?.website || (matchedIdentity?.username === 'johnnylongho' ? 'https://aplusvn.net' : 'https://one-connect-network.vercel.app'),
    websiteDisplay: (matchedIdentity?.website || (matchedIdentity?.username === 'johnnylongho' ? 'aplusvn.net' : 'one-connect.vn')).replace('https://', '').replace('http://', ''),
    zalo: `https://zalo.me/${(matchedIdentity?.phone || '').replace(/[^0-9]/g, '')}`,
    avatarUrl:
      (matchedIdentity?.avatarUrl && !matchedIdentity.avatarUrl.startsWith('blob:') && matchedIdentity.avatarUrl.trim() !== '')
        ? matchedIdentity.avatarUrl
        : ((matchedIdentity?.username === 'johnnylongho' || matchedIdentity?.id === 'id-001')
          ? '/avatar-johnny-long.jpg'
          : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(matchedIdentity?.fullName || 'User')}&backgroundColor=0066ff,00c2ff`),
    ticketCode: `QR_ONECONNECT_${(matchedIdentity?.username || 'USER').toUpperCase()}_2026`,
    cardUid: matchedCard?.cardUid || `NFC-${(matchedIdentity?.username || 'VIP').toUpperCase().slice(0, 8)}-888`,
    cardType: 'NFC Executive Black Metal',
    eventJoined: 'Diễn Đàn Kết Nối Doanh Nghiệp Quốc Gia 2026',
    ticketTier: 'VIP Executive Pass',
    seatLocation: 'Khu A - Bàn Đại Biểu VIP #01',
    seekingNeeds: matchedIdentity?.seekingNeeds || [
      'Đối tác Chuỗi Khách sạn/Resort MICE',
      'Các Hiệp hội Doanh nghiệp Tỉnh/Thành',
      'Nhà phân phối phôi thẻ thông minh'
    ],
    offeringServices: matchedIdentity?.offeringServices || [
      'Hạ tầng Định danh số NFC Doanh nghiệp',
      'Hệ thống Check-in Sự kiện <1s',
      'Giải pháp CRM Sổ tay quan hệ B2B'
    ],
    brochureUrl: matchedIdentity?.brochureUrl || 'https://aplusvn.net/company-profile-2026.pdf',
    membershipTier: matchedIdentity?.membershipTier || 'EXECUTIVE_BOARD',
    experienceYears: '8+',
    b2bMatchesCount: '350+',
    trustRating: 'Hạng A+',
    verificationLevel: 'Enterprise Level 3 Verified',
    signatureHash: '0x9F4C82A3E1B8D9720066FF',
  };

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'TỆP QUÁ LỚN!',
        description: 'Vui lòng chọn ảnh có dung lượng dưới 5MB.',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setEditAvatarUrl(result);
        toast({
          title: 'ĐÃ TẢI ẢNH CHÂN DUNG LÊN!',
          description: 'Bấm "Lưu Thay Đổi" để áp dụng vào danh thiếp số của bạn.',
          variant: 'success',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateDicebearAvatar = () => {
    const newAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(editFullName || 'User')}&backgroundColor=0066ff,00c2ff,10b981,f59e0b`;
    setEditAvatarUrl(newAvatar);
    toast({
      title: 'ĐÃ TẠO AVATAR CHỮ KÝ!',
      description: 'Đã tự động tạo avatar theo họ tên của bạn.',
      variant: 'success',
    });
  };

  const handleOpenEditModal = () => {
    if (!isOwner) {
      toast({
        title: 'BẠN KHÔNG CÓ QUYỀN CHỈNH SỬA!',
        description: 'Chỉ chủ sở hữu hồ sơ mới có quyền cập nhật thông tin này.',
        variant: 'destructive',
      });
      return;
    }
    setEditFullName(matchedIdentity?.fullName || profile.fullName);
    setEditDisplayName(matchedIdentity?.displayName || profile.displayName);
    setEditAvatarUrl(matchedIdentity?.avatarUrl || profile.avatarUrl);
    setEditTitle(matchedIdentity?.title || profile.title);
    setEditCompany(matchedIdentity?.businesses?.[0]?.businessName || profile.company);
    setEditTaxCode(matchedIdentity?.taxCode || matchedIdentity?.businesses?.[0]?.taxCode || profile.taxCode);
    setEditAddress(matchedIdentity?.address || matchedIdentity?.businesses?.[0]?.address || profile.address);
    setEditAssociation(matchedIdentity?.association || profile.association);
    setEditSlogan(matchedIdentity?.slogan || profile.slogan);
    setEditIndustry(matchedIdentity?.industry || matchedIdentity?.businesses?.[0]?.industry || 'Công Nghệ Thông Tin & AI');
    setEditSkills(
      (matchedIdentity?.expertiseSkills && matchedIdentity.expertiseSkills.length > 0)
        ? matchedIdentity.expertiseSkills
        : (matchedIdentity?.businesses?.[0]?.expertiseSkills && matchedIdentity.businesses[0].expertiseSkills.length > 0)
        ? matchedIdentity.businesses[0].expertiseSkills
        : ['Hạ Tầng IoT & NFC', 'AI B2B Matchmaking', 'Next.js & Turbopack', 'Truyền Thông Số', 'Sự Kiện MICE']
    );
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
        title: 'BẠN KHÔNG CÓ QUYỀN CHỈNH SỬA!',
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
      industry: editIndustry,
      expertiseSkills: editSkills,
      phone: editPhone,
      email: editEmail,
      bio: editBio,
      website: editWebsite,
      avatarUrl: editAvatarUrl || undefined,
    });

    DbService.updateIdentity(matchedIdentity.id, {
      fullName: editFullName,
      displayName: editDisplayName,
      title: editTitle,
      businessName: editCompany,
      phone: editPhone,
      email: editEmail,
      bio: editBio,
      website: editWebsite,
    }).catch((err) => console.warn('Cloud sync background error:', err));

    setIsEditModalOpen(false);
    toast({
      title: 'ĐÃ CẬP NHẬT HỒ SƠ THÀNH CÔNG!',
      description: 'Lĩnh vực chuyên môn, kỹ năng, doanh nghiệp và MST đã được cập nhật đồng bộ.',
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
NOTE:${profile.fullName} (${profile.displayName})\\n${profile.company}\\nChức vụ: ${profile.roleVietnamese}\\nHiệp hội: ${profile.association}\\nMST: ${profile.taxCode}\\nĐịa chỉ: ${profile.address}\\nZalo: ${profile.zalo}\\nBối cảnh gặp gỡ: ${formattedDateTime}\\nSự kiện: ${profile.eventJoined}\\nSlogan: "${profile.slogan}"\\nWebsite: ${profile.websiteDisplay}
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
      title: 'ĐÃ TẢI DANH BẠ vCARD 1-CLICK!',
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
    const shareText = `Kính gửi Quý Đối Tác, tôi xin gửi Danh Thiếp Số One Connect của ${profile.fullName} (${profile.displayName}) - ${profile.roleVietnamese} tại ${profile.company}.\nXem hồ sơ & Kết nối B2B: ${typeof window !== 'undefined' ? window.location.href : 'https://one-connect-network.vercel.app/p/johnnylongho'}\nHotline: ${profile.phone} | Zalo: ${profile.zalo}`;
    
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: 'ĐÃ SAO CHÉP MẪU TIN NHẮN ZALO!',
        description: 'Đã sao chép lời giới thiệu B2B. Bạn có thể dán vào Zalo gửi ngay.',
        variant: 'success',
      });
      window.open(profile.zalo, '_blank', 'noopener,noreferrer');
    }
  };

  // 1-Tap B2B Contact Exchange Trigger
  const handleRequestConnection = useCallback(() => {
    // Nếu người xem đã là thành viên đăng nhập khác chủ thẻ
    if (currentIdentity && matchedIdentity && currentIdentity.id !== matchedIdentity.id) {
      requestConnection(matchedIdentity.id, 'One Connect MICE NFC Tap');
      setIsConnRequested(true);
      toast({
        title: 'ĐÃ GỬI DANH THIẾP THÀNH CÔNG!',
        description: `Danh thiếp số của bạn đã gửi trực tiếp đến ${profile.fullName}.`,
        variant: 'success',
      });
    } else {
      // Khách / đối tác mới chạm thẻ NFC -> Mở form trao đổi danh thiếp nhanh 10 giây
      setIsB2bModalOpen(true);
    }
  }, [currentIdentity, matchedIdentity, profile.fullName, requestConnection, toast]);

  // Handle Guest Contact Exchange Submission
  const handleSubmitExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim()) {
      toast({
        title: 'VUI LÒNG ĐIỀN ĐỦ THÔNG TIN',
        description: 'Vui lòng nhập Họ tên và Số điện thoại / Zalo để gửi danh thiếp.',
        variant: 'destructive',
      });
      return;
    }

    setIsExchanging(true);
    try {
      await DbService.exchangeGuestContact({
        ownerIdentityId: matchedIdentity?.id || '11111111-1111-1111-1111-111111111111',
        guestName,
        guestPhone,
        guestCompany,
        guestNote,
      });

      setIsConnRequested(true);
      setIsB2bModalOpen(false);
      toast({
        title: 'ĐÃ GỬI DANH THIẾP THÀNH CÔNG!',
        description: `Thông tin đã truyền đến thiết bị của ${profile.fullName}. Đang chờ đối tác bấm xác nhận...`,
        variant: 'success',
      });
    } catch (err) {
      console.warn('Exchange error:', err);
    } finally {
      setIsExchanging(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: 'ĐÃ SAO CHÉP LIÊN KẾT DANH THIẾP SỐ!',
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
    <div className="min-h-screen bg-slate-100/90 text-slate-900 pb-20 antialiased selection:bg-blue-600 selection:text-white" suppressHydrationWarning>

      {/* MOBILE APPLICATION CONTAINER */}
      <div className="max-w-md mx-auto relative bg-white min-h-screen border-x border-slate-200/80 shadow-2xl overflow-hidden pb-12">
        
        {/* 1. TOP APP BAR (Compact Glassmorphic Header) */}
        <header className="bg-white/95 border-b border-slate-100 px-3.5 sm:px-4 py-2.5 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/dashboard"
              className="p-1.5 sm:p-2 rounded-full bg-slate-50 border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-[#0066FF] hover:border-blue-200 transition-all active:scale-95 cursor-pointer shadow-2xs shrink-0"
              title="Quay lại Trang Tổng Quan Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <img
              src="/one_connect_final_logo_orange.png"
              alt="One Connect Logo"
              className="h-6 sm:h-7 w-auto object-contain shrink-0 drop-shadow-xs"
            />
            <div className="truncate">
              <div className="text-[11px] sm:text-[12px] text-[#0066FF] font-black tracking-tight uppercase flex items-center gap-1 font-heading truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="truncate">One Connect Pass</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
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

        {/* 2. EXECUTIVE HERO BLOCK (Thiết kế tinh gọn, chuẩn Mobile-First, chống tràn chữ) */}
        <div className="px-3 sm:px-4 pt-3 pb-2">
          <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-md">
            
            {/* Top Cover Banner */}
            <div className="h-24 sm:h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-[#FF6B00] relative p-3 flex items-start justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-mono font-bold border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {profile.cardUid}
              </span>

              {isOwner && (
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-slate-900 text-[10px] sm:text-[11px] font-bold shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <Edit3 className="w-3 h-3 text-[#0066FF]" />
                  <span>Sửa Hồ Sơ</span>
                </button>
              )}
            </div>

            {/* Profile Info Body */}
            <div className="px-4 pb-4 pt-0 relative space-y-3">
              
              {/* Avatar positioned over the banner */}
              <div className="flex items-end justify-between -mt-12 sm:-mt-14 mb-2">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 aspect-square rounded-2xl overflow-hidden shadow-lg bg-white p-1 border-2 border-white ring-2 ring-blue-500/30 shrink-0 group">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover rounded-xl aspect-square block"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.fullName)}&backgroundColor=0066ff,00c2ff`;
                    }}
                  />
                  {isOwner && (
                    <button
                      type="button"
                      onClick={handleOpenEditModal}
                      className="absolute inset-1 rounded-xl bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-0.5 cursor-pointer"
                      title="Bấm để đổi ảnh đại diện"
                    >
                      <Camera className="w-4 h-4 text-white" />
                      <span>Đổi Ảnh</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsVerifiedModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] text-[11px] font-bold shadow-2xs hover:bg-blue-100 transition-colors"
                >
                  <EnterpriseVerifiedBadge className="w-4 h-4 shrink-0" />
                  <span>Enterprise Verified</span>
                </button>
              </div>

              {/* Name & Title Hierarchy (Tối ưu chống tràn chữ trên mọi dòng máy) */}
              <div className="space-y-1 text-left">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
                    {profile.fullName}
                  </h1>
                  {profile.displayName && profile.displayName !== profile.fullName && (
                    <span className="text-xs font-bold text-slate-500">
                      ({profile.displayName})
                    </span>
                  )}
                </div>

                <p className="text-[13.5px] sm:text-[14px] font-bold text-[#0066FF] leading-snug">
                  {profile.roleVietnamese}
                </p>

                <div className="flex items-center gap-1.5 text-[12.5px] sm:text-[13px] font-semibold text-slate-700 pt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                  <span className="truncate">{profile.company}</span>
                </div>

                {profile.association && (
                  <p className="text-[11.5px] text-slate-500 font-medium truncate">
                    {profile.association}
                  </p>
                )}
              </div>

              {/* Executive Slogan (Gọn gàng & Thanh lịch) */}
              {profile.slogan && (
                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-[12px] sm:text-[12.5px] text-[#0066FF] font-semibold italic text-center leading-snug">
                  "{profile.slogan}"
                </div>
              )}

              {/* QUICK 1-TAP CONTACT ICONS BAR (4 nút gọi, email, zalo, web gọn gàng) */}
              <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-100">
                <a
                  href={`tel:${profile.phone}`}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl bg-blue-50 border border-blue-200/80 hover:bg-blue-100 text-[#0066FF] transition-all active:scale-95 shadow-2xs"
                  title="Gọi điện thoại"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-[11px] font-bold">Gọi Điện</span>
                </a>

                <a
                  href={`mailto:${profile.email}`}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl bg-orange-50 border border-orange-200/80 hover:bg-orange-100 text-[#FF6B00] transition-all active:scale-95 shadow-2xs"
                  title="Gửi Email"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-[11px] font-bold">Email</span>
                </a>

                <a
                  href={profile.zalo}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1 p-2 rounded-xl bg-cyan-50 border border-cyan-200/80 hover:bg-cyan-100 text-cyan-700 transition-all active:scale-95 shadow-2xs"
                  title="Nhắn Zalo"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-[11px] font-bold">Zalo</span>
                </a>

                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1 p-2 rounded-xl bg-purple-50 border border-purple-200/80 hover:bg-purple-100 text-purple-700 transition-all active:scale-95 shadow-2xs"
                  title="Website"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-[11px] font-bold">Website</span>
                </a>
              </div>

              {/* PRIMARY ACTION BUTTONS (Lưu Danh Bạ & Kết Nối B2B - Thao tác 1 chạm ngón cái) */}
              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  onClick={handleSaveContact}
                  size="lg"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-[13.5px] sm:text-[14px] py-4 shadow-sm active:scale-98 transition-all cursor-pointer touch-manipulation"
                >
                  <Download className="w-4 h-4 mr-1.5" /> Lưu Danh Bạ
                </Button>

                <Button
                  type="button"
                  onClick={handleRequestConnection}
                  size="lg"
                  disabled={isConnected || isConnRequested}
                  className={`flex-1 font-black rounded-xl text-[13.5px] sm:text-[14px] py-4 shadow-sm active:scale-98 transition-all touch-manipulation cursor-pointer ${
                    isConnected
                      ? 'bg-emerald-600 hover:bg-emerald-600 text-white'
                      : isConnRequested
                      ? 'bg-amber-500 hover:bg-amber-500 text-white animate-pulse'
                      : 'bg-gradient-to-r from-[#0066FF] to-[#FF6B00] hover:opacity-95 text-white'
                  }`}
                >
                  <UserCheck className="w-4 h-4 mr-1.5" />
                  {isConnected
                    ? '✓ Đã Kết Nối'
                    : isConnRequested
                    ? '⏳ Đang Chờ Xác Nhận...'
                    : 'Trao Đổi Danh Thiếp'}
                </Button>
              </div>

              {/* EXECUTIVE METRICS ROW (Ngắn gọn, không bị co chữ trên màn hình nhỏ) */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-sm sm:text-base font-black text-slate-900 font-heading">{profile.experienceYears}</div>
                  <div className="text-[10px] sm:text-[10.5px] text-slate-500 font-semibold truncate">Kinh Nghiệm</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-sm sm:text-base font-black text-[#0066FF] font-heading">{profile.b2bMatchesCount}</div>
                  <div className="text-[10px] sm:text-[10.5px] text-slate-500 font-semibold truncate">Kết Nối B2B</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-sm sm:text-base font-black text-emerald-600 font-heading">{profile.trustRating}</div>
                  <div className="text-[10px] sm:text-[10.5px] text-emerald-700 font-semibold truncate">Tín Nhiệm</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 3. HỆ THỐNG TAB ĐIỀU HƯỚNG TINH GỌN (Tên tab ngắn, chuẩn responsive) */}
        <div className="px-3 sm:px-4 space-y-3 pt-1">
          <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 bg-slate-100 p-1 rounded-2xl border border-slate-200 gap-1 h-auto">
              <TabsTrigger
                value="about"
                className="py-2 px-1 rounded-xl text-[12px] sm:text-[13px] font-bold transition-all data-[state=active]:bg-[#0066FF] data-[state=active]:text-white data-[state=active]:shadow-sm flex items-center justify-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Hồ Sơ</span>
              </TabsTrigger>

              <TabsTrigger
                value="products"
                className="py-2 px-1 rounded-xl text-[12px] sm:text-[13px] font-bold transition-all data-[state=active]:bg-[#0066FF] data-[state=active]:text-white data-[state=active]:shadow-sm flex items-center justify-center gap-1"
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>Dịch Vụ</span>
              </TabsTrigger>

              <TabsTrigger
                value="event"
                className="py-2 px-1 rounded-xl text-[12px] sm:text-[13px] font-bold transition-all data-[state=active]:bg-[#0066FF] data-[state=active]:text-white data-[state=active]:shadow-sm flex items-center justify-center gap-1"
              >
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span>Vé VIP</span>
              </TabsTrigger>

              <TabsTrigger
                value="history"
                className="py-2 px-1 rounded-xl text-[12px] sm:text-[13px] font-bold transition-all data-[state=active]:bg-[#0066FF] data-[state=active]:text-white data-[state=active]:shadow-sm flex items-center justify-center gap-1"
              >
                <History className="w-3.5 h-3.5 shrink-0" />
                <span>Lịch Sử</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: HỒ SƠ & THÔNG TIN DOANH NGHIỆP */}
            <TabsContent value="about" className="space-y-3 pt-2.5 m-0">
              
              {/* Thông tin liên hệ & Pháp nhân chi tiết */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                <h3 className="font-black text-slate-900 text-[13.5px] sm:text-[14px] uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Building2 className="w-4 h-4 text-[#FF6B00]" /> Pháp Nhân & Liên Hệ
                </h3>

                <div className="space-y-2 text-[12.5px] sm:text-[13px] text-slate-700">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <span className="text-slate-400 text-[10px] font-bold block uppercase">DOANH NGHIỆP</span>
                      <strong className="text-slate-900 font-bold text-[13.5px] block truncate">{profile.company}</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-blue-50/70 border border-blue-200/80">
                    <Briefcase className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <span className="text-blue-700 text-[10px] font-bold block uppercase">LĨNH VỰC CHUYÊN MÔN / NGÀNH NGHỀ</span>
                      <strong className="text-blue-950 font-black text-[13px] block truncate">{profile.industry}</strong>
                    </div>
                    <Badge className="bg-[#0066FF] text-white text-[9.5px] shrink-0 font-bold">
                      AI MATCH
                    </Badge>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <Hash className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <span className="text-slate-400 text-[10px] font-bold block uppercase">MÃ SỐ THUẾ / GPKD</span>
                      <span className="font-mono font-bold text-slate-900 text-[13.5px]">{profile.taxCode}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <span className="text-slate-400 text-[10px] font-bold block uppercase">TRỤ SỞ CHÍNH</span>
                      <span className="text-slate-800 text-[12.5px] leading-snug block">{profile.address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <Globe className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <span className="text-slate-400 text-[10px] font-bold block uppercase">WEBSITE</span>
                      <a href={profile.website} target="_blank" rel="noreferrer" className="text-[#0066FF] font-semibold hover:underline block truncate">
                        {profile.websiteDisplay}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tiểu sử chuyên gia */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <h3 className="font-black text-slate-900 text-[13.5px] sm:text-[14px] uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Briefcase className="w-4 h-4 text-[#0066FF]" /> Tiểu Sử & Thế Mạnh
                </h3>
                <p className="text-[13px] sm:text-[13.5px] text-slate-700 leading-relaxed">
                  {profile.bio}
                </p>

                {/* Skill Pills */}
                <div className="pt-1">
                  <span className="text-[10.5px] text-slate-400 font-mono block pb-1 font-bold uppercase">
                    LĨNH VỰC CHUYÊN MÔN:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-[#0066FF] text-[11.5px] font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* SÀN CUNG & CẦU GIAO THƯƠNG B2B (GIVE & ASK) */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-orange-50/60 border border-blue-200/90 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-black text-slate-900 text-[13.5px] sm:text-[14px] uppercase tracking-wider flex items-center gap-1.5 font-heading">
                    <Sparkles className="w-4 h-4 text-[#FF6B00]" /> Cung & Cầu Giao Thương B2B
                  </h3>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                    AI Match Ready
                  </span>
                </div>

                {/* ĐANG TÌM KIẾM (SEEKING) */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-extrabold text-[#FF6B00] uppercase tracking-wider flex items-center gap-1">
                    ĐANG TÌM KIẾM ĐỐI TÁC (SEEKING):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.seekingNeeds.map((need, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-orange-50/90 border border-orange-200 text-[#FF6B00] text-[11.5px] font-bold shadow-2xs"
                      >
                        • {need}
                      </span>
                    ))}
                  </div>
                </div>

                {/* NĂNG LỰC CUNG CẤP (OFFERING) */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-extrabold text-[#0066FF] uppercase tracking-wider flex items-center gap-1">
                    NĂNG LỰC CUNG CẤP (OFFERING):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.offeringServices.map((offer, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-blue-50/90 border border-blue-200 text-[#0066FF] text-[11.5px] font-bold shadow-2xs"
                      >
                        ✓ {offer}
                      </span>
                    ))}
                  </div>
                </div>

                {/* TÀI LIỆU NĂNG LỰC / BROCHURE */}
                {profile.brochureUrl && (
                  <div className="pt-2 border-t border-slate-100">
                    <a
                      href={profile.brochureUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[12px] font-bold transition-all shadow-xs"
                    >
                      <Download className="w-4 h-4 text-[#00C2FF]" />
                      <span>Xem Profile & Brochure Doanh Nghiệp (PDF)</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Bối cảnh gặp gỡ */}
              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-1.5 text-[12px] text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0066FF]" /> Ngày gặp gỡ:
                  </span>
                  <strong className="text-slate-900 font-mono">{currentDateStr}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-[#FF6B00]" /> Bối cảnh:
                  </span>
                  <strong className="text-slate-900 truncate max-w-[200px]">{profile.eventJoined}</strong>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: SẢN PHẨM & GIẢI PHÁP CAROUSEL */}
            <TabsContent value="products" className="space-y-3 pt-2.5 m-0">
              <div className="relative rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] sm:text-[14px] font-black text-slate-900 flex items-center gap-1.5 font-heading">
                    <Layers className="w-4 h-4 text-[#FF6B00]" /> Danh Mục Giải Pháp
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {carouselIndex + 1} / {PRODUCTS.length}
                  </span>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 h-36 sm:h-40 relative bg-slate-100">
                  <img
                    src={PRODUCTS[carouselIndex]?.image}
                    alt={PRODUCTS[carouselIndex]?.title}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-[#0066FF] text-white text-[10px] font-bold border-0 shadow-sm">
                      {PRODUCTS[carouselIndex]?.category}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <div className="text-[11.5px] font-mono font-bold text-[#FF6B00]">
                    {PRODUCTS[carouselIndex]?.highlight}
                  </div>
                  <h4 className="font-bold text-slate-900 text-[14.5px] leading-snug">
                    {PRODUCTS[carouselIndex]?.title}
                  </h4>
                  <p className="text-[12.5px] text-slate-600 leading-relaxed">
                    {PRODUCTS[carouselIndex]?.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Button
                    type="button"
                    onClick={prevProduct}
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 p-0 rounded-full border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </Button>
                  <div className="flex gap-1">
                    {PRODUCTS.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === carouselIndex ? 'w-5 bg-[#0066FF]' : 'w-1.5 bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <Button
                    type="button"
                    onClick={nextProduct}
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 p-0 rounded-full border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: THÔNG TIN SỰ KIỆN & VÉ CHECK-IN */}
            <TabsContent value="event" className="space-y-3 pt-2.5 m-0">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] sm:text-[14px] font-black text-slate-900 flex items-center gap-1.5 font-heading">
                    <Zap className="w-4 h-4 text-[#FF6B00]" /> Thẻ VIP & Vé Sự Kiện
                  </span>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                    ĐÃ CHECK-IN
                  </Badge>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${profile.ticketCode}`}
                    alt="Ticket QR"
                    className="w-16 h-16 rounded-xl border border-slate-200 p-1 bg-white shrink-0 shadow-2xs"
                  />
                  <div className="space-y-0.5 text-[12.5px] text-left">
                    <p className="font-bold text-slate-900 leading-tight text-[13.5px]">{profile.eventJoined}</p>
                    <p className="font-mono text-[11.5px] text-[#0066FF] font-bold">{profile.ticketTier}</p>
                    <p className="text-[11.5px] text-slate-600 font-semibold">{profile.seatLocation}</p>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  size="sm"
                  variant="outline"
                  className="w-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-[13px] font-bold rounded-xl py-3 cursor-pointer shadow-2xs"
                >
                  <QrCode className="w-4 h-4 mr-1.5 text-[#0066FF]" /> Phóng To Mã QR Để Quét
                </Button>
              </div>
            </TabsContent>

            {/* TAB 4: LỊCH SỬ CÁC SỰ KIỆN THAM GIA */}
            <TabsContent value="history" className="space-y-3 pt-2.5 m-0">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] sm:text-[14px] font-black text-slate-900 flex items-center gap-1.5 font-heading">
                    <CalendarCheck className="w-4 h-4 text-[#0066FF]" /> Lịch Sử Tham Dự Sự Kiện
                  </span>
                  <Badge className="bg-blue-50 text-[#0066FF] border-blue-200 text-[10px] font-bold">
                    {JOINED_EVENTS.length} Sự Kiện
                  </Badge>
                </div>

                <div className="space-y-2">
                  {JOINED_EVENTS.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 hover:bg-slate-100 transition-colors text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-slate-900 text-[13px] leading-snug">
                          {ev.title}
                        </h4>
                        <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${ev.statusColor}`}>
                          {ev.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11.5px] text-slate-500">
                        <div className="flex items-center gap-1 font-semibold text-[#0066FF]">
                          <Award className="w-3 h-3" />
                          <span>{ev.role}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{ev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-slate-600">
                        <MapPin className="w-3 h-3 text-[#FF6B00] shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* 4. FLOATING BOTTOM ACTION DOCK */}
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 py-2.5 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={handleSaveContact}
              size="sm"
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-[13px] py-3 shadow-2xs active:scale-98 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 mr-1" /> Lưu Danh Bạ
            </Button>

            <Button
              type="button"
              onClick={handleRequestConnection}
              size="sm"
              disabled={isConnected || isConnRequested}
              className={`flex-1 font-extrabold rounded-xl text-[13px] py-3 shadow-2xs active:scale-98 transition-all cursor-pointer ${
                isConnected
                  ? 'bg-emerald-600 hover:bg-emerald-600 text-white'
                  : isConnRequested
                  ? 'bg-amber-500 hover:bg-amber-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-[#0066FF] to-[#FF6B00] hover:opacity-95 text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 mr-1" />
              {isConnected
                ? '✓ Đã Kết Nối'
                : isConnRequested
                ? '⏳ Đang Chờ Xác Nhận...'
                : 'Trao Đổi Danh Thiếp'}
            </Button>
          </div>
        </div>

        {/* 5. MODAL TRAO ĐỔI DANH THIẾP 1 CHẠM QUA NFC */}
        <Dialog open={isB2bModalOpen} onOpenChange={setIsB2bModalOpen}>
          <DialogContent className="sm:max-w-md bg-white border-slate-200 text-slate-900 shadow-2xl rounded-3xl p-5 space-y-3">
            <DialogHeader className="space-y-1.5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-blue-500 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
                <UserCheck className="w-6 h-6" />
              </div>
              <DialogTitle className="text-lg font-black text-slate-900 font-heading">
                Trao Đổi Danh Thiếp Số
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 leading-relaxed">
                Gửi lại thông tin liên hệ của bạn để <strong>{profile.fullName}</strong> lưu vào danh bạ và kết nối B2B trực tiếp.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmitExchange} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên của bạn <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn Hùng"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số điện thoại / Zalo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0912 345 678"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Công ty & Chức vụ (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giám Đốc Cty TNHH Giải Pháp Số"
                  value={guestCompany}
                  onChange={(e) => setGuestCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nhu cầu kết nối / Lời nhắn (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Quan tâm hợp tác B2B phân phối sản phẩm"
                  value={guestNote}
                  onChange={(e) => setGuestNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isExchanging}
                  className="w-full bg-gradient-to-r from-[#0066FF] to-[#FF6B00] hover:opacity-95 text-white font-bold rounded-xl py-3 text-xs shadow-md shadow-blue-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  {isExchanging ? 'Đang gửi qua Cloud...' : 'Xác Nhận Gửi Danh Thiếp'}
                </Button>
              </div>

              <p className="text-[10.5px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bảo mật dữ liệu cá nhân theo Nghị định 13 & Luật PDPL 91/2025</span>
              </p>
            </form>
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
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${mounted && typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : 'https%3A%2F%2Fone-connect-network.vercel.app%2Fp%2Fjohnnylongho'}`}
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
                Đã Xuất Danh Bạ vCard 3.0!
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
                {/* AVATAR UPLOAD & PREVIEW CARD */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/80 to-slate-50 border border-blue-200/80 flex items-center gap-3.5">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-sm bg-white shrink-0 border-2 border-[#0066FF] group">
                    <img
                      src={editAvatarUrl || profile.avatarUrl}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                      title="Chọn ảnh từ thiết bị"
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-1.5 min-w-0">
                    <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                      Ảnh Chân Dung / Logo Đại Diện
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleAvatarFileSelect}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-xs py-1.5 px-3 rounded-xl cursor-pointer shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5 mr-1" /> Tải Ảnh Mới
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleGenerateDicebearAvatar}
                        className="text-slate-700 border-slate-200 hover:bg-slate-100 font-bold text-xs py-1.5 px-2.5 rounded-xl cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1 text-[#FF6B00]" /> Initials
                      </Button>
                    </div>
                  </div>
                </div>

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

                {/* ========================================================= */}
                {/* TÙY CHỈNH LĨNH VỰC CHUYÊN MÔN / NGÀNH NGHỀ HOẠT ĐỘNG */}
                {/* ========================================================= */}
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-left space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11.5px] font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5 font-heading">
                      <Briefcase className="w-4 h-4 text-[#0066FF]" /> Lĩnh Vực Chuyên Môn / Ngành Nghề <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-blue-700 font-bold bg-blue-100/90 border border-blue-200 px-2 py-0.5 rounded-full">
                      AI Matching
                    </span>
                  </div>

                  {/* Dropdown danh mục ngành nghề có sẵn */}
                  <select
                    value={PRESET_INDUSTRIES.includes(editIndustry) ? editIndustry : 'Khác (Tự nhập)'}
                    onChange={(e) => {
                      if (e.target.value !== 'Khác (Tự nhập)') {
                        setEditIndustry(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-blue-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  >
                    {PRESET_INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                    <option value="Khác (Tự nhập)">Khác (Tự nhập lĩnh vực riêng...)</option>
                  </select>

                  {/* Ô nhập tùy chỉnh linh hoạt */}
                  <input
                    value={editIndustry}
                    onChange={(e) => setEditIndustry(e.target.value)}
                    placeholder="Nhập tên lĩnh vực chuyên môn cụ thể..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />

                  {/* Nút bấm nhanh 1-chạm (Quick Industry Pills) */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Gợi ý chọn nhanh:</span>
                    <div className="flex flex-wrap gap-1">
                      {PRESET_INDUSTRIES.slice(0, 6).map((ind) => (
                        <button
                          key={ind}
                          type="button"
                          onClick={() => setEditIndustry(ind)}
                          className={`px-2 py-1 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer ${
                            editIndustry === ind
                              ? 'bg-[#0066FF] text-white shadow-2xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-100/60'
                          }`}
                        >
                          {ind}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* TÙY CHỈNH KỸ NĂNG & THẾ MẠNH CHUYÊN SÂU (TAGS) */}
                {/* ========================================================= */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11.5px] font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-heading">
                      <Sparkles className="w-4 h-4 text-[#FF6B00]" /> Kỹ Năng & Năng Lực Cốt Lõi (Tags)
                    </label>
                    <span className="text-[10px] text-slate-500 font-bold">
                      {editSkills.length} thẻ
                    </span>
                  </div>

                  {/* Danh sách Tags hiện có với nút xóa */}
                  <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-white rounded-xl border border-slate-200">
                    {editSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[#0066FF] text-[11px] font-bold animate-in fade-in"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => setEditSkills(editSkills.filter((_, i) => i !== idx))}
                          className="w-4 h-4 rounded-full bg-blue-100 hover:bg-red-500 hover:text-white flex items-center justify-center text-[10px] text-blue-600 transition-colors cursor-pointer"
                          title="Xóa kỹ năng này"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    {editSkills.length === 0 && (
                      <span className="text-[11.5px] text-slate-400 italic py-1 px-1">Chưa có thẻ kỹ năng nào. Hãy thêm bên dưới:</span>
                    )}
                  </div>

                  {/* Ô nhập thêm tag kỹ năng mới */}
                  <div className="flex gap-1.5">
                    <input
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newSkillInput.trim() && !editSkills.includes(newSkillInput.trim())) {
                            setEditSkills([...editSkills, newSkillInput.trim()]);
                            setNewSkillInput('');
                          }
                        }
                      }}
                      placeholder="VD: IoT & NFC, AI B2B, Next.js, Marketing B2B..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        if (newSkillInput.trim() && !editSkills.includes(newSkillInput.trim())) {
                          setEditSkills([...editSkills, newSkillInput.trim()]);
                          setNewSkillInput('');
                        }
                      }}
                      className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-xs rounded-xl px-3.5 cursor-pointer shadow-xs shrink-0"
                    >
                      + Thêm Tag
                    </Button>
                  </div>
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
