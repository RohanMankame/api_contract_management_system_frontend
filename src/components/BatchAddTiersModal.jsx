// src/components/BatchAddTiersModal.jsx
import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { validateRows, buildBatchPayload } from '../utils/tierHelpers';
import TierRow from './TierRow';
import '../styles/components/SubscriptionTierList.css';

export default function BatchAddTiersModal({ isOpen, onClose, subscriptionId, pricingType, onAdded }) {
  const { post } = useApi();
  const [rows, setRows] = useState([{ min_calls: '0', max_calls: '', infinite: false, price_per_tier: '' }]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const addRow = () => {
    const last = rows[rows.length - 1];
    if (last?.infinite) { setError('Cannot add after an infinite row'); return; }
    const lastMax = last.max_calls ? Number(last.max_calls) : Number(last.min_calls || 0);
    setRows(prev => [...prev, { min_calls: String(lastMax + 1), max_calls: '', infinite: false, price_per_tier: '' }]);
  };
  const removeRow = (i) => setRows(prev => prev.filter((_, idx) => idx !== i));
  const updateRow = (i, patch) => setRows(prev => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r));

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!startDate) { setError('Start date required'); setLoading(false); return; }

      if (pricingType === 'Fixed') {
        const payload = [{
          subscription_id: subscriptionId,
          min_calls: 0,
          max_calls: -1,
          base_price: Number(basePrice || 0),
          price_per_tier: 0,
          start_date: startDate,
          end_date: endDate || null
        }];
        try { await post('/subscription-tiers/batch', { tiers: payload }); } catch { await Promise.all(payload.map(p => post('/subscription-tiers', p))); }
        onAdded(); onClose(); setLoading(false); return;
      }

      const vErr = validateRows(rows);
      if (vErr) { setError(vErr); setLoading(false); return; }

      const payload = buildBatchPayload(rows, subscriptionId, startDate, endDate);
      try { await post('/subscription-tiers/batch', { tiers: payload }); } catch { await Promise.all(payload.map(p => post('/subscription-tiers', p))); }

      onAdded(); onClose();
    } catch (err) {
      setError(err.message || 'Failed to add tiers');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Tiers ({pricingType})</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-form">
          {error && <div className="modal-error-message">{error}</div>}

          {/* Shared date range & (Fixed) base price */}
          <div className="form-group-row">
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            {pricingType === 'Fixed' && (
              <div className="form-group">
                <label>Base Price</label>
                <input type="number" step="0.01" value={basePrice} onChange={e => setBasePrice(e.target.value)} />
                <p className="form-hint">Fixed pricing covers 0 → ∞ calls.</p>
              </div>
            )}
          </div>



          {/* Variable rows */}
          {pricingType === 'Variable' && rows.map((r, idx) => (
            <TierRow
              key={idx}
              row={r}
              index={idx}
              isLast={idx === rows.length - 1}
              onChange={(patch) => updateRow(idx, patch)}
              onRemove={() => removeRow(idx)}
              onAdd={addRow}
              canRemove={rows.length > 1}  
            />
          ))}

          <div className="modal-footer">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-submit" onClick={submit} disabled={loading}>
              {loading ? 'Adding...' : 'Add Tier(s)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}