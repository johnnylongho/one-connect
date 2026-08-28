const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  ShadingType,
} = require('docx');

const outputDir = path.join(__dirname, '..', '..', 'HO_SO_CUOC_THI_KHOI_NGHIEP_DMST_2026');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const primaryColor = '0052CC'; // Tech Blue
const secondaryColor = '0066FF';
const textColor = '1E293B';
const lightBg = 'F1F5F9';
const borderColor = 'CBD5E1';

const tableBorders = {
  top: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
  left: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
  right: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
};

function createHeaderBox(title, subTitle) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
          bold: true,
          size: 24,
          color: '0F172A',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: 'Độc lập – Tự do – Hạnh phúc',
          bold: true,
          size: 22,
          color: '334155',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: 'CUỘC THI KHỞI NGHIỆP ĐỔI MỚI SÁNG TẠO TỈNH KHÁNH HÒA – NĂM 2026',
          bold: true,
          size: 22,
          color: primaryColor,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 28,
          color: primaryColor,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: subTitle,
          italics: true,
          size: 20,
          color: '64748B',
        }),
      ],
    }),
  ];
}

function createStyledTable(rowsData) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: rowsData.map((row, rIdx) => {
      const isHeader = rIdx === 0;
      return new TableRow({
        children: row.map((cellText, cIdx) => {
          return new TableCell({
            shading: {
              type: ShadingType.CLEAR,
              fill: isHeader ? lightBg : (cIdx === 0 ? 'F8FAFC' : 'FFFFFF'),
            },
            margins: { top: 120, bottom: 120, left: 150, right: 150 },
            children: [
              new Paragraph({
                spacing: { line: 260 },
                children: [
                  new TextRun({
                    text: cellText,
                    bold: isHeader || cIdx === 0,
                    size: 20,
                    color: isHeader ? primaryColor : textColor,
                  }),
                ],
              }),
            ],
          });
        }),
      });
    }),
  });
}

