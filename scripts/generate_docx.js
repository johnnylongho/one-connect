const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function createDocx(outputPath, title, sections) {
  const tempDir = path.join(__dirname, 'temp_docx_' + Date.now());
  const wordDir = path.join(tempDir, 'word');
  const relsDir = path.join(tempDir, '_rels');
  const wordRelsDir = path.join(wordDir, '_rels');

  fs.mkdirSync(tempDir, { recursive: true });
  fs.mkdirSync(wordDir, { recursive: true });
  fs.mkdirSync(relsDir, { recursive: true });
  fs.mkdirSync(wordRelsDir, { recursive: true });

  // [Content_Types].xml
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;
  fs.writeFileSync(path.join(tempDir, '[Content_Types].xml'), contentTypes, 'utf8');

  // _rels/.rels
  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
  fs.writeFileSync(path.join(relsDir, '.rels'), rootRels, 'utf8');

  // word/_rels/document.xml.rels
  const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;
  fs.writeFileSync(path.join(wordRelsDir, 'document.xml.rels'), docRels, 'utf8');

  // word/styles.xml
  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
        <w:sz w:val="24"/>
        <w:color w:val="222222"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
</w:styles>`;
  fs.writeFileSync(path.join(wordDir, 'styles.xml'), stylesXml, 'utf8');

  // Generate word/document.xml body
  let bodyXml = '';

  for (const item of sections) {
    if (item.type === 'title') {
      bodyXml += `
      <w:p>
        <w:pPr>
          <w:jc w:val="center"/>
          <w:spacing w:before="360" w:after="180"/>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
            <w:b/>
            <w:sz w:val="38"/>
            <w:color w:val="004499"/>
          </w:rPr>
          <w:t>${escapeXml(item.text)}</w:t>
        </w:r>
      </w:p>`;
    } else if (item.type === 'subtitle') {
      bodyXml += `
      <w:p>
        <w:pPr>
          <w:jc w:val="center"/>
          <w:spacing w:before="60" w:after="300"/>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
            <w:i/>
            <w:b/>
            <w:sz w:val="26"/>
            <w:color w:val="555555"/>
          </w:rPr>
          <w:t>${escapeXml(item.text)}</w:t>
        </w:r>
      </w:p>`;
    } else if (item.type === 'h1') {
      bodyXml += `
      <w:p>
        <w:pPr>
          <w:spacing w:before="360" w:after="120"/>
          <w:pBdr>
            <w:bottom w:val="single" w:sz="12" w:space="4" w:color="0066FF"/>
          </w:pBdr>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
            <w:b/>
            <w:sz w:val="30"/>
            <w:color w:val="0055CC"/>
          </w:rPr>
          <w:t>${escapeXml(item.text)}</w:t>
        </w:r>
      </w:p>`;
    } else if (item.type === 'h2') {
      bodyXml += `
      <w:p>
        <w:pPr>
          <w:spacing w:before="240" w:after="80"/>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
            <w:b/>
            <w:sz w:val="26"/>
            <w:color w:val="223366"/>
          </w:rPr>
          <w:t>${escapeXml(item.text)}</w:t>
        </w:r>
      </w:p>`;
    } else if (item.type === 'h3') {
      bodyXml += `
      <w:p>
        <w:pPr>
          <w:spacing w:before="180" w:after="60"/>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
            <w:b/>
            <w:sz w:val="24"/>
            <w:color w:val="006699"/>
          </w:rPr>
          <w:t>${escapeXml(item.text)}</w:t>
        </w:r>
      </w:p>`;
    } else if (item.type === 'speech') {
      bodyXml += `
      <w:p>
        <w:pPr>
          <w:ind w:left="400" w:right="200"/>
          <w:spacing w:before="100" w:after="140"/>
          <w:pBdr>
            <w:left w:val="single" w:sz="24" w:space="8" w:color="008844"/>
          </w:pBdr>
          <w:shd w:val="clear" w:color="auto" w:fill="F0FDF4"/>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:b/>
            <w:color w:val="007733"/>
          </w:rPr>
          <w:t>🎙️ Lời thoại thuyết trình (${escapeXml(item.duration || 'Speech')}): </w:t>
        </w:r>
        <w:r>
          <w:rPr>
            <w:i/>
            <w:color w:val="1E293B"/>
          </w:rPr>
          <w:t>${escapeXml(item.text)}</w:t>
        </w:r>
      </w:p>`;
    } else if (item.type === 'callout') {
      bodyXml += `
      <w:p>
        <w:pPr>
          <w:ind w:left="300" w:right="200"/>
          <w:spacing w:before="80" w:after="100"/>
          <w:pBdr>
            <w:left w:val="single" w:sz="18" w:space="6" w:color="0066FF"/>
          </w:pBdr>
          <w:shd w:val="clear" w:color="auto" w:fill="F0F7FF"/>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:color w:val="1E3A8A"/>
          </w:rPr>
          <w:t>${escapeXml(item.text)}</w:t>
        </w:r>
      </w:p>`;
    } else if (item.type === 'bullet') {
      bodyXml += `
      <w:p>
        <w:pPr>
          <w:ind w:left="360"/>
          <w:spacing w:before="40" w:after="40"/>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:b/>
            <w:color w:val="0066FF"/>
          </w:rPr>
          <w:t>• </w:t>
        </w:r>
        <w:r>
          <w:t>${escapeXml(item.text)}</w:t>
        </w:r>
      </w:p>`;
    } else if (item.type === 'table') {
      bodyXml += `
      <w:tbl>
        <w:tblPr>
          <w:tblW w:w="0" w:type="auto"/>
          <w:tblBorders>
            <w:top w:val="single" w:sz="6" w:space="0" w:color="CCCCCC"/>
            <w:left w:val="single" w:sz="6" w:space="0" w:color="CCCCCC"/>
            <w:bottom w:val="single" w:sz="6" w:space="0" w:color="CCCCCC"/>
            <w:right w:val="single" w:sz="6" w:space="0" w:color="CCCCCC"/>
            <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E5E5E5"/>
            <w:insideV w:val="single" w:sz="4" w:space="0" w:color="E5E5E5"/>
          </w:tblBorders>
        </w:tblPr>`;
      
      item.rows.forEach((row, rowIdx) => {
        const isHeader = rowIdx === 0;
        bodyXml += `<w:tr>`;
        row.forEach((cell) => {
          bodyXml += `
          <w:tc>
            <w:tcPr>
              <w:tcMar>
                <w:top w:w="120" w:type="dxa"/>
                <w:bottom w:w="120" w:type="dxa"/>
                <w:left w:w="160" w:type="dxa"/>
                <w:right w:w="160" w:type="dxa"/>
              </w:tcMar>
              ${isHeader ? '<w:shd w:val="clear" w:color="auto" w:fill="0055CC"/>' : (rowIdx % 2 === 1 ? '<w:shd w:val="clear" w:color="auto" w:fill="F8FAFC"/>' : '')}
            </w:tcPr>
            <w:p>
              <w:r>
                <w:rPr>
                  ${isHeader ? '<w:b/><w:color w:val="FFFFFF"/>' : '<w:color w:val="333333"/>'}
                </w:rPr>
                <w:t>${escapeXml(cell)}</w:t>
              </w:r>
            </w:p>
          </w:tc>`;
        });
        bodyXml += `</w:tr>`;
      });
      bodyXml += `</w:tbl><w:p><w:pPr><w:spacing w:before="60" w:after="60"/></w:pPr></w:p>`;
    } else {
      bodyXml += `
      <w:p>
        <w:pPr>
          <w:spacing w:before="60" w:after="80"/>
        </w:pPr>
        <w:r>
          <w:t>${escapeXml(item.text)}</w:t>
        </w:r>
      </w:p>`;
    }
  }

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${bodyXml}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  fs.writeFileSync(path.join(wordDir, 'document.xml'), documentXml, 'utf8');

  // Zip the temp directory into the destination .docx
  const tempZip = path.join(__dirname, 'temp_' + Date.now() + '.zip');
  const psCommand = `powershell -NoProfile -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${tempZip}' -Force"`;
  execSync(psCommand);

  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
  }
  fs.renameSync(tempZip, outputPath);

  // Clean up tempDir
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log('Successfully generated:', outputPath);
}

// ----------------------------------------------------------------------------
// 1. GENERATE PITCHING DECK DOCX (TIẾNG VIỆT CÓ DẤU ĐẦY ĐỦ)
// ----------------------------------------------------------------------------
const pitchDeckSections = [
  { type: 'title', text: 'KỊCH BẢN PITCHING DECK THUYẾT TRÌNH DỰ ÁN ONE CONNECT NETWORK' },
  { type: 'subtitle', text: 'CUỘC THI KHỞI NGHIỆP ĐỔI MỚI SÁNG TẠO TỈNH KHÁNH HÒA 2026' },
  { type: 'callout', text: 'Đề tài: Nền Tảng Hạ Tầng Định Danh Số (Business Identity) & Quản Trị Quan Hệ Giao Thương B2B Tích Hợp Thẻ Chạm NFC Không Ma Sát Tuân Thủ Luật Dữ Liệu Cá Nhân 91/2025/QH15 Cho Hệ Sinh Thái Doanh Nghiệp Khánh Hòa\nThời lượng thuyết trình chuẩn: 5 - 7 Phút thuyết trình + 5 Phút Hỏi/Đáp (Q&A) cùng Ban Giám Khảo\nĐại diện thuyết trình: Hồ Hoàng Long (Johnny Long Hồ) — Aplusvn Media & Tech\nWebsite Live: https://one-connect-network.vercel.app/' },

  { type: 'h1', text: 'TỔNG QUAN HÀNH TRÌNH PITCHING 7 PHÚT' },
  { type: 'bullet', text: 'PHẦN 1 - MỞ ĐẦU (1.5 Phút): Hook mở đầu, 3 điểm nghẽn thực tiễn tại Khánh Hòa, Giải pháp One Connect 1-chạm.' },
  { type: 'bullet', text: 'PHẦN 2 - CÔNG NGHỆ & SẢN PHẨM (2.5 Phút): 4 Phân hệ Live Demo, Đột phá 2-Way Consent theo Luật PDPL 91/2025, Mô hình 4 dòng doanh thu.' },
  { type: 'bullet', text: 'PHẦN 3 - THỊ TRƯỜNG & KÊU GỌI NGUỒN LỰC (2.5 Phút): Dung lượng thị trường MICE Nha Trang, Lợi thế cạnh tranh, Lộ trình Pilot Quý 4/2026, Đội ngũ và Kêu gọi vốn mồi $30,000 - $50,000 USD.' },

  { type: 'h1', text: 'SLIDE 1: TIÊU ĐỀ & LỜI MỞ ĐẦU (HOOK)' },
  { type: 'bullet', text: 'Tên dự án: ONE CONNECT NETWORK — Hạ Tầng Định Danh Số & Quản Trị Quan Hệ B2B Không Ma Sát' },
  { type: 'bullet', text: 'Khẩu hiệu (Tagline): "Từ Một Lần Chạm – Đến Mọi Kết Nối Giao Thương Bền Vững"' },
  { type: 'bullet', text: 'Đơn vị chủ trì: Aplusvn Media & Tech | Đại diện: Hồ Hoàng Long (Johnny Long Hồ)' },
  { type: 'speech', duration: '45 giây', text: 'Kính thưa Hội đồng Giám khảo, thưa quý vị đại biểu! Một năm tại TP. Nha Trang và tỉnh Khánh Hòa, có hàng trăm hội nghị xúc tiến đầu tư, diễn đàn MICE và lễ hội giao thương diễn ra. Nhưng sau những cái bắt tay và hàng vạn chiếc danh thiếp giấy được trao đổi... có bao nhiêu mối quan hệ thực sự trở thành hợp đồng kinh tế? Hay phần lớn danh thiếp sẽ nằm lại trong ngăn kéo hoặc thùng rác khách sạn? Hôm nay, tôi xin đại diện Aplusvn Media & Tech mang đến Cuộc thi Khởi nghiệp Đổi mới Sáng tạo Khánh Hòa 2026 giải pháp: ONE CONNECT NETWORK — Nền tảng hạ tầng định danh số và quản trị quan hệ B2B 1-chạm không ma sát, tiên phong tuân thủ Luật Bảo vệ Dữ liệu Cá nhân số 91/2025/QH15, biến mọi cuộc gặp gỡ tại Khánh Hòa thành tài sản số của doanh nghiệp!' },

  { type: 'h1', text: 'SLIDE 2: BÀI TOÁN THỰC TIỄN & 3 ĐIỂM NGHẼN LỚN (THE PROBLEM)' },
  { type: 'bullet', text: '1. Lãng phí in ấn & Rác thải carbon: Hơn 88% danh thiếp giấy bị vứt bỏ trong vòng 7 ngày đầu tiên sau sự kiện; lãng phí hàng trăm triệu đồng in ấn tài liệu.' },
  { type: 'bullet', text: '2. Đứt gãy bối cảnh quan hệ sau sự kiện: Hơn 70% doanh nhân không theo dõi (follow-up) được đối tác vì không nhớ bối cảnh cuộc gặp.' },
  { type: 'bullet', text: '3. Rủi ro Pháp lý Dữ liệu Cá nhân: Danh sách đại biểu bị chia sẻ tràn lan, thiếu cơ chế đồng ý 2 chiều (Explicit Consent) theo Luật PDPL 91/2025/QH15.' },
  { type: 'callout', text: 'Nguồn đối chiếu: Nghiên cứu của Statistic Brain Research Institute & Adobe Insights; Nghị quyết 09-NQ/TW của Bộ Chính trị về phát triển Khánh Hòa; Luật Bảo vệ Dữ liệu Cá nhân số 91/2025/QH15.' },
  { type: 'speech', duration: '45 giây', text: 'Nghiên cứu thị trường chỉ ra rằng: 88% danh thiếp giấy in ra bị vứt bỏ sau 1 tuần. Tại một thành phố du lịch MICE lớn như Nha Trang, việc này không chỉ gây lãng phí hàng trăm triệu đồng tiền in ấn mỗi sự kiện mà còn tạo ra lượng rác thải giấy không cần thiết. Đáng lo ngại hơn, dữ liệu liên hệ đại biểu bị chia sẻ công khai không qua đồng ý 2 chiều, vi phạm nghiêm trọng Luật Dữ liệu Cá nhân 91/2025/QH15. Doanh nghiệp Khánh Hòa đang thiếu một công cụ số vừa hiện đại, vừa xanh, vừa bảo mật tuyệt đối.' },

  { type: 'h1', text: 'SLIDE 3: GIẢI PHÁP ĐỔI MỚI SÁNG TẠO — ONE CONNECT (THE SOLUTION)' },
  { type: 'bullet', text: 'Chạm NFC 1-Chạm Siêu Tốc (0.42s): Không cần cài đặt ứng dụng, mở trực tiếp trên trình duyệt (Web PWA).' },
  { type: 'bullet', text: 'Card Replacement Continuity: Đổi thẻ vật lý mới 100% không làm mất dữ liệu quan hệ.' },
  { type: 'bullet', text: 'Explicit 2-Way Consent: Ẩn số điện thoại/email riêng tư, chỉ mở khóa khi cả hai bên cùng đồng ý.' },
  { type: 'bullet', text: 'Relationship Memory: Tự động lưu vết ngày gặp, sự kiện gặp gỡ, ghi chú riêng tư và gắn nhãn tiềm năng Lead Tagging.' },
  { type: 'speech', duration: '45 giây', text: 'ONE CONNECT giải quyết triệt để 3 điểm nghẽn trên bằng một hệ sinh thái 4-trong-1. Doanh nhân chỉ cần chạm nhẹ thẻ kim loại NFC vào lưng điện thoại đối tác trong 0.42 giây: Hồ sơ số 3D lập tức xuất hiện mà không cần cài bất kỳ ứng dụng nào. Khi hai bên nhấn "Chấp Nhận Kết Nối", hệ thống tự động thiết lập quyền bảo vệ dữ liệu 2 chiều, ghi nhận bối cảnh sự kiện và cho phép ghi chú riêng tư ngay lập tức!' },

  { type: 'h1', text: 'SLIDE 4: SẢN PHẨM HOÀN CHỈNH & 4 PHÂN HỆ LÕI (PRODUCT MVP)' },
  { type: 'bullet', text: '1. SCR-B01 (Thẻ Doanh Nhân Số 3D): 4 Phôi thẻ kim loại Obsidian, Sapphire, Gold, Emerald; lật 2 mặt tương tác, tích hợp QR vCard.' },
  { type: 'bullet', text: '2. ADM-ORG (Quản Trị Hiệp Hội / CLB): Cấp phát thẻ số, phân quyền Ban chấp hành, quản lý danh bạ hội viên.' },
  { type: 'bullet', text: '3. EVT-CHK (Trạm Check-in Siêu Tốc): Điểm danh dưới 0.5s/lượt, chống quét lặp Idempotent, phân tích tỷ lệ tham dự thời gian thực.' },
  { type: 'bullet', text: '4. NET-MEM (B2B Matchmaking): AI Gợi ý đối tác giao thương và theo dõi tiến trình Lead Follow-up.' },
  { type: 'speech', duration: '60 giây', text: 'Dự án của chúng tôi không dừng lại ở ý tưởng trên giấy. Hôm nay, quý vị có thể truy cập ngay vào địa chỉ one-connect-network.vercel.app để trải nghiệm sản phẩm thực tế đã hoàn thành 100% bản MVP với 4 phân hệ lõi: Thẻ định danh số 3D, Cổng quản trị Hiệp hội doanh nghiệp, Trạm soát vé check-in siêu tốc dưới 0.5 giây và Hệ thống ghi nhớ quan hệ giao thương B2B. Toàn bộ nền tảng vận hành trên hạ tầng đám mây hiện đại, độ ổn định 99.9%.' },

  { type: 'h1', text: 'SLIDE 5: TIÊN PHONG BẢO MẬT & LUẬT DỮ LIỆU CÁ NHÂN 91/2025/QH15' },
  { type: 'bullet', text: 'Điều 11 (Explicit 2-Way Consent): Dữ liệu nhạy cảm được che mờ (Data Masking), chỉ hiển thị khi đối tác được phê duyệt.' },
  { type: 'bullet', text: 'Điều 14 (Data Portability): Nút bấm 1-click xuất toàn bộ gói dữ liệu cá nhân dạng JSON/CSV chuẩn.' },
  { type: 'bullet', text: 'Điều 16 (Right to be Forgotten): Quyền yêu cầu xóa vĩnh viễn dữ liệu và vô hiệu hóa chip thẻ NFC tức thì khỏi hệ thống.' },
  { type: 'bullet', text: 'Data Sovereignty (Chủ quyền dữ liệu): 3 Chế độ hiển thị: Công khai / Chỉ Hội viên / Riêng tư.' },
  { type: 'speech', duration: '45 giây', text: 'Điểm khác biệt lớn nhất giúp ONE CONNECT vượt lên các sản phẩm danh thiếp điện tử thông thường là sự tuân thủ tuyệt đối Luật Bảo vệ Dữ liệu Cá nhân 91/2025/QH15. Chúng tôi trang bị cho doanh nhân quyền làm chủ dữ liệu (Data Sovereignty): Tự bật tắt hiển thị công khai, yêu cầu xuất bản sao dữ liệu theo Điều 14, và quyền xóa vĩnh viễn thông tin theo Điều 16. Đây là tấm lá chắn pháp lý an toàn nhất cho các Hiệp hội và Doanh nghiệp khi tham gia chuyển đổi số.' },

  { type: 'h1', text: 'SLIDE 6: MÔ HÌNH KINH DOANH & 4 DÒNG DOANH THU (BUSINESS MODEL)' },
  { type: 'bullet', text: '1. Phần cứng thẻ kim loại cao cấp: Bán thẻ NFC khắc Laser cá nhân hóa (250,000 – 600,000 VNĐ/thẻ, Margin lợi nhuận ~60%).' },
  { type: 'bullet', text: '2. Thuê bao SaaS Quản trị Tổ chức: Gói phần mềm cho Hiệp hội / CLB (5,000,000 – 15,000,000 VNĐ/năm).' },
  { type: 'bullet', text: '3. Dịch vụ Trạm Check-in Sự kiện MICE: Trạm điểm danh & báo cáo dữ liệu (3,000,000 – 10,000,000 VNĐ/sự kiện).' },
  { type: 'bullet', text: '4. Dịch vụ AI B2B Matchmaking: Phí kết nối giao thương theo chuyên đề hội chợ/diễn đàn.' },
  { type: 'speech', duration: '45 giây', text: 'ONE CONNECT xây dựng mô hình kinh doanh kết hợp giữa Doanh thu phần cứng tức thì (Thẻ kim loại NFC) và Doanh thu định kỳ SaaS (Phần mềm quản trị Hiệp hội & Sự kiện MICE). Với biên lợi nhuận gộp phần cứng trên 60% và chi phí máy chủ đám mây tối ưu, dự án có khả năng đạt điểm hòa vốn (Break-even) chỉ sau 6 tháng triển khai thực tế.' },

  { type: 'h1', text: 'SLIDE 7: THỊ TRƯỜNG MỤC TIÊU TẠI KHÁNH HÒA & TIỀM NĂNG (MARKET SIZE)' },
  { type: 'bullet', text: 'TAM (Toàn quốc): ~900,000 Doanh nghiệp đang hoạt động + 300 Hiệp hội Doanh nghiệp.' },
  { type: 'bullet', text: 'SAM (Nam Trung Bộ & MICE): ~35,000 Doanh nghiệp và hơn 1,000 sự kiện MICE/Hội thảo hàng năm tại Khánh Hòa, Đà Nẵng, Bình Định, Phú Yên.' },
  { type: 'bullet', text: 'SOM (Mục tiêu Pilot Khánh Hòa 2026 - 2027): 2,500 Doanh nhân kích hoạt thẻ số; 15+ Hiệp hội/CLB sử dụng nền tảng; 30+ Sự kiện MICE tại Nha Trang sử dụng trạm check-in.' },
  { type: 'speech', duration: '45 giây', text: 'Tại Khánh Hòa, với hơn 35,000 doanh nghiệp cùng hàng ngàn sự kiện MICE cao cấp hàng năm tại các khách sạn 5 sao Nha Trang, nhu cầu số hóa danh bạ và quản trị sự kiện là cực kỳ lớn. Mục tiêu trong 12 tháng tới của chúng tôi tại Khánh Hòa là tiếp cận 2,500 doanh nhân chủ chốt, phục vụ 30 sự kiện MICE và đồng hành cùng các Hiệp hội doanh nghiệp tiêu biểu của tỉnh.' },

  { type: 'h1', text: 'SLIDE 8: LỢI THẾ CẠNH TRANH VƯỢT TRỘI (COMPETITIVE MOAT)' },
  {
    type: 'table',
    rows: [
      ['Tiêu chí so sánh', 'Danh thiếp Giấy', 'Namecard thường', 'CRM cồng kềnh', 'ONE CONNECT NETWORK'],
      ['Thời gian trao đổi', 'Chậm (gõ tay)', 'Nhanh (~2s)', 'Không phù hợp gặp mặt', 'Siêu Tốc (0.42s - 1 Chạm)'],
      ['Bảo vệ môi trường', 'Lãng phí in ấn', 'Tốt', 'N/A', 'Chuyển Đổi Xanh 100%'],
      ['Ghi nhớ bối cảnh gặp', 'Không có', 'Không có', 'Phải nhập liệu phức tạp', 'Tự Động Lưu Vết Sự Kiện'],
      ['Tuân thủ Luật PDPL 91/2025', 'Không bảo vệ', 'Lộ SĐT công khai', 'Khó kiểm soát', 'Explicit 2-Way Consent'],
      ['Trạm Check-in Sự kiện', 'Thủ công', 'Không có', 'Chi phí đắt đỏ', 'Trạm Check-in Dưới 0.5s']
    ]
  },
  { type: 'speech', duration: '45 giây', text: 'So với danh thiếp giấy truyền thống và các loại namecard điện tử trôi nổi trên thị trường, ONE CONNECT có 3 lợi thế cạnh tranh độc quyền: Thứ nhất, tích hợp sẵn trạm check-in MICE; Thứ hai, lớp ghi nhớ quan hệ Relationship Memory tự động; Thứ ba, kiến trúc bảo mật 2-Way Consent chuẩn Luật PDPL 91/2025. Chúng tôi không chỉ bán một chiếc thẻ, chúng tôi cung cấp hạ tầng kết nối giao thương hoàn chỉnh.' },

  { type: 'h1', text: 'SLIDE 9: LỘ TRÌNH TRIỂN KHAI & KẾ HOẠCH PILOT (ROADMAP)' },
  { type: 'bullet', text: 'Quý 3/2026: Hoàn thiện MVP v1.0, thử nghiệm 50 người dùng nội bộ, nộp hồ sơ Cuộc thi ĐMST Khánh Hòa 2026.' },
  { type: 'bullet', text: 'Quý 4/2026: Triển khai Pilot thực tế tại 1 Sự kiện Doanh nhân quy mô 150 – 300 khách tại TP. Nha Trang (KPI: Kích hoạt thẻ >90%, Check-in <0.5s, Hài lòng >95%).' },
  { type: 'bullet', text: 'Quý 1 – Quý 2/2027: Nhân rộng ra 20 Hiệp hội và 50 sự kiện MICE tại Khánh Hòa và Nam Trung Bộ.' },
  { type: 'bullet', text: 'Quý 3 – Quý 4/2027: Tích hợp AI B2B Matchmaking thông minh và mở rộng toàn quốc.' },
  { type: 'speech', duration: '45 giây', text: 'Về lộ trình: Ngay trong Quý 4/2026, chúng tôi sẽ phối hợp cùng một Hiệp hội Doanh nghiệp tại TP. Nha Trang để triển khai Pilot thực tế tại một sự kiện quy mô 200 khách mời. Đây sẽ là minh chứng sống động nhất về năng lực vận hành thực tế trước khi thương mại hóa toàn diện trên địa bàn toàn tỉnh vào đầu năm 2027.' },

  { type: 'h1', text: 'SLIDE 10: ĐỘI NGŨ SÁNG LẬP & NĂNG LỰC THỰC THI (THE TEAM)' },
  { type: 'bullet', text: 'Hồ Hoàng Long (Johnny Long Hồ) — Founder & Project Lead: Kinh nghiệm sâu về Quản lý Dự án Công nghệ, Truyền thông & Hệ sinh thái Doanh nghiệp (Aplusvn Media & Tech).' },
  { type: 'bullet', text: 'Đội ngũ Kỹ thuật & Vận hành (Aplusvn Core Team): Full-stack Developers (Next.js, Supabase, NFC Hardware) & UX/UI Designers chuyên nghiệp.' },
  { type: 'speech', duration: '30 giây', text: 'Đội ngũ phát triển Aplusvn Media & Tech chúng tôi là những người trẻ, am hiểu sâu sắc về công nghệ phần mềm hiện đại và có kinh nghiệm thực tế trong tổ chức truyền thông sự kiện doanh nghiệp. Chúng tôi cam kết dồn 100% tâm huyết để biến ONE CONNECT thành niềm tự hào công nghệ khởi nghiệp của tỉnh Khánh Hòa.' },

  { type: 'h1', text: 'SLIDE 11: ĐỀ XUẤT KÊU GỌI NGUỒN LỰC & SỬ DỤNG VỐN (THE ASK)' },
  { type: 'bullet', text: '1. Đồng hành Ươm tạo (InnoKhanhHoa Incubation): Không gian vườn ươm, tư vấn SHTT và chuyên gia Mentors.' },
  { type: 'bullet', text: '2. Cơ hội Triển khai: Thử nghiệm trạm check-in tại các sự kiện xúc tiến thương mại, TECHFEST của tỉnh Khánh Hòa.' },
  { type: 'bullet', text: '3. Kêu gọi Vốn mồi (Seed Funding): $30,000 – $50,000 USD (tương đương 750 triệu – 1.25 tỷ VNĐ).' },
  { type: 'bullet', text: 'Phân bổ nguồn vốn: 35% Sản xuất phôi thẻ NFC & Máy in Laser; 25% Nâng cấp R&D & Hạ tầng Cloud; 25% Triển khai Pilot & Tiếp cận Hiệp hội; 15% Pháp lý & Dự phòng.' },
  { type: 'speech', duration: '45 giây', text: 'Để hiện thực hóa mục tiêu này, chúng tôi kính đề xuất Sở KH&CN Khánh Hòa tiếp nhận dự án vào Chương trình Ươm tạo Đổi mới Sáng tạo của tỉnh, đồng thời tạo điều kiện để ONE CONNECT được thử nghiệm tại các sự kiện xúc tiến thương mại của tỉnh. Đồng thời, chúng tôi tìm kiếm nguồn vốn mồi $30,000 – $50,000 USD từ các quỹ ĐMST và nhà đầu tư thiên thần để nhập khẩu phôi thẻ chất lượng cao và mở rộng hạ tầng.' },

  { type: 'h1', text: 'SLIDE 12: TẦM NHÌN 2030 & LỜI KẾT (VISION & CALL TO ACTION)' },
  { type: 'bullet', text: 'Tầm nhìn 2030: Trở thành Nền tảng Định danh Doanh nhân & Hạ tầng Giao thương Số tiêu chuẩn cho toàn vùng Kinh tế Trọng điểm Miền Trung.' },
  { type: 'callout', text: '"Chuyển đổi số bắt đầu từ một lần chạm. Hãy cùng ONE CONNECT kiến tạo một Khánh Hòa thông minh, xanh và kết nối không giới hạn!"' },
  { type: 'bullet', text: 'Website: https://one-connect-network.vercel.app/ | Email: johnny@aplusvn.com | Hotline: 0903.888.999' },
  { type: 'speech', duration: '30 giây', text: 'Kính thưa Hội đồng Giám khảo! Chuyển đổi số không phải là điều gì xa vời, nó bắt đầu từ chính chiếc danh thiếp trên tay mỗi doanh nhân. ONE CONNECT đã sẵn sàng đồng hành cùng hệ sinh thái khởi nghiệp đổi mới sáng tạo tỉnh Khánh Hòa. Xin trân trọng cảm ơn quý Ban Giám khảo và rất mong nhận được những góp ý quý báu!' },

  { type: 'h1', text: 'PHỤ LỤC: BỘ CÂU HỎI PHẢN BIỆN & HƯỚNG TRẢ LỜI MẪU (Q&A CHEAT SHEET)' },
  {
    type: 'table',
    rows: [
      ['Câu hỏi phản biện của Giám khảo', 'Hướng trả lời thuyết phục (Có căn cứ)'],
      ['1. Thị trường đã có nhiều danh thiếp điện tử, ONE CONNECT khác biệt ở điểm nào?', 'Dạ thưa Ban giám khảo, các sản phẩm hiện nay chỉ là trang web cá nhân tĩnh gắn chip NFC. ONE CONNECT là Hạ Tầng Pre-CRM & Event Check-in: Tích hợp trạm điểm danh <0.5s, tự động ghi nhớ bối cảnh gặp gỡ (Relationship Memory), và là nền tảng đầu tiên tuân thủ Luật PDPL 91/2025 với cơ chế 2-Way Consent bảo vệ dữ liệu cá nhân.'],
      ['2. Nếu người dùng mất thẻ NFC thì có bị mất danh bạ và dữ liệu không?', 'Dạ hoàn toàn không! Nhờ kiến trúc Card Replacement Continuity, UID thẻ nằm độc lập ở bảng access_cards. Khi cấp thẻ mới, chỉ cần cập nhật mã thẻ, toàn bộ danh bạ, ghi chú và lịch sử sự kiện vẫn nguyên vẹn 100% trên tài khoản đám mây.'],
      ['3. Khả năng tương thích trên các dòng điện thoại cũ như thế nào?', 'Nền tảng hỗ trợ 100% smartphone: Đối với máy có NFC (iPhone 7 trở lên và hầu hết máy Android), chỉ cần 1 chạm. Đối với máy không có NFC, mã Dynamic QR cho phép quét qua Zalo, Camera hoặc bất kỳ ứng dụng nào.'],
      ['4. Dự án đã sẵn sàng triển khai chưa hay mới là ý tưởng?', 'Dạ dự án đã hoàn thành 100% bản MVP hoạt động thực tế trên nền tảng đám mây tại địa chỉ one-connect-network.vercel.app, CSDL 11 bảng lõi trên Supabase đã được kiểm thử với 0 lỗi build và sẵn sàng chạy Pilot ngay trong Quý 4/2026.']
    ]
  }
];

