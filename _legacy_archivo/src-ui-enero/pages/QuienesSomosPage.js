// Página Quiénes Somos / Conozcan nuestra app
export default function QuienesSomosPage() {
    const navigate = require('react-router-dom').useNavigate();
    return (
        <div className="quienes-somos-page" style={{background:'#181818',color:'#FFD700',minHeight:'100vh',padding:'48px 32px', borderRadius:'18px', boxShadow:'0 2px 12px #FFD70044', maxWidth:'900px', margin:'auto'}}>
            <h2 style={{fontSize:'2.2em',fontWeight:'bold',marginBottom:'18px'}}><i className="fas fa-users"></i> ¿Quiénes Somos?</h2>
            <p style={{color:'#fff',fontSize:'1.2em',marginBottom:'24px'}}>FutPro es la red social profesional para futbolistas, equipos, organizadores y fans. Nuestra misión es conectar el mundo del fútbol, facilitar la organización de partidos y torneos, y potenciar la carrera de cada jugador y club.</p>
            <div className="valores-grid" style={{display:'flex',gap:'32px',marginBottom:'32px'}}>
                <div style={{flex:'1',background:'#232323',borderRadius:'12px',padding:'24px',border:'2px solid #FFD700'}}>
                    <h3 style={{color:'#FFD700'}}><i className="fas fa-bullseye"></i> Misión</h3>
                    <p style={{color:'#fff'}}>Conectar y empoderar a la comunidad futbolística global.</p>
                </div>
                <div style={{flex:'1',background:'#232323',borderRadius:'12px',padding:'24px',border:'2px solid #FFD700'}}>
                    <h3 style={{color:'#FFD700'}}><i className="fas fa-eye"></i> Visión</h3>
                    <p style={{color:'#fff'}}>Ser la plataforma líder en innovación y oportunidades para el fútbol.</p>
                </div>
                <div style={{flex:'1',background:'#232323',borderRadius:'12px',padding:'24px',border:'2px solid #FFD700'}}>
                    <h3 style={{color:'#FFD700'}}><i className="fas fa-heart"></i> Valores</h3>
                    <p style={{color:'#fff'}}>Pasión, respeto, inclusión, trabajo en equipo y excelencia.</p>
                </div>
            </div>
            <section style={{marginTop:'32px'}}>
                <h3 style={{color:'#FFD700'}}><i className="fas fa-lightbulb"></i> ¿Por qué FutPro?</h3>
                <ul style={{color:'#fff',fontSize:'1.1em',marginTop:'12px'}}>
                    <li>Organiza y transmite partidos en vivo fácilmente.</li>
                    <li>Descubre y únete a torneos y equipos.</li>
                    <li>Conecta con jugadores y fans de todo el mundo.</li>
                    <li>Marketplace para comprar y vender productos deportivos.</li>
                    <li>Herramientas avanzadas para tu desarrollo futbolístico.</li>
                </ul>
            </section>
            <button style={{marginTop:'32px',background:'#FFD700',color:'#181818',border:'none',borderRadius:'8px',padding:'0.8em 2em',fontWeight:'bold',fontSize:'1.1em',cursor:'pointer'}} onClick={()=>navigate('/')}>Ir al inicio</button>
        </div>
    );
}