// -------------------------------------------------------------
// DOC 1: ĐƠN ĐĂNG KÝ THAM GIA CUỘC THI
// -------------------------------------------------------------
async function generateDoc1() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Arial', size: 22, color: textColor },
          paragraph: { spacing: { line: 280, after: 120 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: [
          ...createHeaderBox(
            'ĐƠN ĐĂNG KÝ THAM DỰ CUỘC THI',
            'KHỞI NGHIỆP ĐỔI MỚI SÁNG TẠO TỈNH KHÁNH HÒA 2026'
          ),
          new Paragraph({
            spacing: { before: 120, after: 120 },
            children: [
              new TextRun({
                text: 'Kính gửi: ',
                bold: true,
                color: primaryColor,
              }),
              new TextRun({
                text: 'Ban Tổ chức Cuộc thi Khởi nghiệp Đổi mới Sáng tạo tỉnh Khánh Hòa năm 2026\nSở Khoa học và Công nghệ tỉnh Khánh Hòa',
                bold: true,
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'I. THÔNG TIN CHUNG VỀ TÁC GIẢ / NHÓM TÁC GIẢ',
                bold: true,
                size: 24,
                color: primaryColor,
              }),
            ],
          }),

          createStyledTable([
            ['Hạng mục thông tin', 'Chi tiết'],
            ['Tên Trưởng nhóm / Đại diện', 'HỒ HOÀNG LONG'],
            ['Ngày sinh / CCCD', '17/05/1995 — 056095014168'],
            ['Chức vụ hiện tại', 'Quản lý Dự án & Phát triển Sản phẩm'],
            ['Đơn vị công tác', 'Công ty Cổ phần Tập đoàn Công nghệ số A+ (A PLUSVN)'],
            ['Địa chỉ liên hệ', 'Tầng 8, Tòa nhà ASIA, 25 Lê Lợi, Nha Trang, Tỉnh Khánh Hòa'],
            ['Số điện thoại di động', '0794.677.369'],
            ['Email liên lạc', 'contact.johnnylongho@gmail.com'],
            ['Thành viên nhóm dự án', '1. Hồ Hoàng Long (Quản lý dự án và phát triển sản phẩm)\n2. Nguyễn Nhật Thanh (Trưởng phòng phát triển AI)\n3. Trần Tuấn Kiệt (Định hướng kinh doanh)'],
          ]),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 100 },
            children: [
              new TextRun({
                text: 'II. THÔNG TIN VỀ DỰ ÁN DỰ THI',
                bold: true,
                size: 24,
                color: primaryColor,
              }),
            ],
          }),

          createStyledTable([
            ['Thông tin dự án', 'Nội dung đăng ký'],
            ['Tên dự án thương mại', 'ONE CONNECT (One Connect Network)'],
            ['Tên đầy đủ đề tài', 'Nền Tảng Hạ Tầng Định Danh Số (Business Identity) & Quản Trị Quan Hệ Giao Thương B2B Tích Hợp Thẻ Chạm NFC Không Ma Sát Tuân Thủ Luật Dữ Liệu Cá Nhân 91/2025/QH15 Cho Hệ Sinh Thái Doanh Nghiệp Khánh Hòa'],
            ['Lĩnh vực dự thi', 'Chuyển đổi số, Công nghệ Thông tin, Đổi mới sáng tạo trong Du lịch MICE & Dịch vụ B2B'],
            ['Bảng dự thi', 'BẢNG DỰ ÁN KHỞI NGHIỆP ĐMST (Đã có sản phẩm MVP v1.0 hoạt động thực tế)'],
            ['Website Live Demo', 'https://one-connect-network.vercel.app/'],
            ['Mã nguồn dự án', 'https://github.com/johnnylongho/one-connect'],
            ['Tình trạng sở hữu trí tuệ', 'Chưa đăng ký (Đang hoàn thiện hồ sơ đăng ký tại Cục SHTT)'],
          ]),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 100 },
            children: [
              new TextRun({
                text: 'III. TÓM TẮT GIÁ TRỊ ĐỔI MỚI SÁNG TẠO CỐT LÕI (300 TỪ)',
                bold: true,
                size: 24,
                color: primaryColor,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'ONE CONNECT là nền tảng hạ tầng SaaS đột phá giải quyết triệt để 3 bài toán lớn của các sự kiện MICE, Diễn đàn kinh tế và Hiệp hội doanh nghiệp tại tỉnh Khánh Hòa:\n' +
                '1. Loại bỏ 100% lãng phí in ấn danh thiếp giấy và rác thải sự kiện qua công nghệ Thẻ kim loại 3D NFC 1-chạm (tốc độ dưới 0.42s) và Dynamic QR không cần cài đặt App (Mobile-First PWA).\n' +
                '2. Trạm Check-in siêu tốc xử lý dưới 1s/đại biểu, vận hành mượt mà cả khi mất kết nối mạng (Offline Queueing & Sync), giảm tải 90% nhân sự đón tiếp tại cửa.\n' +
                '3. Tiên phong giải quyết bài toán pháp lý theo Luật Bảo vệ Dữ liệu Cá nhân số 91/2025/QH15 qua cơ chế Đồng thuận 2 chiều (2-Way Explicit Consent), kết hợp "Sổ tay quan hệ" (Private Notes & Lead Qualification) giúp doanh nhân chuyển hóa điểm chạm thoáng qua thành hợp đồng giao thương thực tế.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 100 },
            children: [
              new TextRun({
                text: 'IV. CAM KẾT CỦA TÁC GIẢ / ĐẠI DIỆN DỰ ÁN',
                bold: true,
                size: 24,
                color: primaryColor,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Tôi xin cam kết:\n' +
                '1. Dự án do chúng tôi tự nghiên cứu, thiết kế và phát triển, không sao chép hoặc vi phạm quyền sở hữu trí tuệ của bất kỳ tổ chức, cá nhân nào.\n' +
                '2. Mọi thông tin cung cấp trong hồ sơ là hoàn toàn trung thực và chính xác.\n' +
                '3. Tuân thủ nghiêm túc Điều lệ cuộc thi và sẵn sàng phối hợp cùng Ban Tổ chức, Sở KH&CN tỉnh Khánh Hòa trong quá trình ươm tạo, trình bày và triển khai thí điểm thực tế.',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 300, after: 60 },
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: 'Khánh Hòa, ngày 28 tháng 08 năm 2026\n',
                italics: true,
              }),
              new TextRun({
                text: 'ĐẠI DIỆN NHÓM TÁC GIẢ / DỰ ÁN\n',
                bold: true,
              }),
              new TextRun({
                text: '(Ký, ghi rõ họ tên)\n\n\n\n',
                italics: true,
                size: 18,
              }),
              new TextRun({
                text: 'HỒ HOÀNG LONG',
                bold: true,
                size: 22,
                color: primaryColor,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(outputDir, '01_DON_DANG_KY_CUOC_THI_KHOI_NGHIEP_DMST_2026.docx'), buffer);
}

// -------------------------------------------------------------
// DOC 2: BẢN THUYẾT MINH DỰ ÁN TOÀN DIỆN
// -------------------------------------------------------------
async function generateDoc2() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Arial', size: 22, color: textColor },
          paragraph: { spacing: { line: 280, after: 120 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: [
          ...createHeaderBox(
            'BẢN THUYẾT MINH DỰ ÁN KHỞI NGHIỆP ĐỔI MỚI SÁNG TẠO',
            'DỰ THI CUỘC THI KHỞI NGHIỆP ĐỔI MỚI SÁNG TẠO TỈNH KHÁNH HÒA 2026'
          ),

          createStyledTable([
            ['Hạng mục', 'Thông tin'],
            ['Tên đề tài', 'Nền Tảng Hạ Tầng Định Danh Số (Business Identity) & Quản Trị Quan Hệ Giao Thương B2B Tích Hợp Thẻ Chạm NFC Không Ma Sát Tuân Thủ Luật Dữ Liệu Cá Nhân 91/2025/QH15 Cho Hệ Sinh Thái Doanh Nghiệp Khánh Hòa'],
            ['Lĩnh vực', 'Chuyển đổi số, Công nghệ Thông tin, ĐMST Du lịch MICE & Dịch vụ B2B'],
            ['Bảng dự thi', 'BẢNG DỰ ÁN KHỞI NGHIỆP ĐMST (Đã có sản phẩm MVP v1.0 hoạt động thực tế)'],
            ['Chủ nhiệm dự án', 'HỒ HOÀNG LONG — Quản lý Dự án & Phát triển Sản phẩm'],
            ['Đơn vị công tác', 'Công ty Cổ phần Tập đoàn Công nghệ số A+ (A PLUSVN)'],
            ['Địa chỉ liên hệ', 'Tầng 8, Tòa nhà ASIA, 25 Lê Lợi, Nha Trang, Tỉnh Khánh Hòa'],
            ['Hotline & Email', '0794.677.369 / contact.johnnylongho@gmail.com'],
            ['Thành viên nhóm dự án', '1. Hồ Hoàng Long (Quản lý dự án và phát triển sản phẩm)\n2. Nguyễn Nhật Thanh (Trưởng phòng phát triển AI)\n3. Trần Tuấn Kiệt (Định hướng kinh doanh)'],
            ['Trạng thái thực tế', 'Đã hoàn thành 100% bản MVP v1.0 (Live tại https://one-connect-network.vercel.app/)'],
            ['Tình trạng sở hữu trí tuệ', 'Chưa đăng ký (Đang hoàn thiện hồ sơ đăng ký tại Cục SHTT)'],
          ]),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 100 },
            children: [new TextRun({ text: '1. TÍNH CẤP THIẾT & BÀI TOÁN THỰC TIỄN TẠI TỈNH KHÁNH HÒA', bold: true, size: 24, color: primaryColor })],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Khánh Hòa đang vươn mình trở thành đô thị trực thuộc Trung ương, trung tâm kinh tế biển và trung tâm Du lịch MICE (Hội nghị, Triển lãm, Diễn đàn kinh tế quốc tế) hàng đầu khu vực Nam Trung Bộ theo tinh thần Nghị quyết 09-NQ/TW của Bộ Chính trị.\n\n' +
                'Tuy nhiên, quá trình tổ chức các diễn đàn kinh tế, sự kiện xúc tiến thương mại và sinh hoạt của các Hiệp hội Doanh nghiệp hiện nay đang đối mặt với 3 điểm nghẽn nghiêm trọng:\n' +
                '• Lãng phí in ấn & Rác thải sự kiện: Hàng trăm ngàn danh thiếp giấy và ấn phẩm dùng một lần bị vứt bỏ sau mỗi kỳ hội thảo, đi ngược lại tiêu chuẩn Xanh (ESG / Net-Zero MICE) của tỉnh.\n' +
                '• Đứt gãy bối cảnh quan hệ sau sự kiện (Post-Event Gap): 92% đại biểu sau khi nhận danh thiếp giấy không nhớ bối cảnh cuộc gặp, nhu cầu Cung - Cầu cụ thể là gì, khiến cơ hội hợp tác bị triệt tiêu.\n' +
                '• Thách thức Pháp lý Quyền riêng tư: Luật Bảo vệ Dữ liệu Cá nhân số 91/2025/QH15 và Nghị định 13/2023/NĐ-CP bắt buộc mọi việc thu thập và chia sẻ dữ liệu liên lạc phải có cơ chế Đồng thuận rõ ràng (Explicit Consent), điều mà phương thức trao đổi danh thiếp truyền thống không thể đáp ứng.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 100 },
            children: [new TextRun({ text: '2. MỤC TIÊU DỰ ÁN', bold: true, size: 24, color: primaryColor })],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: '• Mục tiêu tổng quát: Xây dựng nền tảng hạ tầng SaaS định danh số doanh nhân, quản trị hội viên và số hóa điểm danh sự kiện không ma sát (Zero Friction), bảo vệ dữ liệu cá nhân tuyệt đối.\n' +
                '• Mục tiêu cụ thể:\n' +
                '  - Số hóa 100% danh thiếp qua Thẻ 3D NFC kim loại cao cấp và Dynamic QR.\n' +
                '  - Tốc độ trạm Check-in sự kiện đạt dưới 1.0 giây/đại biểu (đo thực tế 0.42s).\n' +
                '  - Triển khai thí điểm (Pilot) thành công cho 01 Hiệp hội/Sự kiện 150-300 đại biểu tại Nha Trang trong Q4/2026.\n' +
                '  - Tiết kiệm 85% chi phí in ấn và vật tư thẻ giấy cho các sự kiện MICE của tỉnh.\n' +
                '  - Đạt tỷ lệ trên 35% đại biểu tạo ít nhất 01 kết nối có ghi chú (Private Note) sau sự kiện.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 100 },
            children: [new TextRun({ text: '3. GIẢI PHÁP ĐỔI MỚI SÁNG TẠO & HẠ TẦNG CÔNG NGHỆ', bold: true, size: 24, color: primaryColor })],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'ONE CONNECT tích hợp 4 cấu phần công nghệ đột phá:\n' +
                '1. Công nghệ Chạm 1-Chạm NFC Siêu Tốc (Sub-second Tap 0.42s): Tương thích 100% thiết bị iOS và Android mà người nhận không cần cài đặt App.\n' +
                '2. Cơ chế Bảo toàn Dữ liệu Thẻ (Card Replacement Continuity): Tách biệt mã UID chip NFC vật lý khỏi mã định danh doanh nhân, giúp đổi/cấp lại phôi thẻ vật lý mà không làm mất lịch sử mạng lưới quan hệ.\n' +
                '3. Tiên phong Bảo mật 2-Way Consent (Luật PDPL 91/2025/QH15): Tự động che mờ thông tin liên lạc nhạy cảm và chỉ hiển thị khi cả 2 bên xác nhận đồng thuận kết nối.\n' +
                '4. Bộ nhớ quan hệ (Relationship Memory): Cho phép ghi chú riêng tư (Private Notes) và phân loại Lead (WARM/HOT/CONVERTED) ngay tại thời điểm gặp gỡ.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 100 },
            children: [new TextRun({ text: '4. MÔ HÌNH KINH DOANH & KHẢ NĂNG THƯƠNG MẠI HÓA', bold: true, size: 24, color: primaryColor })],
          }),

          createStyledTable([
            ['Dòng Doanh Thu', 'Mô Tả & Đơn Giá', 'Biên Lợi Nhuận'],
            ['1. Bán Phôi Thẻ NFC Kim Loại', 'Khắc laser tên, logo doanh nghiệp: 250,000 – 600,000 VNĐ / thẻ', '~60% Gross Margin'],
            ['2. Thuê Bao SaaS Quản Trị Hiệp Hội', 'Quản trị hội viên, phân quyền Ban Chấp Hành: 12,000,000 – 36,000,000 VNĐ / năm', '~80% Gross Margin'],
            ['3. Gói Trạm Check-in Sự Kiện MICE', 'Phần mềm check-in siêu tốc + Thiết bị Terminal: 5,000,000 – 25,000,000 VNĐ / sự kiện', '~75% Gross Margin'],
            ['4. AI B2B Matchmaking & Xếp Bàn', 'Thuật toán ghép đôi Cung - Cầu tự động theo ngành nghề: Theo gói sự kiện', '~85% Gross Margin'],
          ]),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 100 },
            children: [new TextRun({ text: '5. KẾ HOẠCH TRIỂN KHAI THỰC TẾ (2026 - 2028)', bold: true, size: 24, color: primaryColor })],
          }),

          createStyledTable([
            ['Giai đoạn', 'Thời gian', 'Nội dung thực hiện & Cột mốc'],
            ['Giai đoạn 1: MVP & Nộp Hồ Sơ', 'Tháng 08/2026', 'Hoàn thiện bản Live Next.js 16; nộp hồ sơ Cuộc thi ĐMST Khánh Hòa 2026.'],
            ['Giai đoạn 2: Pilot 1 Sự Kiện', 'Q4/2026', 'Triển khai trạm Check-in và Thẻ NFC cho 150-300 đại biểu tại Nha Trang.'],
            ['Giai đoạn 3: Mở Rộng Khánh Hòa', 'Năm 2027', 'Ký hợp đồng 10 Hiệp hội và 30 Sự kiện MICE tại TP. Nha Trang & Khánh Hòa.'],
            ['Giai đoạn 4: Vươn Toàn Quốc', 'Năm 2028', 'Mở rộng ra Đà Nẵng, TP.HCM, Hà Nội; đạt 50,000 doanh nhân định danh.'],
          ]),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 100 },
            children: [new TextRun({ text: '6. TÁC ĐỘNG KINH TẾ - XÃ HỘI & MÔI TRƯỜNG (ESG)', bold: true, size: 24, color: primaryColor })],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: '• Môi trường (Environmental): Cắt giảm 100% rác thải danh thiếp giấy và dây đeo nhựa dùng một lần tại các sự kiện MICE của tỉnh, đóng góp thiết thực cho mục tiêu Net-Zero.\n' +
                '• Xã hội (Social): Thúc đẩy văn hóa giao thương văn minh, bảo vệ quyền riêng tư theo pháp luật Việt Nam, gia tăng hiệu quả hợp tác kinh tế cho các doanh nghiệp vừa và nhỏ (SME).\n' +
                '• Quản trị (Governance): Cung cấp hệ thống dữ liệu báo cáo thời gian thực, minh bạch và có khả năng truy vết kiểm toán độc lập.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 100 },
            children: [new TextRun({ text: '7. ĐỀ XUẤT HỖ TRỢ TỪ SỞ KH&CN VÀ TỈNH KHÁNH HÒA', bold: true, size: 24, color: primaryColor })],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: '1. Được tham gia chương trình Ươm tạo Khởi nghiệp ĐMST và hỗ trợ không gian làm việc.\n' +
                '2. Được hỗ trợ tư vấn bảo hộ quyền Sở hữu Trí tuệ cho giải pháp phần mềm.\n' +
                '3. Được tạo điều kiện triển khai Pilot tại các sự kiện Xúc tiến Thương mại / TECHFEST do tỉnh Khánh Hòa tổ chức.\n' +
                '4. Kết nối các quỹ đầu tư mồi (Seed Funds) với mục tiêu kêu gọi 30,000 – 50,000 USD phục vụ mở rộng hạ tầng.',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 300, after: 60 },
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: 'Khánh Hòa, ngày 28 tháng 08 năm 2026\n',
                italics: true,
              }),
              new TextRun({
                text: 'CHỦ NHIỆM DỰ ÁN ONE CONNECT NETWORK\n',
                bold: true,
              }),
              new TextRun({
                text: '(Ký, ghi rõ họ tên)\n\n\n\n',
                italics: true,
                size: 18,
              }),
              new TextRun({
                text: 'HỒ HOÀNG LONG',
                bold: true,
                size: 22,
                color: primaryColor,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(outputDir, '02_BAN_THUYET_MINH_DU_AN_ONE_CONNECT_2026.docx'), buffer);
}