createDocx(
  path.join(__dirname, 'Kich_Ban_Pitching_Deck_One_Connect_Khanh_Hoa_2026.docx'),
  'Kịch Bản Pitching Deck One Connect',
  pitchDeckSections
);

// ----------------------------------------------------------------------------
// 2. GENERATE PROJECT PROPOSAL DOCX (BẢN THUYẾT MINH DỰ ÁN)
// ----------------------------------------------------------------------------
const proposalSections = [
  { type: 'title', text: 'BẢN THUYẾT MINH DỰ ÁN KHỞI NGHIỆP ĐỔI MỚI SÁNG TẠO TỈNH KHÁNH HÒA 2026' },
  { type: 'subtitle', text: 'Cuộc thi: Khởi nghiệp Đổi mới Sáng tạo tỉnh Khánh Hòa – 2026 | innokhanhhoa.vn' },
  
  {
    type: 'table',
    rows: [
      ['Hạng mục', 'Nội dung chi tiết'],
      ['Tên dự án / đề tài', 'ONE CONNECT NETWORK — Nền Tảng Hạ Tầng Định Danh Số (Business Identity) & Quản Trị Quan Hệ Giao Thương B2B Tích Hợp Thẻ Chạm NFC Không Ma Sát Tuân Thủ Luật Dữ Liệu Cá Nhân 91/2025/QH15 Cho Hệ Sinh Thái Doanh Nghiệp Khánh Hòa'],
      ['Lĩnh vực tham gia', 'Chuyển đổi số, Công nghệ thông tin & Viễn thông, Đổi mới sáng tạo trong Du lịch MICE và Dịch vụ B2B'],
      ['Đơn vị / Tác giả chủ trì', 'Hồ Hoàng Long (Johnny Long Hồ) — Quản lý Dự án kiêm Media (Aplusvn Media & Tech)'],
      ['Email & Điện thoại', 'johnny@aplusvn.com / long.ho@aplusvn.com | 0903.888.999'],
      ['Trạng thái phát triển', 'Đã hoàn thành bản MVP v1.0 hoạt động thực tế (Live Product)'],
      ['Link sản phẩm Live', 'https://one-connect-network.vercel.app/'],
      ['Mã nguồn dự án', 'https://github.com/johnnylongho/one-connect']
    ]
  },

  { type: 'h1', text: '1. TÍNH CẤP THIẾT & BÀI TOÁN THỰC TIỄN TẠI TỈNH KHÁNH HÒA' },
  { type: 'h2', text: '1.1. Bối cảnh đặc thù của tỉnh Khánh Hòa' },
  { type: 'bullet', text: 'Tỉnh Khánh Hòa đang trên lộ trình phát triển thành Thành phố trực thuộc Trung ương, trung tâm kinh tế biển, khoa học công nghệ và đổi mới sáng tạo theo Nghị quyết 09-NQ/TW của Bộ Chính trị.' },
  { type: 'bullet', text: 'TP. Nha Trang và tỉnh Khánh Hòa là thủ phủ du lịch MICE (Hội nghị, Hội thảo, Triển lãm), quy tụ hàng vạn lượt doanh nhân, nhà đầu tư, hiệp hội doanh nghiệp hàng năm.' },

  { type: 'h2', text: '1.2. Ba điểm nghẽn lớn cần giải quyết' },
  { type: 'bullet', text: '1. Lãng phí in ấn & Ô nhiễm môi trường: Hơn 88% danh thiếp giấy bị vứt bỏ sau 7 ngày đầu tiên; lãng phí hàng trăm triệu đồng in ấn cho mỗi mùa sự kiện.' },
  { type: 'bullet', text: '2. Đứt gãy bối cảnh quan hệ sau sự kiện: Hơn 70% doanh nhân không theo dõi được đối tác vì không có lớp ghi nhớ quan hệ (Relationship Memory).' },
  { type: 'bullet', text: '3. Nguy cơ rủi ro pháp lý về Dữ liệu Cá nhân: Danh sách đại biểu bị chia sẻ công khai, thiếu cơ chế Đồng ý tự nguyện theo Luật PDPL 91/2025/QH15.' },

  { type: 'h1', text: '2. MỤC TIÊU DỰ ÁN' },
  { type: 'bullet', text: 'Mục tiêu tổng quát: Xây dựng nền tảng hạ tầng số (Pre-CRM & Relationship Layer) kết nối định danh doanh nhân, tổ chức Hội/CLB và sự kiện MICE tại Khánh Hòa với ma sát bằng 0, bảo vệ dữ liệu cá nhân theo chuẩn quốc tế.' },
  { type: 'bullet', text: 'Số hóa 100% danh thiếp và điểm danh sự kiện bằng Thẻ kim loại NFC (0.42s) & Dynamic QR Code.' },
  { type: 'bullet', text: 'Triển khai Pilot cho ít nhất 01 Hiệp hội / Sự kiện 150 – 300 người tại Nha Trang trong Quý 4/2026.' },
  { type: 'bullet', text: 'Tiết kiệm tối thiểu 85% chi phí in ấn danh thiếp/tài liệu cho các đơn vị tham gia.' },
  { type: 'bullet', text: '100% giao dịch kết nối tuân thủ cơ chế Explicit 2-Way Consent theo Luật PDPL 91/2025/QH15.' },

  { type: 'h1', text: '3. GIẢI PHÁP ĐỔI MỚI SÁNG TẠO & HẠ TẦNG CÔNG NGHỆ' },
  { type: 'bullet', text: 'Công nghệ Chạm NFC 1-Chạm Siêu Tốc (0.42s): Tương thích 100% smartphone (iOS/Android), không bắt buộc tải app (Web PWA Mobile-First).' },
  { type: 'bullet', text: 'Cơ chế Card Replacement Continuity: Đổi thẻ vật lý mới 100% không làm mất dữ liệu quan hệ.' },
  { type: 'bullet', text: 'Tiên phong Pháp lý 2-Way Consent: Dữ liệu nhạy cảm tự động che mờ (Data Masking), chỉ mở khóa khi 2 bên cùng đồng ý.' },
  { type: 'bullet', text: 'Data Sovereignty (Chủ quyền dữ liệu): Cho phép doanh nhân tự Bật/Tắt hiển thị công khai, Xuất bản sao dữ liệu (Điều 14) và Xóa vĩnh viễn dữ liệu (Điều 16).' },

  { type: 'h1', text: '4. MÔ HÌNH KINH DOANH (4 DÒNG DOANH THU)' },
  { type: 'bullet', text: '1. Bán phôi thẻ NFC kim loại Laser cao cấp: 250,000 – 600,000 VNĐ / thẻ (Margin lợi nhuận ~60%).' },
  { type: 'bullet', text: '2. Gói thuê bao SaaS Quản trị Hiệp hội: 5,000,000 – 15,000,000 VNĐ / năm.' },
  { type: 'bullet', text: '3. Gói phần mềm Trạm Check-in Sự kiện MICE: 3,000,000 – 10,000,000 VNĐ / sự kiện.' },
  { type: 'bullet', text: '4. Dịch vụ AI B2B Matchmaking Doanh nghiệp theo sự kiện.' },

  { type: 'h1', text: '5. KẾ HOẠCH TRIỂN KHAI THỰC TẾ TẠI KHÁNH HÒA' },
  {
    type: 'table',
    rows: [
      ['Giai đoạn', 'Thời gian', 'Mục tiêu & Kết quả dự kiến'],
      ['GĐ 1: Nộp hồ sơ & Hoàn thiện Pilot', 'Tháng 08/2026', 'Nộp hồ sơ Cuộc thi ĐMST Khánh Hòa 2026; kiểm thử nội bộ 50 người dùng.'],
      ['GĐ 2: Ươm tạo & Triển khai Sự kiện MICE', 'Tháng 09 – 10/2026', 'Phối hợp 01 Hiệp hội tại Nha Trang tổ chức trạm check-in cho 150 – 300 đại biểu.'],
      ['GĐ 3: Vòng Chung kết & Gọi vốn mồi', 'Tháng 11 – 12/2026', 'Báo cáo kết quả Pilot trước Hội đồng Giám khảo; Kêu gọi vốn $30,000 – $50,000 USD.'],
      ['GĐ 4: Thương mại hóa toàn diện', 'Năm 2027', 'Triển khai cho 20+ Hiệp hội và 50+ sự kiện MICE tại Khánh Hòa và Nam Trung Bộ.']
    ]
  },

  { type: 'h1', text: '6. ĐÁNH GIÁ TÁC ĐỘNG KINH TẾ, XÃ HỘI & MÔI TRƯỜNG (ESG)' },
  { type: 'bullet', text: 'Môi trường (E): Giảm thiểu hàng triệu tờ giấy in ấn, hướng tới mô hình sự kiện không giấy tờ (Paperless MICE) và Net Zero.' },
  { type: 'bullet', text: 'Xã hội (S): Nâng cao nhận thức bảo vệ dữ liệu cá nhân theo Luật PDPL 91/2025; tạo lập môi trường giao thương minh bạch, tin cậy.' },
  { type: 'bullet', text: 'Quản trị (G): Cung cấp báo cáo dữ liệu định lượng, truy vết thời gian thực (Idempotent Audit Log).' },

  { type: 'h1', text: '7. ĐỀ XUẤT KÊU GỌI NGUỒN LỰC HỖ TRỢ' },
  { type: 'bullet', text: '1. Hỗ trợ từ Chương trình Ươm tạo ĐMST (Sở KH&CN): Không gian vườn ươm, tư vấn SHTT và kết nối chuyên gia Mentor.' },
  { type: 'bullet', text: '2. Tạo điều kiện Pilot tại các sự kiện, diễn đàn xúc tiến đầu tư, TECHFEST của tỉnh Khánh Hòa.' },
  { type: 'bullet', text: '3. Kết nối nguồn vốn đầu tư: Tiếp cận các quỹ tài trợ ĐMST (ADB, NIC) và Nhà đầu tư thiên thần với quy mô $30,000 – $50,000 USD.' }
];

