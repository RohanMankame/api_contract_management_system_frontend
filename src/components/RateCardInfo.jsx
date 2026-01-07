import React from 'react';
import '../styles/components/ContractInfoCard.css';
import '../styles/components/SubscriptionTierList.css';

export function RateCardInfo({ tier, grouped = false, pricingType = 'Variable', onEdit, onEditTier }) {
  const formatMoney = (val) => {
    if (val === null || val === undefined || val === '') return 'N/A';
    return `$${parseFloat(val).toFixed(2)}`;
  };

  // Grouped compact row (used inside grouped tabs)
  if (grouped && tier) {
    const priceDisplay =
      pricingType === 'Fixed' ? formatMoney(tier.base_price) : (tier.price_per_tier ? formatMoney(tier.price_per_tier) : 'N/A');

    return (
      <div className="group-tier-row">
        <div className="group-info-item">
          <label>Min Calls</label>
          <p>{tier.min_calls}</p>
        </div>

        <div className="group-info-item">
          <label>Max Calls</label>
          <p>{tier.max_calls}</p>
        </div>

        <div className="group-info-item rate-row-price">
          <label>{pricingType === 'Fixed' ? 'Base Price' : 'Price Per Tier'}</label>
          <p>{priceDisplay}</p>
        </div>

        <div className="group-tier-actions">
          <button
            className="btn-edit-tier"
            onClick={() => (onEditTier ? onEditTier(tier) : onEdit && onEdit(tier))}
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  // Backwards-compatible single-tier detailed view (unchanged)
  if (tier) {
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    };

    return (
      <div className="tier-content">
        <div className="tier-details">
          <div className="detail-row">
            <span className="label">Min Calls</span>
            <span className="value">{tier.min_calls}</span>
          </div>
          <div className="detail-row">
            <span className="label">Max Calls</span>
            <span className="value">{tier.max_calls}</span>
          </div>
          <div className="detail-row">
            <span className="label">Base Price</span>
            <span className="value">{formatMoney(tier.base_price)}</span>
          </div>
          <div className="detail-row">
            <span className="label">Price Per Tier</span>
            <span className="value">{tier.price_per_tier ? formatMoney(tier.price_per_tier) : 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Start Date</span>
            <span className="value">{formatDate(tier.start_date)}</span>
          </div>
          <div className="detail-row">
            <span className="label">End Date</span>
            <span className="value">{formatDate(tier.end_date)}</span>
          </div>
        </div>

        <div className="tier-actions">
          <button onClick={() => onEdit && onEdit(tier)} className="btn-edit-tier">Edit Tier</button>
        </div>
      </div>
    );
  }

  return null;
}