// -------------------------------------------------------------
// DOC 3: KỊCH BẢN PITCHING DECK 10 SLIDES
// -------------------------------------------------------------
async function generateDoc3() {
  const slides = [
    {
      no: 'SLIDE 1: HOOK & TITLE',
      title: 'ONE CONNECT NETWORK — PHYSICAL TOUCH • DIGITAL MEMORY • ENTERPRISE TRUST',
      content: '• Giới thiệu: Nền tảng Định danh Doanh nhân & Quản trị Mạng lưới B2B Toàn diện.\n• Đại diện trình bày: Hồ Hoàng Long — Quản lý Dự án & Phát triển Sản phẩm (A PLUSVN).\n• Thông điệp mở đầu: "Tại sao trong thời đại AI, chúng ta vẫn trao nhau những chiếc danh thiếp giấy dễ thất lạc và lãng quên?"',
      time: '30 Giây',
    },
    {
      no: 'SLIDE 2: THE PROBLEM',
      title: '4 NỖI ĐAU LỚN CỦA GIAO THƯƠNG VÀ SỰ KIỆN MICE',
      content: '1. Đứt gãy kết nối sau sự kiện (Post-Event Void): 92% danh thiếp giấy bị vứt bỏ sau 1 tuần; không nhớ ai với ai.\n2. Điểm nghẽn Check-in cửa: Xếp hàng chờ dò tên thủ công, lãng phí hàng vạn thẻ đeo nhựa.\n3. Quản trị Hiệp hội rời rạc: Quản lý danh bạ bằng Excel, khó đo lường ROI giao thương.\n4. Rủi ro Pháp lý Dữ liệu: Luật PDPL 91/2025/QH15 xử phạt nặng việc chia sẻ dữ liệu liên lạc không có Consent.',
      time: '45 Giây',
    },
    {
      no: 'SLIDE 3: THE SOLUTION',
      title: 'GIẢI PHÁP ONE CONNECT — VÒNG LẶP NGUYÊN MẪU LÕI (CORE FLYWHEEL)',
      content: '• Trụ cột 1 (Identity): Danh thiếp số 3D NFC 1-chạm (0.42s) + Ma trận 3 cấp độ bảo mật PDPL 91.\n• Trụ cột 2 (Event): Trạm Check-in <1s, Live Attendance, AI Matchmaking Cung - Cầu.\n• Trụ cột 3 (Connection): Sổ tay quan hệ (Private Notes) + Gắn nhãn Lead Follow-up.',
      time: '45 Giây',
    },
    {
      no: 'SLIDE 4: LIVE PRODUCT DEMO',
      title: 'TRỰC QUAN SẢN PHẨM THỰC TẾ (MVP V1.0 HOÀN THIỆN 100%)',
      content: '• Thử nghiệm trực tiếp: Chạm thẻ NFC vào điện thoại ➔ Mở hồ sơ doanh nhân 3D tức thì.\n• Quét mã QR trạm Check-in ➔ Âm thanh *Beep!* xác nhận trong 0.42 giây.\n• Ghi chú cuộc gặp riêng tư và phân loại WARM Lead.',
      time: '60 Giây',
    },
    {
      no: 'SLIDE 5: MARKET OPPORTUNITY',
      title: 'DUNG LƯỢNG THỊ TRƯỜNG (TAM / SAM / SOM)',
      content: '• TAM (Việt Nam): 950,000+ Doanh nghiệp SME, 5,000+ Hiệp hội/CLB, 10,000+ sự kiện MICE/năm (~120 triệu USD).\n• SAM (Duyên hải Miền Trung & MICE Khánh Hòa): 45,000 Doanh nghiệp, 150 Hiệp hội (~8.5 triệu USD).\n• SOM (Mục tiêu 2026 - 2028): 15,000 Doanh nhân kích hoạt thẻ, 60 Hiệp hội đối tác (~1.2 triệu USD).',
      time: '30 Giây',
    },
    {
      no: 'SLIDE 6: BUSINESS MODEL',
      title: 'MÔ HÌNH KINH DOANH & ĐƠN VỊ KINH TẾ (UNIT ECONOMICS)',
      content: '• 4 Dòng doanh thu: Bán phôi thẻ NFC Laser (60% Margin) + Thuê bao SaaS Hiệp hội (80% Margin) + Gói Check-in MICE + AI Matchmaking.\n• Unit Economics: CAC = 85,000 VNĐ; LTV = 1,450,000 VNĐ; LTV/CAC = 17x; Thời gian hoàn vốn CAC < 2 tháng.',
      time: '45 Giây',
    },
    {
      no: 'SLIDE 7: COMPETITIVE ADVANTAGE',
      title: 'LỢI THẾ CẠNH TRANH & HÀO BẢO VỆ (DEFENSIVE MOAT)',
      content: '• Không cần cài đặt App (Web PWA 1-chạm).\n• Bảo toàn dữ liệu khi đổi thẻ vật lý (Card Replacement Continuity).\n• Tiên phong pháp lý 2-Way Explicit Consent theo Luật PDPL 91/2025/QH15.\n• Khóa dữ liệu quan hệ (Relationship Lock-in) khiến chi phí chuyển đổi cao.',
      time: '30 Giây',
    },
    {
      no: 'SLIDE 8: TRACTION & PILOT ROADMAP',
      title: 'KẾT QUẢ THỬ NGHIỆM & LỘ TRÌNH TRIỂN KHAI PILOT KHÁNH HÒA',
      content: '• Sản phẩm Next.js 16 đã hoàn thiện 35 routes và 11 bảng CSDL.\n• Kế hoạch Pilot Q4/2026: 01 Hiệp hội đối tác tại Nha Trang, quy mô 150-300 đại biểu.\n• Cam kết KPI: Tốc độ check-in <1.2s, độ ổn định 99.5%, NPS lãnh đạo Hội >= 60.',
      time: '30 Giây',
    },
    {
      no: 'SLIDE 9: TEAM & EXECUTION',
      title: 'ĐỘI NGŨ SÁNG LẬP & NĂNG LỰC THỰC THI',
      content: '• Hồ Hoàng Long: Trưởng nhóm, Quản lý dự án & Phát triển sản phẩm.\n• Nguyễn Nhật Thanh: Trưởng phòng phát triển AI & Kiến trúc thuật toán.\n• Trần Tuấn Kiệt: Phụ trách Định hướng kinh doanh & Phát triển thị trường.\n• Đơn vị bảo trợ: Công ty Cổ phần Tập đoàn Công nghệ số A+ (A PLUSVN).',
      time: '30 Giây',
    },
    {
      no: 'SLIDE 10: THE ASK & VISION',
      title: 'LỜI KÊU GỌI HỖ TRỢ & TẦM NHÌN PHÁT TRIỂN',
      content: '• Đề xuất Cuộc thi ĐMST Khánh Hòa 2026: Ươm tạo dự án, hỗ trợ bảo hộ SHTT và tạo điều kiện thí điểm tại các sự kiện của tỉnh.\n• Kêu gọi vốn mồi: 30,000 – 50,000 USD đổi lấy 10-15% cổ phần để mở rộng kho phôi thẻ và marketing.\n• Tầm nhìn: Đưa Khánh Hòa trở thành điểm sáng cả nước về Chuyển đổi số MICE Xanh và Định danh Doanh nhân.',
      time: '45 Giây',
    },
  ];

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Arial', size: 22, color: textColor },
          paragraph: { spacing: { line: 280, after: 120 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: [
          ...createHeaderBox(
            'KỊCH BẢN THUYẾT TRÌNH PITCHING DECK (10 SLIDES)',
            'DỰ ÁN ONE CONNECT NETWORK — CUỘC THI KHỞI NGHIỆP ĐMST KHÁNH HÒA 2026'
          ),

          ...slides.flatMap((s) => [
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 80 },
              children: [
                new TextRun({
                  text: `${s.no}: ${s.title} [Thời lượng: ${s.time}]`,
                  bold: true,
                  size: 22,
                  color: primaryColor,
                }),
              ],
            }),
            new Paragraph({
              children: [new TextRun({ text: s.content })],
            }),
          ]),

          new Paragraph({
            spacing: { before: 300, after: 60 },
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: 'Khánh Hòa, ngày 28 tháng 08 năm 2026\n',
                italics: true,
              }),
              new TextRun({
                text: 'TRÌNH BÀY: HỒ HOÀNG LONG\n',
                bold: true,
                color: primaryColor,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(outputDir, '03_KICH_BAN_PITCHING_DECK_10_SLIDES_ONE_CONNECT.docx'), buffer);
}

// -------------------------------------------------------------
// DOC 4: MA TRẬN SWOT & KẾ HOẠCH QUẢN TRỊ RỦI RO
// -------------------------------------------------------------
async function generateDoc4() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Arial', size: 22, color: textColor },
          paragraph: { spacing: { line: 280, after: 120 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: [
          ...createHeaderBox(
            'MA TRẬN PHÂN TÍCH SWOT & KẾ HOẠCH QUẢN TRỊ RỦI RO',
            'DỰ ÁN ONE CONNECT NETWORK — CUỘC THI KHỞI NGHIỆP ĐMST 2026'
          ),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: 'I. MA TRẬN PHÂN TÍCH SWOT TOÀN DIỆN', bold: true, size: 24, color: primaryColor })],
          }),

          createStyledTable([
            ['Phân loại', 'Nội dung chi tiết & Đánh giá chiến lược'],
            ['ĐIỂM MẠNH (Strengths)', '1. Sản phẩm MVP v1.0 đã hoàn thiện 100% (35 routes Next.js 16, CSDL 11 bảng).\n2. Tốc độ check-in và chạm thẻ cực nhanh (<0.42s), không bắt buộc cài đặt App.\n3. Tiên phong giải quyết tuân thủ Luật PDPL 91/2025/QH15 bằng 2-Way Consent.\n4. Đội ngũ nòng cốt (Long - Quản lý SP, Thanh - Trưởng phòng AI, Kiệt - Kinh doanh) am hiểu công nghệ và thị trường.'],
            ['ĐIỂM YẾU (Weaknesses)', '1. Thương hiệu mới, cần thời gian giáo dục thói quen dùng thẻ NFC cho doanh nhân truyền thống.\n2. Ngân sách ban đầu hạn hẹp cho việc sản xuất hàng loạt phôi thẻ kim loại dự phòng.'],
            ['CƠ HỘI (Opportunities)', '1. Khánh Hòa là thủ phủ du lịch MICE với hàng trăm hội thảo, diễn đàn liên kết vùng mỗi năm.\n2. Xu hướng chuyển đổi số và chuyển đổi Xanh (Net-Zero, giảm thiểu rác thải giấy).\n3. Luật Bảo vệ Dữ liệu Cá nhân được siết chặt tạo nhu cầu cấp bách cho các giải pháp có Consent.'],
            ['THÁCH THỨC (Threats)', '1. Sự xuất hiện của các giải pháp danh thiếp NFC giá rẻ nhưng thiếu nền tảng quản trị quan hệ phía sau.\n2. Sự e ngại về bảo mật thông tin từ một số doanh nhân thế hệ cũ.'],
          ]),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 100 },
            children: [new TextRun({ text: 'II. KẾ HOẠCH NHẬN DIỆN & QUẢN TRỊ RỦI RO (RISK MITIGATION)', bold: true, size: 24, color: primaryColor })],
          }),

          createStyledTable([
            ['Loại Rủi Ro', 'Mức Độ', 'Biện Pháp Phòng Ngừa & Ứng Phó Cụ Thể'],
            ['Rủi ro Mất Mạng tại Sự Kiện', 'Cao', 'Kiến trúc Offline Queueing & Local Storage: Dữ liệu check-in được lưu tạm thời tại máy Terminal và tự động đồng bộ lên máy chủ ngay khi có mạng trở lại.'],
            ['Rủi ro Mất / Hỏng Thẻ NFC Vật Lý', 'Trung bình', 'Tính năng Card Replacement Continuity: Cấp ngay phôi thẻ mới trong 30 giây bằng cách gán UID thẻ mới vào hồ sơ mà không mất danh bạ cũ.'],
            ['Rủi ro Pháp lý Dữ liệu Cá nhân', 'Cao', 'Cơ chế 2-Way Explicit Consent theo Luật 91/2025/QH15: Chỉ mở khóa thông tin bảo mật khi có sự đồng ý của cả hai bên; tích hợp điều khoản quyền được xóa dữ liệu.'],
            ['Rủi ro Tắc Nghẽn Cửa Điểm Danh', 'Trung bình', 'Phân luồng 2 làn (Làn 1 chạm NFC siêu tốc 0.42s cho VIP, Làn QR Code Fast-lane); chống quét lặp Idempotent.'],
          ]),

          new Paragraph({
            spacing: { before: 300, after: 60 },
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: 'Khánh Hòa, ngày 28 tháng 08 năm 2026\n',
                italics: true,
              }),
              new TextRun({
                text: 'ĐẠI DIỆN DỰ ÁN: HỒ HOÀNG LONG',
                bold: true,
                color: primaryColor,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(outputDir, '04_MA_TRAN_SWOT_VA_QUAN_TRI_RUI_RO.docx'), buffer);
}

