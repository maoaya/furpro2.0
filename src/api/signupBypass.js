// src/api/signupBypass.js
export async function signupBypass({ email, password, nombre }) {
  const res = await fetch('/.netlify/functions/signup-bypass', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, nombre })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.ok) {
    const message = data?.error || `Signup bypass failed (HTTP ${res.status})`;
    return { ok: false, error: message };
  }
  return {
    ok: true,
    userId: data.userId,
    email: data.email,
    redirectLink: data.action_link
  };
}
