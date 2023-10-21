import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.route.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath} from 'url';
import path from 'path';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(process.env.MONGO_CONNECTION).then(() => {
    console.log("connected to mongodb");
}).catch(err => {
    console.log(err);
});

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cookieParser());
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "../public/assets")));


app.listen(3000, () => {
    console.log('server running on :3000');
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});