// -------------------------------------------------------------
// DOC 5: KẾ HOẠCH TÀI CHÍNH DỰ PHÓNG & UNIT ECONOMICS 2026-2028
// -------------------------------------------------------------
async function generateDoc5() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Arial', size: 22, color: textColor },
          paragraph: { spacing: { line: 280, after: 120 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: [
          ...createHeaderBox(
            'KẾ HOẠCH TÀI CHÍNH DỰ PHÓNG & ĐƠN VỊ KINH TẾ (UNIT ECONOMICS)',
            'GIAI ĐOẠN 2026 – 2028 | DỰ ÁN ONE CONNECT NETWORK'
          ),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: 'I. CHỈ SỐ ĐƠN VỊ KINH TẾ (UNIT ECONOMICS)', bold: true, size: 24, color: primaryColor })],
          }),

          createStyledTable([
            ['Chỉ Số Đơn Vị Kinh Tế (Unit Metric)', 'Giá Trị Định Lượng', 'Ghi Chú Giải Thích'],
            ['Chi Phí Thu Hút 1 Khách Hàng (CAC)', '85,000 VNĐ', 'Nhờ mô hình B2B2C bán qua Hiệp hội, chi phí marketing giảm 70%'],
            ['Giá Trị Vòng Đời 1 Khách Hàng (LTV)', '1,450,000 VNĐ', 'Bao gồm tiền mua phôi thẻ + Gia hạn dịch vụ SaaS 24 tháng'],
            ['Tỷ Lệ LTV / CAC', '17.0x', 'Vượt xa tiêu chuẩn ngành SaaS (Chuẩn ngành: > 3.0x)'],
            ['Thời Gian Thu Hồi Vốn CAC (Payback Period)', '1.5 Tháng', 'Doanh thu từ phôi thẻ NFC thu hồi vốn ngay ngày đầu tiên'],
            ['Biên Lợi Nhuận Gộp Bình Quân (Gross Margin)', '72%', 'Phôi thẻ vật lý (~60%) + Thuê bao SaaS (~85%)'],
          ]),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 100 },
            children: [new TextRun({ text: 'II. BẢNG DỰ PHÓNG TÀI CHÍNH 3 NĂM (2026 – 2028)', bold: true, size: 24, color: primaryColor })],
          }),

          createStyledTable([
            ['Chỉ Tiêu Tài Chính (Đơn vị: Triệu VNĐ)', 'Năm 2026 (Pilot)', 'Năm 2027 (Khánh Hòa)', 'Năm 2028 (Toàn Quốc)'],
            ['Số Doanh Nhân Kích Hoạt Thẻ', '800 người', '6,500 người', '35,000 người'],
            ['Số Hiệp Hội / Tổ Chức Thuê Bao', '3 tổ chức', '25 tổ chức', '120 tổ chức'],
            ['Số Sự Kiện MICE Vận Hành Check-in', '5 sự kiện', '40 sự kiện', '180 sự kiện'],
            ['DOANH THU TỔNG CỘNG', '420 Triệu', '3,850 Triệu', '21,500 Triệu'],
            ['- Doanh thu bán phôi thẻ NFC', '280 Triệu', '2,275 Triệu', '12,250 Triệu'],
            ['- Doanh thu thuê bao SaaS Hiệp hội', '60 Triệu', '625 Triệu', '3,600 Triệu'],
            ['- Doanh thu gói Check-in MICE & AI', '80 Triệu', '950 Triệu', '5,650 Triệu'],
            ['GIÁ VỐN HÀNG BÁN (COGS)', '145 Triệu', '1,080 Triệu', '5,800 Triệu'],
            ['LỢI NHUẬN GỘP (Gross Profit)', '275 Triệu (65%)', '2,770 Triệu (72%)', '15,700 Triệu (73%)'],
            ['Chi Phí Vận Hành, R&D & Marketing (OPEX)', '210 Triệu', '1,450 Triệu', '6,200 Triệu'],
            ['LỢI NHUẬN TRƯỚC THUẾ (EBITDA)', '+65 Triệu', '+1,320 Triệu', '+9,500 Triệu'],
          ]),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 100 },
            children: [new TextRun({ text: 'III. KẾ HOẠCH SỬ DỤNG VỐN KÊU GỌI (30,000 – 50,000 USD)', bold: true, size: 24, color: primaryColor })],
          }),

          createStyledTable([
            ['Hạng Mục Đầu Tư', 'Tỷ Trọng (%)', 'Mục Đích Sử Dụng Chi Tiết'],
            ['1. Nâng Cấp Hạ Tầng Máy Chủ & Bảo Mật', '30%', 'Mở rộng cụm server, đăng ký chứng chỉ ISO 27001 và kiểm toán an toàn thông tin theo Luật PDPL 91.'],
            ['2. Nhập Kho Phôi Thẻ Kim Loại & Máy Laser', '35%', 'Nhập sẵn 5,000 phôi thẻ NFC kim loại cao cấp và đầu tư máy khắc laser tốc độ cao tại Nha Trang.'],
            ['3. Marketing & Xúc Tiến Hiệp Hội', '20%', 'Tổ chức các buổi workshop giới thiệu công nghệ cho Ban Chấp Hành các Hiệp hội Doanh nghiệp.'],
            ['4. Dự Phòng Lưu Động & Ươm Tạo', '15%', 'Duy trì dòng tiền vận hành đội ngũ kỹ thuật và pháp lý sở hữu trí tuệ.'],
          ]),

          new Paragraph({
            spacing: { before: 300, after: 60 },
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: 'Khánh Hòa, ngày 28 tháng 08 năm 2026\n',
                italics: true,
              }),
              new TextRun({
                text: 'CHỦ NHIỆM DỰ ÁN: HỒ HOÀNG LONG',
                bold: true,
                color: primaryColor,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(outputDir, '05_KE_HOACH_TAI_CHINH_DU_PHONG_2026_2028.docx'), buffer);
}

