import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export const testSupabaseConnection = async () => {
    try {
      const { error } = await supabase.auth.signOut();
  
      if (error && error.message !== 'User is not logged in.') {
        throw error;
      }
  
      console.log('Successfully connected to Supabase!');
    } catch (error) {
      console.error('Failed to connect to Supabase:', (error as Error).message);
    }
  };

export default supabase;