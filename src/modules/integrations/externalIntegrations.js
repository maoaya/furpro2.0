import OpenAI from 'openai';
// import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';
import firebase from 'firebase/app';

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// export const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
firebase.initializeApp({ apiKey: process.env.FIREBASE_API_KEY });