async function run() {
  console.log('Generating complete startup competition dossier synchronized with Document 01...');
  await generateDoc1();
  console.log('✓ Doc 1: Application Form synchronized.');
  await generateDoc2();
  console.log('✓ Doc 2: Project Proposal synchronized.');
  await generateDoc3();
  console.log('✓ Doc 3: Pitch Deck Script synchronized.');
  await generateDoc4();
  console.log('✓ Doc 4: SWOT & Risk Mitigation synchronized.');
  await generateDoc5();
  console.log('✓ Doc 5: Financial Plan & Unit Economics synchronized.');

  // Also sync root docx files
  const rootDoc2 = path.join(__dirname, '..', '..', 'BAN_THUYET_MINH_DU_AN_KHANH_HOA_2026.docx');
  const rootDoc3 = path.join(__dirname, '..', '..', 'KICH_BAN_PITCHING_DECK_ONE_CONNECT_2026.docx');
  fs.copyFileSync(path.join(outputDir, '02_BAN_THUYET_MINH_DU_AN_ONE_CONNECT_2026.docx'), rootDoc2);
  fs.copyFileSync(path.join(outputDir, '03_KICH_BAN_PITCHING_DECK_10_SLIDES_ONE_CONNECT.docx'), rootDoc3);

  console.log('✓ Root Word files synchronized.');
  console.log('ALL 5 DOSSIER DOCX DOCUMENTS GENERATED IN: ' + outputDir);
}

run();
