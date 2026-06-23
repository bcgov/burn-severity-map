
import React, { useEffect, useState } from 'react';
import { fetchHealth, HealthResponse } from '../utils/apiService';
import { useHealth } from './HealthContext';

interface HealthStatusProps {
  layout?: 'default' | 'inline';
}

const HealthStatus: React.FC<HealthStatusProps> = ({ layout = 'default' }) => {
  const { health, loading } = useHealth();
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ok':
      case 'connected':
        return 'green';
      case 'degraded':
        return 'orange';
      case 'unreachable':
        return 'red';
      case 'not created':
        return 'orange';
      default:
        return 'gray';
    }
  };

  if (loading) return <p>Checking system health...</p>;
  if (!health) return null;
  console.log("Health component mounted: ", health);

  if (layout == 'default'){
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
            <strong>Burn Severity Data:</strong>{' '}
            <span style={{ color: getStatusColor(health!.data_status) }}>{health!.data_status}</span>

            {health!.data_status === 'ok' && health!.fire_count !== null && (
              <span style={{ marginLeft: '10px', fontSize: '0.9em', color: getStatusColor(health!.data_status) }}>
                ({health!.fire_count} fire(s) tracked)
              </span>
            )}
            {health!.data_status === 'not created' && (
              <span style={{ marginLeft: '10px', fontSize: '0.9em', color: getStatusColor(health!.data_status) }}>
                (Awaiting intial sync)
              </span>
            )}
          </li>
          <li>
            <strong>Analysis Status:</strong>{' '}
            <span style={{ color: getStatusColor(health!.analysis_backend) }}>{health!.analysis_backend}</span>
          </li>
        </ul>
        <div style={{textAlign: 'right', fontSize: '0.7em', fontStyle: 'italic', marginTop: '0.5rem', color: '#666'}}>{health!.version}</div>
      </div>
    );
  }
  return (
    <div className='health-status-inline' style={{
      display: 'flex',
      flexWrap: 'wrap',
      columnGap: '32px',
      rowGap: '16px',
      alignItems: 'flex-start', // Changed from center so the tops align perfectly
      fontSize: '14px'
    }}>
      
      {/* API Block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
        <span style={{ opacity: 0.85, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>API Status</span> 
        <strong style={{ color: getStatusColor(health!.status), fontSize: '15px' }}>{health!.status}</strong>
      </div>
      
      {/* Object Storage Block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
        <span style={{ opacity: 0.85, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Object Storage</span> 
        <strong style={{ color: getStatusColor(health!.object_storage), fontSize: '15px' }}>{health!.object_storage}</strong>
      </div>
      
      {/* Burn Severity Data Block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
        <span style={{ opacity: 0.85, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Burn Severity Data</span> 
        
        {/* We keep the status and the dynamic text together in a row underneath the subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <strong style={{ color: getStatusColor(health!.data_status), fontSize: '15px' }}>{health!.data_status}</strong>
          
          {health!.data_status === 'ok' && health!.fire_count !== null && (
            <span style={{ fontSize: '12px', color: getStatusColor(health!.data_status) }}>
              ({health!.fire_count} fire(s) tracked)
            </span>
          )}
          {health!.data_status === 'not created' && (
            <span style={{ fontSize: '12px', color: getStatusColor(health!.data_status) }}>
              (Awaiting initial sync)
            </span>
          )}
        </div>
      </div>
      
      {/* Analysis Backend Block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ opacity: 0.85, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Analysis Status</span> 
        <strong style={{ color: getStatusColor(health!.analysis_backend), fontSize: '15px' }}>{health!.analysis_backend}</strong>
      </div>

    </div>
  );
};

export default HealthStatus;