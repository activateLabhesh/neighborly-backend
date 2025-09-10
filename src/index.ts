import express from 'express';
import dotenv from 'dotenv';
import { testSupabaseConnection } from './config/supabase';
import complaintsRouter from './routes/complaintRoutes';
import authRouter from './routes/authRoutes';
import { authenticate } from './middleware/authMiddleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(authenticate);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRouter);
app.use('/api/complaints', complaintsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  testSupabaseConnection();
});
