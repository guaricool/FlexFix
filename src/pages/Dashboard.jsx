import { useState, useEffect } from 'react';
import { 
  getPackagesBySession, 
  getUndeliveredCount, 
  getTotalPackages, 
  getDeliveredCount,
  initializeZones,
  getZones 
} from '../db/database';
import ZoneCard from '../components/ZoneCard';
import Stats from '../components/Stats';
import '../styles/Dashboard.css';

export default function Dashboard({ sessionId, username, onLogout }) {
  const [zones, setZones] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    remaining: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, [sessionId]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      
      // Inicializar zonas si es primera vez
      const existingZones = await getZones(sessionId);
      if (existingZones.length === 0) {
        await initializeZones(sessionId);
      }

      const zonesData = await getZones(sessionId);
      setZones(zonesData);

      // Cargar estadísticas
      const total = await getTotalPackages(sessionId);
      const delivered = await getDeliveredCount(sessionId);
      
      setStats({
        total,
        delivered,
        remaining: total - delivered,
      });
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    const total = await getTotalPackages(sessionId);
    const delivered = await getDeliveredCount(sessionId);
    setStats({
      total,
      delivered,
      remaining: total - delivered,
    });
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>FlexFix</h1>
          <p>Hola, <strong>{username}</strong></p>
        </div>
        <button onClick={onLogout} className="logout-button">
          Cerrar sesión
        </button>
      </header>

      <Stats stats={stats} />

      <div className="zones-container">
        <h2>Zonas del Vehículo</h2>
        <div className="zones-grid">
          {zones.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              sessionId={sessionId}
              onRefresh={refreshStats}
              onClick={() => setSelectedZone(zone)}
            />
          ))}
        </div>
      </div>

      {selectedZone && (
        <button 
          onClick={() => setSelectedZone(null)}
          className="close-overlay"
        >
          ✕
        </button>
      )}
    </div>
  );
}
