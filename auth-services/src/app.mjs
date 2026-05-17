import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import express from 'express';
import passport from 'passport';
import authRoutes from "./routes/authRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import passportLocalStrategy from './middleware/passportLocalStrategy.mjs';
import passportGoogleStrategy from './middleware/passportGoogleStrategy.mjs';

const app = express();
const PORT = process.env.PORT || 3001; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, '../public')));

passportLocalStrategy();
passportGoogleStrategy();
app.use(passport.initialize());

app.use('/auth', authRoutes);

app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`[Auth Service] berjalan di port ${PORT}`);
});