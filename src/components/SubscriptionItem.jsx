import React, { useState, useMemo } from 'react';
import { EditEntityModal } from './EditEntityModal';
import { useApi } from '../hooks/useApi';
import { RateCardList } from './RateCardList';
import '../styles/components/SubscriptionItem.css';

export function SubscriptionItem({ 
  subscription, 
  isExpanded, 
  onToggleExpand, 
  products,
  onSubscriptionUpdate
}) {
  const [showEditModal, setShowEditModal] = useState(false);
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
      options: products.map(p => ({ value: String(p.id), label: p.api_name })),
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
      //  dynamic options based on pricing_type
      options: (formData) => {
        if (formData.pricing_type === 'Fixed') {
          return [{ value: 'Fixed', label: 'Fixed' }];
        }
        if (formData.pricing_type === 'Variable') {
          // Variable options set to Pick, Fill, Flat
          return [
            { value: 'Pick', label: 'Pick' },
            { value: 'Fill', label: 'Fill' },
            { value: 'Flat', label: 'Flat' }
          ];
        }
        // fallback
        return [
          { value: 'Pick', label: 'Pick' },
          { value: 'Fill', label: 'Fill' },
          { value: 'Flat', label: 'Flat' },
          { value: 'Fixed', label: 'Fixed' }
        ];
      },
      required: true 
    },
  ], [products]);

  const subscriptionForModal = {
    ...subscription,
    // ensure product_id passed to modal is a string
    product_id: String(subscription.product_id)
  };

  const handleEditSubmit = async (formData) => {
    const submitData = {
      ...formData,
      product_id: formData.product_id 
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

  const rateCards = subscription.rate_cards && Array.isArray(subscription.rate_cards) 
    ? subscription.rate_cards 
    : [];

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
              <span className="subscription-product-name">{getProductName(subscription.product_id)}</span>
            </div>
          </div>
          <span className="subscription-note">
            Subscription: {subscription.id}
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

            <RateCardList
              subscriptionId={subscription.id}
              rateCards={rateCards}
              pricingType={subscription.pricing_type}
              onRateCardUpdate={() => onSubscriptionUpdate()}
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