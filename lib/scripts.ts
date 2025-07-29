import sharp from "sharp";

export async function optimizeImage(buffer: Buffer, filePath: string) {
  await sharp(buffer)
    .resize(1200, 800, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: 80,
      lossless: false,
      alphaQuality: 100,
      effort: 6,
    })
    .toFormat("webp")
    .toFile(filePath);
}
