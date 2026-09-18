import React, { useState, useEffect } from 'react';
import { Panel, SeverityBadge, EmptyState } from '../components/UI/Panel';
import { Incident, IncidentType, IncidentSeverity } from '../types';
import { api } from '../api';
import { classifyIncident } from '../services/classifyIncident';

export function Emergency() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [classification, setClassification] = useState<{ type: IncidentType; severity: IncidentSeverity; summary: string; suggestedAction: string } | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);

  const [formData, setFormData] = useState<{
    type: IncidentType;
    severity: IncidentSeverity;
    title: string;
    description: string;
    station: 'MAITRI' | 'BHARATI' | 'HIMADRI';
    suggestedAction: string;
  }>({
    type: 'EQUIPMENT',
    severity: 'WARNING',
    title: '',
    description: '',
    station: 'MAITRI',
    suggestedAction: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.incidents.getAll();
      setIncidents(data);
    } catch (err) {
      console.error('Failed to load incidents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClassify = async () => {
    if (!formData.description.trim()) return;
    
    setIsClassifying(true);
    try {
      const result = await classifyIncident(formData.description);
      setClassification(result);
      setFormData(prev => ({ 
        ...prev, 
        type: result.type, 
        severity: result.severity,
        suggestedAction: result.suggestedAction,
      }));
    } catch (err) {
      console.error('Classification failed:', err);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    try {
      const newIncident = await api.incidents.create({
        ...formData,
        relatedEntity: 'unknown',
        reportedBy: 'CURRENT_USER',
      });
      setIncidents(prev => [newIncident, ...prev]);
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Failed to submit incident:', err);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      const updated = await api.incidents.resolve(id);
      if (updated) {
        setIncidents(prev => prev.map(i => i.id === id ? updated : i));
      }
    } catch (err) {
      console.error('Failed to resolve incident:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'EQUIPMENT',
      severity: 'WARNING',
      title: '',
      description: '',
      station: 'MAITRI',
      suggestedAction: '',
    });
    setClassification(null);
  };

  const formatDateTime = (iso: string) => new Date(iso).toLocaleString('en-GB', { 
    day: '2-digit', month: 'short', year: 'numeric', 
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC' 
  }) + ' UTC';

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'OPEN': return { bg: 'rgba(192, 57, 43, 0.12)', text: '#C0392B', border: 'rgba(192, 57, 43, 0.3)' };
      case 'ACKNOWLEDGED': return { bg: 'rgba(212, 160, 23, 0.12)', text: '#D4A017', border: 'rgba(212, 160, 23, 0.3)' };
      case 'IN_PROGRESS': return { bg: 'rgba(40, 116, 166, 0.12)', text: '#2874A6', border: 'rgba(40, 116, 166, 0.3)' };
      case 'RESOLVED': return { bg: 'rgba(30, 138, 73, 0.12)', text: '#1E8A49', border: 'rgba(30, 138, 73, 0.3)' };
      default: return { bg: 'rgba(107, 107, 107, 0.12)', text: '#6B6B6B', border: 'rgba(107, 107, 107, 0.3)' };
    }
  };

  const getSeverityConfig = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'CRITICAL': return { bg: 'rgba(192, 57, 43, 0.12)', text: '#C0392B', border: 'rgba(192, 57, 43, 0.3)' };
      case 'WARNING': return { bg: 'rgba(212, 160, 23, 0.12)', text: '#D4A017', border: 'rgba(212, 160, 23, 0.3)' };
      case 'NOMINAL': return { bg: 'rgba(30, 138, 73, 0.12)', text: '#1E8A49', border: 'rgba(30, 138, 73, 0.3)' };
      default: return { bg: 'rgba(107, 107, 107, 0.12)', text: '#6B6B6B', border: 'rgba(107, 107, 107, 0.3)' };
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-ui font-bold text-2xl text-primary tracking-tight">EMERGENCY CONSOLE</h1>
          <p className="text-muted text-sm mt-1">Incident reporting, triage & response coordination</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-sm whitespace-nowrap">
          REPORT INCIDENT
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Incident Queue */}
        <Panel title="INCIDENT QUEUE" subtitle="All reported incidents by severity">
          {isLoading ? (
            <div className="text-center py-12 text-muted h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
            </div>
          ) : incidents.length > 0 ? (
            <div className="space-y-3">
              {incidents.map(inc => {
                const statusConfig = getStatusConfig(inc.status);
                const severityConfig = getSeverityConfig(inc.severity);
                const isResolved = inc.status === 'RESOLVED';
                
                return (
                  <div
                    key={inc.id}
                    className={`liquid-glass p-4 space-y-3 transition-all ${isResolved ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                        <SeverityBadge severity={inc.severity} size="sm" />
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-ui font-medium uppercase tracking-wider rounded-full border" style={{ backgroundColor: severityConfig.bg, color: severityConfig.text, borderColor: severityConfig.border }}>
                          {inc.type}
                        </span>
                        <span className="font-mono text-xs text-muted">{inc.station}</span>
                        <span className="font-mono text-xs text-muted">{formatDateTime(inc.reportedAt)}</span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-ui font-medium uppercase tracking-wider rounded-full border" style={{ backgroundColor: statusConfig.bg, color: statusConfig.text, borderColor: statusConfig.border }}>
                          {inc.status}
                        </span>
                      </div>
                      <div className="flex-shrink-0 flex flex-col items-end gap-2">
                        {!isResolved && (
                          <button
                            onClick={() => handleResolve(inc.id)}
                            className="btn-primary text-xs px-3 py-1.5"
                          >
                            RESOLVE
                          </button>
                        )}
                        {isResolved && (
                          <span className="flex items-center gap-1.5 text-xs text-success">
                            <span className="w-2 h-2 rounded-full status-dot-resolved" />
                            RESOLVED
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="font-ui font-semibold text-primary text-base mb-1">{inc.title}</h4>
                    <p className="text-muted text-sm leading-relaxed">{inc.description}</p>

                    {inc.suggestedAction && (
                      <div className="pt-3 border-t" style={{ borderColor: 'rgba(179, 224, 231, 0.5)' }}>
                        <p className="font-ui font-medium text-accent text-xs uppercase tracking-wider mb-1">SUGGESTED ACTION</p>
                        <p className="text-muted text-sm">{inc.suggestedAction}</p>
                      </div>
                    )}

                    {inc.acknowledgedAt && (
                      <div className="pt-2 border-t" style={{ borderColor: 'rgba(179, 224, 231, 0.5)' }}>
                        <p className="text-muted/60 text-xs font-mono">
                          Acknowledged at {formatDateTime(inc.acknowledgedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={<svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
              title="No incidents reported"
              description="All systems nominal. Use 'Report Incident' to log new events."
            />
          )}
        </Panel>

        {/* Report New Incident */}
        <Panel title="REPORT NEW INCIDENT" subtitle="Submit emergency or operational incident">
          <form onSubmit={handleSubmit} className="space-y-4">
            {classification && (
              <div className="liquid-glass border border-accent/30 p-4 space-y-2" style={{ backgroundColor: 'rgba(179, 224, 231, 0.12)' }}>
                <p className="font-ui font-medium text-primary text-xs uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  AI CLASSIFICATION RESULT
                </p>
                <div className="grid gap-2 sm:grid-cols-3 text-sm">
                  <div><span className="text-muted">Type:</span> <span className="font-mono ml-2 text-primary">{classification.type}</span></div>
                  <div><span className="text-muted">Severity:</span> <SeverityBadge severity={classification.severity} size="xs" /></div>
                  <div className="sm:col-span-3"><span className="text-muted">Summary:</span> <span className="ml-2 text-primary">{classification.summary}</span></div>
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-ui font-medium text-muted uppercase tracking-wider mb-1">TYPE</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as IncidentType }))}
                  className="select-field"
                >
                  <option value="CARGO">CARGO</option>
                  <option value="PERSONNEL">PERSONNEL</option>
                  <option value="EQUIPMENT">EQUIPMENT</option>
                  <option value="WEATHER">WEATHER</option>
                  <option value="MEDICAL">MEDICAL</option>
                  <option value="COMMUNICATION">COMMUNICATION</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-ui font-medium text-muted uppercase tracking-wider mb-1">SEVERITY</label>
                <select
                  value={formData.severity}
                  onChange={e => setFormData(prev => ({ ...prev, severity: e.target.value as IncidentSeverity }))}
                  className="select-field"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="WARNING">WARNING</option>
                  <option value="NOMINAL">NOMINAL</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-ui font-medium text-muted uppercase tracking-wider mb-1">STATION</label>
                <select
                  value={formData.station}
                  onChange={e => setFormData(prev => ({ ...prev, station: e.target.value as 'MAITRI' | 'BHARATI' | 'HIMADRI' }))}
                  className="select-field"
                >
                  <option value="MAITRI">MAITRI</option>
                  <option value="BHARATI">BHARATI</option>
                  <option value="HIMADRI">HIMADRI</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-ui font-medium text-muted uppercase tracking-wider mb-1">TITLE</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="input-field"
                placeholder="Brief incident title"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-ui font-medium text-muted uppercase tracking-wider mb-1">DESCRIPTION</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="textarea-field"
                placeholder="Detailed description of the incident (e.g., 'engine fire on snowmobile near Bharati')"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClassify}
                disabled={!formData.description.trim() || isClassifying}
                className="btn-secondary text-xs"
              >
                {isClassifying ? 'CLASSIFYING...' : 'CLASSIFY WITH AI'}
              </button>
            </div>

            <div>
              <label className="block text-xs font-ui font-medium text-muted uppercase tracking-wider mb-1">SUGGESTED ACTION</label>
              <textarea
                value={formData.suggestedAction}
                onChange={e => setFormData(prev => ({ ...prev, suggestedAction: e.target.value }))}
                rows={3}
                className="textarea-field"
                placeholder="Immediate action required"
              />
            </div>

            <div className="pt-4 border-t flex justify-end" style={{ borderColor: 'rgba(179, 224, 231, 0.5)' }}>
              <button
                type="submit"
                className="btn-primary text-sm w-full sm:w-auto min-w-[200px]"
              >
                SUBMIT INCIDENT REPORT
              </button>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  );
}

export default Emergency;