import express from 'express';
import dotenv from 'dotenv';
import supabase, { testSupabaseConnection } from './config/supabase';
import noticeroutes from './routes/noticeroutes';
import pollroutes from './routes/pollroutes';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/notice', noticeroutes);
app.use('/poll', pollroutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  testSupabaseConnection();
});