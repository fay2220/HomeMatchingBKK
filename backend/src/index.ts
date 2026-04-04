import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import scoreRouter from './routes/score.routes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to HomeMatchingBkk API' });
});

app.use('/api/score', scoreRouter);

app.get('/health', async (req, res) => {
  try {
    // Attempt a basic Prisma query to verify DB connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: String(error) });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
