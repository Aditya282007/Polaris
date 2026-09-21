import React from 'react';
import { Panel, SeverityBadge, EmptyState } from '../UI/Panel';
import { Mission } from '../../types';

interface MissionStatusPanelProps {
  missions: Mission[];
  className?: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'ACTIVE': return { bg: 'rgba(40, 116, 166, 0.18)', text: '#2874A6', border: 'rgba(40, 116, 166, 0.5)', dot: '#2874A6' };
    case 'PLANNING': return { bg: 'rgba(107, 107, 107, 0.18)', text: '#6B6B6B', border: 'rgba(107, 107, 107, 0.5)', dot: '#6B6B6B' };
    case 'COMPLETED': return { bg: 'rgba(30, 138, 73, 0.18)', text: '#1E8A49', border: 'rgba(30, 138, 73, 0.5)', dot: '#1E8A49' };
    case 'CANCELLED': return { bg: 'rgba(192, 57, 43, 0.18)', text: '#C0392B', border: 'rgba(192, 57, 43, 0.5)', dot: '#C0392B' };
    default: return { bg: 'rgba(107, 107, 107, 0.18)', text: '#6B6B6B', border: 'rgba(107, 107, 107, 0.5)', dot: '#6B6B6B' };
  }
}

function renderActiveMissions(activeMissions: Mission[], otherMissionsLength: number) {
  return (
    <React.Fragment>
      <h4 style={{ 
        fontFamily: 'Space Grotesk, sans-serif', 
        fontWeight: 500, 
        color: '#2874A6', 
        fontSize: '0.75rem', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        marginBottom: '0.75rem'
      }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2874A6' }} />
        ACTIVE MISSIONS ({activeMissions.length})
      </h4>
      <div>
        {activeMissions.map((mission, index) => (
          <div 
            key={mission.id} 
            style={{ 
              padding: '20px 0',
              borderBottom: index === activeMissions.length - 1 && otherMissionsLength === 0 
                ? 'none' 
                : '1px solid rgba(179, 224, 231, 0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.375rem', 
                    padding: '0.25rem 0.5rem', 
                    fontFamily: 'Space Grotesk, sans-serif', 
                    fontSize: '0.75rem', 
                    fontWeight: 500, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em', 
                    borderRadius: '9999px', 
                    border: '1px solid',
                    backgroundColor: 'rgba(40, 116, 166, 0.18)',
                    color: '#2874A6',
                    borderColor: 'rgba(40, 116, 166, 0.5)'
                  }}>
                    {mission.status}
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#6B6B6B' }}>{mission.id}</span>
                </div>
                <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, color: '#0A0A0A', fontSize: '1rem', marginBottom: '0.25rem' }}>{mission.name}</h4>
                <p style={{ color: '#6B6B6B', fontSize: '0.875rem' }}>
                  {mission.currentLegIndex + 1} of {mission.legs.length} legs · {mission.personnelIds.length} personnel · {mission.cargoIds.length} cargo
                </p>
              </div>
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', fontWeight: 600, color: '#0A0A0A' }}>{getDaysRemaining(mission.estimatedEndDate)}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6B6B6B' }}>DAYS REMAINING</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(179, 224, 231, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6B6B6B' }}>
                <span>STARTED</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{formatDate(mission.startDate)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6B6B6B', marginTop: '0.5rem' }}>
                <span>EST. COMPLETION</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{formatDate(mission.estimatedEndDate)}</span>
              </div>
              
              {mission.legs[mission.currentLegIndex] && (() => {
                const leg = mission.legs[mission.currentLegIndex];
                const legSeverity = leg.status === 'ACTIVE' ? 'WARNING' : leg.status === 'COMPLETED' ? 'NOMINAL' : 'NOMINAL';
                return (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, color: '#6B6B6B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>CURRENT LEG</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, color: '#0A0A0A', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{leg.from} → {leg.to}</p>
                        <p style={{ color: '#6B6B6B', fontSize: '0.75rem' }}>{formatDate(leg.startDate)} — {formatDate(leg.endDate)}</p>
                      </div>
                      <SeverityBadge severity={legSeverity} size="xs" />
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

export function MissionStatusPanel({ missions, className = '' }: MissionStatusPanelProps) {
  const activeMissions = missions.filter(m => m.status === 'ACTIVE');
  const otherMissions = missions.filter(m => m.status !== 'ACTIVE');

  return (
    <div className={className}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {activeMissions.length > 0 && renderActiveMissions(activeMissions, otherMissions.length)}
        {otherMissions.length > 0 && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(179, 224, 231, 0.3)' }}>
            <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, color: '#6B6B6B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>OTHER MISSIONS ({otherMissions.length})</h4>
            <div>
              {otherMissions.map((mission, index) => (
                <div 
                  key={mission.id} 
                  style={{ 
                    padding: '16px 0',
                    borderBottom: index === otherMissions.length - 1 ? 'none' : '1px solid rgba(179, 224, 231, 0.3)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.375rem', 
                        padding: '0.25rem 0.5rem', 
                        fontFamily: 'Space Grotesk, sans-serif', 
                        fontSize: '0.75rem', 
                        fontWeight: 500, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em', 
                        borderRadius: '9999px', 
                        border: '1px solid',
                        backgroundColor: 'rgba(107, 107, 107, 0.18)',
                        color: '#6B6B6B',
                        borderColor: 'rgba(107, 107, 107, 0.5)'
                      }}>
                        {mission.status}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, color: '#0A0A0A', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mission.name}</p>
                        <p style={{ color: '#6B6B6B', fontSize: '0.75rem' }}>{mission.legs.length} legs · {mission.personnelIds.length} personnel</p>
                      </div>
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#6B6B6B' }}>{formatDate(mission.startDate)} — {formatDate(mission.estimatedEndDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {missions.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center', color: '#6B6B6B' }}>
            <svg style={{ width: '48px', height: '48px', opacity: 0.3, marginBottom: '1rem' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 19l9 2 3.37-6.88L20.87 8.5A12.06 12.06 0 0021 12c0-6.627-5.373-12-12-12A12.06 12.06 0 003 12c0 1.92.506 3.74 1.378 5.3l8.16 4.28L16 21l-2.03-4.3a1 1 0 00-.56-.47l-2.5-.9A18.74 18.74 0 009.61 6.06l-.2.38a70 70 0 00-5.55 7.58l.31.62"/>
            </svg>
            <p style={{ fontSize: '0.875rem', color: '#6B6B6B' }}>No missions found</p>
            <p style={{ fontSize: '0.75rem', color: '#6B6B6B', opacity: 0.6, marginTop: '0.25rem' }}>Create your first expedition mission from the Expedition Planner</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MissionStatusPanel;