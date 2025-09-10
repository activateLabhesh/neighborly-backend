import express from 'express';
import dotenv from 'dotenv';
import { testSupabaseConnection } from './config/supabase';
import complaintsRouter from './routes/complaintRoutes';
import authRouter from './routes/authRoutes';
import { authenticate } from './middleware/authMiddleware';
import noticeroutes from './routes/noticeroutes';
import pollroutes from './routes/pollroutes';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRouter);
app.use('/api/complaints', authenticate, complaintsRouter);
app.use('/api/notice', authenticate, noticeroutes);
app.use('/api/poll', authenticate, pollroutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  testSupabaseConnection();
});
