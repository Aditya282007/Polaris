import React from 'react';
import { Panel } from '../UI/Panel';
import { Personnel } from '../../types';

interface PersonnelSnapshotPanelProps {
  personnel: Personnel[];
  className?: string;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'CHECKED_IN': return '#1E8A49';
    case 'ON_FIELD': return '#2874A6';
    case 'OVERDUE': return '#C0392B';
    case 'CHECKED_OUT': return '#6B6B6B';
    default: return '#6B6B6B';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'CHECKED_IN': return 'CHECKED IN';
    case 'ON_FIELD': return 'ON FIELD';
    case 'OVERDUE': return 'OVERDUE';
    case 'CHECKED_OUT': return 'CHECKED OUT';
    default: return status;
  }
}

function getSeverityFromStatus(status: string): 'CRITICAL' | 'WARNING' | 'NOMINAL' {
  switch (status) {
    case 'OVERDUE': return 'CRITICAL';
    case 'ON_FIELD': return 'WARNING';
    case 'CHECKED_IN': return 'NOMINAL';
    default: return 'NOMINAL';
  }
}

export function PersonnelSnapshotPanel({ personnel, className = '' }: PersonnelSnapshotPanelProps) {
  const overdue = personnel.filter(p => p.status === 'OVERDUE');
  const onField = personnel.filter(p => p.status === 'ON_FIELD');
  const checkedIn = personnel.filter(p => p.status === 'CHECKED_IN');
  const checkedOut = personnel.filter(p => p.status === 'CHECKED_OUT');

  return (
    <div className={className}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {overdue.length > 0 && (
          <div>
            <h4 style={{ 
              fontFamily: 'Space Grotesk, sans-serif', 
              fontWeight: 500, 
              color: '#C0392B', 
              fontSize: '0.75rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em',
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#C0392B' }} />
              OVERDUE ({overdue.length})
            </h4>
            <div>
              {overdue.map((p, index) => (
                <div 
                  key={p.id} 
                  style={{ 
                    padding: '16px 0',
                    borderBottom: index === overdue.length - 1 && onField.length === 0 && checkedIn.length === 0 && checkedOut.length === 0 
                      ? 'none' 
                      : '1px solid rgba(179, 224, 231, 0.3)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(p.status), flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, color: '#0A0A0A', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                        <p style={{ color: '#6B6B6B', fontSize: '0.75rem' }}>{p.role}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flexEnd', gap: '0.25rem' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#6B6B6B' }}>{p.station}</span>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: '0.75rem', color: '#C0392B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{getStatusLabel(p.status)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#6B6B6B' }}>
                    <span>Last: {formatTime(p.lastCheckIn)}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#C0392B' }}>{p.overdueMinutes} min overdue</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {onField.length > 0 && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(179, 224, 231, 0.3)' }}>
            <h4 style={{ 
              fontFamily: 'Space Grotesk, sans-serif', 
              fontWeight: 500, 
              color: '#D4A017', 
              fontSize: '0.75rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em',
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D4A017' }} />
              ON FIELD ({onField.length})
            </h4>
            <div>
              {onField.map((p, index) => (
                <div 
                  key={p.id} 
                  style={{ 
                    padding: '16px 0',
                    borderBottom: index === onField.length - 1 && checkedIn.length === 0 && checkedOut.length === 0 
                      ? 'none' 
                      : '1px solid rgba(179, 224, 231, 0.3)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(p.status), flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, color: '#0A0A0A', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                        <p style={{ color: '#6B6B6B', fontSize: '0.75rem' }}>{p.role}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#6B6B6B' }}>{p.station}</span>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: '0.75rem', color: '#D4A017', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{getStatusLabel(p.status)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#6B6B6B' }}>
                    <span>Last: {formatTime(p.lastCheckIn)}</span>
                    <span>Next: {p.nextScheduledCheckIn ? formatTime(p.nextScheduledCheckIn) : '—'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {checkedIn.length > 0 && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(179, 224, 231, 0.3)' }}>
            <h4 style={{ 
              fontFamily: 'Space Grotesk, sans-serif', 
              fontWeight: 500, 
              color: '#1E8A49', 
              fontSize: '0.75rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em',
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1E8A49' }} />
              CHECKED IN ({checkedIn.length})
            </h4>
            <div style={{ maxHeight: '192px', overflowY: 'auto' }}>
              {checkedIn.map((p, index) => (
                <div 
                  key={p.id} 
                  style={{ 
                    padding: '16px 0',
                    borderBottom: index === checkedIn.length - 1 && checkedOut.length === 0 
                      ? 'none' 
                      : '1px solid rgba(179, 224, 231, 0.3)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(p.status), flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, color: '#0A0A0A', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                        <p style={{ color: '#6B6B6B', fontSize: '0.75rem' }}>{p.role}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#6B6B6B' }}>{p.station}</span>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: '0.75rem', color: '#1E8A49', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{getStatusLabel(p.status)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#6B6B6B' }}>
                    <span>Last: {formatTime(p.lastCheckIn)}</span>
                    <span>Next: {p.nextScheduledCheckIn ? formatTime(p.nextScheduledCheckIn) : '—'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {checkedOut.length > 0 && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(179, 224, 231, 0.3)' }}>
            <h4 style={{ 
              fontFamily: 'Space Grotesk, sans-serif', 
              fontWeight: 500, 
              color: '#6B6B6B', 
              fontSize: '0.75rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em',
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor('CHECKED_OUT') }} />
              CHECKED OUT ({checkedOut.length})
            </h4>
            <div>
              {checkedOut.map((p, index) => (
                <div 
                  key={p.id} 
                  style={{ 
                    padding: '16px 0',
                    borderBottom: index === checkedOut.length - 1 ? 'none' : '1px solid rgba(179, 224, 231, 0.3)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(p.status), flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, color: '#0A0A0A', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                        <p style={{ color: '#6B6B6B', fontSize: '0.75rem' }}>{p.role}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#6B6B6B' }}>{p.station}</span>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: '0.75rem', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{getStatusLabel(p.status)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#6B6B6B' }}>
                    <span>Last: {formatTime(p.lastCheckIn)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {personnel.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center', color: '#6B6B6B' }}>
            <svg style={{ width: '48px', height: '48px', opacity: 0.3, marginBottom: '1rem' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" strokeWidth="1.5"/>
            </svg>
            <p style={{ fontSize: '0.875rem', color: '#6B6B6B' }}>No personnel data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonnelSnapshotPanel;