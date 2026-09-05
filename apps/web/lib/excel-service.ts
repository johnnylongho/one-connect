import * as XLSX from 'xlsx';
import { PersonIdentity, AccessCard, Connection, Lead, RoleType } from './types';

export interface ParsedMemberRow {
  fullName: string;
  businessName: string;
  title: string;
  phone: string;
  email: string;
  association?: string;
  taxCode?: string;
  role?: RoleType;
  cardType?: 'NFC_EXECUTIVE' | 'NFC_BUSINESS_PRO' | 'NFC_STANDARD';
  address?: string;
  bio?: string;
}

export interface InvalidMemberRow {
  rowNumber: number;
  raw: Record<string, any>;
  errors: string[];
}

export interface ParseExcelResult {
  validRows: ParsedMemberRow[];
  invalidRows: InvalidMemberRow[];
  totalRows: number;
}

/**
 * 1. Tải file Excel mẫu chuẩn hệ thống One Connect
 */
export function downloadMemberTemplate() {
  const wb = XLSX.utils.book_new();

  // Dữ liệu mẫu trang tính 1: Danh sách mẫu
  const sampleData = [
    {
      'Họ và tên *': 'Nguyễn Văn Hùng',
      'Tên doanh nghiệp *': 'Tập đoàn Nha Trang Pearl MICE',
      'Chức vụ': 'Chủ tịch HĐQT & Tổng Giám Đốc',
      'Số điện thoại *': '0905123456',
      'Email *': 'hung.nguyen@nhatrangpearl.vn',
      'Tổ chức / Hiệp hội': 'Hội Doanh Nhân Trẻ Khánh Hòa',
      'Mã số thuế': '4201888999',
      'Vai trò hệ thống': 'MEMBER',
      'Loại thẻ NFC': 'NFC_EXECUTIVE',
      'Địa chỉ': 'TP. Nha Trang, Khánh Hòa',
      'Giới thiệu ngắn (Bio)': 'Chuyên tổ chức hội nghị MICE, du lịch sự kiện cao cấp và nghỉ dưỡng 5 sao.',
    },
    {
      'Họ và tên *': 'Trần Thị Thu Hà',
      'Tên doanh nghiệp *': 'Vina Capital Invest Corp',
      'Chức vụ': 'Giám đốc Đầu tư B2B',
      'Số điện thoại *': '0912345678',
      'Email *': 'thuha.tran@vinacapital.vn',
      'Tổ chức / Hiệp hội': 'Hội Doanh Nhân Trẻ Khánh Hòa',
      'Mã số thuế': '0102345678',
      'Vai trò hệ thống': 'MEMBER',
      'Loại thẻ NFC': 'NFC_BUSINESS_PRO',
      'Địa chỉ': 'Hà Nội / TP.HCM',
      'Giới thiệu ngắn (Bio)': 'Quỹ đầu tư công nghệ, cung cấp vốn tăng trưởng và giải pháp M&A cho doanh nghiệp vừa và nhỏ.',
    },
    {
      'Họ và tên *': 'Lê Hoàng Nam',
      'Tên doanh nghiệp *': 'InnovateX Global Solutions',
      'Chức vụ': 'CEO & Sáng lập',
      'Số điện thoại *': '0934567890',
      'Email *': 'nam.le@innovatex.io',
      'Tổ chức / Hiệp hội': 'CLB Doanh Nhân Công Nghệ YBA',
      'Mã số thuế': '0312456789',
      'Vai trò hệ thống': 'OPERATOR',
      'Loại thẻ NFC': 'NFC_EXECUTIVE',
      'Địa chỉ': 'Quận 1, TP. Hồ Chí Minh',
      'Giới thiệu ngắn (Bio)': 'Chuyển đổi số, hạ tầng IoT & định danh số thông minh.',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);

  // Thiết lập độ rộng cột tự động
  ws['!cols'] = [
    { wch: 22 }, // Họ và tên
    { wch: 32 }, // Tên doanh nghiệp
    { wch: 30 }, // Chức vụ
    { wch: 16 }, // Số điện thoại
    { wch: 28 }, // Email
    { wch: 28 }, // Tổ chức / Hiệp hội
    { wch: 15 }, // Mã số thuế
    { wch: 18 }, // Vai trò
    { wch: 18 }, // Loại thẻ NFC
    { wch: 25 }, // Địa chỉ
    { wch: 45 }, // Bio
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Danh_Sach_Hoi_Vien');

  // Trang tính 2: Hướng dẫn sử dụng
  const guideData = [
    {
      'Cột thông tin': 'Họ và tên *',
      'Bắt buộc': 'CÓ',
      'Mô tả & Định dạng': 'Họ và tên đầy đủ của đại biểu/hội viên. Hệ thống tự động tạo username không dấu tương ứng.',
    },
    {
      'Cột thông tin': 'Tên doanh nghiệp *',
      'Bắt buộc': 'CÓ',
      'Mô tả & Định dạng': 'Tên pháp nhân công ty hoặc thương hiệu kinh doanh chính.',
    },
    {
      'Cột thông tin': 'Chức vụ',
      'Bắt buộc': 'Không',
      'Mô tả & Định dạng': 'Ví dụ: Giám Đốc Điều Hành, Chủ tịch HĐQT, Phó Tổng Giám Đốc...',
    },
    {
      'Cột thông tin': 'Số điện thoại *',
      'Bắt buộc': 'CÓ',
      'Mô tả & Định dạng': 'Số điện thoại liên hệ từ 9 đến 11 số. Dùng làm số hotline trên danh thiếp số.',
    },
    {
      'Cột thông tin': 'Email *',
      'Bắt buộc': 'CÓ',
      'Mô tả & Định dạng': 'Địa chỉ email duy nhất, dùng để đăng nhập và nhận thông tin tài khoản One Connect.',
    },
    {
      'Cột thông tin': 'Tổ chức / Hiệp hội',
      'Bắt buộc': 'Không',
      'Mô tả & Định dạng': 'Tên hiệp hội, hội doanh nhân hoặc chi hội sinh hoạt.',
    },
    {
      'Cột thông tin': 'Vai trò hệ thống',
      'Bắt buộc': 'Không',
      'Mô tả & Định dạng': 'Nhập một trong các giá trị: MEMBER (mặc định), ORG_ADMIN, OPERATOR.',
    },
    {
      'Cột thông tin': 'Loại thẻ NFC',
      'Bắt buộc': 'Không',
      'Mô tả & Định dạng': 'NFC_EXECUTIVE (Thẻ Lãnh Đạo VIP), NFC_BUSINESS_PRO (Doanh Nhân Pro), NFC_STANDARD (Tiêu chuẩn).',
    },
  ];

  const guideWs = XLSX.utils.json_to_sheet(guideData);
  guideWs['!cols'] = [{ wch: 22 }, { wch: 12 }, { wch: 65 }];
  XLSX.utils.book_append_sheet(wb, guideWs, 'Huong_Dan_Nhap_Lieu');

  // Xuất file
  XLSX.writeFile(wb, 'OneConnect_Mau_DanhSach_HoiVien.xlsx');
}

/**
 * 2. Đọc và kiểm tra tính hợp lệ file Excel hội viên được tải lên
 */
export async function parseMembersExcel(file: File): Promise<ParseExcelResult> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });

  // Chọn sheet đầu tiên
  const firstSheetName = workbook.SheetNames[0] || 'Sheet1';
  const worksheet = workbook.Sheets[firstSheetName];

  if (!worksheet) {
    return { validRows: [], invalidRows: [], totalRows: 0 };
  }

  // Chuyển sang mảng JSON các dòng
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  const validRows: ParsedMemberRow[] = [];
  const invalidRows: InvalidMemberRow[] = [];

  const seenEmails = new Set<string>();
  const seenPhones = new Set<string>();

  rawRows.forEach((row, idx) => {
    const rowNumber = idx + 2; // Dòng 1 là Header
    const errors: string[] = [];

    // Chuẩn hóa tên trường (hỗ trợ nhiều biến thể header)
    const getVal = (keys: string[]): string => {
      for (const k of keys) {
        if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
          return String(row[k]).trim();
        }
      }
      return '';
    };

    const fullName = getVal(['Họ và tên *', 'Họ và tên', 'ho_va_ten', 'fullName', 'Full Name', 'Tên thành viên']);
    const businessName = getVal(['Tên doanh nghiệp *', 'Tên doanh nghiệp', 'ten_doanh_nghiep', 'businessName', 'Company', 'Công ty']);
    const title = getVal(['Chức vụ', 'chuc_vu', 'title', 'Position']) || 'Hội Viên Doanh Nghiệp';
    const rawPhone = getVal(['Số điện thoại *', 'Số điện thoại', 'so_dien_thoai', 'phone', 'Phone', 'SĐT']);
    const rawEmail = getVal(['Email *', 'Email', 'email', 'Thư điện tử']);
    const association = getVal(['Tổ chức / Hiệp hội', 'to_chuc_hiep_hoi', 'association', 'Hiệp hội']) || 'Hội Viên One Connect Network';
    const taxCode = getVal(['Mã số thuế', 'ma_so_thue', 'taxCode']);
    const rawRole = getVal(['Vai trò hệ thống', 'vai_tro', 'role', 'Role']).toUpperCase();
    const rawCardType = getVal(['Loại thẻ NFC', 'cardType', 'Card Type']).toUpperCase();
    const address = getVal(['Địa chỉ', 'dia_chi', 'address', 'Address']) || 'Việt Nam';
    const bio = getVal(['Giới thiệu ngắn (Bio)', 'bio', 'Bio', 'Giới thiệu']);

    // 1. Kiểm tra Họ tên
    if (!fullName || fullName.length < 2) {
      errors.push('Họ và tên không được để trống (tối thiểu 2 ký tự).');
    }

    // 2. Kiểm tra Tên doanh nghiệp
    if (!businessName) {
      errors.push('Tên doanh nghiệp không được để trống.');
    }

    // 3. Kiểm tra Email
    const emailClean = rawEmail.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailClean) {
      errors.push('Email không được để trống.');
    } else if (!emailRegex.test(emailClean)) {
      errors.push(`Email "${emailClean}" không đúng định dạng.`);
    } else if (seenEmails.has(emailClean)) {
      errors.push(`Email "${emailClean}" bị trùng lặp ngay trong file Excel này.`);
    } else {
      seenEmails.add(emailClean);
    }

    // 4. Kiểm tra Số điện thoại
    const phoneClean = rawPhone.replace(/[^0-9+]/g, '');
    if (!phoneClean) {
      errors.push('Số điện thoại không được để trống.');
    } else if (phoneClean.length < 9 || phoneClean.length > 12) {
      errors.push(`Số điện thoại "${rawPhone}" không hợp lệ (cần từ 9 đến 11 số).`);
    } else if (seenPhones.has(phoneClean)) {
      errors.push(`Số điện thoại "${phoneClean}" bị trùng lặp ngay trong file Excel.`);
    } else {
      seenPhones.add(phoneClean);
    }

    // 5. Chuẩn hóa Vai trò
    let role: RoleType = 'MEMBER';
    if (rawRole.includes('ADMIN')) role = 'ORG_ADMIN';
    else if (rawRole.includes('OPERATOR') || rawRole.includes('ĐIỀU HÀNH')) role = 'EVENT_OPERATOR';

    // 6. Chuẩn hóa Loại thẻ NFC
    let cardType: 'NFC_EXECUTIVE' | 'NFC_BUSINESS_PRO' | 'NFC_STANDARD' = 'NFC_EXECUTIVE';
    if (rawCardType.includes('PRO')) cardType = 'NFC_BUSINESS_PRO';
    else if (rawCardType.includes('STANDARD') || rawCardType.includes('TIÊU CHUẨN')) cardType = 'NFC_STANDARD';

    if (errors.length > 0) {
      invalidRows.push({
        rowNumber,
        raw: row,
        errors,
      });
    } else {
      validRows.push({
        fullName,
        businessName,
        title,
        phone: phoneClean,
        email: emailClean,
        association,
        taxCode: taxCode || '4201888999',
        role,
        cardType,
        address,
        bio: bio || `Đại diện ${businessName} - Thành viên One Connect Network.`,
      });
    }
  });

  return {
    validRows,
    invalidRows,
    totalRows: rawRows.length,
  };
}

