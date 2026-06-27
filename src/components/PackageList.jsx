import '../styles/PackageList.css';

export default function PackageList({ packages, onMarkDelivered }) {
  if (!packages || packages.length === 0) {
    return <div className="empty-state">No hay paquetes</div>;
  }

  const undelivered = packages.filter(p => !p.delivered);
  const delivered = packages.filter(p => p.delivered);

  return (
    <div className="package-list">
      {undelivered.length > 0 && (
        <div className="package-group">
          <h4>Pendientes ({undelivered.length})</h4>
          <ul className="packages">
            {undelivered.map((pkg) => (
              <li key={pkg.id} className="package-item pending">
                <div className="package-info">
                  <span className="package-code">{pkg.packageCode}</span>
                  <span className="package-date">
                    {new Date(pkg.createdAt).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <button
                  onClick={() => onMarkDelivered(pkg.id)}
                  className="btn-mark-delivered"
                  title="Marcar como entregado"
                >
                  ✓
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {delivered.length > 0 && (
        <div className="package-group">
          <h4>Entregados ({delivered.length})</h4>
          <ul className="packages">
            {delivered.map((pkg) => (
              <li key={pkg.id} className="package-item delivered">
                <div className="package-info">
                  <span className="package-code">{pkg.packageCode}</span>
                  <span className="package-date">
                    {new Date(pkg.deliveredAt).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <span className="delivered-badge">✓ Entregado</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
