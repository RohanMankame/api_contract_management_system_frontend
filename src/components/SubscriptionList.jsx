import React, { useState, useMemo } from 'react';
import { SubscriptionItem } from './SubscriptionItem';
import { EntityModal } from './EntityModal';
import { useApi } from '../hooks/useApi';
import '../styles/components/SubscriptionList.css';

export function SubscriptionList({ 
  subscriptions, 
  expandedSubscriptions, 
  onToggleExpand,
  products,
  contractId,
  onSubscriptionsUpdate
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const { post } = useApi();

  const formFields = useMemo(() => [
    { 
      name: 'product_id', 
      label: 'Product', 
      type: 'select',
      //  ensure product ids are strings (server-provided)
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
      // strategy depend on current pricing_type
      options: (formData) => {
        if (formData.pricing_type === 'Fixed') {
          return [{ value: 'Fixed', label: 'Fixed' }];
        }
        if (formData.pricing_type === 'Variable') {
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

  const handleAddSubscription = async (formData) => {
    await post(`/contracts/${contractId}/subscriptions`, formData);
    setShowAddModal(false);
    onSubscriptionsUpdate();
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
                onSubscriptionUpdate={onSubscriptionsUpdate}
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