/**
 * 3. Xuất toàn bộ danh sách Hội viên sang file Excel (.xlsx)
 */
export function exportMembersToExcel(members: PersonIdentity[], cards: AccessCard[] = []) {
  const exportData = members.map((m, idx) => {
    const card = cards.find(c => c.personIdentityId === m.id || c.personIdentityId === m.userId);
    const primaryBiz = m.businesses && m.businesses.length > 0 ? m.businesses[0] : null;

    return {
      'STT': idx + 1,
      'Mã ID Hệ Thống': m.id,
      'Tên Đăng Nhập (Slug)': m.username,
      'Họ và Tên': m.fullName,
      'Chức Vụ': m.title || primaryBiz?.position || 'Hội Viên Doanh Nhân',
      'Tên Doanh Nghiệp': primaryBiz?.businessName || 'Doanh Nghiệp Hội Viên',
      'Số Điện Thoại': m.phone || '',
      'Email': m.email || '',
      'Tổ Chức / Hiệp Hội': m.association || 'Hội Viên One Connect Network',
      'Mã Số Thuế': m.taxCode || primaryBiz?.taxCode || '',
      'Địa Chỉ': m.address || primaryBiz?.address || 'Việt Nam',
      'Phân Quyền RBAC': m.role || 'MEMBER',
      'Trạng Thái Tài Khoản': m.status === 'INACTIVE' ? 'Đã Tạm Khóa' : 'Đang Hoạt Động',
      'Mã Phôi Thẻ NFC': card?.cardUid || 'Chưa cấp phôi',
      'Loại Thẻ NFC': card?.cardType || 'NFC_EXECUTIVE',
      'Link Danh Thiếp Số': `https://oneconnect.id.vn/p/${m.username}`,
      'Ngày Khởi Tạo': m.createdAt ? new Date(m.createdAt).toLocaleDateString('vi-VN') : '',
    };
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);

  ws['!cols'] = [
    { wch: 6 },  // STT
    { wch: 38 }, // Mã ID
    { wch: 20 }, // Username
    { wch: 24 }, // Họ tên
    { wch: 28 }, // Chức vụ
    { wch: 35 }, // Doanh nghiệp
    { wch: 15 }, // SĐT
    { wch: 28 }, // Email
    { wch: 30 }, // Hiệp hội
    { wch: 15 }, // MST
    { wch: 25 }, // Địa chỉ
    { wch: 16 }, // RBAC
    { wch: 20 }, // Trạng thái
    { wch: 22 }, // Mã thẻ NFC
    { wch: 18 }, // Loại thẻ NFC
    { wch: 36 }, // Link
    { wch: 15 }, // Ngày tạo
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Danh_Sach_Hoi_Vien');

  const todayStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `OneConnect_DanhSach_HoiVien_${todayStr}.xlsx`);
}

/**
 * 4. Xuất danh sách Leads & Kết nối B2B (cho CSKH / Sales / Marketing)
 */
export function exportLeadsToExcel(connections: Connection[], leads: Lead[] = []) {
  const exportData = connections.map((c, idx) => {
    const lead = leads.find(l => l.connectionId === c.id);
    const partner = c.partner;
    const primaryBiz = partner?.businesses && partner.businesses.length > 0 ? partner.businesses[0] : null;

    let leadTier = 'MỚI (NEW)';
    if (lead?.priority === 'HIGH' || lead?.status === 'HOT') leadTier = 'NÓNG (HOT LEAD)';
    else if (lead?.priority === 'MEDIUM' || lead?.status === 'WARM') leadTier = 'ẤM (WARM LEAD)';

    const source = lead?.source || (c.partner?.bio?.includes('Chạm thẻ NFC') ? 'Chạm Thẻ NFC (<1s)' : 'Quét Mã QR');

    return {
      'STT': idx + 1,
      'Mã Kết Nối': c.id,
      'Họ và Tên Khách Hàng': partner?.fullName || 'Khách vãng lai',
      'Chức Vụ': partner?.title || primaryBiz?.position || 'Đại diện Doanh Nghiệp',
      'Công Ty / Tổ Chức': primaryBiz?.businessName || partner?.title || 'Chưa cập nhật',
      'Số Điện Thoại': partner?.phone || '',
      'Email': partner?.email || '',
      'Phân Hạng Lead (CSKH)': leadTier,
      'Nguồn Kết Nối': source,
      'Trạng Thái Kết Nối': c.status === 'CONNECTED' ? 'Đã Đồng Ý Kết Nối' : (c.status === 'PENDING' ? 'Chờ Phản Hồi' : 'Tạm Chặn'),
      'Sự Kiện Kết Nối': c.contextEventName || 'Diễn Đàn Doanh Nghiệp One Connect 2026',
      'Số Ghi Chú Đã Lưu': c.notesCount || 0,
      'Thời Điểm Kết Nối': c.connectedAt ? new Date(c.connectedAt).toLocaleString('vi-VN') : (c.createdAt ? new Date(c.createdAt).toLocaleString('vi-VN') : ''),
      'Bảo Mật Nghị Định 13/PDPL': 'Đã Xác Thực Đồng Thuận Chia Sẻ',
      'Link Danh Thiếp Đối Tác': partner?.username && partner.username !== 'guest' ? `https://oneconnect.id.vn/p/${partner.username}` : 'Khách chạm trực tiếp',
    };
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);

  ws['!cols'] = [
    { wch: 6 },  // STT
    { wch: 22 }, // Mã kết nối
    { wch: 25 }, // Tên KH
    { wch: 28 }, // Chức vụ
    { wch: 35 }, // Công ty
    { wch: 15 }, // SĐT
    { wch: 28 }, // Email
    { wch: 22 }, // Phân hạng Lead
    { wch: 22 }, // Nguồn kết nối
    { wch: 22 }, // Trạng thái
    { wch: 38 }, // Sự kiện
    { wch: 18 }, // Số ghi chú
    { wch: 22 }, // Thời điểm
    { wch: 30 }, // PDPL
    { wch: 35 }, // Link danh thiếp
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Leads_CSKH_KetNoi');

  const todayStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `OneConnect_Leads_CSKH_${todayStr}.xlsx`);
}

/**
 * 4. Xuất Báo Cáo Đo Lường Nhu Cầu Thị Trường & Danh Sách Leads Đăng Ký Gói Dịch Vụ
 */
export function exportMarketLeadsToExcel(leads: Array<{
  id: string;
  packageType: string;
  packageName: string;
  fullName: string;
  phone: string;
  email?: string;
  companyName?: string;
  organizationType?: string;
  notes?: string;
  status: string;
  createdAt: string;
}>) {
  const STATUS_LABELS: Record<string, string> = {
    NEW: 'Mới nhận (Chưa liên hệ)',
    CONTACTED: 'Đã liên hệ sơ bộ',
    CONSULTING: 'Đang tư vấn & Báo giá',
    WON: 'Đã chốt hợp đồng thành công',
    LOST: 'Không có nhu cầu / Hủy',
  };

  const exportData = leads.map((lead, idx) => ({
    'STT': idx + 1,
    'Mã Lead': lead.id,
    'Gói Dịch Vụ Quan Tâm': lead.packageName,
    'Phân Loại Gói': lead.packageType,
    'Họ và Tên Khách Hàng': lead.fullName,
    'Số Điện Thoại': lead.phone,
    'Email': lead.email || '',
    'Tên Doanh Nghiệp / Tổ Chức': lead.companyName || '',
    'Loại Hình Tổ Chức': lead.organizationType || '',
    'Nhu Cầu Cụ Thể / Quy Mô': lead.notes || '',
    'Trạng Thái Xử Lý': STATUS_LABELS[lead.status] || lead.status,
    'Thời Điểm Đăng Ký': lead.createdAt ? new Date(lead.createdAt).toLocaleString('vi-VN') : '',
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);

  ws['!cols'] = [
    { wch: 6 },  // STT
    { wch: 22 }, // Mã Lead
    { wch: 32 }, // Gói Dịch Vụ
    { wch: 20 }, // Phân Loại Gói
    { wch: 25 }, // Tên KH
    { wch: 16 }, // SĐT
    { wch: 28 }, // Email
    { wch: 35 }, // Công ty
    { wch: 25 }, // Loại hình
    { wch: 45 }, // Nhu cầu
    { wch: 26 }, // Trạng thái
    { wch: 22 }, // Thời điểm
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'BaoCao_ThiTruong_Leads');

  const todayStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `OneConnect_BaoCao_NhuCau_ThiTruong_${todayStr}.xlsx`);
}

