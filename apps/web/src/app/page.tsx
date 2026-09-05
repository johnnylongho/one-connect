'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useOneConnectStore } from '@/lib/store';
import {
  Zap,
  ShieldCheck,
  TrendingUp,
  Smartphone,
  Layers,
  Lock,
  Play,
  QrCode,
  Check,
  Sparkles,
  ArrowRight,
  Radio,
  Unlock,
  Tag,
  RefreshCw,
  MessageSquare,
  Menu,
  X,
  ChevronDown,
  Building2,
  CreditCard,
  Download,
  Users,
  Calendar,
  Activity,
  CheckCircle2,
  ArrowUp,
  User,
  LogOut,
  Leaf,
  Clock,
  KeyRound,
  Wallet,
  FileText,
  Globe,
  Cpu,
  XCircle,
  AlertTriangle,
  Award,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { INITIAL_ARTICLES, CATEGORY_LABELS } from '@/lib/services/articles';
import { ServicePackagesSection } from '@/components/services/ServicePackagesSection';

export default function HomePage() {
  const { state, currentIdentity, logoutUser } = useOneConnectStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active Interactive Tab
  const [activeTab, setActiveTab] = useState<'checkin' | 'consent' | 'crm'>('checkin');

  // Simulator 1: Fast Check-in state
  const [checkinScanning, setCheckinScanning] = useState(false);
  const [checkinSuccess, setCheckinSuccess] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(148);

  // Simulator 2: 2-Way Consent state
  const [consentGranted, setConsentGranted] = useState(false);

  // Simulator 3: CRM Lead Classification
  const [leadStatus, setLeadStatus] = useState<'WARM' | 'HOT' | 'CONVERTED'>('HOT');
  const [noteText, setNoteText] = useState(
    'Gặp gỡ đại diện đối tác tại diễn đàn. Nhu cầu triển khai 500 thẻ NFC kết nối cho đội ngũ kinh doanh trong Q3.'
  );

  // ROI Calculator State
  const [attendeesPerEvent, setAttendeesPerEvent] = useState(300);
  const [eventsPerYear, setEventsPerYear] = useState(12);

  // Calculate ROI
  const totalDelegates = attendeesPerEvent * eventsPerYear;
  const paperCostSaved = totalDelegates * 25000; // 25k VND per printed packet + badge
  const co2SavedKg = Math.round(totalDelegates * 0.18);
  const checkinHoursSaved = Math.round((totalDelegates * 25) / 3600); // 25s saved per delegate

  const handleSimulateCheckin = () => {
    setCheckinScanning(true);
    setCheckinSuccess(false);
    setTimeout(() => {
      setCheckinScanning(false);
      setCheckinSuccess(true);
      setAttendeeCount((prev) => prev + 1);
    }, 380);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] text-slate-900 antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden relative font-sans">
      
      {/* Background Liquid Mesh Gradient Blurs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-br from-blue-400/15 via-cyan-300/15 to-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute top-[35%] -left-40 w-[600px] h-[500px] bg-blue-300/10 rounded-full blur-3xl" />
        <div className="absolute top-[60%] -right-40 w-[600px] h-[500px] bg-cyan-400/10 rounded-full blur-3xl" />
      </div>

      {/* ================================================================= */}
      {/* 2. HERO SECTION */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden pt-10 pb-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-5xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 text-xs font-extrabold tracking-wide uppercase shadow-2xs backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            NỀN TẢNG KẾT NỐI B2B &amp; ĐỊNH DANH SỐ DOANH NHÂN THẾ HỆ MỚI
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black text-slate-950 tracking-tight font-heading leading-tight [text-wrap:balance]">
            Một Chạm Kết Nối Giao Thương, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#0055EE] via-[#0066FF] to-cyan-500 bg-clip-text text-transparent">
              Nâng Tầm Quản Trị Sự Kiện Chuẩn ESG
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed font-normal">
            Giải pháp thay thế hoàn toàn danh thiếp giấy truyền thống bằng thẻ thông minh NFC, trạm điểm danh sự kiện tốc độ cao <strong>&lt; 0.42s</strong>, sổ tay quan hệ mini-CRM và nền tảng giao thương B2B bảo vệ quyền riêng tư theo <strong>Luật PDPL 91</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto gap-2 bg-[#0066FF] hover:bg-blue-700 text-white font-extrabold rounded-2xl h-12 px-7 text-xs sm:text-sm shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" /> Trải Nghiệm Dự Án Ngay
              </Button>
            </Link>
            <Link href="/social-value" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto gap-2 border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 font-bold rounded-2xl h-12 px-6 text-xs sm:text-sm shadow-xs cursor-pointer"
              >
                <Leaf className="w-4 h-4 text-emerald-600" /> Xem Giá Trị Xã Hội &amp; ESG
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
              <div className="pt-2 sm:pt-0 sm:px-3 text-center">
                <div className="text-2xl sm:text-3xl font-black text-[#0066FF] font-heading">&lt; 0.42s</div>
                <div className="text-xs text-slate-700 font-bold mt-1">Tốc độ chạm NFC</div>
                <div className="text-[11px] text-slate-500 font-medium">Không cần cài App</div>
              </div>
              <div className="pt-2 sm:pt-0 sm:px-3 text-center">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-heading">100%</div>
                <div className="text-xs text-slate-700 font-bold mt-1">Chuẩn Luật PDPL 91</div>
                <div className="text-[11px] text-slate-500 font-medium">Đồng thuận 2 chiều</div>
              </div>
              <div className="pt-2 sm:pt-0 sm:px-3 text-center">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">Zero Paper</div>
                <div className="text-xs text-slate-700 font-bold mt-1">Tiêu chuẩn ESG Xanh</div>
                <div className="text-[11px] text-slate-500 font-medium">Cắt giảm rác giấy</div>
              </div>
              <div className="pt-2 sm:pt-0 sm:px-3 text-center">
                <div className="text-2xl sm:text-3xl font-black text-blue-600 font-heading">140ms</div>
                <div className="text-xs text-slate-700 font-bold mt-1">Check-in cổng sự kiện</div>
                <div className="text-[11px] text-slate-500 font-medium">Offline Sync dự phòng</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. MA TRẬN BỐI CẢNH & NỖI ĐAU (THE PAIN POINTS MATRIX) */}
      {/* ================================================================= */}
      <section id="painpoints" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <Badge className="px-3.5 py-1 bg-rose-50 text-rose-700 border-rose-200 text-xs font-black uppercase tracking-wider">
              BỐI CẢNH &amp; THỰC TRẠNG THỊ TRƯỜNG
            </Badge>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black text-slate-950 font-heading tracking-tight leading-snug [text-wrap:balance]">
              Những Rào Cản Khiến Kết Nối Kinh Doanh Kém Hiệu Quả
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Phân tích 3 nhóm đối tượng chịu ảnh hưởng lớn nhất từ phương thức giao tiếp và tổ chức sự kiện thủ công.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Group 1: Doanh Nhân */}
            <div className="rounded-3xl bg-white border border-rose-100 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <Badge className="bg-rose-50 text-rose-800 text-[10px] font-bold">ĐỐI TƯỢNG 1</Badge>
                  <h3 className="text-lg font-black text-slate-950 font-heading mt-1">Doanh Nhân &amp; Giám Đốc Kinh Doanh</h3>
                </div>
                
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <li className="flex items-start gap-2.5 text-rose-900">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Thiếu profile/brochure kịp thời:</strong> Khi gặp đối tác bất ngờ không có sẵn tài liệu chỉn chu giới thiệu chuyên môn và hồ sơ công ty.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-rose-900">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Không quản lý được contact mới:</strong> Hàng chục tấm danh thiếp giấy nhận về bị thất lạc, lẫn lộn hoặc bỏ quên trong ví.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-rose-900">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Không nhớ bối cảnh gặp gỡ:</strong> Quên người này gặp ở hội nghị nào, ai giới thiệu, câu chuyện đã trao đổi đến đâu.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-rose-900">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Không note được nhu cầu:</strong> Không ghi chú được ngân sách, nỗi đau và cơ hội hợp tác ngay tại thời điểm trao đổi.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-rose-900">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Thiếu follow-up sau sự kiện:</strong> "Gặp xong để đó", bỏ lỡ thời điểm vàng chuyển đổi đối tác thành khách hàng thực tế.</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/60 text-[11px] text-rose-800 font-semibold">
                → Hơn 88% cơ hội giao thương B2B bị lãng phí do không có công cụ số hóa lưu trữ và nhắc lịch hẹn.
              </div>
            </div>

            {/* Group 2: Ban Tổ Chức Sự Kiện */}
            <div className="rounded-3xl bg-white border border-amber-100 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <Badge className="bg-amber-50 text-amber-800 text-[10px] font-bold">ĐỐI TƯỢNG 2</Badge>
                  <h3 className="text-lg font-black text-slate-950 font-heading mt-1">Ban Tổ Chức Sự Kiện &amp; MICE</h3>
                </div>
                
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <li className="flex items-start gap-2.5 text-amber-900">
                    <XCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Check-in ùn tắc, mất thời gian:</strong> Xếp hàng dài tra cứu danh sách giấy hoặc file Excel rời rạc gây bực bội cho đại biểu.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-amber-900">
                    <XCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Bỏ sót và nhầm lẫn khách mời:</strong> Thiếu cơ chế đối soát chính xác, dễ nhầm danh tính hoặc cấp sai thẻ đại biểu.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-amber-900">
                    <XCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Mất kiểm soát dữ liệu realtime:</strong> Không nắm bắt được vị trí ngồi, số lần tham dự, tỷ lệ show-up thực tế tại từng thời điểm.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-amber-900">
                    <XCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Không nhận diện khách VIP:</strong> Tiếp tân không kịp nhận diện lãnh đạo cấp cao hoặc nhà tài trợ kim cương để đón tiếp chu đáo.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-amber-900">
                    <XCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Chăm sóc hậu sự kiện thụ động:</strong> Khó khăn trong khâu gửi tài liệu số, thu thập khảo sát và duy trì kết nối hai chiều.</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-[11px] text-amber-800 font-semibold">
                → Rủi ro mất điểm thương hiệu sự kiện trước đối tác lớn vì quy trình đón tiếp rườm rà thiếu chuyên nghiệp.
              </div>
            </div>

            {/* Group 3: Hiệp Hội & Tổ Chức */}
            <div className="rounded-3xl bg-white border border-blue-100 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <Badge className="bg-blue-50 text-blue-800 text-[10px] font-bold">ĐỐI TƯỢNG 3</Badge>
                  <h3 className="text-lg font-black text-slate-950 font-heading mt-1">Hiệp Hội &amp; Câu Lạc Bộ Doanh Nghiệp</h3>
                </div>
                
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <li className="flex items-start gap-2.5 text-blue-900">
                    <XCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span><strong>Không có công cụ đo lường ROI:</strong> Không đánh giá được hiệu quả thực sự của sự kiện đối với kết quả kinh doanh hội viên.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-blue-900">
                    <XCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span><strong>Quản lý thành viên rời rạc:</strong> Dữ liệu hội viên phân mảnh giữa các ban ngành, khó khăn trong việc hỗ trợ kết nối cung cầu.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-blue-900">
                    <XCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span><strong>Đánh giá hội viên thiếu minh bạch:</strong> Không đo lường được mức độ tham gia, đóng góp và tần suất hiện diện của từng hội viên.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-blue-900">
                    <XCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span><strong>Thiếu công cụ nâng tầm quản trị:</strong> Vẫn duy trì thủ tục giấy tờ, chưa đáp ứng tiêu chuẩn quản trị số của thời đại 4.0.</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/60 text-[11px] text-blue-800 font-semibold">
                → Khó duy trì sự gắn kết lâu dài của hội viên nếu hiệp hội không mang lại giá trị gia tăng rõ rệt về công nghệ.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. GIẢI PHÁP ĐỘT PHÁ ONE CONNECT (SOLUTION HIGHLIGHTS) */}
      {/* ================================================================= */}
      <section id="features" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-b from-blue-100/70 via-slate-50/95 to-blue-50/70 rounded-3xl border border-blue-200/80 shadow-xl shadow-blue-500/5 p-6 sm:p-10 lg:p-12 space-y-8 overflow-hidden">
          
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-4xl mx-auto space-y-2 relative z-10">
            <Badge variant="outline" className="px-3.5 py-1 bg-blue-50 text-[#0066FF] border-blue-200 text-xs font-extrabold uppercase tracking-wider shadow-2xs">
              GIẢI PHÁP TOÀN DIỆN ONE CONNECT
            </Badge>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black text-slate-950 font-heading tracking-tight leading-snug [text-wrap:balance]">
              Nền Tảng Kết Nối B2B &amp; Định Danh Số Cho Doanh Nhân
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-2xl mx-auto">
              Ứng dụng công nghệ NFC và mã QR động kết hợp hệ sinh thái phần mềm quản trị kết nối đa tầng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            
            {/* Feature 1 */}
            <div className="bg-white/95 backdrop-blur-xl border border-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/8 transition-all rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF]">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-950 font-heading">Định Danh Số NFC &amp; Dynamic QR</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  Chạm thẻ là mở ngay Profile đa phương tiện, E-Brochure và danh bạ không cần cài ứng dụng. Thay đổi thông tin không mất dữ liệu phôi thẻ.
                </p>
              </div>
              <div className="text-xs font-bold text-blue-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Lưu danh bạ 1-giây (.vcf)
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/95 backdrop-blur-xl border border-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/8 transition-all rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF]">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-950 font-heading">Check-in MICE Siêu Tốc &lt; 0.42s</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  Quét vé hoặc thẻ NFC mở cửa tự động, hiển thị số bàn tiệc và cảnh báo đón tiếp VIP lập tức. Hỗ trợ Offline Sync khi mất mạng.
                </p>
              </div>
              <div className="text-xs font-bold text-blue-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Xóa bỏ 100% rác thẻ giấy
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/95 backdrop-blur-xl border border-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/8 transition-all rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF]">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-950 font-heading">Sổ Tay Quan Hệ &amp; Mini-CRM</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  Ghi nhớ bối cảnh sự kiện, note nhanh nhu cầu đối tác, phân loại Lead WARM/HOT và tự động nhắc lịch follow-up không bỏ lỡ thương vụ.
                </p>
              </div>
              <div className="text-xs font-bold text-blue-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Chấm dứt "Gặp xong để đó"
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/95 backdrop-blur-xl border border-white hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/8 transition-all rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-950 font-heading">Chuẩn Luật PDPL 91 &amp; Nghị Định 13</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  Cơ chế Đồng thuận 2 chiều (Two-Way Consent) minh bạch. Người dùng toàn quyền cho phép hoặc thu hồi dữ liệu, chấm dứt cuộc gọi rác.
                </p>
              </div>
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Bảo vệ quyền riêng tư tuyệt đối
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 5. CÁC ỨNG DỤNG MỞ RỘNG CỦA NỀN TẢNG (EXPANDED APPLICATIONS) */}
      {/* ================================================================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <Badge className="px-3.5 py-1 bg-purple-50 text-purple-700 border-purple-200 text-xs font-black uppercase tracking-wider">
              KHẢ NĂNG TÍCH HỢP ĐA DẠNG
            </Badge>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black text-slate-950 font-heading tracking-tight leading-snug [text-wrap:balance]">
              Các Ứng Dụng Mở Rộng Của Nền Tảng One Connect
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Không chỉ là danh thiếp số – One Connect là hạ tầng công nghệ không chạm mở rộng cho toàn bộ vận hành doanh nghiệp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* App 1: Smart Attendance & Chấm công */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 font-heading">
                1. Chấm Công Thông Minh &amp; Điểm Danh Sự Kiện
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Tận dụng phôi thẻ NFC One Connect để điểm danh nhân sự văn phòng hoặc check-in hội thảo nội bộ. Tự động xuất báo cáo giờ vào ra chính xác mà không cần đầu tư máy chấm công vân tay cồng kềnh.
              </p>
            </div>

            {/* App 2: Access Control & Kiểm soát ra vào */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 font-heading">
                2. Kiểm Soát Ra Vào Cửa &amp; Phòng Họp VIP (Access Control)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Tích hợp vi mạch thẻ với khóa cửa thông minh (Smart Lock), thang máy tòa nhà và cổng kiểm soát phân làn (Flap Barrier) để phân quyền ra vào theo cấp bậc hội viên hoặc đại biểu VIP.
              </p>
            </div>

            {/* App 3: Thẻ Hội Viên Đa Năng */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 font-heading">
                3. Thẻ Hội Viên Số Đa Năng (Multi-Association Smart Pass)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Một chiếc thẻ vật lý duy nhất tích hợp nhiều tư cách hội viên: Hiệp hội Doanh nhân Trẻ (YBA), BNI, VCCI, Hội Doanh nghiệp Tỉnh. Phân cấp quyền hạn và nhận diện quyền lợi chiết khấu đối tác tức thời.
              </p>
            </div>

            {/* App 4: Cashless Payment */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 font-heading">
                4. Thanh Toán Nội Bộ Không Tiền Mặt (Cashless Closed-Loop)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Nạp số dư ví vào thẻ để thanh toán suất ăn, đồ uống, mua vé hội thảo chuyên sâu, mua tài liệu hoặc quà lưu niệm tại các kỳ hội chợ, triển lãm thương mại chỉ bằng 1 chạm.
              </p>
            </div>

            {/* App 5: E-Catalogue & Digital Showroom */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 font-heading">
                5. E-Catalogue &amp; Showroom Sản Phẩm Số
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Chạm thẻ mở ngay danh mục sản phẩm tương tác 3D, báo giá PDF và video quy trình sản xuất của nhà máy. Giúp đại diện kinh doanh đàm phán hợp đồng chuyên nghiệp ở bất cứ đâu.
              </p>
            </div>

            {/* App 6: Smart Asset Tagging */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 font-heading">
                6. Quản Lý Tài Sản &amp; Thiết Bị Sự Kiện (Asset Tagging)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Gắn chip NFC vào hệ thống trang thiết bị âm thanh, ánh sáng, màn hình LED của ban tổ chức để theo dõi lịch sử bảo dưỡng, xuất nhập kho và kiểm kê tự động.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 6. TIỀM NĂNG PHÁT TRIỂN & MỞ RỘNG (ROADMAP & SCALABILITY) */}
      {/* ================================================================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-[#0A1124] via-[#0F1B38] to-[#0A1124] text-white p-8 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden">
          
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="max-w-3xl space-y-3">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs font-bold uppercase">
                TẦM NHÌN DÀI HẠN
              </Badge>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black font-heading tracking-tight text-white leading-snug [text-wrap:balance]">
                Tiềm Năng Phát Triển &amp; Mở Rộng Hệ Sinh Thái
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                One Connect hướng tới việc trở thành hạ tầng kết nối số chuẩn quốc gia, liên kết cộng đồng doanh nhân Việt Nam với mạng lưới thương mại quốc tế.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-3 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white font-heading">AI Business Matchmaking</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ứng dụng trí tuệ nhân tạo phân tích tự động nhu cầu mua hàng và năng lực cung ứng của hàng ngàn doanh nghiệp để chủ động đề xuất cuộc gặp giao thương B2B trúng đích.
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-3 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white font-heading">Global Business Pass</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mở rộng liên kết định danh số doanh nhân với các hiệp hội kinh doanh tại Singapore, Nhật Bản, Hàn Quốc và khối ASEAN, tạo điều kiện thuận lợi cho xúc tiến xuất nhập khẩu.
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-3 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white font-heading">Big Data Trade Intelligence</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cung cấp các bản đồ phân tích luồng kết nối liên ngành và chỉ số gắn kết giao thương theo thời gian thực cho các Hiệp hội, Ban Xúc tiến Thương mại và Sở ban ngành.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 7. GIÁ TRỊ CHO XÃ HỘI & ESG XANH (SOCIAL VALUE HIGHLIGHT) */}
      {/* ================================================================= */}
      <section id="social-value" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-200/80 p-8 sm:p-12 shadow-xl space-y-8">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs font-black uppercase tracking-wider">
                MỤC 2 • GIÁ TRỊ CHO XÃ HỘI &amp; CHUYỂN ĐỔI XANH
              </Badge>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black text-slate-950 font-heading tracking-tight leading-snug [text-wrap:balance]">
                Giải Quyết Các Vấn Đề Xã Hội — Đạt Chuẩn ESG Xanh
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Mỗi năm tại Việt Nam, hàng triệu tấm danh thiếp giấy bị vứt bỏ chỉ sau vài ngày, gây lãng phí hàng chục tỷ đồng và tạo gánh nặng rác thải lớn cho môi trường. One Connect mang đến giải pháp chuyển đổi xanh thực chất.
              </p>
            </div>

            <Link href="/social-value" className="shrink-0">
              <Button
                size="lg"
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl h-12 px-7 text-xs sm:text-sm shadow-md cursor-pointer"
              >
                Khám Phá Chi Tiết ESG <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900 font-heading">Trụ Cột E (Môi Trường)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero Paper Waste: Loại bỏ hoàn toàn danh thiếp giấy và tài liệu in ấn dùng 1 lần, cắt giảm trực tiếp phát thải khí CO₂ và bảo tồn tài nguyên rừng.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900 font-heading">Trụ Cột S (Xã Hội)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bình đẳng công nghệ số cho SMEs và Startup, giúp doanh nghiệp vừa và nhỏ sở hữu bộ nhận diện chuẩn quốc tế với chi phí hợp lý. Gắn kết cộng đồng tương trợ bền vững.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900 font-heading">Trụ Cột G (Quản Trị)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Minh bạch danh tính doanh nghiệp, tuân thủ Luật Bảo vệ Dữ liệu Cá nhân PDPL 91 và Nghị định 13 với cơ chế đồng thuận 2 chiều (Two-Way Consent), chấm dứt mua bán số điện thoại rác.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 8. TRẢI NGHIỆM TƯƠNG TÁC THỰC TẾ (SIMULATORS) */}
      {/* ================================================================= */}
      <section id="checkin" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        
        <div className="text-center max-w-4xl mx-auto space-y-2">
          <Badge variant="outline" className="px-3.5 py-1 bg-slate-100 text-slate-800 border-slate-300 text-xs font-extrabold uppercase tracking-wider">
            TRẢI NGHIỆM TRỰC QUAN
          </Badge>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black text-slate-950 font-heading tracking-tight leading-snug [text-wrap:balance]">
            Kiểm Chứng Tính Năng Trực Tiếp Trên Trình Duyệt
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            Bấm chọn từng chức năng để mô phỏng tương tác thực tế của nền tảng One Connect.
          </p>
        </div>

        {/* Feature Simulator Card */}
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden max-w-5xl mx-auto">
          
          <div className="flex border-b border-slate-200 bg-slate-50/80 p-2 gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('checkin')}
              className={`flex-1 min-w-[160px] py-3 px-4 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'checkin'
                  ? 'bg-white text-[#0066FF] shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Zap className="w-4 h-4" /> 1. Check-in NFC (&lt;0.42s)
            </button>
            <button
              onClick={() => setActiveTab('consent')}
              className={`flex-1 min-w-[160px] py-3 px-4 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'consent'
                  ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> 2. Đồng Thuận PDPL 91
            </button>
            <button
              onClick={() => setActiveTab('crm')}
              className={`flex-1 min-w-[160px] py-3 px-4 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'crm'
                  ? 'bg-white text-[#0066FF] shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> 3. Sổ Tay Lead CRM
            </button>
          </div>

          <div className="p-6 sm:p-10">
            {activeTab === 'checkin' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge className="bg-blue-50 text-[#0066FF] border-blue-200 text-xs font-bold">MÔ PHỎNG TRẠM CỔNG</Badge>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-heading">
                    Điểm Danh Đại Biểu Siêu Tốc
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Khi đại biểu bước đến sảnh, chỉ cần chạm nhẹ thẻ NFC hoặc quét mã QR trên điện thoại. Màn hình điều phối sẽ lập tức hiện thông tin, số bàn tiệc và cảnh báo VIP trong <strong>0.38 giây</strong>.
                  </p>
                  
                  <div className="pt-2">
                    <Button
                      onClick={handleSimulateCheckin}
                      disabled={checkinScanning}
                      size="lg"
                      className="gap-2 bg-[#0066FF] hover:bg-blue-700 text-white font-extrabold rounded-2xl h-12 px-6 text-xs sm:text-sm shadow-md cursor-pointer"
                    >
                      {checkinScanning ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Đang nhận diện sóng NFC...
                        </>
                      ) : (
                        <>
                          <Radio className="w-4 h-4 animate-pulse" /> Bấm Để Mô Phỏng Chạm Thẻ NFC
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900 text-white p-6 border border-slate-800 shadow-2xl relative overflow-hidden space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono text-slate-400">TRẠM CHECK-IN 01 • CỔNG CHÍNH</span>
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> ONLINE
                    </span>
                  </div>

                  {checkinSuccess ? (
                    <div className="space-y-3 animate-in fade-in zoom-in duration-300">
                      <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                        <Check className="w-4 h-4" /> Xác thực thành công (380ms)
                      </div>
                      <div className="space-y-1">
                        <div className="text-lg font-black text-white">Ông Johnny Long Hồ</div>
                        <div className="text-xs text-slate-400">Phó Chủ Tịch • Hiệp Hội Doanh Nhân Trẻ</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                        <div className="bg-slate-800/80 p-2.5 rounded-lg">
                          <span className="text-slate-400 block text-[10px]">VỊ TRÍ BÀN:</span>
                          <span className="font-bold text-amber-400 text-sm">Bàn VIP A01</span>
                        </div>
                        <div className="bg-slate-800/80 p-2.5 rounded-lg">
                          <span className="text-slate-400 block text-[10px]">ĐẠI BIỂU THỨ:</span>
                          <span className="font-bold text-white text-sm">#{attendeeCount}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-2 text-slate-400">
                      <Radio className="w-10 h-10 mx-auto text-slate-600 animate-pulse" />
                      <div className="text-xs">Sẵn sàng nhận diện thẻ NFC hoặc quét mã QR...</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'consent' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">CHUẨN LUẬT PDPL 91</Badge>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-heading">
                    Cơ Chế Đồng Thuận 2 Chiều Minh Bạch
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Tuân thủ nghiêm ngặt <strong>Nghị định 13/2023/NĐ-CP</strong> và <strong>Luật Bảo vệ Dữ liệu Cá nhân số 91/2025/QH15</strong>. Dữ liệu chỉ được lưu trữ khi đối tác xác nhận đồng ý chia sẻ.
                  </p>
                  
                  <div className="pt-2">
                    <Button
                      onClick={() => setConsentGranted(!consentGranted)}
                      size="lg"
                      className={`gap-2 font-extrabold rounded-2xl h-12 px-6 text-xs sm:text-sm shadow-md cursor-pointer transition-all ${
                        consentGranted
                          ? 'bg-slate-900 text-white hover:bg-slate-800'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {consentGranted ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      {consentGranted ? 'Thu Hồi Quyền Chia Sẻ' : 'Bấm Xác Nhận Đồng Thuận'}
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-lg space-y-4">
                  <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-3">
                    <span className="font-bold text-slate-900">Yêu Cầu Kết Nối &amp; Nhận Danh Thiếp</span>
                    <Badge className={consentGranted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}>
                      {consentGranted ? 'ĐÃ ĐỒNG THUẬN' : 'CHỜ XÁC THỰC'}
                    </Badge>
                  </div>

                  <div className="text-xs space-y-2 text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Số điện thoại cá nhân:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {consentGranted ? '0912.345.678' : '••••••••••'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email trao đổi công việc:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {consentGranted ? 'ceo@oneconnect.vn' : '••••••••••••••••'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Báo giá &amp; Hồ sơ năng lực:</span>
                      <span className="font-bold text-emerald-600">
                        {consentGranted ? 'Đã cấp quyền truy cập' : 'Bị khóa'}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 italic">
                    {consentGranted
                      ? '✓ Bạn có quyền thu hồi quyền truy cập này bất kỳ lúc nào theo quy định pháp luật.'
                      : 'ℹ Dữ liệu liên hệ được bảo vệ và ẩn cho đến khi có sự cho phép của chủ sở hữu.'}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'crm' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge className="bg-blue-50 text-[#0066FF] border-blue-200 text-xs font-bold">SỔ TAY GIAO THƯƠNG</Badge>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-heading">
                    Ghi Nhớ Bối Cảnh &amp; Phân Loại Khách Hàng
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Sau khi bắt tay và chạm thẻ, ghi chú ngay nhu cầu thực tế của đối tác và phân loại mức độ tiềm năng để đội ngũ kinh doanh chăm sóc kịp thời.
                  </p>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setLeadStatus('WARM')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        leadStatus === 'WARM' ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Lead WARM (Tiềm năng)
                    </button>
                    <button
                      onClick={() => setLeadStatus('HOT')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        leadStatus === 'HOT' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Lead HOT (Cần ký gấp)
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-lg space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900">Ghi Chú Cuộc Gặp Tại Diễn Đàn</span>
                    <Badge className={leadStatus === 'HOT' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}>
                      MỨC ĐỘ: {leadStatus}
                    </Badge>
                  </div>

                  <textarea
                    rows={3}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-medium leading-relaxed"
                  />

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Nhắc lịch hẹn: Sau 24h</span>
                    <span className="text-blue-600 font-bold">Đã lưu vào Sổ tay đối tác</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </section>

      {/* ================================================================= */}
      {/* 8.5. GÓI DỊCH VỤ & GIẢI PHÁP SỐ (SERVICES & PRICING PACKAGES) */}
      {/* ================================================================= */}
      <ServicePackagesSection id="services" className="border-t border-slate-200/60 bg-gradient-to-b from-[#0A1124] to-[#0D162B] text-white rounded-3xl my-8 shadow-xl" />

      {/* ================================================================= */}
      {/* 9. THÔNG TIN THÊM & BÀI VIẾT MỚI NHẤT (NEWS & MEDIA HUB) */}
      {/* ================================================================= */}
      <section id="news" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-10">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <Badge className="px-3.5 py-1 bg-blue-50 text-[#0066FF] border-blue-200 text-xs font-black uppercase tracking-wider">
                MỤC 3 • THÔNG TIN THÊM &amp; TRUYỀN THÔNG
              </Badge>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black text-slate-950 font-heading tracking-tight leading-snug [text-wrap:balance]">
                Cẩm Nang Doanh Nghiệp &amp; Xu Hướng Công Nghệ
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Những bài viết chuyên sâu về chuyển đổi số B2B, cẩm nang MICE và chiến lược ESG xanh.
              </p>
            </div>

            <Link href="/posts" className="shrink-0">
              <Button variant="outline" className="gap-2 border-slate-300 text-slate-800 font-bold text-xs rounded-xl h-10 px-4">
                Xem Tất Cả Bài Viết <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_ARTICLES.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/posts/${item.slug}`}
                className="group rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">
                      {CATEGORY_LABELS[item.category] || item.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>{item.readTime} phút đọc</span>
                    <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Đọc tiếp <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 10. CALL TO ACTION BANNER */}
      {/* ================================================================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center bg-gradient-to-r from-[#0055EE] via-[#0066FF] to-[#0052CC] text-white rounded-3xl p-8 sm:p-14 space-y-5 shadow-2xl shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black tracking-tight font-heading relative z-10 leading-snug [text-wrap:balance]">
            Sẵn Sàng Nâng Tầm Kết Nối Doanh Nghiệp &amp; Sự Kiện Xanh?
          </h2>
          <p className="text-xs sm:text-sm text-blue-50 max-w-xl mx-auto relative z-10 font-medium leading-relaxed">
            Gia nhập mạng lưới One Connect ngay hôm nay để trải nghiệm danh thiếp số thông minh, trạm điểm danh sự kiện không giấy và xây dựng thương hiệu doanh nhân bền vững.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto gap-2 bg-white hover:bg-slate-100 text-[#0055EE] font-black rounded-2xl h-12 px-7 text-sm shadow-md cursor-pointer"
              >
                <Play className="w-4 h-4 fill-[#0055EE]" /> Trải Nghiệm Dự Án Ngay
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto gap-2 border-white/40 bg-blue-700/50 hover:bg-blue-700 text-white font-extrabold rounded-2xl h-12 px-6 text-sm cursor-pointer"
              >
                Đăng Ký Tài Khoản Mới
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 11. GLOBAL FOOTER */}
      {/* ================================================================= */}
      <footer className="border-t border-slate-200/80 bg-white py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col items-center sm:items-start gap-2.5 text-center sm:text-left">
            <Link href="/" title="One Connect Network" className="inline-block">
              <img
                src="/brand_logo_transparent.png?v=20260904_tagline"
                alt="One Connect"
                className="h-7 sm:h-7 w-auto object-contain mx-auto sm:mx-0"
              />
            </Link>
            <span className="font-medium text-slate-600 block">
              © 2026 One Connect Network. Nền tảng Định danh số B2B &amp; ESG Xanh.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-right">
            <div className="flex items-center gap-4 text-[11px] font-semibold">
              <Link href="/social-value" className="hover:text-emerald-600 text-emerald-700 flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5" /> Chuẩn ESG Xanh
              </Link>
              <Link href="/posts" className="hover:text-blue-600">
                Thông Tin Thêm
              </Link>
              <Link href="/login" className="hover:text-blue-600">
                Đăng nhập
              </Link>
              <Link href="/register" className="hover:text-blue-600">
                Đăng ký
              </Link>
            </div>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
              title="Cuộn lên đầu trang"
            >
              <ArrowUp className="w-3.5 h-3.5 text-blue-600 transition-transform group-hover:-translate-y-0.5" />
              <span>Trở lại đầu trang</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Back-To-Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-[#0A1124]/90 hover:bg-black text-white shadow-xl shadow-slate-900/20 border border-slate-700/60 backdrop-blur-md transition-all active:scale-95 cursor-pointer flex items-center justify-center group"
        title="Về đầu trang"
        aria-label="Về đầu trang"
      >
        <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 text-blue-400" />
      </button>

    </div>
  );
}
