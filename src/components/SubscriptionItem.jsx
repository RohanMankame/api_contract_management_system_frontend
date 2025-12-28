// src/components/SubscriptionItem.jsx
import React, { useState } from 'react';
import { EditEntityModal } from './EditEntityModal';
import { SubscriptionTierList } from './SubscriptionTierList';

export function SubscriptionItem({ 
  subscription, 
  isExpanded, 
  onToggleExpand, 
  products, 
  onEditSubscription, 
  onDeleteSubscription,
  onAddTier,
  onEditTier,
  onDeleteTier,
  expandedTiers,
  onToggleTierExpand
}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState(null);

  // Find the product name by matching product_id
  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.api_name : productId;
  };

  const formFields = [
    { 
      name: 'product_id', 
      label: 'Product', 
      type: 'select',
      options: products.map(p => ({ value: p.id, label: p.api_name })),
      required: true 
    },
    { 
      name: 'pricing_type', 
      label: 'Pricing Type', 
      type: 'select',
      options: [
        { value: 'Fixed', label: 'Fixed' },
        { value: 'Variable', label: 'Variable' }
      ],
      required: true 
    },
    { 
      name: 'strategy', 
      label: 'Strategy', 
      type: 'select',
      options: [
        { value: 'Pick', label: 'Pick' },
        { value: 'Fill', label: 'Fill' },
        { value: 'Flat', label: 'Flat' },
        { value: 'Fixed', label: 'Fixed' }
      ],
      required: true 
    },
  ];

  const handleEditSubmit = async (formData) => {
    try {
      setError(null);
      await onEditSubscription(subscription.id, formData);
      setShowEditModal(false);
    } catch (err) {
      const errorMessage = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err.response?.data?.message || err.message || 'Error updating subscription';
      setError(errorMessage);
    }
  };

  const handleDelete = async () => {
    try {
      setError(null);
      await onDeleteSubscription(subscription.id);
      setShowEditModal(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error deleting subscription';
      setError(errorMessage);
    }
  };

  const handleCloseModal = () => {
    setError(null);
    setShowEditModal(false);
  };

  const tiers = subscription.tiers && Array.isArray(subscription.tiers) ? subscription.tiers : [];

  return (
    <>
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
              <button 
                onClick={() => setShowEditModal(true)}
                className="btn-edit-subscription"
              >
                Edit
              </button>
            </div>

            <SubscriptionTierList
              subscriptionId={subscription.id}
              tiers={tiers}
              expandedTiers={expandedTiers}
              onToggleExpand={onToggleTierExpand}
              onAddTier={onAddTier}
              onEditTier={onEditTier}
              onDeleteTier={onDeleteTier}
            />
          </div>
        )}
      </div>

      <EditEntityModal
        isOpen={showEditModal}
        title="Edit Subscription"
        fields={formFields}
        data={subscription}
        onSubmit={handleEditSubmit}
        onDelete={handleDelete}
        onClose={handleCloseModal}
        error={error}
      />
    </>
  );
}