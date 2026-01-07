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
            onChange={e => onChange({ min_calls: e.target.value })}
          />
        </div>

        <div className="form-group max-actions">
          <label>Max Calls</label>
          <div className="max-row-controls">
            <input
              type="number"
              value={row.infinite ? '' : row.max_calls}
              onChange={e => onChange({ max_calls: e.target.value, infinite: false })}
              disabled={row.infinite}
            />

            <label className="checkbox-inline">
              <input
                type="checkbox"
                className="infinite-checkbox"
                checked={row.infinite}
                onChange={e => onChange({ infinite: e.target.checked, max_calls: e.target.checked ? '' : row.max_calls })}
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
          />
        </div>
      </div>

      {/* Bottom-right inline actions */}
      <div className="row-actions-bottom-right">
        <button
          type="button"
          className="remove"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label={`Remove row ${index}`}
        >−</button>

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