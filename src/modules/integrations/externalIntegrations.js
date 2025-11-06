import OpenAI from 'openai';
// import twilio from 'twilio';
import supabase from '../../supabaseClient.js';
import firebase from 'firebase/app';

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// export const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
export { supabase };
firebase.initializeApp({ apiKey: process.env.FIREBASE_API_KEY });
