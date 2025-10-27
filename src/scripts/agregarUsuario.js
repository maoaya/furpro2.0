// Script para agregar usuario a Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ogm0dfdzhez3fiomlxpug.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbTBkZmR6aGVwejNmaW9tbHhwdWciLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNjA5MDY2MSwiZXhwIjoyMDUxNjY2NjYxfQ.sb_publishable_ogM0DfDZHePZ3FiOmlxpUg_WPURRcKm'
);

const usuario = {
  id: "812f5bed-65b3-4868-a99a-3bdbcd9b55fa",
  email: "mauroayala759@gmail.com",
  role: "authenticated",
  email_confirmed_at: "2025-08-05 19:50:23.629832+00",
  encrypted_password: "$2a$10$vQlngHQLLM3n9TUuy2eiWOCZY8f2EHM7URbdlEnZifeO9pHi3OQNq",
  created_at: "2025-08-05 19:50:23.56757+00",
  updated_at: "2025-08-05 19:50:23.635757+00",
  raw_app_meta_data: { provider: "email", providers: ["email"] },
  raw_user_meta_data: { email_verified: true },
  is_sso_user: false,
  is_anonymous: false
};

async function agregarUsuario() {
  const { data, error } = await supabase
    .from('users')
    .upsert([usuario]);

  if (error) {
    console.error('Error al agregar usuario:', error);
  } else {
    console.log('Usuario agregado:', data);
  }
}

agregarUsuario();
