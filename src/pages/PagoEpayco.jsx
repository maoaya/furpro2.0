import React, { useState } from 'react';

export default function PagoEpayco() {
  const [monto, setMonto] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');

  // Debes instalar el script de ePayco en tu index.html:
  // <script src="https://checkout.epayco.co/checkout.js"></script>

  const handlePago = () => {
    setFeedback('');
    if (!window.ePayco) {
      setFeedback('ePayco no está cargado');
      return;
    }
    var handler = window.ePayco.checkout.configure({
      key: 'TU_PUBLIC_KEY', // Reemplaza por tu llave pública de ePayco
      test: true // Cambia a false en producción
    });
    var data = {
      name: 'Pago FutPro',
      description: 'Pago con PSE',
      invoice: 'FUTPRO-' + Date.now(),
      currency: 'cop',
      amount: monto,
      tax_base: '0',
      tax: '0',
      country: 'co',
      lang: 'es',
      external: 'false',
      response: window.location.origin + '/exito',
      confirmation: window.location.origin + '/confirmacion',
      email_buyer: email,
      name_buyer: nombre,
      method: 'PSE'
    };
    handler.open(data);
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '60vh', padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24 }}>Pago con PSE (ePayco)</h2>
      <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" style={{ borderRadius: 8, padding: 8, marginBottom: 12 }} />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ borderRadius: 8, padding: 8, marginBottom: 12 }} />
      <input value={monto} onChange={e => setMonto(e.target.value)} placeholder="Monto a pagar" style={{ borderRadius: 8, padding: 8, marginBottom: 18 }} />
      <button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold' }} onClick={handlePago}>
        Pagar con PSE
      </button>
      {feedback && <div style={{ color: 'red', marginTop: 12 }}>{feedback}</div>}
      <div style={{ marginTop: 24, fontSize: 14 }}>
        <strong>Nota:</strong> Debes registrar tu cuenta en ePayco, obtener tu llave pública y agregar el script en index.html.
      </div>
    </div>
  );
}
