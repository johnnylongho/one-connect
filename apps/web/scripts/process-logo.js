import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function processLogo() {
  const inputPath = 'd:/ONE CONNECT/one-connect/apps/web/public/one_connect_final_logo_orange.png';
  const outputPath = 'd:/ONE CONNECT/one-connect/apps/web/public/one_connect_final_logo_orange.png';
  const transparentPath = 'd:/ONE CONNECT/one-connect/apps/web/public/one_connect_logo_transparent.png';

  console.log('Reading input logo from:', inputPath);
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  console.log('Image metadata:', metadata);

  // Get raw uncompressed pixel buffer (RGBA)
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  console.log(`Dimensions: ${info.width}x${info.height}, channels: ${info.channels}`);

  // Create clean transparent background:
  // Identify dark background pixels (near black: R < 35, G < 35, B < 35 or close to dark gray)
  // and set their alpha to 0 with smooth antialiasing threshold
  const pixelCount = info.width * info.height;
  for (let i = 0; i < pixelCount; i++) {
    const offset = i * info.channels;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    if (brightness < 32) {
      // Complete background black -> 0 alpha
      data[offset + 3] = 0;
    } else if (brightness < 55) {
      // Soft antialiased edge
      const alphaFactor = (brightness - 32) / 23;
      data[offset + 3] = Math.round(alphaFactor * 255);
    }
  }

  // Trim excess transparent borders so the logo icon is tight and clear
  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .trim()
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(transparentPath);

  // Overwrite the original with transparent version
  fs.copyFileSync(transparentPath, outputPath);
  fs.copyFileSync(transparentPath, 'd:/ONE CONNECT/one-connect/apps/web/public/logo.png');

  console.log('Successfully created transparent logo assets in public directory!');
}

processLogo().catch(err => {
  console.error('Error processing logo:', err);
});
