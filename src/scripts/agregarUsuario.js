// Script para agregar usuario a Supabase
// ⚠️ DEPRECADO: Este script usa credenciales hardcodeadas antiguas
// Usar variables de entorno y la instancia compartida de supabaseClient.js

import supabase from '../supabaseClient.js';

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
