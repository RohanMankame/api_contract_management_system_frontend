import React, { useState } from 'react';
import { EditEntityModal } from './EditEntityModal';

export function SubscriptionTierItem({ tier, isExpanded, onToggleExpand, onEditTier, onDeleteTier }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState(null);

  const formFields = [
    { name: 'min_calls', label: 'Min Calls', type: 'number', required: true },
    { name: 'max_calls', label: 'Max Calls', type: 'number', required: true },
    { name: 'base_price', label: 'Base Price', type: 'number', required: true },
    { name: 'price_per_tier', label: 'Price Per Tier', type: 'number', required: false },
    { name: 'start_date', label: 'Start Date', type: 'date', required: true },
    { name: 'end_date', label: 'End Date', type: 'date', required: false },
  ];

  const handleEditSubmit = async (formData) => {
    try {
      setError(null);
      await onEditTier(tier.id, formData);
      setShowEditModal(false);
    } catch (err) {
      const errorMessage = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err.response?.data?.message || err.message || 'Error updating tier';
      setError(errorMessage);
    }
  };

  const handleDelete = async () => {
    try {
      setError(null);
      await onDeleteTier(tier.id);
      setShowEditModal(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error deleting tier';
      setError(errorMessage);
    }
  };

  const handleCloseModal = () => {
    setError(null);
    setShowEditModal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Helper to convert ISO dates to YYYY-MM-DD for form fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
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
          <span className="tier-price">
           Base: ${parseFloat(tier.base_price).toFixed(2)} | Tier: ${parseFloat(tier.price_per_tier).toFixed(2)}
          </span>
        </div>

        {isExpanded && (
          <div className="tier-content">
            <div className="tier-details">
              <div className="detail-row">
                <span className="label">ID:</span>
                <span className="value">{tier.id}</span>
              </div>
              <div className="detail-row">
                <span className="label">Min Calls:</span>
                <span className="value">{tier.min_calls}</span>
              </div>
              <div className="detail-row">
                <span className="label">Max Calls:</span>
                <span className="value">{tier.max_calls}</span>
              </div>
              <div className="detail-row">
                <span className="label">Base Price:</span>
                <span className="value">${parseFloat(tier.base_price).toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Price Per Tier:</span>
                <span className="value">{tier.price_per_tier ? `$${parseFloat(tier.price_per_tier).toFixed(2)}` : 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Start Date:</span>
                <span className="value">{formatDate(tier.start_date)}</span>
              </div>
              <div className="detail-row">
                <span className="label">End Date:</span>
                <span className="value">{formatDate(tier.end_date)}</span>
              </div>
            </div>

            <div className="tier-actions">
              <button 
                onClick={() => setShowEditModal(true)}
                className="btn-edit-tier"
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </div>

      <EditEntityModal
        isOpen={showEditModal}
        title="Edit Tier"
        fields={formFields}
        data={{
          ...tier,
          start_date: formatDateForInput(tier.start_date),
          end_date: formatDateForInput(tier.end_date)
        }}
        onSubmit={handleEditSubmit}
        onDelete={handleDelete}
        onClose={handleCloseModal}
        error={error}
      />
    </>
  );
}