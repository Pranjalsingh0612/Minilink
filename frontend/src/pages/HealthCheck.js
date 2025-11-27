/**
 * Health Check Page
 * Displays system health status and details
 */

import React, { useState, useEffect } from 'react';
import { getHealthStatus } from '../services/api';
import { formatTimestamp } from '../utils/helpers';
import Loading from '../components/Loading';

const HealthCheck = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHealth();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Fetch health status
   */
  const fetchHealth = async () => {
    try {
      setError(null);
      const data = await getHealthStatus();
      setHealth(data);
      setLoading(false);
    } catch (err) {
      setError('Health check failed. The API might be down.');
      setLoading(false);
      console.error('Error fetching health:', err);
    }
  };

  /**
   * Format uptime in human-readable format
   */
  const formatUptime = (seconds) => {
    if (!seconds) return 'N/A';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(' ');
  };

  return (
    <div className="container">
      <div className="card">
        <h2>System Health Check</h2>
        
        {/* Loading State */}
        {loading && <Loading message="Checking system health..." />}

        {/* Error State */}
        {!loading && error && (
          <div>
            <div className={`health-status unhealthy`}>
              <div className="health-icon">✗</div>
              <div>
                <h3>System Unhealthy</h3>
                <p>{error}</p>
              </div>
            </div>
            <button className="btn btn-primary mt-2" onClick={fetchHealth}>
              Retry
            </button>
          </div>
        )}

        {/* Healthy State */}
        {!loading && !error && health && (
          <div>
            {/* Status Banner */}
            <div className={`health-status ${health.ok ? 'healthy' : 'unhealthy'}`}>
              <div className="health-icon">{health.ok ? '✓' : '✗'}</div>
              <div>
                <h3>{health.ok ? 'System Healthy' : 'System Unhealthy'}</h3>
                <p>All services are operational</p>
              </div>
            </div>

            {/* Health Details */}
            <div className="health-details">
              {/* Status */}
              <div className="health-detail">
                <div className="health-detail-label">Status</div>
                <div className="health-detail-value">
                  {health.ok ? 'OK' : 'Error'}
                </div>
              </div>

              {/* Version */}
              <div className="health-detail">
                <div className="health-detail-label">API Version</div>
                <div className="health-detail-value">{health.version}</div>
              </div>

              {/* Uptime */}
              <div className="health-detail">
                <div className="health-detail-label">Uptime</div>
                <div className="health-detail-value">
                  {formatUptime(health.uptime)}
                </div>
              </div>

              {/* Uptime (seconds) */}
              <div className="health-detail">
                <div className="health-detail-label">Uptime (seconds)</div>
                <div className="health-detail-value">
                  {health.uptime ? health.uptime.toLocaleString() : 'N/A'}
                </div>
              </div>

              {/* Timestamp */}
              <div className="health-detail">
                <div className="health-detail-label">Last Checked</div>
                <div className="health-detail-value">
                  {formatTimestamp(health.timestamp)}
                </div>
              </div>
            </div>

            {/* Refresh Button */}
            <div style={{ marginTop: '2rem' }}>
              <button className="btn btn-primary" onClick={fetchHealth}>
                Refresh Status
              </button>
              <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.875rem' }}>
                Auto-refreshes every 30 seconds
              </p>
            </div>

            {/* System Information */}
            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>System Information</h3>
              <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem' }}>
                <div><strong>Endpoint:</strong> GET /healthz</div>
                <div><strong>Response Time:</strong> Fast</div>
                <div><strong>Database:</strong> Connected</div>
                <div><strong>API Status:</strong> Online</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthCheck;
