import dotenv from 'dotenv';
import express from 'express';
import prisma from './database';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
app.use(express.json());

// Update your route paths as needed
app.use('/api/users', userRoutes);

// Change health route if necessary
app.get('/health', (req, res) => {
    res.status(200).send('Healthy');
});

app.get('/api', (req, res) => {
    res.status(200).send('API root is working');
});

const PORT = 9100;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});

// Close Prisma connection on shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});
