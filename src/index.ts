import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testSupabaseConnection } from './config/supabase';
import { authenticate } from './middleware/authMiddleware';

import complaintsRouter from './routes/complaintRoutes';
import authRouter from './routes/authRoutes';
import serviceroute from './routes/serviceRoute'
import noticeroutes from './routes/noticeroutes';
import pollroutes from './routes/pollroutes';
import bookingroutes from './routes/bookingroutes';
import chatbotRouter from './routes/chatbotRoutes';
import eventroutes from './routes/eventRoute';
import emergencyroutes from './routes/emergencyRoute';
import availemergencyroutes from './routes/emergencyservicesRoute';

import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorMiddleware'; 
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOriginsEnv = process.env.CORS_ORIGINS || '';
const allowedOrigins = allowedOriginsEnv.split(',').map(o => o.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, 
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
}));

app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use('/api/auth', authRouter);
app.use('/api/complaints', authenticate, complaintsRouter);
app.use('/api/notice', authenticate, noticeroutes);
app.use('/api/poll', authenticate, pollroutes);
app.use('/api/services', authenticate, serviceroute);
app.use('/api/bookings', authenticate, bookingroutes);
app.use('/api/chatbot', chatbotRouter);
app.use('/api/availemergency', availemergencyroutes);
app.use('/api/events',authenticate,eventroutes);
app.use('/api/emergencies',authenticate,emergencyroutes);

app.use(errorHandler);


testSupabaseConnection();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
