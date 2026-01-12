// src/components/BatchAddTiersModal.jsx
import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { validateRows, buildBatchPayload } from '../utils/tierHelpers';
import TierRow from './TierRow';
import '../styles/components/SubscriptionTierList.css';

export default function BatchAddTiersModal({ 
  isOpen, 
  onClose, 
  rateCardId, 
  pricingType, 
  onAdded 
}) {
  const { post } = useApi();
  const [rows, setRows] = useState([{ min_calls: '0', max_calls: '', infinite: false, unit_price: '' }]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const addRow = () => {
    const last = rows[rows.length - 1];
    if (last?.infinite) { setError('Cannot add after an infinite row'); return; }
    const lastMax = last.max_calls ? Number(last.max_calls) : Number(last.min_calls || 0);
    setRows(prev => [...prev, { min_calls: String(lastMax + 1), max_calls: '', infinite: false, unit_price: '' }]);
  };
  const removeRow = (i) => setRows(prev => prev.filter((_, idx) => idx !== i));
  const updateRow = (i, patch) => setRows(prev => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r));

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!rateCardId) { setError('No rate card selected'); setLoading(false); return; }

      const vErr = validateRows(rows);
      if (vErr) { setError(vErr); setLoading(false); return; }

      const payload = buildBatchPayload(rows, rateCardId);
      try { 
        await post('/subscription-tiers/batch', { tiers: payload }); 
      } catch { 
        await Promise.all(payload.map(p => post('/subscription-tiers', p))); 
      }

      onAdded();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add tiers');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Tiers to Rate Card</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-form">
          {error && <div className="modal-error-message">{error}</div>}

         
          {rows.map((r, idx) => (
            <TierRow
              key={idx}
              row={r}
              index={idx}
              isLast={idx === rows.length - 1}
              onChange={(patch) => updateRow(idx, patch)}
              onRemove={() => removeRow(idx)}
              onAdd={addRow}
              canRemove={rows.length > 1}
              priceLabel="Unit Price"
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