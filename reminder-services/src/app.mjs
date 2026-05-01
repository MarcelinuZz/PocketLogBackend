import express from 'express';
import 'dotenv/config';
import reminderRoutes from './routes/reminderRoutes.mjs';

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());

app.use('/reminders', reminderRoutes);

app.listen(PORT, () => {
    console.log(`[Reminder Service] berjalan lancar di port ${PORT}`);
});
