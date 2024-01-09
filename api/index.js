import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";
import { errorHandlerMiddleware } from "./middleware/errorHandler.middleware.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose
    .connect(process.env.MONGO_CONNECTION)
    .then(() => {
        console.log("connected to mongodb");
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cookieParser());
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "../public/assets")));

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.get('/api/dev/health', (req, res) => {
    try {
        res.status(200).json({db: mongoose.STATES[mongoose.connection.readyState]})
    } catch (error) {
        console.log(error);
    }
});

// Error handler
app.use(errorHandlerMiddleware);

const server = app.listen(3000, () => {
    console.log('MongoDB: ' + mongoose.STATES[mongoose.connection.readyState]);
    console.log("server running on :3000");
});

process.on('SIGTERM', () => {
    console.debug("Server shutting down [SIGTERM]");
    server.close(() => {console.debug('HTTP Server closed')});
    mongoose.disconnect();
})
