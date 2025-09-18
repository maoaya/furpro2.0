import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import supabase from '../supabaseClient';

export default function NaticoBotonera() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simula interacción de usuario "natico" con todos los botones y funciones
    async function interactuar() {
      // Navega por las páginas principales
      navigate('/usuarios');
      navigate('/torneos');
      navigate('/equipos');
      navigate('/ranking');
      navigate('/pagos');
      navigate('/actividad');
      navigate('/reportes');
      // Postea en el feed
      await supabase.from('feed').insert({
        usuario: 'natico',
        titulo: '¡Hola FutPro!',
        descripcion: 'Probando todos los botones y funciones como natico.',
        fecha: new Date().toISOString(),
        media: null
      });
      // Postea en su perfil
      await supabase.from('feed').insert({
        usuario: 'natico',
        titulo: 'Post de natico',
        descripcion: 'Este es un post de prueba en el perfil de natico.',
        fecha: new Date().toISOString(),
        media: null
      });
    }
    interactuar();
  }, [navigate]);

  return (
    <div style={{ padding: 32 }}>
      <h2>Botonera de pruebas para usuario "natico"</h2>
      <Button onClick={() => navigate('/usuarios')}>Ir a Usuarios</Button>
      <Button onClick={() => navigate('/torneos')}>Ir a Torneos</Button>
      <Button onClick={() => navigate('/equipos')}>Ir a Equipos</Button>
      <Button onClick={() => navigate('/ranking')}>Ir a Ranking</Button>
      <Button onClick={() => navigate('/pagos')}>Ir a Pagos</Button>
      <Button onClick={() => navigate('/actividad')}>Ir a Actividad</Button>
      <Button onClick={() => navigate('/reportes')}>Ir a Reportes</Button>
      <Button onClick={async () => {
        await supabase.from('feed').insert({
          usuario: 'natico',
          titulo: 'Post manual',
          descripcion: 'Post manual desde la botonera.',
          fecha: new Date().toISOString(),
          media: null
        });
        alert('Post creado por natico');
      }}>Postear como natico</Button>
    </div>
  );
}