// ----------------------------------------------------------------------------
// 3. GENERATE SECURITY MECHANISM & DATA FLOW SIMULATION DOCX (REDESIGNED)
// ----------------------------------------------------------------------------
const securitySections = [
  { type: 'title', text: 'TIẾN TRÌNH LUỒNG DỮ LIỆU & BẢO MẬT KHI 2 DOANH NHÂN GẶP NHAU' },
  { type: 'subtitle', text: 'Hệ Thống Giao Thương B2B One Connect Network | Chuẩn PDPL 91/2025' },
  
  { type: 'callout', text: 'Mục tiêu: Đơn giản hóa toàn bộ luồng công nghệ phức tạp thành 4 BƯỚC TRỰC QUAN — DỄ NHÌN — DỄ HIỂU, minh họa rõ sự biến đổi trạng thái dữ liệu trên màn hình điện thoại của 2 doanh nhân theo từng giây.' },

  { type: 'h1', text: 'TỔNG QUAN 4 BƯỚC VẬN HÀNH TRỰC QUAN' },
  { type: 'bullet', text: '📱 BƯỚC 1: TIẾP XÚC 1-CHẠM NFC (0.42 Giây) — Mở Hồ Sơ Số 3D, Tự động che mờ SĐT & Email (Data Masking).' },
  { type: 'bullet', text: '🤝 BƯỚC 2: GỬI YÊU CẦU ĐỒNG THUẬN (1 - 3 Giây) — Bấm "Yêu Cầu Kết Nối", Bắn thông báo Realtime tới điện thoại đối tác.' },
  { type: 'bullet', text: '🔓 BƯỚC 3: XÁC THỰC 2-WAY CONSENT (5 Giây) — Cả 2 bên bấm Đồng ý, Mở khóa đầy đủ SĐT, Email và tải vCard vào máy.' },
  { type: 'bullet', text: '🧠 BƯỚC 4: BỘ NHỚ QUAN HỆ RIÊNG TƯ (10+ Giây) — Ghi chú đánh giá & Gắn nhãn Lead, bảo mật tuyệt đối bằng RLS.' },

  { type: 'h1', text: 'CHI TIẾT 4 BƯỚC & MÔ PHỎNG MÀN HÌNH ĐIỆN THOẠI' },
  
  { type: 'h2', text: 'BƯỚC 1: TIẾP XÚC 1-CHẠM NFC (0.0s - 0.42s)' },
  { type: 'callout', text: 'MÀN HÌNH ĐIỆN THOẠI DOANH NHÂN B (Thu Hà):\n• Johnny Long Hồ — Giám Đốc Dự Án Aplusvn Media\n• Công ty: Aplusvn Media & Tech | Website: aplusvn.com\n🔒 THÔNG TIN ĐANG ĐƯỢC BẢO VỆ:\n📞 Số điện thoại: 0903.***.999 (Đã che mờ)\n✉️ Email: j*****@aplusvn.com (Đã ẩn)\n[Nút bấm]: YÊU CẦU KẾT NỐI DOANH NGHIỆP' },
  { type: 'bullet', text: 'Ý nghĩa bảo mật: Không bao giờ để lộ số điện thoại cá nhân cho người lạ khi quét thẻ.' },

  { type: 'h2', text: 'BƯỚC 2: GỬI YÊU CẦU ĐỒNG THUẬN 2 CHIỀU (1s - 3s)' },
  { type: 'callout', text: 'THÔNG BÁO TRÊN ĐIỆN THOẠI DOANH NHÂN A (Johnny Long):\n✨ YÊU CẦU KẾT NỐI MỚI\n• Doanh nhân: Thu Hà (Giám Đốc Aplus Travel)\n• Bối cảnh: Diễn Đàn MICE Nha Trang 2026 (09:42 AM, 18/08/2026)\n"Thu Hà muốn kết nối và trao đổi danh bạ cùng bạn."\n[Lựa chọn]: ❌ ĐỂ SAU   hoặc   ✅ CHẤP NHẬN KẾT NỐI' },
  { type: 'bullet', text: 'Hệ thống tự động tạo bản ghi PENDING gắn chặt mã sự kiện MICE Nha Trang 2026.' },

  { type: 'h2', text: 'BƯỚC 3: XÁC THỰC 2 CHIỀU HOÀN TẤT & MỞ KHÓA (5s)' },
  { type: 'callout', text: 'KẾT NỐI THÀNH CÔNG — CẢ 2 BÊN CÙNG THẤY:\n🔓 DỮ LIỆU ĐÃ ĐƯỢC GIẢI MÃ HOÀN TOÀN:\n📞 Số điện thoại chính thức: 0903.888.999\n✉️ Email làm việc: johnny@aplusvn.com | Zalo: zalo.me/0903888999\n[Nút bấm]: 📥 TẢI TOÀN BỘ DANH BẠ VÀO ĐIỆN THOẠI (Kèm ảnh đại diện, chức vụ, bối cảnh)' },
  { type: 'bullet', text: 'Kết quả: 1 chạm là gọi điện, nhắn Zalo hoặc gửi Email mà không phải gõ tay bất kỳ ký tự nào.' },

  { type: 'h2', text: 'BƯỚC 4: BỘ NHỚ QUAN HỆ RIÊNG TƯ (Zero-Knowledge Layer)' },
  { type: 'callout', text: 'GHI CHÚ RIÊNG TƯ CỦA BẠN (CHỈ DUY NHẤT BẠN THẤY):\n• Đối tác: Thu Hà (Aplus Travel) | Gặp tại: Gian hàng A1 — MICE Nha Trang 2026\n• Nội dung ghi chú: "Đối tác cần báo giá 300 thẻ NFC cho đoàn MICE vào tháng 10. Gửi báo giá trước thứ 6."\n🏷️ Gắn nhãn: [⭐ VIP LEAD] [🔥 TIỀM NĂNG CAO] | Lịch gọi lại: 09:00 AM Thứ Sáu\n🔒 BẢO MẬT RLS: Thu Hà hoàn toàn không thể đọc được những đánh giá riêng tư này của bạn!' },

  { type: 'h1', text: 'BẢNG SO SÁNH TRẠNG THÁI DỮ LIỆU TRƯỚC VÀ SAU KHI KẾT NỐI' },
  {
    type: 'table',
    rows: [
      ['Hạng mục dữ liệu', 'Trạng thái Ban Đầu (Chưa duyệt)', 'Trạng thái Sau Khi Đồng Thuận 2 Chiều'],
      ['Họ tên & Chức danh', 'Xem bình thường', 'Xem bình thường'],
      ['Công ty & Mã số thuế', 'Xem bình thường', 'Xem bình thường'],
      ['Số điện thoại cá nhân', 'Che mờ: 0903.***.999', 'Mở khóa: 0903.888.999'],
      ['Email liên hệ', 'Ẩn mã: j*****@aplusvn.com', 'Mở khóa: johnny@aplusvn.com'],
      ['Ghi chú đánh giá (Notes)', 'Chưa kích hoạt', 'Mở khóa riêng tư (Chỉ tác giả thấy)'],
      ['Tải danh bạ vCard', 'Chỉ tải thông tin chung', 'Tải đầy đủ SĐT + Ảnh + Ghi chú sự kiện']
    ]
  }
];

createDocx(
  path.join(__dirname, 'Co_Che_Bao_Mat_Va_Mo_Phong_Luong_Du_Lieu.docx'),
  'Cơ Chế Bảo Mật Và Mô Phỏng Luồng Dữ Liệu',
  securitySections
);


