
import React, { useEffect, useState } from 'react';
import { fetchHealth, HealthResponse } from '../utils/apiService';

const HealthStatus: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadHealth = async () => {
      try {
        const data = await fetchHealth();
        setHealth(data);
        console.log('Backend health fetched', data);
      } catch (error) {
        setHealth({ status: 'unreachable', object_storage: 'unreachable', analysis_backend: 'unreachable' });
      } finally {
        setLoading(false);
      }
    };

    loadHealth();
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ok':
      case 'connected':
        return 'green';
      case 'degraded':
        return 'orange';
      case 'unreachable':
        return 'red';
      default:
        return 'gray';
    }
  };

  if (loading) return <p>Checking system health...</p>;
  console.log("Health component mounted");

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>System Health</h3>
      <ul>
        <li>
          <strong>API Status:</strong>{' '}
          <span style={{ color: getStatusColor(health!.status) }}>{health!.status}</span>
        </li>
        <li>
          <strong>Object Storage:</strong>{' '}
          <span style={{ color: getStatusColor(health!.object_storage) }}>{health!.object_storage}</span>
        </li>
        <li>
          <strong>Analysis Status:</strong>{' '}
          <span style={{ color: getStatusColor(health!.analysis_backend) }}>{health!.analysis_backend}</span>
        </li>
      </ul>
    </div>
  );
};

export default HealthStatus;