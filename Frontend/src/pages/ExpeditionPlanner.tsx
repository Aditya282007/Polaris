import React, { useState, useEffect } from 'react';
import { Panel, SeverityBadge, EmptyState } from '../components/UI/Panel';
import { Mission, MissionLeg, Personnel, CargoItem } from '../types';
import { api } from '../api';

export function ExpeditionPlanner() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [cargo, setCargo] = useState<CargoItem[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    estimatedEndDate: '',
    legs: [{ from: 'MAITRI' as const, to: 'BHARATI' as const, startDate: '', endDate: '', status: 'UPCOMING' as const }],
    personnelIds: [] as string[],
    cargoIds: [] as string[],
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [missionsData, personnelData, cargoData] = await Promise.all([
        api.missions.getAll(),
        api.personnel.getAll(),
        api.cargo.getAll(),
      ]);
      setMissions(missionsData);
      setPersonnel(personnelData);
      setCargo(cargoData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Mission name is required';
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.estimatedEndDate) errors.estimatedEndDate = 'End date is required';
    if (new Date(formData.startDate) >= new Date(formData.estimatedEndDate)) {
      errors.estimatedEndDate = 'End date must be after start date';
    }
    if (formData.legs.length === 0) errors.legs = 'At least one leg is required';
    formData.legs.forEach((leg, i) => {
      if (!leg.from) errors[`leg_${i}_from`] = 'From station required';
      if (!leg.to) errors[`leg_${i}_to`] = 'To station required';
      if (!leg.startDate) errors[`leg_${i}_startDate`] = 'Start date required';
      if (!leg.endDate) errors[`leg_${i}_endDate`] = 'End date required';
      if (new Date(leg.startDate) >= new Date(leg.endDate)) {
        errors[`leg_${i}_endDate`] = 'End date must be after start date';
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const newMission = await api.missions.create({
        name: formData.name,
        status: 'PLANNING',
        legs: formData.legs.map((leg, i) => ({
          id: `LEG-${Date.now()}-${i}`,
          ...leg,
          cargoIds: [],
          personnelIds: [],
        })),
        currentLegIndex: 0,
        startDate: formData.startDate,
        estimatedEndDate: formData.estimatedEndDate,
        cargoIds: formData.cargoIds,
        personnelIds: formData.personnelIds,
      });
      setMissions(prev => [newMission, ...prev]);
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error('Failed to create mission:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      startDate: '',
      estimatedEndDate: '',
      legs: [{ from: 'MAITRI' as const, to: 'BHARATI' as const, startDate: '', endDate: '', status: 'UPCOMING' as const }],
      personnelIds: [],
      cargoIds: [],
    });
    setFormErrors({});
  };

  const addLeg = () => {
    setFormData(prev => ({
      ...prev,
      legs: [...prev.legs, { from: 'MAITRI' as const, to: 'BHARATI' as const, startDate: '', endDate: '', status: 'UPCOMING' as const }],
    }));
  };

  const removeLeg = (index: number) => {
    if (formData.legs.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      legs: prev.legs.filter((_, i) => i !== index),
    }));
  };

  const updateLeg = (index: number, field: keyof MissionLeg, value: string) => {
    setFormData(prev => ({
      ...prev,
      legs: prev.legs.map((leg, i) => i === index ? { ...leg, [field]: value } : leg),
    }));
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ACTIVE': return { bg: 'rgba(40, 116, 166, 0.12)', text: '#2874A6', border: 'rgba(40, 116, 166, 0.3)', dot: '#2874A6' };
      case 'PLANNING': return { bg: 'rgba(107, 107, 107, 0.12)', text: '#6B6B6B', border: 'rgba(107, 107, 107, 0.3)', dot: '#6B6B6B' };
      case 'COMPLETED': return { bg: 'rgba(30, 138, 73, 0.12)', text: '#1E8A49', border: 'rgba(30, 138, 73, 0.3)', dot: '#1E8A49' };
      case 'CANCELLED': return { bg: 'rgba(192, 57, 43, 0.12)', text: '#C0392B', border: 'rgba(192, 57, 43, 0.3)', dot: '#C0392B' };
      default: return { bg: 'rgba(107, 107, 107, 0.12)', text: '#6B6B6B', border: 'rgba(107, 107, 107, 0.3)', dot: '#6B6B6B' };
    }
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-ui font-bold text-2xl text-primary tracking-tight">EXPEDITION PLANNER</h1>
          <p className="text-muted text-sm mt-1">Create and manage expedition missions, legs, cargo & personnel assignments</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowCreateModal(true); }}
          className="btn-primary text-sm whitespace-nowrap"
        >
          CREATE MISSION
        </button>
      </div>

      <Panel title="MISSIONS" subtitle="Active, planning & completed expeditions">
        {isLoading ? (
          <div className="text-center py-12 text-muted">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent mx-auto mb-4" />
            <p>Loading missions...</p>
          </div>
        ) : missions.length > 0 ? (
          <div className="table-container">
            <table className="data-table" role="table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>LEGS</th>
                  <th>TEAM</th>
                  <th>CARGO</th>
                  <th>STATUS</th>
                  <th>DATES</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {missions.map(mission => (
                  <tr key={mission.id}>
                    <td className="font-ui font-medium text-primary truncate max-w-xs">{mission.name}</td>
                    <td className="text-muted">
                      {mission.legs.map((leg, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs liquid-glass rounded-full mr-1 mb-1">
                          {leg.from}→{leg.to}
                          <SeverityBadge severity={leg.status === 'ACTIVE' ? 'WARNING' : leg.status === 'COMPLETED' ? 'NOMINAL' : 'NOMINAL'} size="xs" />
                        </span>
                      ))}
                    </td>
                    <td className="text-muted">{mission.personnelIds.length} personnel</td>
                    <td className="text-muted">{mission.cargoIds.length} items</td>
                    <td>
                      <SeverityBadge severity={mission.status === 'ACTIVE' ? 'WARNING' : mission.status === 'COMPLETED' ? 'NOMINAL' : mission.status === 'PLANNING' ? 'NOMINAL' : 'CRITICAL'} size="sm" />
                    </td>
                    <td className="text-muted font-mono text-xs">
                      {formatDate(mission.startDate)} — {formatDate(mission.estimatedEndDate)}
                    </td>
                    <td>
                      <button className="btn-secondary text-xs px-3 py-1.5">
                        VIEW
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 19l9 2 3.37-6.88L20.87 8.5A12.06 12.06 0 0021 12c0-6.627-5.373-12-12-12A12.06 12.06 0 003 12c0 1.92.506 3.74 1.378 5.3l8.16 4.28L16 21l-2.03-4.3a1 1 0 00-.56-.47l-2.5-.9A18.74 18.74 0 009.61 6.06l-.2.38a70 70 0 00-5.55 7.58l.31.62"/></svg>}
            title="No missions planned"
            description="Create your first expedition mission using the button above"
            action={
              <button
                onClick={() => { resetForm(); setShowCreateModal(true); }}
                className="btn-primary"
              >
                CREATE MISSION
              </button>
            }
          />
        )}
      </Panel>

      {/* Create Mission Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
          <div className="liquid-glass w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b px-6 py-5 sticky top-0 z-10" style={{ borderColor: 'rgba(179, 224, 231, 0.5)' }}>
              <h2 className="font-ui font-bold text-lg text-primary">CREATE NEW MISSION</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-muted hover:text-primary hover:bg-liquid-glass rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-ui font-medium text-muted uppercase tracking-wider mb-1">MISSION NAME</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                    placeholder="Enter mission name"
                    required
                  />
                  {formErrors.name && <p className="text-critical text-xs mt-1">{formErrors.name}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-ui font-medium text-muted uppercase tracking-wider mb-1">START DATE</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="input-field"
                      required
                    />
                    {formErrors.startDate && <p className="text-critical text-xs mt-1">{formErrors.startDate}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-ui font-medium text-muted uppercase tracking-wider mb-1">END DATE</label>
                    <input
                      type="date"
                      value={formData.estimatedEndDate}
                      onChange={e => setFormData(prev => ({ ...prev, estimatedEndDate: e.target.value }))}
                      className="input-field"
                      required
                    />
                    {formErrors.estimatedEndDate && <p className="text-critical text-xs mt-1">{formErrors.estimatedEndDate}</p>}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-ui font-medium text-primary text-sm uppercase tracking-wider">ROUTE LEGS</h3>
                  <button type="button" onClick={addLeg} className="btn-primary text-xs px-3 py-1.5">
                    ADD LEG
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.legs.map((leg, i) => (
                    <div key={i} className="liquid-glass p-3 grid gap-3 sm:grid-cols-5">
                      <div>
                        <label className="block text-xs font-ui font-medium text-muted uppercase tracking-wider mb-1">FROM</label>
                        <select
                          value={leg.from}
                          onChange={e => updateLeg(i, 'from', e.target.value)}
                          className="select-field"
                        >
                          <option value="MAITRI">MAITRI</option>
                          <option value="BHARATI">BHARATI</option>
                          <option value="HIMADRI">HIMADRI</option>
                        </select>
                        {formErrors[`leg_${i}_from`] && <p className="text-critical text-xs mt-1">{formErrors[`leg_${i}_from`]}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-ui font-medium text-muted uppercase tracking-wider mb-1">TO</label>
                        <select
                          value={leg.to}
                          onChange={e => updateLeg(i, 'to', e.target.value)}
                          className="select-field"
                        >
                          <option value="MAITRI">MAITRI</option>
                          <option value="BHARATI">BHARATI</option>
                          <option value="HIMADRI">HIMADRI</option>
                        </select>
                        {formErrors[`leg_${i}_to`] && <p className="text-critical text-xs mt-1">{formErrors[`leg_${i}_to`]}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-ui font-medium text-muted uppercase tracking-wider mb-1">START</label>
                        <input
                          type="date"
                          value={leg.startDate}
                          onChange={e => updateLeg(i, 'startDate', e.target.value)}
                          className="input-field"
                        />
                        {formErrors[`leg_${i}_startDate`] && <p className="text-critical text-xs mt-1">{formErrors[`leg_${i}_startDate`]}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-ui font-medium text-muted uppercase tracking-wider mb-1">END</label>
                        <input
                          type="date"
                          value={leg.endDate}
                          onChange={e => updateLeg(i, 'endDate', e.target.value)}
                          className="input-field"
                        />
                        {formErrors[`leg_${i}_endDate`] && <p className="text-critical text-xs mt-1">{formErrors[`leg_${i}_endDate`]}</p>}
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeLeg(i)}
                          disabled={formData.legs.length <= 1}
                          className="btn-danger text-xs px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-ui font-medium text-muted uppercase tracking-wider mb-1">ASSIGN PERSONNEL</label>
                  <div className="liquid-glass max-h-48 overflow-y-auto">
                    {personnel.map(p => (
                      <label key={p.id} className="flex items-center gap-3 px-3 py-2 hover:bg-liquid-glass cursor-pointer border-b" style={{ borderColor: 'rgba(179, 224, 231, 0.5)' }}>
                        <input
                          type="checkbox"
                          checked={formData.personnelIds.includes(p.id)}
                          onChange={e => setFormData(prev => ({
                            ...prev,
                            personnelIds: e.target.checked
                              ? [...prev.personnelIds, p.id]
                              : prev.personnelIds.filter(id => id !== p.id)
                          }))}
                          className="w-4 h-4 accent-accent border-glass-border rounded focus:ring-1 focus:ring-accent"
                        />
                        <div className="min-w-0">
                          <p className="font-ui font-medium text-sm text-primary truncate">{p.name}</p>
                          <p className="text-muted text-xs">{p.role} · {p.station}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-ui font-medium text-muted uppercase tracking-wider mb-1">ASSIGN CARGO</label>
                  <div className="liquid-glass max-h-48 overflow-y-auto">
                    {cargo.map(c => (
                      <label key={c.id} className="flex items-center gap-3 px-3 py-2 hover:bg-liquid-glass cursor-pointer border-b" style={{ borderColor: 'rgba(179, 224, 231, 0.5)' }}>
                        <input
                          type="checkbox"
                          checked={formData.cargoIds.includes(c.id)}
                          onChange={e => setFormData(prev => ({
                            ...prev,
                            cargoIds: e.target.checked
                              ? [...prev.cargoIds, c.id]
                              : prev.cargoIds.filter(id => id !== c.id)
                          }))}
                          className="w-4 h-4 accent-accent border-glass-border rounded focus:ring-1 focus:ring-accent"
                        />
                        <div className="min-w-0">
                          <p className="font-ui font-medium text-sm text-primary truncate">{c.name}</p>
                          <p className="text-muted text-xs">{c.category} · {c.quantity} {c.unit} · {c.status}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'rgba(179, 224, 231, 0.5)' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  CREATE MISSION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpeditionPlanner;