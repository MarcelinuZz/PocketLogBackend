import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { setupProxies } from './routes/proxyRoutes.mjs';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FLUTTER_APP_URL || "http://localhost:5173",
    credentials: true
}));

setupProxies(app);

app.get('/', (req, res) => {
    res.send("API Gateway berjalan sebagai Shared Gatekeeper!");
});

app.listen(PORT, () => {
    console.log(`[API Gateway] bersiaga penuh di port ${PORT || 3000}`);
});