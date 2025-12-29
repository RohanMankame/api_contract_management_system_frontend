import React, { useState } from 'react';
import { SubscriptionItem } from './SubscriptionItem';
import { EntityModal } from './EntityModal';

export function SubscriptionList({ 
  subscriptions, 
  expandedSubscriptions, 
  onToggleExpand,
  products,
  onAddSubscription,
  onEditSubscription,
  onDeleteSubscription,
  expandedTiers,
  onToggleTierExpand,
  onAddTier,
  onEditTier,
  onDeleteTier
}) {
  const [showAddModal, setShowAddModal] = useState(false);

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

  const handleAddSubscription = async (formData) => {
    try {
      await onAddSubscription(formData);
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding subscription:', err);
    }
  };

  return (
    <>
      <div className="subscriptions-section">
        <div className="subscriptions-header">
          <h2>Subscriptions ({subscriptions.length})</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-add-subscription"
          >
            + Add Subscription
          </button>
        </div>

        <div className="subscriptions-list">
          {subscriptions.length > 0 ? (
            subscriptions.map(subscription => (
              <SubscriptionItem
                key={subscription.id}
                subscription={subscription}
                isExpanded={expandedSubscriptions.has(subscription.id)}
                onToggleExpand={onToggleExpand}
                products={products}
                onEditSubscription={onEditSubscription}
                onDeleteSubscription={onDeleteSubscription}
                onAddTier={onAddTier}
                onEditTier={onEditTier}
                onDeleteTier={onDeleteTier}
                expandedTiers={expandedTiers}
                onToggleTierExpand={onToggleTierExpand}
              />
            ))
          ) : (
            <div className="no-subscriptions">
              <p>No subscriptions yet.</p>
            </div>
          )}
        </div>
      </div>

      <EntityModal
        isOpen={showAddModal}
        title="Add Subscription"
        fields={formFields}
        onSubmit={handleAddSubscription}
        onClose={() => setShowAddModal(false)}
      />
    </>
  );
}