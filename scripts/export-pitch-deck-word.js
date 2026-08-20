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

async function generatePitchDeckDocx() {
  const primaryColor = '0052CC';
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

  const mdContent = fs.readFileSync(
    path.join(__dirname, '..', 'docs', 'Kich_Ban_Pitching_Deck_One_Connect_Khanh_Hoa_2026.md'),
    'utf-8'
  );

  const lines = mdContent.split('\n');
  const children = [];

  // Title Block
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: 'KỊCH BẢN THUYẾT TRÌNH PITCHING DECK (10 SLIDES)',
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
          text: 'DỰ ÁN: ONE CONNECT NETWORK — CUỘC THI KHỞI NGHIỆP ĐMST KHÁNH HÒA 2026',
          bold: true,
          size: 22,
          color: '334155',
        }),
      ],
    })
  );

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('# ')) {
      // already added header
      continue;
    } else if (trimmed.startsWith('## ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 280, after: 120 },
          children: [
            new TextRun({
              text: trimmed.replace('## ', ''),
              bold: true,
              size: 24,
              color: primaryColor,
            }),
          ],
        })
      );
    } else if (trimmed.startsWith('### ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 180, after: 80 },
          children: [
            new TextRun({
              text: trimmed.replace('### ', ''),
              bold: true,
              size: 22,
              color: '0F172A',
            }),
          ],
        })
      );
    } else if (trimmed.startsWith('> ')) {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 120 },
          children: [
            new TextRun({
              text: '🎙️ Lời thoại: ' + trimmed.replace(/^> \*/, '').replace(/\*$/, '').replace(/^> /, ''),
              italics: true,
              color: '1E3A8A',
            }),
          ],
        })
      );
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({
              text: '• ' + trimmed.replace(/^(\*|-|\d+\.)\s+/, '').replace(/\*\*/g, ''),
            }),
          ],
        })
      );
    } else if (trimmed === '---') {
      // skip divider
    } else {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({
              text: trimmed.replace(/\*\*/g, ''),
            }),
          ],
        })
      );
    }
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Arial', size: 22, color: textColor },
          paragraph: { spacing: { line: 280, after: 100 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const docsPath = path.join(__dirname, '..', 'docs', 'Kich_Ban_Pitching_Deck_One_Connect_Khanh_Hoa_2026.docx');
  fs.writeFileSync(docsPath, buffer);
  const rootPath = path.join(__dirname, '..', '..', 'KICH_BAN_PITCHING_DECK_ONE_CONNECT_2026.docx');
  fs.writeFileSync(rootPath, buffer);
  console.log('Pitch deck docx written successfully to root and docs!');
}

generatePitchDeckDocx().catch(console.error);
