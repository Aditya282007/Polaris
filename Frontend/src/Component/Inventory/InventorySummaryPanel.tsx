import React from 'react';
import { SeverityBadge } from '../UI/Panel';
import { InventoryItem } from '../../types';

interface InventorySummaryPanelProps {
  items: InventoryItem[];
  className?: string;
}

export function InventorySummaryPanel({ items, className = '' }: InventorySummaryPanelProps) {
  const criticalItems = items.filter(i => i.currentStock <= i.reorderThreshold);
  const lowItems = items.filter(i => i.currentStock > i.reorderThreshold && i.daysUntilDepletion <= 30);

  return (
    <div className={className}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {(criticalItems.length > 0 || lowItems.length > 0) ? (
          <>
            {criticalItems.length > 0 && (
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
                  CRITICAL ({criticalItems.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {criticalItems.map((item, index) => (
                    <div 
                      key={item.id} 
                      style={{ 
                        padding: '20px 0',
                        borderBottom: index === criticalItems.length - 1 && lowItems.length === 0 
                          ? 'none' 
                          : '1px solid rgba(179, 224, 231, 0.3)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, color: '#0A0A0A', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                          <p style={{ color: '#6B6B6B', fontSize: '0.75rem' }}>{item.category} · {item.unit}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.125rem', fontWeight: 600, color: '#C0392B' }}>{item.currentStock}</span>
                          <SeverityBadge severity="CRITICAL" size="xs" />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#6B6B6B' }}>
                        <span>Threshold: {item.reorderThreshold} {item.unit}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{item.daysUntilDepletion} days left</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lowItems.length > 0 && (
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
                  LOW STOCK ({lowItems.length})
                </h4>
                <div>
                  {lowItems.map((item, index) => (
                    <div 
                      key={item.id} 
                      style={{ 
                        padding: '20px 0',
                        borderBottom: index === lowItems.length - 1 ? 'none' : '1px solid rgba(179, 224, 231, 0.3)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, color: '#0A0A0A', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                          <p style={{ color: '#6B6B6B', fontSize: '0.75rem' }}>{item.category} · {item.unit}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.125rem', fontWeight: 600, color: '#D4A017' }}>{item.currentStock}</span>
                          <SeverityBadge severity="WARNING" size="xs" />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#6B6B6B' }}>
                        <span>Threshold: {item.reorderThreshold} {item.unit}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{item.daysUntilDepletion} days left</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {criticalItems.length === 0 && lowItems.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center', color: '#6B6B6B' }}>
                <svg style={{ width: '48px', height: '48px', opacity: 0.3, marginBottom: '1rem' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p style={{ fontSize: '0.875rem', color: '#6B6B6B' }}>All inventory levels nominal</p>
                <p style={{ fontSize: '0.75rem', color: '#6B6B6B', opacity: 0.6, marginTop: '0.25rem' }}>No items below reorder threshold</p>
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center', color: '#6B6B6B' }}>
            <svg style={{ width: '48px', height: '48px', opacity: 0.3, marginBottom: '1rem' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{ fontSize: '0.875rem', color: '#6B6B6B' }}>No inventory data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InventorySummaryPanel;