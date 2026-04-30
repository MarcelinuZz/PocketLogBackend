import express from 'express';
import 'dotenv/config';
import walletRoutes from './routes/walletRoutes.mjs';

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());

app.use('/wallets', walletRoutes);

app.listen(PORT, () => {
    console.log(`[Wallet Service] berjalan lancar di port ${PORT}`);
});
