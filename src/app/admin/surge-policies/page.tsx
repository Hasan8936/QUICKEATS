'use client';

import React, { useEffect, useState } from 'react';
import type { LeanZone } from '@/lib/queries';

interface Policy {
  zoneId: string;
  zoneName: string;
  threshold: number;
  multiplier: number;
}

export default function SurgePoliciesAdminPage() {
  const [zones, setZones] = useState<LeanZone[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [form, setForm] = useState({ zoneId: '', threshold: 2, multiplier: 1.5 });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    const [zonesData, policiesData] = await Promise.all([
      fetch('/api/zones').then((r) => r.json()),
      fetch('/api/surge/policies').then((r) => r.json()),
    ]);
    setZones(zonesData);
    setPolicies(policiesData);
    setForm((prev) => ({ ...prev, zoneId: prev.zoneId || zonesData[0]?.id || '' }));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/surge/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save policy');
      setMessage(data.message);
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to save policy');
    } finally {
      setSaving(false);
    }
  };

  const deletePolicy = async (zoneId: string) => {
    await fetch(`/api/surge/policies?zoneId=${zoneId}`, { method: 'DELETE' });
    await load();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
        Surge Policies Admin
      </h1>
      <p className="text-[var(--color-text-muted)] mb-8">
        Set a demand-ratio threshold and multiplier per zone. Zones without a custom
        policy fall back to the default thresholds in the surge engine.
      </p>

      {message && (
        <div className="mb-6 p-3 rounded-lg bg-blue-50 text-blue-800 text-sm">{message}</div>
      )}

      <div className="card p-6 mb-8">
        <h2 className="font-bold mb-4 text-[var(--color-text-primary)]">Add / Update Policy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Zone</label>
            <select
              value={form.zoneId}
              onChange={(e) => setForm((f) => ({ ...f, zoneId: e.target.value }))}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg"
            >
              {zones.map((z) => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Threshold</label>
            <input
              type="number"
              step="0.1"
              value={form.threshold}
              onChange={(e) => setForm((f) => ({ ...f, threshold: parseFloat(e.target.value) }))}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Multiplier</label>
            <input
              type="number"
              step="0.1"
              value={form.multiplier}
              onChange={(e) => setForm((f) => ({ ...f, multiplier: parseFloat(e.target.value) }))}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg"
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving || !form.zoneId}
          className="px-4 py-2 bg-[var(--color-primary-orange)] text-white rounded-lg font-semibold disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Policy'}
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="font-bold text-[var(--color-text-primary)]">Existing Policies</h2>
        </div>
        {policies.length === 0 ? (
          <p className="p-6 text-sm text-[var(--color-text-muted)]">No custom policies set yet.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-[var(--color-background)]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold">Zone</th>
                <th className="px-6 py-3 text-left text-sm font-bold">Threshold</th>
                <th className="px-6 py-3 text-left text-sm font-bold">Multiplier</th>
                <th className="px-6 py-3 text-left text-sm font-bold"></th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p) => (
                <tr key={p.zoneId} className="border-t border-[var(--color-border)]">
                  <td className="px-6 py-3 text-sm">{p.zoneName}</td>
                  <td className="px-6 py-3 text-sm">{p.threshold}</td>
                  <td className="px-6 py-3 text-sm">{p.multiplier}x</td>
                  <td className="px-6 py-3 text-sm">
                    <button
                      onClick={() => deletePolicy(p.zoneId)}
                      className="text-[var(--color-danger)] font-semibold text-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
