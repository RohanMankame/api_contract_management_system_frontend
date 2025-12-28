import React from 'react';
import { SubscriptionItem } from './SubscriptionItem';

export function SubscriptionList({ subscriptions, expandedSubscriptions, onToggleExpand }) {
  return (
    <div className="subscriptions-section">
      <div className="subscriptions-header">
        <h2>Subscriptions ({subscriptions.length})</h2>
        <button className="btn-add-subscription">+ Add Subscription</button>
      </div>

      <div className="subscriptions-list">
        {subscriptions.length > 0 ? (
          subscriptions.map(subscription => (
            <SubscriptionItem
              key={subscription.id}
              subscription={subscription}
              isExpanded={expandedSubscriptions.has(subscription.id)}
              onToggleExpand={onToggleExpand}
            />
          ))
        ) : (
          <div className="no-subscriptions">
            <p>No subscriptions yet. Add one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}