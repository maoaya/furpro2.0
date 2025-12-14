import React from 'react'
import { useAuth } from '../context/AuthContext'

const ADMIN_EMAILS = [
  'admin@futpro.vip',
  'lenovo@example.com'
]

export default function AdminGate({ children }) {
  const { user } = useAuth()
  const isAdmin = !!user && (user.role === 'admin' || ADMIN_EMAILS.includes(user.email))

  if (!user) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ color: '#ff6666', fontWeight: 800 }}>Acceso restringido</div>
        <div style={{ color: '#ccc' }}>Inicia sesión para continuar.</div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ color: '#ff6666', fontWeight: 800 }}>Solo administradores</div>
        <div style={{ color: '#ccc' }}>Tu cuenta no tiene permisos para esta sección.</div>
      </div>
    )
  }

  return <>{children}</>
}
