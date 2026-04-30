import express from 'express';
import 'dotenv/config';
import categoryRoutes from './routes/categoryRoutes.mjs';

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());

app.use('/categories', categoryRoutes);

app.listen(PORT, () => {
    console.log(`[Category Service] berjalan lancar di port ${PORT}`);
});
