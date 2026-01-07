import React, { useState } from 'react';
import { EditEntityModal } from './EditEntityModal';
import { useApi } from '../hooks/useApi';
import '../styles/components/SubscriptionTierItem.css';
import { RateCardInfo } from './RateCardInfo';

export function SubscriptionTierItem({ tier, isExpanded, onToggleExpand, onEditTier, onDeleteTier }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const { put, get, delete: deleteRequest } = useApi();

  const formFields = [
  { name: 'min_calls', label: 'Min Calls', type: 'number', required: true, group: 'calls' },
  { name: 'max_calls', label: 'Max Calls', type: 'number', required: true, group: 'calls' },
  { name: 'base_price', label: 'Base Price', type: 'number', required: true },
  { name: 'price_per_tier', label: 'Price Per Tier', type: 'number', required: false },
  { name: 'start_date', label: 'Start Date', type: 'date', required: true, group: 'dates' },
  { name: 'end_date', label: 'End Date', type: 'date', required: false, group: 'dates' },
];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const tierForModal = {
    ...tier,
    start_date: formatDateForInput(tier.start_date),
    end_date: formatDateForInput(tier.end_date)
  };

  const handleEditSubmit = async (formData) => {
    await put(`/subscription-tiers/${tier.id}`, formData);
    setShowEditModal(false);
    onEditTier(tier.id, formData);
  };

  const handleDeleteSubmit = async () => {
    await deleteRequest(`/subscription-tiers/${tier.id}`);
    setShowEditModal(false);
    onDeleteTier(tier.id);
  };

  return (
    <>
      <div className="tier-container">
        <div 
          className="tier-header"
          onClick={() => onToggleExpand(tier.id)}
        >
          <div className="tier-title-section">
            <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
              ▼
            </span>
            <div className="tier-title-content">
              <span className="tier-date-range">
                {formatDate(tier.start_date)} → {formatDate(tier.end_date)}
              </span>
            </div>
          </div>
          {/* <span className="tier-price">
            Base: ${parseFloat(tier.base_price).toFixed(2)}
          </span> */}
        </div>

        {isExpanded && (
          <RateCardInfo tier={tier} onEdit={() => setShowEditModal(true)} />
        )}
      </div>

      <EditEntityModal
        isOpen={showEditModal}
        title="Edit Tier"
        fields={formFields}
        data={tierForModal}
        onSubmit={handleEditSubmit}
        onDelete={handleDeleteSubmit}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
}