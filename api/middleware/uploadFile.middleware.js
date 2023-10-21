import multer from 'multer';
import { customAlphabet } from 'nanoid';


const nanoid = customAlphabet('2456789abcdefghikln', 22)


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets");
    },

    filename: (req, file, cb) => {
        const extension = file.originalname.split('.').pop();
        const filename =  nanoid() + '.' + extension;
        req.body.avatarFileName = 'http://localhost:3000/assets/' + filename;
        cb(null, filename);
    },
});

const fileUpload = multer({ storage });
export default fileUpload;