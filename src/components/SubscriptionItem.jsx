import React from 'react';

export function SubscriptionItem({ subscription, isExpanded, onToggleExpand, products }) {
  // get the product name from products list to display
  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.api_name : productId;
  };

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
          <div className="subscription-title-content">
            <h3>Subscription {subscription.id}</h3>
            <span className="subscription-product-name">{getProductName(subscription.product_id)}</span>
          </div>
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