import React from 'react';
import '../styles/components/ContractInfoCard.css';
import '../styles/components/SubscriptionTierList.css';

/**
 * RateCardInfo
 * Renders a single grouped rate card (start → end) and its tiers.
 *
 * Props:
 * - group: { start_date, end_date, tiers: [] }
 * - pricingType: 'Fixed' | 'Variable'
 * - onEditTier: function(tier) -> open edit modal
 */
export function RateCardInfo({ group, pricingType = 'Variable', onEditTier }) {
  if (!group) return null;

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : 'N/A');
  const formatMoney = (v) => (v == null || v === '' ? 'N/A' : `$${parseFloat(v).toFixed(2)}`);
  const normalizeMax = (v) => (v === -1 || v === '-1' ? Infinity : Number(v ?? 0));

  // Sort tiers: min_calls asc; break ties by max_calls (treat -1 as Infinity)
  const sorted = [...group.tiers].sort((a, b) => {
    const aMin = Number(a.min_calls ?? 0);
    const bMin = Number(b.min_calls ?? 0);
    if (aMin !== bMin) return aMin - bMin;
    const aMax = normalizeMax(a.max_calls);
    const bMax = normalizeMax(b.max_calls);
    return aMax - bMax;
  });

  const basePrice = group.tiers[0]?.base_price ?? null;

  return (
    <div className="rate-card">
      

      <div className="rate-card-body">
        {sorted.map((t, i) => (
          <React.Fragment key={t.id}>
            <div className="rate-row">
              <div className="rate-row-item">
                <label>Min Calls</label>
                <p>{t.min_calls}</p>
              </div>

              <div className="rate-row-item">
                <label>Max Calls</label>
                <p>{t.max_calls === -1 ? '∞' : t.max_calls}</p>
              </div>

              <div className="rate-row-item rate-row-price">
                <label>{pricingType === 'Fixed' ? 'Base Price' : 'Price Per Tier'}</label>
                <p>{pricingType === 'Fixed' ? formatMoney(t.base_price) : formatMoney(t.price_per_tier)}</p>
              </div>

              <div className="rate-row-actions">
                <button className="btn-edit-tier" onClick={() => onEditTier && onEditTier(t)}>Edit</button>
              </div>
            </div>

            {i < sorted.length - 1 && <hr className="group-separator" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}