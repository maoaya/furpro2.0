import React, { useEffect, useState } from 'react'

export default function DeployPanel() {
  const [distReady, setDistReady] = useState(false)

  useEffect(() => {
    // Simple check: attempt to fetch index.html from dist
    fetch('/dist/index.html', { method: 'HEAD' })
      .then(res => setDistReady(res.ok))
      .catch(() => setDistReady(false))
  }, [])

  return (
    <div style={{ padding: 24, color: '#FFD700' }}>
      <h2>🚀 Despliegue (Netlify)</h2>
      <div style={{ color: '#ccc', marginBottom: 12 }}>Estado build: {distReady ? 'OK (dist listo)' : 'dist no encontrado'}</div>
      <div style={{ background: '#111', border: '1px solid #333', borderRadius: 8, padding: 12 }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Pasos rápidos</div>
        <pre style={{ whiteSpace: 'pre-wrap', color: '#fff' }}>{`
# Build producción
npm run build

# Login y link (si no está)
netlify login
netlify link

# Deploy a producción
netlify deploy --prod --dir=dist
`}</pre>
      </div>
      <div style={{ marginTop: 16 }}>
        <button onClick={() => alert('Despliegue vía CLI. Usa los comandos mostrados.')} style={{ background: 'linear-gradient(135deg,#FFD700,#FF9F0D)', color: '#000', border: 'none', padding: '10px 16px', borderRadius: 8, fontWeight: 800 }}>Deploy (instrucciones)</button>
      </div>
    </div>
  )
}
