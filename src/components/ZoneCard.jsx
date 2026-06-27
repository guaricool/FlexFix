import { useState, useEffect } from 'react';
import { getUndeliveredCount } from '../db/database';
import ZoneDetail from './ZoneDetail';
import '../styles/ZoneCard.css';

export default function ZoneCard({ zone, sessionId, onRefresh }) {
  const [undeliveredCount, setUndeliveredCount] = useState(0);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadCount();
  }, [zone.id]);

  const loadCount = async () => {
    const count = await getUndeliveredCount(sessionId, zone.zoneName);
    setUndeliveredCount(count);
  };

  const handleZoneUpdate = async () => {
    await loadCount();
    onRefresh?.();
  };

  const getZoneIcon = (zoneName) => {
    const icons = {
      'A': '🪑',
      'B': '🚗',
      'C': '🚗',
      'D': '📦',
    };
    return icons[zoneName] || '📍';
  };

  const getZoneColor = (zoneName) => {
    const colors = {
      'A': '#FF6B6B',
      'B': '#4ECDC4',
      'C': '#45B7D1',
      'D': '#FFA07A',
    };
    return colors[zoneName] || '#999';
  };

  return (
    <>
      <div 
        className="zone-card"
        onClick={() => setShowDetail(true)}
        style={{ borderLeftColor: getZoneColor(zone.zoneName) }}
      >
        <div className="zone-icon">{getZoneIcon(zone.zoneName)}</div>
        <div className="zone-info">
          <h3>Zona {zone.zoneName}</h3>
          <p className="zone-description">{zone.description}</p>
          <div className="zone-count">
            <span className="count-number">{undeliveredCount}</span>
            <span className="count-label">pendientes</span>
          </div>
        </div>
      </div>

      {showDetail && (
        <ZoneDetail
          zone={zone}
          sessionId={sessionId}
          onClose={() => setShowDetail(false)}
          onUpdate={handleZoneUpdate}
        />
      )}
    </>
  );
}
