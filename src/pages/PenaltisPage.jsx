import React, { useState } from 'react';

const PenaltisPage = () => {

  const [score, setScore] = useState(() => Number(localStorage.getItem('penaltyPoints') || 0));
  const [feedback, setFeedback] = useState('');
  const [shooting, setShooting] = useState(false);
  const [result, setResult] = useState(null); // null | 'goal' | 'fail'
  const [attempts, setAttempts] = useState(0);
  const [prob, setProb] = useState(() => {
    const goles = Number(localStorage.getItem('penaltyGoals') || 0);
    return Math.max(0.1 - goles * 0.1, 0.01); // 10% menos por gol, mínimo 1%
  });
  const [goles, setGoles] = useState(() => Number(localStorage.getItem('penaltyGoals') || 0));

  // Cada gol reduce la probabilidad en 10% (mínimo 1%), cada gol suma 5 puntos
  const playPenalty = () => {
    if (shooting) return;
    setShooting(true);
    setFeedback('Lanzando...');
    setResult(null);
    setTimeout(() => {
      const win = Math.random() < prob;
      setAttempts(a => a + 1);
      if (win) {
        setScore(prev => {
          const newScore = prev + 5;
          localStorage.setItem('penaltyPoints', newScore);
          return newScore;
        });
        setGoles(prev => {
          const newGoles = prev + 1;
          localStorage.setItem('penaltyGoals', newGoles);
          // Actualizar probabilidad
          setProb(Math.max(0.1 - newGoles * 0.1, 0.01));
          return newGoles;
        });
        setFeedback('¡GOLAZO! +5 puntos');
        setResult('goal');
      } else {
        setFeedback('¡Fallaste! El portero atajó el penalti.');
        setResult('fail');
      }
      setShooting(false);
    }, 1200);
  };

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    setFeedback('¡URL copiada para compartir!');
  };

  return (
    <div style={{background:'#181818',color:'#FFD700',minHeight:'100vh',padding:'2rem',display:'flex',flexDirection:'column',alignItems:'center'}}>
  <h2>Juego de Penaltis (Difícil)</h2>
  <p>Puntos: {score}</p>
  <p>Intentos: {attempts}</p>
  <p>Goles: {goles}</p>
  <p>Probabilidad actual de gol: {(prob*100).toFixed(1)}%</p>
  <p style={{marginTop:8, color:'#FFD700cc', fontWeight:'bold'}}>¡Consigue 50 puntos para desbloquear tu tarjeta especial!</p>
      <div style={{margin:'2rem 0',width:220,height:180,position:'relative',background:'#232323',borderRadius:16,boxShadow:'0 2px 12px #FFD70044',display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
        {/* Portería y balón animado */}
        <div style={{position:'absolute',top:20,left:'50%',transform:'translateX(-50%)',width:160,height:16,background:'#FFD700',borderRadius:8,opacity:0.7}}></div>
        <div style={{position:'absolute',top:36,left:'50%',transform:'translateX(-50%)',width:120,height:8,background:'#FFD700',borderRadius:4,opacity:0.5}}></div>
        {/* Balón */}
        <div style={{position:'absolute',bottom:shooting?80:24,left:'50%',transform:'translateX(-50%)',transition:'bottom 1.2s cubic-bezier(.7,0,.3,1)',fontSize:36}}>
          <span role="img" aria-label="balon">⚽</span>
        </div>
        {/* Portero animado */}
        <div style={{position:'absolute',top:50,left:'50%',transform:`translateX(-50%) ${shooting? 'scaleX(1.2)' : ''}` ,width:60,height:24,background:'#FFD700',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold',fontSize:18,transition:'all 0.7s'}}>
          <span role="img" aria-label="portero">🧤</span>
        </div>
        {/* Feedback visual */}
        {result==='goal' && <div style={{position:'absolute',top:0,left:0,right:0,textAlign:'center',color:'#FFD700',fontWeight:'bold',fontSize:22}}>¡GOL!</div>}
        {result==='fail' && <div style={{position:'absolute',top:0,left:0,right:0,textAlign:'center',color:'#FFD70099',fontWeight:'bold',fontSize:18}}>Atajado</div>}
      </div>
      <button onClick={playPenalty} disabled={shooting} style={{background:'#FFD700',color:'#181818',padding:'1rem',borderRadius:'8px',fontWeight:'bold',fontSize:18,minWidth:180,marginBottom:16,cursor:shooting?'not-allowed':'pointer'}}>Lanzar penalti</button>
      <button onClick={share} style={{background:'#FFD700',color:'#181818',padding:'1rem',borderRadius:'8px',minWidth:180}}>Compartir</button>
      <div style={{marginTop:'1.5rem',minHeight:32,fontWeight:'bold'}}>{feedback}</div>
  <div style={{marginTop:24,fontSize:13,color:'#FFD70099'}}>Cada gol reduce la probabilidad de acierto en 10%. ¡Solo los cracks desbloquean la tarjeta!</div>
    </div>
  );
};

export default PenaltisPage;
