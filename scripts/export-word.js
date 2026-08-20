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

async function generateDocx() {
  const primaryColor = '0052CC'; // Professional Tech Blue
  const secondaryColor = '0066FF';
  const textColor = '1E293B'; // Slate 800
  const lightBg = 'F1F5F9'; // Slate 100
  const borderColor = 'CBD5E1'; // Slate 300

  const tableBorders = {
    top: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
    left: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
    right: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
    insideVertical: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
  };

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Arial',
            size: 22, // 11pt
            color: textColor,
          },
          paragraph: {
            spacing: { line: 280, after: 120 },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // Header / Ministry Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
                bold: true,
                size: 24, // 12pt
                color: '0F172A',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'Độc lập – Tự do – Hạnh phúc',
                bold: true,
                size: 22, // 11pt
                color: '334155',
              }),
            ],
          }),

          // Competition Subtitle
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: 'CUỘC THI KHỞI NGHIỆP ĐỔI MỚI SÁNG TẠO TỈNH KHÁNH HÒA – 2026',
                bold: true,
                size: 22,
                color: primaryColor,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: 'Chủ đề: "Khởi nghiệp sáng tạo Khánh Hòa – Giải quyết những vấn đề của thực tiễn"',
                italics: true,
                size: 20,
                color: '475569',
              }),
            ],
          }),

          // Main Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 240 },
            children: [
              new TextRun({
                text: 'BẢN THUYẾT MINH DỰ ÁN KHỞI NGHIỆP ĐỔI MỚI SÁNG TẠO',
                bold: true,
                size: 28, // 14pt
                color: primaryColor,
              }),
            ],
          }),

          // Overview Table
          new Paragraph({
            spacing: { before: 120, after: 120 },
            children: [
              new TextRun({
                text: 'THÔNG TIN TỔNG QUAN VỀ DỰ ÁN',
                bold: true,
                size: 24,
                color: primaryColor,
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorders,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 28, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: lightBg },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Tên dự án / đề tài', bold: true })] })],
                  }),
                  new TableCell({
                    width: { size: 72, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'ONE CONNECT NETWORK — Nền Tảng Hạ Tầng Định Danh Số (Business Identity) & Quản Trị Quan Hệ Giao Thương B2B Tích Hợp Thẻ Chạm NFC Không Ma Sát Tuân Thủ Luật Dữ Liệu Cá Nhân 91/2025/QH15 Cho Hệ Sinh Thái Doanh Nghiệp Khánh Hòa',
                            bold: true,
                            color: primaryColor,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: lightBg },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Lĩnh vực tham gia', bold: true })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Chuyển đổi số, Công nghệ thông tin & Viễn thông, Đổi mới sáng tạo trong Du lịch MICE và Dịch vụ B2B',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: lightBg },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Đơn vị / Tác giả chủ trì', bold: true })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Hồ Hoàng Long (Johnny Long Hồ) — Quản lý Dự án kiêm Media (Aplusvn Media & Tech)',
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: lightBg },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Email liên hệ', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'johnny@aplusvn.com / long.ho@aplusvn.com' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: lightBg },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Điện thoại', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: '0903.888.999' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: lightBg },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Trạng thái phát triển', bold: true })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Đã hoàn thành bản MVP v1.0 hoạt động thực tế (Live Working Product)',
                            bold: true,
                            color: '059669', // Emerald 600
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: lightBg },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Đường dẫn sản phẩm Live', bold: true })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'https://one-connect-network.vercel.app/',
                            color: secondaryColor,
                            underline: {},
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // SECTION 1
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 280, after: 120 },
            children: [
              new TextRun({
                text: '1. TÍNH CẤP THIẾT & BÀI TOÁN THỰC TIỄN TẠI TỈNH KHÁNH HÒA',
                bold: true,
                size: 24,
                color: primaryColor,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1.1. Bối cảnh đặc thù của tỉnh Khánh Hòa:', bold: true }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '• Tỉnh Khánh Hòa đang trên lộ trình phát triển thành Thành phố trực thuộc Trung ương, trung tâm kinh tế biển, khoa học công nghệ và đổi mới sáng tạo của vùng Duyên hải Nam Trung Bộ theo Nghị quyết số 09-NQ/TW của Bộ Chính trị.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '• TP. Nha Trang và tỉnh Khánh Hòa là thủ phủ du lịch MICE (Hội nghị, Hội thảo, Triển lãm), xúc tiến thương mại, các diễn đàn liên kết vùng và sự kiện TECHFEST thường niên, quy tụ hàng vạn lượt doanh nhân, nhà đầu tư và hiệp hội doanh nghiệp.',
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 100 },
            children: [
              new TextRun({ text: '1.2. Ba "Điểm Nghẽn" (Pain Points) Lớn Cần Giải Quyết:', bold: true }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Lãng phí in ấn & Rác thải sự kiện (Trái định hướng Kinh tế Xanh / ESG): ', bold: true }),
              new TextRun({
                text: 'Mỗi sự kiện MICE in hàng chục ngàn danh thiếp giấy và tài liệu dùng một lần. Sau sự kiện, phần lớn tài liệu và danh thiếp bị thất lạc hoặc vứt bỏ do tính chất tĩnh và không cập nhật được, gây lãng phí ngân sách và phát sinh rác thải.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Đứt gãy bối cảnh quan hệ sau sự kiện (Post-Event Relationship Gap): ', bold: true }),
              new TextRun({
                text: 'Doanh nhân gặp gỡ, trao đổi rất nhiều người tại sự kiện nhưng sau khi về thì không nhớ ai với ai, gặp trong bối cảnh nào, nhu cầu hợp tác Cung - Cầu là gì do thiếu công cụ "Relationship Memory" ghi nhớ và phân loại quan hệ.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. Thách thức Quản trị Dữ liệu & Quyền riêng tư (Luật PDPL 91/2025/QH15): ', bold: true }),
              new TextRun({
                text: 'Trong bối cảnh Luật Bảo vệ Dữ liệu Cá nhân 91/2025/QH15 và Nghị định 13/2023/NĐ-CP được thực thi, các hội nghị truyền thống thường thu thập và chia sẻ danh sách SĐT, Email đại biểu thủ công thiếu cơ chế Đồng thuận 2 chiều (2-Way Consent), tiềm ẩn nhiều rủi ro về bảo mật thông tin.',
              }),
            ],
          }),

          // SECTION 2
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 280, after: 120 },
            children: [
              new TextRun({
                text: '2. MỤC TIÊU DỰ ÁN',
                bold: true,
                size: 24,
                color: primaryColor,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Mục tiêu tổng quát: ', bold: true }),
              new TextRun({
                text: 'Xây dựng nền tảng hạ tầng số (SaaS Pre-CRM & Relationship Network) kết nối định danh doanh nhân, tổ chức Hội/CLB và các sự kiện MICE tại tỉnh Khánh Hòa với ma sát bằng 0 (Zero Friction), bảo vệ dữ liệu cá nhân theo chuẩn quốc tế.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Mục tiêu cụ thể:', bold: true }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '1. Số hóa 100% danh thiếp và điểm danh sự kiện bằng Thẻ kim loại NFC 1-chạm (tốc độ < 1 giây) & Dynamic QR Code.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '2. Triển khai thử nghiệm (Pilot) cho ít nhất 01 Hiệp hội / Sự kiện Doanh nhân quy mô 150 – 300 người tại Nha Trang trong quý 4/2026.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '3. Tiết kiệm tối thiểu 85% chi phí in ấn danh thiếp/tài liệu cho các đơn vị tham gia.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '4. 100% giao dịch kết nối tuân thủ cơ chế Explicit 2-Way Consent theo Luật PDPL 91/2025/QH15.',
              }),
            ],
          }),

          // SECTION 3
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 280, after: 120 },
            children: [
              new TextRun({
                text: '3. GIẢI PHÁP ĐỔI MỚI SÁNG TẠO & HẠ TẦNG CÔNG NGHỆ',
                bold: true,
                size: 24,
                color: primaryColor,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3.1. Điểm mới & Đột phá công nghệ của ONE CONNECT:', bold: true }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Công nghệ Chạm NFC 1-Chạm Siêu Tốc (<1s): ', bold: true }),
              new TextRun({
                text: 'Tương thích 100% smartphone (Apple iOS qua CoreNFC và Android qua WebNFC), không bắt buộc người nhận phải tải ứng dụng phức tạp (kiến trúc Web PWA Mobile-First).',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Cơ chế Card Replacement Continuity (Bảo toàn dữ liệu khi đổi thẻ): ', bold: true }),
              new TextRun({
                text: 'UID thẻ chip NFC vật lý được thiết kế độc lập tại bảng CSDL access_cards. Khi doanh nhân đổi thẻ mới, toàn bộ danh bạ và ghi chú quan hệ vẫn được bảo toàn trọn vẹn 100%.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. Tiên phong Pháp lý 2-Way Consent (Luật PDPL 91/2025/QH15): ', bold: true }),
              new TextRun({
                text: 'Dữ liệu nhạy cảm (SĐT cá nhân, Email bảo mật) tự động che mờ (Data Masking) và chỉ mở khóa khi cả hai bên cùng nhấn chấp nhận kết nối.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '4. Quyền Chủ Quyền Dữ Liệu (Data Sovereignty): ', bold: true }),
              new TextRun({
                text: 'Tích hợp tính năng cho phép doanh nhân tự Bật/Tắt hiển thị công khai hồ sơ, Xuất gói dữ liệu JSON (Điều 14 PDPL) và Xóa vĩnh viễn dữ liệu (Right to be Forgotten - Điều 16 PDPL).',
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 100 },
            children: [
              new TextRun({ text: '3.2. Bốn Phân Hệ Cốt Lõi Đã Hoàn Thành Trên Bản Live:', bold: true }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Module 1 - Identity & Executive Cards: ', bold: true }),
              new TextRun({ text: 'Hồ sơ định danh doanh nhân 3D tương tác lật 2 mặt, thẻ NFC phôi Obsidian/Sapphire/Gold/Emerald, mã Dynamic QR đa dụng.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Module 2 - Event Fast Check-in (<1s): ', bold: true }),
              new TextRun({ text: 'Trạm điểm danh cửa sự kiện siêu tốc, tự động nhận diện đại biểu, chống quét lặp Idempotent.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Module 3 - Networking & Relationship Memory: ', bold: true }),
              new TextRun({ text: 'Kết nối có consent 2 chiều, ghi chú riêng tư (Private Notes) và gắn nhãn tiềm năng Lead Follow-up (HOT/WARM).' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Module 4 - Organization & Membership: ', bold: true }),
              new TextRun({ text: 'Quản lý danh bạ hội viên Hiệp hội, phân quyền Ban chấp hành, đo lường tương tác và quản trị sinh hoạt Hội.' }),
            ],
          }),

          // SECTION 4
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 280, after: 120 },
            children: [
              new TextRun({
                text: '4. MÔ HÌNH KINH DOANH & KHẢ NĂNG THƯƠNG MẠI HÓA',
                bold: true,
                size: 24,
                color: primaryColor,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '4.1. Khách hàng mục tiêu:', bold: true }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Khách hàng B2B Tổ chức: ', bold: true }),
              new TextRun({ text: 'Hiệp hội Doanh nhân Trẻ Khánh Hòa, Hội Doanh nhân Nữ, Hiệp hội Du lịch Nha Trang - Khánh Hòa, các Ban Quản lý Khu kinh tế/KCN.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Khách hàng Doanh nghiệp Sự kiện / MICE: ', bold: true }),
              new TextRun({ text: 'Khách sạn 5 sao, trung tâm hội nghị, ban tổ chức diễn đàn kinh tế và triển lãm thương mại.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. Khách hàng Doanh nhân Cá nhân: ', bold: true }),
              new TextRun({ text: 'Chủ doanh nghiệp SME, Giám đốc, chuyên gia tư vấn cần hồ sơ định danh số cao cấp và ghi nhớ quan hệ.' }),
            ],
          }),
          new Paragraph({
            spacing: { before: 100 },
            children: [
              new TextRun({ text: '4.2. Các dòng doanh thu chính (Revenue Streams):', bold: true }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Bán phôi thẻ NFC Laser cao cấp: ', bold: true }),
              new TextRun({ text: '250.000 – 600.000 VNĐ / thẻ kim loại (Lợi nhuận gộp ~60%).' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Thuê bao SaaS Hiệp hội thường niên: ', bold: true }),
              new TextRun({ text: '24.000.000 – 60.000.000 VNĐ / năm cho mỗi tổ chức (Doanh thu B2B định kỳ - Recurring Revenue).' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Gói phần mềm Trạm Check-in Sự kiện MICE: ', bold: true }),
              new TextRun({ text: '3.000.000 – 20.000.000 VNĐ / sự kiện.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Thuê bao Cá nhân Pro Subscription: ', bold: true }),
              new TextRun({ text: '299.000 – 599.000 VNĐ / người / năm cho các tính năng quản trị quan hệ nâng cao.' }),
            ],
          }),

          // SECTION 5
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 280, after: 120 },
            children: [
              new TextRun({
                text: '5. KẾ HOẠCH TRIỂN KHAI THỰC TẾ TẠI TỈNH KHÁNH HÒA',
                bold: true,
                size: 24,
                color: primaryColor,
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorders,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 28, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: lightBg },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Giai đoạn', bold: true })] })],
                  }),
                  new TableCell({
                    width: { size: 22, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: lightBg },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Thời gian', bold: true })] })],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: lightBg },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Mục tiêu & Kết quả dự kiến', bold: true })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Giai đoạn 1: Nộp hồ sơ & Pilot nội bộ', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Tháng 08/2026' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Nộp hồ sơ Cuộc thi ĐMST Khánh Hòa 2026; hoàn thiện thử nghiệm nội bộ 50–100 người dùng.' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Giai đoạn 2: Ươm tạo & Pilot sự kiện thật', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Tháng 09 – 10/2026' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Phối hợp 01 Hiệp hội tại Nha Trang tổ chức trạm check-in và đo lường kết nối cho sự kiện 150–300 đại biểu.' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Giai đoạn 3: Vòng Chung kết & Kêu gọi vốn', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Tháng 11 – 12/2026' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Báo cáo kết quả Pilot trước Hội đồng Giám khảo; Kêu gọi vốn hạt giống $30.000 – $50.000 USD.' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Giai đoạn 4: Thương mại hóa diện rộng', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Năm 2027' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Triển khai cho 20+ Hiệp hội và 50+ sự kiện MICE tại Khánh Hòa và các tỉnh Duyên hải Miền Trung.' })] })] }),
                ],
              }),
            ],
          }),

          // SECTION 6
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 280, after: 120 },
            children: [
              new TextRun({
                text: '6. ĐÁNH GIÁ TÁC ĐỘNG KINH TẾ, XÃ HỘI & MÔI TRƯỜNG (ESG)',
                bold: true,
                size: 24,
                color: primaryColor,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Tác động Môi trường (E - Environmental): ', bold: true }),
              new TextRun({
                text: 'Giảm thiểu hàng triệu tờ giấy in ấn, tiến tới mô hình sự kiện không giấy tờ (Paperless MICE), đóng góp trực tiếp vào mục tiêu Net Zero và Chuyển đổi Xanh của tỉnh Khánh Hòa.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Tác động Xã hội (S - Social): ', bold: true }),
              new TextRun({
                text: 'Nâng cao nhận thức về an toàn dữ liệu cá nhân theo Luật PDPL 91/2025/QH15; tạo lập môi trường giao thương minh bạch, tin cậy giữa các doanh nghiệp.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Tác động Quản trị & Kinh tế (G - Governance): ', bold: true }),
              new TextRun({
                text: 'Cung cấp báo cáo dữ liệu định lượng, có thể truy vết (Audit Logs) cho ban tổ chức và cơ quan quản lý.',
              }),
            ],
          }),

          // SECTION 7
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 280, after: 120 },
            children: [
              new TextRun({
                text: '7. ĐỀ XUẤT KÊU GỌI NGUỒN LỰC HỖ TRỢ TỪ TỈNH KHÁNH HÒA',
                bold: true,
                size: 24,
                color: primaryColor,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Hỗ trợ từ Chương trình Ươm tạo ĐMST (Sở KH&CN): ', bold: true }),
              new TextRun({
                text: 'Hỗ trợ không gian làm việc tại Vườn ươm công nghệ, tư vấn sở hữu trí tuệ (SHTT) cho giải pháp phần mềm và kết nối mạng lưới chuyên gia cố vấn (Mentors).',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Tạo điều kiện Pilot tại các sự kiện của tỉnh: ', bold: true }),
              new TextRun({
                text: 'Cho phép dự án triển khai thử nghiệm miễn phí trạm Check-in NFC tại các hội nghị xúc tiến đầu tư, TECHFEST hoặc sự kiện giao thương do tỉnh Khánh Hòa tổ chức.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. Kết nối nguồn vốn đầu tư: ', bold: true }),
              new TextRun({
                text: 'Hỗ trợ dự án tiếp cận các quỹ tài trợ ĐMST (ADB, NIC) và mạng lưới nhà đầu tư thiên thần (Angel Investors) với quy mô vốn kêu gọi giai đoạn đầu là $30,000 – $50,000 USD.',
              }),
            ],
          }),

          // Signature Section
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 360, after: 60 },
            children: [
              new TextRun({
                text: 'Khánh Hòa, ngày 20 tháng 08 năm 2026',
                italics: true,
                size: 22,
                color: '475569',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'ĐẠI DIỆN DỰ ÁN ONE CONNECT NETWORK',
                bold: true,
                size: 22,
                color: '0F172A',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 200 },
            children: [
              new TextRun({
                text: 'Hồ Hoàng Long (Johnny Long Hồ)',
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

  // Write to docs folder
  const docsPath = path.join(__dirname, '..', 'docs', 'Ban_Thuyet_Minh_Du_An_Khoi_Nghiep_DMST_Khanh_Hoa_2026.docx');
  fs.writeFileSync(docsPath, buffer);
  console.log('Successfully written to:', docsPath);

  // Write to root folder for quick access
  const rootPath = path.join(__dirname, '..', '..', 'BAN_THUYET_MINH_DU_AN_KHANH_HOA_2026.docx');
  fs.writeFileSync(rootPath, buffer);
  console.log('Successfully written to:', rootPath);
}

generateDocx().catch(console.error);
