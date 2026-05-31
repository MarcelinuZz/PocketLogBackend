import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import authRoutes from "./routes/authRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import passportLocalStrategy from './middleware/passportLocalStrategy.mjs';
import passportGoogleStrategy from './middleware/passportGoogleStrategy.mjs';

const app = express();
const PORT = process.env.PORT || 3001; 

app.use(cors({
    origin: process.env.FLUTTER_APP_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, '../public')));

app.use(passport.initialize());

passportLocalStrategy();
passportGoogleStrategy();

app.use('/auth', authRoutes);

app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`[Auth Service] berjalan di port ${PORT}`);
});