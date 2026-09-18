import { SeverityBadge } from '../UI/Panel';

interface FeedItemProps {
  item: {
    id: string;
    timestamp: string;
    severity: 'CRITICAL' | 'WARNING' | 'NOMINAL';
    category: string;
    title: string;
    description: string;
    station: string;
    actionRequired: boolean;
    suggestedAction?: string;
    source: string;
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: string;
  };
  onAcknowledge?: (id: string) => void;
  isLast?: boolean;
}

function CategoryIcon({ category }: { category: string }) {
  const icons: Record<string, React.ReactNode> = {
    CARGO: <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3m0 0v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3M9 10h1M15 10h1" />,
    PERSONNEL: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 9a3 3 0 1 0 6 0 3 3 0 0 0-6 0z" />,
    EQUIPMENT: <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.572 1.065c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
    WEATHER: <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707-.707M6.343 17.657l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />,
    MEDICAL: <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    COMMUNICATION: <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
  };
  return <svg style={{ width: '20px', height: '20px', color: '#6B6B6B' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icons[category] || icons.EQUIPMENT}</svg>;
}

function FeedItem({ item, onAcknowledge, isLast }: FeedItemProps) {
  const badgeClass = [
    ['PERSONNEL', 'icon-badge--personnel'],
    ['CARGO', 'icon-badge--cargo'],
    ['EQUIPMENT', 'icon-badge--equipment'],
    ['WEATHER', 'icon-badge--weather'],
    ['MEDICAL', 'icon-badge--personnel'],
    ['COMMUNICATION', 'icon-badge--equipment'],
  ].find(([cat]) => cat === item.category)?.[1] ?? 'icon-badge--equipment';

  return (
    <div style={{ 
      padding: '20px 0', 
      borderBottom: isLast ? 'none' : '1px solid rgba(179, 224, 231, 0.3)' 
    }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flexShrink: 0, width: '40px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '4px' }}>
          <span className={`icon-badge ${badgeClass}`} aria-hidden="true">
            <CategoryIcon category={item.category} />
          </span>
        </div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                <SeverityBadge severity={item.severity} size="xs" />
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.75rem', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.category}</span>
                <span style={{ color: '#6B6B6B', fontSize: '0.75rem' }}>{item.station}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#6B6B6B' }}>{formatTime(item.timestamp)}</span>
              </div>
              <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, color: '#0A0A0A', fontSize: '1rem', marginBottom: '0.25rem' }}>{item.title}</h4>
              <p style={{ color: '#6B6B6B', fontSize: '0.875rem', lineHeight: 1.5 }}>{item.description}</p>
            </div>
            
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              {item.acknowledged && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#6B6B6B' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1E8A49' }} />
                  ACK
                </span>
              )}
              {!item.acknowledged && item.actionRequired && onAcknowledge && (
                <button
                  onClick={() => onAcknowledge(item.id)}
                  style={{
                    background: 'linear-gradient(135deg, #B3E0E7 0%, #80C4CF 100%)',
                    color: '#0A0A0A',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 4px 16px rgba(179, 224, 231, 0.3), 0 0 0 1px rgba(255,255,255,0.2) inset',
                  }}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, { background: 'linear-gradient(135deg, #9BD0D9 0%, #6BC4C4 100%)', transform: 'translateY(-1px)' })}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: 'linear-gradient(135deg, #B3E0E7 0%, #80C4CF 100%)', transform: 'translateY(0)' })}
                >
                  ACKNOWLEDGE
                </button>
              )}
            </div>
          </div>
          
          {item.suggestedAction && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, color: '#B3E0E7', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>SUGGESTED ACTION</p>
              <p style={{ color: '#6B6B6B', fontSize: '0.875rem' }}>{item.suggestedAction}</p>
            </div>
          )}
          
          {item.acknowledged && item.acknowledgedBy && (
            <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <p style={{ color: '#6B6B6B', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace' }}>
                Acknowledged by {item.acknowledgedBy} at {item.acknowledgedAt ? formatTime(item.acknowledgedAt) : '—'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' }) + ' UTC';
}

export function ActionFeedPanel({ items, onAcknowledge, className = '' }: {
  items: Array<{
    id: string;
    timestamp: string;
    severity: 'CRITICAL' | 'WARNING' | 'NOMINAL';
    category: string;
    title: string;
    description: string;
    station: string;
    actionRequired: boolean;
    suggestedAction?: string;
    source: string;
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: string;
  }>;
  onAcknowledge?: (id: string) => void;
  className?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center', color: '#6B6B6B' }}>
          <svg style={{ width: '48px', height: '48px', opacity: 0.3, marginBottom: '1rem' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 17h5l-1.41-1.41L14 15.58V9H8v6.58l-2.29 2.29L8 17h5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p style={{ fontSize: '0.875rem', color: '#6B6B6B' }}>No active alerts</p>
          <p style={{ fontSize: '0.75rem', color: '#6B6B6B', opacity: 0.6, marginTop: '0.25rem' }}>All systems nominal</p>
        </div>
      ) : (
        items.map((item, index) => (
          <FeedItem key={item.id} item={item} onAcknowledge={onAcknowledge} isLast={index === items.length - 1} />
        ))
      )}
    </div>
  );
}

