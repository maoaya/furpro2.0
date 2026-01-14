import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

export default function CrearTorneoCompleto() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [currency, setCurrency] = useState('COP');
  const [teams, setTeams] = useState([]);
  const [nearbyTeams, setNearbyTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  
  const [form, setForm] = useState({
    // Básico
    nombre: '',
    descripcion: '',
    
    // Categoría y edad
    categoria: 'masculina',
    minEdad: null,
    maxEdad: null,
    
    // Tipo de torneo
    tipoTorneo: 'futbol11', // futbol11, futbol7, futsal, etc.
    maxJugadoresPorEquipo: 11,
    
    // Ubicación
    direccion: '',
    ciudad: '',
    pais: 'Colombia',
    coordenadas: null,
    
    // Inscripción
    tipoInscripcion: 'free', // free, paid
    costoInscripcion: 0,
    moneda: 'COP',
    maxEquipos: 16,
    minEquipos: 4,
    
    // Fechas
    fechaInicioRegistro: '',
    fechaFinRegistro: '',
    fechaInicioTorneo: '',
    fechaFinTorneo: '',
    
    // Horarios
    horarios: [], // [{dia: 'lunes', hora: '18:00'}, ...]
    
    // Reglas
    reglas: '',
    sistemaDeJuego: 'standard', // standard, zero_draw, repechaje
    tienePenaltis: true,
    distribucionPenaltis: 'winner_takes_all', // winner_takes_all, split_points
    permiteRepechaje: false,
    
    // Transmisión
    requiereStreaming: true,
    minStreamsRequeridos: 1
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const tiposCampeonato = [
    { value: 'futbol11', label: 'Fútbol 11', players: 11 },
    { value: 'futbol10', label: 'Fútbol 10', players: 10 },
    { value: 'futbol9', label: 'Fútbol 9', players: 9 },
    { value: 'futbol8', label: 'Fútbol 8', players: 8 },
    { value: 'futbol7', label: 'Fútbol 7', players: 7 },
    { value: 'futbol6', label: 'Fútbol 6', players: 6 },
    { value: 'futbol5', label: 'Fútbol 5', players: 5 },
    { value: 'futsal', label: 'Futsal', players: 5 },
    { value: 'microfutbol', label: 'Micro Fútbol', players: 5 },
    { value: 'banquitas1v1', label: 'Banquitas 1vs1', players: 1 },
    { value: 'banquitas2v2', label: 'Banquitas 2vs2', players: 2 },
    { value: 'banquitas3v3', label: 'Banquitas 3vs3', players: 3 },
    { value: 'banquitas4v4', label: 'Banquitas 4vs4', players: 4 },
    { value: 'banquitas5v5', label: 'Banquitas 5vs5', players: 5 },
    { value: 'penaltis', label: 'Torneo de Penaltis', players: 1 }
  ];

  const categorias = [
    { value: 'masculina', label: 'Masculina' },
    { value: 'femenina', label: 'Femenina' },
    { value: 'mixta', label: 'Mixta' },
    { value: 'sub-13', label: 'Sub-13' },
    { value: 'sub-17', label: 'Sub-17' },
    { value: 'libre', label: 'Libre' }
  ];

  const monedas = {
    'Colombia': 'COP',
    'Estados Unidos': 'USD',
    'España': 'EUR',
    'México': 'MXN',
    'Argentina': 'ARS',
    'Chile': 'CLP',
    'Perú': 'PEN'
  };

  useEffect(() => {
    if (form.pais && monedas[form.pais]) {
      setCurrency(monedas[form.pais]);
      setForm(prev => ({ ...prev, moneda: monedas[form.pais] }));
    }
  }, [form.pais]);

  useEffect(() => {
    const tipo = tiposCampeonato.find(t => t.value === form.tipoTorneo);
    if (tipo) {
      setForm(prev => ({ ...prev, maxJugadoresPorEquipo: tipo.players }));
    }
  }, [form.tipoTorneo]);

  useEffect(() => {
    if (user) {
      loadUserTeams();
      loadNearbyTeams();
    }
  }, [user, form.ciudad, form.categoria]);

  const loadUserTeams = async () => {
    try {
      const { data } = await supabase
        .from('teams')
        .select('*')
        .eq('captain_id', user?.id)
        .order('name');
      setTeams(data || []);
    } catch (err) {
      console.error('Error cargando equipos:', err);
    }
  };

  const loadNearbyTeams = async () => {
    if (!form.ciudad) return;
    
    try {
      const { data } = await supabase
        .from('teams')
        .select('*')
        .ilike('city', `%${form.ciudad}%`)
        .order('name')
        .limit(20);
      setNearbyTeams(data || []);
    } catch (err) {
      console.error('Error cargando equipos cercanos:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const addHorario = () => {
    setForm(prev => ({
      ...prev,
      horarios: [...prev.horarios, { dia: 'lunes', hora: '18:00' }]
    }));
  };

  const removeHorario = (index) => {
    setForm(prev => ({
      ...prev,
      horarios: prev.horarios.filter((_, i) => i !== index)
    }));
  };

  const updateHorario = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      horarios: prev.horarios.map((h, i) => 
        i === index ? { ...h, [field]: value } : h
      )
    }));
  };

  const toggleTeamSelection = (teamId) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const sendInvitations = async (tournamentId) => {
    try {
      const invitations = selectedTeams.map(teamId => ({
        tournament_id: tournamentId,
        team_id: teamId,
        invited_by: user?.id,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }));

      const { error: inviteErr } = await supabase
        .from('tournament_invitations')
        .insert(invitations);

      if (inviteErr) throw inviteErr;

      // Notificar a capitanes
      for (const teamId of selectedTeams) {
        const { data: teamData } = await supabase
          .from('teams')
          .select('captain_id, name')
          .eq('id', teamId)
          .single();

        if (teamData) {
          await supabase
            .from('tournament_notifications')
            .insert([{
              tournament_id: tournamentId,
              recipient_id: teamData.captain_id,
              notification_type: 'invitation',
              title: `Invitación al torneo ${form.nombre}`,
              message: `Tu equipo ${teamData.name} ha sido invitado a participar en el torneo.`
            }]);
        }
      }
    } catch (err) {
      console.error('Error enviando invitaciones:', err);
    }
  };

  const notifyNearbyFans = async (tournamentId) => {
    try {
      // Notificar a fans de equipos del creador
      const { data: followersData } = await supabase
        .from('follows')
        .select('follower_id')
        .eq('following_id', user?.id);

      if (followersData) {
        const notifications = followersData.map(f => ({
          tournament_id: tournamentId,
          recipient_id: f.follower_id,
          notification_type: 'new_tournament',
          title: `Nuevo torneo en ${form.ciudad}`,
          message: `${form.nombre} - ${form.descripcion || 'Únete ahora!'}`
        }));

        await supabase
          .from('tournament_notifications')
          .insert(notifications);
      }
    } catch (err) {
      console.error('Error notificando fans:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!form.nombre || !form.fechaInicioTorneo || !form.ciudad) {
      setError('Por favor completa todos los campos requeridos');
      setLoading(false);
      return;
    }

    try {
      // Crear torneo
      const { data: tournamentData, error: tournamentErr } = await supabase
        .from('tournaments')
        .insert([{
          name: form.nombre,
          description: form.descripcion,
          creator_id: user?.id,
          category: form.categoria,
          min_age: form.minEdad,
          max_age: form.maxEdad,
          tournament_type: form.tipoTorneo,
          max_players_per_team: form.maxJugadoresPorEquipo,
          address: form.direccion,
          city: form.ciudad,
          country: form.pais,
          coordinates: form.coordenadas,
          registration_type: form.tipoInscripcion,
          registration_fee: parseFloat(form.costoInscripcion),
          currency: form.moneda,
          max_teams: parseInt(form.maxEquipos),
          min_teams: parseInt(form.minEquipos),
          registration_start: form.fechaInicioRegistro,
          registration_end: form.fechaFinRegistro,
          tournament_start: form.fechaInicioTorneo,
          tournament_end: form.fechaFinTorneo,
          match_schedule: form.horarios,
          rules: form.reglas,
          scoring_system: form.sistemaDeJuego,
          has_penalties: form.tienePenaltis,
          penalties_distribution: form.distribucionPenaltis,
          allow_repechaje: form.permiteRepechaje,
          requires_streaming: form.requiereStreaming,
          min_streams_required: parseInt(form.minStreamsRequeridos),
          status: 'registration_open',
          published_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (tournamentErr) throw tournamentErr;

      // Enviar invitaciones si hay equipos seleccionados
      if (selectedTeams.length > 0) {
        await sendInvitations(tournamentData.id);
      }

      // Notificar a fans cercanos
      await notifyNearbyFans(tournamentData.id);

      setSuccess('✅ ¡Torneo creado exitosamente!');
      setTimeout(() => {
        navigate(`/torneo/${tournamentData.id}`);
      }, 2000);
    } catch (err) {
      console.error('Error creando torneo:', err);
      setError('Error al crear el torneo. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 7));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)', padding: 32, color: '#FFD700' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <button onClick={() => navigate('/torneos')} style={{ background: 'transparent', border: '2px solid #FFD700', color: '#FFD700', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', marginBottom: 20 }}>
          ← Volver
        </button>

        <h1 style={{ fontSize: 42, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>🏆 Crear Torneo Completo</h1>
        <p style={{ textAlign: 'center', color: '#FFD70099', marginBottom: 32 }}>Configura tu torneo profesional con todas las funcionalidades</p>

        {/* Stepper */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40, gap: 12 }}>
          {[
            '1. Básico',
            '2. Categoría',
            '3. Ubicación',
            '4. Inscripción',
            '5. Fechas',
            '6. Reglas',
            '7. Invitaciones'
          ].map((step, idx) => (
            <div key={idx} style={{
              padding: '8px 16px',
              borderRadius: 8,
              background: currentStep === idx + 1 ? '#FFD700' : 'rgba(255,215,0,0.2)',
              color: currentStep === idx + 1 ? '#000' : '#FFD700',
              fontWeight: currentStep === idx + 1 ? 'bold' : 'normal',
              fontSize: 12
            }}>
              {step}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: 32, borderRadius: 16, border: '1px solid #FFD700' }}>
            {/* PASO 1: BÁSICO */}
            {currentStep === 1 && (
              <div>
                <h2 style={{ fontSize: 24, marginBottom: 20 }}>📝 Información Básica</h2>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Nombre del Torneo *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Copa Navideña 2026"
                    required
                    style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 16 }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Descripción</label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    placeholder="Describe el torneo, premios, requisitos especiales..."
                    rows={4}
                    style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 14 }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Tipo de Campeonato *</label>
                  <select
                    name="tipoTorneo"
                    value={form.tipoTorneo}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 16 }}
                  >
                    {tiposCampeonato.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>{tipo.label} ({tipo.players} jugadores)</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* PASO 2: CATEGORÍA Y EDAD */}
            {currentStep === 2 && (
              <div>
                <h2 style={{ fontSize: 24, marginBottom: 20 }}>👥 Categoría y Edad</h2>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Categoría *</label>
                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 16 }}
                  >
                    {categorias.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Edad Mínima</label>
                    <input
                      type="number"
                      name="minEdad"
                      value={form.minEdad || ''}
                      onChange={handleChange}
                      placeholder="Ej: 13"
                      min="0"
                      max="100"
                      style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 16 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Edad Máxima</label>
                    <input
                      type="number"
                      name="maxEdad"
                      value={form.maxEdad || ''}
                      onChange={handleChange}
                      placeholder="Ej: 17"
                      min="0"
                      max="100"
                      style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 16 }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Cantidad de Jugadores por Equipo</label>
                  <input
                    type="number"
                    name="maxJugadoresPorEquipo"
                    value={form.maxJugadoresPorEquipo}
                    onChange={handleChange}
                    readOnly
                    style={{ width: '100%', background: '#1a1a1a', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 16 }}
                  />
                  <small style={{ color: '#FFD70099' }}>Automático según tipo de campeonato</small>
                </div>
              </div>
            )}

            {/* PASO 3: UBICACIÓN */}
            {currentStep === 3 && (
              <div>
                <h2 style={{ fontSize: 24, marginBottom: 20 }}>📍 Ubicación</h2>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Dirección *</label>
                  <input
                    type="text"
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    placeholder="Calle 45 #23-12, Cancha Municipal"
                    required
                    style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 16 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Ciudad *</label>
                    <input
                      type="text"
                      name="ciudad"
                      value={form.ciudad}
                      onChange={handleChange}
                      placeholder="Bogotá"
                      required
                      style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 16 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>País *</label>
                    <select
                      name="pais"
                      value={form.pais}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 16 }}
                    >
                      {Object.keys(monedas).map(pais => (
                        <option key={pais} value={pais}>{pais}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 4: INSCRIPCIÓN */}
            {currentStep === 4 && (
              <div>
                <h2 style={{ fontSize: 24, marginBottom: 20 }}>💰 Inscripción</h2>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Tipo de Inscripción</label>
                  <select
                    name="tipoInscripcion"
                    value={form.tipoInscripcion}
                    onChange={handleChange}
                    style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 16 }}
                  >
                    <option value="free">Gratuito</option>
                    <option value="paid">Pago</option>
                  </select>
                </div>

                {form.tipoInscripcion === 'paid' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Costo de Inscripción</label>
                      <input
                        type="number"
                        name="costoInscripcion"
                        value={form.costoInscripcion}
                        onChange={handleChange}
                        placeholder="50000"
                        min="0"
                        step="1000"
                        style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 16 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Moneda</label>
                      <input
                        type="text"
                        name="moneda"
                        value={form.moneda}
                        readOnly
                        style={{ width: '100%', background: '#1a1a1a', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 16 }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Cantidad Mínima de Equipos *</label>
                    <input
                      type="number"
                      name="minEquipos"
                      value={form.minEquipos}
                      onChange={handleChange}
                      placeholder="4"
                      min="2"
                      required
                      style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 16 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Cantidad Máxima de Equipos *</label>
                    <input
                      type="number"
                      name="maxEquipos"
                      value={form.maxEquipos}
                      onChange={handleChange}
                      placeholder="16"
                      min="2"
                      required
                      style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 16 }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PASO 5: FECHAS Y HORARIOS */}
            {currentStep === 5 && (
              <div>
                <h2 style={{ fontSize: 24, marginBottom: 20 }}>📅 Fechas y Horarios</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Inicio Inscripciones</label>
                    <input
                      type="datetime-local"
                      name="fechaInicioRegistro"
                      value={form.fechaInicioRegistro}
                      onChange={handleChange}
                      style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 14 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Fin Inscripciones</label>
                    <input
                      type="datetime-local"
                      name="fechaFinRegistro"
                      value={form.fechaFinRegistro}
                      onChange={handleChange}
                      style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 14 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Inicio Torneo *</label>
                    <input
                      type="datetime-local"
                      name="fechaInicioTorneo"
                      value={form.fechaInicioTorneo}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 14 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Fin Torneo</label>
                    <input
                      type="datetime-local"
                      name="fechaFinTorneo"
                      value={form.fechaFinTorneo}
                      onChange={handleChange}
                      style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 14 }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 12, fontWeight: 'bold' }}>Horarios de Partidos</label>
                  {form.horarios.map((horario, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, marginBottom: 12 }}>
                      <select
                        value={horario.dia}
                        onChange={(e) => updateHorario(idx, 'dia', e.target.value)}
                        style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12 }}
                      >
                        {['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'].map(d => (
                          <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                        ))}
                      </select>
                      <input
                        type="time"
                        value={horario.hora}
                        onChange={(e) => updateHorario(idx, 'hora', e.target.value)}
                        style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12 }}
                      />
                      <button type="button" onClick={() => removeHorario(idx)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}>✖️</button>
                    </div>
                  ))}
                  <button type="button" onClick={addHorario} style={{ background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>
                    ➕ Agregar Horario
                  </button>
                </div>
              </div>
            )}

            {/* PASO 6: REGLAS */}
            {currentStep === 6 && (
              <div>
                <h2 style={{ fontSize: 24, marginBottom: 20 }}>⚖️ Reglas del Torneo</h2>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Reglas y Normativas</label>
                  <textarea
                    name="reglas"
                    value={form.reglas}
                    onChange={handleChange}
                    placeholder="Escribe las reglas del torneo: duración de partidos, sustituciones, sanciones..."
                    rows={6}
                    style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 14 }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Sistema de Juego</label>
                  <select
                    name="sistemaDeJuego"
                    value={form.sistemaDeJuego}
                    onChange={handleChange}
                    style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 16 }}
                  >
                    <option value="standard">Estándar (Victoria=3pts, Empate=1pt)</option>
                    <option value="zero_draw">0 Empate (Penaltis si empatan, 1pt+1pt al ganador)</option>
                    <option value="repechaje">Con Repechaje</option>
                  </select>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="tienePenaltis"
                      checked={form.tienePenaltis}
                      onChange={handleChange}
                      style={{ width: 20, height: 20 }}
                    />
                    <span>¿Permite Penaltis en caso de empate?</span>
                  </label>
                </div>

                {form.tienePenaltis && (
                  <div style={{ marginBottom: 16, marginLeft: 28 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Distribución de Puntos en Penaltis</label>
                    <select
                      name="distribucionPenaltis"
                      value={form.distribucionPenaltis}
                      onChange={handleChange}
                      style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 16 }}
                    >
                      <option value="winner_takes_all">Ganador toma todo (3pts)</option>
                      <option value="split_points">Reparto (1pt+1pt al ganador)</option>
                    </select>
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="permiteRepechaje"
                      checked={form.permiteRepechaje}
                      onChange={handleChange}
                      style={{ width: 20, height: 20 }}
                    />
                    <span>¿Permite Repechaje? (Mejores perdedores pasan a siguiente fase)</span>
                  </label>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="requiereStreaming"
                      checked={form.requiereStreaming}
                      onChange={handleChange}
                      style={{ width: 20, height: 20 }}
                    />
                    <span>¿Requiere Transmisión en Vivo? (Mínimo 1 partido debe ser transmitido)</span>
                  </label>
                </div>

                {form.requiereStreaming && (
                  <div style={{ marginLeft: 28 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Mínimo de Partidos Transmitidos</label>
                    <input
                      type="number"
                      name="minStreamsRequeridos"
                      value={form.minStreamsRequeridos}
                      onChange={handleChange}
                      min="1"
                      style={{ width: '100%', background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 12, fontSize: 16 }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* PASO 7: INVITACIONES */}
            {currentStep === 7 && (
              <div>
                <h2 style={{ fontSize: 24, marginBottom: 20 }}>📨 Invitar Equipos</h2>
                
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 18, marginBottom: 12 }}>Mis Equipos</h3>
                  {teams.length === 0 ? (
                    <p style={{ color: '#FFD70099' }}>No tienes equipos creados aún.</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                      {teams.map(team => (
                        <div
                          key={team.id}
                          onClick={() => toggleTeamSelection(team.id)}
                          style={{
                            padding: 12,
                            borderRadius: 8,
                            background: selectedTeams.includes(team.id) ? 'rgba(46,204,113,0.3)' : 'rgba(255,215,0,0.1)',
                            border: `2px solid ${selectedTeams.includes(team.id) ? '#2ecc71' : '#FFD700'}`,
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          {team.logo_url && <img src={team.logo_url} alt="" style={{ width: 40, height: 40, borderRadius: '50%', marginBottom: 8 }} />}
                          <div style={{ fontWeight: 'bold', fontSize: 14 }}>{team.name}</div>
                          {selectedTeams.includes(team.id) && <div style={{ color: '#2ecc71', marginTop: 4 }}>✓ Seleccionado</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 style={{ fontSize: 18, marginBottom: 12 }}>Equipos Cercanos ({nearbyTeams.length})</h3>
                  {nearbyTeams.length === 0 ? (
                    <p style={{ color: '#FFD70099' }}>No se encontraron equipos cercanos. Ingresa la ciudad del torneo en el paso 3.</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, maxHeight: 400, overflowY: 'auto' }}>
                      {nearbyTeams.map(team => (
                        <div
                          key={team.id}
                          onClick={() => toggleTeamSelection(team.id)}
                          style={{
                            padding: 12,
                            borderRadius: 8,
                            background: selectedTeams.includes(team.id) ? 'rgba(46,204,113,0.3)' : 'rgba(255,215,0,0.1)',
                            border: `2px solid ${selectedTeams.includes(team.id) ? '#2ecc71' : '#FFD700'}`,
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          {team.logo_url && <img src={team.logo_url} alt="" style={{ width: 40, height: 40, borderRadius: '50%', marginBottom: 8 }} />}
                          <div style={{ fontWeight: 'bold', fontSize: 14 }}>{team.name}</div>
                          <div style={{ fontSize: 11, color: '#FFD70099' }}>{team.city}</div>
                          {selectedTeams.includes(team.id) && <div style={{ color: '#2ecc71', marginTop: 4 }}>✓ Invitado</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 20, padding: 16, background: 'rgba(46,204,113,0.1)', borderRadius: 8, border: '1px solid #2ecc71' }}>
                  <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>📊 Resumen de Invitaciones</div>
                  <div style={{ fontSize: 14, color: '#FFD70099' }}>
                    Equipos seleccionados: <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>{selectedTeams.length}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#FFD70099', marginTop: 8 }}>
                    Los equipos recibirán una invitación que podrán aceptar o rechazar.
                  </div>
                </div>
              </div>
            )}

            {/* Mensajes */}
            {error && (
              <div style={{ marginTop: 20, padding: 16, background: 'rgba(231,76,60,0.2)', border: '1px solid #e74c3c', borderRadius: 8, color: '#e74c3c' }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ marginTop: 20, padding: 16, background: 'rgba(46,204,113,0.2)', border: '1px solid #2ecc71', borderRadius: 8, color: '#2ecc71' }}>
                {success}
              </div>
            )}

            {/* Navegación */}
            <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} style={{ background: '#95a5a6', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>
                  ← Anterior
                </button>
              )}
              
              <div style={{ flex: 1 }}></div>

              {currentStep < 7 ? (
                <button type="button" onClick={nextStep} style={{ background: '#FFD700', color: '#000', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>
                  Siguiente →
                </button>
              ) : (
                <button type="submit" disabled={loading} style={{ background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 48px', fontWeight: 'bold', fontSize: 18, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? '⏳ Creando...' : '🏆 Crear Torneo'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
