import React, { useState } from 'react';
import { SubscriptionTierItem } from './SubscriptionTierItem';
import BatchAddTiersModal from './BatchAddTiersModal';
import '../styles/components/SubscriptionTierList.css';

export function SubscriptionTierList({
  subscriptionId,
  tiers,
  expandedTiers,
  onToggleExpand,
  onAddTier,
  onEditTier,
  onDeleteTier,
  pricing_type = 'Variable'
}) {
  const [showBatchAddModal, setShowBatchAddModal] = useState(false);

  return (
    <>
      <div className="tiers-section">
        <div className="tiers-header">
          <h4>Tiers ({tiers.length})</h4>
          <button
            onClick={() => setShowBatchAddModal(true)}
            className="btn-add-tier"
          >
            + Add Tier(s)
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

      <BatchAddTiersModal
        isOpen={showBatchAddModal}
        onClose={() => setShowBatchAddModal(false)}
        subscriptionId={subscriptionId}
        pricingType={pricing_type}
        onAdded={() => {
          setShowBatchAddModal(false);
          onAddTier();
        }}
      />
    </>
  );
}