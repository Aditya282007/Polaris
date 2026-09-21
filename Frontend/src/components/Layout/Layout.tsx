import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';

const navigation = [
  { path: '/', label: 'DASHBOARD', icon: 'dashboard' },
  { path: '/planner', label: 'EXPEDITION PLANNER', icon: 'planner' },
  { path: '/cargo', label: 'CARGO TRACKING', icon: 'cargo' },
  { path: '/inventory', label: 'INVENTORY', icon: 'inventory' },
  { path: '/personnel', label: 'PERSONNEL', icon: 'personnel' },
  { path: '/emergency', label: 'EMERGENCY', icon: 'emergency' },
];

const icons: Record<string, React.ReactNode> = {
  dashboard: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  planner: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l9 2 3.37-6.88L20.87 8.5A12.06 12.06 0 0021 12c0-6.627-5.373-12-12-12A12.06 12.06 0 003 12c0 1.92.506 3.74 1.378 5.3l8.16 4.28L16 21l-2.03-4.3a1 1 0 00-.56-.47l-2.5-.9A18.74 18.74 0 009.61 6.06l-.2.38a70 70 0 00-5.55 7.58l.31.62"/></svg>,
  cargo: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3m0 0v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3M9 10h1M15 10h1"/></svg>,
  inventory: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m8-4v10M4 7v10l8 4"/></svg>,
  personnel: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  emergency: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

const AURORA_GRADIENT = 'linear-gradient(135deg, #3EE6C4 0%, #5FB8E0 35%, #8A7FE0 70%, #D97FD0 100%)';

function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      setPos((prev) => ({
        x: prev.x + (targetPos.current.x - prev.x) * 0.08,
        y: prev.y + (targetPos.current.y - prev.y) * 0.08,
      }));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '600px',
        height: '600px',
        transform: `translate(${pos.x - 300}px, ${pos.y - 300}px)`,
        background:
          'radial-gradient(circle, rgba(62,230,196,0.50) 0%, rgba(95,184,224,0.40) 40%, transparent 80%)',
        pointerEvents: 'none',
        zIndex: -1,
        filter: 'blur(40px)',
        willChange: 'transform',
      }}
    />
  );
}

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>
      <CursorGlow />
      {/* Aurora gradient accent - 3px underline beneath header */}
      <div style={{
        height: '3px',
        width: '100%',
        background: 'linear-gradient(135deg, #3EE6C4 0%, #5FB8E0 35%, #8A7FE0 70%, #D97FD0 100%)',
        position: 'fixed',
        top: '64px',
        left: 0,
        zIndex: 50,
        pointerEvents: 'none',
      }} />

      <aside className="liquid-glass" style={{ height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 40, transition: 'width 0.2s', width: sidebarOpen ? '256px' : '64px', display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0" style={{ boxShadow: '0 4px 16px rgba(179, 224, 231, 0.4), 0 0 0 1px rgba(255,255,255,0.3) inset' }}>
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-ui font-bold text-xl text-primary tracking-tight">POLARIS</h1>
                <p className="text-muted text-xs uppercase tracking-wider">MISSION CONTROL</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="liquid-glass-card p-2"
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarOpen ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
            </svg>
          </button>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0.5rem', overflowY: 'auto' }} aria-label="Main navigation">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} role="list">
            {navigation.map(item => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              const Icon = icons[item.icon];
              // Determine badge class based on icon
              let badgeClass = '';
              switch (item.icon) {
                case 'personnel':
                  badgeClass = 'icon-badge--personnel';
                  break;
                case 'cargo':
                  badgeClass = 'icon-badge--cargo';
                  break;
                case 'inventory':
                  badgeClass = 'icon-badge--equipment';
                  break;
                case 'emergency':
                  badgeClass = 'icon-badge--weather';
                  break;
                // dashboard, planner: no specific class (use default icon-badge)
                default:
                  badgeClass = '';
              }
              return (
                <li key={item.path} style={{ marginBottom: '0.25rem' }}>
                  <NavLink
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '12px',
                      transition: 'all 0.15s',
                      color: isActive ? '#5FB8E0' : '#4A4A4A',
                      backgroundColor: isActive ? 'rgba(95,184,224,0.18)' : 'transparent',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(179,224,231,0.15)';
                        e.currentTarget.style.color = '#0A0A0A';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#6B6B6B';
                      }
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className={`icon-badge ${badgeClass}`} aria-hidden="true">
                      {Icon}
                    </span>
                    {sidebarOpen && <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: isActive ? 600 : 500, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6B6B6B' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1E8A49' }} />
                <span style={{ fontWeight: 500 }}>LIVE SYSTEMS NOMINAL</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D4A017' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D4A017', animation: 'pulse 2s infinite' }} />
                <span>1 CRITICAL ALERT</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D4A017' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D4A017' }} />
                <span>3 WARNINGS ACTIVE</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', color: '#6B6B6B' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1E8A49' }} title="Systems Nominal" />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D4A017', animation: 'pulse 2s infinite' }} title="1 Critical Alert" />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D4A017' }} title="3 Warnings Active" />
            </div>
          )}
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: sidebarOpen ? '256px' : '64px', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;