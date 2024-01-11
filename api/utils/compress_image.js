import sharp from "sharp";

export const compressImage = async (image) => {
  const { buffer } = image;
  return new Promise((resolve, reject) => {
    sharp(buffer)
      .webp({ quality: 50 })
      .toBuffer()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};
