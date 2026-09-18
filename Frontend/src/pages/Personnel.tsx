import React, { useState, useEffect } from 'react';
import { Panel, SeverityBadge, EmptyState } from '../components/UI/Panel';
import type { Personnel as PersonnelType, PersonnelStatus } from '../types';
import { api } from '../api';

export function Personnel() {
  const [personnel, setPersonnel] = useState<PersonnelType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overdueThreshold, setOverdueThreshold] = useState(360); // 6 hours in minutes

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.personnel.getAll();
      setPersonnel(data);
    } catch (err) {
      console.error('Failed to load personnel data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async (id: string) => {
    try {
      const updated = await api.personnel.checkIn(id, '');
      if (updated) {
        setPersonnel(prev => prev.map(p => p.id === id ? updated : p));
      }
    } catch (err) {
      console.error('Failed to check in:', err);
    }
  };

  const handleCheckOut = async (id: string) => {
    try {
      const updated = await api.personnel.checkOut(id);
      if (updated) {
        setPersonnel(prev => prev.map(p => p.id === id ? updated : p));
      }
    } catch (err) {
      console.error('Failed to check out:', err);
    }
  };

  const formatDateTime = (iso: string) => new Date(iso).toLocaleString('en-GB', { 
    day: '2-digit', month: 'short', year: 'numeric', 
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC' 
  }) + ' UTC';

  const getStatusConfig = (status: PersonnelStatus) => {
    switch (status) {
      case 'CHECKED_IN': return { bg: 'rgba(30, 138, 73, 0.12)', text: '#1E8A49', border: 'rgba(30, 138, 73, 0.3)', dot: '#1E8A49' };
      case 'ON_FIELD': return { bg: 'rgba(40, 116, 166, 0.12)', text: '#2874A6', border: 'rgba(40, 116, 166, 0.3)', dot: '#2874A6' };
      case 'OVERDUE': return { bg: 'rgba(192, 57, 43, 0.12)', text: '#C0392B', border: 'rgba(192, 57, 43, 0.3)', dot: '#C0392B' };
      case 'CHECKED_OUT': return { bg: 'rgba(107, 107, 107, 0.12)', text: '#6B6B6B', border: 'rgba(107, 107, 107, 0.3)', dot: '#6B6B6B' };
      default: return { bg: 'rgba(107, 107, 107, 0.12)', text: '#6B6B6B', border: 'rgba(107, 107, 107, 0.3)', dot: '#6B6B6B' };
    }
  };

  const isOverdue = (p: PersonnelType) => {
    if (!p.nextScheduledCheckIn) return false;
    const now = new Date();
    const next = new Date(p.nextScheduledCheckIn);
    const diffMinutes = (now.getTime() - next.getTime()) / (1000 * 60);
    return diffMinutes > overdueThreshold;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-ui font-bold text-2xl text-primary tracking-tight">PERSONNEL ROSTER</h1>
          <p className="text-muted text-sm mt-1">Check-in status, roles & station assignments</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-ui font-medium text-muted uppercase tracking-wider">OVERDUE THRESHOLD</label>
            <select
              value={overdueThreshold}
              onChange={e => setOverdueThreshold(parseInt(e.target.value))}
              className="select-field text-sm"
            >
              <option value={60}>1 HOUR</option>
              <option value={180}>3 HOURS</option>
              <option value={360}>6 HOURS</option>
              <option value={720}>12 HOURS</option>
              <option value={1440}>24 HOURS</option>
            </select>
          </div>
          <button className="btn-primary text-sm whitespace-nowrap">
            CHECK IN
          </button>
        </div>
      </div>

      <Panel title="PERSONNEL ROSTER" subtitle="All personnel with check-in status">
        {isLoading ? (
          <div className="text-center py-12 text-muted">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent mx-auto mb-4" />
            <p>Loading personnel data...</p>
          </div>
        ) : personnel.length > 0 ? (
          <div className="table-container">
            <table className="data-table" role="table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>ROLE</th>
                  <th>STATION</th>
                  <th>STATUS</th>
                  <th>LAST CHECK-IN</th>
                  <th>NEXT DUE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {personnel.map(p => {
                  const config = getStatusConfig(p.status);
                  const overdue = isOverdue(p);
                  const displayStatus = overdue && p.status !== 'OVERDUE' ? 'OVERDUE' : p.status;
                  const displayConfig = overdue && p.status !== 'OVERDUE' ? getStatusConfig('OVERDUE') : config;
                  
                  return (
                    <tr key={p.id} className={overdue ? 'bg-liquid-glass' : ''}>
                      <td className="font-ui font-medium text-primary truncate max-w-xs">{p.name}</td>
                      <td className="text-muted">{p.role}</td>
                      <td className="font-mono text-sm text-primary">{p.station}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: displayConfig.dot }} />
                          <SeverityBadge severity={displayStatus === 'OVERDUE' ? 'CRITICAL' : displayStatus === 'CHECKED_IN' ? 'NOMINAL' : displayStatus === 'ON_FIELD' ? 'WARNING' : 'NOMINAL'} size="xs" />
                        </div>
                      </td>
                      <td className="text-muted font-mono text-xs">{formatDateTime(p.lastCheckIn)}</td>
                      <td className="text-muted font-mono text-xs">
                        {p.nextScheduledCheckIn ? formatDateTime(p.nextScheduledCheckIn) : '—'}
                        {overdue && <span className="text-critical text-xs ml-1 font-ui">(OVERDUE)</span>}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          {p.status === 'CHECKED_IN' || p.status === 'ON_FIELD' ? (
                            <button
                              onClick={() => handleCheckOut(p.id)}
                              className="btn-danger text-xs px-3 py-1.5 whitespace-nowrap"
                            >
                              CHECK OUT
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCheckIn(p.id)}
                              className="btn-primary text-xs px-3 py-1.5 whitespace-nowrap"
                            >
                              CHECK IN
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" strokeWidth="1.5"/></svg>}
            title="No personnel data"
            description="No personnel records found. Add team members to begin tracking."
          />
        )}
      </Panel>

      {/* Overdue Summary */}
      <Panel title="OVERDUE SUMMARY" subtitle={`Personnel overdue beyond ${overdueThreshold} minutes threshold`}>
        {personnel.filter(p => isOverdue(p)).length > 0 ? (
          <div className="space-y-3">
            {personnel.filter(p => isOverdue(p)).map(p => (
              <div key={p.id} className="liquid-glass p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full status-dot-critical flex-shrink-0 animate-pulse" />
                    <div className="min-w-0">
                      <p className="font-ui font-semibold text-primary text-base">{p.name}</p>
                      <p className="text-muted text-sm">{p.role} · {p.station}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <SeverityBadge severity="CRITICAL" size="sm" />
                    <p className="text-muted text-xs font-mono">{p.overdueMinutes} min overdue</p>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-3 text-xs text-muted">
                  <div><span className="font-mono">Last check-in:</span> {formatDateTime(p.lastCheckIn)}</div>
                  <div><span className="font-mono">Next due:</span> {p.nextScheduledCheckIn ? formatDateTime(p.nextScheduledCheckIn) : '—'}</div>
                  <div><span className="font-mono">Mission:</span> {p.missionName || 'Unassigned'}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted">
            <svg className="w-12 h-12 text-success/50 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 4L12 14.01l-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-muted text-sm">No overdue personnel</p>
            <p className="text-muted/60 text-xs mt-1">All team members checked in on schedule</p>
          </div>
        )}
      </Panel>
    </div>
  );
}

export default Personnel;