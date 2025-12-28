// src/components/SubscriptionItem.jsx
import React from 'react';

export function SubscriptionItem({ subscription, isExpanded, onToggleExpand }) {
  return (
    <div className="subscription-container">
      <div 
        className="subscription-header"
        onClick={() => onToggleExpand(subscription.id)}
      >
        <div className="subscription-title-section">
          <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
            ▼
          </span>
          <h3>Subscription {subscription.id.slice(0, 8)}...</h3>
          <span className="subscription-meta">Product: {subscription.product_id}</span>
        </div>
        <span className="subscription-pricing">
          {subscription.pricing_type}
        </span>
      </div>

      {isExpanded && (
        <div className="subscription-content">
          <div className="subscription-details">
            <div className="detail-row">
              <span className="label">ID:</span>
              <span className="value">{subscription.id}</span>
            </div>
            <div className="detail-row">
              <span className="label">Product ID:</span>
              <span className="value">{subscription.product_id}</span>
            </div>
            <div className="detail-row">
              <span className="label">Pricing Type:</span>
              <span className="value">{subscription.pricing_type}</span>
            </div>
            <div className="detail-row">
              <span className="label">Strategy:</span>
              <span className="value">{subscription.strategy}</span>
            </div>
          </div>

          <div className="subscription-actions">
            <button className="btn-edit-subscription">Edit</button>
            <button className="btn-delete-subscription">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}