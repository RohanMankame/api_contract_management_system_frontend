import React, { useState } from 'react';
import { SubscriptionTierItem } from './SubscriptionTierItem';
import { EntityModal } from './EntityModal';
import { useApi } from '../hooks/useApi';
import '../styles/components/SubscriptionTierList.css';

export function SubscriptionTierList({ 
  subscriptionId,
  tiers, 
  expandedTiers, 
  onToggleExpand,
  onAddTier,
  onEditTier,
  onDeleteTier
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const { post } = useApi();

  const formFields = [
  { name: 'min_calls', label: 'Min Calls', type: 'number', required: true, group: 'calls' },
  { name: 'max_calls', label: 'Max Calls', type: 'number', required: true, group: 'calls' },
  { name: 'base_price', label: 'Base Price', type: 'number', required: true },
  { name: 'price_per_tier', label: 'Price Per Tier', type: 'number', required: false },
  { name: 'start_date', label: 'Start Date', type: 'date', required: true, group: 'dates' },
  { name: 'end_date', label: 'End Date', type: 'date', required: false, group: 'dates' },
];

  const handleAddTier = async (formData) => {
    const dataWithSubscriptionId = {
      ...formData,
      subscription_id: subscriptionId
    };
    await post('/subscription-tiers', dataWithSubscriptionId);
    setShowAddModal(false);
    onAddTier();
  };

  return (
    <>
      <div className="tiers-section">
        <div className="tiers-header">
          <h4>Tiers ({tiers.length})</h4>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-add-tier"
          >
            + Add Tier
          </button>
        </div>

        <div className="tiers-list">
          {tiers.length > 0 ? (
            tiers.map(tier => (
              <SubscriptionTierItem
                key={tier.id}
                tier={tier}
                isExpanded={expandedTiers.has(tier.id)}
                onToggleExpand={onToggleExpand}
                onEditTier={onEditTier}
                onDeleteTier={onDeleteTier}
              />
            ))
          ) : (
            <div className="no-tiers">
              <p>No tiers yet.</p>
            </div>
          )}
        </div>
      </div>

      <EntityModal
        isOpen={showAddModal}
        title="Add Tier"
        fields={formFields}
        onSubmit={handleAddTier}
        onClose={() => setShowAddModal(false)}
      />
    </>
  );
}