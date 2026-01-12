// src/components/BatchAddTiersModal.jsx
import React, { useState, useMemo } from 'react';
import { useApi } from '../hooks/useApi';
import { validateRows, buildBatchPayload } from '../utils/tierHelpers';
import TierRow from './TierRow';
import '../styles/components/SubscriptionTierList.css';

export default function BatchAddTiersModal({ 
  isOpen, 
  onClose, 
  rateCardId, 
  rateCard,
  pricingType, 
  onAdded 
}) {
  const { post } = useApi();
  const isFixed = pricingType === 'Fixed';
  
  // Calculate initial min_calls based on existing tiers
  const initialMinCalls = useMemo(() => {
    if (!rateCard || !rateCard.tiers || rateCard.tiers.length === 0) {
      return '0';
    }
    
    // Filter non-archived tiers and find the one with highest max_calls
    const nonArchivedTiers = rateCard.tiers.filter(t => !t.is_archived);
    if (nonArchivedTiers.length === 0) {
      return '0';
    }
    
    const sorted = [...nonArchivedTiers].sort((a, b) => {
      const aMax = Number(a.max_calls ?? 0);
      const bMax = Number(b.max_calls ?? 0);
      return bMax - aMax; // descending to get highest
    });
    
    const lastTier = sorted[0];
    const lastMaxCalls = Number(lastTier.max_calls ?? 0);
    return String(lastMaxCalls + 1);
  }, [rateCard]);
  
  // For fixed pricing, only allow one tier with 0-∞
  const initialRow = isFixed 
    ? { min_calls: '0', max_calls: '∞', infinite: true, unit_price: '' }
    : { min_calls: initialMinCalls, max_calls: '', infinite: false, unit_price: '' };
  
  const [rows, setRows] = useState([initialRow]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const addRow = () => {
    if (isFixed) {
      setError('Fixed pricing allows only one tier per rate card');
      return;
    }
    
    const last = rows[rows.length - 1];
    if (last?.infinite) { setError('Cannot add after an infinite row'); return; }
    const lastMax = last.max_calls ? Number(last.max_calls) : Number(last.min_calls || 0);
    setRows(prev => [...prev, { min_calls: String(lastMax + 1), max_calls: '', infinite: false, unit_price: '' }]);
  };

  const removeRow = (i) => {
    if (isFixed) {
      setError('Cannot remove the only tier in fixed pricing');
      return;
    }
    setRows(prev => prev.filter((_, idx) => idx !== i));
  };

  const updateRow = (i, patch) => {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  };

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!rateCardId) { 
        setError('No rate card selected'); 
        setLoading(false); 
        return; 
      }

      // For fixed pricing, ensure only one tier with correct values
      if (isFixed) {
        if (rows.length !== 1) {
          setError('Fixed pricing must have exactly one tier');
          setLoading(false);
          return;
        }
        const tier = rows[0];
        if (!tier.unit_price || Number(tier.unit_price) <= 0) {
          setError('Unit price is required and must be greater than 0');
          setLoading(false);
          return;
        }
      } else {
        const vErr = validateRows(rows);
        if (vErr) { 
          setError(vErr); 
          setLoading(false); 
          return; 
        }
      }

      const payload = buildBatchPayload(rows, rateCardId);
      try { 
        await post('/subscription-tiers/batch', { tiers: payload }); 
      } catch { 
        await Promise.all(payload.map(p => post('/subscription-tiers', p))); 
      }

      onAdded();
      onClose();
    } catch (err) {
      console.error('Error submitting tiers:', err);
      setError(err.message || 'Failed to add tiers');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            Add Tiers to Rate Card 
            {isFixed && <span style={{ fontSize: '0.8em', fontWeight: 'normal', marginLeft: '8px' }}>(Fixed Pricing - 1 Tier Only)</span>}
          </h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-form">
          {error && <div className="modal-error-message">{error}</div>}

          {isFixed && (
            <div style={{ 
              backgroundColor: '#f0f4f8', 
              border: '1px solid #cbd5e0', 
              borderRadius: '6px', 
              padding: '12px', 
              marginBottom: '16px',
              fontSize: '14px',
              color: '#2d3748'
            }}>
              <strong>Fixed Pricing Mode:</strong> This subscription uses fixed pricing, which allows exactly one tier covering all calls (0 to ∞). Only the unit price can be edited.
            </div>
          )}

          {rows.map((r, idx) => (
            <TierRow
              key={idx}
              row={r}
              index={idx}
              isLast={idx === rows.length - 1}
              onChange={(patch) => updateRow(idx, patch)}
              onRemove={() => removeRow(idx)}
              onAdd={addRow}
              canRemove={!isFixed && rows.length > 1}
              priceLabel={isFixed ? 'Base Price' : 'Unit Price'}
              isFixed={isFixed}
            />
          ))}

          <div className="modal-footer">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-submit" onClick={submit} disabled={loading}>
              {loading ? 'Adding...' : 'Add Tier'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}