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

app.get('/api/health', (req, res) => {
    // You can include more detailed health information here if needed
    res.status(200).json({
        status: 'UP',
        timestamp: new Date(),
    });
});

// Close Prisma connection on shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});
