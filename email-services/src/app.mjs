import express from 'express';
import 'dotenv/config';
import validationInternalKey from './middleware/authMiddleware.mjs';
import emailRoutes from './routes/emailRoutes.mjs';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

app.use(validationInternalKey);

app.use('/email', emailRoutes);

app.listen(PORT, () => {
    console.log(`[Email Service] berjalan lancar di port ${PORT}`);
});
