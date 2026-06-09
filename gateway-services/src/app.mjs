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

app.listen(PORT, async () => {
    console.log(`[API Gateway] bersiaga penuh di port ${PORT || 3000}`);

    if (process.env.NGROK_AUTHTOKEN) {
        try {
            const ngrok = await import('@ngrok/ngrok');
            const listener = await ngrok.forward({
                addr: PORT,
                authtoken: process.env.NGROK_AUTHTOKEN,
                domain: process.env.NGROK_DOMAIN,
            });

            console.log(`[API Gateway] Ngrok aktif: ${listener.url()}`);
            console.log(`[API Gateway] Google callback URL: ${listener.url()}/auth/google/callback`);
        } catch (err) {
            console.error('[API Gateway] Ngrok gagal aktif:', err.message);
        }
    }
});
