import express from 'express';
import 'dotenv/config';
import userRoutes from './routes/userRoutes.mjs';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`[Users Service] berjalan lancar di port ${PORT}`);
});