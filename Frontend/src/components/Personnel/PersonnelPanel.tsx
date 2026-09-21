import React from 'react';

export function PersonnelPanel({ personnel, className = '' }: {
  personnel: Array<{
    id: string;
    name: string;
    role: string;
    station: string;
    status: string;
    lastCheckIn: string;
    nextScheduledCheckIn?: string;
    missionId?: string;
    missionName?: string;
    overdueMinutes: number;
  }>;
  className?: string;
}) {
  return (
    <div className="h-full">
      <div className="mb-4">
        <h4 className="font-ui font-medium text-polar-accent-warm text-data-sm mb-3 uppercase tracking-wider">OVERDUE PERSONNEL</h4>
        <div className="space-y-2">
          <div className="bg-polar-panel-ice/50 border border-polar-accent-warm/30 p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 text-data-xs font-ui font-medium uppercase tracking-wider rounded-none border hair bg-polar-accent-warm/15 text-polar-accent-warm border-polar-accent-warm/30">
                    OVERDUE
                  </span>
                  <span className="font-ui text-data-xs text-polar-text-muted uppercase tracking-wider">MAITRI</span>
                </div>
                <h4 className="font-ui font-semibold text-polar-text-primary text-data-base mb-1">Eng. Eriksson</h4>
                <p className="text-polar-text-muted text-data-sm">Power Systems Lead</p>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-1">
                <p className="text-polar-text-muted text-data-xs">Last: 22:00 UTC</p>
              </div>
              <div className="pt-2 border-t border-polar-border-ice/50 flex items-center justify-between text-data-xs text-polar-text-muted">
                <span>Mission: Arctic Station Upgrade</span>
                <span className="font-mono">PER-004</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-polar-panel-ice/50 border border-polar-border-ice h-full flex flex-col">
          <div className="p-4 border-b border-polar-border-ice/50 flex items-center justify-between">
            <h4 className="font-ui font-medium text-polar-text-primary text-data-sm uppercase tracking-wider">ON FIELD</h4>
            <span className="font-mono text-data-lg font-medium" style={{ color: '#3B82F6' }}>3</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="bg-polar-base-night/50 border border-polar-border-ice/50 p-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3B82F6' }} />
                  <div className="min-w-0">
                    <p className="font-ui font-medium text-data-sm text-polar-text-primary truncate">Dr. Arjun Rao</p>
                    <p className="text-polar-text-muted text-data-xs">Station Leader</p>
                  </div>
                </div>
                <span className="text-polar-text-muted/60 text-data-xs font-mono">MAITRI</span>
              </div>
              <div className="flex items-center justify-between text-data-xs text-polar-text-muted/60">
                <span>Last: 06:00 UTC</span>
              </div>
            </div>
            <div className="bg-polar-base-night/50 border border-polar-border-ice/50 p-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3B82F6' }} />
                  <div className="min-w-0">
                    <p className="font-ui font-medium text-data-sm text-polar-text-primary truncate">Priya Patel</p>
                    <p className="text-polar-text-muted text-data-xs">Scientist</p>
                  </div>
                </div>
                <span className="text-polar-text-muted/60 text-data-xs font-mono">BHARATI</span>
              </div>
              <div className="flex items-center justify-between text-data-xs text-polar-text-muted/60">
                <span>Last: 05:30 UTC</span>
              </div>
            </div>
            <div className="bg-polar-base-night/50 border border-polar-border-ice/50 p-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3B82F6' }} />
                  <div className="min-w-0">
                    <p className="font-ui font-medium text-data-sm text-polar-text-primary truncate">Viktor Kozlov</p>
                    <p className="text-polar-text-muted text-data-xs">Atmospheric Scientist</p>
                  </div>
                </div>
                <span className="text-polar-text-muted/60 text-data-xs font-mono">BHARATI</span>
              </div>
              <div className="flex items-center justify-between text-data-xs text-polar-text-muted/60">
                <span>Last: 04:30 UTC</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-polar-panel-ice/50 border border-polar-border-ice h-full flex flex-col">
          <div className="p-4 border-b border-polar-border-ice/50 flex items-center justify-between">
            <h4 className="font-ui font-medium text-polar-text-primary text-data-sm uppercase tracking-wider">CHECKED IN</h4>
            <span className="font-mono text-data-lg font-medium" style={{ color: '#22C55E' }}>4</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="bg-polar-base-night/50 border border-polar-border-ice/50 p-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22C55E' }} />
                  <div className="min-w-0">
                    <p className="font-ui font-medium text-data-sm text-polar-text-primary truncate">Arjun Rao</p>
                    <p className="text-polar-text-muted text-data-xs">Station Leader</p>
                  </div>
                </div>
                <span className="text-polar-text-muted/60 text-data-xs font-mono">MAITRI</span>
              </div>
              <div className="flex items-center justify-between text-data-xs text-polar-text-muted/60">
                <span>Last: 06:00 UTC</span>
              </div>
            </div>
            <div className="bg-polar-base-night/50 border border-polar-border-ice/50 p-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22C55E' }} />
                  <div className="min-w-0">
                    <p className="font-ui font-medium text-data-sm text-polar-text-primary truncate">Meera Iyer</p>
                    <p className="text-polar-text-muted text-data-xs">Chief Medical Officer</p>
                  </div>
                </div>
                <span className="text-polar-text-muted/60 text-data-xs font-mono">BHARATI</span>
              </div>
              <div className="flex items-center justify-between text-data-xs text-polar-text-muted/60">
                <span>Last: 07:15 UTC</span>
              </div>
            </div>
            <div className="bg-polar-base-night/50 border border-polar-border-ice/50 p-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22C55E' }} />
                  <div className="min-w-0">
                    <p className="font-ui font-medium text-data-sm text-polar-text-primary truncate">Aisha Al-Farsi</p>
                    <p className="text-polar-text-muted text-data-xs">Glaciologist</p>
                  </div>
                </div>
                <span className="text-polar-text-muted/60 text-data-xs font-mono">BHARATI</span>
              </div>
              <div className="flex items-center justify-between text-data-xs text-polar-text-muted/60">
                <span>Last: 06:45 UTC</span>
              </div>
            </div>
            <div className="bg-polar-base-night/50 border border-polar-border-ice/50 p-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22C55E' }} />
                  <div className="min-w-0">
                    <p className="font-ui font-medium text-data-sm text-polar-text-primary truncate">Rajesh Kumar</p>
                    <p className="text-polar-text-muted text-data-xs">Medical Officer</p>
                  </div>
                </div>
                <span className="text-polar-text-muted/60 text-data-xs font-mono">MAITRI</span>
              </div>
              <div className="flex items-center justify-between text-data-xs text-polar-text-muted/60">
                <span>Last: 07:15 UTC</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-polar-panel-ice/50 border border-polar-border-ice h-full flex flex-col">
          <div className="p-4 border-b border-polar-border-ice/50 flex items-center justify-between">
            <h4 className="font-ui font-medium text-polar-text-primary text-data-sm uppercase tracking-wider">CHECKED OUT</h4>
            <span className="font-mono text-data-lg font-medium" style={{ color: '#7BA8D4' }}>2</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="bg-polar-base-night/50 border border-polar-border-ice/50 p-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7BA8D4' }} />
                  <div className="min-w-0">
                    <p className="font-ui font-medium text-data-sm text-polar-text-primary truncate">Rajesh Kumar</p>
                    <p className="text-polar-text-muted text-data-xs">Medical Officer</p>
                  </div>
                </div>
                <span className="text-polar-text-muted/60 text-data-xs font-mono">MAITRI</span>
              </div>
              <div className="flex items-center justify-between text-data-xs text-polar-text-muted/60">
                <span>Last: 20:00 UTC</span>
              </div>
            </div>
            <div className="bg-polar-base-night/50 border border-polar-border-ice/50 p-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7BA8D4' }} />
                  <div className="min-w-0">
                    <p className="font-ui font-medium text-data-sm text-polar-text-primary truncate">Miguel Gonzalez</p>
                    <p className="text-polar-text-muted text-data-xs">Medical Officer</p>
                  </div>
                </div>
                <span className="text-polar-text-muted/60 text-data-xs font-mono">BHARATI</span>
              </div>
              <div className="flex items-center justify-between text-data-xs text-polar-text-muted/60">
                <span>Last: 08:00 UTC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonnelPanel;