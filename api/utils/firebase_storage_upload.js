import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { customAlphabet } from "nanoid";
import { app } from "./firebase.js";
import sharp from "sharp";

const nanoid = customAlphabet("2456789abcdefghikln", 22);

const storage = getStorage(app);
const storageRef = ref(storage, "/images");

export const uploadToFirebase = async function (file) {
  try {
    // const extension = file.originalname.split(".").pop();
    const filename = file.fieldname + "_" + nanoid() + '.webp';
    const fileRef = ref(storageRef, filename);

    const metadata = {
      contentType: 'image/webp',
    };

    const buffer = await sharp(file.buffer)
      .webp({ quality: 50, nearLossless: true })
      .toBuffer();

    return new Promise((resolve, reject) => {
      uploadBytes(fileRef, buffer, metadata)
        .then(snapshot => {
          getDownloadURL(snapshot.ref).then(url => {
            resolve(url);
          });
        })
        .catch(function (error) {
          reject(error);
        });
    });
  } catch (error) {
    throw new Error(error);
  }
};
