import { useState, useEffect } from 'react';
import { getPackagesByZone, markAsDelivered, addPackage } from '../db/database';
import QRScanner from './QRScanner';
import PackageList from './PackageList';
import '../styles/ZoneDetail.css';

export default function ZoneDetail({ zone, sessionId, onClose, onUpdate }) {
  const [packages, setPackages] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPackages();
  }, [zone.id]);

  const loadPackages = async () => {
    const pkgs = await getPackagesByZone(sessionId, zone.zoneName);
    setPackages(pkgs);
  };

  const handleScanSuccess = async (code) => {
    await addPackage(sessionId, code, zone.zoneName);
    setShowScanner(false);
    await loadPackages();
    onUpdate?.();
  };

  const handleManualAdd = async () => {
    if (manualCode.trim()) {
      await addPackage(sessionId, manualCode, zone.zoneName);
      setManualCode('');
      await loadPackages();
      onUpdate?.();
    }
  };

  const handleMarkDelivered = async (packageId) => {
    await markAsDelivered(packageId);
    await loadPackages();
    onUpdate?.();
  };

  const undeliveredCount = packages.filter(p => !p.delivered).length;

  return (
    <div className="zone-detail-overlay">
      <div className="zone-detail-modal">
        <header className="modal-header">
          <h2>Zona {zone.zoneName}</h2>
          <p>{zone.description}</p>
          <button onClick={onClose} className="close-button">✕</button>
        </header>

        <div className="modal-content">
          <div className="add-package-section">
            <h3>Agregar paquete</h3>
            
            {!showScanner ? (
              <div className="input-group">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Ingresa código o escanea QR"
                  onKeyPress={(e) => e.key === 'Enter' && handleManualAdd()}
                />
                <button onClick={handleManualAdd} className="btn-add">
                  Agregar
                </button>
                <button 
                  onClick={() => setShowScanner(true)}
                  className="btn-scan"
                >
                  📷 Escanear QR
                </button>
              </div>
            ) : (
              <QRScanner
                onScanSuccess={handleScanSuccess}
                onClose={() => setShowScanner(false)}
              />
            )}
          </div>

          <div className="packages-section">
            <h3>Paquetes ({undeliveredCount} pendientes)</h3>
            {packages.length > 0 ? (
              <PackageList
                packages={packages}
                onMarkDelivered={handleMarkDelivered}
              />
            ) : (
              <p className="empty-state">No hay paquetes en esta zona</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
