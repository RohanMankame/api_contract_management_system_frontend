import React from 'react';
import '../styles/components/SubscriptionTierItem.css';

export function RateCardInfo({ tier, onEdit }) {
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
          <span className="value">${parseFloat(tier.base_price).toFixed(2)}</span>
        </div>
        <div className="detail-row">
          <span className="label">Price Per Tier</span>
          <span className="value">{tier.price_per_tier ? `$${parseFloat(tier.price_per_tier).toFixed(2)}` : 'N/A'}</span>
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
        <button onClick={onEdit} className="btn-edit-tier">Edit Tier</button>
      </div>
    </div>
  );
}