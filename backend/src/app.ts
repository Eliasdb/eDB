import dotenv from 'dotenv';
import express from 'express';
import prisma from './database';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

const PORT = 9100;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Close Prisma connection on shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});
