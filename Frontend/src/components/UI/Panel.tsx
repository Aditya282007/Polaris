import React from 'react';

interface PanelProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerAction?: React.ReactNode;
  noPadding?: boolean;
  variant?: 'panel' | 'card';
}

export function Panel({ children, title, subtitle, className = '', headerAction, noPadding = false, variant = 'panel' }: PanelProps) {
  const baseClass = variant === 'card' ? 'liquid-glass-card' : 'liquid-glass';
  return (
    <div className={`${baseClass} ${className}`}>
      {(title || subtitle || headerAction) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', padding: '1.5rem' }}>
          <div>
            {title && (
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#0A0A0A', fontSize: '1.125rem', letterSpacing: '-0.01em' }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ color: '#6B6B6B', fontSize: '0.875rem', marginTop: '0.25rem' }}>{subtitle}</p>
            )}
          </div>
          {headerAction}
        </div>
      )}
      <div style={noPadding ? { padding: 0 } : { padding: '1.5rem' }}>
        {children}
      </div>
    </div>
  );
}

interface SeverityBadgeProps {
  severity: 'CRITICAL' | 'WARNING' | 'NOMINAL' | 'INFO' | 'RESOLVED';
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
}

export function SeverityBadge({ severity, size = 'sm', dot = false }: SeverityBadgeProps) {
  const configs = {
    CRITICAL: { bg: 'rgba(192, 57, 43, 0.22)', color: '#C0392B', border: 'rgba(192, 57, 43, 0.5)', dotColor: '#C0392B', label: 'CRITICAL' },
    WARNING: { bg: 'rgba(212, 160, 23, 0.22)', color: '#D4A017', border: 'rgba(212, 160, 23, 0.5)', dotColor: '#D4A017', label: 'WARNING' },
    NOMINAL: { bg: 'rgba(30, 138, 73, 0.22)', color: '#1E8A49', border: 'rgba(30, 138, 73, 0.5)', dotColor: '#1E8A49', label: 'NOMINAL' },
    INFO: { bg: 'rgba(40, 116, 166, 0.22)', color: '#2874A6', border: 'rgba(40, 116, 166, 0.5)', dotColor: '#2874A6', label: 'INFO' },
    RESOLVED: { bg: 'rgba(30, 138, 73, 0.22)', color: '#1E8A49', border: 'rgba(30, 138, 73, 0.5)', dotColor: '#1E8A49', label: 'RESOLVED' },
  };
  const c = configs[severity];
  const sizeStyles = {
    xs: { padding: '2px 8px', fontSize: '0.625rem', gap: '4px' },
    sm: { padding: '3px 9px', fontSize: '0.6875rem', gap: '5px' },
    md: { padding: '4px 10px', fontSize: '0.6875rem', gap: '6px' },
  };
  const s = sizeStyles[size] || sizeStyles.sm;
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: s.gap,
      padding: s.padding,
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: s.fontSize,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderRadius: '9999px',
      border: '1px solid',
      backgroundColor: c.bg,
      color: c.color,
      borderColor: c.border,
      backdropFilter: 'blur(8px) saturate(150%)',
      WebkitBackdropFilter: 'blur(8px) saturate(150%)',
    }}>
      {dot && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: c.dotColor, flexShrink: 0 }} />}
      <span>{c.label}</span>
    </span>
  );
}

export function StatCard({ label, value, unit, trend, className = '' }: {
  label: string;
  value: string | number;
  unit?: string;
  trend?: { value: number; label: string };
  className?: string;
}) {
  return (
    <div className={`liquid-glass-card p-3 ${className}`}>
      <p style={{ color: '#6B6B6B', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', fontWeight: 600, color: '#0A0A0A' }}>{value}</span>
        {unit && <span style={{ color: '#6B6B6B', fontSize: '0.875rem' }}>{unit}</span>}
      </div>
      {trend && (
        <p style={{ marginTop: '0.5rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#6B6B6B' }}>
          {trend.value >= 0 ? '▲' : '▼'} {Math.abs(trend.value)} {trend.label}
        </p>
      )}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="liquid-glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', textAlign: 'center' }}>
      <div style={{ width: '48px', height: '48px', opacity: 0.4, marginBottom: '1rem' }} aria-hidden="true">{icon}</div>
      <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#3A3A3A', marginBottom: '0.5rem' }}>{title}</h4>
      <p style={{ fontSize: '0.875rem', color: '#6B6B6B', maxWidth: '280px', lineHeight: 1.5 }}>{description}</p>
      {action}
    </div>
  );
}

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`liquid-glass animate-pulse ${className}`} style={{ animation: 'pulse 2s infinite' }} />
  );
}

export function Card({ children, className = '', onClick }: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div 
      className={`liquid-glass-card ${className}`}
      onClick={onClick}
      onMouseEnter={(e) => onClick && Object.assign(e.currentTarget.style, { 
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03), 0 0 0 1px rgba(255, 255, 255, 0.06) inset, 0 1px 0 rgba(255, 255, 255, 0.25) inset, 0 8px 24px rgba(0, 0, 0, 0.05), 0 16px 48px rgba(0, 0, 0, 0.04)' 
      })}
      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { 
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03), 0 0 0 1px rgba(255, 255, 255, 0.06) inset, 0 1px 0 rgba(255, 255, 255, 0.25) inset' 
      })}
    >
      {children}
    </div>
  );
}