import React from 'react';
import '../styles/components/ContractInfoCard.css';
import '../styles/components/SubscriptionTierList.css';


export function RateCardInfo({ rateCard, pricingType = 'Variable', onEditTier }) {
  if (!rateCard) return null;

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : 'N/A');
  const formatMoney = (v) => (v == null || v === '' ? 'N/A' : `$${parseFloat(v).toFixed(2)}`);
  const normalizeMax = (v) => (v === -1 || v === '-1' ? Infinity : Number(v ?? 0));

  // Sort tiers: min_calls asc; break ties by max_calls (treat -1 as Infinity)
  const sorted = [...(rateCard.tiers || [])].sort((a, b) => {
    const aMin = Number(a.min_calls ?? 0);
    const bMin = Number(b.min_calls ?? 0);
    if (aMin !== bMin) return aMin - bMin;
    const aMax = normalizeMax(a.max_calls);
    const bMax = normalizeMax(b.max_calls);
    return aMax - bMax;
  });

  // Find the last tier (highest max_calls)
  const lastTierId = sorted.length > 0 ? sorted[sorted.length - 1].id : null;

  return (
    <div className="rate-card">
      <div className="rate-card-body">
        {sorted.length > 0 ? (
          sorted.map((t, i) => {
            const isLastTier = t.id === lastTierId;
            return (
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
                    <label>Unit Price</label>
                    <p>{formatMoney(t.unit_price)}</p>
                  </div>

                  <div className="rate-row-actions">
                    {isLastTier && (
                      <button className="btn-edit-tier" onClick={() => onEditTier && onEditTier(t)}>
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                {i < sorted.length - 1 && <hr className="group-separator" />}
              </React.Fragment>
            );
          })
        ) : (
          <p className="no-tiers-message">No tiers in this rate card yet.</p>
        )}
      </div>
    </div>
  );
}