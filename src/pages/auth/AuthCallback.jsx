import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('Autenticando...')

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('=== AuthCallback START ===')
        setStatus('Procesando autenticación...')

        // 1. Get current session from OAuth
        console.log('📍 Step 1: Getting session from OAuth...')
        const {
          data: { session },
          error: sessionError
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('❌ Session error:', sessionError)
          setStatus(`Error: ${sessionError.message}`)
          return
        }

        if (!session) {
          console.warn('⚠️ No session found')
          setStatus('No se encontró sesión')
          return
        }

        console.log('✅ Session obtained:', {
          user_id: session.user.id,
          email: session.user.email,
          has_picture: !!session.user.user_metadata?.picture
        })

        // 2. Get pendingProfileData from localStorage
        console.log('📍 Step 2: Reading pendingProfileData from localStorage...')
        const pendingDataStr = localStorage.getItem('pendingProfileData')
        console.log('📄 pendingProfileData raw:', pendingDataStr)

        // Intentar fallback a draft_carfutpro si no existe pendingProfileData
        let formData = {}
        if (!pendingDataStr) {
          const draftStr = localStorage.getItem('draft_carfutpro')
          if (draftStr) {
            try {
              formData = JSON.parse(draftStr)
              console.warn('ℹ️ Usando draft_carfutpro como fallback:', formData)
            } catch (e) {
              console.error('Error parsing draft_carfutpro:', e)
            }
          } else {
            console.warn('⚠️ No pendingProfileData ni draft_carfutpro encontrados, se usará mínimo')
          }
        } else {
          try {
            formData = JSON.parse(pendingDataStr)
            console.log('✅ pendingProfileData parsed:', formData)
          } catch (parseError) {
            console.error('❌ Error parsing pendingProfileData:', parseError)
          }
        }

        // 3. Build cardData from session + form data
        console.log('📍 Step 3: Building cardData...')
        console.log('📋 formData recibido:', formData)
        
        // 3.1 Intentar subir foto a Supabase Storage si es data URL
        let fotoUrl = '';
        
        if (formData.avatar_url && formData.avatar_url.startsWith('data:')) {
          console.log('📸 Foto es data URL, intentando subir a Storage...');
          try {
            // Extraer la parte base64 de data:image/jpeg;base64,xxxxx
            const parts = formData.avatar_url.split(',');
            if (parts.length === 2) {
              const base64Data = parts[1];
              const binaryString = atob(base64Data);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const blob = new Blob([bytes], { type: 'image/jpeg' });
              const fileName = `${session.user.id}-${Date.now()}.jpg`;
              
              console.log('📤 Subiendo blob a Storage:', { fileName, size: blob.size });
              const { data: uploadData, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, blob, {
                  contentType: 'image/jpeg',
                  upsert: false
                });
              
              if (uploadError) {
                console.error('❌ Error subiendo foto a Storage:', uploadError);
                console.warn('⚠️ Usando data URL como fallback (puede causar problemas con URLs muy largas)');
                // Si el data URL es muy grande (>1MB), usar avatar por defecto
                if (formData.avatar_url.length > 1000000) {
                  console.warn('⚠️ Data URL muy grande, usando avatar por defecto');
                  fotoUrl = `https://i.pravatar.cc/300?u=${session.user.id}`;
                } else {
                  fotoUrl = formData.avatar_url; // Fallback a data URL
                }
              } else {
                console.log('✅ Foto subida exitosamente a Storage:', fileName);
                const { data: publicData } = supabase.storage
                  .from('avatars')
                  .getPublicUrl(fileName);
                fotoUrl = publicData.publicUrl;
                console.log('🔗 URL pública de foto:', fotoUrl);
              }
            }
          } catch (uploadErr) {
            console.error('❌ Error procesando foto:', uploadErr);
            fotoUrl = formData.avatar_url; // Fallback a data URL
          }
        } else if (formData.avatar_url) {
          // Si no es data URL, usar directamente
          fotoUrl = formData.avatar_url;
        } else {
          // Último fallback a metadata de Google
          fotoUrl = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '';
        }
        
        console.log('📋 formData completo recibido:', formData);
        console.log('✅ fotoUrl final para card:', fotoUrl);
        
        // Ajustar a columnas reales de api.carfutpro (según MIGRATE_CARFUTPRO_TO_API.sql)
        const cardData = {
          user_id: session.user.id,
          nombre: formData.nombre || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuario',
          avatar_url: fotoUrl,
          ciudad: formData.ciudad || formData.ubicacion || null,
          pais: formData.pais || null,
          posicion: formData.posicion || formData.posicion_favorita || null,
          edad: formData.edad ? Number(formData.edad) : null,
          pie: formData.pie || formData.pierna_dominante || formData.piernaDominante || null,
          estatura: formData.estatura ? Number(formData.estatura) : (formData.altura ? Number(formData.altura) / 100 : null),
          equipo: formData.equipo || formData.equipo_favorito || formData.equipoFavorito || null,
          nivel_habilidad: formData.nivel_habilidad || formData.experiencia || null,
          // Categoria es requerida en el modelo; usar fallback seguro
          categoria: formData.categoria || 'mixto',
          puntos_totales: 35,
          card_tier: 'futpro',
          partidos_ganados: 0,
          entrenamientos: 0,
          amistosos: 0,
          puntos_comportamiento: 0,
          ultima_actualizacion: new Date().toISOString()
        };

        console.log('📋 cardData to insert:', cardData)

        // 4. Check if card already exists
        console.log('📍 Step 4: Checking if card already exists...')
        const { data: existingCard, error: selectError } = await supabase
          .from('carfutpro')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle()

        if (selectError && selectError.code !== 'PGRST116') {
          console.error('❌ Error checking existing card:')
          console.error('Full error object:', selectError)
          console.error('Error breakdown:', {
            code: selectError.code,
            message: selectError.message,
            details: selectError.details,
            hint: selectError.hint,
            status: selectError.status,
            statusText: selectError.statusText
          })
          console.error('⚠️ POSIBLE CAUSA: Tabla carfutpro no existe o RLS policy bloqueando SELECT')
          console.error('SOLUCIÓN: Ejecutar SQL en Supabase (ver EJECUTAR_SQL_AHORA.md)')
        } else if (existingCard) {
          console.log('✅ Card already exists, normalizing fields')
          // Solo actualizar campos del cardData nuevo, preservando puntos/tier existentes
          const updateData = {
            ...cardData,
            puntos_totales: existingCard.puntos_totales ?? cardData.puntos_totales ?? 35,
            card_tier: existingCard.card_tier || cardData.card_tier || 'bronce'
          }
          const { data: updatedCard, error: updateError } = await supabase
            .from('carfutpro')
            .update(updateData)
            .eq('user_id', session.user.id)
            .select()

          if (updateError) {
            console.error('❌ UPDATE error:', updateError)
            setStatus(`Error actualizando card: ${updateError.message}`)
            return
          }

          console.log('✅ Card updated:', updatedCard)
          setStatus('Card actualizada')
          localStorage.removeItem('pendingProfileData')
          setTimeout(() => navigate('/perfil-card'), 800)
          return
        }

        // 5. INSERT new card
        console.log('📍 Step 5: Inserting new card...')
        const { data: insertedCard, error: insertError } = await supabase
          .from('carfutpro')
          .insert([cardData])
          .select()

        if (insertError) {
          console.error('❌ INSERT error:')
          console.error('Full error object:', insertError)
          console.error('Error breakdown:', {
            code: insertError.code,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            status: insertError.status,
            statusText: insertError.statusText
          })
          console.error('⚠️ POSIBLES CAUSAS:')
          console.error('  1. Tabla carfutpro no existe en schema public')
          console.error('  2. RLS policy bloqueando INSERT')
          console.error('  3. Columnas faltantes en tabla')
          console.error('SOLUCIÓN: Ejecutar cards_system.sql completo en Supabase')
          setStatus(`Error al crear card: ${insertError.message}`)
          return
        }

        console.log('✅ Card created successfully:', insertedCard)
        setStatus('✅ Card creada correctamente')

        // 6. Cleanup
        console.log('📍 Step 6: Cleaning up...')
        localStorage.removeItem('pendingProfileData')

        // 7. Redirect
        console.log('📍 Step 7: Redirecting to perfil-card...')
        setTimeout(() => {
          console.log('=== AuthCallback COMPLETE ===')
          navigate('/perfil-card')
        }, 1500)

      } catch (error) {
        console.error('❌ Unexpected error:', error)
        setStatus(`Error inesperado: ${error.message}`)
      }
    }

    handleOAuthCallback()
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
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>FutPro</div>
      <div style={{ fontSize: '16px', color: '#a0aec0' }}>{status}</div>
      <div style={{ marginTop: '40px', width: '40px', height: '40px', border: '3px solid #3b82f6', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
