// src/components/TierRow.jsx
import React from 'react';

export default function TierRow({ 
  row, 
  index, 
  isLast, 
  onChange, 
  onRemove, 
  onAdd, 
  canRemove,
  priceLabel = 'Unit Price',
  isFixed = false
}) {
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
            disabled={isFixed}
          />
        </div>

        <div className="form-group max-actions">
          <label>Max Calls</label>
          <div className="max-row-controls">
            <input
              type="text"
              value={row.infinite ? '∞' : (row.max_calls ?? '')}
              readOnly={isFixed}
              disabled={isFixed}
              className={isFixed ? 'readonly-input' : ''}
              onChange={e => {
                if (isFixed) return; // Don't allow changes for fixed pricing
                const v = e.target.value;
                if (v === '∞') {
                  onChange({ infinite: true, max_calls: '∞' });
                } else {
                  const cleaned = v.replace(/[^\d]/g, '');
                  onChange({ max_calls: cleaned, infinite: false });
                }
              }}
            />

            <label className="checkbox-inline">
              <input
                type="checkbox"
                className="infinite-checkbox"
                checked={row.infinite}
                disabled={isFixed}
                onChange={e => {
                  if (isFixed) return; // Don't allow changes for fixed pricing
                  onChange({ infinite: e.target.checked, max_calls: e.target.checked ? '∞' : row.max_calls });
                }}
              />
              <span className="checkbox-label">Infinity</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>{priceLabel}</label>
          <input
            type="number"
            step="0.01"
            value={row.unit_price}
            onChange={e => onChange({ unit_price: e.target.value })}
            disabled={!isLast && !isFixed}
            className={!isLast && !isFixed ? 'readonly-input' : ''}
            placeholder="Enter price"
          />
        </div>
      </div>

      
      {!isFixed && (
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
      )}
    </div>
  );
}