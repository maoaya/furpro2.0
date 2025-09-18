import React, { useState } from 'react';
// Instala stripe-js: npm install @stripe/stripe-js
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_TU_CLAVE_PUBLICA'); // Reemplaza por tu clave pública de Stripe

export default function PagoStripe() {
  const [monto, setMonto] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handlePago = async () => {
    setLoading(true);
    setFeedback('');
    // Aquí deberías crear el PaymentIntent en tu backend y obtener el clientSecret
    // Ejemplo de llamada a tu API:
    // const res = await fetch('/api/crear-pago', { method: 'POST', body: JSON.stringify({ monto }) });
    // const { clientSecret } = await res.json();
    // Para demo, simula clientSecret:
    const clientSecret = 'demo_client_secret';
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: 'price_demo', quantity: 1 }], // Reemplaza por tu priceId
      mode: 'payment',
      successUrl: window.location.origin + '/exito',
      cancelUrl: window.location.origin + '/cancelado',
    });
    if (error) setFeedback(error.message);
    setLoading(false);
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '60vh', padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24 }}>Pago con Stripe</h2>
      <input value={monto} onChange={e => setMonto(e.target.value)} placeholder="Monto a pagar" style={{ borderRadius: 8, padding: 8, marginBottom: 18 }} />
      <button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold' }} onClick={handlePago} disabled={loading}>
        {loading ? 'Procesando...' : 'Pagar'}
      </button>
      {feedback && <div style={{ color: 'red', marginTop: 12 }}>{feedback}</div>}
      <div style={{ marginTop: 24, fontSize: 14 }}>
        <strong>Nota:</strong> Debes configurar tu backend para crear el PaymentIntent y obtener el clientSecret real.
      </div>
    </div>
  );
}
