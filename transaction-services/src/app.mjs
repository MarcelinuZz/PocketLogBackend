import express from 'express';
import 'dotenv/config';
import transactionRoutes from './routes/transactionRoutes.mjs';

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());

app.use('/transactions', transactionRoutes);

app.listen(PORT, () => {
    console.log(`[Transaction Service] berjalan lancar di port ${PORT}`);
});
