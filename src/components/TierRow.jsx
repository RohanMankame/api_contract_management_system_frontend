// src/components/TierRow.jsx
import React from 'react';

export default function TierRow({ row, index, isLast, onChange, onRemove, onAdd, canRemove }) {
  return (
    <div className="batch-row">
      <div className="form-group-row three-columns">
        <div className="form-group">
          <label>Min Calls</label>
          <input
            type="number"
            value={row.min_calls}
            readOnly
            className="readonly-input"
          />
        </div>

        <div className="form-group max-actions">
          <label>Max Calls</label>
          <div className="max-row-controls">
            <input
              type="text"
              value={row.infinite ? '∞' : (row.max_calls ?? '')}
              onChange={e => {
                const v = e.target.value;
                if (v === '∞') {
                  onChange({ infinite: true, max_calls: '∞' });
                } else {
                  
                  const cleaned = v.replace(/[^\d]/g, '');
                  onChange({ max_calls: cleaned, infinite: false });
                }
              }}
              disabled={!isLast || row.infinite}
              className={!isLast ? 'readonly-input' : ''}
            />

            <label className="checkbox-inline">
              <input
                type="checkbox"
                className="infinite-checkbox"
                checked={row.infinite}
                disabled={!isLast}
                onChange={e => onChange({ infinite: e.target.checked, max_calls: e.target.checked ? '∞' : row.max_calls })}
              />
              <span className="checkbox-label">Infinity</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Price Per Tier</label>
          <input
            type="number"
            step="0.01"
            value={row.price_per_tier}
            onChange={e => onChange({ price_per_tier: e.target.value })}
            disabled={!isLast}
            className={!isLast ? 'readonly-input' : ''}
          />
        </div>
      </div>

      {/* Bottom-right inline actions */}
      <div className="row-actions-bottom-right">
        {isLast && canRemove && (
          <button
            type="button"
            className="remove"
            onClick={onRemove}
            aria-label={`Remove row ${index}`}
          >−</button>
        )}

        {isLast && (
          <button
            type="button"
            className="add"
            onClick={onAdd}
            aria-label="Add row"
          >+</button>
        )}
      </div>
    </div>
    
  );
}