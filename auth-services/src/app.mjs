import express from 'express';
import passport from 'passport';
import 'dotenv/config';
import authRoutes from "./routes/authRoutes.mjs";
import passportLocalStrategy from './middleware/passportLocalStrategy.mjs';
import passportGoogleStrategy from './middleware/passportGoogleStrategy.mjs';

const app = express();
const PORT = process.env.PORT || 3001; 

app.use(express.json());

passportLocalStrategy();
passportGoogleStrategy();
app.use(passport.initialize());

app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`[Auth Service] berjalan di port ${PORT}`);
});