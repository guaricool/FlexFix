import '../styles/Stats.css';

export default function Stats({ stats }) {
  const deliveryPercentage = stats.total > 0 
    ? Math.round((stats.delivered / stats.total) * 100) 
    : 0;

  return (
    <div className="stats-container">
      <div className="stat-card total">
        <div className="stat-value">{stats.total}</div>
        <div className="stat-label">Total de paquetes</div>
      </div>

      <div className="stat-card delivered">
        <div className="stat-value">{stats.delivered}</div>
        <div className="stat-label">Entregados</div>
      </div>

      <div className="stat-card remaining">
        <div className="stat-value">{stats.remaining}</div>
        <div className="stat-label">Pendientes</div>
      </div>

      <div className="stat-card progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${deliveryPercentage}%` }}
          ></div>
        </div>
        <div className="stat-label">{deliveryPercentage}% completado</div>
      </div>
    </div>
  );
}
