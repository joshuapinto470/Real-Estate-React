import multer, { MulterError } from "multer";
// import { customAlphabet } from "nanoid";

// const nanoid = customAlphabet("2456789abcdefghikln", 22);

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/assets");
//     },

//     filename: (req, file, cb) => {
//         const extension = file.originalname.split(".").pop();
//         const filename = file.fieldname + "_" + nanoid() + "." + extension;
//         // req.body.avatarFileName = 'http://localhost:3000/assets/' + filename;
//         cb(null, filename);
//     },
// });

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype.split('/')[0] === 'image') {
        cb(null, true);
    } else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE'), false);
    }
}

const fileUpload = multer({ storage, fileFilter, limits: {fileSize: 10000000, files: 6}});
export default fileUpload;
