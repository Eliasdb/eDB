import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { RequestHandler } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import prisma from '../database';
dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
}

const JWT_SECRET: Secret = process.env.JWT_SECRET;

export const registerUser: RequestHandler = async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, password: hashedPassword },
        });
        res.status(201).json({
            message: 'User registered successfully',
            user,
        });
    } catch (error) {
        res.status(500).json({ message: 'User registration failed', error });
    }
};

export const loginUser: RequestHandler = async (req, res) => {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }

    const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
    res.json({ message: 'Login successful', token });
};
