import express from 'express';
import { setupProxies } from './routes/proxyRoutes.mjs';
import 'dotenv/config';


const app = express();
const PORT = process.env.PORT || 3000;

setupProxies(app);

app.get('/', (req, res) => {
    res.send("API Gateway berjalan sebagai Shared Gatekeeper!");
});

app.listen(PORT, () => {
    console.log(`[API Gateway] bersiaga penuh di port ${PORT || 3000}`);
});