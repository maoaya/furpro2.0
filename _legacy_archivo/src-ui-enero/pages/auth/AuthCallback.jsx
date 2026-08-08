import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../supabaseClient'
import cardManager from '../../services/CardManager'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('Autenticando...')

  useEffect(() => {
    let isMounted = true

    const handleOAuthCallback = async () => {
      try {
        console.log('=== AuthCallback START ===')
        console.log('URL:', window.location.href)
        if (isMounted) setStatus('Procesando autenticación...')

        // Paso 1: Obtener sesión
        if (isMounted) setStatus('Paso 1: obteniendo sesión...')
        console.log('📍 Step 1: Obteniendo sesión...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('❌ Error:', sessionError)
          if (isMounted) setStatus(`Error: ${sessionError.message}`)
          setTimeout(() => window.location.href = '/', 2000)
          return
        }

        if (!session) {
          // 1) Intentar flujo PKCE (code en query)
          const url = new URL(window.location.href)
          const code = url.searchParams.get('code')
          if (code) {
            try {
              console.log('🔄 Intercambiando code por sesión (PKCE)...')
              if (isMounted) setStatus('Paso 2: intercambiando código OAuth...')
              const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
              if (exchangeError) {
                console.error('❌ Error al intercambiar código:', exchangeError)
              }
            } catch (ex) {
              console.error('❌ Excepción en exchangeCodeForSession:', ex)
            }
          }

          // 2) Intentar flujo hash (access_token/refresh_token en fragment)
          if (!code && window.location.hash) {
            const params = new URLSearchParams(window.location.hash.slice(1))
            const access_token = params.get('access_token')
            const refresh_token = params.get('refresh_token')
            if (access_token && refresh_token) {
              try {
                console.log('🔄 Seteando sesión desde fragment (hash tokens)...')
                if (isMounted) setStatus('Paso 2b: restaurando sesión del hash...')
                const { error: setError } = await supabase.auth.setSession({ access_token, refresh_token })
                if (setError) {
                  console.error('❌ Error al setear sesión desde hash:', setError)
                }
              } catch (ex) {
                console.error('❌ Excepción en setSession hash:', ex)
              }
            }
          }

          console.warn('⚠️ No hay sesión, esperando...')
          if (isMounted) setStatus('Paso 3: esperando sesión de Supabase...')
          // Esperar un poco a que Supabase procese
          await new Promise(r => setTimeout(r, 1000))
          
          const { data: { session: session2 } } = await supabase.auth.getSession()
          if (!session2) {
            console.error('❌ No hay sesión después de esperar')
            if (isMounted) setStatus('No se encontró sesión. Redirigiendo...')
            setTimeout(() => window.location.href = '/', 2000)
            return
          }
          
          console.log('✅ Sesión obtenida después de esperar')
          await processCardCreation(session2, isMounted)
          return
        }

        if (isMounted) setStatus('Paso 4: sesión obtenida, creando card...')
        console.log('✅ Sesión obtenida:', session.user.id)
        await processCardCreation(session, isMounted)
        
      } catch (error) {
        console.error('❌ Error fatal:', error)
        if (isMounted) setStatus(`Error: ${error.message}`)
      }
    }
    
    const processCardCreation = async (session, mounted) => {
      try {
        const userId = session.user.id

        // Leer datos del formulario
        console.log('📄 Leyendo datos de formulario...')
        const draftStr = localStorage.getItem('draft_carfutpro')
        const pendingDataStr = localStorage.getItem('pendingProfileData')
        
        let formData = {}
        
        if (draftStr) {
          try {
            formData = JSON.parse(draftStr)
            console.log('✓ draft_carfutpro:', Object.keys(formData))
          } catch (e) {
            console.error('Error parsing draft:', e)
          }
        }
        
        if (pendingDataStr) {
          try {
            formData = { ...formData, ...JSON.parse(pendingDataStr) }
            console.log('✓ pendingProfileData:', Object.keys(formData))
          } catch (e) {
            console.error('Error parsing pending:', e)
          }
        }

        // Preparar avatar
        let avatarUrl = formData.avatar_url || session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || `https://i.pravatar.cc/300?u=${userId}`
        
        if (avatarUrl?.startsWith('data:')) {
          console.log('📸 Subiendo avatar...')
          if (mounted) setStatus('Subiendo foto de perfil...')
          try {
            const file = cardManager.dataURLtoFile(avatarUrl, `avatar-${userId}.jpg`)
            avatarUrl = await cardManager.uploadAvatar(userId, file)
            console.log('✅ Avatar subido')
          } catch (err) {
            console.error('⚠️  Error subiendo avatar:', err.message)
            avatarUrl = `https://i.pravatar.cc/300?u=${userId}`
          }
        }

        // Preparar datos de perfil
        const profileData = {
          id: userId,
          nombre: formData.nombre || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Jugador',
          apellido: formData.apellido || '',
          avatar_url: avatarUrl,
          ciudad: formData.ciudad || '',
          pais: formData.pais || '',
          posicion_favorita: formData.posicion || formData.posicion_favorita || 'Flexible',
          edad: formData.edad ? Number(formData.edad) : null,
          pierna_dominante: formData.pie || formData.pierna_dominante || 'Derecha',
          altura: formData.estatura || formData.altura || '',
          peso: formData.peso || '',
          equipo: formData.equipo || formData.equipo_favorito || '—',
          nivel_habilidad: formData.nivel_habilidad || 'Principiante',
          categoria: formData.categoria || 'masculina'
        }

        console.log('📋 Datos del perfil:', profileData)

        // Crear card
        console.log('📍 Creando card...')
        if (mounted) setStatus('Creando tu card FutPro...')
        
        try {
          const card = await cardManager.getOrCreateCard(userId, profileData)
          console.log('✅ Card creada:', card.id)
          if (mounted) setStatus('✅ Card creada correctamente')
          
          // Guardar en localStorage
          localStorage.setItem('futpro_user_card_data', JSON.stringify({
            ...card,
            esPrimeraCard: true,
            fecha_registro: new Date().toISOString()
          }))
          localStorage.setItem('show_first_card', 'true')
          
          // Limpiar datos temporales
          console.log('🧹 Limpiando localStorage...')
          localStorage.removeItem('pendingProfileData')
          localStorage.removeItem('draft_carfutpro')
          localStorage.removeItem('post_auth_origin')
          localStorage.removeItem('post_auth_target')

          // Redirigir
          console.log('✅ Redirigiendo a /perfil-card...')
          setTimeout(() => {
            if (mounted) navigate('/perfil-card')
          }, 1500)
          
        } catch (cardError) {
          console.error('❌ Error creando card:', {
            message: cardError.message,
            details: cardError.details,
            hint: cardError.hint,
            code: cardError.code,
            status: cardError.status
          })
          if (mounted) setStatus(`Error creando card: ${cardError.message || cardError.code || cardError.status || 'desconocido'}`)
          
          // Redirigir a perfil-card de todas formas (intenta crear ahí)
          setTimeout(() => {
            if (mounted) navigate('/perfil-card')
          }, 2000)
        }
      } catch (error) {
        console.error('❌ Error procesando card:', error)
        throw error
      }
    }

    handleOAuthCallback()

    return () => {
      isMounted = false
    }
  }, [navigate])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '20px',
      backgroundColor: '#0f172a',
      color: '#fff',
      fontFamily: 'system-ui'
    }}>
      <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>⚽ FutPro VIP</div>
      <div style={{ fontSize: '16px', color: '#a0aec0', textAlign: 'center', maxWidth: '400px', padding: '0 20px' }}>
        {status}
      </div>
      <div style={{ 
        marginTop: '40px', 
        width: '40px', 
        height: '40px', 
        border: '3px solid #3b82f6', 
        borderRadius: '50%', 
        borderTopColor: 'transparent', 
        animation: 'spin 1s linear infinite' 
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
