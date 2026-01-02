import React, { useState, useMemo } from 'react';
import { SubscriptionItem } from './SubscriptionItem';
import { EntityModal } from './EntityModal';
import { useApi } from '../hooks/useApi';
import '../styles/components/SubscriptionList.css';

export function SubscriptionList({
  subscriptions = [],
  products,
  contractId,
  onSubscriptionsUpdate
}) {
  const [showAddModal, setShowAddModal] = useState(false);

  // avoid relying on parent props
  const [expandedSubscriptions, setExpandedSubscriptions] = useState(new Set());

  const { post } = useApi();

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
    try {
      await post(`/contracts/${contractId}/subscriptions`, formData);
      setShowAddModal(false);
      onSubscriptionsUpdate && onSubscriptionsUpdate();
    } catch (err) {
      console.error('Error adding subscription', err);
    }
  };

  const handleToggleExpand = (subscriptionId) => {
    setExpandedSubscriptions(prev => {
      const next = new Set(prev);
      if (next.has(subscriptionId)) next.delete(subscriptionId);
      else next.add(subscriptionId);
      return next;
    });
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
                onToggleExpand={handleToggleExpand}
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