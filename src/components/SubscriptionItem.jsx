import React, { useState, useMemo } from 'react';
import { EditEntityModal } from './EditEntityModal';
import { useApi } from '../hooks/useApi';
import { SubscriptionTierList } from './SubscriptionTierList';
import '../styles/components/SubscriptionItem.css';

export function SubscriptionItem({ 
  subscription, 
  isExpanded, 
  onToggleExpand, 
  products,
  onSubscriptionUpdate
}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [expandedTiers, setExpandedTiers] = useState(new Set());
  const { put, get, delete: deleteRequest } = useApi();

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.api_name : productId;
  };

  const formFields = useMemo(() => [
    { 
      name: 'product_id', 
      label: 'Product', 
      type: 'select',
      options: products.map(p => ({ value: p.id.toString(), label: p.api_name })),
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
  ], [products]);

  const subscriptionForModal = {
    ...subscription,
    product_id: subscription.product_id.toString()
  };

  const handleEditSubmit = async (formData) => {
    // UUID validation 
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (formData.product_id && !uuidRegex.test(formData.product_id)) {
      throw new Error('product_id must be a valid UUID');
    }

    const submitData = {
      ...formData,
      product_id: formData.product_id // UUID string
    };
    await put(`/subscriptions/${subscription.id}`, submitData);
    const subscriptionResponse = await get(`/subscriptions/${subscription.id}`);
    const updatedSubscription = subscriptionResponse?.data?.subscription || subscriptionResponse?.subscription || subscriptionResponse;
    setShowEditModal(false);
    onSubscriptionUpdate();
  };

  const handleDeleteSubmit = async () => {
    await deleteRequest(`/subscriptions/${subscription.id}`);
    setShowEditModal(false);
    onSubscriptionUpdate();
  };

  const handleToggleTierExpand = (tierId) => {
    const newExpanded = new Set(expandedTiers);
    if (newExpanded.has(tierId)) {
      newExpanded.delete(tierId);
    } else {
      newExpanded.add(tierId);
    }
    setExpandedTiers(newExpanded);
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
                <span className="label">ID</span>
                <span className="value">{subscription.id}</span>
              </div>
              <div className="detail-row">
                <span className="label">Product</span>
                <span className="value">{getProductName(subscription.product_id)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Pricing Type</span>
                <span className="value">{subscription.pricing_type}</span>
              </div>
              <div className="detail-row">
                <span className="label">Strategy</span>
                <span className="value">{subscription.strategy}</span>
              </div>
            </div>

            <div className="subscription-actions">
              <button 
                onClick={() => setShowEditModal(true)}
                className="btn-edit-subscription"
              >
                Edit Subscription
              </button>
            </div>

            <SubscriptionTierList
              subscriptionId={subscription.id}
              tiers={tiers}
              expandedTiers={expandedTiers}
              onToggleExpand={handleToggleTierExpand}
              onAddTier={() => onSubscriptionUpdate()}
              onEditTier={() => onSubscriptionUpdate()}
              onDeleteTier={() => onSubscriptionUpdate()}
            />
          </div>
        )}
      </div>

      <EditEntityModal
        isOpen={showEditModal}
        title="Edit Subscription"
        fields={formFields}
        data={subscriptionForModal}
        onSubmit={handleEditSubmit}
        onDelete={handleDeleteSubmit}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
}