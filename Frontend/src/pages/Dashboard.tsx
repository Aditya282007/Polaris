import React, { useEffect, useState } from 'react';
import { ActionFeedPanel } from '../components/ActionFeed/ActionFeedPanel';
import { MissionStatusPanel } from '../components/MissionStatus/MissionStatusPanel';
import { InventorySummaryPanel } from '../components/Inventory/InventorySummaryPanel';
import { PersonnelSnapshotPanel } from '../components/Personnel/PersonnelSnapshotPanel';
import { Panel, SeverityBadge, StatCard } from '../components/UI/Panel';
import { useLiveUpdates } from '../hooks/useLiveUpdates';
import { DashboardData, ActionFeedItem } from '../types';

export function Dashboard() {
  const [utcTime, setUtcTime] = useState('');
  const { dashboardData, connected, actionFeed, acknowledgeAction, refreshData } = useLiveUpdates({
    enabled: true,
    pollingInterval: 30000,
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' }) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = dashboardData ? [
    { label: 'ACTIVE MISSIONS', value: dashboardData.missions.filter(m => m.status === 'ACTIVE').length, unit: '', trend: { value: 0, label: 'vs last week' } },
    { label: 'LOW STOCK ITEMS', value: dashboardData.inventoryCritical.length, unit: '', trend: { value: 2, label: 'items critical' } },
    { label: 'OVERDUE PERSONNEL', value: dashboardData.personnelSnapshot.filter(p => p.status === 'OVERDUE').length, unit: '', trend: { value: 1, label: 'needs attention' } },
    { label: 'OPEN INCIDENTS', value: actionFeed.filter(a => !a.acknowledged && a.actionRequired).length, unit: '', trend: { value: -1, label: 'resolved today' } },
  ] : [];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="page-header">
        <div className="max-w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="font-ui font-bold text-xl text-primary tracking-tight">POLARIS</h1>
              <p className="text-muted text-xs uppercase tracking-wider">MISSION CONTROL</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm font-mono tabular-nums">
              <span className={`w-2 h-2 rounded-full ${connected ? 'status-dot-nominal animate-pulse' : 'status-dot-critical'}`} />
              <span>{connected ? 'LIVE' : 'OFFLINE'}</span>
            </div>
            <div className="text-right hidden sm:block">
              <p className="font-ui font-mono text-base text-primary">{utcTime}</p>
              <p className="text-muted text-xs">UTC</p>
            </div>
            <button
              onClick={refreshData}
              disabled={!connected}
              className="btn-primary text-sm"
            >
              REFRESH
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <div className="hero-band" aria-hidden="true"></div>
        {/* Stats Row */}
        <div className="card-grid mb-6">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat}  />
          ))}
        </div>

        {/* Main Grid - Action Feed spans full width on mobile, 7/12 on lg; Mission Status 5/12 on lg; Inventory & Personnel side by side */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Action Feed - full width on mobile, 7 cols on lg */}
          <div className="lg:col-span-7 min-w-0 gap-7 flex flex-col">
            <Panel title="ORCHESTRATOR ACTION FEED" subtitle="Prioritized alerts · click to acknowledge">
              <ActionFeedPanel 
                items={actionFeed} 
                onAcknowledge={acknowledgeAction} 
              />
            </Panel>
            
            <Panel title="MISSION STATUS" subtitle="Active expeditions · legs · timeline">
              {dashboardData && (
                <MissionStatusPanel missions={dashboardData.missions} />
              )}
            </Panel>
          </div>

          {/* Mission Status - 5 cols on lg, stacked below on mobile */}
          <div className="lg:col-span-5 min-w-0 gap-7 flex flex-col">
            <Panel title="INVENTORY SUMMARY" subtitle="Critical & low-stock items">
              {dashboardData && (
                <InventorySummaryPanel items={dashboardData.inventoryCritical} />
              )}
            </Panel>
            
            <Panel title="PERSONNEL SNAPSHOT" subtitle="Check-in status by station">
              {dashboardData && (
                <PersonnelSnapshotPanel personnel={dashboardData.personnelSnapshot} />
              )}
            </Panel>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;